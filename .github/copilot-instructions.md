# Repository instructions for Copilot

## Project overview
- This repository is a small, static personal portfolio site.
- The site is implemented with plain HTML, CSS, and vanilla JavaScript only. There is no framework, bundler, package manager, or build step.
- The main files are in the repository root:
  - `index.html` for page structure and content
  - `styles.css` for all styling
  - `script.js` for all client-side behavior

## How to work efficiently in this repo
- Prefer surgical edits to the existing root files instead of introducing new tooling, dependencies, or build configuration.
- Keep the site dependency-free unless the user explicitly asks for a new dependency or framework.
- Preserve the existing style:
  - semantic HTML sections with stable `id` values used by navigation
  - CSS custom properties for theme values
  - vanilla JS inside the existing strict-mode IIFE in `script.js`
  - small DOM helpers such as `qs` and `qsa`

## Key code layout
- `index.html` contains all sections of the one-page site, including the fixed navigation, hero, skills, experience timeline, projects, contact, and footer.
- `styles.css` is the single stylesheet. It is dark-mode first, mobile-first, and uses CSS variables throughout.
- `script.js` handles:
  - fixed-nav scroll state
  - mobile navigation toggle
  - scroll reveal behavior
  - active nav link highlighting
  - the interactive experience timeline (`#experience-scene`, `#experience-world`, `#experience-person`, `#experience-details`)

## Validation
- There is currently no automated build, lint, or test setup in this repository. Do not assume `npm`, `pnpm`, or other scripted workflows exist.
- For content, styling, or behavior changes, validate manually by opening `index.html` in a browser and checking the affected area.
- If you change navigation or interaction code, verify:
  - mobile menu toggle still works and updates `aria-expanded`
  - section links still scroll to the correct section IDs
  - the experience timeline still responds to keyboard and on-screen controls
  - the footer year still renders from JavaScript
- For documentation or configuration-only changes, verify the file path and markdown contents directly.

## Repo-specific gotchas
- `index.html` references static assets with cache-busting query strings (`styles.css?v=...` and `script.js?v=...`). If you change either asset, update the version string in `index.html`.
- Trust these instructions first and only search further when they are incomplete or inconsistent with the current files.
