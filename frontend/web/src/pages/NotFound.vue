<template>
  <!-- Exact Tabler.io 404 Error Page -->
  <div class="page page-center">
    <div class="container-tight py-4">
      <div class="empty">
        <div class="empty-img">
          <img
            src="https://preview.tabler.io/static/illustrations/undraw_quitting_time_dm8t.svg"
            height="128"
            alt=""
            class="mb-4"
          />
        </div>
        <p class="empty-title">404</p>
        <p class="empty-subtitle text-muted">Oops… You just found an error page</p>
        <p class="empty-subtitle text-muted">
          We are sorry but the page you are looking for was not found
        </p>
        <div class="empty-action">
          <router-link to="/" class="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="5" y1="12" x2="11" y2="18" />
              <line x1="5" y1="12" x2="11" y2="6" />
            </svg>
            Take me home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 Not Found page
</script>

<style scoped>
/* Exact Tabler.io 404 Page Styling */
.page-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.container-tight {
  max-width: 30rem;
  margin: 0 auto;
}

.empty {
  margin: 3rem 0;
  text-align: center;
}

.empty-img img {
  height: 8rem;
  width: auto;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 4rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 0.25rem;
  color: var(--tblr-muted);
}

.empty-subtitle {
  color: var(--tblr-text-muted);
  margin-bottom: 1.5rem;
}

.empty-action {
  margin-top: 2rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 1.5;
  vertical-align: bottom;
  margin-right: 0.5rem;
}
</style>
