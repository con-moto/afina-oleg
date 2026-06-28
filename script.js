// ---------- INTRO + HERO + SCROLL REVEAL (без музыки) ----------

document.addEventListener('DOMContentLoaded', () => {
  const initScrollReveal = () => {
    const revealSections = document.querySelectorAll(
      '.hero2, .hero, .intro-text-block, .section--calendar, .section--location, .section--celebration, .section--countdown, .section--timing-custom, .section--guest-form, .section--hotels, .section--wishes'
    );

    if (!revealSections.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          threshold: 0.25,
        }
      );

      revealSections.forEach((sec) => revealObserver.observe(sec));
    } else {
      revealSections.forEach((sec) => sec.classList.add('is-visible'));
    }
  };

  // HERO + TIMING scroll animations (точечные)
  const initHeroAndTimingAnimations = () => {
    // HERO: имена, дата, счётчик
    const hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      // начальное состояние для hero-компонентов
      hero.classList.add('hero-scroll-init');

      const heroObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              hero.classList.remove('hero-scroll-init');
              hero.classList.add('hero-scroll-visible');
              obs.unobserve(hero);
            }
          });
        },
        {
          root: null,
          threshold: 0.3,
        }
      );

      heroObserver.observe(hero);
    }

    // TIMING: шахматный порядок
    const timingSection = document.querySelector('.section--timing');
    if (timingSection && 'IntersectionObserver' in window) {
      timingSection.classList.add('timeline-scroll-init');

      const timingObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              timingSection.classList.remove('timeline-scroll-init');
              timingSection.classList.add('timeline-scroll-visible');
              obs.unobserve(timingSection);
            }
          });
        },
        {
          root: null,
          threshold: 0.2,
        }
      );

      timingObserver.observe(timingSection);
    }
  };

  const startPageAnimations = () => {
    initScrollReveal();
    initHeroAndTimingAnimations();
  };

  const intro = document.querySelector('.intro-screen');
  const introHint = document.querySelector('.intro-tap-hint');

  if (intro) {
    const startExperience = async () => {
      if (startExperience.started) return;
      startExperience.started = true;

      intro.classList.add('card-out');
      intro.classList.add('hide-hint');

      const finishIntro = () => {
        intro.classList.add('is-hidden');
        setTimeout(() => {
          intro.style.display = 'none';
          startPageAnimations();
        }, 600);
      };

      const card = intro.querySelector('.intro-card');
      if (card) {
        card.addEventListener('transitionend', finishIntro, { once: true });
      } else {
        setTimeout(finishIntro, 900);
      }
    };

    const trigger = () => startExperience();

    intro.addEventListener('touchend', trigger, { once: true });
    intro.addEventListener('pointerdown', trigger, { once: true });
    intro.addEventListener('click', trigger, { once: true });

    if (introHint) {
      introHint.addEventListener('touchend', trigger, { once: true });
      introHint.addEventListener('pointerdown', trigger, { once: true });
      introHint.addEventListener('click', trigger, { once: true });
    }
  } else {
    startPageAnimations();
  }
});

// ---------- COUNTDOWN ----------

(function () {
  const targetDate = new Date("2026-10-19T00:00:00+03:00").getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  function updateCountdown() {
    const now = Date.now();
    let diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      clearInterval(timerId);
      return;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(secs);
  }

  updateCountdown();
  const timerId = setInterval(updateCountdown, 1000);
})();

// ---------- TIMELINE ORDER ON MOBILE (<=902px) ----------

(function () {
  const BREAKPOINT = 902;
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  const leftCol = timeline.querySelector(".timeline__col--left");
  const rightCol = timeline.querySelector(".timeline__col--right");
  if (!leftCol || !rightCol) return;

  const itemsOrderDesktop = {
    left: Array.from(leftCol.children),
    right: Array.from(rightCol.children),
  };

  const MOBILE_ORDER = ["15:30", "16:20", "17:00", "22:00"];

  let isMobileApplied = false;

  function applyMobileOrder() {
    if (isMobileApplied) return;
    isMobileApplied = true;

    const allItems = [...itemsOrderDesktop.left, ...itemsOrderDesktop.right];

    const ordered = MOBILE_ORDER.map((time) => {
      return allItems.find((item) =>
        item
          .querySelector(".timeline__text")
          ?.textContent.trim()
          .startsWith(time)
      );
    }).filter(Boolean);

    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    ordered.forEach((item) => {
      leftCol.appendChild(item);
    });
  }

  function restoreDesktopOrder() {
    if (!isMobileApplied) return;
    isMobileApplied = false;

    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    itemsOrderDesktop.left.forEach((item) => leftCol.appendChild(item));
    itemsOrderDesktop.right.forEach((item) => rightCol.appendChild(item));
  }

  function onResize() {
    if (window.innerWidth <= BREAKPOINT) {
      applyMobileOrder();
    } else {
      restoreDesktopOrder();
    }
  }

  window.addEventListener("resize", onResize);
  onResize();
})();

// ---------- FORM HANDLERS (Vercel backend) ----------

(function () {
  function attachFormHandler(formId, statusId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const statusEl = statusId ? document.getElementById(statusId) : null;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (statusEl) statusEl.textContent = "Отправляем...";

      const formData = new FormData(form);
      const plain = {};

      formData.forEach((value, key) => {
        if (plain[key]) {
          if (!Array.isArray(plain[key])) {
            plain[key] = [plain[key]];
          }
          plain[key].push(value);
        } else {
          plain[key] = value;
        }
      });

      fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plain),
      })
        .then((response) => response.json())
        .then((data) => {
          if (statusEl) {
            if (data.success) {
              statusEl.textContent =
                data.message || "Спасибо! Форма отправлена.";
              form.reset();
            } else {
              statusEl.textContent =
                "Произошла ошибка. Попробуйте позже.";
            }
          }
        })
        .catch((error) => {
          console.error(error);
          if (statusEl) {
            statusEl.textContent =
              "Произошла ошибка. Попробуйте позже.";
          }
        });
    });
  }

  attachFormHandler("details-form", "details-status");
  attachFormHandler("rsvp-form", "rsvp-status");
})();