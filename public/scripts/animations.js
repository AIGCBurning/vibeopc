// =============================================
// vibeOPC — Animation Engine (Full)
// Lando Norris replica: GSAP + ScrollTrigger + Lenis
// =============================================

(function () {
  "use strict";

  var EASE = "power4.out";
  var EASE2 = "power2.out";
  var lenis;
  var preloaderDone = false;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    ScrollTrigger.config({ fastScrollEnd: true });

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    initLenis();
    initOrbParallax();

    if (reducedMotion) {
      // Skip preloader entirely, show everything immediately
      var preloader = document.getElementById("preloader");
      if (preloader) preloader.remove();
      preloaderDone = true;
      initHeroScrollParallax();
      initAllScrollAnimations();
    } else {
      initPreloader();
      initAllScrollAnimations();
    }
  }

  function initAllScrollAnimations() {
    initManifesto();
    initSplitTextSections();
    initCardReveals();
    initClipReveals();
    initFadeReveals();
    initShowcaseScroll();
    initCounters();
    initForm();
    initNavScroll();
    initSmoothAnchors();
    initHamburger();
    initMarqueeSpeed();
    initFooterReveal();
    initNavThemeFollow();
    initCardTilt();
    initScrollProgress();
    initMagneticButtons();
    initVision3DReveal();
    initFooterLinksReveal();
    initNavActiveSection();
    initDrawLines();
    initAccentLineScrub();
    initShowcaseHeadingScrub();
    initHeroTagsParallax();
  }

  // ═══════════════════════════════════════════
  // PRELOADER — Cinematic entrance sequence
  // ═══════════════════════════════════════════
  function initPreloader() {
    var preloader = document.getElementById("preloader");
    if (!preloader) { initHeroReveal(); return; }

    var scan = document.getElementById("preloader-scan");
    var chars = preloader.querySelectorAll("[data-pre-char]");
    var barWrap = document.getElementById("preloader-bar-wrap");
    var bar = document.getElementById("preloader-bar");
    var tagline = document.getElementById("preloader-tagline");
    var tagWords = preloader.querySelectorAll("[data-pre-word]");
    var counter = document.getElementById("preloader-counter");
    var cornerTL = document.getElementById("pre-corner-tl");
    var cornerBR = document.getElementById("pre-corner-br");
    var curtainL = document.getElementById("preloader-curtain-l");
    var curtainR = document.getElementById("preloader-curtain-r");

    // Lock scroll during preloader via Lenis
    if (lenis) lenis.stop();

    // Hide nav initially
    var nav = document.getElementById("nav");
    if (nav) gsap.set(nav, { y: -80, opacity: 0 });

    var tl = gsap.timeline({
      onComplete: function () {
        preloaderDone = true;
        preloader.style.pointerEvents = "none";
        if (lenis) lenis.start();
        setTimeout(function () { preloader.remove(); }, 500);
        initHeroEntrance();
      },
    });

    // Phase 1: Scan line sweeps
    tl.to(scan, { opacity: 1, duration: 0.1 }, 0);
    tl.to(scan, { width: "100%", duration: 0.6, ease: "power2.inOut" }, 0);
    tl.to(scan, { opacity: 0, duration: 0.3 }, 0.5);

    // Phase 2: Characters clip-reveal
    tl.to(chars, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.6,
      stagger: 0.06,
      ease: "power4.out",
    }, 0.3);

    // Phase 2b: Corner details
    tl.to(cornerTL, { opacity: 1, duration: 0.4 }, 0.5);
    tl.to(cornerBR, { opacity: 1, duration: 0.4 }, 0.5);

    // Phase 3: Progress bar + counter
    tl.to(barWrap, { opacity: 1, duration: 0.3 }, 0.5);
    tl.to(tagline, { opacity: 1, duration: 0.2 }, 0.6);
    tl.to(tagWords, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
    }, 0.7);

    var obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: function () {
        var v = Math.floor(obj.val);
        if (counter) counter.textContent = v < 10 ? "00" + v : v < 100 ? "0" + v : "" + v;
        if (bar) bar.style.width = v + "%";
      },
    }, 0.6);

    // Phase 4: Exit
    tl.to(chars, {
      scale: 1.1, opacity: 0, duration: 0.4, stagger: 0.02, ease: "power3.in",
    }, "+=0.2");
    tl.to([barWrap, tagline, cornerTL, cornerBR], {
      opacity: 0, duration: 0.3, ease: "power2.in",
    }, "-=0.3");

    // Curtain split
    tl.to(curtainL, { xPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1");
    tl.to(curtainR, { xPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<");
  }

  // ═══════════════════════════════════════════
  // HERO ENTRANCE (post-preloader)
  // ═══════════════════════════════════════════
  function initHeroEntrance() {
    var nav = document.getElementById("nav");
    var tl = gsap.timeline();

    if (nav) {
      tl.to(nav, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0);
    }

    var words = document.querySelectorAll(".hero .split-word");
    if (words.length) {
      tl.to(words, { y: 0, duration: 1.4, stagger: 0.08, ease: "power4.out" }, 0.1);
    }
    tl.to(".hero__tags", { opacity: 1, y: 0, duration: 1, ease: EASE }, "-=0.9");
    tl.to(".hero__sub", { opacity: 1, y: 0, duration: 1, ease: EASE }, "-=0.7");
    tl.to(".hero__ctas", { opacity: 1, y: 0, duration: 1, ease: EASE }, "-=0.6");
    tl.to(".hero__scroll", { opacity: 1, y: 0, duration: 0.8, ease: EASE }, "-=0.5");
    tl.from(".hero .orb", { scale: 0.5, opacity: 0, duration: 1.5, stagger: 0.15, ease: "power2.out" }, 0.2);

    initHeroScrollParallax();
  }

  // ═══════════════════════════════════════════
  // LENIS
  // ═══════════════════════════════════════════
  function initLenis() {
    lenis = new Lenis({
      duration: 1.4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // ═══════════════════════════════════════════
  // ORB PARALLAX
  // ═══════════════════════════════════════════
  function initOrbParallax() {
    var orbs = document.querySelectorAll(".orb");
    if (!orbs.length || window.innerWidth <= 768) return;

    document.addEventListener("mousemove", function (e) {
      var nx = (e.clientX / window.innerWidth - 0.5) * 2;
      var ny = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach(function (orb, i) {
        gsap.to(orb, { x: nx * (i + 1) * 20, y: ny * (i + 1) * 20, duration: 2.5, ease: EASE2, overwrite: "auto" });
      });
    });
  }

  // ═══════════════════════════════════════════
  // HERO SCROLL PARALLAX
  // ═══════════════════════════════════════════
  function initHeroScrollParallax() {
    gsap.to(".hero__title", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 },
      y: -150, ease: "none",
    });
    gsap.to(".hero__sub, .hero__ctas", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "80% top", scrub: 1.5 },
      y: -80, opacity: 0, ease: "none",
    });
    gsap.to(".hero__tags", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 },
      opacity: 0, ease: "none",
    });
    gsap.to(".hero__scroll", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "20% top", scrub: true },
      opacity: 0, ease: "none",
    });
  }

  // Fallback: no preloader
  function initHeroReveal() {
    var tl = gsap.timeline({ delay: 0.3 });
    var words = document.querySelectorAll(".hero .split-word");
    if (words.length) {
      tl.to(words, { y: 0, duration: 1.3, stagger: 0.07, ease: "power4.out" });
    }
    tl.to(".hero__tags", { opacity: 1, y: 0, duration: 0.9, ease: EASE }, "-=0.8");
    tl.to(".hero__sub", { opacity: 1, y: 0, duration: 0.9, ease: EASE }, "-=0.6");
    tl.to(".hero__ctas", { opacity: 1, y: 0, duration: 0.9, ease: EASE }, "-=0.5");
    tl.to(".hero__scroll", { opacity: 1, y: 0, duration: 0.7, ease: EASE }, "-=0.4");
    preloaderDone = true;
    initHeroScrollParallax();
  }

  // ═══════════════════════════════════════════
  // MANIFESTO (Pinned fullscreen narrative)
  // ═══════════════════════════════════════════
  function initManifesto() {
    var section = document.querySelector(".manifesto");
    var bg = document.querySelector("[data-manifesto-bg]");
    var deco = document.querySelector("[data-manifesto-deco]");
    var lines = document.querySelectorAll("[data-manifesto-line]");
    if (!section || !lines.length) return;

    var totalLines = lines.length;

    // Main pinned timeline
    var manifestoTL = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: function (self) {
          var progress = self.progress;
          lines.forEach(function (line, i) {
            var threshold = (i / totalLines) * 0.85;
            if (progress >= threshold) {
              line.classList.add("is-active");
            } else {
              line.classList.remove("is-active");
            }
          });
        },
      },
    });

    // Background gradient: dark → purple → lime → dark
    if (bg) {
      manifestoTL.to(bg, { background: "#1e0a2e", duration: 0.2 }, 0);
      manifestoTL.to(bg, { background: "#1a2f00", duration: 0.2 }, 0.35);
      manifestoTL.to(bg, { background: "#111112", duration: 0.2 }, 0.7);
    }

    // Decorative OPC parallax
    if (deco) {
      manifestoTL.fromTo(deco,
        { yPercent: 10, opacity: 0 },
        { yPercent: -30, opacity: 1, duration: 1, ease: "none" },
        0
      );
    }
  }

  // ═══════════════════════════════════════════
  // SPLIT TEXT SECTIONS
  // ═══════════════════════════════════════════
  function initSplitTextSections() {
    var selectors = [
      ".pillars [data-split-text]",
      ".stats [data-split-text]",
      ".cta [data-split-text]",
      ".showcase [data-split-text]",
      ".vision3d [data-split-text]",
    ];
    document.querySelectorAll(selectors.join(",")).forEach(function (el) {
      var words = el.querySelectorAll(".split-word");
      if (!words.length) return;
      gsap.to(words, {
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
        y: 0, duration: 1.2, stagger: 0.06, ease: "power4.out",
      });
    });
  }

  // ═══════════════════════════════════════════
  // CARD REVEALS
  // ═══════════════════════════════════════════
  function initCardReveals() {
    document.querySelectorAll('[data-anim="card"]').forEach(function (card) {
      var delay = parseFloat(card.getAttribute("data-delay")) || 0;
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
        opacity: 1, y: 0, duration: 1, delay: delay, ease: "power3.out",
      });
    });
  }

  // ═══════════════════════════════════════════
  // CLIP-PATH REVEALS
  // ═══════════════════════════════════════════
  function initClipReveals() {
    document.querySelectorAll('[data-anim="clip-up"]').forEach(function (el) {
      var delay = parseFloat(el.getAttribute("data-delay")) || 0;
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        clipPath: "inset(0% 0 0 0)", duration: 1.2, delay: delay, ease: "power4.inOut",
      });
    });

    document.querySelectorAll('[data-anim="clip-left"]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.inOut",
      });
    });

    document.querySelectorAll('[data-anim="clip-circle"]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        clipPath: "circle(75% at 50% 50%)", duration: 1.4, ease: "power3.out",
      });
    });

    document.querySelectorAll('[data-anim="clip-reveal"]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.2, ease: "power4.inOut",
      });
    });
  }

  // ═══════════════════════════════════════════
  // FADE REVEALS
  // ═══════════════════════════════════════════
  function initFadeReveals() {
    document.querySelectorAll('[data-anim="fade"]').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        opacity: 1, y: 0, duration: 0.9, ease: EASE,
      });
    });
  }

  // ═══════════════════════════════════════════
  // SHOWCASE HORIZONTAL SCROLL
  // ═══════════════════════════════════════════
  function initShowcaseScroll() {
    var track = document.querySelector("[data-showcase-track]");
    var pin = document.querySelector("[data-showcase-pin]");
    if (!track || !pin) return;

    ScrollTrigger.matchMedia({
      // Desktop: horizontal scroll with pin
      "(min-width: 769px)": function () {
        var getScrollAmount = function () {
          return -(track.scrollWidth - window.innerWidth + 48);
        };

        var scrollTween = gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: ".showcase",
            start: "top 10%",
            end: function () { return "+=" + Math.abs(getScrollAmount()); },
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        var cards = track.querySelectorAll(".showcase__card");
        cards.forEach(function (card) {
          gsap.from(card, {
            opacity: 0.3,
            scale: 0.92,
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 90%",
              end: "left 50%",
              scrub: true,
            },
            ease: "none",
          });
        });
      },

      // Mobile: vertical fade-up reveals
      "(max-width: 768px)": function () {
        var cards = track.querySelectorAll(".showcase__card");
        cards.forEach(function (card) {
          gsap.from(card, {
            opacity: 0,
            y: 60,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
            duration: 0.8,
            ease: EASE,
          });
        });
      },
    });
  }

  // ═══════════════════════════════════════════
  // COUNTERS
  // ═══════════════════════════════════════════
  function initCounters() {
    document.querySelectorAll("[data-counter]").forEach(function (el, i) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-suffix") || "";
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () {
          // Make visible when counter starts
          el.style.visibility = "visible";
          // Blur + scale entrance
          gsap.from(el, {
            scale: 0.5,
            filter: "blur(8px)",
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
          });
          // Counter animation (synced with visual entrance)
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.4,
            delay: i * 0.1 + 0.3,
            ease: target > 5 ? "back.out(1.4)" : "power3.out",
            onUpdate: function () {
              el.textContent = Math.floor(Math.min(obj.val, target)) + suffix;
            },
          });
        },
      });
    });
  }

  // ═══════════════════════════════════════════
  // FORM
  // ═══════════════════════════════════════════
  function initForm() {
    var form = document.getElementById("waitlist-form");
    var success = document.getElementById("form-success");
    if (!form || !success) return;

    var input = form.querySelector('input[type="email"]');
    var errorEl = document.getElementById("cta-error");
    var submitBtn = form.querySelector('button[type="submit"]');
    var resetLink = document.getElementById("form-reset");

    // Clear error on input
    if (input && errorEl) {
      input.addEventListener("input", function () {
        input.classList.remove("is-error");
        errorEl.textContent = "";
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!input || !input.value) return;

      // Validate email
      if (!input.validity.valid) {
        input.classList.add("is-error");
        if (errorEl) errorEl.textContent = "Please enter a valid email address.";
        input.style.animation = "none";
        input.offsetHeight; // force reflow
        input.style.animation = "";
        return;
      }

      // Disable button during submit
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
      }

      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value }),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            gsap.to(form, {
              opacity: 0, y: -24, duration: 0.5, ease: EASE,
              onComplete: function () {
                form.style.display = "none";
                success.classList.add("is-visible");
                gsap.from(success, { opacity: 0, y: 24, scale: 0.96, duration: 0.7, ease: EASE });
              },
            });
          } else {
            if (errorEl) errorEl.textContent = data.error || "Something went wrong. Please try again.";
            if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ""; }
          }
        })
        .catch(function () {
          if (errorEl) errorEl.textContent = "Network error. Please try again.";
          if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ""; }
        });
    });

    // Reset form (BUG 3)
    if (resetLink) {
      resetLink.addEventListener("click", function (e) {
        e.preventDefault();
        success.classList.remove("is-visible");
        form.style.display = "";
        form.style.opacity = "";
        input.value = "";
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ""; }
        gsap.from(form, { opacity: 0, y: 24, duration: 0.5, ease: EASE });
      });
    }
  }

  // ═══════════════════════════════════════════
  // NAV SCROLL
  // ═══════════════════════════════════════════
  function initNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav || !lenis) return;

    var lastY = 0;
    lenis.on("scroll", function (e) {
      if (!preloaderDone) return; // Don't mess with nav during preloader

      var s = e.scroll;
      var currentTheme = nav.getAttribute("data-nav-theme") || "dark";

      // Glass effect — adapt to current theme
      if (currentTheme === "dark") {
        if (s > 60) {
          nav.style.background = "rgba(17,17,18,0.88)";
          nav.style.borderBottomColor = "rgba(255,255,255,0.06)";
        } else {
          nav.style.background = "rgba(17,17,18,0.6)";
          nav.style.borderBottomColor = "rgba(255,255,255,0.04)";
        }
      } else if (currentTheme === "lime") {
        nav.style.background = "rgba(210,255,0,0.85)";
        nav.style.borderBottomColor = "rgba(0,0,0,0.08)";
      } else if (currentTheme === "light") {
        nav.style.background = "rgba(240,240,238,0.88)";
        nav.style.borderBottomColor = "rgba(0,0,0,0.06)";
      }

      // Hide on scroll down, show on scroll up
      if (s > 300 && s > lastY) {
        gsap.to(nav, { y: -80, duration: 0.4, ease: EASE2, overwrite: true });
      } else {
        gsap.to(nav, { y: 0, duration: 0.4, ease: EASE2, overwrite: true });
      }
      lastY = s;
    });
  }

  // ═══════════════════════════════════════════
  // SMOOTH ANCHORS
  // ═══════════════════════════════════════════
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var t = document.querySelector(a.getAttribute("href"));
        if (t && lenis) lenis.scrollTo(t, { offset: -80, duration: 1.8 });
      });
    });
  }

  // ═══════════════════════════════════════════
  // HAMBURGER MENU (mobile)
  // ═══════════════════════════════════════════
  function initHamburger() {
    var btn = document.getElementById("nav-hamburger");
    var overlay = document.getElementById("nav-mobile");
    if (!btn || !overlay) return;

    var links = overlay.querySelectorAll(".nav-mobile__link, .nav-mobile__btn");
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      if (lenis) lenis.stop();

      // Stagger links in
      gsap.fromTo(links,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE, delay: 0.15 }
      );
    }

    function closeMenu() {
      isOpen = false;
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");

      gsap.to(links, {
        opacity: 0, y: -20, duration: 0.3, stagger: 0.03, ease: "power2.in",
        onComplete: function () {
          overlay.classList.remove("is-open");
          overlay.setAttribute("aria-hidden", "true");
          if (lenis) lenis.start();
        },
      });
    }

    btn.addEventListener("click", function () {
      if (isOpen) closeMenu(); else openMenu();
    });

    // Close on link click + smooth scroll
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var href = link.getAttribute("href");
        closeMenu();
        var target = href ? document.querySelector(href) : null;
        if (target && lenis) {
          setTimeout(function () { lenis.scrollTo(target, { offset: -80, duration: 1.8 }); }, 400);
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // MARQUEE SPEED
  // ═══════════════════════════════════════════
  function initMarqueeSpeed() {
    var tracks = document.querySelectorAll(".marquee-w__track");
    if (!tracks.length || !lenis) return;

    // Replace CSS animation with GSAP for smooth speed control
    var tweens = [];
    tracks.forEach(function (t) {
      var isReverse = !!t.closest(".marquee-w--reverse");
      var isFast = !!t.closest(".marquee-w--fast");
      var duration = isFast ? 22 : 30;

      // Kill CSS animation, show track
      t.style.animation = "none";
      t.style.visibility = "visible";

      var tween = gsap.fromTo(t,
        { xPercent: isReverse ? -50 : 0 },
        { xPercent: isReverse ? 0 : -50, ease: "none", duration: duration, repeat: -1 }
      );
      tweens.push({ tween: tween, el: t });
    });

    var targetScale = 1;
    var currentScale = 1;
    var rafId;

    function smoothUpdate() {
      currentScale += (targetScale - currentScale) * 0.08;
      if (Math.abs(currentScale - targetScale) < 0.001) currentScale = targetScale;
      tweens.forEach(function (item) { item.tween.timeScale(currentScale); });
      rafId = requestAnimationFrame(smoothUpdate);
    }
    rafId = requestAnimationFrame(smoothUpdate);

    lenis.on("scroll", function (e) {
      var v = Math.min(Math.abs(e.velocity) * 0.12, 1.2);
      targetScale = 1 + v;
    });

    // Hover pause per marquee
    document.querySelectorAll(".marquee-w").forEach(function (m) {
      var mTracks = m.querySelectorAll(".marquee-w__track");
      m.addEventListener("mouseenter", function () {
        tweens.forEach(function (item) {
          mTracks.forEach(function (mt) {
            if (item.el === mt) item.tween.pause();
          });
        });
      });
      m.addEventListener("mouseleave", function () {
        tweens.forEach(function (item) {
          mTracks.forEach(function (mt) {
            if (item.el === mt) item.tween.resume();
          });
        });
      });
    });
  }

  // ═══════════════════════════════════════════
  // FOOTER SVG MASK REVEAL
  // ═══════════════════════════════════════════
  function initFooterReveal() {
    var footerSvg = document.querySelector("[data-footer-reveal]");
    if (!footerSvg) return;
    gsap.to(footerSvg, {
      scrollTrigger: {
        trigger: ".footer__hero",
        start: "top 85%",
        end: "top 30%",
        scrub: 1,
      },
      clipPath: "inset(0 0% 0 0%)",
      ease: "none",
    });

    // Pause/resume SVG <animate> elements based on visibility
    var footerHero = document.querySelector(".footer__hero");
    var animates = footerSvg ? footerSvg.querySelectorAll("animate") : [];
    if (footerHero && animates.length) {
      // Pause initially
      var svg = footerSvg.querySelector("svg");
      if (svg) svg.pauseAnimations();

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (svg) {
            if (entry.isIntersecting) {
              svg.unpauseAnimations();
            } else {
              svg.pauseAnimations();
            }
          }
        });
      }, { threshold: 0.05 });

      observer.observe(footerHero);
    }
  }

  // ═══════════════════════════════════════════
  // FOOTER LINKS STAGGER REVEAL
  // ═══════════════════════════════════════════
  function initFooterLinksReveal() {
    var links = document.querySelectorAll("[data-footer-link]");
    var legal = document.querySelector("[data-footer-legal]");

    if (links.length) {
      gsap.from(links, {
        scrollTrigger: {
          trigger: ".footer__bottom",
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.7,
        ease: EASE,
      });
    }

    if (legal) {
      gsap.from(legal, {
        scrollTrigger: {
          trigger: legal,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.3,
        ease: EASE,
      });
    }
  }

  // ═══════════════════════════════════════════
  // CARD TILT + GLOSS (desktop only, not showcase cards)
  // ═══════════════════════════════════════════
  function initCardTilt() {
    // Only apply to pillars cards — showcase cards are in horizontal scroll
    // and tilt transforms would conflict with GSAP translateX
    var cards = document.querySelectorAll(".pillars__card");
    if (!cards.length || window.innerWidth <= 768) return;

    cards.forEach(function (card) {
      var gloss = document.createElement("div");
      gloss.style.cssText = "position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity 0.4s ease;border-radius:inherit;";
      card.style.perspective = "800px";
      card.style.transformStyle = "preserve-3d";
      card.appendChild(gloss);

      card.addEventListener("mouseenter", function () { gloss.style.opacity = "1"; });

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        gsap.to(card, {
          rotateX: (0.5 - y) * 10,
          rotateY: (x - 0.5) * 10,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        gloss.style.background = "radial-gradient(circle at " + (x * 100) + "% " + (y * 100) + "%, rgba(255,255,255,0.06) 0%, transparent 60%)";
      });

      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
        gloss.style.opacity = "0";
      });
    });

    // Showcase cards: only gloss, no tilt (avoid transform conflict)
    document.querySelectorAll(".showcase__card").forEach(function (card) {
      var gloss = document.createElement("div");
      gloss.style.cssText = "position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity 0.4s ease;border-radius:inherit;";
      card.appendChild(gloss);

      card.addEventListener("mouseenter", function () { gloss.style.opacity = "1"; });
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        gloss.style.background = "radial-gradient(circle at " + (x * 100) + "% " + (y * 100) + "%, rgba(255,255,255,0.06) 0%, transparent 60%)";
      });
      card.addEventListener("mouseleave", function () { gloss.style.opacity = "0"; });
    });
  }

  // ═══════════════════════════════════════════
  // NAV THEME FOLLOW
  // ═══════════════════════════════════════════
  function initNavThemeFollow() {
    var nav = document.getElementById("nav");
    if (!nav) return;

    var brandV = nav.querySelector(".nav__brand-v");
    var brandO = nav.querySelector(".nav__brand-o");
    if (!brandV || !brandO) return;

    document.querySelectorAll("[data-theme]").forEach(function (section) {
      var theme = section.getAttribute("data-theme");
      ScrollTrigger.create({
        trigger: section,
        start: "top top+=72",
        end: "bottom top+=72",
        onEnter: function () { applyNavTheme(nav, brandV, brandO, theme); },
        onEnterBack: function () { applyNavTheme(nav, brandV, brandO, theme); },
        onLeave: function () { applyNavTheme(nav, brandV, brandO, "dark"); },
        onLeaveBack: function () { applyNavTheme(nav, brandV, brandO, "dark"); },
      });
    });
  }

  function applyNavTheme(nav, brandV, brandO, theme) {
    nav.setAttribute("data-nav-theme", theme);
    if (theme === "lime") {
      nav.style.color = "#111112";
      brandV.style.color = "#111112";
      brandO.style.color = "#111112";
    } else if (theme === "light") {
      nav.style.color = "#111112";
      brandV.style.color = "#1a2f00";
      brandO.style.color = "#111112";
    } else {
      nav.style.color = "";
      brandV.style.color = "";
      brandO.style.color = "";
    }
  }

  // ═══════════════════════════════════════════
  // SCROLL PROGRESS BAR
  // ═══════════════════════════════════════════
  function initScrollProgress() {
    var bar = document.getElementById("nav-progress");
    if (!bar) return;

    if (lenis) {
      lenis.on("scroll", function (e) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (e.scroll / docHeight) * 100 : 0;
        bar.style.width = progress + "%";
      });
    }
  }

  // ═══════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ═══════════════════════════════════════════
  function initMagneticButtons() {
    if (window.innerWidth <= 768) return;

    document.querySelectorAll(".btn-primary, .btn-ghost").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.12, y: y * 0.12, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });

      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      });
    });
  }

  // ═══════════════════════════════════════════
  // VISION 3D REVEAL
  // ═══════════════════════════════════════════
  function initVision3DReveal() {
    var wrap = document.querySelector("[data-vision3d-reveal]");
    if (!wrap) return;

    gsap.to(wrap, {
      scrollTrigger: {
        trigger: ".vision3d",
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
      opacity: 1,
      scale: 1,
      ease: "none",
    });
  }

  // ═══════════════════════════════════════════
  // NAV ACTIVE SECTION
  // ═══════════════════════════════════════════
  function initNavActiveSection() {
    var navLinks = document.querySelectorAll("[data-nav-link]");
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        var section = document.querySelector(href);
        if (section) {
          sections.push({ link: link, section: section });
        }
      }
    });

    sections.forEach(function (item) {
      ScrollTrigger.create({
        trigger: item.section,
        start: "top center",
        end: "bottom center",
        onEnter: function () { setActiveNav(navLinks, item.link); },
        onEnterBack: function () { setActiveNav(navLinks, item.link); },
        onLeave: function () { item.link.classList.remove("is-active"); },
        onLeaveBack: function () { item.link.classList.remove("is-active"); },
      });
    });
  }

  function setActiveNav(allLinks, activeLink) {
    allLinks.forEach(function (l) { l.classList.remove("is-active"); });
    activeLink.classList.add("is-active");
  }

  // ═══════════════════════════════════════════
  // SVG DRAW LINES (Step 1)
  // ═══════════════════════════════════════════
  function initDrawLines() {
    var lines = document.querySelectorAll("[data-draw-line]");
    if (!lines.length) return;

    lines.forEach(function (path) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;

      gsap.to(path, {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: path.closest("section") || path,
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
        },
        ease: "none",
      });
    });
  }

  // ═══════════════════════════════════════════
  // STATS ACCENT-LINE SCRUB (Step 4)
  // ═══════════════════════════════════════════
  function initAccentLineScrub() {
    var line = document.querySelector(".stats__accent-line");
    if (!line) return;

    gsap.to(line, {
      width: "60%",
      scrollTrigger: {
        trigger: ".stats",
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
      ease: "none",
    });
  }

  // ═══════════════════════════════════════════
  // SHOWCASE HEADING LETTER-SPACING SCRUB (Step 4)
  // ═══════════════════════════════════════════
  function initShowcaseHeadingScrub() {
    var heading = document.querySelector(".showcase__heading");
    if (!heading) return;

    gsap.to(heading, {
      letterSpacing: "0em",
      y: -20,
      scrollTrigger: {
        trigger: ".showcase__header",
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
      ease: "none",
    });
  }

  // ═══════════════════════════════════════════
  // HERO TAGS LAYERED PARALLAX (Step 6)
  // ═══════════════════════════════════════════
  function initHeroTagsParallax() {
    var tags = document.querySelectorAll(".hero__tag");
    if (!tags.length) return;

    var speeds = [-40, -70, -50];
    tags.forEach(function (tag, i) {
      gsap.to(tag, {
        y: speeds[i] || -50,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        ease: "none",
      });
    });
  }

})();
