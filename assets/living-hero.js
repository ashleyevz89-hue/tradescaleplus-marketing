/* tradescaleplus.com: the living hero's clock (home page only, 25 Nov 2026). See assets/living-hero.css.
   The page writes the picture as its finished still. This script, when motion is allowed, rewinds it and plays it on a
   loop by adding and removing state classes on .lh; every movement is CSS (transform and opacity). It also:
   - types the buyer's words, runs the count down and works the monthly out (text only);
   - sends the signals (small lights) from what the buyer did to the "Your buyers today" card;
   - lights the three parts beside the picture as it plays them, and jumps to one when it is pressed;
   - plays only while the picture is on screen and the tab is in view;
   - hands the visitor over to our own live Website Agent place (#ask) from "Your turn".
   With reduced motion it does the hand-over only: the still stays. */
(function () {
  'use strict';
  var lh = document.querySelector('[data-lh]');
  if (!lh) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return lh.querySelector(s); };

  /* ---------- your turn: over to the real agent ---------- */
  var tryBtn = document.querySelector('[data-lh-try]');
  var ask = document.getElementById('ask');
  if (tryBtn && ask) {
    tryBtn.addEventListener('click', function (e) {
      e.preventDefault();
      ask.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () {
        var box = ask.querySelector('input:not([type="hidden"]), textarea');
        if (box) { try { box.focus({ preventScroll: true }); } catch (err) { box.focus(); } }
        ask.classList.remove('lh-wake');
        void ask.offsetWidth;
        ask.classList.add('lh-wake');
      }, reduce ? 0 : 700);
    });
  }
  if (reduce || !window.requestAnimationFrame || !lh.animate) return;

  var q = $('[data-lh-q]'), count = $('[data-lh-count]'), dep = $('[data-lh-dep]'), mon = $('[data-lh-mon]');
  var sigs = $('.lh-sigs'), scene = $('.lh-scene');
  var actList = document.querySelector('.lh-acts');
  var acts = Array.prototype.slice.call(document.querySelectorAll('[data-lh-act]'));
  var WORDS = q.getAttribute('data-words') || q.textContent;
  var STATES = ['is-send', 'is-found', 'is-pick', 'is-car', 'is-dep', 'is-term', 'is-monthly', 'is-td', 'td-day', 'td-time', 'td-go',
    'b-on', 'r1', 'r2', 'r3', 'r4', 'ai-on', 'ai-q', 'ai-read', 'ai-ans', 'f-data', 'f-ai'];
  var gen = 0, timers = [], running = false;

  var on = function (c) { lh.classList.add(c); };
  var off = function (c) { lh.classList.remove(c); };
  var money = function (v) { return v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var whole = function (v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  /* a figure running from one value to another (text only; the eased curve slows into the answer) */
  var tween = function (el, from, to, ms, fmt, now) {
    if (now) { el.textContent = fmt(to); return; }
    var g = gen, t0 = performance.now();
    var step = function (t) {
      if (g !== gen) return;
      var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* the buyer's words, typed a letter at a time with a person's uneven rhythm */
  var type = function (now) {
    if (now) { q.textContent = WORDS; return; }
    var g = gen, i = 0;
    var next = function () {
      if (g !== gen) return;
      i += 1;
      q.textContent = WORDS.slice(0, i);
      if (i < WORDS.length) setTimeout(next, WORDS.charAt(i - 1) === ' ' ? 95 : 38 + Math.random() * 46);
    };
    next();
  };

  /* a signal: a few lights leave what the buyer touched and arc into the card, then the card's line lands */
  var centre = function (el, fx, fy) {
    var r = el.getBoundingClientRect(), b = lh.getBoundingClientRect();
    return { x: r.left - b.left + r.width * fx, y: r.top - b.top + r.height * fy };
  };
  var signal = function (fromSel, toSel, land, now) {
    if (now) { if (land) land(); return; }
    var from = $(fromSel), to = $(toSel), g = gen;
    if (!from || !to) { if (land) land(); return; }
    var a = centre(from, 0.5, 0.5), b = centre(to, 0.12, 0.5);
    var ms = 780;
    for (var i = 0; i < 5; i += 1) {
      (function (i) {
        var s = document.createElement('i'), u = document.createElement('u'), d = document.createElement('b');
        s.className = 'lh-sig'; u.appendChild(d); s.appendChild(u); sigs.appendChild(s);
        var delay = i * 62, size = 1 - i * 0.15;
        s.animate([{ transform: 'translate3d(' + a.x + 'px,0,0)' }, { transform: 'translate3d(' + b.x + 'px,0,0)' }],
          { duration: ms, delay: delay, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'both' });
        u.animate([{ transform: 'translate3d(0,' + a.y + 'px,0)' }, { transform: 'translate3d(0,' + b.y + 'px,0)' }],
          { duration: ms, delay: delay, easing: 'cubic-bezier(.7,0,.84,.4)', fill: 'both' });
        var fade = d.animate([{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(' + size + ')', offset: 0.14 },
          { opacity: 1, transform: 'scale(' + size + ')', offset: 0.86 }, { opacity: 0, transform: 'scale(.2)' }],
          { duration: ms, delay: delay, easing: 'linear', fill: 'both' });
        fade.onfinish = function () { if (s.parentNode) s.parentNode.removeChild(s); };
      })(i);
    }
    timers.push(setTimeout(function () { if (g === gen && land) land(); }, ms - 60));
  };

  /* which of the three parts is playing (its line fills over the part's length) */
  var act = function (i, ms) {
    acts.forEach(function (b, n) {
      var li = b.parentNode;
      li.classList.remove('x-on');
      if (n === i) { li.style.setProperty('--dur', ms + 'ms'); void li.offsetWidth; li.classList.add('x-on'); }
    });
  };

  /* the film: [when it happens in ms, what happens]. now = true when jumping straight to a later part. */
  var A1 = 8700, A2 = 12300, END = 18600, LOOP = 19700;
  var film = [
    [0, function () { act(0, A1); }],
    [750, function (now) { type(now); }],
    [2250, function (now) { if (!now) on('is-send'); }],
    [2500, function (now) { on('is-found'); tween(count, 52, 6, 950, whole, now); }],
    [2800, function (now) { on('b-on'); signal('.lh-bar .x-in', '.lh-buyers .x-b1', function () { on('r1'); }, now); }],
    [3900, function () { off('is-send'); }],
    [4700, function (now) { if (!now) on('is-pick'); }],
    [5150, function () { on('is-car'); }],
    [5450, function () { off('is-pick'); }],
    [5950, function (now) { on('is-dep'); tween(dep, 0, 1000, 750, whole, now); }],
    [6650, function () { on('is-term'); }],
    [6950, function (now) { on('is-monthly'); tween(mon, 0, 376.5, 950, function (v) { return '£' + money(v); }, now); }],
    [7600, function (now) { signal('.lh-panel .x-mo .x-fig', '.lh-buyers .x-b2', function () { on('r2'); }, now); }],
    [A1, function () { act(1, A2 - A1); on('f-data'); }],
    [9150, function () { on('is-td'); }],
    [9750, function () { on('td-day'); }],
    [10150, function () { on('td-time'); }],
    [10650, function (now) { if (!now) on('td-go'); }],
    [10850, function (now) { signal('.lh-panel .x-td .x-go', '.lh-buyers .x-b3', function () { on('r3'); }, now); }],
    [A2, function () { act(2, END - A2); off('f-data'); off('td-go'); on('ai-on'); on('f-ai'); }],
    [12900, function () { on('ai-q'); }],
    [13600, function (now) { if (!now) { on('ai-read'); signal('.lh-fbar .x-url', '.lh-ai .x-read', null, false); } }],
    [14300, function (now) { if (!now) signal('.lh-fbar .x-url', '.lh-ai .x-read', null, false); }],
    [15000, function () { off('ai-read'); on('ai-ans'); }],
    [15900, function (now) { signal('.lh-ai .x-hd', '.lh-buyers .x-b4', function () { on('r4'); }, now); }],
    [16800, function () { off('f-ai'); }],
    [END, function () { rewind(false); }]
  ];

  /* back to the start: the website as the buyer finds it, the cards empty */
  var rewind = function (snap) {
    if (snap) lh.classList.add('lh-snap');
    STATES.forEach(off);
    q.textContent = '';
    count.textContent = '52';
    dep.textContent = '0';
    mon.textContent = '£0.00';
    if (snap) { void lh.offsetWidth; lh.classList.remove('lh-snap'); }
  };
  var stop = function () {
    gen += 1;
    timers.forEach(clearTimeout);
    timers = [];
    sigs.textContent = '';
    running = false;
  };
  var play = function (from) {
    stop();
    running = true;
    var g = gen;
    rewind(true);
    lh.classList.add('lh-snap');
    film.forEach(function (f) { if (f[0] < from) f[1](true); });
    void lh.offsetWidth;
    lh.classList.remove('lh-snap');
    film.forEach(function (f) {
      if (f[0] >= from) timers.push(setTimeout(function () { if (g === gen) f[1](false); }, f[0] - from));
    });
    timers.push(setTimeout(function () { if (g === gen) play(0); }, LOOP - from));
  };

  lh.classList.add('x-live');
  if (actList) actList.classList.add('x-live');
  rewind(true);
  var starts = [0, A1, A2];
  acts.forEach(function (b, i) { b.addEventListener('click', function () { play(starts[i]); }); });

  /* play only while it can be seen */
  var seen = false, shown = !document.hidden;
  var sync = function () {
    if (seen && shown) { if (!running) play(0); }
    else if (running) { stop(); }
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { seen = en[en.length - 1].isIntersecting; sync(); }, { threshold: 0.25 }).observe(lh);
  } else { seen = true; sync(); }
  document.addEventListener('visibilitychange', function () { shown = !document.hidden; sync(); });

  /* the stage leans a little toward the pointer (wide screens with a mouse only) */
  var wide = window.matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)');
  var hero = lh.closest ? lh.closest('.hero') : null;
  if (hero && scene) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var lean = function () {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      scene.style.setProperty('--mx', cx.toFixed(3));
      scene.style.setProperty('--my', cy.toFixed(3));
      raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(lean) : 0;
    };
    hero.addEventListener('pointermove', function (e) {
      if (!wide.matches) return;
      var r = hero.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / Math.max(1, Math.min(r.height, window.innerHeight)) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(lean);
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(lean); });
  }
})();
