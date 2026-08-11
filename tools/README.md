# tools

Build-time helpers. Nothing here ships with the site — `index.html`, `styles.css`, and
`script.js` remain dependency-free.

## capture-rooc.mjs

Captures ROOC Guild Management screenshots into `img/rooc/` for the case study.

### Setup

```bash
npm i playwright-core sharp
```

`playwright-core` drives the system Edge install, so no browser is downloaded. `sharp` is
optional — with it, shots become ~34KB WebP instead of ~500KB PNG.

### Before the first run — fill in ANONYMIZE.text

The dashboard is worth showing precisely because it's full of data, so the script **substitutes
invented data** rather than blurring. Blurred rectangles prove nothing; a dashboard with
plausible sample data shows the product working.

Open the script and fill in `ANONYMIZE.text` with every real string that appears on a captured
screen:

```js
text: {
  Uncrowned:      "Nightforge",   // guild name
  MachineGunPstr: "ShadowPike",   // the signed-in Super Admin
  Lansulot:       "Valkyrra",     // leadership panel
  COMATOZZE:      "Ironmaw",
},
```

Replacement covers text nodes, `title`, `aria-label`, `alt`, and `placeholder`. Matches are
anchored on word boundaries, so a rule for `81` won't corrupt a reward count of `281`. Keys are
applied longest-first, so a handle containing another handle still resolves correctly. Anything
that looks like an email address is swapped for a dummy address automatically, and single-letter
avatar bubbles are realigned to the substituted name's initial.

`ANONYMIZE.numbers` optionally rewrites roster figures — not personal data, but it does reveal a
real guild's size. Set it to `null` to keep the real numbers.

`ANONYMIZE.blur` still blurs avatar *imagery*, which can't be substituted.

### Run

Set the credentials in your own shell, then run it. They are read from the environment, passed
straight into the page, and never written to disk or logged:

```bash
ROOC_USER=you@example.com ROOC_PASS='your-password' node tools/capture-rooc.mjs
```

PowerShell:

```powershell
$env:ROOC_USER='you@example.com'; $env:ROOC_PASS='your-password'; node tools/capture-rooc.mjs
```

It signs in, captures the dashboard first, then every other `#/route` in the app's own
navigation. Files are named after their route — `dashboard.webp`, `auction-runs.webp`,
`members.webp` — so the markup can reference them before they exist.

### The safety check

After substitution, the script scans the rendered page for every key in `ANONYMIZE.text`. **If a
real name survived, the run fails and no file is written.** That catches a screen you forgot
about — but it only knows about names you listed.

**So: review every image before committing.** A handle you never added to the map goes out
exactly as it is, and the check has no way to know. The per-shot output reports how many
substitutions were made; a count of `0` on a screen full of member data means the map missed.

### Adding shots to the page

Figures are already wired up in the ROOC case study for `dashboard.webp`, `auction-runs.webp`,
and `sign-in.webp`. **A figure whose image is missing hides itself** (see the `.case-shot`
handler in `script.js`), so uncaptured shots never render as broken images — they simply appear
once the file exists.

For any additional route, copy an existing `<figure class="case-shot">` inside `.case-shots`,
then:

- point `src` and `href` at the new file
- write a real `alt` describing what the screen shows
- write a `figcaption` saying what the screen *proves* — the design decision it demonstrates,
  not a description of the UI
- keep `width`/`height` at the real dimensions (1280x800 after WebP conversion) so the browser
  reserves space and the page doesn't shift as images load

Any figure showing substituted data should say so, as the dashboard caption does.
