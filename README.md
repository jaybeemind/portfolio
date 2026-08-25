# portfolio

Portfolio of John Berlyn Isip (JB), a senior full-stack developer with 12+ years of experience.

The site is positioned around **the work I can be hired for**, not around a CV. The hero claims speed;
the section directly beneath it (`#ai`) has to earn that claim, which is why it leads with the
vibe-coding contrast rather than sitting further down the page. After that: five named services
(operations platforms, real-time dashboards, integrations and SSO, legacy migrations, automation), how
an engagement is shaped, and the case studies backing each service, each written as _problem → the
real constraint → what I built → outcome_. Method, career history, stack, and bio sit below as supporting
credibility.

## Stack

Static HTML, CSS, and vanilla JS. No frameworks, no build step, no dependencies. Open
`index.html` directly, or serve the folder:

```bash
python -m http.server 4173
```

## Structure

| File | Contents |
| --- | --- |
| `index.html` | All page content and structure |
| `styles.css` | Design tokens, layout, and the career-game scene |
| `script.js` | Nav, scroll reveal, career timeline, and the optional side-scroller |

The career history lives in one array in `script.js`. It renders both the readable timeline and
the optional game, so the two can't drift apart. Edit it in one place.
