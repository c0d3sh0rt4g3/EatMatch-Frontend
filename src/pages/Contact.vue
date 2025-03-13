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
export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToPolicy: false
      },
      errors: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        agreeToPolicy: ''
      },
      formTouched: {
        name: false,
        email: false,
        phone: false,
        subject: false,
        message: false
      },
      formSubmitted: false,
      isSubmitting: false,
      maxMessageLength: 500
    }
  },
  computed: {
    hasErrors() {
      return Object.values(this.errors).some(error => error !== '');
    },
    messageCharsLeft() {
      return this.maxMessageLength - this.formData.message.length;
    }
  },
  watch: {
    'formData.name'() {
      if (this.formTouched.name) this.validateField('name');
    },
    'formData.email'() {
      if (this.formTouched.email) this.validateField('email');
    },
    'formData.phone'() {
      if (this.formTouched.phone) this.validateField('phone');
    },
    'formData.subject'() {
      if (this.formTouched.subject) this.validateField('subject');
    },
    'formData.message'() {
      if (this.formTouched.message) this.validateField('message');
    }
  },
  methods: {
    touchField(field) {
      this.formTouched[field] = true;
      this.validateField(field);
    },

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

    isValidEmail(email) {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    isValidPhone(phone) {
      // Phone validation regex (accepts various formats)
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      return phoneRegex.test(phone);
    },

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

<style>
</style>
