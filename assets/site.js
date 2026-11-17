(() => {
  "use strict";

  const mobileBtn = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      mobileBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
