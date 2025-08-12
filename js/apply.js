// Apply Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Initialize form
    initForm();
    
    // Event listeners
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    form.addEventListener('submit', handleSubmit);
    
    // Progress step click handlers
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (index + 1 <= currentStep) {
                goToStep(index + 1);
            }
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
        if (stepNumber >= 1 && stepNumber <= totalSteps && stepNumber <= currentStep) {
            currentStep = stepNumber;
            updateForm();
        }
    }
    
    function updateForm() {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update progress
        updateProgress();
        
        // Update navigation
        updateNavigation();
        
        // Validate current step
        validateCurrentStep();
        
        // If it's the review step, populate review content
        if (currentStep === 4) {
            populateReview();
        }
        
        // Smooth scroll to form
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
        // Show/hide previous button
        prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
        
        // Show/hide next and submit buttons
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
        
        // Update button text
        if (currentStep === totalSteps - 1) {
            nextBtn.innerHTML = '<span>Review</span><i class="fas fa-eye"></i>';
        } else {
            nextBtn.innerHTML = '<span>Next</span><i class="fas fa-arrow-right"></i>';
        }
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        // Clear previous error states
        currentStepElement.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
        
        // Validate required fields
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                showFieldError(formGroup, 'This field is required');
                isValid = false;
            } else {
                showFieldSuccess(formGroup);
                
                // Additional validation for specific fields
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    showFieldError(formGroup, 'Please enter a valid email address');
                    isValid = false;
                }
                
                if (field.type === 'tel' && !isValidPhone(field.value)) {
                    showFieldError(formGroup, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        });
        
        // Special validation for program selection
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
        // Personal Information
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
        
        // Educational Background
        const educationData = {
            'Highest Education': document.getElementById('highestEducation').value || 'Not specified',
            'Graduation Year': document.getElementById('graduationYear').value || 'Not specified',
            'Institution': document.getElementById('institution').value || 'Not specified',
            'Field of Study': document.getElementById('fieldOfStudy').value || 'Not specified',
            'CGPA/Percentage': document.getElementById('cgpa').value || 'Not specified',
            'Current Status': document.getElementById('currentStatus').value || 'Not specified'
        };
        
        populateReviewSection('educationReview', educationData);
        
        // Program Selection
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
    
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        // Check terms acceptance
        const termsAccepted = document.getElementById('termsAccepted').checked;
        if (!termsAccepted) {
            alert('Please accept the Terms & Conditions to continue.');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form after showing success
            setTimeout(() => {
                resetForm();
            }, 3000);
        }, 2000);
    }
    
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'application-success';
        successMessage.innerHTML = `
            <h4>🎉 Application Submitted Successfully!</h4>
            <p>Thank you for applying to SkillSquad Academy. We'll review your application and get back to you within 24 hours.</p>
        `;
        
        const form = document.getElementById('applicationForm');
        form.parentNode.insertBefore(successMessage, form);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
    function resetForm() {
        // Reset form fields
        form.reset();
        
        // Reset to first step
        currentStep = 1;
        updateForm();
        
        // Remove success message
        const successMessage = document.querySelector('.application-success');
        if (successMessage) {
            successMessage.remove();
        }
    }
    
    // Real-time validation for email and phone
    document.getElementById('email').addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        if (this.value && !isValidEmail(this.value)) {
            showFieldError(formGroup, 'Please enter a valid email address');
        } else if (this.value) {
            showFieldSuccess(formGroup);
        }
    });
    
    document.getElementById('phone').addEventListener('blur', function() {
        const formGroup = this.closest('.form-group');
        if (this.value && !isValidPhone(this.value)) {
            showFieldError(formGroup, 'Please enter a valid phone number');
        } else if (this.value) {
            showFieldSuccess(formGroup);
        }
    });
    
    // Auto-save form data to localStorage
    function autoSaveForm() {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('applicationFormData', JSON.stringify(data));
    }
    
    // Load saved form data
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
    
    // Auto-save on input change
    form.addEventListener('input', autoSaveForm);
    
    // Load saved data on page load
    loadSavedForm();
    
    // Clear saved data on successful submission
    function clearSavedData() {
        localStorage.removeItem('applicationFormData');
    }
    
    // Update the handleSubmit function to clear saved data
    const originalHandleSubmit = handleSubmit;
    handleSubmit = function(e) {
        originalHandleSubmit.call(this, e);
        clearSavedData();
    };
});
