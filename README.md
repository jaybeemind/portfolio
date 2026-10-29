# John Berlyn Isip — portfolio

A portfolio for business automation and internal tools development. It leads with
n8n, Python/Django, APIs, and AI-assisted development, backed by JB's production
experience since 2013, enterprise project leadership, architecture work, and mentoring.

## Content

The page is written as a short pitch: a headline, proof, and a way to get in touch.
Copy is kept to a line or two per idea, and the detail opens on request.

- **Hero:** "Manual work in. Running systems out." with an animated flow diagram
  (documents, requests, and ops data in; workflows, integrations, and tools out),
  career stats, and the organizations JB has worked for.
- **Services:** automate, integrate, build. One line each, with links to the proof.
- **Process:** map, build, ship, maintain, plus the AI-assisted development note.
- **Selected work:** four case cards that stack as you scroll (the Django workflow
  platform, the Flutter inventory apps, the grid dashboard, and SSO), each with a
  three-step flow and a one-line result, then the ROOC independent app.
- **Career:** the generated timeline shows role, company, and stack; "What I did"
  opens the bullet points. The Timeline / Play it switch still offers the game.
- **Reference:** a quote from Cesar Vega, who managed JB directly at GoTeam /
  Comtrac, taken from his LinkedIn recommendation (July 2023).
- **Stack, about, and contact:** scrolling tool rows, a short bio, and the email CTA.

No invented performance numbers or delivery guarantees. The ROOC screenshot uses
sample data, and the app requires sign-in; its link is labeled accordingly.

## Motion

Sections reveal as they scroll in, headings rise word by word, and a trace drops
into each section's heading. The backdrop glow shifts to each section's accent,
case cards stack, the career rail fills as you read, and the ROOC screenshot
settles flat. Everything is CSS transitions, SMIL in the hero SVG, and a single
`requestAnimationFrame` scroll handler. No libraries.

Motion follows the reader's reduced-motion setting by default. The **Motion**
button in the nav overrides it and remembers the choice in `localStorage`. With
motion off, content still fades in but nothing travels, loops, or tracks scroll.

### Desk stage

Behind the page, JB works at his desk between two monitors: station A (at the
monitor on the right) and station B (typing at the monitor on the left). Sections
take the stations in turn. While you scroll he works. Once you stop for a moment,
he sips his coffee, then waits a while before the next sip, like a lo-fi stream.
When the section under the reading line changes, he swivels his chair to the
other monitor.
On wide screens, each section's title sits as a lower third on his side, its
content sits in his eyeline, and the section's 3D object floats in front of the
monitor he faces until the content scrolls up to it.

Every clip in `img/desk/` starts and ends on its station's rest frame, so any
clip can follow any other at a station: work, sip, or the turn to the other side.
The work loops also pass through the rest frame a few times (`EXITS` in
`script.js`), and a turn or a sip cuts in at the next one. A sip in progress
plays faster until it is back at rest. Nothing dissolves, so every change of
clip is a plain cut on identical frames.
The footage was generated in Google Flow, each shot from a rest frame to a rest
frame, then cut to 1080p. Its first and last frames are morphed along the optical
flow (not cross-faded) onto one shared rest frame per station, so the clips chain
without a jump and nothing moving in them turns into a double image. Every frame
gets a light skin touch-up that evens out spots and keeps the skin's texture.
They load after the page, one at a time. With motion off or Save-Data on, the
stills switch instead.
`CLIPS` in `script.js` lists them per station; an empty name means there is no
footage for it, and that clip is skipped.

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
| `script.js` | Navigation, motion, career data, screenshot viewer, and game |

## Updating career history

Edit the `experiences` array in `script.js`, then run:

```sh
npm run sync:experience
npm run check:experience
node --check script.js
```

The generated HTML keeps the full history available without JavaScript. The
same data renders the interactive game. Navigation also works without scripting;
the game is only offered when scripting is available.

The sync and screenshot capture scripts live in a local-only `tools/` folder
that is not part of this repository. Keep credentials in the ignored
`.env.local`; do not include it in deployment assets.
