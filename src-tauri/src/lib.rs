use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Set window icon for taskbar/alt-tab (desktop only)
      #[cfg(desktop)]
      if let Some(window) = app.get_webview_window("main") {
        let icon = tauri::image::Image::from_bytes(include_bytes!("../icons/icon.png"))?;
        window.set_icon(icon)?;
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
