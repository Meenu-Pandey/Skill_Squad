document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("applicationForm");
  const steps = document.querySelectorAll(".form-step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  let currentStep = 0;

  // Navigation functions
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });

    prevBtn.style.display = stepIndex === 0 ? "none" : "inline-flex";
    nextBtn.style.display =
      stepIndex === steps.length - 1 ? "none" : "inline-flex";
    submitBtn.style.display =
      stepIndex === steps.length - 1 ? "inline-flex" : "none";

    // Update review sections on last step
    if (stepIndex === steps.length - 1) {
      updateReviewSections();
    }
  }

  // Update review sections
  function updateReviewSections() {
    // Personal Information
    document.getElementById("personalReview").innerHTML = `
            <p><strong>Name:</strong> ${form.firstName.value} ${form.lastName.value}</p>
            <p><strong>Email:</strong> ${form.email.value}</p>
            <p><strong>Phone:</strong> ${form.phone.value}</p>
            <p><strong>Date of Birth:</strong> ${form.dateOfBirth.value}</p>
            <p><strong>Address:</strong> ${form.address.value}, ${form.city.value}, ${form.state.value}</p>
        `;

    // Educational Background
    document.getElementById("educationReview").innerHTML = `
            <p><strong>Highest Education:</strong> ${
              form.highestEducation.options[form.highestEducation.selectedIndex]
                .text
            }</p>
            ${
              form.graduationYear.value
                ? `<p><strong>Graduation Year:</strong> ${form.graduationYear.value}</p>`
                : ""
            }
            ${
              form.institution.value
                ? `<p><strong>Institution:</strong> ${form.institution.value}</p>`
                : ""
            }
            ${
              form.fieldOfStudy.value
                ? `<p><strong>Field of Study:</strong> ${form.fieldOfStudy.value}</p>`
                : ""
            }
            ${
              form.cgpa.value
                ? `<p><strong>CGPA/Percentage:</strong> ${form.cgpa.value}</p>`
                : ""
            }
            <p><strong>Current Status:</strong> ${
              form.currentStatus.options[form.currentStatus.selectedIndex].text
            }</p>
        `;

    // Program Selection
    const programText = document
      .querySelector(`input[name="programInterest"]:checked`)
      .parentElement.querySelector("h4").textContent;
    document.getElementById("programReview").innerHTML = `
            <p><strong>Program:</strong> ${programText}</p>
            <p><strong>Preferred Start:</strong> ${
              form.startDate.options[form.startDate.selectedIndex].text
            }</p>
            <p><strong>Time Commitment:</strong> ${
              form.timeCommitment.options[form.timeCommitment.selectedIndex]
                .text
            }</p>
            <p><strong>Motivation:</strong> ${form.motivation.value}</p>
            ${
              form.priorExperience.value
                ? `<p><strong>Prior Experience:</strong> ${form.priorExperience.value}</p>`
                : ""
            }
        `;
  }

  // Navigation buttons
  nextBtn.addEventListener("click", function () {
    // Validate current step before proceeding
    const currentStepFields = steps[currentStep].querySelectorAll("[required]");
    let isValid = true;

    currentStepFields.forEach((field) => {
      if (!field.value) {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }
    });

    if (isValid) {
      currentStep++;
      showStep(currentStep);
    } else {
      alert("Please fill in all required fields before proceeding.");
    }
  });

  prevBtn.addEventListener("click", function () {
    currentStep--;
    showStep(currentStep);
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span>Submitting...</span> <i class="fas fa-spinner fa-spin"></i>';

    // Submit form data via AJAX
    fetch("backend/submit_application.php", {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Show success message
          const successHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Application Submitted Successfully!</h3>
                        <p>${data.message}</p>
                        <p>We'll contact you shortly with more information.</p>
                    </div>
                `;
          form.innerHTML = successHTML;
        } else {
          // Show errors
          let errorHTML =
            '<div class="error-message"><h3>Please fix the following errors:</h3><ul>';

          for (const [field, error] of Object.entries(data.errors)) {
            errorHTML += `<li>${error}</li>`;
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
              input.classList.add("error");
              // Scroll to first error
              if (errorHTML.includes("<li>")) {
                input.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }
          }

          errorHTML += "</ul></div>";

          // Go back to first step with errors
          currentStep = 0;
          showStep(currentStep);

          // Insert errors at top of form
          form.insertAdjacentHTML("afterbegin", errorHTML);

          // Reset submit button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      })
      .catch((error) => {
        alert("An error occurred. Please try again.");
        console.error("Error:", error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
  });

  // Initialize form
  showStep(currentStep);
});
