# John Berlyn Isip — portfolio

A portfolio for senior full-stack development and consulting work. It leads with
JB's role, location, and career since 2013, then connects his strengths to specific
projects and employment history.

## Content

- **Introduction:** role, location, core work, and links to projects and email.
- **Strengths:** systems integration, delivery through production, and teamwork.
- **Selected work:** four professional case studies and the ROOC independent app.
  Each identifies the contribution, technical decision, and result. No invented
  performance numbers or delivery guarantees.
- **Career history:** all nine roles, with the optional career game retained.
- **Skills:** current work, production experience, and working knowledge.
- **Working style, about, and contact:** short explanations and direct links.

The existing portfolio is the source for career and project claims. The ROOC
screenshot uses sample data. The app requires sign-in; its link is labeled accordingly.

## Stack and preview

Static HTML, CSS, and vanilla JavaScript. The shipped site has no runtime
dependencies and requires no build. Serve this directory locally:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Content, metadata, and readable career history |
| `styles.css` | Responsive design, print styles, and career game |
| `script.js` | Navigation, career data, screenshot viewer, and game |
| `tools/sync-experience.mjs` | Keeps the HTML history aligned with career data |

## Updating career history

Edit the `experiences` array in `script.js`, then run:

```sh
npm run sync:experience
npm run check:experience
node --check script.js
```

The generated HTML keeps the full history available without JavaScript. The
same data renders the interactive game. Navigation also works without scripting;
the game is only offered when scripting is available. Motion respects the reader's
reduced-motion preference.

Screenshot capture tooling is documented in `tools/README.md`. Keep credentials
in the ignored `.env.local`; do not include it in deployment assets.
