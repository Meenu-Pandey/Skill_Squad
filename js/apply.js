// Apply Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const submitBtn = document.getElementById('submitBtn');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Initialize form
    initForm();

    // Event listeners
    nextBtns.forEach(btn => btn.addEventListener('click', nextStep));
    prevBtns.forEach(btn => btn.addEventListener('click', prevStep));
    form.addEventListener('submit', handleSubmit);

    // Prevent skipping forward on progress bar click
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', (e) => {
            const targetStep = index + 1;
            if (targetStep > currentStep) {
                // Trying to go forward → must validate current step
                if (!validateCurrentStep()) {
                    e.preventDefault();
                    return;
                }
            }
            goToStep(targetStep);
        });
    });

    function initForm() {
        updateProgress();
        updateNavigation();
        validateCurrentStep();
    }

    function nextStep() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateForm();
            }
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateForm();
        }
    }

    function goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            currentStep = stepNumber;
            updateForm();
        }
    }

    function updateForm() {
        steps.forEach(step => step.classList.remove('active'));
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        updateProgress();
        updateNavigation();
        validateCurrentStep();

        if (currentStep === 4) {
            populateReview();
        }

        document.getElementById('application-form').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.remove('completed');
                step.classList.add('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    function updateNavigation() {
        // Hide all navigation buttons first
        nextBtns.forEach(btn => btn.style.display = 'none');
        prevBtns.forEach(btn => btn.style.display = 'none');
        
        // Show appropriate buttons for current step
        const currentNextBtn = document.querySelector(`[data-step="${currentStep}"].next-btn`);
        const currentPrevBtn = document.querySelector(`[data-step="${currentStep}"].prev-btn`);
        
        if (currentPrevBtn && currentStep > 1) {
            currentPrevBtn.style.display = 'flex';
        }
        
        if (currentStep === totalSteps) {
            // Show submit button on last step
            submitBtn.style.display = 'flex';
        } else if (currentNextBtn) {
            currentNextBtn.style.display = 'flex';
            
            // Update button text for review step
            if (currentStep === totalSteps - 1) {
                currentNextBtn.innerHTML = '<span>Review</span><i class="fas fa-eye"></i>';
            } else {
                currentNextBtn.innerHTML = '<span>Next</span><i class="fas fa-arrow-right"></i>';
            }
        }
    }

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        currentStepElement.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });

        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (!field.value.trim()) {
                showFieldError(formGroup, 'This field is required');
                isValid = false;
            } else {
                // Check email validation
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    showFieldError(formGroup, 'Please enter a valid email address');
                    isValid = false;
                } 
                // Check phone validation
                else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    showFieldError(formGroup, 'Please enter a valid phone number');
                    isValid = false;
                } 
                // Field is valid
                else {
                    showFieldSuccess(formGroup);
                }
            }
        });

        if (currentStep === 3) {
            const programSelected = currentStepElement.querySelector('input[name="programInterest"]:checked');
            if (!programSelected) {
                const programGroup = currentStepElement.querySelector('.form-group.full-width');
                showFieldError(programGroup, 'Please select a program');
                isValid = false;
            }
        }
        return isValid;
    }

    function showFieldError(formGroup, message) {
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);
    }

    function showFieldSuccess(formGroup) {
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function populateReview() {
        const personalData = {
            'First Name': document.getElementById('firstName').value,
            'Last Name': document.getElementById('lastName').value,
            'Email': document.getElementById('email').value,
            'Phone': document.getElementById('phone').value,
            'Date of Birth': document.getElementById('dateOfBirth').value,
            'Gender': document.getElementById('gender').value || 'Not specified',
            'Address': document.getElementById('address').value,
            'City': document.getElementById('city').value,
            'State': document.getElementById('state').value
        };
        populateReviewSection('personalReview', personalData);

        const educationData = {
            'Highest Education': document.getElementById('highestEducation').value || 'Not specified',
            'Graduation Year': document.getElementById('graduationYear').value || 'Not specified',
            'Institution': document.getElementById('institution').value || 'Not specified',
            'Field of Study': document.getElementById('fieldOfStudy').value || 'Not specified',
            'CGPA/Percentage': document.getElementById('cgpa').value || 'Not specified',
            'Current Status': document.getElementById('currentStatus').value || 'Not specified'
        };
        populateReviewSection('educationReview', educationData);

        const programData = {
            'Program Interest': getSelectedProgramText(),
            'Start Date': document.getElementById('startDate').value || 'Not specified',
            'Time Commitment': document.getElementById('timeCommitment').value || 'Not specified',
            'Motivation': document.getElementById('motivation').value || 'Not specified',
            'Prior Experience': document.getElementById('priorExperience').value || 'None'
        };
        populateReviewSection('programReview', programData);
    }

    function getSelectedProgramText() {
        const selectedProgram = document.querySelector('input[name="programInterest"]:checked');
        if (selectedProgram) {
            const optionContent = selectedProgram.closest('.program-option').querySelector('h4');
            return optionContent ? optionContent.textContent : selectedProgram.value;
        }
        return 'Not selected';
    }

    function populateReviewSection(elementId, data) {
        const element = document.getElementById(elementId);
        if (!element) return;
        let html = '';
        for (const [key, value] of Object.entries(data)) {
            html += `<div class="review-item"><strong>${key}:</strong> ${value}</div>`;
        }
        element.innerHTML = html;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateCurrentStep()) {
            return;
        }
        const termsAccepted = document.getElementById('termsAccepted').checked;
        if (!termsAccepted) {
            alert('Please accept the Terms & Conditions to continue.');
            return;
        }

        // Build form data expected by backend/submit_application.php
        const formData = new FormData(form);

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch('backend/submit_application.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Remove any previous messages
            const prevSuccess = document.querySelector('.application-success');
            if (prevSuccess) prevSuccess.remove();
            const prevError = document.querySelector('.application-errors');
            if (prevError) prevError.remove();

            if (data.success) {
                showSuccessMessage(data.message || "Application submitted successfully!");
                // Clear saved draft on success and reset form after a short delay
                clearSavedData();
                setTimeout(() => {
                    resetForm();
                }, 2000);
            } else {
                // Render errors at the top of the current step
                const errorBox = document.createElement('div');
                errorBox.className = 'application-errors';
                let html = '<h4>Please fix the following errors:</h4><ul>';
                if (data.errors && typeof data.errors === 'object') {
                    Object.entries(data.errors).forEach(([field, msg]) => {
                        html += `<li>${msg}</li>`;
                        const input = form.querySelector(`[name="${field}"]`);
                        if (input) {
                            const group = input.closest('.form-group');
                            if (group) {
                                group.classList.add('error');
                                const em = document.createElement('div');
                                em.className = 'error-message';
                                em.textContent = msg;
                                group.appendChild(em);
                            }
                            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                } else if (data.message) {
                    html += `<li>${data.message}</li>`;
                }
                html += '</ul>';
                errorBox.innerHTML = html;
                form.insertAdjacentElement('afterbegin', errorBox);
                // Jump to the step with required errors if we are on review
                currentStep = Math.min(currentStep, 3);
                updateForm();
            }
        } catch (err) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            alert('An error occurred while submitting your application. Please try again.');
            console.error(err);
        }
    }

    function showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.className = 'application-success';
        successMessage.innerHTML = `
            <h4>🎉 Application Submitted Successfully!</h4>
            <p>${message || "Thank you for applying to SkillSquad Academy. We'll review your application and get back to you shortly."}</p>
        `;
        const form = document.getElementById('applicationForm');
        form.parentNode.insertBefore(successMessage, form);
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    function resetForm() {
        form.reset();
        currentStep = 1;
        updateForm();
        const successMessage = document.querySelector('.application-success');
        if (successMessage) {
            successMessage.remove();
        }
    }

    // Add real-time validation for all fields
    function setupFieldValidation() {
        const allFields = form.querySelectorAll('input, select, textarea');
        
        allFields.forEach(field => {
            // Validate on blur (when user leaves the field)
            field.addEventListener('blur', function() {
                validateSingleField(this);
            });
            
            // Validate on input (as user types)
            field.addEventListener('input', function() {
                // Only show success, don't show errors while typing
                if (this.value.trim()) {
                    const isFieldValid = validateSingleField(this, false);
                    if (isFieldValid) {
                        showFieldSuccess(this.closest('.form-group'));
                    }
                }
            });
        });
        
        // Special handling for radio buttons
        const radioButtons = form.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup) {
                    showFieldSuccess(formGroup);
                }
            });
        });
    }
    
    function validateSingleField(field, showErrors = true) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        
        // Clear previous validation state
        formGroup.classList.remove('error', 'success');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Don't validate if field is empty and not required, or if we're not showing errors
        if (!value && (!field.required || !showErrors)) {
            return true;
        }
        
        // Required field validation
        if (field.required && !value) {
            if (showErrors) {
                showFieldError(formGroup, 'This field is required');
            }
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value && !isValidEmail(value)) {
            if (showErrors) {
                showFieldError(formGroup, 'Please enter a valid email address');
            }
            isValid = false;
        }
        // Phone validation
        else if (field.type === 'tel' && value && !isValidPhone(value)) {
            if (showErrors) {
                showFieldError(formGroup, 'Please enter a valid phone number');
            }
            isValid = false;
        }
        // Field is valid and has value
        else if (value) {
            showFieldSuccess(formGroup);
        }
        
        return isValid;
    }
    
    // Initialize field validation
    setupFieldValidation();

    function autoSaveForm() {
        const formData = new FormData(form);
        // Ensure CSRF token present
        if (!formData.get('csrf_token') && window.__CSRF_TOKEN__) {
            formData.append('csrf_token', window.__CSRF_TOKEN__);
        }
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem('applicationFormData', JSON.stringify(data));
    }

    function loadSavedForm() {
        const savedData = localStorage.getItem('applicationFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            for (const [key, value] of Object.entries(data)) {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = value;
                }
            }
        }
    }

    form.addEventListener('input', autoSaveForm);
    loadSavedForm();

    function clearSavedData() {
        localStorage.removeItem('applicationFormData');
    }

    // Clear saved data on successful submit is handled inside handleSubmit
});
