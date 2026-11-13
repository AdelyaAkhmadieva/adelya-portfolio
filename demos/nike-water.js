/* Water is drawn locally: a perspective puddle, impact sheet and ballistic droplets. */
(() => {
  'use strict';
  const hero = document.querySelector('.nike-hero');
  const shoe = document.querySelector('.nike-product');
  const button = document.querySelector('#nikeJump');
  const back = document.querySelector('.nike-water-back');
  const front = document.querySelector('.nike-water-front');
  if (!hero || !shoe || !button || !back || !front) return;
  const bg = back.getContext('2d');
  const fg = front.getContext('2d');
  if (!bg || !fg) { button.hidden = true; return; }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, groundX = 0, groundY = 0, radius = 0;
  let scale = 1, frameId = 0, startTime = 0, running = false, seen = false;
  let particles = [];
  const duration = 2.65;
  const impactTime = .7;
  function ellipse(ctx, x, y, rx, ry) {
    ctx.beginPath(); ctx.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), 0, 0, Math.PI * 2);
  }
  function resize() {
    width = hero.clientWidth; height = hero.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    [back, front].forEach(canvas => {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    groundX = shoe.offsetLeft + shoe.offsetWidth * .55;
    groundY = shoe.offsetTop + shoe.offsetHeight * .72;
    radius = Math.min(shoe.offsetWidth * .43, width * .32);
    scale = Math.max(.45, Math.min(1.25, shoe.offsetWidth / 700));
    // A fixed seed keeps each replay coherent instead of flickering between frames.
    let seed = 47123;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    particles = Array.from({length: width < 650 ? 64 : 108}, () => {
      const angle = random() * Math.PI * 2;
      const speed = (90 + random() * 230) * scale;
      const vy = -(120 + random() * 330) * scale;
      const gravity = 920 * scale;
      return { x: (random() - .5) * radius * .8, z: Math.sin(angle) * radius * .14,
        vx: Math.cos(angle) * speed, vy, gravity, birth: random() * .11,
        size: (.8 + random() * 2.8) * scale, land: -2 * vy / gravity };
    });
    if (!running) draw(0);
  }
  function puddle(time, age) {
    const stretch = 1 + (running ? Math.sin(Math.min(time / impactTime, 1) * Math.PI) * .06 : 0);
    bg.save(); bg.translate(groundX, groundY); bg.scale(stretch, .19);
    const fill = bg.createRadialGradient(-radius * .15, -8, radius * .03, 0, 0, radius);
    fill.addColorStop(0, 'rgba(218,235,243,.18)');
    fill.addColorStop(.55, 'rgba(106,141,164,.26)');
    fill.addColorStop(.86, 'rgba(66,103,130,.17)');
    fill.addColorStop(1, 'rgba(142,180,201,0)');
    ellipse(bg, 0, 0, radius, radius); bg.fillStyle = fill; bg.fill();
    ellipse(bg, 0, 0, radius * .91, radius * .88);
    bg.strokeStyle = 'rgba(235,249,255,.42)'; bg.lineWidth = 1.1; bg.stroke();
    bg.beginPath(); bg.ellipse(0, 0, radius * .87, radius * .84, 0, .15, Math.PI * .9);
    bg.strokeStyle = 'rgba(67,94,118,.22)'; bg.stroke();
    bg.restore();
    if (age <= 0) return;
    // The rings expand in the water plane, with perspective compression on Y.
    for (let i = 0; i < 4; i++) {
      const t = age - i * .16;
      if (t <= 0 || t > 1.7) continue;
      const r = radius * (.18 + t * .68);
      const opacity = Math.max(0, (1 - t / 1.7) * .5);
      ellipse(bg, groundX, groundY + i, r, r * .17);
      bg.strokeStyle = `rgba(235,250,255,${opacity})`; bg.lineWidth = 1.1; bg.stroke();
      ellipse(bg, groundX, groundY + i + 2, r + 3, r * .17);
      bg.strokeStyle = `rgba(64,98,126,${opacity * .4})`; bg.stroke();
    }
  }
  function impactSheet(age) {
    if (age <= 0 || age > .55) return;
    const progress = age / .55;
    const opacity = (1 - progress) * .38;
    const spread = radius * (.26 + progress * .76);
    const lift = Math.sin(progress * Math.PI) * 62 * scale;
    for (let side = 0; side < 2; side++) {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const theta = i / 20 * Math.PI + side * Math.PI;
        points.push({x: groundX + Math.cos(theta) * spread,
          y: groundY + Math.sin(theta) * spread * .12 - lift * (.25 + .75 * Math.abs(Math.sin(i * 1.9)))});
      }
      fg.beginPath(); fg.moveTo(groundX - spread, groundY);
      fg.lineTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const point = points[i], next = points[i + 1];
        fg.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
      }
      fg.lineTo(groundX + spread, groundY); fg.closePath();
      const glass = fg.createLinearGradient(0, groundY - lift, 0, groundY);
      glass.addColorStop(0, `rgba(233,251,255,${opacity})`);
      glass.addColorStop(.4, `rgba(130,179,204,${opacity * .28})`);
      glass.addColorStop(1, 'rgba(167,209,225,0)');
      fg.fillStyle = glass; fg.fill();
      fg.beginPath(); fg.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const point = points[i], next = points[i + 1];
        fg.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
      }
      fg.strokeStyle = `rgba(241,253,255,${opacity * .9})`; fg.lineWidth = 1; fg.stroke();
    }
  }
  function droplets(age) {
    if (age <= 0) return;
    particles.forEach(p => {
      const t = age - p.birth;
      if (t < 0) return;
      if (t > p.land) {
        const rippleAge = t - p.land;
        if (rippleAge < .45) {
          const x = groundX + p.x + p.vx * p.land;
          ellipse(bg, x, groundY + p.z, (3 + rippleAge * 22) * scale, (1 + rippleAge * 4) * scale);
          bg.strokeStyle = `rgba(236,251,255,${(1 - rippleAge / .45) * .34})`; bg.lineWidth = .7; bg.stroke();
        }
        return;
      }
      const x = groundX + p.x + p.vx * t;
      const y = groundY + p.z + p.vy * t + .5 * p.gravity * t * t;
      const velocityY = p.vy + p.gravity * t;
      const alpha = Math.min(1, t * 25, (p.land - t) * 14) * .83;
      const length = Math.min(3.1, 1 + Math.hypot(p.vx, velocityY) / 300);
      fg.save(); fg.translate(x, y); fg.rotate(Math.atan2(velocityY, p.vx) + Math.PI / 2);
      const lens = fg.createRadialGradient(-p.size * .35, -p.size * .35, 0, 0, 0, p.size * length);
      lens.addColorStop(0, `rgba(255,255,255,${alpha})`);
      lens.addColorStop(.35, `rgba(217,242,255,${alpha * .65})`);
      lens.addColorStop(.7, `rgba(114,159,186,${alpha * .2})`);
      lens.addColorStop(1, `rgba(240,253,255,${alpha * .7})`);
      ellipse(fg, 0, 0, p.size, p.size * length); fg.fillStyle = lens; fg.fill();
      fg.strokeStyle = `rgba(246,254,255,${alpha * .7})`; fg.lineWidth = .5; fg.stroke();
      fg.restore();
    });
  }
  function draw(time) {
    bg.clearRect(0, 0, width, height); fg.clearRect(0, 0, width, height);
    const age = running ? time - impactTime : -1;
    puddle(time, age); impactSheet(age); droplets(age);
    let jumpY = 0;
    if (running && time < .42) jumpY = -Math.sin(time / .42 * Math.PI / 2) * 88 * scale;
    else if (running && time < impactTime) jumpY = -Math.cos((time - .42) / (impactTime - .42) * Math.PI / 2) * 88 * scale;
    else if (running && time < 1.04) jumpY = -Math.sin((time - impactTime) / .34 * Math.PI) * 9 * scale;
    shoe.style.setProperty('--jump-y', jumpY + 'px');
  }
  function stop() {
    cancelAnimationFrame(frameId); running = false;
    shoe.style.setProperty('--jump-y', '0px');
    button.disabled = false;
    button.innerHTML = 'Прыгнуть в лужу <span aria-hidden="true">↗</span>';
    draw(0);
  }
  function frame(now) {
    const elapsed = (now - startTime) / 1000;
    if (elapsed >= duration || document.hidden) { stop(); return; }
    draw(elapsed); frameId = requestAnimationFrame(frame);
  }
  function jump() {
    if (running) return;
    if (reducedMotion.matches) {
      // Show a still impact without motion when the OS requests reduced animation.
      running = true; draw(impactTime + .16); running = false; shoe.style.setProperty('--jump-y', '0px');
      return;
    }
    resize(); running = true; startTime = performance.now(); button.disabled = true;
    button.textContent = 'Прыжок…'; frameId = requestAnimationFrame(frame);
  }
  button.addEventListener('click', jump);
  window.addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) stop(); });
  reducedMotion.addEventListener('change', () => { if (running) stop(); });
  resize();
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      if (!seen && entries.some(entry => entry.isIntersecting)) { seen = true; observer.disconnect(); jump(); }
    }, {threshold:.3});
    observer.observe(hero);
  }
})();
