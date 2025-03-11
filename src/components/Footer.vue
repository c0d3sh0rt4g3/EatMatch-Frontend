<script>
export default {
  name: "Footer"
}
</script>

<template>
<footer class="bottom-footer">
  <div class="footer-item active">
    <span class="footer-icon">🏠</span>
    <span class="footer-text">Home</span>
  </div>
  <div class="footer-item">
    <span class="footer-icon">🔍</span>
    <span class="footer-text">Explore</span>
  </div>
  <div class="footer-item">
    <span class="footer-icon">⭐</span>
    <span class="footer-text">Reviews</span>
  </div>
  <div class="footer-item">
    <span class="footer-icon">👤</span>
    <span class="footer-text">Profile</span>
  </div>
</footer>
</template>

<style scoped>
/* Bottom Navigation */
.bottom-footer {
  display: flex;
  justify-content: space-around;
  background-color: var(--color-bg-primary);
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  width: 25%;
}

.footer-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.footer-text {
  font-size: 12px;
  font-weight: 500;
}

.footer-item.active {
  color: var(--color-primary);
}
</style>