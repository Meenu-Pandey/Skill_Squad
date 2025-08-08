document.addEventListener("DOMContentLoaded", () => {
  // --- Element Selection ---
  const categoryFilter = document.getElementById("category-filter");
  const durationFilter = document.getElementById("duration-filter");
  const courseGrid = document.getElementById("course-grid");
  const courseCards = courseGrid.querySelectorAll(".course-card");
  const noResultsMessage = document.getElementById("no-results-message");

  // For mobile responsive filters
  const mobileFilterToggle = document.getElementById("mobile-filter-toggle");
  const sidebar = document.querySelector(".filters-sidebar");

  // --- State Management ---
  let currentFilters = {
    category: "all",
    duration: "all",
  };

  // --- Main Filter Logic ---
  const filterCourses = () => {
    let visibleCoursesCount = 0;

    courseCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const cardDuration = card.dataset.duration;

      // Check if card matches current filters
      const categoryMatch =
        currentFilters.category === "all" ||
        currentFilters.category === cardCategory;
      const durationMatch =
        currentFilters.duration === "all" ||
        currentFilters.duration === cardDuration;

      if (categoryMatch && durationMatch) {
        card.classList.remove("hidden");
        visibleCoursesCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Toggle the 'no results' message based on visibility count
    noResultsMessage.classList.toggle("hidden", visibleCoursesCount > 0);
  };

  // --- Generic Filter Event Handler ---
  const addFilterListener = (filterElement, filterKey) => {
    filterElement.addEventListener("click", (e) => {
      if (e.target && e.target.tagName === "LI") {
        // Update active class
        filterElement.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");

        // Update filter state
        currentFilters[filterKey] = e.target.dataset[filterKey];

        // Re-run the filter function
        filterCourses();
      }
    });
  };

  addFilterListener(categoryFilter, "category");
  addFilterListener(durationFilter, "duration");

  // --- Mobile Filter Toggle ---
  mobileFilterToggle.addEventListener("click", () => {
    // The 'open' class will toggle 'display: block' on mobile
    sidebar.classList.toggle("open");
  });

  // Close all other forms when opening a new one
  function closeAllForms() {
    document.querySelectorAll(".enquiry-form-container").forEach((form) => {
      form.classList.remove("active");
    });
  }

  // Toggle form visibility
  document.querySelectorAll(".enquiry-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const cardContent = this.closest(".card-content");
      const formContainer = cardContent.querySelector(
        ".enquiry-form-container"
      );

      // Close all forms first
      closeAllForms();

      // Toggle the current form
      formContainer.classList.toggle("active");

      // Scroll to the form if it's being opened
      if (formContainer.classList.contains("active")) {
        formContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  // Close form when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !e.target.closest(".enquiry-form-container") &&
      !e.target.classList.contains("enquiry-btn")
    ) {
      closeAllForms();
    }
  });

  // Form submission handling
  document.querySelectorAll(".enquiry-form form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Here you would typically send the form data to your server
      alert("Form submitted successfully! We will contact you shortly.");
      this.reset();
      this.closest(".enquiry-form-container").classList.remove("active");
    });
  });
});
