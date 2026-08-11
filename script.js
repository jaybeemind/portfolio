/* ============================================================
   PORTFOLIO – script.js
   Vanilla JS: fixed nav, mobile menu, scroll reveal,
   career timeline + optional side-scrolling career game
   ============================================================ */

;(function () {
  "use strict"

  // ---------------------- Helpers ----------------------

  /** Query a single element */
  const qs = (selector, root = document) => root.querySelector(selector)
  /** Query all elements */
  const qsa = (selector, root = document) => root.querySelectorAll(selector)

  // ---------------------- Dynamic year ----------------------
  const yearEl = qs("#year")
  if (yearEl) yearEl.textContent = new Date().getFullYear()

  // ---------------------- Nav: scrolled state ----------------------
  const navHeader = qs("#nav-header")

  function updateNavScrolled() {
    if (!navHeader) return
    if (window.scrollY > 20) {
      navHeader.classList.add("scrolled")
    } else {
      navHeader.classList.remove("scrolled")
    }
  }

  window.addEventListener("scroll", updateNavScrolled, { passive: true })
  updateNavScrolled() // run once on load

  // ---------------------- Nav: mobile menu toggle ----------------------
  const navToggle = qs("#nav-toggle")
  const navLinks = qs("#nav-links")

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open")
      navToggle.classList.toggle("open", isOpen)
      navToggle.setAttribute("aria-expanded", String(isOpen))
    })

    // Close menu when a nav link is clicked
    qsa(".nav-link", navLinks).forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open")
        navToggle.classList.remove("open")
        navToggle.setAttribute("aria-expanded", "false")
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navHeader.contains(e.target)) {
        navLinks.classList.remove("open")
        navToggle.classList.remove("open")
        navToggle.setAttribute("aria-expanded", "false")
      }
    })
  }

  // ---------------------- Scroll Reveal ----------------------
  /**
   * Uses IntersectionObserver to add the "visible" class to .reveal elements
   * when they enter the viewport. Falls back gracefully if the API is absent.
   */
  const revealEls = qsa(".reveal")

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            // Once revealed, stop observing
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12, // trigger when 12% of the element is visible
        rootMargin: "0px 0px -40px 0px", // slight bottom offset so elements near bottom reveal properly
      },
    )

    revealEls.forEach((el) => observer.observe(el))

    // Safety net: if the observer never fires at all — a prerendered or
    // never-composited page will do this — the whole site would sit at
    // opacity 0. Reveal everything rather than show a blank page.
    window.setTimeout(() => {
      const anyRevealed = Array.prototype.some.call(revealEls, (el) => el.classList.contains("visible"))
      if (!anyRevealed) revealEls.forEach((el) => el.classList.add("visible"))
    }, 1500)
  } else {
    // Fallback: immediately show all reveal elements
    revealEls.forEach((el) => el.classList.add("visible"))
  }

  // ---------------------- Active nav link on scroll ----------------------
  /**
   * Highlights the nav link that corresponds to the currently visible section.
   */
  const sections = qsa("section[id]")
  const navLinkEls = qsa(".nav-link")

  function setActiveLink() {
    let currentId = ""

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top
      // Consider section "active" if its top is within the upper portion of viewport
      if (top <= window.innerHeight * 0.35) {
        currentId = section.id
      }
    })

    navLinkEls.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", setActiveLink, { passive: true })
  setActiveLink()

  // ============================================================
  //  CAREER HISTORY
  //  Single source of truth for both the readable timeline and
  //  the optional side-scrolling game. Newest role first.
  // ============================================================
  const experiences = [
    {
      buildingLabel: "NGCP",
      role: "Resource Optimization and Market Interface Lead Specialist",
      company: "National Grid Corporation of the Philippines",
      dates: "July 2024 - Present",
      points: [
        "Lead process improvement initiatives ensuring ISO compliance.",
        "Develop and enhance internal applications to streamline business workflows.",
        "Implement upgrades to the Software Development Lifecycle focusing on QA and DevOps.",
        "Utilize AI tools like n8n and GitHub Copilot to automate repetitive work and accelerate delivery.",
      ],
      stack: [
        "Python",
        "Django 5",
        "JavaScript",
        "Node.js",
        "SvelteKit",
        "Oracle DB",
        "MySQL",
        "Business Process Analysis",
        "HTML/CSS",
      ],
    },
    {
      buildingLabel: "Realtair",
      role: "Senior Software Engineer",
      company: "Realtair, Inc. (Remote)",
      dates: "Oct 2023 - Apr 2024",
      points: [
        "Developed and maintained features for the Deposits app.",
        "Collaborated with stakeholders and support teams to keep the product stable.",
        "Reviewed and optimized AWS SNS, SQS, EC2, and RDS configurations.",
      ],
      stack: ["C#", ".NET MVC", "React.js", "TypeScript", "AWS", "MSSQL", "CI/CD", "Git"],
    },
    {
      buildingLabel: "GoTeam",
      role: "Senior Full-Stack Developer",
      company: "GoTeam (Remote)",
      dates: "Feb 2023 - Sep 2023",
      points: [
        "Maintained and improved Comtrac's Investigation Management platform.",
        "Contributed to application architecture using the CQRS design pattern.",
      ],
      stack: ["Vue.js 3", "Composition API", "C# .NET", "Azure", "CI/CD", "Git"],
    },
    {
      buildingLabel: "Theoria",
      role: "Senior Full-Stack Developer",
      company: "Theoria Medical (Remote, USA)",
      dates: "Sep 2022 - Feb 2023",
      points: [
        "Developed and maintained internal healthcare management apps.",
        "Mentored mid-level and junior developers.",
        "Implemented scalable front-end solutions using modern libraries.",
      ],
      stack: ["React.js", "TypeScript", "MongoDB", "GraphQL", "Jira", "Git", "Tailwind CSS"],
    },
    {
      buildingLabel: "NGCP",
      role: "Resource Optimization and Market Interface Division Lead Specialist",
      company: "National Grid Corporation of the Philippines",
      dates: "Nov 2020 - Sep 2022",
      points: [
        "Migrated and modernized legacy business systems.",
        "Led development of Project Sentinel and the 5-Min Real-time Dashboard.",
      ],
      stack: ["Laravel", "Vue.js 2", "Node.js", "Oracle DB", "MongoDB", "SCADA", "Bootstrap"],
    },
    {
      buildingLabel: "NGCP",
      role: "Information Standards Senior Specialist",
      company: "National Grid Corporation of the Philippines",
      dates: "Jan 2016 - Nov 2020",
      points: [
        "Led multiple enterprise software projects including Single Sign-On and Market Data Interchange.",
        "Oversaw the full SDLC of micro-apps and background job automation.",
      ],
      stack: ["Laravel", "Node.js", "Vue.js", "Oracle DB", "MongoDB", "Bootstrap"],
    },
    {
      buildingLabel: "Teradata",
      role: "Technical Consultant",
      company: "Teradata",
      dates: "Jun 2015 - Sep 2015",
      points: [
        "Customized marketing operations applications for major enterprise clients.",
        "Implemented enhancements using C# and JavaScript.",
      ],
      stack: ["C#", "JavaScript"],
    },
    {
      buildingLabel: "COA",
      role: "Computer Programmer II",
      company: "Commission on Audit",
      dates: "Dec 2013 - May 2015",
      points: ["Developed internal systems including COA Data Warehouse and Asset Monitoring tools."],
      stack: ["C#", ".NET MVC", "MSSQL", "AngularJS", "Bootstrap"],
    },
    {
      buildingLabel: "NGCP",
      role: "Web Developer",
      company: "National Grid Corporation of the Philippines",
      dates: "Jun 2013 - Nov 2013",
      points: ["Developed and deployed the Central Receiving and Monitoring Center App."],
      stack: ["C#", ".NET", "MSSQL", "jQuery", "Bootstrap"],
    },
  ]

  // ---------------------- Experience: readable timeline ----------------------
  /**
   * The primary, always-available view of the career history. Rendered from the
   * same data the game uses so the two can never drift apart.
   */
  function renderTimeline() {
    const timelineEl = qs("#experience-timeline")
    if (!timelineEl) return

    const fragment = document.createDocumentFragment()

    experiences.forEach((job) => {
      const item = document.createElement("li")
      item.className = "timeline-item"

      const dates = document.createElement("p")
      dates.className = "timeline-dates"
      dates.textContent = job.dates

      const role = document.createElement("h3")
      role.className = "timeline-role"
      role.textContent = job.role

      const company = document.createElement("p")
      company.className = "timeline-company"
      company.textContent = job.company

      const points = document.createElement("ul")
      points.className = "timeline-points"
      job.points.forEach((point) => {
        const li = document.createElement("li")
        li.textContent = point
        points.appendChild(li)
      })

      const stack = document.createElement("div")
      stack.className = "timeline-stack"
      job.stack.forEach((skill) => {
        const chip = document.createElement("span")
        chip.className = "experience-chip"
        chip.textContent = skill
        stack.appendChild(chip)
      })

      item.append(dates, role, company, points, stack)
      fragment.appendChild(item)
    })

    timelineEl.innerHTML = ""
    timelineEl.appendChild(fragment)
  }

  renderTimeline()

  // ---------------------- Experience: optional career game ----------------------
  /**
   * Builds and runs the side-scrolling career scene. Called lazily the first time
   * the player opens it — the scene needs a measurable width, which it doesn't
   * have while the container is still hidden.
   */
  function initCareerGame() {
    const sceneEl = qs("#experience-scene")
    const worldEl = qs("#experience-world")
    const personEl = qs("#experience-person")
    const detailsEl = qs("#experience-details")
    const pointsEl = qs("#experience-points")
    const stackEl = qs("#experience-stack")
    const roleEl = qs(".experience-role", detailsEl || document)
    const companyEl = qs(".experience-company", detailsEl || document)
    const datesEl = qs(".experience-dates", detailsEl || document)
    const moveLeftBtn = qs("#move-left")
    const moveRightBtn = qs("#move-right")
    const moveJumpBtn = qs("#move-jump")
    const skylineEl = qs(".experience-skyline")
    const hudEl = qs("#experience-hud")
    const hudProgressEl = qs("#hud-progress")
    const hudCoinsEl = qs("#hud-coins")

    if (!(sceneEl && worldEl && personEl && detailsEl && pointsEl && stackEl && roleEl && companyEl && datesEl)) {
      return
    }

    const layout = {
      startX: 170,
      spacing: 210,
      width: 126,
      baseHeight: 148,
    }

    const heights = [210, 188, 175, 196, 228, 240, 160, 172, 150]
    const keyState = { left: false, right: false }
    const touchState = { left: false, right: false }
    const world = {
      sceneWidth: 0,
      width: 0,
      personX: 92,
      personY: 0,
      velocityY: 0,
      facing: 1,
      autoTarget: null,
      cameraX: 0,
      speed: 240,
      gravity: 1500,
      jumpImpulse: 560,
      lastTime: 0,
      activeIndex: -1,
      buildingNodes: [],
      items: [],
      visited: new Set(),
      completed: false,
      coins: 0,
      qblocks: [],
      flagpole: null,
    }

    let rafId = null

    function renderExperienceWorld() {
      const fragment = document.createDocumentFragment()

      world.items = experiences.map((job, index) => {
        const building = document.createElement("article")
        const variant = index % 2 === 0 ? "variant-brick" : "variant-metal"
        building.className = `experience-building ${variant}`

        const label = document.createElement("div")
        label.className = "building-label"

        const sign = document.createElement("div")
        sign.className = "building-sign"
        sign.textContent = job.buildingLabel

        const years = document.createElement("div")
        years.className = "building-years"
        years.textContent = job.dates

        const x = layout.startX + index * layout.spacing
        const height = heights[index % heights.length]
        building.style.left = `${x}px`
        building.style.width = `${layout.width}px`
        building.style.height = `${height}px`

        label.append(sign, years)
        building.append(label)
        building.title = `Walk to ${job.buildingLabel}`
        building.addEventListener("click", () => {
          walkTo(x + layout.width / 2 - 20)
        })
        fragment.appendChild(building)

        return {
          ...job,
          x,
          width: layout.width,
          height,
          center: x + layout.width / 2,
          node: building,
        }
      })

      // Decorative pipes in the gaps between buildings
      const pipes = [
        { gapAfter: 1, height: 58 },
        { gapAfter: 4, height: 74 },
        { gapAfter: 7, height: 64 },
      ]
      pipes.forEach((pipe) => {
        const node = document.createElement("div")
        node.className = "experience-pipe"
        node.style.left = `${layout.startX + pipe.gapAfter * layout.spacing + layout.width + 14}px`
        node.style.height = `${pipe.height}px`
        fragment.appendChild(node)
      })

      // Bumpable ? blocks (world x of each block's center)
      world.qblocks = [112, 338, 968, 1598].map((center) => {
        const node = document.createElement("div")
        node.className = "experience-qblock"
        node.textContent = "?"
        node.style.left = `${center - 17}px`
        fragment.appendChild(node)
        return { center, node, used: false }
      })

      // Flagpole past the last building marks the end of the journey
      const pole = document.createElement("div")
      pole.className = "experience-flagpole"
      pole.innerHTML = '<span class="flagpole-ball"></span><span class="flagpole-flag"></span>'
      pole.style.left = `${layout.startX + (experiences.length - 1) * layout.spacing + layout.width + 36}px`
      fragment.appendChild(pole)
      world.flagpole = pole

      worldEl.innerHTML = ""
      worldEl.appendChild(fragment)
      world.buildingNodes = world.items.map((item) => item.node)
    }

    function setDetails(job) {
      if (!job) {
        roleEl.textContent = "Walk to a building"
        companyEl.textContent = "Move close to any building to inspect the role, dates, responsibilities, and stack."
        datesEl.textContent = "Latest roles are placed on the left."
        pointsEl.innerHTML = [
          "<li>Tip: hold the movement buttons on mobile for continuous walking.</li>",
          "<li>Keyboard: ← / → or A / D to walk, W or Space to jump.</li>",
          "<li>Tap any building to walk straight to it and collect its star.</li>",
        ].join("")
        stackEl.innerHTML = ""
        return
      }

      roleEl.textContent = job.role
      companyEl.textContent = job.company
      datesEl.textContent = job.dates
      pointsEl.innerHTML = job.points.map((point) => `<li>${point}</li>`).join("")
      stackEl.innerHTML = job.stack.map((skill) => `<span class="experience-chip">${skill}</span>`).join("")
    }

    function updateActiveBuilding() {
      const threshold = 92
      let closestIndex = -1
      let closestDistance = Number.POSITIVE_INFINITY

      world.items.forEach((item, index) => {
        const distance = Math.abs(world.personX + 20 - item.center)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestDistance <= threshold) {
        if (world.activeIndex !== closestIndex) {
          world.activeIndex = closestIndex
          setDetails(world.items[closestIndex])
          markVisited(closestIndex)
        }
      } else if (world.activeIndex !== -1) {
        world.activeIndex = -1
        setDetails(null)
      }

      world.buildingNodes.forEach((node, index) => {
        node.classList.toggle("active", index === world.activeIndex)
      })
    }

    function walkTo(targetX) {
      world.autoTarget = Math.max(40, Math.min(world.width - 54, targetX))
      sceneEl.focus({ preventScroll: true })
    }

    function markVisited(index) {
      if (world.visited.has(index)) return
      world.visited.add(index)

      const flag = document.createElement("span")
      flag.className = "building-flag"
      flag.textContent = "★"
      world.items[index].node.appendChild(flag)

      updateHud()
      if (world.visited.size === world.items.length) celebrate()
    }

    function updateHud() {
      if (hudProgressEl) hudProgressEl.textContent = `ROLES ${world.visited.size}/${world.items.length}`
      if (hudCoinsEl) hudCoinsEl.textContent = `×${world.coins}`
    }

    function celebrate() {
      if (world.completed) return
      world.completed = true
      if (hudEl) hudEl.classList.add("complete")
      if (world.flagpole) world.flagpole.classList.add("down")

      const toast = document.createElement("div")
      toast.className = "experience-toast"
      toast.textContent = "🏆 Career journey complete!"
      sceneEl.appendChild(toast)
      window.setTimeout(() => toast.remove(), 4200)
    }

    function jump() {
      if (world.personY > 0 || world.velocityY > 0) return
      world.velocityY = world.jumpImpulse
      // Check for a ? block bump near the apex of the jump (t = impulse / gravity).
      window.setTimeout(bumpNearbyBlock, 340)
    }

    function bumpNearbyBlock() {
      if (rafId === null || world.personY <= 0) return
      const headX = world.personX + 20
      const block = world.qblocks.find((item) => Math.abs(item.center - headX) <= 28)
      if (!block) return

      block.node.classList.remove("bumped")
      void block.node.offsetWidth // restart the bump animation
      block.node.classList.add("bumped")

      if (block.used) return
      block.used = true
      block.node.classList.add("used")
      block.node.textContent = ""

      const coin = document.createElement("span")
      coin.className = "experience-coin"
      coin.style.left = `${block.center - 9}px`
      worldEl.appendChild(coin)
      window.setTimeout(() => coin.remove(), 700)

      world.coins += 1
      updateHud()
    }

    function updateSceneMetrics() {
      // Nothing sensible to measure while the container is collapsed.
      if (!sceneEl.clientWidth) return

      world.sceneWidth = sceneEl.clientWidth
      world.width = Math.max(world.sceneWidth + 220, layout.startX + (experiences.length - 1) * layout.spacing + 260)
      worldEl.style.width = `${world.width}px`
      world.personX = Math.min(world.personX, world.width - 60)
      if (skylineEl) {
        // Skyline scrolls slower than the world (parallax), so it needs extra width to stay covered.
        const maxCamera = Math.max(0, world.width - world.sceneWidth)
        skylineEl.style.width = `${world.sceneWidth + maxCamera * 0.22 + 40}px`
      }
      updateTransforms()
      updateActiveBuilding()
    }

    function updateTransforms() {
      const maxCamera = Math.max(0, world.width - world.sceneWidth)
      const targetCamera = world.personX - world.sceneWidth / 2 + 20
      world.cameraX = Math.max(0, Math.min(maxCamera, targetCamera))
      worldEl.style.transform = `translateX(${-world.cameraX}px)`
      personEl.style.left = `${world.personX - world.cameraX}px`
      personEl.style.transform = `translateY(${-world.personY}px) scaleX(${world.facing})`
      if (skylineEl) skylineEl.style.transform = `translateX(${-world.cameraX * 0.22}px)`
    }

    function getDirection() {
      const left = keyState.left || touchState.left
      const right = keyState.right || touchState.right
      if (left !== right) {
        world.autoTarget = null
        return left ? -1 : 1
      }
      if (world.autoTarget !== null) {
        const dx = world.autoTarget - world.personX
        if (Math.abs(dx) <= 6) {
          world.autoTarget = null
          return 0
        }
        return dx < 0 ? -1 : 1
      }
      return 0
    }

    function tick(timestamp) {
      if (!world.lastTime) {
        world.lastTime = timestamp
      }

      const delta = Math.min(32, timestamp - world.lastTime) / 1000
      world.lastTime = timestamp

      const direction = getDirection()
      if (direction !== 0) {
        world.personX += direction * world.speed * delta
        world.personX = Math.max(40, Math.min(world.width - 54, world.personX))
        world.facing = direction < 0 ? -1 : 1
      }

      const airborne = world.personY > 0 || world.velocityY > 0
      if (airborne) {
        world.velocityY -= world.gravity * delta
        world.personY += world.velocityY * delta
        if (world.personY <= 0) {
          world.personY = 0
          world.velocityY = 0
        }
      }

      personEl.classList.toggle("walking", direction !== 0 && world.personY <= 0)
      personEl.classList.toggle("airborne", world.personY > 0)

      updateTransforms()
      updateActiveBuilding()
      rafId = window.requestAnimationFrame(tick)
    }

    function startLoop() {
      if (rafId !== null) return
      world.lastTime = 0
      rafId = window.requestAnimationFrame(tick)
    }

    function stopLoop() {
      if (rafId === null) return
      window.cancelAnimationFrame(rafId)
      rafId = null
      keyState.left = false
      keyState.right = false
      touchState.left = false
      touchState.right = false
    }

    function handleKeyChange(event, isPressed) {
      // Only capture keys while the game loop is running (scene on screen).
      if (rafId === null) return

      const tagName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : ""
      if (tagName === "input" || tagName === "textarea") return

      const key = event.key === " " ? "space" : event.key.toLowerCase()
      if (key === "arrowleft" || key === "a") {
        keyState.left = isPressed
        event.preventDefault()
      }

      if (key === "arrowright" || key === "d") {
        keyState.right = isPressed
        event.preventDefault()
      }

      // Space and ArrowUp normally scroll the page, so they only jump
      // while the scene itself is focused. W is safe to handle globally.
      const sceneFocused = document.activeElement === sceneEl
      if (key === "w" || ((key === "space" || key === "arrowup") && sceneFocused)) {
        if (isPressed) jump()
        event.preventDefault()
      }
    }

    function bindHoldControl(button, direction) {
      if (!button) return

      const activate = () => {
        touchState[direction] = true
        button.classList.add("pressed")
        sceneEl.focus({ preventScroll: true })
      }

      const deactivate = () => {
        touchState[direction] = false
        button.classList.remove("pressed")
      }

      button.addEventListener("pointerdown", activate)
      button.addEventListener("pointerup", deactivate)
      button.addEventListener("pointerleave", deactivate)
      button.addEventListener("pointercancel", deactivate)
      button.addEventListener("lostpointercapture", deactivate)
    }

    renderExperienceWorld()
    setDetails(null)
    updateHud()
    updateSceneMetrics()
    sceneEl.addEventListener("click", () => sceneEl.focus({ preventScroll: true }))
    window.addEventListener("resize", updateSceneMetrics)
    window.addEventListener("keydown", (event) => handleKeyChange(event, true))
    window.addEventListener("keyup", (event) => handleKeyChange(event, false))
    window.addEventListener("blur", () => {
      keyState.left = false
      keyState.right = false
      touchState.left = false
      touchState.right = false
      if (moveLeftBtn) moveLeftBtn.classList.remove("pressed")
      if (moveRightBtn) moveRightBtn.classList.remove("pressed")
    })
    bindHoldControl(moveLeftBtn, "left")
    bindHoldControl(moveRightBtn, "right")
    if (moveJumpBtn) {
      moveJumpBtn.addEventListener("pointerdown", () => {
        jump()
        sceneEl.focus({ preventScroll: true })
      })
    }

    // Run the game loop only while the scene is on screen.
    if ("IntersectionObserver" in window) {
      const loopObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => (entry.isIntersecting ? startLoop() : stopLoop()))
        },
        { threshold: 0.05 },
      )
      loopObserver.observe(sceneEl)
    } else {
      startLoop()
    }

    return { remeasure: updateSceneMetrics }
  }

  // ---------------------- Screenshot lightbox ----------------------
  /**
   * Progressive enhancement: the thumbnails are plain links to the full-size
   * image, so without JS (or without <dialog> support) clicking still works.
   */
  /**
   * Hide any figure whose screenshot isn't on disk yet, so a shot that hasn't
   * been captured shows nothing rather than a broken image. Once the file
   * exists the figure appears on its own, with no markup change needed.
   */
  qsa(".case-shot img").forEach((img) => {
    const fail = () => {
      const figure = img.closest(".case-shot")
      if (!figure) return
      figure.hidden = true

      // Collapse the container too once nothing in it is left to show, or its
      // margin would leave a gap where the gallery used to be.
      const group = figure.closest(".case-shots")
      if (group && !qs(".case-shot:not([hidden])", group)) group.hidden = true
    }
    // A cached failure can land before this handler is attached.
    if (img.complete && img.naturalWidth === 0) fail()
    img.addEventListener("error", fail)
  })

  const lightbox = qs("#lightbox")
  const lightboxImage = qs("#lightbox-image")
  const lightboxClose = qs("#lightbox-close")

  if (lightbox && lightboxImage && typeof lightbox.showModal === "function") {
    qsa("[data-lightbox]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault()
        const full = link.getAttribute("href")
        const thumb = qs("img", link)
        lightboxImage.src = full
        lightboxImage.alt = thumb ? thumb.alt : ""
        lightbox.showModal()
      })
    })

    if (lightboxClose) lightboxClose.addEventListener("click", () => lightbox.close())

    // Clicking the backdrop (i.e. outside the image) closes it too.
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close()
    })

    // Drop the source on close so a reopened lightbox never flashes the previous
    // shot. removeAttribute, not src = "" — an empty src resolves to the page URL
    // and makes the browser refetch the document as an image.
    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src")
    })
  }

  // ---------------------- Experience: game toggle ----------------------
  const gameToggle = qs("#game-toggle")
  const gameWrap = qs("#experience-game")

  if (gameToggle && gameWrap) {
    let game = null

    gameToggle.addEventListener("click", () => {
      const opening = gameWrap.hasAttribute("hidden")

      if (opening) {
        gameWrap.removeAttribute("hidden")
        // Build on first open, once the scene has a real width to measure.
        if (!game) {
          game = initCareerGame() || {}
        } else if (game.remeasure) {
          game.remeasure()
        }
        gameWrap.scrollIntoView({ behavior: "smooth", block: "nearest" })
      } else {
        gameWrap.setAttribute("hidden", "")
      }

      gameToggle.setAttribute("aria-expanded", String(opening))
      gameToggle.classList.toggle("open", opening)
      const label = qs(".game-toggle-text", gameToggle)
      if (label) label.textContent = opening ? "Hide the game" : "Or walk through it as a game"
    })
  }
})()
