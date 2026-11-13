document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  /* ===== MODO DARK (localStorage + prefers-color-scheme) ===== */
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (isDark) => {
    body.classList.toggle("dark", isDark);
    themeIcon.classList.toggle("fa-moon", !isDark);
    themeIcon.classList.toggle("fa-sun", isDark);
    toggleBtn.setAttribute("aria-pressed", String(isDark));
  };

  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* sin acceso a localStorage */ }
  applyTheme(saved ? saved === "dark" : media.matches);

  toggleBtn.addEventListener("click", () => {
    const isDark = !body.classList.contains("dark");
    applyTheme(isDark);
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
  });

  // Si el usuario no eligió manualmente, sigue el cambio del sistema
  media.addEventListener("change", (e) => {
    let manual = null;
    try { manual = localStorage.getItem("theme"); } catch (err) {}
    if (!manual) applyTheme(e.matches);
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });

      // Cierra el menú en móvil
      const menu = document.getElementById("menu");
      if (menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ===== FORMULARIO SIMULADO ===== */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("¡Mensaje enviado! 📧");
    form.reset();
  });

  /* ===== EFECTO DE ESCRITURA EN EL HERO ===== */
  const typedEl = document.getElementById("typed");
  const roles = ["Mejora de procesos", "Control de calidad", "Gestión de inventarios", "Logística"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let r = 0, c = 0, deleting = false;

  const type = () => {
    const word = roles[r];
    typedEl.textContent = word.substring(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(type, 90); }
    else if (!deleting) { deleting = true; setTimeout(type, 1400); }
    else if (c > 0) { c--; setTimeout(type, 45); }
    else { deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300); }
  };
  if (reduceMotion) typedEl.textContent = roles[0]; else type();

  /* ===== APARICIÓN AL HACER SCROLL + CONTADORES ===== */
  const animateCounter = (el) => {
    const target = Number(el.dataset.target);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".counter").forEach(animateCounter);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* ===== EXPERIENCIA: SELECCIÓN AL PASAR EL CURSOR ===== */
  const expRow = document.getElementById("experienceRow");
  const expCards = document.querySelectorAll(".experience-card");
  const select = (card) => {
    expCards.forEach((c) => c.classList.toggle("selected", c === card));
    expRow.classList.add("has-selection");
  };
  const clearSelection = () => {
    expCards.forEach((c) => c.classList.remove("selected"));
    expRow.classList.remove("has-selection");
  };
  expCards.forEach((card) => {
    card.addEventListener("mouseenter", () => select(card));
    card.addEventListener("mouseleave", clearSelection);
    card.addEventListener("focus", () => select(card));
    card.addEventListener("blur", clearSelection);
  });

  /* ===== BARRA DE PROGRESO Y BOTÓN VOLVER ARRIBA ===== */
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    backToTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});