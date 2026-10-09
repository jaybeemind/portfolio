# John Berlyn Isip — portfolio

A portfolio for business automation and internal tools development. It leads with
n8n, Python/Django, APIs, and AI-assisted development, backed by JB's production
experience since 2013, enterprise project leadership, architecture work, and mentoring.

## Content

- **Introduction:** role, location, core work, and links to projects and email.
- **Services:** workflow automation, systems integration, and custom internal tools.
- **Selected work:** four professional case studies (the Django workflow platform,
  the Flutter inventory apps, the grid dashboard, and SSO) and the ROOC independent
  app. Each has a three-step flow and identifies the contribution, technical
  decision, and result. No invented performance numbers or delivery guarantees.
- **Career history:** six entries grouped as on the resume, plus education and
  credentials. A Timeline / Play it switch offers the optional "automation line"
  career game, drawn in the site's own palette.
- **Skills:** current work, production experience, and working knowledge.
- **Working style, about, and contact:** short explanations and direct links.

The existing portfolio is the source for career and project claims. The ROOC
screenshot uses sample data. The app requires sign-in; its link is labeled accordingly.
AI experience is described as AI-assisted development using Codex, Claude Code, and
GitHub Copilot, plus AI-supported document processing in the current platform work.

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
