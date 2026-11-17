(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 720px)").matches;

  const TREE_SVG = `
    <svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="foliage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1f7a45"/>
          <stop offset="55%" stop-color="#146338"/>
          <stop offset="100%" stop-color="#0b4024"/>
        </linearGradient>
        <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8b5a2b"/>
          <stop offset="100%" stop-color="#5c3a1a"/>
        </linearGradient>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff7c2"/>
          <stop offset="55%" stop-color="#ffd24a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="80" cy="208" rx="54" ry="10" fill="rgba(255,255,255,0.55)"/>
      <rect x="72" y="178" width="16" height="28" rx="3" fill="url(#trunk)"/>
      <path d="M80 18 L118 78 H42 Z" fill="url(#foliage)"/>
      <path d="M80 48 L132 118 H28 Z" fill="url(#foliage)"/>
      <path d="M80 88 L148 178 H12 Z" fill="url(#foliage)"/>
      <path class="star" d="M80 8 l4.2 10.2 11-.8-8.4 7.2 3.4 10.4L80 29.2 69.8 34.8l3.4-10.4-8.4-7.2 11 .8Z" fill="url(#starGlow)" filter="url(#softGlow)"/>
      <circle class="ornament" cx="68" cy="70" r="4.2" fill="#e11d48"/>
      <circle class="ornament" cx="96" cy="86" r="3.8" fill="#fbbf24"/>
      <circle class="ornament" cx="58" cy="112" r="4.4" fill="#38bdf8"/>
      <circle class="ornament" cx="104" cy="124" r="4" fill="#f472b6"/>
      <circle class="ornament" cx="74" cy="142" r="4.6" fill="#facc15"/>
      <circle class="ornament" cx="48" cy="156" r="3.8" fill="#fb7185"/>
      <circle class="ornament" cx="112" cy="158" r="4.2" fill="#a78bfa"/>
      <circle class="light" cx="80" cy="58" r="2.2" fill="#ffe08a"/>
      <circle class="light" cx="62" cy="96" r="2.2" fill="#ff6b81"/>
      <circle class="light" cx="100" cy="104" r="2.2" fill="#7ef0c3"/>
      <circle class="light" cx="70" cy="128" r="2.2" fill="#89d4ff"/>
      <circle class="light" cx="92" cy="148" r="2.2" fill="#ffd36b"/>
      <circle class="light" cx="54" cy="168" r="2.2" fill="#ff8fab"/>
      <circle class="light" cx="108" cy="170" r="2.2" fill="#c4b5fd"/>
      <path d="M42 78 Q80 68 118 78" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1.4"/>
      <path d="M34 118 Q80 104 126 118" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
      <path d="M24 158 Q80 140 136 158" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.6"/>
    </svg>
  `;

  function createLayer() {
    if (document.querySelector(".festive-layer")) return;

    const layer = document.createElement("div");
    layer.className = "festive-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <div class="festive-garland"></div>
      <div class="festive-banner" role="status">
        <span class="festive-banner-icon" aria-hidden="true">✦</span>
        <span>Merry Christmas &amp; Happy New Year</span>
        <button type="button" aria-label="Dismiss festive greeting">×</button>
      </div>
      <canvas id="festive-sky"></canvas>
      <div class="festive-tree festive-tree--left">${TREE_SVG}</div>
      <div class="festive-tree festive-tree--right">${TREE_SVG.replace(/id="/g, 'id="r-').replace(/url\(#/g, "url(#r-")}</div>
      <div class="festive-snow-mound"></div>
    `;
    document.body.appendChild(layer);

    const dismiss = layer.querySelector(".festive-banner button");
    const banner = layer.querySelector(".festive-banner");
    dismiss?.addEventListener("click", () => {
      banner.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      banner.style.opacity = "0";
      banner.style.transform = "translate(-50%, -12px)";
      setTimeout(() => banner.remove(), 280);
    });
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function initSky() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById("festive-sky");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = true;
    let last = performance.now();
    let fireworkCooldown = 900;

    const snowCount = isMobile ? 70 : 140;
    const flakes = [];
    const rockets = [];
    const sparks = [];

    const fireworkPalette = [
      ["#ff4d6d", "#ffd166", "#fff1c1"],
      ["#22c55e", "#a3e635", "#ecfccb"],
      ["#38bdf8", "#818cf8", "#e0e7ff"],
      ["#f59e0b", "#fb7185", "#fef3c7"],
      ["#e879f9", "#67e8f9", "#fdf4ff"],
      ["#ffffff", "#ffd700", "#ff6b6b"]
    ];

    function resize() {
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnFlakes() {
      flakes.length = 0;
      for (let i = 0; i < snowCount; i += 1) {
        flakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: random(0.8, isMobile ? 2.4 : 3.2),
          speed: random(18, 58),
          drift: random(-18, 18),
          wobble: random(0, Math.PI * 2),
          wobbleSpeed: random(0.6, 1.8),
          opacity: random(0.35, 0.95)
        });
      }
    }

    function launchRocket() {
      const x = random(width * 0.12, width * 0.88);
      const targetY = random(height * 0.12, height * 0.42);
      rockets.push({
        x,
        y: height + 10,
        vx: random(-28, 28),
        vy: random(-420, -320),
        targetY,
        trail: [],
        color: pick(fireworkPalette)[0],
        life: 1
      });
    }

    function explode(x, y, palette) {
      const count = isMobile ? 48 : 86;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + random(-0.08, 0.08);
        const speed = random(60, 240);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: random(0.75, 1.35),
          maxLife: 1.35,
          size: random(1.2, 2.8),
          color: pick(palette),
          gravity: random(48, 90),
          drag: random(0.965, 0.985),
          sparkle: Math.random() > 0.65
        });
      }

      // Secondary glitter ring
      for (let i = 0; i < (isMobile ? 18 : 28); i += 1) {
        const angle = random(0, Math.PI * 2);
        const speed = random(20, 90);
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: random(0.4, 0.9),
          maxLife: 0.9,
          size: random(0.8, 1.6),
          color: "#ffffff",
          gravity: 20,
          drag: 0.97,
          sparkle: true
        });
      }
    }

    function update(dt) {
      fireworkCooldown -= dt * 1000;
      if (fireworkCooldown <= 0 && rockets.length < (isMobile ? 1 : 2)) {
        launchRocket();
        fireworkCooldown = random(isMobile ? 2200 : 1400, isMobile ? 4200 : 2800);
      }

      for (let i = flakes.length - 1; i >= 0; i -= 1) {
        const f = flakes[i];
        f.wobble += f.wobbleSpeed * dt;
        f.y += f.speed * dt;
        f.x += (f.drift + Math.sin(f.wobble) * 12) * dt;
        if (f.y > height + 8) {
          f.y = -8;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const r = rockets[i];
        r.vy += 90 * dt;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.trail.push({ x: r.x, y: r.y, life: 1 });
        if (r.trail.length > 12) r.trail.shift();
        for (const t of r.trail) t.life -= dt * 2.4;

        if (r.y <= r.targetY || r.vy >= -20) {
          explode(r.x, r.y, pick(fireworkPalette));
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.vy += s.gravity * dt;
        s.vx *= s.drag;
        s.vy *= s.drag;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
        if (s.life <= 0) sparks.splice(i, 1);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const f of flakes) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const r of rockets) {
        for (const t of r.trail) {
          if (t.life <= 0) continue;
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 220, 140, ${clamp(t.life, 0, 1) * 0.55})`;
          ctx.arc(t.x, t.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = r.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const s of sparks) {
        const alpha = clamp(s.life / s.maxLife, 0, 1);
        ctx.beginPath();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        if (s.sparkle) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
        }
        ctx.arc(s.x, s.y, s.size * (0.6 + alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    function frame(now) {
      if (!running) return;
      const dt = clamp((now - last) / 1000, 0.001, 0.033);
      last = now;
      update(dt);
      draw();
      requestAnimationFrame(frame);
    }

    function onVisibility() {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        requestAnimationFrame(frame);
      }
    }

    resize();
    spawnFlakes();
    window.addEventListener("resize", () => {
      resize();
      spawnFlakes();
    });
    document.addEventListener("visibilitychange", onVisibility);
    requestAnimationFrame(frame);

    // Opening celebration burst
    setTimeout(() => {
      explode(width * 0.5, height * 0.28, fireworkPalette[5]);
      if (!isMobile) {
        explode(width * 0.28, height * 0.22, fireworkPalette[0]);
        explode(width * 0.72, height * 0.24, fireworkPalette[2]);
      }
    }, 500);
  }

  function boot() {
    createLayer();
    initSky();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
