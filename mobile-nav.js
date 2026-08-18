/*
  Generic mobile drawer controller for tool pages.
  Any element marked <aside data-mobile-panel> becomes a slide-in drawer
  on tablet/phone screens (see mobile.css). This script injects the
  floating button that opens it, a backdrop, and a close button inside
  each panel, then wires up open/close on tap, backdrop click, and Escape.
*/
(function () {
  function init() {
    var panels = document.querySelectorAll('[data-mobile-drawer]');
    if (!panels.length) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'mp-backdrop';
    document.body.appendChild(backdrop);

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'mp-fab';
    fab.setAttribute('aria-label', 'Open options panel');
    fab.innerHTML = '<i class="fa-solid fa-sliders"></i>';
    document.body.appendChild(fab);

    panels.forEach(function (panel) {
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'mp-close';
      close.setAttribute('aria-label', 'Close panel');
      close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      panel.prepend(close);
      close.addEventListener('click', closePanels);
    });

    fab.addEventListener('click', function () {
      panels.forEach(function (p) { p.classList.add('mp-open'); });
      backdrop.classList.add('mp-open');
    });
    backdrop.addEventListener('click', closePanels);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanels();
    });

    function closePanels() {
      panels.forEach(function (p) { p.classList.remove('mp-open'); });
      backdrop.classList.remove('mp-open');
    }
  }

  /*
    Thumbnail grid pages (split, rotate, compress, grayscale, ocr) show
    every page of the document as a small card. On the short mobile
    preview strip that grid needs a way to zoom in/out so it stays usable
    without excessive scrolling. Pages that already ship their own size
    slider (merge-rearrange-pdf.html) are left alone.
  */
  function initGridZoom() {
    var grid = document.querySelector('.page-grid');
    if (!grid || document.getElementById('sizeRange')) return;
    var header = grid.parentElement && grid.parentElement.querySelector('.canvas-header, .stage-header');
    if (!header) return;

    var wrap = document.createElement('div');
    wrap.className = 'mz-zoom';
    wrap.innerHTML =
      '<button type="button" class="mz-btn" id="mzOut" aria-label="Zoom out"><i class="fa-solid fa-magnifying-glass-minus"></i></button>' +
      '<input type="range" id="mzRange" min="80" max="220" step="10" value="120">' +
      '<button type="button" class="mz-btn" id="mzIn" aria-label="Zoom in"><i class="fa-solid fa-magnifying-glass-plus"></i></button>';
    header.appendChild(wrap);

    var range = wrap.querySelector('#mzRange');
    function apply(v) {
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + v + 'px, 1fr))';
    }
    apply(range.value);
    range.addEventListener('input', function () { apply(range.value); });
    wrap.querySelector('#mzOut').addEventListener('click', function () {
      range.value = Math.max(80, parseInt(range.value, 10) - 20);
      apply(range.value);
    });
    wrap.querySelector('#mzIn').addEventListener('click', function () {
      range.value = Math.min(220, parseInt(range.value, 10) + 20);
      apply(range.value);
    });
  }

  /*
    Pages using the stacked mobile layout (preview strip above a full-width
    controls panel, see mobile.css) get a drag handle between the two, so
    the default preview height isn't the only option, if someone wants
    more room to see the page/thumbnails than the default gives them.
  */
  function initResizeHandle() {
    var panel = document.querySelector('[data-mobile-panel]');
    if (!panel) return;
    var workspace = panel.closest('main.workspace');
    var canvas = workspace && workspace.querySelector('.canvas-area');
    if (!workspace || !canvas) return;

    var handle = document.createElement('div');
    handle.className = 'mp-resize-handle';
    handle.innerHTML = '<span></span>';
    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-label', 'Drag to resize the preview');
    workspace.insertBefore(handle, panel);

    var dragging = false, startY = 0, startH = 0;
    var minH = 120, maxH = Math.round(window.innerHeight * 0.8);

    handle.addEventListener('pointerdown', function (e) {
      dragging = true;
      startY = e.clientY;
      startH = canvas.getBoundingClientRect().height;
      maxH = Math.round(window.innerHeight * 0.8);
      handle.classList.add('active');
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var newH = Math.min(maxH, Math.max(minH, startH + (e.clientY - startY)));
      // mobile.css marks height/min/max-height !important so a drag-set
      // inline style needs the same priority to actually win.
      canvas.style.setProperty('height', newH + 'px', 'important');
      canvas.style.setProperty('max-height', newH + 'px', 'important');
      canvas.style.setProperty('min-height', newH + 'px', 'important');
    });
    function stopDrag() { dragging = false; handle.classList.remove('active'); }
    handle.addEventListener('pointerup', stopDrag);
    handle.addEventListener('pointercancel', stopDrag);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); initGridZoom(); initResizeHandle(); });
  } else {
    init();
    initGridZoom();
    initResizeHandle();
  }
})();
