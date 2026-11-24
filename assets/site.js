/* tradescaleplus.com: what every page does (24 Nov 2026). One script for all 23 pages.
   Each part runs only where its page has it, and none of the movement runs when the visitor asks for reduced motion:
   1. the top bar's line once scrolled, and the phone menu (focus kept inside it, Escape and any link close it);
   2. blocks fade up once as they come into view, the cards of a grid one after another;
   3. the chapter bar: which chapter is being read, and how far through the walkthrough (on a family of pages it
      only brings the page you are on into view);
   4. the story (static website, two lines of code, awake, driving): the scroll is the clock: every part moves with how far
      the story is scrolled and runs back when scrolled back; without this script the story shows its last step as a still;
   5. tabs (the car panel's tools, the bar's views, the dashboard's views, the reel), with arrow keys;
   6. the leads and the bars draw in when seen; the test drive days are the next five days; the films' chapters;
   7. the install lines copy on a tap;
   8. the loops (short silent cuts of the product) play only while on screen, and stay on their poster with reduced
      motion; figures count up once when seen; the hero's loop rises a little as the page scrolls. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ---------- 1. the top bar and the phone menu ---------- */
  var nav = $('.nav');
  var navState = function () { if (nav) nav.classList.toggle('on', window.scrollY > 8); };
  window.addEventListener('scroll', navState, { passive: true });
  navState();
  var burger = $('.burger'), drawer = $('.drawer');
  if (burger && drawer) {
    var setOpen = function (open, back) {
      drawer.setAttribute('data-open', open ? 'true' : 'false');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { var f = $('a', drawer); if (f) f.focus(); } else if (back) burger.focus();
    };
    burger.addEventListener('click', function () { setOpen(drawer.getAttribute('data-open') !== 'true', false); });
    drawer.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOpen(false, false); });
    document.addEventListener('keydown', function (e) {
      if (drawer.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { setOpen(false, true); return; }
      if (e.key !== 'Tab') return;
      var items = [burger].concat($$('a,button', drawer));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    });
    var wide = window.matchMedia('(min-width: 981px)');
    var shut = function () { if (wide.matches && drawer.getAttribute('data-open') === 'true') setOpen(false, false); };
    if (wide.addEventListener) wide.addEventListener('change', shut); else if (wide.addListener) wide.addListener(shut);
  }

  /* ---------- 2. fade up once, as each block comes into view ---------- */
  var seenOnce = function (els, cls, opts) {
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add(cls); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add(cls); io.unobserve(x.target); } });
    }, opts || { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };
  seenOnce($$('.rv'), 'in');
  seenOnce($$('.leads, .bars, .d-src, .gate'), 'in', { threshold: 0.3 });

  /* the hero's word lights up, as the website does further down */
  var lit = $('.hero .lit');
  if (lit && !reduce) { lit.classList.add('asleep'); setTimeout(function () { lit.classList.remove('asleep'); }, 650); }

  /* ---------- 3. the chapter bar ---------- */
  var bar = $('.chapters');
  if (bar && !$('a[href^="#"]', bar)) {
    /* a family of pages: bring the page you are on into view in the bar */
    var here = $('a[aria-current="page"]', bar), row = $('ol', bar);
    if (here && row && row.scrollWidth > row.clientWidth) row.scrollLeft = Math.max(0, here.offsetLeft - 16);
    bar = null;
  }
  if (bar) {
    var links = $$('a[href^="#"]', bar);
    var parts = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var first = parts[0], list = $('ol', bar), barRaf = 0, current = -1;
    var mark = function () {
      barRaf = 0;
      var mid = window.innerHeight * 0.42, at = 0;
      for (var i = 0; i < parts.length; i++) { if (parts[i] && parts[i].getBoundingClientRect().top <= mid) at = i; }
      if (at !== current) {
        current = at;
        links.forEach(function (a, k) { if (k === at) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        var a = links[at];
        if (list && a && list.scrollWidth > list.clientWidth) {
          list.scrollTo({ left: Math.max(0, a.offsetLeft - 16), behavior: reduce ? 'auto' : 'smooth' });
        }
      }
      var last = parts[parts.length - 1];
      if (first && last) {
        var top = first.getBoundingClientRect().top + window.scrollY;
        var end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        var p = Math.min(1, Math.max(0, (window.scrollY - top + window.innerHeight * 0.4) / Math.max(1, end - top)));
        bar.style.setProperty('--p', p.toFixed(3));
      }
    };
    var ask = function () { if (!barRaf) barRaf = requestAnimationFrame(mark); };
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    mark();
  }

  /* ---------- 4. the story ---------- */
  /* typing that keeps the code's colours: the line's own spans are read once, then drawn up to n characters */
  var segsOf = function (el) {
    return Array.prototype.map.call(el.childNodes, function (n) {
      return n.nodeType === 3 ? { c: '', t: n.nodeValue } : { c: n.className || '', t: n.textContent };
    });
  };
  var draw = function (el, segs, n, caret) {
    var h = '', left = n;
    for (var i = 0; i < segs.length && left > 0; i++) {
      var t = segs[i].t.slice(0, left); left -= segs[i].t.length;
      h += segs[i].c ? '<span class="' + segs[i].c + '">' + esc(t) + '</span>' : esc(t);
    }
    el.innerHTML = h + (caret ? '<i class="caret"></i>' : '');
  };
  var lengthOf = function (segs) { return segs.reduce(function (a, s) { return a + s.t.length; }, 0); };

  $$('.story').forEach(function (story) {
    if (reduce) return;                       /* reduced motion: the still last step, as written in the page */
    var steps = $$('.step', story);
    var lines = $$('[data-type-line]', story).map(function (el) { return { el: el, segs: segsOf(el) }; });
    var words = $$('[data-type-words]', story);
    var said = words.length ? words[0].getAttribute('data-type-words') : '';
    var shownNs = $$('.s-count .c2 b', story);
    var total = lines.reduce(function (a, l) { return a + lengthOf(l.segs); }, 0);
    /* each turning filter and each car its place in the order (--k), for the stagger the stylesheet works out */
    $$('.s-filters', story).forEach(function (f) { $$('.s-f.on', f).forEach(function (el, k) { el.style.setProperty('--k', String(k)); }); });
    $$('.s-grid', story).forEach(function (g) { $$('.car', g).forEach(function (el, k) { el.style.setProperty('--k', String(k)); }); });
    /* the story in four steps, each its own stretch of the scroll (the last the longest: the most happens in it) */
    var STEPS = [[0, .2], [.2, .42], [.42, .64], [.64, 1]];
    var ramp = function (p, a, b) { return p <= a ? 0 : p >= b ? 1 : (p - a) / (b - a); };
    var ease = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
    var set = function (k, v) { story.style.setProperty(k, String(Math.round(v * 1000) / 1000)); };
    var caption = -1, chars = -1, typed = -1, shown = -1;
    /* the two lines, drawn up to n characters across both, the caret on the line being typed */
    var drawCode = function (n) {
      if (n === chars) return;
      chars = n;
      var left = n;
      lines.forEach(function (l) {
        var len = lengthOf(l.segs), m = Math.max(0, Math.min(len, left));
        left -= len;
        draw(l.el, l.segs, m, m > 0 && m < len);
      });
    };
    /* the buyer's words, up to n letters, the caret while typing */
    var sayWords = function (n) {
      if (n === typed) return;
      typed = n;
      words.forEach(function (w) { w.innerHTML = esc(said.slice(0, n)) + (n > 0 && n < said.length ? '<i class="caret"></i>' : ''); });
    };
    /* the stock list's count running down to the cars that fit */
    var showCount = function (n) {
      if (n === shown) return;
      shown = n;
      shownNs.forEach(function (b) { b.textContent = String(n); });
    };
    var go = function (p) {
      var s = p < STEPS[1][0] ? 0 : p < STEPS[2][0] ? 1 : p < STEPS[3][0] ? 2 : 3;
      if (s !== caption) {
        caption = s;
        steps.forEach(function (el, k) { el.classList.toggle('on', k === s); });
        story.setAttribute('data-step', String(s));
      }
      steps.forEach(function (el, k) { el.style.setProperty('--fill', String(k < s ? 1 : k > s ? 0 : Math.round(ramp(p, STEPS[k][0], STEPS[k][1]) * 1000) / 1000)); });
      set('--in', ease(ramp(p, 0, .06)));
      /* 1. a buyer browses the grey stock list, asks about a car, and nobody answers */
      set('--browse', ease(ramp(p, .02, .11)) * (1 - ease(ramp(p, .14, .2))));
      set('--ask', ease(ramp(p, .05, .09)) * (1 - ramp(p, .17, .2)));
      set('--noreply', ease(ramp(p, .11, .135)) * (1 - ramp(p, .17, .2)));
      /* 2. the two lines' card comes up and the lines type as the page scrolls */
      set('--code', ease(ramp(p, .2, .25)) * (1 - ease(ramp(p, .42, .47))));
      drawCode(Math.round(ramp(p, .24, .38) * total));
      /* 3. colour sweeps across the website, car by car, then the agent's bar arrives in the page */
      set('--w', ramp(p, .44, .56));
      set('--bar', ease(ramp(p, .52, .62)));
      /* 4. the buyer's words, the answer, the filters one by one, the count running down, the cars changing */
      sayWords(Math.round(ramp(p, .66, .76) * said.length));
      set('--f', ease(ramp(p, .77, .81)));
      set('--fl', ramp(p, .79, .87));
      var c = ramp(p, .8, .9);
      story.classList.toggle('cnt', c > 0);
      showCount(Math.round(50 - 44 * ease(c)));
      set('--g1', ramp(p, .82, .9));
      set('--g2', ramp(p, .86, .96));
    };
    /* how far the story is scrolled */
    var stage = $('.story-stage', story);
    story.classList.add('run');
    var raf = 0;
    var measure = function () {
      raf = 0;
      var r = story.getBoundingClientRect();
      var span = story.offsetHeight - stage.offsetHeight;
      go(span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0);
    };
    var ask = function () { if (!raf) raf = requestAnimationFrame(measure); };
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    measure();
  });

  /* ---------- 5. tabs ---------- */
  $$('[data-tabs]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    var cap = $('[data-cap]', box);
    var mirrors = $$('[data-view]', box);
    var user = false;
    var select = function (i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) { if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); }
      });
      if (cap && tabs[i].getAttribute('data-say')) cap.innerHTML = tabs[i].getAttribute('data-say');
      /* the bar's own box shows the words that view answers (empty: its example words) */
      var qt = $('[data-q-target]', box);
      if (qt && tabs[i].hasAttribute('data-q')) qt.textContent = tabs[i].getAttribute('data-q');
      var view = tabs[i].getAttribute('aria-controls');
      mirrors.forEach(function (m) { if (m.getAttribute('data-view') === view) m.setAttribute('aria-current', 'true'); else m.removeAttribute('aria-current'); });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { user = true; select(k, false); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!n) return;
        e.preventDefault(); user = true;
        select((k + n + tabs.length) % tabs.length, true);
      });
    });
    var start = tabs.findIndex ? tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }) : 0;
    select(start < 0 ? 0 : start, false);
    /* a box marked data-auto moves on by itself while in view, until the visitor picks one */
    if (box.hasAttribute('data-auto') && !reduce && 'IntersectionObserver' in window) {
      var inView = false, hover = false;
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.4 }).observe(box);
      box.addEventListener('mouseenter', function () { hover = true; });
      box.addEventListener('mouseleave', function () { hover = false; });
      setInterval(function () {
        if (user || hover || !inView || document.hidden) return;
        var at = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
        select((at + 1) % tabs.length, false);
      }, 4200);
    }
  });

  /* ---------- 6. the next five days for a test drive or a viewing (the panel offers days ahead, never past ones); the
     day picked is the first weekday, as the times shown are a weekday's at our example forecourt (9:00 to 18:00) ---------- */
  /* data-skip names the days the business is closed (0 Sunday to 6 Saturday), which are never offered */
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  $$('[data-days]').forEach(function (row) {
    var skip = (row.getAttribute('data-skip') || '').split(',').filter(Boolean).map(Number);
    var now = new Date(), picked = false, ahead = 0;
    $$('span', row).forEach(function (s) {
      var d;
      do { ahead += 1; d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + ahead); } while (skip.indexOf(d.getDay()) >= 0 && ahead < 14);
      s.innerHTML = esc(days[d.getDay()]) + '<small>' + d.getDate() + '</small>';
      var weekday = d.getDay() > 0 && d.getDay() < 6;
      s.classList.toggle('on', weekday && !picked);
      if (weekday) picked = true;
    });
  });

  /* ---------- 6b. the films: a chapter button starts the film at that chapter; the chapter playing is marked; a film
     switched away from is paused ---------- */
  $$('.film-ch button[data-t]').forEach(function (b) {
    var v = document.getElementById(b.getAttribute('data-film'));
    if (!v) return;
    b.addEventListener('click', function () {
      var t = parseFloat(b.getAttribute('data-t')) || 0;
      var go = function () { try { v.currentTime = t; } catch (e) {} var p = v.play(); if (p && p.catch) p.catch(function () {}); };
      if (v.readyState >= 1) go();
      else { v.preload = 'metadata'; v.addEventListener('loadedmetadata', go, { once: true }); v.load(); }
    });
  });
  $$('video').forEach(function (v) {
    var marks = $$('.film-ch button[data-film="' + v.id + '"][data-t]');
    if (!marks.length) return;
    v.addEventListener('timeupdate', function () {
      var at = -1;
      marks.forEach(function (b, k) { if (v.currentTime >= parseFloat(b.getAttribute('data-t')) - 0.5) at = k; });
      marks.forEach(function (b, k) { if (k === at) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    });
  });
  $$('[role="tab"]').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('[role="tabpanel"][hidden] video').forEach(function (v) { if (!v.paused) v.pause(); });
    });
  });

  /* ---------- 7. copy the install lines ---------- */
  $$('[data-copy]').forEach(function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      var src = document.getElementById(b.getAttribute('data-copy'));
      if (!src) return;
      var text = src.innerText.trim();
      var done = function (ok) { b.textContent = ok ? 'Copied' : 'Select and copy'; setTimeout(function () { b.textContent = label; }, 2200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  });

  /* ---------- 8. alive: loops, figures that count up, grids that build, the hero's loop rising ---------- */
  /* the cards of a grid come in one after another; the delay is taken off once each has arrived, so hovers stay quick */
  if (!reduce) {
    $$('.tools, .bento, .setup, .cards, .nextup, .prices, .people, .points, .trylive, .lives, .duo, .film-ch, .lists').forEach(function (grid) {
      var kids = Array.prototype.filter.call(grid.children, function (c) { return c.classList.contains('rv'); });
      kids.forEach(function (c, i) {
        if (!i) return;
        c.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
        c.addEventListener('transitionend', function done() { c.style.transitionDelay = ''; c.removeEventListener('transitionend', done); });
      });
    });
  }

  /* a loop plays while it is on screen, and rests when it is not */
  var loops = $$('video[data-loop]');
  if (loops.length && !reduce && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.12 });
    loops.forEach(function (v) { v.muted = true; lio.observe(v); });
  }

  /* figures count up to what the page says, once, when seen */
  if (!reduce && 'IntersectionObserver' in window) {
    var figs = [];
    $$('.d-figs b, .bigfig, .bn b, [data-count]').forEach(function (el) {
      var node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      var m = /^(\D*?)(\d[\d,]*)(\D*)$/.exec(node.nodeValue.trim());
      if (!m) return;
      var end = parseInt(m[2].replace(/,/g, ''), 10);
      if (!(end > 0)) return;
      figs.push({ el: el, node: node, pre: m[1], end: end, post: m[3], full: node.nodeValue });
    });
    var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
    var fio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        fio.unobserve(x.target);
        var f = figs.filter(function (k) { return k.el === x.target; })[0];
        if (!f) return;
        var t0 = 0, dur = 900;
        var step = function (t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          f.node.nodeValue = p < 1 ? f.pre + fmt(Math.round(f.end * e)) + f.post : f.full;
          if (p < 1) requestAnimationFrame(step);
        };
        f.node.nodeValue = f.pre + '0' + f.post;
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    figs.forEach(function (f) { fio.observe(f.el); });
  }

  /* less on screen: a folded grid shows the rest of its cards on a tap, and the button goes */
  /* whatever a fold reveals is shown at once: its fade-up is marked as already seen */
  var showNow = function (box) {
    $$('.rv', box).forEach(function (e) { e.style.transitionDelay = ''; e.classList.add('in'); });
    $$('.leads, .bars, .d-src, .gate', box).forEach(function (e) { e.classList.add('in'); });
  };
  $$('[data-unfold]').forEach(function (b) {
    b.addEventListener('click', function () {
      var row = b.parentNode, grid = row.closest ? row.closest('[data-fold]') : null;
      if (!grid) { grid = row.previousElementSibling; while (grid && !grid.hasAttribute('data-fold')) grid = grid.previousElementSibling; }
      if (!grid) return;                       /* nothing to open: the button stays, so nothing is lost */
      grid.classList.add('open');
      $$('.folded', grid).forEach(function (f) { f.classList.remove('folded'); f.style.transitionDelay = ''; f.classList.add('in'); showNow(f); });
      row.parentNode.removeChild(row);
    });
  });
  $$('details.more').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) showNow(d); });
  });

  /* the hero's loop rises a little as the page scrolls (transform only) */
  var hl = $('.hero-loop');
  if (hl && !reduce) {
    var hraf = 0;
    var lift = function () { hraf = 0; hl.style.setProperty('--lift', Math.min(48, window.scrollY * 0.07).toFixed(1)); };
    window.addEventListener('scroll', function () { if (!hraf) hraf = requestAnimationFrame(lift); }, { passive: true });
  }
})();
