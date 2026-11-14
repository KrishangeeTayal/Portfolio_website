/* ==========================================================================
   Krishangee Tayal — portfolio behaviour
   No dependencies. Progressive enhancement: the page works with JS off.

   FORM PROVIDERS — pick one, all free:
     'auto'      (default) web3forms key if set, else Netlify Forms on a
                 .netlify.app host, else a pre-filled mail app.
     'netlify'   Netlify Forms — free & unlimited on current plans. Works
                 with JS off too.
     'web3forms' Free relay (250 submissions/month, no card). Works on any
                 host: Vercel, Cloudflare Pages, GitHub Pages, Surge…
     'mailto'    Opens the visitor's mail app with the message pre-filled.
                 Zero dependencies, works everywhere.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    formProvider: 'web3forms',                     // 'auto' | 'netlify' | 'web3forms' | 'mailto'
    web3formsEndpoint: 'https://api.web3forms.com/submit',
    web3formsAccessKey: 'e4a3fc6b-aa96-4d04-9977-1ee21d9b7e5e',                   // free key from https://web3forms.com
    contactEmail: 'krishangeetayal@gmail.com',
    subject: 'Hello from your portfolio'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ header */
  var head = document.getElementById('siteHead');
  if (head) {
    var ticking = false;
    var applyHead = function () {
      head.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    };
    applyHead();
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(applyHead); ticking = true; }
    }, { passive: true });
  }

  /* --------------------------------------------------- scroll progress */
  var progress = document.querySelector('.site-head__progress i');
  if (progress) {
    var pTick = false;
    var applyProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      pTick = false;
    };
    applyProgress();
    window.addEventListener('scroll', function () {
      if (!pTick) { window.requestAnimationFrame(applyProgress); pTick = true; }
    }, { passive: true });
    window.addEventListener('resize', applyProgress);
  }

  /* ------------------------------------------------------- mobile nav */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1023) setNav(false);
    });
  }

  /* ------------------------------------------------------ scroll spy */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );
  var spyTargets = spyLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function updateSpy() {
    var marker = window.scrollY + 100;
    var current = null;
    spyTargets.forEach(function (t) {
      var top = t.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) current = t.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = spyTargets.length ? spyTargets[spyTargets.length - 1].id : null;
    }
    spyLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (spyTargets.length) {
    updateSpy();
    var spyTick = false;
    window.addEventListener('scroll', function () {
      if (!spyTick) { window.requestAnimationFrame(function () { updateSpy(); spyTick = false; }); spyTick = true; }
    }, { passive: true });
    window.addEventListener('resize', updateSpy);
  }

  /* -------------------------------------------------------- count-up stats
     A number that counts from zero to its real value the first time it
     scrolls into view. The final text is already in the markup, so with
     JavaScript off — or reduced motion on — the true figure simply shows. */
  var counterFor = function (el) {
    var raw = el.getAttribute('data-count');
    var target = parseFloat(raw);
    if (isNaN(target)) return;
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    var dur = 1500, start = null;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    };
    window.requestAnimationFrame(step);
  };

  /* ------------------------------------------------------- scroll reveals
     Each [data-reveal] element fades and rises the first time it enters the
     viewport, then stops being observed. Elements already in view on load
     reveal immediately.                                                 */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    var show = function (el) {
      el.classList.add('is-in');
      var list = el.hasAttribute('data-count') ? [el] : [];
      if (el.querySelectorAll) {
        list = list.concat(Array.prototype.slice.call(el.querySelectorAll('[data-count]')));
      }
      list.forEach(function (t) {
        if (t.getAttribute('data-counted')) return;
        t.setAttribute('data-counted', '1');
        counterFor(t);
      });
    };
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(show);
    } else {
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          show(entry.target);
          revealer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(function (el) { revealer.observe(el); });
    }
  }

  /* ------------------------------------------- hero pin + About handoff
     The hero pins inside the viewport while the About section rises over
     it, so the About literally takes the place of the first page — and the
     photo goes with it. On phones the hero is taller than the screen, so
     there it simply fades as it leaves.                                  */
  var heroStage = document.querySelector('.hero-stage');
  var heroEl = document.getElementById('top');
  var aboutEl = document.getElementById('about');
  var runwayEl = heroStage ? heroStage.querySelector('.hero-runway') : null;
  var narrowMQ = window.matchMedia('(max-width: 899px)');
  var clamp01 = function (n) { return n < 0 ? 0 : (n > 1 ? 1 : n); };

  if (heroStage && heroEl) {
    /* The hero is scaled down only when it is taller than the viewport, so
       the pinned hero always fits on screen without changing its layout. */
    var fitHero = function () {
      if (narrowMQ.matches) {
        heroEl.style.setProperty('--hero-fit', '1');
        heroStage.style.removeProperty('--pin-h');
        document.body.classList.remove('has-handoff');
        return;
      }
      var vh = window.innerHeight;
      var h = heroEl.offsetHeight;
      var fit = h > 0 ? Math.min(1, (vh - 8) / h) : 1;
      heroEl.style.setProperty('--hero-fit', fit.toFixed(4));
      heroStage.style.setProperty('--pin-h', (h * fit).toFixed(1) + 'px');
      document.body.classList.add('has-handoff');
    };
    fitHero();
    window.addEventListener('resize', fitHero);

    if (aboutEl && !reduceMotion) {
      var hTick = false;
      var applyHandoff = function () {
        var vh = window.innerHeight;
        var p;
        if (narrowMQ.matches) {
          /* phones: the hero dissolves as it leaves the screen */
          var hr = heroEl.getBoundingClientRect();
          p = (vh * 1.12 - hr.bottom) / (vh * 0.62);
        } else {
          /* desktop: the About sheet rises over the pinned hero, and the
             hero dissolves with it — the first page becomes the second */
          var edge = aboutEl.getBoundingClientRect().top;
          p = (vh - edge) / (vh * 0.55);
        }
        heroStage.style.setProperty('--handoff', clamp01(p).toFixed(4));
        heroStage.style.setProperty('--scrolled', clamp01(window.scrollY / 70).toFixed(4));
        hTick = false;
      };
      applyHandoff();
      window.addEventListener('scroll', function () {
        if (!hTick) { window.requestAnimationFrame(applyHandoff); hTick = true; }
      }, { passive: true });
      window.addEventListener('resize', applyHandoff);
    }
  }

  /* -------------------------------------------------------- contact form */
  var form = document.querySelector('[data-form="contact"]');
  var status = document.getElementById('formStatus');

  function say(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-ok', 'is-error');
    if (kind) status.classList.add(kind);
  }

  function onNetlify() {
    return /(^|\.)netlify\.app$/i.test(window.location.hostname);
  }

  function resolveProvider() {
    if (CONFIG.formProvider !== 'auto') return CONFIG.formProvider;
    if (CONFIG.web3formsAccessKey) return 'web3forms';
    if (onNetlify()) return 'netlify';
    return 'mailto';
  }

  function mailtoFallback(name, email, message) {
    var subject = CONFIG.subject + ' — from ' + name;
    var body = message + '\n\n—\n' + name + '\n' + email;
    window.location.assign(
      'mailto:' + CONFIG.contactEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body)
    );
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      e.preventDefault();

      var provider = resolveProvider();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      var name = data.name || 'Someone';
      var email = data.email || '';
      var message = data.message || '';

      if (provider === 'mailto') {
        say('Opening your mail app…');
        mailtoFallback(name, email, message);
        return;
      }

      var submit = form.querySelector('button[type="submit"]');
      if (submit) { submit.disabled = true; submit.style.opacity = '.65'; }
      say('Sending…');

      if (provider === 'web3forms') {
        var payload = {
          access_key: CONFIG.web3formsAccessKey,
          subject: CONFIG.subject,
          from_name: name,
          replyto: email,
          name: name,
          email: email,
          message: message,
          botcheck: data['bot-field'] || ''
        };
        fetch(CONFIG.web3formsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            if (res.ok && res.j && res.j.success) {
              form.reset();
              say('Thanks — your message is on its way.', 'is-ok');
            } else {
              say((res.j && res.j.message) || 'Could not send. Please email me directly.', 'is-error');
            }
          })
          .catch(function () {
            say('Network problem. Please email me directly.', 'is-error');
          })
          .then(function () {
            if (submit) { submit.disabled = false; submit.style.opacity = ''; }
          });
        return;
      }

      /* Netlify Forms — native endpoint, works on any Netlify host. */
      var body = new URLSearchParams();
      body.append('form-name', 'contact');
      Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            say('Thanks — your message is on its way.', 'is-ok');
          } else {
            say('Could not send. Please email me directly.', 'is-error');
          }
        })
        .catch(function () {
          say('Network problem. Please email me directly.', 'is-error');
        })
        .then(function () {
          if (submit) { submit.disabled = false; submit.style.opacity = ''; }
        });
    });
  }

  /* -------------------------------------------------- reduced motion */
  if (reduceMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
})();
