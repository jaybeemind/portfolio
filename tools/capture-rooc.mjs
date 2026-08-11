/**
 * Capture ROOC Guild Management screenshots for the portfolio case study.
 *
 *   ROOC_USER=you@example.com ROOC_PASS='...' node tools/capture-rooc.mjs
 *
 * Credentials are read from the environment and go straight into the page.
 * They are never written to disk, never logged, and no session state is
 * persisted — the browser context is discarded when the run ends.
 *
 * Real guild data is replaced with invented data *in the live DOM before the
 * shutter fires*, so real names never reach a file. Substitution rather than
 * blur, because on a dashboard the data is the thing worth showing — a wall of
 * blurred rectangles proves nothing.
 *
 * Fill in ANONYMIZE.text below before the first run. Nothing else knows which
 * strings are real.
 *
 * Requires playwright-core and system Edge (no browser download):
 *   npm i playwright-core sharp
 */

import { chromium } from "playwright-core"
import { mkdir, stat, unlink, readFile } from "node:fs/promises"
import path from "node:path"

const ORIGIN = "https://rooc-guild-management-web.jaybee-isip.workers.dev"
const OUT_DIR = path.resolve("img/rooc")
const ENV_FILE = path.resolve(".env.local")
const VIEWPORT = { width: 1440, height: 900 }

/**
 * Credentials come from the environment, or from a gitignored .env.local.
 *
 * The file exists because getting shell syntax exactly right is the step that
 * actually fails: bash's `VAR=x node …` prefix is not valid in PowerShell, and
 * `$env:` vars set in one terminal don't reach a process started in another.
 * A two-line file has nothing to get wrong.
 */
async function loadCredentials() {
  if (process.env.ROOC_USER && process.env.ROOC_PASS) {
    return { user: process.env.ROOC_USER, pass: process.env.ROOC_PASS, from: "environment" }
  }

  try {
    const raw = await readFile(ENV_FILE, "utf8")
    const vars = {}
    raw.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i)
      if (!match) return
      // Strip one layer of matching quotes, so both raw and quoted values work.
      vars[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2")
    })
    if (vars.ROOC_USER && vars.ROOC_PASS) {
      return { user: vars.ROOC_USER, pass: vars.ROOC_PASS, from: ".env.local" }
    }
  } catch {
    /* no .env.local — fall through to the instructions below */
  }

  return null
}

const creds = await loadCredentials()

if (!creds) {
  console.error(
    "No credentials found.\n\n" +
      "Easiest: copy tools/.env.local.example to .env.local in the repo root and\n" +
      "fill in the two values. It is gitignored and never committed.\n\n" +
      "  ROOC_USER=you@example.com\n" +
      "  ROOC_PASS=your-password\n\n" +
      "Then just:  node tools/capture-rooc.mjs\n\n" +
      "Or set them in the environment instead — note the syntax differs by shell:\n" +
      "  PowerShell:  $env:ROOC_USER='you@example.com'; $env:ROOC_PASS='...'; node tools/capture-rooc.mjs\n" +
      "  bash:        ROOC_USER=you@example.com ROOC_PASS='...' node tools/capture-rooc.mjs\n" +
      "(The bash form is a parse error in PowerShell — that is the usual cause of this message.)",
  )
  process.exit(1)
}

const USER = creds.user
const PASS = creds.pass
console.log(`credentials loaded from ${creds.from}\n`)

/**
 * ── FILL THIS IN ──────────────────────────────────────────────────────────
 *
 * Every key is replaced with its value wherever it appears — text, titles,
 * aria-labels, alt text. Keys are matched longest-first so a handle that
 * contains another handle still resolves correctly.
 *
 * Add every real member handle that appears on any captured screen, plus the
 * guild name. Anything not listed here goes out exactly as it is.
 */
const ANONYMIZE = {
  text: {
    // Guild identity
    Uncrowned: "Nightforge",
    // Accounts and handles — extend this with every name on screen
    MachineGunPstr: "ShadowPike",
    Lansulot: "Valkyrra",
    COMATOZZE: "Ironmaw",
  },

  /**
   * Roster figures. Optional — these aren't personal data, but they do reveal
   * the size of a real guild. Set to null to leave the real numbers alone.
   */
  numbers: {
    "79": "64",
    "81": "70",
    "98%": "91%",
  },

  /** Imagery that can't be substituted gets blurred instead. */
  blur: ["img[src*='avatar']", "img[alt*='avatar' i]", "[class*='avatar' i] img", "[class*='profile-photo' i]"],
}

/**
 * Names that must never survive into an image. Checked after substitution;
 * a hit fails the run rather than writing a file. Keep in sync with the keys
 * above — this is the check that catches a screen you forgot about.
 */
const MUST_NOT_APPEAR = Object.keys(ANONYMIZE.text)

const ANONYMIZE_IN_PAGE = (config) => {
  const { text, numbers, blur } = config
  // Longest keys first: replacing "Lans" before "Lansulot" would corrupt it.
  const pairs = Object.entries({ ...text, ...(numbers || {}) }).sort((a, b) => b[0].length - a[0].length)

  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  /**
   * Anchored on word boundaries, or "81" would rewrite the 81 inside a reward
   * count of 281 and produce a screenshot with quietly wrong numbers. Lookarounds
   * rather than \b, so keys ending in a symbol ("98%") still anchor correctly.
   */
  const matchers = pairs.map(([real, fake]) => [
    new RegExp(`(?<![\\w])${escape(real)}(?![\\w])`, "g"),
    fake,
  ])

  const swap = (value) => {
    let out = value
    for (const [re, fake] of matchers) out = out.replace(re, fake)
    return out
  }

  let replaced = 0

  // Text nodes
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const nodes = []
  let n
  while ((n = walker.nextNode())) nodes.push(n)
  nodes.forEach((node) => {
    const next = swap(node.nodeValue || "")
    if (next !== node.nodeValue) {
      node.nodeValue = next
      replaced++
    }
  })

  // Attributes that surface as visible text or get read out
  document.querySelectorAll("[title], [aria-label], [alt], [placeholder]").forEach((el) => {
    ;["title", "aria-label", "alt", "placeholder"].forEach((attr) => {
      const v = el.getAttribute(attr)
      if (!v) return
      const next = swap(v)
      if (next !== v) {
        el.setAttribute(attr, next)
        replaced++
      }
    })
  })

  // Anything still showing an email address
  const emailRe = /[\w.+-]+@[\w-]+\.[\w.]+/g
  const walker2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while ((n = walker2.nextNode())) {
    if (emailRe.test(n.nodeValue || "")) {
      n.nodeValue = n.nodeValue.replace(emailRe, "officer@nightforge.example")
      replaced++
    }
    emailRe.lastIndex = 0
  }

  // Single-letter avatar bubbles derive from a name; realign them so an
  // "L" bubble doesn't sit next to a substituted name starting with V.
  document.querySelectorAll("*").forEach((el) => {
    if (el.children.length) return
    const t = (el.textContent || "").trim()
    if (t.length !== 1 || !/[A-Z]/.test(t)) return
    const label = el.parentElement && el.parentElement.textContent.trim().replace(/^.\s*/, "")
    const initial = label && label.match(/[A-Za-z]/)
    if (initial && initial[0].toUpperCase() !== t) el.textContent = initial[0].toUpperCase()
  })

  let blurred = 0
  blur.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => {
        if (!el.style) return
        el.style.setProperty("filter", "blur(8px)", "important")
        blurred++
      })
    } catch {
      /* ignore a selector this browser won't parse */
    }
  })

  return { replaced, blurred }
}

/**
 * Freeze animations by writing to each element's own style object. The app
 * serves a strict `style-src 'self'` CSP that refuses injected <style> tags,
 * so this is the path that works, not a fallback.
 */
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

let sharp = null
try {
  ;({ default: sharp } = await import("sharp"))
} catch {
  console.warn("sharp not installed — keeping full-size PNGs (`npm i sharp` to shrink them)\n")
}

async function shoot(page, name, { anonymize = true } = {}) {
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.evaluate(STABILIZE_IN_PAGE).catch(() => {})

  let stats = { replaced: 0, blurred: 0 }
  if (anonymize) {
    stats = await page.evaluate(ANONYMIZE_IN_PAGE, ANONYMIZE).catch(() => stats)

    // Refuse to write a file that still contains a real name.
    const body = await page.innerText("body").catch(() => "")
    const leaked = MUST_NOT_APPEAR.filter((real) => body.includes(real))
    if (leaked.length) {
      throw new Error(
        `Real data survived substitution on "${name}": ${leaked.join(", ")}.\n` +
          `Nothing was written. This usually means the text sits in a canvas, an <img>, or a shadow root.`,
      )
    }
  }

  await page.waitForTimeout(400)

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
  console.log(
    `  ${path.relative(process.cwd(), out)} — ${Math.round(size / 1024)}KB, ` +
      `${stats.replaced} substitution(s), ${stats.blurred} blurred`,
  )
}

const browser = await chromium.launch({ channel: "msedge", headless: true })
// The app serves a strict CSP; bypassing it in this throwaway automation
// context is what lets the blur styles apply at all.
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, bypassCSP: true })
const page = await context.newPage()

try {
  await mkdir(OUT_DIR, { recursive: true })

  // ---- Public sign-in page (no credentials, no real data on it) ----
  console.log("sign-in page")
  await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle", timeout: 45000 })
  await shoot(page, "sign-in", { anonymize: false })

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

  // ---- Dashboard first, then everything else in the app's own navigation ----
  const discovered = await page.evaluate(() =>
    [
      ...new Set(
        [...document.querySelectorAll("a[href*='#/']")].map((a) => "#" + a.getAttribute("href").split("#")[1]),
      ),
    ].filter(Boolean),
  )
  const routes = ["#/dashboard", ...discovered.filter((r) => r !== "#/dashboard")]
  console.log("routes:", routes.join(", "))

  for (const route of routes) {
    console.log(route)
    await page.goto(`${ORIGIN}/${route}`, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {})
    await page.waitForTimeout(1500)
    await shoot(page, slug(route))
  }

  console.log("\nDone — files are named after their route, e.g. dashboard.webp.")
  console.log("Review every image before committing; substitution only covers names you listed.")
} finally {
  await context.close()
  await browser.close()
}
