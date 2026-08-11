/**
 * Capture ROOC Guild Management screenshots for the portfolio case study.
 *
 *   ROOC_USER=you@example.com ROOC_PASS='...' node tools/capture-rooc.mjs
 *
 * Credentials are read from the environment and go straight into the page.
 * They are never written to disk, never logged, and no session state is
 * persisted — the browser context is discarded when the run ends.
 *
 * Everything matching REDACT is blurred *in the live DOM before the shutter
 * fires*, so unredacted pixels never reach a file. Review every image in
 * img/rooc/ before committing: this is a blunt instrument and it cannot know
 * about a field it has no selector for.
 *
 * Requires playwright-core and system Edge (no browser download):
 *   npm i playwright-core
 */

import { chromium } from "playwright-core"
import { mkdir, readdir, stat, unlink } from "node:fs/promises"
import path from "node:path"

const ORIGIN = "https://rooc-guild-management-web.jaybee-isip.workers.dev"
const OUT_DIR = path.resolve("img/rooc")
const VIEWPORT = { width: 1440, height: 900 }

const USER = process.env.ROOC_USER
const PASS = process.env.ROOC_PASS

if (!USER || !PASS) {
  console.error(
    "Set ROOC_USER and ROOC_PASS in your environment first.\n" +
      "  PowerShell:  $env:ROOC_USER='you@example.com'; $env:ROOC_PASS='...'\n" +
      "  bash:        export ROOC_USER=you@example.com ROOC_PASS='...'",
  )
  process.exit(1)
}

/**
 * Anything personally identifying gets blurred before capture.
 *
 * Add selectors here as you spot things — the attribute matches below are
 * guesses at this app's markup, and a miss means real data in a public image.
 */
const REDACT = [
  // Avatars and profile imagery
  "img[src*='avatar']",
  "img[alt*='avatar' i]",
  "[class*='avatar' i]",
  "[class*='profile-photo' i]",
  // Names, handles, accounts
  "[class*='member-name' i]",
  "[class*='player-name' i]",
  "[class*='user-name' i]",
  "[class*='username' i]",
  "[class*='display-name' i]",
  "[data-testid*='name' i]",
  // Contact details
  "[class*='email' i]",
  "[href^='mailto:']",
]

/**
 * Blur every match by writing to the element's own style object.
 *
 * The app serves a strict `style-src 'self'` CSP, so an injected <style> tag is
 * refused outright. Direct CSSOM writes are not subject to that, which makes
 * this the redaction path that actually survives — it is not a fallback.
 * Also sweeps any text node that merely looks like an email address.
 */
const REDACT_IN_PAGE = (selectors) => {
  const hide = (el) => {
    if (!el || !el.style) return
    el.style.setProperty("filter", "blur(7px)", "important")
    el.style.setProperty("user-select", "none", "important")
  }

  selectors.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach(hide)
    } catch {
      /* ignore a selector this browser won't parse */
    }
  })

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const re = /[\w.+-]+@[\w-]+\.[\w.]+/
  let n
  const hits = []
  while ((n = walker.nextNode())) {
    if (re.test(n.nodeValue || "")) hits.push(n.parentElement)
  }
  hits.forEach(hide)

  return { blurred: document.querySelectorAll("[style*='blur']").length }
}

/** Freeze animations the same way, for the same CSP reason. */
const STABILIZE_IN_PAGE = () => {
  document.querySelectorAll("*").forEach((el) => {
    if (!el.style) return
    el.style.setProperty("animation-duration", "0s", "important")
    el.style.setProperty("transition-duration", "0s", "important")
    el.style.setProperty("caret-color", "transparent", "important")
  })
}

const slug = (s) =>
  s
    .replace(/^#\/?/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "home"

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.evaluate(STABILIZE_IN_PAGE).catch(() => {})
  const result = await page.evaluate(REDACT_IN_PAGE, REDACT).catch(() => ({ blurred: 0 }))
  // Let the blur filters actually paint before the shutter fires.
  await page.waitForTimeout(500)
  return result
}

/**
 * Screenshots land as ~500KB PNGs, which is far too heavy for a portfolio page.
 * Convert to WebP when sharp is installed (roughly 15x smaller) and drop the
 * PNG; without sharp the PNG is kept so a run still produces something usable.
 */
let sharp = null
try {
  ;({ default: sharp } = await import("sharp"))
} catch {
  console.warn("sharp not installed — keeping full-size PNGs (`npm i sharp` to shrink them)\n")
}

async function shoot(page, name) {
  const { blurred } = await settle(page)
  const png = path.join(OUT_DIR, `${name}.png`)
  await page.screenshot({ path: png })

  let out = png
  if (sharp) {
    const webp = path.join(OUT_DIR, `${name}.webp`)
    await sharp(png).resize({ width: 1280 }).webp({ quality: 82 }).toFile(webp)
    await unlink(png)
    out = webp
  }

  const { size } = await stat(out)
  console.log(`  ${path.relative(process.cwd(), out)} — ${Math.round(size / 1024)}KB, ${blurred} element(s) blurred`)
}

const browser = await chromium.launch({ channel: "msedge", headless: true })
// The app serves a strict CSP; bypassing it in this throwaway automation
// context is what lets the redaction styles apply at all.
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, bypassCSP: true })
const page = await context.newPage()

try {
  await mkdir(OUT_DIR, { recursive: true })

  // ---- Public landing / sign-in page (no credentials involved) ----
  console.log("landing page")
  await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle", timeout: 45000 })
  await shoot(page, "00-sign-in")

  // ---- Sign in ----
  console.log("signing in as", USER.replace(/(.).*(@.*)/, "$1***$2"))
  await page.fill("input[type='email'], input[name*='email' i]", USER)
  await page.fill("input[type='password'], input[name*='password' i]", PASS)
  await Promise.all([
    page.waitForLoadState("networkidle").catch(() => {}),
    page.click("button[type='submit'], button:has-text('Sign in')"),
  ])
  await page.waitForTimeout(2500)

  if (/sign in to your guild/i.test(await page.innerText("body").catch(() => ""))) {
    throw new Error("Still on the sign-in page — check ROOC_USER / ROOC_PASS.")
  }
  console.log("signed in ->", page.url())

  // ---- Enumerate the app's own navigation and shoot each destination ----
  const routes = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll("a[href*='#/']")].map((a) => "#" + a.getAttribute("href").split("#")[1]))].filter(
      Boolean,
    ),
  )
  console.log("routes found:", routes.length ? routes.join(", ") : "(none — capturing current view only)")

  let i = 1
  const seen = new Set()
  for (const route of routes.length ? routes : [""]) {
    const name = `${String(i).padStart(2, "0")}-${slug(route)}`
    if (seen.has(name)) continue
    seen.add(name)
    console.log(route || "(current)")
    if (route) {
      await page.goto(`${ORIGIN}/${route}`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {})
      await page.waitForTimeout(1200)
    }
    await shoot(page, name)
    i++
  }

  const files = await readdir(OUT_DIR)
  console.log(`\nDone. ${files.length} image(s) in img/rooc/`)
  console.log("REVIEW EVERY IMAGE before committing — add missed selectors to REDACT and re-run.")
} finally {
  await context.close()
  await browser.close()
}
