const Validation = {
    // Email validation
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Password validation
    validatePassword: function(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    },

    // Name validation
    validateName: function(name) {
        // At least 2 characters, only letters and spaces
        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        return nameRegex.test(name);
    },

    // Date of birth validation
    validateDateOfBirth: function(date) {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 18; // Must be at least 18 years old
    },

    // Show error message
    showError: function(input, message) {
        const formControl = input.parentElement;
        const errorDiv = formControl.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message text-danger mt-1';
        errorDiv.textContent = message;
        
        if (!formControl.querySelector('.error-message')) {
            formControl.appendChild(errorDiv);
        }
        
        input.classList.add('is-invalid');
        return false;
    },

    // Remove error message
    removeError: function(input) {
        const formControl = input.parentElement;
        const errorDiv = formControl.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('is-invalid');
        return true;
    },

    // Validate form field
    validateField: function(input) {
        const value = input.value.trim();
        const type = input.type;
        const id = input.id;

        switch (id) {
            case 'email':
                if (!value) {
                    return this.showError(input, 'Email is required');
                }
                if (!this.validateEmail(value)) {
                    return this.showError(input, 'Please enter a valid email address');
                }
                return this.removeError(input);

            case 'password':
                if (!value) {
                    return this.showError(input, 'Password is required');
                }
                if (!this.validatePassword(value)) {
                    return this.showError(input, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
                }
                return this.removeError(input);

            case 'fullName':
                if (!value) {
                    return this.showError(input, 'Full name is required');
                }
                if (!this.validateName(value)) {
                    return this.showError(input, 'Name must contain only letters and be at least 2 characters long');
                }
                return this.removeError(input);

            case 'dateOfBirth':
                if (!value) {
                    return this.showError(input, 'Date of birth is required');
                }
                if (!this.validateDateOfBirth(value)) {
                    return this.showError(input, 'You must be at least 18 years old');
                }
                return this.removeError(input);

            default:
                return true;
        }
    },

    // Validate entire form
    validateForm: function(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
}; 