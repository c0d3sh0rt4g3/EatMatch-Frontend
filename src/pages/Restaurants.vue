<script>
export default {
  name: "Restaurants",
  data() {
    return {
      map: null,
      markers: [],
      searchInput: '',
      searchBox: null,
      restaurants: [],
      loading: false
    }
  },
  mounted() {
    this.loadGoogleMapsApi();
  },
  methods: {
    loadGoogleMapsApi() {
      if (window.google && window.google.maps) {
        this.initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyANkU0fgMKKKjwP332Nz2WTGY29JRCfvTo&libraries=places&callback=initGoogleMaps`;
      document.head.appendChild(script);

      window.initGoogleMaps = () => {
        this.initMap();
      };
    },

    initMap() {
      // Initialize the map with a default location
      const initialLocation = { lat: 39.9522334, lng: -75.1694917 };
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: initialLocation,
        zoom: 15
      });

      // Create the search box and link it to the UI element
      this.searchInput = document.getElementById('restaurant-search');
      this.searchBox = new window.google.maps.places.SearchBox(this.searchInput);

      // Position the search box at the top of the map
      this.map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('search-container'));

      // Bias the SearchBox results towards current map's viewport
      this.map.addListener('bounds_changed', () => {
        this.searchBox.setBounds(this.map.getBounds());
      });

      // Listen for the event when a user selects a prediction
      this.searchBox.addListener('places_changed', () => {
        this.handlePlacesChanged();
      });
    },

    handlePlacesChanged() {
      this.loading = true;
      const places = this.searchBox.getPlaces();

      if (places.length === 0) {
        this.loading = false;
        return;
      }

      // Clear existing markers
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
      this.markers = [];
      this.restaurants = [];

      // For each place, create a marker
      const bounds = new window.google.maps.LatLngBounds();

      places.forEach(place => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        // Store restaurant data
        this.restaurants.push({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || '',
          rating: place.rating || 'Not rated',
          location: place.geometry.location,
          photos: place.photos ? place.photos[0].getUrl() : null
        });

        // Create marker icon
        const icon = {
          url: place.icon,
          size: new window.google.maps.Size(71, 71),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(17, 34),
          scaledSize: new window.google.maps.Size(25, 25)
        };

        // Create a marker for the place
        const marker = new window.google.maps.Marker({
          map: this.map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        });

        this.markers.push(marker);

        // Create info window for the marker
        const infoContent = `
          <div class="info-window">
            <h3>${place.name}</h3>
            <p>${place.formatted_address || ''}</p>
            ${place.rating ? `<p>Rating: ${place.rating} ⭐</p>` : ''}
            <button onclick="document.dispatchEvent(new CustomEvent('make-reservation', {detail: '${place.place_id}'}))">
              Make a Reservation
            </button>
          </div>
        `;

        const infowindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infowindow.open(this.map, marker);
        });

        // Extend the bounds to include the place's location
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      this.map.fitBounds(bounds);
      this.loading = false;

      // Listen for reservation button clicks in info windows
      document.addEventListener('make-reservation', (e) => {
        this.makeReservation(e.detail);
      });
    },

    searchRestaurants() {
      if (!this.searchInput.value.trim()) return;

      // Trigger the search
      const event = new Event('places_changed');
      this.searchBox.dispatchEvent(event);
    },

    makeReservation(restaurantId) {
      // Handle reservation logic here
      console.log(`Making reservation for restaurant ID: ${restaurantId}`);
      // You could navigate to a reservation page or open a modal
    }
  }
}
</script>

<template>
  <div id="map-container">
    <div id="search-container" class="search-container">
      <div class="search-box">
        <input
          id="restaurant-search"
          type="text"
          placeholder="Search for restaurants"
          class="search-input"
          v-model="searchInput"
          @keyup.enter="searchRestaurants"
        />
        <button class="search-button" @click="searchRestaurants">
          <span class="search-icon">🔍</span>
        </button>
      </div>
    </div>

    <div id="map"></div>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div v-if="restaurants.length > 0" class="restaurant-list">
      <h2>Search Results</h2>
      <div v-for="restaurant in restaurants" :key="restaurant.id" class="restaurant-card">
        <div class="restaurant-image" v-if="restaurant.photos">
          <img :src="restaurant.photos" :alt="restaurant.name">
        </div>
        <div class="restaurant-info">
          <h3>{{ restaurant.name }}</h3>
          <p>{{ restaurant.address }}</p>
          <p v-if="restaurant.rating">Rating: {{ restaurant.rating }} ⭐</p>
          <button @click="makeReservation(restaurant.id)" class="reservation-button">
            Make a Reservation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#map-container {
  position: relative;
  width: 100%;
  height: 500px;
}

#map {
  width: 100%;
  height: 100%;
}

.search-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
  background-color: #fff;
  padding: 5px;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.search-box {
  display: flex;
  align-items: center;
}

.search-input {
  box-sizing: border-box;
  border: 1px solid #ccc;
  width: 240px;
  height: 32px;
  padding: 0 12px;
  border-radius: 3px 0 0 3px;
  font-size: 14px;
  outline: none;
  text-overflow: ellipsis;
}

.search-button {
  height: 32px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
  padding: 0 15px;
}

.search-icon {
  font-size: 14px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.restaurant-list {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.restaurant-card {
  display: flex;
  margin-bottom: 15px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.restaurant-image {
  width: 120px;
  height: 120px;
  overflow: hidden;
}

.restaurant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.restaurant-info {
  padding: 10px 15px;
  flex: 1;
}

.restaurant-info h3 {
  margin-top: 0;
  margin-bottom: 5px;
}

.restaurant-info p {
  margin: 5px 0;
  color: #666;
}

.reservation-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
}

.reservation-button:hover {
  background-color: #45a049;
}

.info-window {
  padding: 5px;
  max-width: 200px;
}

.info-window h3 {
  margin-top: 0;
  font-size: 16px;
}

.info-window p {
  margin: 5px 0;
  font-size: 12px;
}

.info-window button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 5px;
}
</style>
