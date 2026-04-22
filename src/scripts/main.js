document.addEventListener("DOMContentLoaded", function () {
  initProductImageSlider();
  initFVSlider();
  initScrollObserve();

  const mediaQuery = window.matchMedia("(max-width: 991.98px)");
  const headerButton = document.querySelector(".header-button");
  const body = document.body;

  function updateNavigation(event) {
    if (event.matches) {
      body.classList.remove("is-gnavi-open");
      headerButton.setAttribute("aria-expanded", "false");
      headerButton.style.display = "";
    } else {
      body.classList.remove("is-gnavi-open");
      headerButton.setAttribute("aria-expanded", "false");
      headerButton.style.display = "none";
    }
  }

  updateNavigation(mediaQuery);
  mediaQuery.addEventListener("change", updateNavigation);
  headerButton.addEventListener("pointerdown", () => {
    if (!mediaQuery.matches) return;

    const isOpen = body.classList.toggle("is-gnavi-open");
    headerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // PCメニュー
  const menuWrappers = document.querySelectorAll(".js-mega-menu");
  menuWrappers.forEach((wrapper) => {
    const triggers = wrapper.querySelectorAll(".js-mega-menu-trigger");
    const targets = wrapper.querySelectorAll(".js-mega-menu-target");

    // トリガーにホバーで対応ターゲットを開く
    triggers.forEach((trigger) => {
      const targetId = trigger.getAttribute("aria-controls");
      const target = document.getElementById(targetId);

      if (!target) return;

      trigger.addEventListener("click", (e) => {
        if (mediaQuery.matches) return;

        e.preventDefault();
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        // すべて閉じる
        closeAll(triggers, targets);

        if (!isExpanded) {
          trigger.setAttribute("aria-expanded", "true");
          target.classList.add("is-open");
        }
      });
    });

  });

  function closeAll(triggers, targets) {
    triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
    targets.forEach((t) => t.classList.remove("is-open"));
  }

});

function initProductImageSlider() {
  const mainImg = document.querySelector(".main-product__image-main img");
  const subLis = document.querySelectorAll(".main-product__image-sub li");
  if (!mainImg || subLis.length === 0) {
    return;
  }

  const subImgs = document.querySelectorAll(".main-product__image-sub img");
  const leftArrow = document.querySelector(".arrow-left");
  const rightArrow = document.querySelector(".arrow-right");
  const colorLinks = document.querySelectorAll(".main-product__description__color a");

  const urlParams = new URLSearchParams(window.location.search);
  const color = urlParams.get("color");
  let currentIndex = 0;

  if (color === "brick") {
    currentIndex = 12;
  } else if (color === "beige") {
    currentIndex = 6;
  } else {
    currentIndex = 0;
  }

  updateMainImage();

  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + subLis.length) % subLis.length;
      updateMainImage();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % subLis.length;
      updateMainImage();
    });
  }

  subImgs.forEach((img, index) => {
    img.addEventListener("click", function () {
      currentIndex = index;
      updateMainImage();
    });
  });

  
  function updateMainImage() {
    const selectedImg = subLis[currentIndex]?.querySelector("img");
    if (mainImg && selectedImg) {
      mainImg.src = selectedImg.src;
      mainImg.alt = selectedImg.alt;
    }
    subLis.forEach((li, index) => {
      li.classList.toggle("is-select", index === currentIndex);
    });
    updateColorSelection();
  }

  function updateColorSelection() {
    if (colorLinks.length === 0) {
      return;
    }

    colorLinks.forEach((link) => link.classList.remove("is-select"));
    let selectedIndex = 0;

    if (currentIndex >= 12) {
      selectedIndex = 2;
    } else if (currentIndex >= 6) {
      selectedIndex = 1;
    }

    if (colorLinks[selectedIndex]) {
      colorLinks[selectedIndex].classList.add("is-select");
    }
  }

  colorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const colorName = link.querySelector("p")?.textContent?.trim();
      if (colorName === "White") {
        currentIndex = 0;
      } else if (colorName === "Beige") {
        currentIndex = 6;
      } else if (colorName === "Brick") {
        currentIndex = 12;
      }
      updateMainImage();
    });
  });
}

function initScrollObserve() {
  const sections = document.querySelectorAll('.section');
  
  // オプション：画面の下から何px入ったら発火させるか
  const options = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
}

function initFVSlider() {
  const slides = document.querySelectorAll(".fv-slide");
  const counter = document.querySelector(".fv-counter");
  const prevBtn = document.querySelector(".fv-prev");
  const nextBtn = document.querySelector(".fv-next");
  const pauseBtn = document.querySelector(".fv-pause");
  if (slides.length === 0 || !counter || !prevBtn || !nextBtn || !pauseBtn) {
    return;
  }

  let currentSlide = 0;
  let intervalId;
  let isPaused = false;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    counter.textContent = `${index + 1}/${slides.length}`;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function startAutoSlide() {
    intervalId = setInterval(nextSlide, 10000);
  }

  function stopAutoSlide() {
    clearInterval(intervalId);
  }

  function togglePause() {
    if (isPaused) {
      startAutoSlide();
      pauseBtn.classList.remove("paused");
      isPaused = false;
    } else {
      stopAutoSlide();
      pauseBtn.classList.add("paused");
      isPaused = true;
    }
  }

  showSlide(currentSlide);
  startAutoSlide();

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
  pauseBtn.addEventListener("click", togglePause);
}