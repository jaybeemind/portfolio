# portfolio

Portfolio of John Berlyn Isip (JB), a senior full-stack developer with 12+ years of experience.

The site leads with **problem solving** — five case studies written as
_problem → the real constraint → what I built → outcome_ — followed by the method behind them,
how AI fits into the delivery loop, and the full career history.

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
