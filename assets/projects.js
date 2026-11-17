(() => {
  "use strict";

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const lightbox = document.getElementById("projectLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  if (!filterButtons.length || !projectCards.length || !lightbox) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const showCard = selectedFilter === "all" || selectedFilter === category;
        card.classList.toggle("hidden", !showCard);
      });
    });
  });

  projectCards.forEach((card) => {
    const cardImage = card.querySelector("img");
    if (!cardImage) return;
    cardImage.style.cursor = "zoom-in";
    cardImage.addEventListener("click", () => {
      lightboxImage.src = cardImage.src;
      lightboxImage.alt = cardImage.alt;
      lightboxCaption.textContent = cardImage.alt;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
})();
