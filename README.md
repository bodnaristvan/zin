# 'zin

A small tool for turning your photos into a printable zine. Upload images,
reorder them, set how each one fits the page (fit / fill), rotate, add captions, and print a fold-ready booklet.

Built with React + Vite + TypeScript.

## Develop

```bash
npm install
npm run dev      # start the dev server
```

## Build

```bash
npm run build    # outputs a single self-contained file: dist/index.html
```

Thanks to `vite-plugin-singlefile`, the build inlines all JS, CSS, and assets
into one `dist/index.html`. You can open that file directly in a browser, host
it anywhere, or pass it around — no server or build step needed to run it.

## Offline

The built `dist/index.html` works **offline** — just open it in a browser.

The only external request is the **VT323** Google Font. Offline (or if Google
Fonts is blocked) the app simply falls back to a monospace system font;
everything else still works. To remove the dependency entirely, self-host the
font via `@font-face` and drop the `<link>` in `index.html`.

## Privacy

**Everything happens locally, in your browser.** Image uploads, thumbnail
generation, reordering, and print layout are all done client-side. Nothing is
ever sent to a server — there is no backend, and your photos never leave your
device.
