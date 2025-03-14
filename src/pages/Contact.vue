<template>
  <div class="contact-form-container">
    <h1>Contact Us</h1>

    <div v-if="formSubmitted && !hasErrors" class="success-message">
      <h2>Thank You!</h2>
      <p>Your message has been sent successfully. We'll get back to you soon.</p>
      <button @click="resetForm" class="reset-button">Send Another Message</button>
    </div>

    <form v-else @submit.prevent="submitForm" novalidate>
      <div class="form-group" :class="{ 'has-error': errors.name && (formTouched.name || formSubmitted) }">
        <label for="name">Full Name <span class="required">*</span></label>
        <input
          type="text"
          id="name"
          v-model.trim="formData.name"
          @blur="touchField('name')"
          placeholder="John Doe"
        />
        <div class="error-container">
          <span class="error-message" v-if="errors.name && (formTouched.name || formSubmitted)">{{ errors.name }}</span>
        </div>
      </div>

      <div class="form-group" :class="{ 'has-error': errors.email && (formTouched.email || formSubmitted) }">
        <label for="email">Email Address <span class="required">*</span></label>
        <input
          type="email"
          id="email"
          v-model.trim="formData.email"
          @blur="touchField('email')"
          placeholder="your@email.com"
        />
        <div class="error-container">
          <span class="error-message" v-if="errors.email && (formTouched.email || formSubmitted)">{{ errors.email }}</span>
        </div>
      </div>

      <div class="form-group" :class="{ 'has-error': errors.phone && (formTouched.phone || formSubmitted) }">
        <label for="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          v-model.trim="formData.phone"
          @blur="touchField('phone')"
          placeholder="(123) 456-7890"
        />
        <div class="error-container">
          <span class="error-message" v-if="errors.phone && (formTouched.phone || formSubmitted)">{{ errors.phone }}</span>
        </div>
      </div>

      <div class="form-group" :class="{ 'has-error': errors.subject && (formTouched.subject || formSubmitted) }">
        <label for="subject">Subject <span class="required">*</span></label>
        <input
          type="text"
          id="subject"
          v-model.trim="formData.subject"
          @blur="touchField('subject')"
          placeholder="Your subject"
        />
        <div class="error-container">
          <span class="error-message" v-if="errors.subject && (formTouched.subject || formSubmitted)">{{ errors.subject }}</span>
        </div>
      </div>

      <div class="form-group" :class="{ 'has-error': errors.message && (formTouched.message || formSubmitted) }">
        <label for="message">Message <span class="required">*</span></label>
        <textarea
          id="message"
          v-model.trim="formData.message"
          rows="5"
          @blur="touchField('message')"
          placeholder="Write your message here..."
        ></textarea>
        <div class="message-footer">
          <div class="char-count" :class="{ 'limit-close': messageCharsLeft <= 50, 'limit-reached': messageCharsLeft <= 0 }">
            {{ messageCharsLeft }} characters left
          </div>
          <div class="error-container">
            <span class="error-message" v-if="errors.message && (formTouched.message || formSubmitted)">{{ errors.message }}</span>
          </div>
        </div>
      </div>

      <div class="form-group checkbox-group" :class="{ 'has-error': errors.agreeToPolicy && formSubmitted }">
        <label class="checkbox-label">
          <input type="checkbox" v-model="formData.agreeToPolicy" />
          <span class="checkbox-text">I agree to the Privacy Policy</span>
        </label>
        <div class="error-container">
          <span class="error-message" v-if="errors.agreeToPolicy && formSubmitted">{{ errors.agreeToPolicy }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting">
            <span class="spinner"></span> Sending...
          </span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
/**
 * Contact Page
 *
 * A responsive contact form with validation, submission handling, and success feedback.
 */
export default {
  /**
   * Component's reactive data
   * @returns {Object} The component's data properties
   */
  data() {
    return {
      /**
       * Form input values
       * @type {Object}
       * @property {string} name - User's full name
       * @property {string} email - User's email address
       * @property {string} phone - User's phone number (optional)
       * @property {string} subject - Message subject line
       * @property {string} message - Message content
       * @property {boolean} agreeToPolicy - Privacy policy agreement checkbox
       */
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToPolicy: false
      },

      /**
       * Validation error messages
       * @type {Object}
       * @property {string} name - Name field error
       * @property {string} email - Email field error
       * @property {string} phone - Phone field error
       * @property {string} subject - Subject field error
       * @property {string} message - Message field error
       * @property {string} agreeToPolicy - Policy agreement error
       */
      errors: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToPolicy: ''
      },

      /**
       * Tracks which fields have been interacted with
       * @type {Object}
       */
      formTouched: {
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
      },

      /**
       * Indicates if form has been submitted
       * @type {boolean}
       */
      formSubmitted: false,

      /**
       * Controls loading state during submission
       * @type {boolean}
       */
      isSubmitting: false,

      /**
       * Maximum allowed message length
       * @type {number}
       */
      maxMessageLength: 500
    }
  },

  computed: {
    /**
     * Checks if any validation errors exist
     * @returns {boolean} True if errors exist, false otherwise
     */
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    },

    /**
     * Calculates remaining characters for message field
     * @returns {number} Number of characters left
     */
    messageCharsLeft() {
      return this.maxMessageLength - this.formData.message.length;
    }
  },

  watch: {
    /**
     * Watches for name field changes
     * Validates the field if it has been touched
     */
    'formData.name'() {
      if (this.formTouched.name) this.validateField('name');
    },

    /**
     * Watches for email field changes
     * Validates the field if it has been touched
     */
    'formData.email'() {
      if (this.formTouched.email) this.validateField('email');
    },

    /**
     * Watches for phone field changes
     * Validates the field if it has been touched
     */
    'formData.phone'() {
      if (this.formTouched.phone) this.validateField('phone');
    },

    /**
     * Watches for subject field changes
     * Validates the field if it has been touched
     */
    'formData.subject'() {
      if (this.formTouched.subject) this.validateField('subject');
    },

    /**
     * Watches for message field changes
     * Validates the field if it has been touched
     */
    'formData.message'() {
      if (this.formTouched.message) this.validateField('message');
    }
  },

  methods: {
    /**
     * Marks a field as touched and validates it
     * @param {string} field - Field name to mark as touched
     */
    touchField(field) {
      this.formTouched[field] = true;
      this.validateField(field);
    },

    /**
     * Validates a specific form field
     * @param {string} field - Field name to validate
     */
    validateField(field) {
      // Reset the error for this field
      this.errors[field] = '';

      // Validate based on field type
      switch(field) {
        case 'name':
          if (!this.formData.name) {
            this.errors.name = 'Name is required';
          } else if (this.formData.name.length < 2) {
            this.errors.name = 'Name must be at least 2 characters';
          }
          break;

        case 'email':
          if (!this.formData.email) {
            this.errors.email = 'Email is required';
          } else if (!this.isValidEmail(this.formData.email)) {
            this.errors.email = 'Please enter a valid email address';
          }
          break;

        case 'phone':
          if (this.formData.phone && !this.isValidPhone(this.formData.phone)) {
            this.errors.phone = 'Please enter a valid phone number';
          }
          break;

        case 'subject':
          if (!this.formData.subject) {
            this.errors.subject = 'Subject is required';
          } else if (this.formData.subject.length < 3) {
            this.errors.subject = 'Subject must be at least 3 characters';
          }
          break;

        case 'message':
          if (!this.formData.message) {
            this.errors.message = 'Message is required';
          } else if (this.formData.message.length < 10) {
            this.errors.message = 'Message must be at least 10 characters';
          } else if (this.formData.message.length > this.maxMessageLength) {
            this.errors.message = `Message cannot exceed ${this.maxMessageLength} characters`;
          }
          break;

        case 'agreeToPolicy':
          if (!this.formData.agreeToPolicy) {
            this.errors.agreeToPolicy = 'You must agree to the Privacy Policy';
          }
          break;
      }
    },

    /**
     * Validates all form fields
     * @returns {boolean} True if form is valid, false otherwise
     */
    validateForm() {
      // Validate all fields
      this.validateField('name');
      this.validateField('email');
      this.validateField('phone');
      this.validateField('subject');
      this.validateField('message');
      this.validateField('agreeToPolicy');

      // Return true if no errors
      return !this.hasErrors;
    },

    /**
     * Validates email format using regex
     * @param {string} email - Email to validate
     * @returns {boolean} True if email format is valid
     */
    isValidEmail(email) {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Validates phone number format using regex
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if phone format is valid
     */
    isValidPhone(phone) {
      // Phone validation regex (accepts various formats)
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      return phoneRegex.test(phone);
    },

    /**
     * Handles form submission
     * Validates form, shows loading state, and processes submission
     */
    submitForm() {
      this.formSubmitted = true;

      if (this.validateForm()) {
        this.isSubmitting = true;

        // Simulate an API call to submit the form
        setTimeout(() => {
          this.isSubmitting = false;
          // In a real application, you would handle the actual form submission here
          console.log('Form submitted:', this.formData);
        }, 1500);
      } else {
        // Scroll to the first error
        this.$nextTick(() => {
          const firstErrorElement = document.querySelector('.has-error');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }
    },

    /**
     * Resets the form to initial state
     * Clears all inputs, errors, and form state
     */
    resetForm() {
      // Reset form data
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToPolicy: false
      };

      // Reset errors
      this.errors = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToPolicy: ''
      };

      // Reset form touch state
      this.formTouched = {
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
      };

      // Reset form state
      this.formSubmitted = false;
      this.isSubmitting = false;
    }
  }
}
</script>


<style scoped>
.contact-form-container {
  width: 45vw;
  margin: 0 auto;
  padding: 20px 50px 50px;
  background-color: var(--color-bg-primary);
}

.contact-form-container form{
  background-color: var(--color-bg-primary);
}

h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 32px;
  text-align: center;
}

.form-group {
  margin-bottom: 14px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.required {
  color: var(--color-error);
  margin-left: 4px;
}

input, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  font-size: 16px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: border-color 0.2s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.has-error input,
.has-error textarea {
  border-color: var(--color-error);
}

.error-container {
  min-height: 20px;
}

.error-message {
  color: var(--color-error);
  font-size: 12px;
  display: block;
  margin-top: 6px;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.char-count {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 6px;
}

.limit-close {
  color: var(--color-warning);
}

.limit-reached {
  color: var(--color-error);
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
  margin-top: 2px;
}

.checkbox-text {
  font-weight: normal;
}

.form-actions {
  margin-top: 32px;
  text-align: center;
}

button {
  padding: 14px 32px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 160px;
}

button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-text-inverse);
  border-top: 2px solid transparent;
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-message {
  text-align: center;
  background-color: var(--color-bg-secondary);
  padding: 40px;
  border-radius: 16px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-message h2 {
  color: var(--color-success);
  font-size: 24px;
  margin-bottom: 16px;
}

.success-message p {
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.reset-button {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.reset-button:hover {
  background-color: var(--color-primary-100);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .contact-form-container {
    padding: 32px 16px 64px;
  }

  button {
    width: 100%;
  }

  .message-footer {
    flex-direction: column;
  }
}
</style>