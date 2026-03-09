// =============================================
// vibeOPC — Showcase Visuals (Programmatic Canvas Art)
// 5 unique abstract patterns for showcase cards
// =============================================
(function () {
  "use strict";

  var canvases = document.querySelectorAll("[data-showcase-canvas]");
  if (!canvases.length) return;

  var dpr = Math.min(window.devicePixelRatio, 2);
  var animFrames = [];

  canvases.forEach(function (canvas, index) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var w, h;
    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();

    var running = false;
    var startTime = performance.now();

    var drawFns = [drawNeuralNet, drawGeometricStack, drawPulseWave, drawGrid, drawRadialRays];
    var drawFn = drawFns[index % drawFns.length];

    function frame() {
      if (!running) return;
      var t = (performance.now() - startTime) * 0.001;
      ctx.clearRect(0, 0, w, h);
      drawFn(ctx, w, h, t);
      requestAnimationFrame(frame);
    }

    // IntersectionObserver for performance
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) frame();
      }, { threshold: 0 }).observe(canvas);
    } else {
      running = true;
      frame();
    }

    window.addEventListener("resize", function () {
      resize();
    });
  });

  // ─── Pattern 1: Neural Network ───
  function drawNeuralNet(ctx, w, h, t) {
    var nodes = [];
    var cols = 6;
    var rows = 5;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        var x = (i + 0.5) * (w / cols) + Math.sin(t * 0.8 + i * 1.2 + j) * 12;
        var y = (j + 0.5) * (h / rows) + Math.cos(t * 0.6 + j * 1.5 + i) * 10;
        nodes.push({ x: x, y: y, col: i, row: j });
      }
    }

    // Draw connections
    ctx.lineWidth = 0.5;
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        if (Math.abs(nodes[a].col - nodes[b].col) <= 1 && Math.abs(nodes[a].row - nodes[b].row) <= 1) {
          var dist = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
          var alpha = Math.max(0, 0.3 - dist * 0.002) * (0.5 + 0.5 * Math.sin(t + a * 0.2));
          ctx.strokeStyle = "rgba(210,255,0," + alpha + ")";
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (var n = 0; n < nodes.length; n++) {
      var pulse = 0.4 + 0.6 * Math.sin(t * 1.5 + n * 0.7);
      var r = 2 + pulse * 2;
      ctx.fillStyle = "rgba(210,255,0," + (0.3 + pulse * 0.4) + ")";
      ctx.beginPath();
      ctx.arc(nodes[n].x, nodes[n].y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ─── Pattern 2: Geometric Stack ───
  function drawGeometricStack(ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var layers = 8;

    for (var i = layers; i >= 0; i--) {
      var s = 30 + i * 20 + Math.sin(t * 0.5 + i * 0.4) * 10;
      var rot = t * 0.3 * (i % 2 === 0 ? 1 : -1) + i * 0.3;
      var alpha = 0.06 + (i / layers) * 0.12;

      ctx.save();
      ctx.translate(cx + Math.sin(t * 0.3 + i) * 8, cy + Math.cos(t * 0.4 + i) * 6);
      ctx.rotate(rot);

      var sides = 4 + (i % 3);
      ctx.strokeStyle = i % 2 === 0 ? "rgba(210,255,0," + alpha + ")" : "rgba(202,69,123," + alpha + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var j = 0; j <= sides; j++) {
        var angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
        var px = Math.cos(angle) * s;
        var py = Math.sin(angle) * s;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  // ─── Pattern 3: Pulse Wave ───
  function drawPulseWave(ctx, w, h, t) {
    var waves = 5;
    for (var wave = 0; wave < waves; wave++) {
      var alpha = 0.08 + wave * 0.04;
      var color = wave % 2 === 0 ? "210,255,0" : "159,161,223";
      ctx.strokeStyle = "rgba(" + color + "," + alpha + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (var x = 0; x <= w; x += 3) {
        var nx = x / w;
        var y = h / 2 +
          Math.sin(nx * 6 + t * (1 + wave * 0.3) + wave * 1.2) * (30 + wave * 12) +
          Math.sin(nx * 12 + t * 2.5 + wave) * (8 + wave * 3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Pulse dots
    for (var d = 0; d < 3; d++) {
      var dx = ((t * 60 + d * w / 3) % (w + 40)) - 20;
      var dy = h / 2 + Math.sin(dx / w * 6 + t + d) * 42;
      var pa = 0.4 + 0.3 * Math.sin(t * 3 + d);
      ctx.fillStyle = "rgba(210,255,0," + pa + ")";
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ─── Pattern 4: Grid ───
  function drawGrid(ctx, w, h, t) {
    var spacing = 28;
    var cols = Math.ceil(w / spacing) + 1;
    var rows = Math.ceil(h / spacing) + 1;

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        var x = i * spacing;
        var y = j * spacing;
        var dist = Math.hypot(x - w / 2, y - h / 2);
        var wave = Math.sin(dist * 0.03 - t * 1.5) * 0.5 + 0.5;
        var alpha = wave * 0.35;
        var r = 1 + wave * 2;

        ctx.fillStyle = "rgba(210,255,0," + alpha + ")";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Central glow
    var grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
    grad.addColorStop(0, "rgba(210,255,0,0.04)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // ─── Pattern 5: Radial Rays ───
  function drawRadialRays(ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var rayCount = 24;
    var maxLen = Math.max(w, h) * 0.6;

    for (var i = 0; i < rayCount; i++) {
      var angle = (i / rayCount) * Math.PI * 2 + t * 0.2;
      var len = maxLen * (0.4 + 0.6 * Math.sin(t * 0.8 + i * 0.5));
      var alpha = 0.04 + 0.08 * Math.sin(t + i * 0.8);

      var ex = cx + Math.cos(angle) * len;
      var ey = cy + Math.sin(angle) * len;

      var grad = ctx.createLinearGradient(cx, cy, ex, ey);
      grad.addColorStop(0, "rgba(210,255,0," + (alpha * 2) + ")");
      grad.addColorStop(1, "rgba(210,255,0,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // Central orb
    var pulse = 0.5 + 0.5 * Math.sin(t * 2);
    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20 + pulse * 15);
    glow.addColorStop(0, "rgba(210,255,0," + (0.15 + pulse * 0.1) + ")");
    glow.addColorStop(1, "rgba(210,255,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 30 + pulse * 15, 0, Math.PI * 2);
    ctx.fill();
  }
})();
