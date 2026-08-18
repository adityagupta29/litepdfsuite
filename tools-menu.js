/*
  Shared "Tools" dropdown menu, injected into every page.
  To add a new tool site-wide: add one entry to TOOLS below.
  Every page that has <div class="tm-mount" data-tools-menu></div>
  in its header (and loads this script) picks up the change automatically.
*/
(function () {
  const TOOLS = [
    { href: 'add-page-number-pdf', icon: 'fa-hashtag', color: 't1', name: 'Add Page Numbers', desc: 'Visually add custom page numbers — position, font, size, and format.' },
    { href: 'merge-rearrange-pdf', icon: 'fa-layer-group', color: 't2', name: 'Merge & Rearrange', desc: 'Upload multiple PDFs and visually rearrange pages by drag-and-drop.' },
    { href: 'pdf-editor', icon: 'fa-pen-to-square', color: 't3', name: 'PDF Editor', desc: 'Add text, images, shapes, highlights, and freehand annotations.' },
    { href: 'pdf-converter', icon: 'fa-right-left', color: 't4', name: 'PDF Converter', desc: 'Convert PDFs to Word, Excel, PowerPoint, images, and back.' },
    { href: 'split-pdf', icon: 'fa-scissors', color: 't5', name: 'Split PDF', desc: 'Extract pages, split into ranges, or break into individual pages.' },
    { href: 'rotate-pdf', icon: 'fa-rotate', color: 't6', name: 'Rotate PDF', desc: 'Fix sideways or upside-down scans, page by page or the whole file.' },
    { href: 'compress-pdf', icon: 'fa-compress', color: 't7', name: 'Compress PDF', desc: 'Shrink large PDFs to a quality preset or an exact target size in KB.' },
    { href: 'photo-resizer', icon: 'fa-id-card', color: 't8', name: 'Photo & Signature Resizer', desc: 'Crop and resize to exact exam-form specs and file-size caps.' },
    { href: 'watermark-pdf', icon: 'fa-stamp', color: 't9', name: 'Watermark PDF', desc: 'Stamp a text or image watermark with full placement control.' },
    { href: 'extract-pdf', icon: 'fa-file-export', color: 't10', name: 'Extract Text & Images', desc: 'Pull plain text as .txt, or grab every embedded image as PNGs.' },
    { href: 'esign-pdf', icon: 'fa-signature', color: 't11', name: 'e-Sign PDF', desc: 'Draw, type, or upload your signature and place it on the page.' },
    { href: 'crop-pdf', icon: 'fa-crop-simple', color: 't12', name: 'Crop PDF', desc: 'Drag a crop box to trim scanner borders or unwanted margins.' },
    { href: 'compare-pdf', icon: 'fa-code-compare', color: 't13', name: 'Compare PDFs', desc: 'Spot exactly what changed between two versions, line by line.' },
    { href: 'grayscale-pdf', icon: 'fa-droplet-slash', color: 't14', name: 'Grayscale PDF', desc: 'Convert a color PDF to true black & white to cut printing costs.' },
    { href: 'ocr-pdf', icon: 'fa-glasses', color: 't15', name: 'OCR PDF', desc: 'Make scanned PDFs searchable and copyable, or extract the text.' },
    { href: 'protect-pdf', icon: 'fa-lock', color: 't16', name: 'Protect & Unlock PDF', desc: 'Add real AES password protection, or remove a known password.' },
  ];

  const GRADIENTS = {
    t1: ['#3b82f6', '#1d4ed8'], t2: ['#10b981', '#047857'], t3: ['#f59e0b', '#b45309'], t4: ['#8b5cf6', '#6d28d9'],
    t5: ['#e11d48', '#be123c'], t6: ['#0891b2', '#0e7490'], t7: ['#4f46e5', '#4338ca'], t8: ['#c026d3', '#a21caf'],
    t9: ['#ea580c', '#c2410c'], t10: ['#65a30d', '#4d7c0f'], t11: ['#0284c7', '#0369a1'], t12: ['#475569', '#334155'],
    t13: ['#ca8a04', '#a16207'], t14: ['#78716c', '#57534e'], t15: ['#7c3aed', '#6d28d9'], t16: ['#dc2626', '#b91c1c'],
  };

  function injectStyles() {
    if (document.getElementById('tm-styles')) return;
    const gradientCSS = Object.keys(GRADIENTS).map((key) => {
      const [a, b] = GRADIENTS[key];
      return `.tm-icon.${key}{background:linear-gradient(135deg,${a},${b})}`;
    }).join('');

    const style = document.createElement('style');
    style.id = 'tm-styles';
    style.textContent = `
      .tm-mount { display: contents; }
      .tm-dropdown { position: relative; display: inline-flex; }
      .tm-trigger {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border);
        background: var(--card); color: var(--fg); font-size: 13px; font-weight: 500;
        text-decoration: none; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        font-family: inherit;
      }
      .tm-trigger:hover { border-color: var(--accent); color: var(--accent); }
      .tm-caret { font-size: 10px; transition: transform 0.2s ease; }
      .tm-dropdown.tm-open .tm-caret { transform: rotate(180deg); }
      @media (hover: hover) and (pointer: fine) and (min-width: 901px) {
        .tm-dropdown:hover .tm-caret { transform: rotate(180deg); }
      }
      .tm-menu {
        position: absolute; top: calc(100% + 12px); left: 0;
        width: max-content; max-width: 92vw;
        background: var(--card); border: 1px solid var(--border); border-radius: 16px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        padding: 14px;
        opacity: 0; visibility: hidden; pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
        transform: translateY(6px);
        z-index: 500;
      }
      [data-theme="dark"] .tm-menu { box-shadow: 0 24px 60px rgba(0,0,0,0.55); }
      .tm-menu::before { content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px; }
      .tm-dropdown.tm-open .tm-menu {
        opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0);
      }
      /* Hover-to-open only above the same breakpoint the rest of the
         mobile layout uses, and only for devices with real hover (mouse).
         The width check matters because a mouse-driven browser window
         narrowed for testing still reports true hover support, so
         (hover:hover) alone doesn't catch "testing at a phone-sized
         window on a desktop." Touch devices fire a synthetic hover on tap
         that ends the instant the finger lifts, closing the menu before a
         second tap can land on an item inside it, so both cases rely on
         the click-toggle handler instead. */
      @media (hover: hover) and (pointer: fine) and (min-width: 901px) {
        .tm-dropdown:hover .tm-menu {
          opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0);
        }
      }
      .tm-grid {
        display: grid; grid-auto-flow: column; grid-template-rows: repeat(6, auto);
        grid-auto-columns: 270px; row-gap: 2px; column-gap: 22px;
      }
      .tm-item {
        display: flex; align-items: flex-start; gap: 14px; padding: 10px 12px; border-radius: 12px;
        color: var(--fg); text-decoration: none; transition: background 0.15s; min-width: 0;
      }
      .tm-item:hover { background: var(--card-2); }
      .tm-icon {
        width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center;
        font-size: 17px; color: #fff; flex-shrink: 0; margin-top: 1px;
      }
      .tm-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; padding-top: 2px; }
      .tm-label { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .tm-sub { font-size: 12px; font-weight: 400; line-height: 1.4; color: var(--muted); }
      ${gradientCSS}
      @media (max-width: 900px) {
        .tm-menu {
          position: fixed !important; left: 12px !important; right: 12px !important; top: auto !important; bottom: 12px !important;
          width: auto; max-width: none; max-height: 72vh; overflow-y: auto;
        }
        .tm-grid {
          grid-auto-flow: row; grid-template-rows: none; grid-auto-columns: unset;
          grid-template-columns: 1fr; row-gap: 4px; column-gap: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildMenuHTML() {
    const onHome = /(^|\/)(index\.html)?$/.test(location.pathname);
    const homeHref = onHome ? '#tools' : '/#tools';
    const items = TOOLS.map((t) => `
      <a href="${t.href}" class="tm-item">
        <span class="tm-icon ${t.color}"><i class="fa-solid ${t.icon}"></i></span>
        <span class="tm-text">
          <span class="tm-label">${t.name}</span>
          <span class="tm-sub">${t.desc}</span>
        </span>
      </a>`).join('');
    return `
      <div class="tm-dropdown">
        <a href="${homeHref}" class="tm-trigger">PDF Suite <i class="fa-solid fa-chevron-down tm-caret"></i></a>
        <div class="tm-menu"><div class="tm-grid">${items}</div></div>
      </div>`;
  }

  function positionMenu(dropdown) {
    const trigger = dropdown.querySelector('.tm-trigger');
    const menu = dropdown.querySelector('.tm-menu');
    if (!trigger || !menu) return;
    const dRect = dropdown.getBoundingClientRect();
    const tRect = trigger.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const viewportW = document.documentElement.clientWidth;
    let desiredLeft = tRect.left + tRect.width / 2 - menuWidth / 2;
    desiredLeft = Math.max(8, Math.min(desiredLeft, viewportW - menuWidth - 8));
    menu.style.left = (desiredLeft - dRect.left) + 'px';
  }

  function closeAllMenus() {
    document.querySelectorAll('.tm-dropdown.tm-open').forEach((d) => d.classList.remove('tm-open'));
  }

  function init() {
    const mounts = document.querySelectorAll('[data-tools-menu]');
    if (!mounts.length) return;
    injectStyles();
    const html = buildMenuHTML();
    mounts.forEach((mount) => {
      mount.innerHTML = html;
      const dropdown = mount.querySelector('.tm-dropdown');
      const trigger = dropdown && dropdown.querySelector('.tm-trigger');
      if (!dropdown || !trigger) return;
      dropdown.addEventListener('mouseenter', () => positionMenu(dropdown));
      // Hover opens the menu on desktop, but touch devices never fire
      // hover, so clicking/tapping the trigger toggles it directly too.
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('tm-open');
        closeAllMenus();
        if (!isOpen) {
          positionMenu(dropdown);
          dropdown.classList.add('tm-open');
        }
      });
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tm-dropdown')) closeAllMenus();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllMenus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
