<script>
/**
 * Home page component for Eatmatch food discovery platform.
 * Displays a landing page with hero section, features, and rotating food quotes.
 */
export default {
  name: "Home",

  /**
   * Component data
   * @returns {Object} Component data properties
   */
  data() {
    return {
      /**
       * Collection of food-related quotes to display
       * @type {Array<{text: string, author: string}>}
       */
      foodQuotes: [
        { text: "People who love to eat are always the best people.", author: "Julia Child" },
        { text: "To eat is a necessity, but to eat intelligently is an art.", author: "François de La Rochefoucauld" },
        { text: "First we eat, then we do everything else.", author: "M.F.K. Fisher" }
      ],

      /**
       * Index of the currently displayed quote
       * @type {number}
       */
      currentQuote: 0,

      /**
       * User's email for newsletter subscription
       * @type {string}
       */
      userEmail: '',

      /**
       * Controls visibility of newsletter subscription success message
       * @type {boolean}
       */
      showNewsletterSuccess: false
    }
  },

  methods: {
    /**
     * Advances to the next quote in the rotation
     * Uses modulo operation to cycle through quotes array
     */
    nextQuote() {
      this.currentQuote = (this.currentQuote + 1) % this.foodQuotes.length;
    },

    /**
     * Handles newsletter subscription form submission
     * Simulates API call and shows success message temporarily
     */
    subscribeNewsletter() {
      // Simulate newsletter subscription
      this.showNewsletterSuccess = true;
      setTimeout(() => {
        this.showNewsletterSuccess = false;
        this.userEmail = '';
      }, 3000);
    }
  },

  /**
   * Sets up automatic quote rotation when component is mounted
   * Quotes change every 8 seconds
   */
  mounted() {
    // Rotate quotes automatically
    setInterval(this.nextQuote, 8000);
  }
}
</script>


<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover Culinary Excellence</h1>
        <p class="hero-subtitle">Join our community of food enthusiasts</p>
        <div class="hero-actions">
          <router-link to="/restaurants" class="cta-button primary">Find Places</router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Why Use Eatmatch?</h2>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🤝</div>
          <h3>Community Driven</h3>
          <p>Real opinions from genuine food lovers, not paid reviews.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3>Discover Hidden Gems</h3>
          <p>Find authentic local favorites you won't see in tourist guides.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🏆</div>
          <h3>Curated Excellence</h3>
          <p>Our community highlights truly exceptional dining experiences.</p>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="quote-section">
      <div class="quote-container">
        <blockquote class="food-quote">
          "{{ foodQuotes[currentQuote].text }}"
        </blockquote>
        <p class="quote-author">— {{ foodQuotes[currentQuote].author }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  font-family: 'Poppins', sans-serif;
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 90vh;
  min-height: 600px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-food.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-white);
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 54px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 24px;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.cta-button {
  padding: 16px 32px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.cta-button.primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-3px);
}

.cta-button.secondary {
  background-color: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-white);
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}


.section-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}

/* Quote Section */
.quote-section {
  padding: 100px 20px;
  background-color: var(--color-primary);
  color: white;
  text-align: center;
}

.quote-container {
  max-width: 800px;
  margin: 0 auto;
}

.food-quote {
  font-size: 32px;
  line-height: 1.4;
  font-style: italic;
  margin-bottom: 20px;
  position: relative;
}

.food-quote::before,
.food-quote::after {
  content: '';
  position: absolute;
  height: 3px;
  width: 80px;
  background-color: rgba(255, 255, 255, 0.3);
}

.food-quote::before {
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.food-quote::after {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.quote-author {
  font-size: 18px;
  opacity: 0.8;
}

/* Features Section */
.features-section {
  padding: 80px 20px;
  background-color: var(--color-bg-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: var(--color-bg-primary);
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--color-text-primary);
}

.feature-card p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Newsletter Section */
.newsletter-section {
  padding: 80px 20px;
  background-color: var(--color-bg-primary);
  text-align: center;
}

.newsletter-container {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-container h2 {
  font-size: 32px;
  margin-bottom: 16px;
}

.newsletter-container p {
  color: var(--color-text-secondary);
  margin-bottom: 30px;
}

.newsletter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.newsletter-input {
  flex: 1;
  min-width: 280px;
  padding: 16px 20px;
  border: 1px solid var(--color-border-light);
  border-radius: 30px;
  font-size: 16px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.newsletter-button {
  padding: 16px 30px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.newsletter-button:hover {
  background-color: var(--color-primary-dark);
}

.success-message {
  background-color: var(--color-success);
  color: white;
  padding: 16px;
  border-radius: 8px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .section-title {
    font-size: 28px;
  }

  .food-quote {
    font-size: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-input, .newsletter-button {
    width: 100%;
  }
}
</style>
