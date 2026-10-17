/* ============================================================
   PORTFOLIO – script.js
   Vanilla JS: navigation, mobile menu, motion toggle, scroll
   reveals and scroll-linked transitions, screenshot viewer,
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

    // Escape closes the mobile menu and returns focus to its toggle.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open")
        navToggle.classList.remove("open")
        navToggle.setAttribute("aria-expanded", "false")
        navToggle.focus()
      }
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
      link.removeAttribute("aria-current")
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active")
        link.setAttribute("aria-current", "location")
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
      role: "Lead Specialist, Resource Optimization & Market Interface",
      company: "National Grid Corporation of the Philippines",
      dates: "Jul 2024 - Present",
      points: [
        "Lead internal application delivery for the operator of the Philippines' national electricity transmission grid, owning the full SDLC from requirements through architecture, release, and production support.",
        "Architected and built a modular Django enterprise platform that consolidates manual operational processes into configurable workflow modules, with background processing and live PostgreSQL and Oracle integrations on Windows Server infrastructure.",
        "Develop AI-supported document processing within the platform to extract and route information from recurring compliance and reporting documents.",
        "Automate repetitive business tasks with n8n, and lead ISO-aligned process improvement across business workflows, compliance activities, and operational reporting.",
        "Modernize legacy internal tools onto current Python/Django, Node.js, and SvelteKit stacks, and raise SDLC, QA, and DevOps standards for the team.",
      ],
      stack: [
        "n8n",
        "Python",
        "Django",
        "PostgreSQL",
        "Oracle DB",
        "REST APIs",
        "Node.js",
        "SvelteKit",
        "Windows Server",
        "Business Process Analysis",
      ],
    },
    {
      buildingLabel: "Realtair",
      role: "Senior Software Engineer",
      company: "Realtair, Inc. (Remote)",
      dates: "Oct 2023 - Apr 2024",
      points: [
        "Developed and maintained the Deposits application across C#/.NET MVC, React, TypeScript, and MSSQL services, taking business-critical issues from triage through to production fix.",
        "Reviewed and improved AWS SNS/SQS messaging, EC2/RDS infrastructure, and CI/CD for application stability and performance.",
      ],
      stack: ["C#", ".NET MVC", "React", "TypeScript", "AWS", "MSSQL", "CI/CD"],
    },
    {
      buildingLabel: "GoTeam",
      role: "Senior Full-Stack Developer",
      company: "GoTeam / Comtrac (Remote)",
      dates: "Feb 2023 - Sep 2023",
      points: [
        "Built new modules and resolved defects across the full stack of an Investigation Management platform, with a Vue.js 3 front end against C#/.NET services on Azure.",
        "Extended the CQRS-based application architecture, and acted as the team's go-to developer for the front end.",
      ],
      stack: ["Vue.js 3", "C# / .NET", "CQRS", "Azure", "CI/CD", "Git"],
    },
    {
      buildingLabel: "Theoria",
      role: "Senior Full-Stack Developer",
      company: "Theoria Medical (Remote, USA)",
      dates: "Sep 2022 - Feb 2023",
      points: [
        "Built the internal content management system end to end for clinical and operations staff, with a React/TypeScript front end against GraphQL services on MongoDB.",
        "Delivered supporting operational scripts alongside the CMS. Both remained in use after the engagement ended.",
        "Mentored a junior developer through informal code review and day-to-day guidance.",
      ],
      stack: ["React", "TypeScript", "MongoDB", "GraphQL", "Tailwind CSS"],
    },
    {
      buildingLabel: "NGCP",
      role: "Lead/Senior Specialist, Software Development",
      company: "National Grid Corporation of the Philippines",
      dates: "Jan 2016 - Sep 2022",
      points: [
        "Led enterprise application development and legacy modernization, including the Single Sign-On/Active Directory, Market Data Interchange, and Project Sentinel initiatives.",
        "Delivered the 5-Minute Real-Time Dashboard and operational applications involving SCADA data integrations.",
        "Owned the full SDLC for micro-apps, background job automation, and internal platforms.",
      ],
      stack: ["Laravel", "Vue.js", "Node.js", "Oracle DB", "MongoDB", "SCADA", "Bootstrap"],
    },
    {
      buildingLabel: "Earlier",
      role: "Earlier experience",
      company: "Teradata, Commission on Audit, NGCP",
      dates: "2013 - 2015",
      points: [
        "Teradata: customized marketing operations applications for enterprise clients.",
        "Commission on Audit: developed internal systems including the COA Data Warehouse and Asset Monitoring tools.",
        "NGCP: developed and deployed the Central Receiving and Monitoring Center App.",
      ],
      stack: ["C#", ".NET MVC", "MSSQL", "AngularJS", "JavaScript", "jQuery", "Bootstrap"],
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

  /**
   * Keeps the timeline skimmable: each role shows its first two points, and the
   * rest open on request. Without scripting every point shows.
   */
  const visiblePoints = 2

  function enhanceTimeline() {
    qsa("#experience-timeline .timeline-item").forEach((item, index) => {
      const points = qs(".timeline-points", item)
      const stack = qs(".timeline-stack", item)
      if (!points) return

      // Lead with what was done, then the tools.
      if (stack) points.after(stack)

      const extra = Array.from(points.children).slice(visiblePoints)
      if (!extra.length) return

      const extraList = document.createElement("ul")
      extraList.className = "timeline-points"
      extraList.append(...extra)

      const more = document.createElement("div")
      more.className = "timeline-more"
      more.id = `timeline-more-${index}`
      more.inert = true
      more.appendChild(extraList)
      points.after(more)

      const label = `${extra.length} more`
      const toggle = document.createElement("button")
      toggle.type = "button"
      toggle.className = "timeline-toggle"
      toggle.setAttribute("aria-expanded", "false")
      toggle.setAttribute("aria-controls", more.id)
      toggle.innerHTML = `<span aria-hidden="true">+</span> <b>${label}</b>`
      toggle.addEventListener("click", () => {
        const open = !item.classList.contains("open")
        item.classList.toggle("open", open)
        toggle.setAttribute("aria-expanded", String(open))
        qs("b", toggle).textContent = open ? "Show less" : label
        more.inert = !open
      })

      more.after(toggle)
    })
  }

  enhanceTimeline()

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

    const heights = [204, 178, 190, 170, 222, 158]
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
      tasks: 0,
      taskBlocks: [],
      gate: null,
    }

    let rafId = null

    function renderExperienceWorld() {
      const fragment = document.createDocumentFragment()

      world.items = experiences.map((job, index) => {
        const building = document.createElement("article")
        const variant = index % 2 === 0 ? "variant-a" : "variant-b"
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

        // Status lamp: idle until the station has been visited.
        const lamp = document.createElement("span")
        lamp.className = "building-lamp"

        label.append(sign, years)
        building.append(label, lamp)
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

      // Decorative stacks of work packets waiting on the line between stations
      const crates = [
        { gapAfter: 2, height: 56 },
        { gapAfter: 4, height: 28 },
      ]
      crates.forEach((crate) => {
        const node = document.createElement("div")
        node.className = "experience-crate"
        node.style.left = `${layout.startX + crate.gapAfter * layout.spacing + layout.width + 22}px`
        node.style.height = `${crate.height}px`
        fragment.appendChild(node)
      })

      // Task blocks to jump into (world x of each block's center)
      world.taskBlocks = [112, 548, 968].map((center) => {
        const node = document.createElement("div")
        node.className = "experience-taskblock"
        node.textContent = "⚙"
        node.style.left = `${center - 17}px`
        fragment.appendChild(node)
        return { center, node, used: false }
      })

      // Release gate past the last station marks the end of the line
      const gate = document.createElement("div")
      gate.className = "experience-gate"
      gate.innerHTML = '<span class="gate-lamp"></span><span class="gate-banner">SHIP</span>'
      gate.style.left = `${layout.startX + (experiences.length - 1) * layout.spacing + layout.width + 40}px`
      fragment.appendChild(gate)
      world.gate = gate

      worldEl.innerHTML = ""
      worldEl.appendChild(fragment)
      world.buildingNodes = world.items.map((item) => item.node)
    }

    function setDetails(job) {
      if (!job) {
        roleEl.textContent = "Walk to a station"
        companyEl.textContent = "Move close to any station to inspect the role, dates, responsibilities, and stack."
        datesEl.textContent = "Latest roles are placed on the left."
        fillList(pointsEl, "li", [
          "Tip: hold the movement buttons on mobile for continuous walking.",
          "Keyboard: ← / → or A / D to walk, W or Space to jump.",
          "Tap any station to walk straight to it and log the role.",
        ])
        stackEl.textContent = ""
        return
      }

      roleEl.textContent = job.role
      companyEl.textContent = job.company
      datesEl.textContent = job.dates
      fillList(pointsEl, "li", job.points)
      fillList(stackEl, "span", job.stack, "experience-chip")
    }

    function fillList(parent, tag, texts, className) {
      parent.replaceChildren(
        ...texts.map((text) => {
          const node = document.createElement(tag)
          if (className) node.className = className
          node.textContent = text
          return node
        }),
      )
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

      const badge = document.createElement("span")
      badge.className = "building-flag"
      badge.textContent = "✓"
      world.items[index].node.classList.add("visited")
      world.items[index].node.appendChild(badge)

      updateHud()
      if (world.visited.size === world.items.length) celebrate()
    }

    function updateHud() {
      if (hudProgressEl) hudProgressEl.textContent = `ROLES ${world.visited.size}/${world.items.length}`
      if (hudCoinsEl) hudCoinsEl.textContent = `TASKS ${world.tasks}`
    }

    function celebrate() {
      if (world.completed) return
      world.completed = true
      if (hudEl) hudEl.classList.add("complete")
      if (world.gate) world.gate.classList.add("open")

      const toast = document.createElement("div")
      toast.className = "experience-toast"
      toast.textContent = "✓ All roles logged. Shipped!"
      sceneEl.appendChild(toast)
      window.setTimeout(() => toast.remove(), 4200)
    }

    function jump() {
      if (world.personY > 0 || world.velocityY > 0) return
      world.velocityY = world.jumpImpulse
      // Check for a task block bump near the apex of the jump (t = impulse / gravity).
      window.setTimeout(bumpNearbyBlock, 340)
    }

    function bumpNearbyBlock() {
      if (rafId === null || world.personY <= 0) return
      const headX = world.personX + 20
      const block = world.taskBlocks.find((item) => Math.abs(item.center - headX) <= 28)
      if (!block) return

      block.node.classList.remove("bumped")
      void block.node.offsetWidth // restart the bump animation
      block.node.classList.add("bumped")

      if (block.used) return
      block.used = true
      block.node.classList.add("used")
      block.node.textContent = "✓"

      const token = document.createElement("span")
      token.className = "experience-token"
      token.textContent = "+1"
      token.style.left = `${block.center - 14}px`
      worldEl.appendChild(token)
      window.setTimeout(() => token.remove(), 700)

      world.tasks += 1
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

  // ---------------------- Experience: timeline / game switch ----------------------
  /**
   * The timeline is the default view; the game swaps in for it. Without
   * scripting the switch stays hidden and only the timeline is shown.
   */
  const viewTimelineBtn = qs("#view-timeline")
  const viewGameBtn = qs("#view-game")
  const timelineView = qs("#experience-timeline")
  const gameView = qs("#experience-game")
  const experienceSection = qs("#experience")

  if (viewTimelineBtn && viewGameBtn && timelineView && gameView) {
    let game = null

    const showView = (view) => {
      const playing = view === "game"
      timelineView.hidden = playing
      gameView.hidden = !playing
      viewTimelineBtn.setAttribute("aria-pressed", String(!playing))
      viewGameBtn.setAttribute("aria-pressed", String(playing))

      if (!playing) return
      // Build on first open, once the scene has a real width to measure.
      if (!game) {
        game = initCareerGame() || {}
      } else if (game.remeasure) {
        game.remeasure()
      }
    }

    viewTimelineBtn.addEventListener("click", () => showView("timeline"))
    viewGameBtn.addEventListener("click", () => showView("game"))

    // Shortcut from the hero: open the game view and jump to the section.
    qsa("[data-play-game]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault()
        showView("game")
        if (experienceSection) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
          experienceSection.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" })
        }
        viewGameBtn.focus({ preventScroll: true })
      })
    })
  }

  // ============================================================
  //  MOTION
  //  Everything below is decoration layered on readable markup.
  //  html.motion-off (system setting or the nav toggle) keeps the
  //  fades but drops movement, loops, and scroll-linked effects.
  // ============================================================
  const root = document.documentElement
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
  const motionOn = () => !root.classList.contains("motion-off")
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  // ---------------------- Motion: toggle ----------------------
  const motionToggle = qs("#motion-toggle")
  const flowSvg = qs("#flow-svg")

  function applyMotion(on, save) {
    root.classList.toggle("motion-off", !on)
    if (motionToggle) {
      motionToggle.setAttribute("aria-pressed", String(on))
      motionToggle.title = on ? "Turn animations off" : "Turn animations on"
    }
    if (flowSvg && typeof flowSvg.pauseAnimations === "function") {
      on ? flowSvg.unpauseAnimations() : flowSvg.pauseAnimations()
    }
    if (save) {
      try {
        localStorage.setItem("motion", on ? "on" : "off")
      } catch (error) {
        // Storage can be blocked; the choice then lasts for this visit only.
      }
    }
    if (!on) settleCounters()
    requestScrollUpdate()
  }

  if (motionToggle) {
    motionToggle.setAttribute("aria-label", "Animations")
    motionToggle.addEventListener("click", () => applyMotion(!motionOn(), true))
  }

  // Follow the system setting live, unless the reader has made their own choice.
  motionQuery.addEventListener("change", (event) => {
    let saved = null
    try {
      saved = localStorage.getItem("motion")
    } catch (error) {
      saved = null
    }
    if (!saved) applyMotion(!event.matches, false)
  })

  // ---------------------- Motion: split headings into words ----------------------
  /**
   * Wraps each word in a clipping span so headings can rise into place word by
   * word. Nested markup such as the hero's accent span is preserved.
   */
  function splitWords(el) {
    let index = 0

    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child)
          return
        }
        if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) return

        const fragment = document.createDocumentFragment()
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(" "))
            return
          }
          const outer = document.createElement("span")
          const inner = document.createElement("span")
          outer.className = "w"
          inner.textContent = part
          inner.style.setProperty("--wi", index++)
          outer.appendChild(inner)
          fragment.appendChild(outer)
        })
        child.replaceWith(fragment)
      })
    }

    walk(el)
  }

  qsa("[data-split]").forEach(splitWords)

  // ---------------------- Motion: reveal on scroll ----------------------
  // Siblings that reveal together are staggered by their order in the parent.
  qsa("[data-reveal]").forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((node) => node.hasAttribute("data-reveal"))
    el.style.setProperty("--d", Math.min(siblings.indexOf(el), 6) * 90)
  })

  const revealTargets = qsa("[data-reveal], [data-split], .timeline-item, .section-heading .eyebrow")

  function reveal(el) {
    el.classList.add("in")
    if (el.matches(".hero-stats > div, .hero-stats > div *")) runCounters(el)
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          revealObserver.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    )
    revealTargets.forEach((el) => revealObserver.observe(el))
  } else {
    revealTargets.forEach(reveal)
  }

  // ---------------------- Motion: counters ----------------------
  const careerStart = 2013
  qsa("[data-count-years]").forEach((el) => {
    el.dataset.count = String(new Date().getFullYear() - careerStart)
    el.textContent = el.dataset.count
  })

  function runCounters(scope) {
    qsa("[data-count]", scope).forEach((el) => {
      const target = Number(el.dataset.count)
      if (!motionOn() || el.dataset.counted) {
        el.textContent = String(target)
        return
      }
      el.dataset.counted = "true"
      const start = performance.now()
      const duration = 1400
      const step = (now) => {
        const t = clamp((now - start) / duration, 0, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        el.textContent = String(Math.round(target * eased))
        if (t < 1) window.requestAnimationFrame(step)
      }
      el.textContent = "0"
      window.requestAnimationFrame(step)
    })
  }

  function settleCounters() {
    qsa("[data-count]").forEach((el) => {
      el.textContent = el.dataset.count
    })
  }

  // ---------------------- Motion: section accent ----------------------
  // The backdrop glow drifts to the accent of whichever section holds the middle of the screen.
  if ("IntersectionObserver" in window) {
    const accentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.dataset.accent) {
            document.body.dataset.accent = entry.target.dataset.accent
          }
        })
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    qsa("section[data-accent]").forEach((section) => accentObserver.observe(section))
  }

  // ---------------------- Motion: scroll-linked effects ----------------------
  const progressBar = qs(".scroll-progress")
  const hero = qs("#hero")
  const cases = Array.from(qsa(".case-stack .case"))
  const featureShot = qs(".feature-shot .case-shot-link")
  const timelineEl = qs("#experience-timeline")
  const timelineItems = Array.from(qsa("#experience-timeline .timeline-item"))
  const stackQuery = window.matchMedia("(min-width: 761px)")
  let scrollQueued = false

  function updateScrollEffects() {
    scrollQueued = false
    const vh = window.innerHeight
    const maxScroll = document.documentElement.scrollHeight - vh
    const animate = motionOn()

    if (progressBar) progressBar.style.setProperty("--progress", maxScroll > 0 ? (window.scrollY / maxScroll).toFixed(4) : 0)

    if (hero) hero.style.setProperty("--hero-p", animate ? clamp(window.scrollY / hero.offsetHeight, 0, 1).toFixed(3) : 0)

    // Stacked case studies: as the next card slides over, the one beneath settles back.
    const stacking = animate && stackQuery.matches
    cases.forEach((card, index) => {
      const next = cases[index + 1]
      if (!stacking || !next) {
        card.style.removeProperty("--stack-scale")
        card.style.removeProperty("--stack-dim")
        return
      }
      const stickTop = parseFloat(getComputedStyle(card).top) || 0
      const covered = clamp(1 - (next.getBoundingClientRect().top - stickTop) / card.offsetHeight, 0, 1)
      card.style.setProperty("--stack-scale", (1 - covered * 0.06).toFixed(4))
      card.style.setProperty("--stack-dim", (1 - covered * 0.45).toFixed(4))
    })

    // The ROOC screenshot tilts back and flattens as it reaches the middle of the screen.
    if (featureShot) {
      if (animate) {
        const rect = featureShot.getBoundingClientRect()
        const offset = clamp((rect.top + rect.height / 2 - vh / 2) / (vh / 2), 0, 1)
        featureShot.style.setProperty("--tilt", `${(offset * 16).toFixed(2)}deg`)
      } else {
        featureShot.style.removeProperty("--tilt")
      }
    }

    // Career rail fills toward the reading line; each role lights when the charge reaches it.
    if (timelineEl && !timelineEl.hidden) {
      const rect = timelineEl.getBoundingClientRect()
      const fill = clamp((vh * 0.62 - rect.top) / rect.height, 0, 1)
      timelineEl.style.setProperty("--fill", animate ? fill.toFixed(4) : 1)
      timelineItems.forEach((item) => {
        const reached = item.getBoundingClientRect().top - rect.top <= fill * rect.height + 8
        item.classList.toggle("lit", !animate || reached)
      })
    }
  }

  function requestScrollUpdate() {
    if (scrollQueued) return
    scrollQueued = true
    window.requestAnimationFrame(updateScrollEffects)
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true })
  window.addEventListener("resize", requestScrollUpdate)
  if (viewTimelineBtn) viewTimelineBtn.addEventListener("click", requestScrollUpdate)
  updateScrollEffects()

  // ---------------------- Motion: marquee rows ----------------------
  // Each row is doubled so the loop is seamless; the copy is hidden from assistive tech.
  qsa(".marquee-track").forEach((track) => {
    const list = qs(".marquee-list", track)
    if (!list) return
    // A short row is padded with repeats until it spans the track, or the loop shows a gap.
    // Measured item by item so it also works while the row is wrapped with motion off.
    const originals = Array.from(list.children)
    const rowWidth = originals.reduce((sum, item) => sum + item.offsetWidth + 12, 0)
    const needed = Math.max(window.innerWidth, window.screen.width || 0)
    for (let width = rowWidth; rowWidth > 0 && width < needed; width += rowWidth) {
      originals.forEach((item) => {
        const repeat = item.cloneNode(true)
        repeat.setAttribute("aria-hidden", "true")
        list.appendChild(repeat)
      })
    }
    const clone = list.cloneNode(true)
    clone.setAttribute("aria-hidden", "true")
    track.appendChild(clone)
    // Constant speed regardless of row length: about 40px per second.
    track.style.setProperty("--marquee-duration", `${Math.max(20, Math.round(list.scrollWidth / 40))}s`)
  })

  // ---------------------- Motion: pointer effects ----------------------
  // Card spotlight follows the cursor.
  qsa("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`)
      card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`)
    })
  })

  // Primary calls to action lean gently toward the cursor.
  qsa("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      if (!motionOn() || !finePointer.matches) return
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      el.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`
    })
    el.addEventListener("pointerleave", () => {
      el.style.transform = ""
    })
  })

  // ---------------------- Contact: copy email ----------------------
  const copyBtn = qs("#copy-email")
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const original = "Copy email"
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy)
        copyBtn.textContent = "Copied ✓"
        copyBtn.classList.add("copied")
      } catch (error) {
        copyBtn.textContent = "Select the address above"
      }
      window.setTimeout(() => {
        copyBtn.textContent = original
        copyBtn.classList.remove("copied")
      }, 2200)
    })
  }

  applyMotion(motionOn(), false)
})()
