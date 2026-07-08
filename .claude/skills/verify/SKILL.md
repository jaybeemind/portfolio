---
name: verify
description: Verify changes to this static portfolio site by driving it in a headless browser
---

# Verifying the portfolio site

Static site — no build step. Open `file:///c:/dev/portfolio/index.html` directly; no server needed (Google Fonts may fail offline, harmless).

## Handle

No Playwright browsers are cached on this machine. Use `playwright-core` (no browser download) with the system Edge:

```js
import { chromium } from "playwright-core"
const browser = await chromium.launch({ channel: "msedge", headless: true })
```

Install `playwright-core` in the session scratchpad, not the repo.

## Flows worth driving

- **Career Journey game** (`#experience-scene`): scroll it into view first — the game loop only runs while the scene is on screen (IntersectionObserver). Click empty sky to focus the scene (Space/ArrowUp jumps only work when focused; W works whenever the loop runs). Walk with ArrowRight held ~9s to visit all 9 buildings → HUD `#hud-progress` should reach "ROLES 9/9", `.experience-toast` appears, 9 `.building-flag` stars. Click a building to auto-walk. Person state is readable from `#experience-person` inline `left`/`transform` plus `#experience-world` transform (personX = left + cameraX).
- **Nav/reveal**: sections use IntersectionObserver `.reveal` → `.visible`.

## Gotchas

- Movement/jump keys are ignored while the scene is offscreen (by design) — scroll to the section before sending keys.
- Cache-busting query strings on `styles.css`/`script.js` in index.html should be bumped when those files change.
