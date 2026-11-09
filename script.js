/* Mezzolitro vini e cucina: animazioni e interazioni (nessuna libreria) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) root.classList.add('rm');
  var D = window.DATA || {};
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- titoli spezzati in lettere ---------- */
  var charIdx = 0;
  $$('[data-split]').forEach(function (el) {
    var text = el.textContent.trim();
    el.textContent = '';
    var sr = doc.createElement('span'); sr.className = 'sr'; sr.textContent = text; el.appendChild(sr);
    var wrap = doc.createElement('span'); wrap.setAttribute('aria-hidden', 'true');
    text.split(' ').forEach(function (word, wi) {
      if (wi) wrap.appendChild(doc.createTextNode(' '));
      var w = doc.createElement('span'); w.className = 'w';
      for (var i = 0; i < word.length; i++) {
        var ch = doc.createElement('span'); ch.className = 'ch';
        var s = doc.createElement('span'); s.textContent = word.charAt(i); s.style.setProperty('--i', charIdx++);
        s.style.transitionDelay = (Math.min(i, 14) * 55) + 'ms';
        ch.appendChild(s); w.appendChild(ch);
      }
      wrap.appendChild(w);
    });
    el.appendChild(wrap);
    charIdx = 0;
  });

  /* ---------- il nome grande occupa tutta la larghezza ---------- */
  function fitAll() {
    $$('[data-fit]').forEach(function (el) {
      var chars = $$('.ch', el);
      var n = chars.length || el.textContent.trim().length;
      if (n < 2) return;
      var target = el.clientWidth; if (!target) return;
      el.style.fontSize = ''; el.style.letterSpacing = '0px';
      var r = doc.createRange(); r.selectNodeContents(el);
      var w = r.getBoundingClientRect().width;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      var need = w + (n - 1) * 0.13 * fs;
      if (need > target) { fs = fs * target / need; el.style.fontSize = fs + 'px'; el.style.letterSpacing = '0px'; r.selectNodeContents(el); w = r.getBoundingClientRect().width; }
      el.style.letterSpacing = ((target - w) / (n - 1)).toFixed(2) + 'px';
    });
  }
  fitAll();
  if (doc.fonts && doc.fonts.load) {
    Promise.all([doc.fonts.load('200 40px Newsreader'), doc.fonts.load('400 14px Belleza')]).then(fitAll, fitAll);
    if (doc.fonts.addEventListener) doc.fonts.addEventListener('loadingdone', fitAll);
  }
  window.addEventListener('load', fitAll);
  var rzT; window.addEventListener('resize', function () { clearTimeout(rzT); rzT = setTimeout(function () { fitAll(); measurePar(); }, 120); });

  /* ---------- comparsa allo scroll ---------- */
  var revEls = $$('[data-up],[data-split],[data-reveal]');
  $$('#specRow .ph').forEach(function (p, i) { var im = $('img', p); if (im) im.style.transitionDelay = (i * 140) + 'ms'; });
  function show(el) { el.classList.add('is-in'); if (el.hasAttribute('data-count-box')) runCounters(el); }
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revEls.forEach(function (el) { io.observe(el); });
  } else { revEls.forEach(show); }

  /* ---------- contatori ---------- */
  function fmt(v, dec) { return (dec ? v.toFixed(dec) : String(Math.round(v))).replace('.', ','); }
  var counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    $$('[data-count]').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      if (reduce) { el.textContent = fmt(to, dec); return; }
      var t0 = performance.now(), dur = 1800;
      (function step(t) {
        var k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 4);
        el.textContent = fmt(to * e, dec);
        if (k < 1) requestAnimationFrame(step); else el.textContent = fmt(to, dec);
      })(t0);
    });
  }
  var scoreBox = $('.rev__score');
  if (scoreBox && hasIO && !reduce) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { runCounters(); cio.disconnect(); } }); }, { threshold: 0.3 });
    cio.observe(scoreBox);
  }

  /* ---------- parallasse ---------- */
  var pars = $$('.par[data-speed]').map(function (el) { return { el: el, sp: parseFloat(el.getAttribute('data-speed')) || 0, top: 0, h: 0 }; });
  var vh = window.innerHeight, sy = window.scrollY || window.pageYOffset;
  function measurePar() {
    vh = window.innerHeight; sy = window.scrollY || window.pageYOffset;
    pars.forEach(function (p) { p.el.style.transform = ''; var r = p.el.getBoundingClientRect(); p.top = r.top + sy; p.h = r.height; });
    applyPar();
  }
  function applyPar() {
    if (reduce) return;
    var k = window.innerWidth < 900 ? 0.7 : 1.5;
    pars.forEach(function (p) {
      var c = p.top + p.h / 2 - (sy + vh / 2);
      if (Math.abs(c) > vh * 1.4) return;
      p.el.style.transform = 'translate3d(0,' + (-c * p.sp * k).toFixed(1) + 'px,0)';
    });
  }

  /* ---------- scroll: barra, navigazione ---------- */
  var prog = $('#prog'), nav = $('#nav'), lastY = sy, ticking = false, navOpen = false;
  function onScroll() {
    sy = window.scrollY || window.pageYOffset;
    var max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    if (prog) prog.style.transform = 'scaleX(' + clamp(sy / max, 0, 1).toFixed(4) + ')';
    if (nav && !navOpen) {
      nav.classList.toggle('nav--solid', sy > 30);
      if (sy > 220 && sy - lastY > 6) nav.classList.add('nav--hide');
      else if (sy - lastY < -6 || sy < 220) nav.classList.remove('nav--hide');
    }
    lastY = sy; applyPar(); ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('load', function () { measurePar(); onScroll(); });

  var navBtn = $('#navBtn'), drawer = $('#drawer');
  function setDrawer(open) {
    navOpen = open;
    nav.classList.toggle('nav--open', open); drawer.classList.toggle('drawer--open', open);
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    navBtn.setAttribute('aria-label', open ? 'Chiudi il menu di navigazione' : 'Apri il menu di navigazione');
    doc.body.style.overflow = open ? 'hidden' : '';
    if (!open) onScroll();
  }
  if (navBtn && drawer) {
    navBtn.addEventListener('click', function () { setDrawer(!navOpen); });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navOpen) setDrawer(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900 && navOpen) setDrawer(false); });
  }
  var toTop = $('#toTop');
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- menu ---------- */
  var menuTabs = $('#menuTabs'), menuList = $('#menuList'), menuImg = $('#menuImg'), cur = 0;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function renderMenu(i, anim) {
    var cat = D.menu[i]; if (!cat) return; cur = i;
    $$('button', menuTabs).forEach(function (b, k) { var on = k === i; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    menuList.innerHTML = cat.items.map(function (it, k) {
      return '<div class="dish' + (it[1] ? '' : ' dish--plain') + '" style="--i:' + k + '"><h3>' + esc(it[0]) + '</h3>' + (it[1] ? '<p>' + esc(it[1]) + '</p>' : '') + (it[2] ? '<b>' + esc(it[2]) + '</b>' : '') + '</div>';
    }).join('');
    if (menuImg) {
      var src = 'img/' + cat.img + '.webp';
      if (menuImg.getAttribute('src') !== src) {
        menuImg.setAttribute('src', src);
        if (anim && !reduce && menuImg.animate) menuImg.animate([{ clipPath: 'inset(0 0 100% 0)', transform: 'scale(1.18)' }, { clipPath: 'inset(0 0 0% 0)', transform: 'scale(1)' }], { duration: 1000, easing: 'cubic-bezier(.77,0,.18,1)' });
      }
    }
  }
  if (menuTabs && D.menu) {
    D.menu.forEach(function (c, i) {
      var b = doc.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = c.name;
      b.addEventListener('click', function () { renderMenu(i, true); });
      b.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (k) { e.preventDefault(); var n = (cur + k + D.menu.length) % D.menu.length; renderMenu(n, true); $$('button', menuTabs)[n].focus(); }
      });
      menuTabs.appendChild(b);
    });
    renderMenu(0, false);
  }

  /* ---------- cantina ---------- */
  var wl = $('#wineList');
  if (wl && D.wine) {
    wl.innerHTML = D.wine.map(function (s) {
      return '<div class="wsec"><h4>' + esc(s.t) + '</h4>' + s.rows.map(function (r) {
        return '<div class="wrow"><strong>' + esc(r[0]) + '</strong>' + (r[1] ? '<em>' + esc(r[1]) + '</em>' : '') + '<b>' + esc(r[2]) + '</b></div>';
      }).join('') + '</div>';
    }).join('');
  }

  /* ---------- orari e "aperto ora" (ora di Milano) ---------- */
  function romeNow() {
    try {
      var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()), o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      var dow = { Sun: 6, Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5 }[o.weekday];
      return { d: dow, m: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { var n = new Date(); return { d: (n.getDay() + 6) % 7, m: n.getHours() * 60 + n.getMinutes() }; }
  }
  function hm(m) { return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2); }
  var hl = $('#hoursList'), on = $('#openNow');
  function renderHours() {
    if (!D.hours) return;
    var now = romeNow();
    if (hl) hl.innerHTML = D.hours.map(function (h, i) {
      return '<li' + (i === now.d ? ' class="today"' : '') + '><span>' + h.d + '</span><span>' + (h.slots.length ? h.slots.map(function (s) { return hm(s[0]) + '–' + hm(s[1]); }).join(' · ') : 'Chiuso') + '</span></li>';
    }).join('');
    if (!on) return;
    var today = D.hours[now.d].slots, openSlot = null;
    today.forEach(function (s) { if (now.m >= s[0] && now.m < s[1]) openSlot = s; });
    on.className = 'open';
    if (openSlot) { on.classList.add('on'); on.querySelector('span').textContent = 'Aperto ora, fino alle ' + hm(openSlot[1]); return; }
    on.classList.add('off');
    var label = 'Chiuso';
    for (var k = 0; k < 7; k++) {
      var di = (now.d + k) % 7, slots = D.hours[di].slots;
      for (var j = 0; j < slots.length; j++) {
        if (k > 0 || slots[j][0] > now.m) { label = 'Chiuso, riapre ' + (k === 0 ? 'oggi' : k === 1 ? 'domani' : D.hours[di].d.toLowerCase()) + ' alle ' + hm(slots[j][0]); k = 8; break; }
      }
    }
    on.querySelector('span').textContent = label;
  }
  renderHours(); setInterval(renderHours, 60000);

  /* ---------- la tavola che gira ---------- */
  function initRing() {
    var stick = $('#ringStick'); if (!stick || !D.dishes) return;
    var wheel = $('#ringWheel'), disc = $('#ringDisc'), plates = $('#ringPlates'), cap = $('#ringCapBox'), num = $('#ringNum'), nm = $('#ringName'), dots = $('#ringDots'),
      svg = $('#ringSvg'), path = $('#ringPath'), tp = $('#ringTP'), SUS = D.dishes, n = SUS.length, TH = 30, items = [], ccur = 0, tgt = 0, ready = false, lastI = -1, G = {},
      running = false, lastTouch = performance.now();
    SUS.forEach(function (d, k) {
      var f = doc.createElement('figure'); f.className = 'ring__plate';
      var im = new Image(); im.src = 'img/' + d[0] + '.webp'; im.alt = d[1]; im.width = 760; im.height = 760; im.draggable = false; f.appendChild(im);
      f.addEventListener('click', function () { goTo(k); }); plates.appendChild(f); items.push(f);
      var b = doc.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', d[1]); b.addEventListener('click', function () { goTo(k); }); dots.appendChild(b);
    });
    var dotBtns = $$('button', dots);
    function goTo(k) { lastTouch = performance.now(); var base = Math.round(tgt), c0 = ((base % n) + n) % n, d = k - c0; if (d > n / 2) d -= n; if (d < -n / 2) d += n; tgt = base + d; }
    function geom() {
      var W = stick.clientWidth, H = stick.clientHeight, big = W >= 900;
      var Da = big ? Math.min(W * 0.32, H * 0.38, 420) : Math.min(W * 0.66, H * 0.36, 430), head = big ? 190 : 150;
      var R = big ? Math.min(W * 0.62, 900) : W * 0.86, ya = head + Da * 0.78 + 4;
      G = { W: W, H: H, Da: Da, R: R, ya: ya, cx: W / 2, cy: ya + R, Rd: R + Da * 0.78, Rt: R + Da * 0.66 };
      wheel.style.left = G.cx + 'px'; wheel.style.top = G.cy + 'px';
      disc.style.width = disc.style.height = (2 * G.Rd) + 'px';
      var L = 2 * Math.PI * G.Rt; svg.setAttribute('viewBox', '0 0 ' + (2 * G.Rd) + ' ' + (2 * G.Rd));
      path.setAttribute('d', 'M ' + (G.Rd - G.Rt) + ' ' + G.Rd + ' a ' + G.Rt + ' ' + G.Rt + ' 0 1 1 ' + (2 * G.Rt) + ' 0 a ' + G.Rt + ' ' + G.Rt + ' 0 1 1 ' + (-2 * G.Rt) + ' 0');
      var base = SUS.map(function (d) { return d[1].toUpperCase(); }).join('  ·  ') + '  ·  ', t = ''; while (t.length < 300) t += base;
      tp.textContent = t; tp.setAttribute('textLength', L.toFixed(1)); tp.setAttribute('lengthAdjust', 'spacing');
      items.forEach(function (f) { f.style.width = G.Da + 'px'; });
      cap.style.top = (G.ya + G.Da * 0.5 + (big ? 28 : 34)) + 'px';
      ready = true;
    }
    var drag = false, lx = 0, lt = 0, vel = 0, moved = 0, PX = 1;
    function pxUnit() { return Math.max(120, G.Da * 0.85); }
    stick.addEventListener('pointerdown', function (e) {
      moved = 0;
      if (e.target.closest('button,a')) return;
      drag = true; lx = e.clientX; lt = performance.now(); vel = 0; PX = pxUnit(); lastTouch = lt; stick.classList.add('drag');
      try { stick.setPointerCapture(e.pointerId); } catch (_) {}
    });
    stick.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - lx, now = performance.now(), dt = Math.max(1, now - lt); lx = e.clientX; lt = now; lastTouch = now; moved += Math.abs(dx);
      tgt -= dx / PX; ccur = tgt; vel = 0.8 * vel + 0.2 * (-dx / PX / dt);
    });
    function end() { if (!drag) return; drag = false; stick.classList.remove('drag'); lastTouch = performance.now(); tgt = Math.round(tgt + clamp(vel * 260, -3, 3)); }
    stick.addEventListener('pointerup', end); stick.addEventListener('pointercancel', end);
    stick.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) { e.preventDefault(); lastTouch = performance.now(); tgt = Math.round(tgt) + (e.deltaX > 0 ? 1 : -1); }
    }, { passive: false });
    stick.addEventListener('click', function (e) { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
    stick.tabIndex = 0; stick.setAttribute('role', 'group');
    stick.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { lastTouch = performance.now(); tgt = Math.round(tgt) + 1; } if (e.key === 'ArrowLeft') { lastTouch = performance.now(); tgt = Math.round(tgt) - 1; } });
    var nameT;
    function render(now) {
      if (!ready) geom();
      if (!reduce && !drag && now - lastTouch > 4200) { tgt = Math.round(tgt) + 1; lastTouch = now; }
      ccur = (reduce || drag) ? tgt : ccur + (tgt - ccur) * 0.14; if (Math.abs(tgt - ccur) < 0.0004) ccur = tgt;
      disc.style.transform = 'translate(-50%,-50%) rotate(' + (-ccur * TH).toFixed(3) + 'deg)';
      var sFar = 0.6;
      items.forEach(function (f, k) {
        var d = k - ccur; d = d - n * Math.round(d / n); var ad = Math.abs(d), e = 1 - clamp(ad, 0, 1), s = sFar + (1 - sFar) * (e * e * (3 - 2 * e));
        f.style.transform = 'translate(-50%,-50%) rotate(' + (d * TH).toFixed(3) + 'deg) translateY(' + (-G.R).toFixed(1) + 'px) rotate(' + (-d * TH).toFixed(3) + 'deg) scale(' + s.toFixed(4) + ')';
        var op = ad < 1 ? 1 - 0.35 * ad : (ad < 2 ? 0.65 - 0.3 * (ad - 1) : 0.35 * clamp(3 - ad, 0, 1));
        f.style.opacity = op.toFixed(3);
        f.style.zIndex = Math.round(100 - ad * 10); f.style.filter = ad < 0.5 ? '' : 'brightness(' + (1 - clamp(ad, 0, 1.5) * 0.14).toFixed(2) + ')';
      });
      var ii = ((Math.round(ccur) % n) + n) % n;
      if (ii !== lastI) {
        var first = lastI < 0; lastI = ii;
        num.textContent = (ii < 9 ? '0' : '') + (ii + 1) + ' / 0' + n;
        dotBtns.forEach(function (b, k) { b.classList.toggle('on', k === ii); });
        if (first || reduce) nm.textContent = SUS[ii][1];
        else { nm.style.opacity = '0'; nm.style.transform = 'translateY(8px)'; clearTimeout(nameT); nameT = setTimeout(function () { nm.textContent = SUS[ii][1]; nm.style.opacity = '1'; nm.style.transform = 'none'; }, 220); }
      }
    }
    function loop(now) { if (!running) return; render(now); requestAnimationFrame(loop); }
    function start() { if (running) return; running = true; lastTouch = performance.now(); requestAnimationFrame(loop); }
    if (hasIO) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else running = false; }); }, { rootMargin: '120px 0px' }).observe(stick);
    } else start();
    window.addEventListener('resize', function () { ready = false; });
    geom(); ccur = tgt; render(performance.now());
  }
  initRing();

  measurePar(); onScroll();
})();
