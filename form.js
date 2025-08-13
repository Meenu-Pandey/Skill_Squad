// Handles ALL course callback forms
document.querySelectorAll(".callback-form").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(form);

      // Automatically add course name if not set
      if (!formData.has("course_name")) {
        formData.append(
          "course_name",
          form.closest(".course-card")?.dataset.courseName || "General Query"
        );
      }

      const response = await fetch("backend/submit_callback.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        submitBtn.textContent = "✓ Submitted!";
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      } else {
        alert(result.errors ? result.errors.join("\n") : result.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      alert("Network error - please try again");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      console.error(error);
    }
  });
});
