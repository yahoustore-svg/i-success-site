/* I-SUCCESS — Main JS */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a:not(.mobile-has-sub)').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Mobile submenu
  document.querySelectorAll('.mobile-has-sub').forEach(t => {
    t.addEventListener('click', e => {
      e.preventDefault();
      t.classList.toggle('open');
      const sub = t.nextElementSibling;
      if (sub) sub.classList.toggle('open');
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('visible'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1600;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * ease).toLocaleString('fr-FR') + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io2.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io2.observe(c));
  }

  // Testimonials slider
  const track = document.querySelector('.testi-track');
  if (track) {
    const slides = track.querySelectorAll('.testi-slide');
    const dotsWrap = document.querySelector('.testi-dots');
    let i = 0;
    const total = slides.length;

    if (dotsWrap) {
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Aller au témoignage ${idx + 1}`);
        dot.addEventListener('click', () => go(idx));
        dotsWrap.appendChild(dot);
      });
    }

    function go(n) {
      i = (n + total) % total;
      track.style.transform = `translateX(-${i * 100}%)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.testi-dot').forEach((d, k) => d.classList.toggle('active', k === i));
      }
    }

    const prev = document.querySelector('.testi-prev');
    const next = document.querySelector('.testi-next');
    if (prev) prev.addEventListener('click', () => go(i - 1));
    if (next) next.addEventListener('click', () => go(i + 1));

    let auto = setInterval(() => go(i + 1), 6000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => auto = setInterval(() => go(i + 1), 6000));
  }

  // Blog filters
  const filterBtns = document.querySelectorAll('.blog-filters button');
  const blogCards = document.querySelectorAll('.blog-grid .blog-card');
  filterBtns.forEach(b => {
    b.addEventListener('click', () => {
      filterBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const cat = b.dataset.cat;
      blogCards.forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // Contact form (placeholder send → WhatsApp)
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const msg = `Bonjour I-SUCCESS,%0A%0A` +
        `Je suis ${encodeURIComponent(data.get('prenom') + ' ' + data.get('nom'))}.%0A` +
        `Pays : ${encodeURIComponent(data.get('pays') || '-')}%0A` +
        `Email : ${encodeURIComponent(data.get('email') || '-')}%0A` +
        `Téléphone : ${encodeURIComponent(data.get('tel') || '-')}%0A` +
        `Niveau : ${encodeURIComponent(data.get('niveau') || '-')}%0A` +
        `Destination : ${encodeURIComponent(data.get('destination') || '-')}%0A%0A` +
        `Message : ${encodeURIComponent(data.get('message') || '-')}`;
      window.open(`https://wa.me/22797596060?text=${msg}`, '_blank');
      form.reset();
      const ok = document.querySelector('.form-success');
      if (ok) { ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 6000); }
    });
  }
});
