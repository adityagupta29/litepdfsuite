(function () {
  var STYLE_ID = 'ti-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = `
      .ti-trigger {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border);
        background: var(--card); color: var(--fg); font-size: 13px; font-weight: 500;
        cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: inherit;
      }
      .ti-trigger:hover { border-color: var(--accent); color: var(--accent); }
      .ti-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.55);
        display: flex; align-items: center; justify-content: center;
        padding: 24px; z-index: 1000;
        opacity: 0; visibility: hidden; pointer-events: none;
        transition: opacity 0.25s ease, visibility 0.25s;
      }
      .ti-overlay.ti-open { opacity: 1; visibility: visible; pointer-events: auto; }
      .ti-modal {
        background: var(--card); border: 1px solid var(--border); border-radius: 16px;
        max-width: 640px; width: 100%; max-height: 82vh;
        display: flex; flex-direction: column;
        box-shadow: 0 30px 80px rgba(0,0,0,0.35);
        transform: translateY(14px) scale(0.98); transition: transform 0.25s ease;
      }
      .ti-overlay.ti-open .ti-modal { transform: translateY(0) scale(1); }
      .ti-modal-header {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        padding: 20px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0;
      }
      .ti-modal-header h2 {
        font-family: 'Fraunces', serif; font-weight: 700; font-size: 19px; margin: 0;
        letter-spacing: -0.01em;
      }
      .ti-close {
        width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
        background: var(--bg); color: var(--muted); font-size: 15px; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        flex-shrink: 0;
      }
      .ti-close:hover { color: var(--fg); border-color: var(--muted); }
      .ti-modal-body { padding: 22px 24px 30px; overflow-y: auto; }
      .ti-modal-body p { line-height: 1.7; font-size: 14.5px; color: var(--fg); margin: 0 0 16px; }
      .ti-modal-body h3 {
        font-family: 'Fraunces', serif; font-weight: 700; font-size: 15px; margin: 24px 0 10px;
      }
      .ti-modal-body h3:first-child { margin-top: 0; }
      .ti-modal-body ul, .ti-modal-body ol { margin: 0 0 4px; padding-left: 20px; }
      .ti-modal-body li { line-height: 1.65; font-size: 14px; color: var(--muted); margin-bottom: 7px; }
      .ti-modal-body li strong { color: var(--fg); }
      @media (max-width: 640px) {
        .ti-trigger span { display: none; }
        .ti-trigger { padding: 8px 10px; }
      }
    `;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Inject the hiding styles immediately (synchronously, as this script
  // parses in <head>), not on DOMContentLoaded. Otherwise the raw, unstyled
  // modal content briefly flashes on screen while the rest of the body is
  // still being parsed, since the CSS that hides it hasn't been added yet.
  injectStyles();

  function init() {
    document.querySelectorAll('[data-tool-info]').forEach(function (wrap) {
      var btn = wrap.querySelector('.ti-trigger');
      var overlay = wrap.querySelector('.ti-overlay');
      if (!btn || !overlay) return;
      // Move the overlay to <body> so its position:fixed always resolves
      // against the viewport, even if an ancestor header uses backdrop-filter
      // or transform (both create a new containing block for fixed elements).
      document.body.appendChild(overlay);
      var closeBtn = overlay.querySelector('.ti-close');

      function open() { overlay.classList.add('ti-open'); }
      function close() { overlay.classList.remove('ti-open'); }

      btn.addEventListener('click', open);
      if (closeBtn) closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
