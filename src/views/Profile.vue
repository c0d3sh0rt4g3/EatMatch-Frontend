<template>
  <!-- Sección de estadísticas del usuario -->
<section class="profile-stats">
  <div class="stat">
    <span class="number">{{ user.reviews }}</span>
    <span class="label">Reviews</span>
  </div>
  <div class="stat">
    <span class="number">{{ user.helpfulVotes }}</span>
    <span class="label">Helpfulvotes</span>
  </div>
</section>

<section class="activity-history">
  <h2>Recent activity</h2>
  <ul>
    <li v-for="activity in user.activities" :key="activity.id" class="activity-item">
      <p>{{ activity.type }}: {{ activity.content }}</p>
      <p>{{ activity.date}}</p>
    </li>
  </ul>
</section>
</template>

<script>
export default {
  name: "TripAdvisorProfile",
  data() {
    return {
      user: {
        name: "Juan Pérez",
        location: "Madrid, Spain",
        avatar: "https://via.placeholder.com/100",
        coverPhoto: "https://via.placeholder.com/800x200",
        reviews: 45,
        helpfulVotes: 120,
        activities: [
          { id: 1, type: "Review", content: "Hotel Gran Vista - Excelent experience", date: "02/03/2025" },
          { id: 2, type: "Review", content: "Restaurante La Parrilla - Tasty food", date: "20/02/2025" }
        ]
      }
    };
  }
};
</script>

<style scoped>
.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
.stat {
  text-align: center;
}
.number {
  font-size: 1.2em;
}
.label {
  color: #888;
}

/* Historial de actividades */
.activity-history {
  padding: 20px;
}
.activity-item {
  margin-bottom: 15px;
}
.activity-item p {
  margin-bottom: 5px;
}
.activity-item small {
  color: #999;
}
</style>
