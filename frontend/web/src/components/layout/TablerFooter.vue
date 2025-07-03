<template>
  <!-- Exact Tabler.io Footer Structure -->
  <footer class="footer footer-transparent d-print-none">
    <div class="container-xl">
      <div class="row text-center align-items-center flex-row-reverse">
        <div class="col-lg-auto ms-lg-auto">
          <ul class="list-inline list-inline-dots mb-0">
            <li class="list-inline-item">
              <router-link to="/docs" class="link-secondary"> Documentation </router-link>
            </li>
            <li class="list-inline-item">
              <router-link to="/license" class="link-secondary"> License </router-link>
            </li>
            <li class="list-inline-item">
              <a href="https://github.com/tabler/tabler" target="_blank" rel="noopener" class="link-secondary">
                Source code
              </a>
            </li>
            <li class="list-inline-item">
              <a href="https://github.com/sponsors/codecalm" target="_blank" rel="noopener" class="link-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon text-pink icon-filled icon-inline"
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
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
                Sponsor
              </a>
            </li>
          </ul>
        </div>
        <div class="col-12 col-lg-auto mt-3 mt-lg-0">
          <ul class="list-inline list-inline-dots mb-0">
            <li class="list-inline-item">
              Copyright &copy; {{ currentYear }} <router-link to="/" class="link-secondary">{{ appName }}</router-link
              >. All rights reserved.
            </li>
            <li class="list-inline-item">
              <a href="#" class="link-secondary" rel="noopener"> v{{ appVersion }} </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  appName: {
    type: String,
    default: 'Attendance System'
  },
  appVersion: {
    type: String,
    default: '1.0.0'
  }
})

// Computed
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
/* Exact Tabler.io Footer Styling */
.footer {
  padding: 2rem 0;
  color: var(--tblr-muted);
  background: transparent;
  font-size: 0.875rem;
}

.footer-transparent {
  background-color: transparent;
}

.list-inline-dots > .list-inline-item + .list-inline-item::before {
  content: ' · ';
  margin-inline-end: 0.5rem;
}

.icon-inline {
  width: 1em;
  height: 1em;
  font-size: 1rem;
  vertical-align: -0.125em;
}

.icon-filled {
  fill: currentColor;
}

.text-pink {
  color: #ec4899 !important;
}

.link-secondary {
  color: var(--tblr-secondary);
  text-decoration: none;
}

.link-secondary:hover {
  color: var(--tblr-secondary);
  text-decoration: underline;
}

@media (max-width: 991px) {
  .footer {
    padding: 1.5rem 0;
  }
}
</style>
