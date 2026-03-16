/* ============================================================
   PORTFOLIO – script.js
   Vanilla JS: fixed nav, mobile menu, scroll reveal
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
  } else {
    // Fallback: immediately show all reveal elements
    revealEls.forEach((el) => el.classList.add("visible"))
  }

  // ---------------------- Workflow art ----------------------
  const workflowArts = qsa(".workflow-art")

  workflowArts.forEach((art) => {
    const statusEl = qs(".workflow-art-status", art)
    const stages = [
      { id: "capture", label: "Capture requests" },
      { id: "process", label: "Route with rules" },
      { id: "approval", label: "Validate approvals" },
      { id: "delivery", label: "Deliver and notify" },
    ]

    let currentIndex = stages.findIndex((stage) => stage.id === art.dataset.stage)
    if (currentIndex < 0) currentIndex = 0

    const setStage = (index) => {
      const stage = stages[index]
      art.dataset.stage = stage.id
      if (statusEl) statusEl.textContent = stage.label
    }

    const advanceStage = () => {
      currentIndex = (currentIndex + 1) % stages.length
      setStage(currentIndex)
    }

    setStage(currentIndex)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    window.setInterval(advanceStage, 1800)
    art.addEventListener("mouseenter", advanceStage)
    art.addEventListener("focusin", advanceStage)
  })

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

  // ---------------------- Experience: interactive timeline ----------------------
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

  if (sceneEl && worldEl && personEl && detailsEl && pointsEl && stackEl && roleEl && companyEl && datesEl) {
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
      cameraX: 0,
      speed: 240,
      lastTime: 0,
      activeIndex: -1,
      buildingNodes: [],
      items: [],
    }

    function renderExperienceWorld() {
      const fragment = document.createDocumentFragment()

      world.items = experiences.map((job, index) => {
        const building = document.createElement("article")
        building.className = "experience-building"

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
        const hue = 205 + index * 6
        building.style.left = `${x}px`
        building.style.width = `${layout.width}px`
        building.style.height = `${height}px`
        building.style.background = [
          `linear-gradient(180deg, hsla(${hue}, 38%, 34%, 0.95), hsla(${hue - 10}, 42%, 16%, 0.96))`,
          "repeating-linear-gradient(90deg, rgba(255, 214, 102, 0.09) 0 16px, transparent 16px 32px)",
          "repeating-linear-gradient(180deg, rgba(255, 214, 102, 0.08) 0 16px, transparent 16px 28px)",
        ].join(", ")

        label.append(sign, years)
        building.append(label)
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
          "<li>Keyboard support: Left Arrow, Right Arrow, A, and D.</li>",
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
        }
      } else if (world.activeIndex !== -1) {
        world.activeIndex = -1
        setDetails(null)
      }

      world.buildingNodes.forEach((node, index) => {
        node.classList.toggle("active", index === world.activeIndex)
      })
    }

    function updateSceneMetrics() {
      world.sceneWidth = sceneEl.clientWidth
      world.width = Math.max(world.sceneWidth + 220, layout.startX + (experiences.length - 1) * layout.spacing + 260)
      worldEl.style.width = `${world.width}px`
      world.personX = Math.min(world.personX, world.width - 60)
      updateTransforms()
      updateActiveBuilding()
    }

    function updateTransforms() {
      const maxCamera = Math.max(0, world.width - world.sceneWidth)
      const targetCamera = world.personX - world.sceneWidth / 2 + 20
      world.cameraX = Math.max(0, Math.min(maxCamera, targetCamera))
      worldEl.style.transform = `translateX(${-world.cameraX}px)`
      personEl.style.left = `${world.personX - world.cameraX}px`
    }

    function getDirection() {
      const left = keyState.left || touchState.left
      const right = keyState.right || touchState.right
      if (left === right) return 0
      return left ? -1 : 1
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
        personEl.classList.add("walking")
        personEl.classList.toggle("facing-left", direction < 0)
      } else {
        personEl.classList.remove("walking")
      }

      updateTransforms()
      updateActiveBuilding()
      window.requestAnimationFrame(tick)
    }

    function handleKeyChange(event, isPressed) {
      const tagName = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : ""
      if (tagName === "input" || tagName === "textarea") return

      const key = event.key.toLowerCase()
      if (key === "arrowleft" || key === "a") {
        keyState.left = isPressed
        event.preventDefault()
      }

      if (key === "arrowright" || key === "d") {
        keyState.right = isPressed
        event.preventDefault()
      }
    }

    function bindHoldControl(button, direction) {
      if (!button) return

      const activate = () => {
        touchState[direction] = true
        button.classList.add("pressed")
        sceneEl.focus()
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
    updateSceneMetrics()
    updateActiveBuilding()
    sceneEl.addEventListener("click", () => sceneEl.focus())
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
    window.requestAnimationFrame(tick)
  }
})()
