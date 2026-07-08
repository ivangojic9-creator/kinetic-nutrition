/* Kinetic Nutrition — interactions & animations */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mmenu = document.getElementById("mmenu");
  var toggleMenu = function (open) {
    burger.classList.toggle("is-open", open);
    mmenu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    mmenu.setAttribute("aria-hidden", !open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", function () {
    toggleMenu(!mmenu.classList.contains("is-open"));
  });
  mmenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { toggleMenu(false); });
  });

  /* ---------- Sticky mobile CTA (after hero) ---------- */
  var sticky = document.getElementById("stickycta");
  var hero = document.querySelector(".hero");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { rootMargin: "-120px 0px 0px 0px" }).observe(hero);
  }

  if (reduced || typeof gsap === "undefined" || location.search.indexOf("noanim") > -1) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero intro ---------- */
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".hero__title .line > span", {
      yPercent: 110, duration: 0.9, stagger: 0.09
    })
    .from([".hero__badge", ".hero__sub", ".hero__cta", ".hero__proof"], {
      opacity: 0, y: 24, duration: 0.7, stagger: 0.09
    }, "-=0.45")
    .from(".hero__img", {
      opacity: 0, y: 40, scale: 0.96, duration: 0.9
    }, "-=0.8")
    .from(".hero__chip", {
      opacity: 0, y: 14, duration: 0.5, stagger: 0.12
    }, "-=0.4");

  /* ---------- Generic reveals ---------- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    if (el.closest(".hero")) return; // hero handled above
    gsap.from(el, {
      opacity: 0, y: 28, duration: 0.75, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  /* ---------- Shop tiles stagger ---------- */
  gsap.from("[data-tile]", {
    opacity: 0, y: 34, duration: 0.65, ease: "power3.out", stagger: 0.07,
    scrollTrigger: { trigger: ".shop__grid", start: "top 82%", once: true }
  });

  /* ---------- Parallax images ---------- */
  gsap.utils.toArray("[data-parallax] img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 }
    });
  });

  /* ---------- Coffee big outline text (scrub) ---------- */
  gsap.to("#bigtext", {
    xPercent: -30, ease: "none",
    scrollTrigger: { trigger: ".coffee", start: "top bottom", end: "bottom top", scrub: 0.8 }
  });

  /* ---------- Counters ---------- */
  gsap.utils.toArray(".stat__n").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var obj = { v: 0 };
    el.textContent = "0"; // start from 0 only when the counter will actually animate
    gsap.to(obj, {
      v: target, duration: 1.4, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: function () { el.textContent = Math.round(obj.v); }
    });
  });

  /* ---------- Final title reveal ---------- */
  gsap.from(".final__title .line > span", {
    yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.12,
    scrollTrigger: { trigger: ".final", start: "top 75%", once: true }
  });

  /* ---------- Marquee pause when out of view (perf) ---------- */
  var tracks = document.querySelectorAll(".announce__track, .marquee__track");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.style.animationPlayState = e.isIntersecting ? "running" : "paused";
      });
    });
    tracks.forEach(function (t) { io.observe(t); });
  }
})();
