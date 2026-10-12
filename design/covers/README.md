# Homepage project covers

Decorative artwork for the project list on the home page only. The images contain no text,
numbers or real results; each case-study page (`/work/...`) keeps the genuine screenshots,
notebook figures and dashboards from `public/work/`.

- Source: `build_covers.py` writes the three SVGs (shared palette, grid, frame and disc motif).
- Export: render each SVG at 1600×1000 (2× device scale) in a browser, then
  `cwebp -q 86 -resize 1600 0 <name>.png -o public/covers/<name>.webp`.
- To swap in different artwork, keep the filenames and a 16:10 aspect ratio — the paths are set
  in `src/content/projects.ts` (`thumb`).
