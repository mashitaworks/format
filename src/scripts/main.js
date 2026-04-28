document.addEventListener("DOMContentLoaded", () => {
  // breakpoint
  const mediaQueryList = window.matchMedia("(max-width: 991.98px)");
  mediaQueryList.addEventListener("change", listener);
  listener(mediaQueryList);
  function listener(event) {
    const headerButton = document.querySelector(".layout-header__button");
    const headerMenu = document.getElementById("headerMenu");
    const body = document.body;
    if (event.matches) {
      // SP
      body.classList.remove("is-gnavi-open");
      headerButton.setAttribute('aria-expanded', 'false');
    } else {
      // PC
      body.classList.remove("is-gnavi-open");
      headerButton.setAttribute('aria-expanded', 'false');
    }
  }
  const headerButton = document.querySelector(".layout-header__button");
  const body = document.body;

  headerButton.addEventListener('pointerdown', () => {
    const isOpen = body.classList.toggle("is-gnavi-open");
    headerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".header-menu__list [aria-expanded]");
    if (!toggle) return;

    e.preventDefault();

    // aria-expanded の真偽値を反転
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));

    // 対応するサブメニューを取得
    const subMenu = toggle.nextElementSibling;
    if (!subMenu || !subMenu.classList.contains("header-menu__sub-list"))
      return;

    // スライドアニメーション
    if (!isExpanded) {
      slideDown(subMenu, 300);
    } else {
      slideUp(subMenu, 300);
    }
  });

  const swiperEl = document.querySelector('.swiper');
  if (swiperEl) {
    const slideEls = swiperEl.querySelectorAll('.swiper-slide');
    if (slideEls.length > 1) {
      const swiper = new Swiper(swiperEl, {
        loop: true,
        slidesPerView: 1,
        autoplay: {
          delay: 500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            centeredSlides: false,
          },
          1400: {
            slidesPerView: 'auto',
            centeredSlides: true,
            loopAdditionalSlides: 6,
          },
        },
      });

      // 再生・停止ボタン
      const playBtn = document.getElementById('swiper-play');
      const pauseBtn = document.getElementById('swiper-pause');

      playBtn?.addEventListener('click', () => {
        swiper.autoplay.start();
        swiperEl.classList.remove('paused');
      });

      pauseBtn?.addEventListener('click', () => {
        swiper.autoplay.stop();
        swiperEl.classList.add('paused');
      });
    } else {
      swiperEl.classList.add('is-single');
    }
  }

  //カレント
  const sidebarLink = document.querySelectorAll('.layout-sidebar__list-link');
  if(sidebarLink.length > 1) {

    let nowPath = location.pathname;
    let nowLink = document.querySelectorAll('.layout-sidebar__list-link');
    sidebarLink.forEach(sidebarLink => {
      if(sidebarLink.getAttribute('href') == nowPath) {
        sidebarLink.classList.add("layout-sidebar__list-link--current");
        sidebarLink.setAttribute('aria-current', 'page')
      }
    });
  }

  //tab
  const tabEl = document.querySelectorAll('.tab');
  tabEl.forEach(tabEl => {
    let tab_id = tabEl.getAttribute('id');
    let tab_start = Number(tabEl.getAttribute('data-start')) || 0;
      new A11yTabs(`#${tab_id} .tab__header`, `#${tab_id} .tab__panel`, tab_start);
  });

  //scroll-hint
  new ScrollHint('.scroll-hint', {
    suggestiveShadow: true,
    remainingTime: 5000,
    i18n: {
      scrollable: 'スクロールできます'
    }
  });

  document.addEventListener("click", function (e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    const hash = target.hash;
    if (!hash || hash === "#") {
      e.preventDefault();
      return;
    }
    const id = hash.slice(1);
    const targetElement = document.getElementById(id);
    if (!targetElement) return;

    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
    e.preventDefault();
  });

});

function slideUp(element, duration = 300, callback) {
  const startHeight = element.offsetHeight;
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 〜 1

    // 高さを計算して適用（イージングなしならそのままprogress）
    element.style.height = startHeight * (1 - progress) + 'px';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.style.display = 'none';
      element.style.removeProperty('height');
      if (callback) callback();
    }
  }

  element.style.overflow = 'hidden';
  element.style.height = startHeight + 'px';

  requestAnimationFrame(animate);
}

function slideDown(element, duration = 300, callback) {
  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;
  if (display === 'none') display = 'block';
  element.style.display = display;

  const targetHeight = element.offsetHeight;
  const startTime = performance.now();

  element.style.height = '0';
  element.style.overflow = 'hidden';

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    element.style.height = targetHeight * progress + 'px';

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      if (callback) callback();
    }
  }

  requestAnimationFrame(animate);
}
