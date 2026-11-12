//! In-app updater (Windows, per-user install).
//!
//! `install_update(url)`:
//!   1. accepts ONLY a `…_x64_user-setup.exe` asset from this project's GitHub releases,
//!   2. downloads it to %TEMP% (progress is streamed to the UI through a Channel),
//!   3. verifies the Authenticode signature (Valid + signer "Impertio Studio B.V."),
//!   4. starts a detached helper that runs the installer silently (`/S`), then relaunches the app,
//!   5. exits this process so the installer can replace the files.
//!
//! Anything else (system-wide install, other platforms) returns an error and the UI falls back to
//! opening the download in the browser.

use serde::Serialize;
use tauri::ipc::Channel;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum UpdateEvent {
  Progress { downloaded: u64, total: u64 },
  Verifying,
  Installing,
}

const ALLOWED_PREFIX: &str = "https://github.com/OpenAEC-Foundation/Open-Field-Studio/releases/download/";
const ALLOWED_SIGNER: &str = "Impertio Studio B.V.";

#[tauri::command]
pub async fn install_update(
  app: tauri::AppHandle,
  url: String,
  on_event: Channel<UpdateEvent>,
) -> Result<(), String> {
  #[cfg(not(windows))]
  {
    let _ = (&app, &url, &on_event);
    return Err("automatic update is only supported on Windows".into());
  }

  #[cfg(windows)]
  {
    windows_impl::run(app, url, on_event).await
  }
}

#[cfg(windows)]
mod windows_impl {
  use super::*;
  use std::io::Write;
  use std::os::windows::process::CommandExt;
  use std::process::Command;
  use tauri_plugin_http::reqwest;

  const CREATE_NO_WINDOW: u32 = 0x0800_0000;
  const CREATE_NEW_PROCESS_GROUP: u32 = 0x0000_0200;

  pub async fn run(
    app: tauri::AppHandle,
    url: String,
    on_event: Channel<UpdateEvent>,
  ) -> Result<(), String> {
    // 1. Strict URL allow-list: our own release assets, per-user installer only.
    if !url.starts_with(ALLOWED_PREFIX) || !url.ends_with("_x64_user-setup.exe") || url.contains("..") {
      return Err("update URL is not an official release installer".into());
    }

    // Only per-user installs can be updated silently without elevation.
    let exe = std::env::current_exe().map_err(|e| format!("cannot locate app: {e}"))?;
    let local = std::env::var("LOCALAPPDATA").map_err(|_| "LOCALAPPDATA not set".to_string())?;
    if !exe.to_string_lossy().to_lowercase().starts_with(&local.to_lowercase()) {
      return Err("app is installed system-wide; update manually".into());
    }

    // 2. Download with progress.
    let file_name = url.rsplit('/').next().unwrap_or("ofs-update.exe").to_string();
    let dir = std::env::temp_dir().join("ofs-update");
    std::fs::create_dir_all(&dir).map_err(|e| format!("temp dir: {e}"))?;
    let installer = dir.join(&file_name);
    let _ = std::fs::remove_file(&installer);

    let client = reqwest::Client::builder()
      .user_agent(concat!("OpenFieldStudio-Updater/", env!("CARGO_PKG_VERSION")))
      .build()
      .map_err(|e| format!("http client: {e}"))?;
    let mut resp = client.get(&url).send().await.map_err(|e| format!("download failed: {e}"))?;
    if !resp.status().is_success() {
      return Err(format!("download failed: HTTP {}", resp.status()));
    }
    let total = resp.content_length().unwrap_or(0);
    let mut file = std::fs::File::create(&installer).map_err(|e| format!("create file: {e}"))?;
    let mut downloaded: u64 = 0;
    let mut last_sent: u64 = 0;
    while let Some(chunk) = resp.chunk().await.map_err(|e| format!("download interrupted: {e}"))? {
      file.write_all(&chunk).map_err(|e| format!("write file: {e}"))?;
      downloaded += chunk.len() as u64;
      if downloaded - last_sent >= 128 * 1024 || (total > 0 && downloaded == total) {
        last_sent = downloaded;
        let _ = on_event.send(UpdateEvent::Progress { downloaded, total });
      }
    }
    file.flush().map_err(|e| format!("flush: {e}"))?;
    drop(file);
    if total > 0 && downloaded != total {
      let _ = std::fs::remove_file(&installer);
      return Err("download incomplete".into());
    }
    let _ = on_event.send(UpdateEvent::Progress { downloaded, total: downloaded.max(total) });

    // 3. Verify the Authenticode signature before running anything.
    let _ = on_event.send(UpdateEvent::Verifying);
    let script = format!(
      "$s = Get-AuthenticodeSignature -LiteralPath $env:OFS_UPD_PATH; \
       if ($s.Status -eq 'Valid' -and $s.SignerCertificate.Subject -like '*{ALLOWED_SIGNER}*') {{ exit 0 }} else {{ exit 3 }}"
    );
    let verified = Command::new("powershell")
      .args(["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", &script])
      .env("OFS_UPD_PATH", &installer)
      .creation_flags(CREATE_NO_WINDOW)
      .status()
      .map_err(|e| format!("signature check could not run: {e}"))?;
    if !verified.success() {
      let _ = std::fs::remove_file(&installer);
      return Err("installer signature is not valid; update aborted".into());
    }

    // 4. Detached helper: silent install, then relaunch. Outlives this process.
    let _ = on_event.send(UpdateEvent::Installing);
    let inst = installer.to_string_lossy().to_string();
    let exe_s = exe.to_string_lossy().to_string();
    Command::new("cmd")
      .raw_arg(format!(r#"/C "start "" /wait "{inst}" /S & start "" "{exe_s}"""#))
      .creation_flags(CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP)
      .spawn()
      .map_err(|e| format!("cannot start installer: {e}"))?;

    // 5. Leave so the installer can replace our files.
    tauri::async_runtime::spawn(async move {
      tokio_sleep().await;
      app.exit(0);
    });
    Ok(())
  }

  async fn tokio_sleep() {
    // tauri re-exports no timer; use a blocking sleep on a worker thread to stay dependency-free.
    let _ = tauri::async_runtime::spawn_blocking(|| std::thread::sleep(std::time::Duration::from_millis(700))).await;
  }
}
