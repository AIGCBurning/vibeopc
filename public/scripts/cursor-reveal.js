// =============================================
// vibeOPC — Cursor Reveal (Lando-style spotlight)
// mix-blend-mode: difference + clip-path circle
// =============================================
(function () {
  "use strict";

  if (window.innerWidth <= 768 || !window.matchMedia("(hover:hover)").matches) return;

  var reveal = document.createElement("div");
  reveal.className = "cursor-reveal";
  reveal.setAttribute("aria-hidden", "true");
  document.body.appendChild(reveal);

  var inner = document.createElement("div");
  inner.className = "cursor-reveal__inner";
  reveal.appendChild(inner);

  var mx = -200, my = -200, cx = -200, cy = -200;
  var active = false;
  var size = 120;
  var targetSize = 120;
  var currentSize = 120;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      active = true;
      reveal.classList.add("is-active");
    }
  });

  document.addEventListener("mouseleave", function () {
    active = false;
    reveal.classList.remove("is-active");
  });

  // Grow on interactive elements
  document.addEventListener("mouseover", function (e) {
    var el = e.target;
    if (el.closest("a, button, [data-cursor-grow], input, .showcase__card, .pillars__card")) {
      targetSize = 180;
    }
  });
  document.addEventListener("mouseout", function (e) {
    var el = e.target;
    if (el.closest("a, button, [data-cursor-grow], input, .showcase__card, .pillars__card")) {
      targetSize = 120;
    }
  });

  (function tick() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    currentSize += (targetSize - currentSize) * 0.1;

    reveal.style.clipPath = "circle(" + currentSize + "px at " + cx + "px " + cy + "px)";
    reveal.style.webkitClipPath = "circle(" + currentSize + "px at " + cx + "px " + cy + "px)";

    requestAnimationFrame(tick);
  })();

  // Inject styles
  var style = document.createElement("style");
  style.textContent = [
    ".cursor-reveal {",
    "  position: fixed;",
    "  inset: 0;",
    "  z-index: 9997;",
    "  pointer-events: none;",
    "  background: #ffffff;",
    "  mix-blend-mode: difference;",
    "  clip-path: circle(0px at -200px -200px);",
    "  -webkit-clip-path: circle(0px at -200px -200px);",
    "  opacity: 0;",
    "  transition: opacity 0.6s ease;",
    "}",
    ".cursor-reveal.is-active { opacity: 1; }",
    ".cursor-reveal__inner {",
    "  width: 100%;",
    "  height: 100%;",
    "  background: #ffffff;",
    "}",
    "@media (max-width: 768px) { .cursor-reveal { display: none; } }",
    "@media (hover: none) { .cursor-reveal { display: none; } }",
  ].join("\n");
  document.head.appendChild(style);
})();
