# Lite PDF Suite

**A free, private, browser-based PDF toolkit. No uploads, no accounts, no watermarks.**

🔗 **Live site: [litepdfsuite.com](https://litepdfsuite.com/)**

## Why this exists

Most online PDF tools make you upload your file to a server before they'll do anything with it, then push you toward a paid plan the moment you hit a page limit or need a second tool. That's a bad deal for something as simple as adding page numbers or merging two files, and it's a genuine problem when the document is a contract, an ID scan, or an exam form.

Lite PDF Suite runs **entirely in your browser**. Every tool uses client-side JavaScript (`pdf-lib`, `pdf.js`, and a few focused WASM libraries) to read and write your PDF locally. Your file is never sent anywhere. There's nothing to sign up for, nothing to pay for, and no cap on how many times you can use it.

The goal is simple: give people a genuinely free, trustworthy set of PDF tools, and keep it open so anyone can see exactly how it works, use it as-is, or build on it.

## Tools

16 tools, all free, all client-side:

| Tool | What it does |
|---|---|
| **Add Page Numbers** | Position, font, size, and format control over page numbering |
| **Merge & Rearrange** | Combine multiple PDFs and drag-and-drop pages into any order |
| **PDF Editor** | Add text, images, shapes, highlights, and freehand annotations |
| **PDF Converter** | Convert PDFs to/from Word, Excel, PowerPoint, and images |
| **Split PDF** | Extract pages, split by custom ranges, or explode into individual pages |
| **Rotate PDF** | Fix sideways or upside-down pages, per-page or whole document |
| **Compress PDF** | Quality presets or an exact target file size in KB |
| **Photo & Signature Resizer** | Crop/resize to exact exam-form pixel and file-size specs |
| **Watermark PDF** | Text or image watermark with full placement control |
| **Extract Text & Images** | Pull plain text as `.txt` or every embedded image as PNG |
| **e-Sign PDF** | Draw, type, or upload a signature and place it on the page |
| **Crop PDF** | Trim scanner borders or unwanted margins with a visual crop box |
| **Compare PDFs** | Line-by-line diff between two versions of a document |
| **Grayscale PDF** | Convert to true black & white to cut printing costs |
| **OCR PDF** | Make scanned PDFs searchable, or extract the text |
| **Protect & Unlock PDF** | Real AES password protection, or remove a known password |

## Tech stack

This is a static site. No backend, no build step, no framework.

- **Plain HTML/CSS/JS** — every page is self-contained
- [`pdf-lib`](https://pdf-lib.js.org/) — reading and writing PDF documents
- [`pdf.js`](https://mozilla.github.io/pdf.js/) — rendering pages for preview
- [`JSZip`](https://stuk.github.io/jszip/) — bundling multi-file outputs
- [`tesseract.js`](https://tesseract.projectnaptha.com/) — OCR
- [`@neslinesli93/qpdf-wasm`](https://www.npmjs.com/package/@neslinesli93/qpdf-wasm) — real AES encryption/decryption (the actual QPDF engine, compiled to WebAssembly)
- All loaded from CDN, no `npm install` required to run it

## Running it locally

Clone the repo and serve the folder with any static file server (you can't just double-click `index.html` for every tool, since a couple of them fetch resources that require `http://` rather than `file://`):

```bash
git clone https://github.com/adityagupta29/litepdfsuite.git
cd litepdfsuite
npx http-server -p 8080
```

Then open `http://localhost:8080` in your browser. That's the whole setup.

## Contributing

Contributions are genuinely welcome, whether that's fixing a bug, improving a tool's UI, or adding a new one.

1. **Fork the repo** and create a branch off `main`.
2. Make your change. If you're adding or editing a tool, keep these conventions in mind:
   - Every tool must stay **100% client-side**. No server calls, ever. That's the core promise of this project.
   - New tool pages follow the naming pattern `<verb>-pdf.html` (e.g. `split-pdf.html`) or `pdf-<noun>.html` (e.g. `pdf-editor.html`).
   - The tools dropdown menu, the shared "Tool Info" popup, and the site's design tokens are all driven by [`tools-menu.js`](tools-menu.js) and [`tool-info.js`](tool-info.js) — add your tool to the `TOOLS` array in `tools-menu.js` and it shows up in the navbar on every page automatically. No copy-pasting menu markup across files.
   - Match the existing look: [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings, [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for body text, light/dark theme via `data-theme` and CSS custom properties.
3. Test your change in an actual browser before opening a PR (upload a real file, run the tool, check the output). This is a client-side tool, so "it looks right in the code" isn't the same as "it works."
4. Open a pull request describing what changed and why.

Found a bug or have an idea for a new tool? [Open an issue](https://github.com/adityagupta29/litepdfsuite/issues) — that's just as useful as a PR.

## Privacy

Every tool processes your file locally in your browser. Nothing is uploaded to a server, logged, or stored anywhere. You can verify this yourself: open your browser's network tab while using any tool and confirm your document never leaves your device.

## License

[MIT](LICENSE) — use it, fork it, build on it, no permission needed.
