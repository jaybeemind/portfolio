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
Around each change of section, the scroll steers his chair and the camera to the
other monitor: scroll on and he swings across, scroll back and he swings back, as
fast as you go. Stop partway and he settles on the side of the section you are
reading.
On wide screens, each section's title sits as a lower third on his side, its
content sits in his eyeline, and the section's 3D object floats in front of the
monitor he faces until the content scrolls up to it.

Every clip in `img/desk/` starts and ends on its station's rest frame, so any
clip can follow any other at a station: work, sip, or the turn to the other side.
Station B has two typing actions (`CLIPS.b.more`), and he moves between them at
rest. The second was generated to hold still for a beat at both ends, so its joins
fall on still frames.
A turn dissolves straight out of the work loop as the scroll reaches it. Once his
hand is on the way to the mug, the sip plays out faster instead, so no arm fades
out. Each turn also comes reversed (`-rev`), so swinging back is the same footage
played the other way, picked up at the same frame.
The footage was generated in Google Flow, each shot from a rest frame to a rest
frame, then cut to 1080p with its first and last frames blended onto one shared
rest frame per station, so the clips chain without a jump. The blends follow the
optical flow, whole regions only, so whatever is still moving slides into place
instead of showing twice, and fingers and faces keep their shape. The takes lose
detail as they play, so every frame is brought back to the rest frame's sharpness,
and each gets a light skin touch-up that evens out spots and keeps the skin's
texture. The clips load after the page, one at a time, each fetched whole so it can
be sought anywhere. With motion off or Save-Data on, the stills switch instead.
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
