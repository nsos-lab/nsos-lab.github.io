/* ============================================================
   NSOS Lab — Shared Visual Enhancement Script
   Drives hero orbs, scroll reveal, 3D tilt, nav glow.
   Content-neutral. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Inject hero glow orbs (once, inside every .hero) */
  var heroes = document.querySelectorAll('.hero');
  heroes.forEach(function (hero) {
    if (hero.querySelector('.viz-orb')) return;
    var o1 = document.createElement('div');
    o1.className = 'viz-orb viz-orb-1';
    var o2 = document.createElement('div');
    o2.className = 'viz-orb viz-orb-2';
    hero.appendChild(o1);
    hero.appendChild(o2);
  });

  /* 2. Scroll reveal: mark, then observe */
  var SEL = '.member,.pub,.qcard,.card,.phil,.tcard,.section-kicker,.section-lead,.section-title,.join-inner,.team-group,.pub-year';
  var targets = Array.prototype.slice.call(document.querySelectorAll(SEL));
  targets.forEach(function (el) { el.classList.add('viz-reveal'); });

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('viz-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('viz-visible'); });
  }

  /* 3. 3D tilt on compact cards (not long pub rows) */
  if (!reduce) {
    var tilt = Array.prototype.slice.call(document.querySelectorAll('.member,.qcard,.card,.phil,.tcard'));
    tilt.forEach(function (card) {
      card.classList.add('sweep');
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5;
        var y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(800px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-3px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* 4. Nav glow on scroll */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 5. Back-to-top button (ensure one exists) */
  if (!document.getElementById('back-to-top')) {
    var b = document.createElement('button');
    b.id = 'back-to-top';
    b.setAttribute('aria-label', 'Back to top');
    b.innerHTML = '&uarr;';
    b.style.cssText = 'position:fixed;right:28px;bottom:28px;z-index:99;width:44px;height:44px;border-radius:50%;border:1px solid #E4E9F0;background:#fff;color:#FF5E3A;font-size:18px;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;box-shadow:0 4px 16px rgba(10,37,64,.18)';
    document.body.appendChild(b);
    window.addEventListener('scroll', function () {
      var on = window.scrollY > 400;
      b.style.opacity = on ? '1' : '0';
      b.style.pointerEvents = on ? 'auto' : 'none';
    }, { passive: true });
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
