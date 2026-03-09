// =============================================
// vibeOPC — Hero WebGL Shader (Simplex Noise Flow)
// Lime/purple gradient with mouse influence + scroll distortion
// =============================================
(function () {
  "use strict";

  var canvas = document.getElementById("hero-shader");
  if (!canvas) return;
  if (window.innerWidth <= 768 || !window.matchMedia("(hover:hover)").matches) {
    canvas.style.display = "none";
    return;
  }

  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  var mx = 0.5, my = 0.5, scrollY = 0;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  });
  window.addEventListener("scroll", function () {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }, { passive: true });

  var vertSrc = [
    "attribute vec2 a_pos;",
    "void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }"
  ].join("\n");

  var fragSrc = [
    "precision mediump float;",
    "uniform vec2 u_res;",
    "uniform float u_time;",
    "uniform vec2 u_mouse;",
    "uniform float u_scroll;",
    "",
    "// Simplex-like noise",
    "vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }",
    "vec2 mod289v2(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }",
    "vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }",
    "",
    "float snoise(vec2 v){",
    "  const vec4 C = vec4(0.211324865405187, 0.366025403784439,",
    "                      -0.577350269189626, 0.024390243902439);",
    "  vec2 i = floor(v + dot(v, C.yy));",
    "  vec2 x0 = v - i + dot(i, C.xx);",
    "  vec2 i1;",
    "  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
    "  vec4 x12 = x0.xyxy + C.xxzz;",
    "  x12.xy -= i1;",
    "  i = mod289v2(i);",
    "  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));",
    "  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
    "  m = m*m; m = m*m;",
    "  vec3 x = 2.0 * fract(p * C.www) - 1.0;",
    "  vec3 h = abs(x) - 0.5;",
    "  vec3 ox = floor(x + 0.5);",
    "  vec3 a0 = x - ox;",
    "  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);",
    "  vec3 g;",
    "  g.x = a0.x * x0.x + h.x * x0.y;",
    "  g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
    "  return 130.0 * dot(m, g);",
    "}",
    "",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / u_res;",
    "  float aspect = u_res.x / u_res.y;",
    "  vec2 p = vec2(uv.x * aspect, uv.y);",
    "",
    "  // Mouse influence on flow center",
    "  vec2 mouse = vec2(u_mouse.x * aspect, u_mouse.y);",
    "  float mouseDist = length(p - mouse);",
    "  float mouseInfluence = smoothstep(1.2, 0.0, mouseDist) * 0.3;",
    "",
    "  // Scroll distortion",
    "  float scrollDist = u_scroll * 0.0003;",
    "",
    "  // Layered noise",
    "  float t = u_time * 0.15;",
    "  float n1 = snoise(p * 1.5 + vec2(t, t * 0.7) + scrollDist);",
    "  float n2 = snoise(p * 3.0 + vec2(-t * 0.5, t * 1.2) + mouseInfluence);",
    "  float n3 = snoise(p * 5.0 + vec2(t * 0.3, -t * 0.4));",
    "  float n = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;",
    "",
    "  // Color: lime (#D2FF00) → purple (#ca457b) gradient",
    "  vec3 lime = vec3(0.82, 1.0, 0.0);",
    "  vec3 purple = vec3(0.79, 0.27, 0.48);",
    "  vec3 dark = vec3(0.067, 0.067, 0.07);",
    "",
    "  float blend = smoothstep(-0.3, 0.6, n + mouseInfluence);",
    "  vec3 col = mix(lime, purple, blend);",
    "",
    "  // Fade to dark at edges and based on noise",
    "  float vignette = 1.0 - smoothstep(0.3, 1.5, length(uv - 0.5) * 2.0);",
    "  float alpha = smoothstep(-0.5, 0.3, n) * vignette * 0.12;",
    "  alpha += mouseInfluence * 0.08;",
    "",
    "  col = mix(dark, col, alpha);",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function createShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Shader compile error:", gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  var vs = createShader(gl.VERTEX_SHADER, vertSrc);
  var fs = createShader(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  // Fullscreen quad
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  var aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "u_res");
  var uTime = gl.getUniformLocation(prog, "u_time");
  var uMouse = gl.getUniformLocation(prog, "u_mouse");
  var uScroll = gl.getUniformLocation(prog, "u_scroll");

  function resize() {
    var dpr = Math.min(window.devicePixelRatio, 1.5);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener("resize", resize);

  var startTime = performance.now();
  var running = true;

  function frame() {
    if (!running) return;
    var t = (performance.now() - startTime) * 0.001;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mx, 1.0 - my);
    gl.uniform1f(uScroll, scrollY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }

  // IntersectionObserver: pause when off-screen
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running) frame();
    }, { threshold: 0 }).observe(canvas);
  }

  frame();
})();
