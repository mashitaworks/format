document.addEventListener("DOMContentLoaded", () => {
  initBreakpoint();
  initHamburger();
  initAccordion();
  initSwiper();
  initCurrentLink();
  initTabs();
  initScrollHint();
  initSmoothScroll();
});

/* ===============================
  Breakpoint
=============================== */
function initBreakpoint() {
  const mql = window.matchMedia("(max-width: 991.98px)");
  mql.addEventListener("change", handleChange);
  handleChange(mql);

  function handleChange(e) {
    const headerButton = document.querySelector(".layout-header__button");
    if (!headerButton) return;

    document.body.classList.remove("is-gnavi-open");
    headerButton.setAttribute("aria-expanded", "false");
  }
}

/* ===============================
  Hamburger
=============================== */
function initHamburger() {
  const button = document.querySelector(".layout-header__button");
  if (!button) return;

  button.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("is-gnavi-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ===============================
  Accordion
=============================== */
function initAccordion() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-accordion-trigger]");
    if (!toggle) return;

    e.preventDefault();

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));

    const targetId = toggle.dataset.target;
    const panel = document.getElementById(targetId);
    if (!panel) return;

    isOpen ? slideUp(panel) : slideDown(panel);
  });
}

/* ===============================
  Swiper
=============================== */
function initSwiper() {
  const el = document.querySelector(".swiper");
  if (!el) return;

  // 二重初期化防止
  if (el.classList.contains("swiper-initialized")) return;

  const slides = el.querySelectorAll(".swiper-slide");
  if (slides.length <= 1) {
    el.classList.add("is-single");
    return;
  }

  const swiper = new Swiper(el, {
    loop: true,
    slidesPerView: 1,
    autoplay: {
      delay: 50000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        const labels = ["product", "magazine", "works"]; // 任意

        return `<span class="${className} swiper-pagination-text">
          ${labels[index] || index + 1}
        </span>`;
      },
    },
    navigation: {
      clickable: false,
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1400: {
        slidesPerView: "auto",
        centeredSlides: true,
        loopAdditionalSlides: 6,
      },
    },
  });

  bindSwiperControls(swiper, el);
}

function bindSwiperControls(swiper, el) {
  const play = document.getElementById("swiper-play");
  const pause = document.getElementById("swiper-pause");

  play?.addEventListener("click", () => {
    swiper.autoplay.start();
    el.classList.remove("paused");
  });

  pause?.addEventListener("click", () => {
    swiper.autoplay.stop();
    el.classList.add("paused");
  });
}

/* ===============================
  Current Link
=============================== */
function initCurrentLink() {
  const links = document.querySelectorAll(".layout-sidebar__list-link");
  if (!links.length) return;

  const current = location.pathname.replace(/\/$/, "");

  links.forEach((link) => {
    const href = link.getAttribute("href")?.replace(/\/$/, "");
    if (href === current) {
      link.classList.add("layout-sidebar__list-link--current");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ===============================
  Tabs
=============================== */
function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    const id = tab.id;
    const start = Number(tab.dataset.start) || 0;

    new A11yTabs(`#${id} .tab__header`, `#${id} .tab__panel`, start);
  });
}

/* ===============================
  ScrollHint
=============================== */
function initScrollHint() {
  if (!document.querySelector(".scroll-hint")) return;

  new ScrollHint(".scroll-hint", {
    suggestiveShadow: true,
    remainingTime: 5000,
    i18n: { scrollable: "スクロールできます" },
  });
}

/* ===============================
  Smooth Scroll
=============================== */
function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.hash.slice(1);
    if (!id) return e.preventDefault();

    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const header = document.querySelector("header");
    const offset = header?.offsetHeight || 0;

    const top =
      target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  });
  
}

/* ===============================
  Animation Utils
=============================== */
function slideUp(el, duration = 300) {
  const start = el.offsetHeight;
  const startTime = performance.now();

  el.style.overflow = "hidden";

  requestAnimationFrame(function animate(time) {
    const p = Math.min((time - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);

    el.style.height = start * (1 - ease) + "px";

    if (p < 1) {
      requestAnimationFrame(animate);
    } else {
      el.style.display = "none";
      el.style.removeProperty("height");
      el.style.removeProperty("overflow");
    }
  });
}

function slideDown(el, duration = 300) {
  el.style.display = "block";
  const end = el.offsetHeight;
  const startTime = performance.now();

  el.style.height = "0";
  el.style.overflow = "hidden";

  requestAnimationFrame(function animate(time) {
    const p = Math.min((time - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);

    el.style.height = end * ease + "px";

    if (p < 1) {
      requestAnimationFrame(animate);
    } else {
      el.style.removeProperty("height");
      el.style.removeProperty("overflow");
    }
  });
}