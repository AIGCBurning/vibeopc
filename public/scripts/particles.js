/**
 * vibeOPC — Hero Canvas Particle System
 * Floating connected particles with mouse interaction
 */
(function () {
  "use strict";

  var canvas, ctx, W, H, dpr;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var PARTICLE_COUNT = 80;
  var CONNECTION_DIST = 140;
  var MOUSE_RADIUS = 200;

  function init() {
    canvas = document.getElementById("hero-particles");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    resize();
    createParticles();

    canvas.parentElement.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    });

    canvas.parentElement.addEventListener("mouseleave", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener("resize", function () {
      resize();
      createParticles();
    });

    requestAnimationFrame(loop);
  }

  function resize() {
    W = canvas.parentElement.clientWidth;
    H = canvas.parentElement.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
  }

  function createParticles() {
    // Adjust count for screen size
    var count = window.innerWidth < 768 ? 40 : PARTICLE_COUNT;
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W * dpr,
        y: Math.random() * H * dpr,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse repulsion
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS * dpr) {
        var force = (1 - dist / (MOUSE_RADIUS * dpr)) * 0.8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Friction
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210,255,0," + p.alpha + ")";
      ctx.fill();
    }

    // Connections
    ctx.lineWidth = 0.5 * dpr;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST * dpr) {
          var alpha = (1 - d / (CONNECTION_DIST * dpr)) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(210,255,0," + alpha + ")";
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
