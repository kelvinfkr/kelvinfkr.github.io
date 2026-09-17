(function () {
  "use strict";

  function initHomepageMotion() {
    var root = document.documentElement;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var selectors = [
      ".research-hero",
      ".section-heading",
      ".research-card",
      ".system-loop__intro",
      ".loop-node",
      ".system-loop__feedback",
      ".publication",
      ".language-block",
      ".industry-panel",
      ".people-list li",
      ".contact-band",
      ".resource-row"
    ];
    var items = Array.prototype.slice.call(document.querySelectorAll(selectors.join(",")));

    root.classList.add("motion-enabled");

    items.forEach(function (item) {
      item.classList.add("reveal-item");
      var siblings = item.parentElement ? Array.prototype.filter.call(item.parentElement.children, function (child) {
        return child.matches(".research-card, .loop-node, .publication, .language-block, li, .resource-row");
      }) : [];
      var index = Math.max(0, siblings.indexOf(item));
      item.style.setProperty("--reveal-delay", Math.min(index, 5) * 70 + "ms");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -9%", threshold: 0.08 });

      items.forEach(function (item) { observer.observe(item); });
    }

    var progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    function updateProgress() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progress.style.transform = "scaleX(" + ratio + ")";
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    if (!reduceMotion) {
      var hero = document.querySelector(".research-hero");
      var profile = document.querySelector(".hero-profile");

      if (hero && profile && window.matchMedia("(pointer: fine)").matches) {
        hero.addEventListener("pointermove", function (event) {
          var bounds = hero.getBoundingClientRect();
          var x = (event.clientX - bounds.left) / bounds.width - 0.5;
          var y = (event.clientY - bounds.top) / bounds.height - 0.5;
          profile.style.transform = "translate3d(" + (x * 7).toFixed(2) + "px," + (y * 7).toFixed(2) + "px,0)";
          hero.style.setProperty("--pointer-x", (50 + x * 12).toFixed(2) + "%");
          hero.style.setProperty("--pointer-y", (50 + y * 12).toFixed(2) + "%");
        });

        hero.addEventListener("pointerleave", function () {
          profile.style.transform = "translate3d(0,0,0)";
          hero.style.removeProperty("--pointer-x");
          hero.style.removeProperty("--pointer-y");
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomepageMotion);
  } else {
    initHomepageMotion();
  }
})();
