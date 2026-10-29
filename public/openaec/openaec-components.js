/* OpenAEC UI 0.4: behaviour the CSS cannot do on its own. Optional: without this
 * file every component still works, only Escape does not hide a tooltip.
 * Use: <script src="openaec-components.js" defer></script>
 *
 * Escape hides the tooltip of the focused or hovered element (issue #7, WCAG 1.4.13)
 * until the focus or the pointer leaves it. The first Escape only hides the
 * tooltip; the next one reaches the page, for example to close a dialog. */
(() => {
  const SHOWN = "[data-oa-tip]:hover, [data-oa-tip]:focus-visible";
  const hidden = new Set();

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const owners = [...document.querySelectorAll(SHOWN)];
    // A focused row shows the tips of its shortened cells.
    const focused = document.activeElement;
    if (focused && focused.matches(":focus-visible") && focused.querySelector(":scope > [data-oa-tip]")) owners.push(focused);
    const fresh = owners.filter((owner) => !owner.hasAttribute("data-oa-tip-hidden"));
    if (!fresh.length) return;
    for (const owner of fresh) {
      owner.setAttribute("data-oa-tip-hidden", "");
      hidden.add(owner);
    }
    event.stopPropagation();
    event.preventDefault();
  }, true);

  const reset = (event) => {
    for (const owner of hidden) {
      if (owner === event.target || owner.contains(event.target)) {
        owner.removeAttribute("data-oa-tip-hidden");
        hidden.delete(owner);
      }
    }
  };
  document.addEventListener("focusout", reset);
  document.addEventListener("pointerleave", reset, true);
})();
