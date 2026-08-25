# portfolio

Portfolio of John Berlyn Isip (JB), a senior full-stack developer with 12+ years of experience.

The site is positioned around **the work I can be hired for**, not around a CV. It opens with five
named services (operations platforms, real-time dashboards, integrations and SSO, legacy migrations,
automation), then how an engagement is shaped, then the case studies that back each service — each
written as _problem → the real constraint → what I built → outcome_. The method, the AI practice,
and the career history sit below that as supporting credibility.

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
the optional game, so the two can't drift apart — edit it in one place.
