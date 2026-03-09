// =============================================
// vibeOPC — Three.js 3D Vision Scene
// TorusKnot + noise displacement + lime wireframe
// Mouse rotation + scroll deformation
// =============================================
(function () {
  "use strict";

  var canvas = document.getElementById("vision3d-canvas");
  if (!canvas) return;

  // Graceful degradation: skip on mobile
  if (window.innerWidth <= 768) {
    canvas.style.display = "none";
    return;
  }

  // Wait for Three.js to load
  if (typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 5;

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  // TorusKnot geometry
  var geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32, 2, 3);

  // Store original positions for displacement
  var posAttr = geometry.attributes.position;
  var origPositions = new Float32Array(posAttr.array.length);
  origPositions.set(posAttr.array);

  // Wireframe material with lime color
  var material = new THREE.MeshBasicMaterial({
    color: 0xD2FF00,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  // Solid material for glow
  var glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xD2FF00,
    transparent: true,
    opacity: 0.03,
    side: THREE.DoubleSide,
  });

  var mesh = new THREE.Mesh(geometry, material);
  var glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
  glowMesh.scale.set(1.03, 1.03, 1.03);

  scene.add(mesh);
  scene.add(glowMesh);

  // Purple accent torus
  var accent = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.5, 0.15, 128, 16, 3, 5),
    new THREE.MeshBasicMaterial({ color: 0xca457b, wireframe: true, transparent: true, opacity: 0.12 })
  );
  scene.add(accent);

  var mx = 0, my = 0, scrollProgress = 0;

  document.addEventListener("mousemove", function (e) {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("scroll", function () {
    var section = document.getElementById("vision3d");
    if (!section) return;
    var rect = section.getBoundingClientRect();
    scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height || 1)));
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener("resize", resize);

  // Simple 3D noise approximation
  function noise3D(x, y, z) {
    return Math.sin(x * 1.2 + z) * Math.cos(y * 1.5 + x) * Math.sin(z * 0.8 + y);
  }

  var running = false;

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    var t = performance.now() * 0.001;

    // Mouse-driven rotation
    mesh.rotation.x += (my * 0.3 - mesh.rotation.x) * 0.03;
    mesh.rotation.y += (mx * 0.5 - mesh.rotation.y) * 0.03;
    mesh.rotation.z = t * 0.05;

    glowMesh.rotation.copy(mesh.rotation);

    accent.rotation.x = -mesh.rotation.x * 0.5 + t * 0.02;
    accent.rotation.y = -mesh.rotation.y * 0.5 + t * 0.03;

    // Noise displacement on vertices
    var displace = 0.15 + scrollProgress * 0.3;
    var arr = posAttr.array;
    for (var i = 0; i < arr.length; i += 3) {
      var ox = origPositions[i];
      var oy = origPositions[i + 1];
      var oz = origPositions[i + 2];
      var n = noise3D(ox * 2 + t * 0.5, oy * 2 + t * 0.3, oz * 2 + t * 0.4);
      arr[i] = ox + ox * n * displace;
      arr[i + 1] = oy + oy * n * displace;
      arr[i + 2] = oz + oz * n * displace;
    }
    posAttr.needsUpdate = true;

    // Opacity changes on scroll
    material.opacity = 0.25 + scrollProgress * 0.2;

    renderer.render(scene, camera);
  }

  // IntersectionObserver for performance
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running) animate();
    }, { threshold: 0 }).observe(canvas);
  } else {
    running = true;
    animate();
  }

  resize();
})();
