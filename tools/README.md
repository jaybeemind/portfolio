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

### Run

Set the credentials in your own shell, then run it. They are read from the environment,
passed straight into the page, and never written to disk or logged:

```bash
ROOC_USER=you@example.com ROOC_PASS='your-password' node tools/capture-rooc.mjs
```

PowerShell:

```powershell
$env:ROOC_USER='you@example.com'; $env:ROOC_PASS='your-password'; node tools/capture-rooc.mjs
```

The script signs in, reads the app's own navigation to find every `#/route`, and captures each
one at 1440x900.

### Redaction — read this before committing anything

Every selector in the `REDACT` array is blurred **in the live DOM before the shutter fires**, so
unredacted pixels never reach a file. Any text that looks like an email address is swept
separately, wherever it sits.

That list is a set of educated guesses at this app's markup. It cannot know about a field it has
no selector for.

**Review every image in `img/rooc/` before committing.** If a member name, handle, or account
survived, add its selector to `REDACT` and re-run. The output line for each shot reports how many
elements were blurred — a count of `0` on a screen full of member data means the selectors missed.

### Adding shots to the page

Each captured file needs a `<figure class="case-shot">` inside the `.case-shots` block in the ROOC
case study in `index.html`. Copy the existing sign-in figure, then:

- point `src` and `href` at the new file
- write a real `alt` describing what the screen shows
- write a `figcaption` saying what the screen *proves* — the design decision it demonstrates,
  not a description of the UI

Set `width`/`height` to the image's real dimensions (1280x800 after WebP conversion) so the
browser reserves space and the page doesn't shift as images load.
