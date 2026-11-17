(() => {
  "use strict";

  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const feedbackDiv = document.getElementById("formFeedback");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    feedbackDiv.style.color = "";
    feedbackDiv.innerHTML = "";

    if (!name || !email || !message) {
      feedbackDiv.style.color = "#b91c1c";
      feedbackDiv.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields (Name, Email, Message).';
      return;
    }

    const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailPattern.test(email)) {
      feedbackDiv.style.color = "#b91c1c";
      feedbackDiv.innerHTML =
        '<i class="fas fa-envelope-open-text"></i> Please enter a valid email address.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      'Sending... <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';

    setTimeout(() => {
      feedbackDiv.style.color = "#2c5f5f";
      feedbackDiv.innerHTML =
        '<i class="fas fa-check-circle"></i> Thank you, ' +
        name +
        "! Your message has been received. We’ll get back to you within 24 hours.";
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      setTimeout(() => {
        feedbackDiv.innerHTML = "";
      }, 6000);
    }, 300);
  });
})();
