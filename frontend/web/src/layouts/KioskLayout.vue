<template>
  <div class="page page-center kiosk-mode">
    <div class="container-xl">
      <div class="text-center mb-4">
        <div class="navbar-brand h2 mb-0">Attendance System</div>
        <h1 class="h2 mt-3">Attendance Kiosk</h1>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script setup>
// Kiosk layout for attendance stations
</script>

<style scoped>
.kiosk-mode {
  min-height: 100vh;
  background: #f8f9fa;
  font-size: 1.2rem;
}

.container-xl {
  max-width: 800px;
}
</style>
