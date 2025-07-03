class c {
  constructor() {
    ;((this.ajaxHandler = window.AjaxHandler),
      (this.notificationManager = window.NotificationManager),
      (this.modalHandler = window.ModalHandler),
      (this.validator = new FormValidator()),
      (this.userLocation = { latitude: null, longitude: null }),
      this.init())
  }
  init() {
    ;(this.setupValidation(), this.bindEvents(), this.updateMapDisplay(), this.loadLastSaved())
  }
  setupValidation() {
    ;(this.validator.addRule(
      'attendance_latitude',
      ValidationRules.range(-90, 90),
      'Latitude must be between -90 and 90'
    ),
      this.validator.addRule(
        'attendance_longitude',
        ValidationRules.range(-180, 180),
        'Longitude must be between -180 and 180'
      ),
      this.validator.addRule(
        'attendance_radius',
        ValidationRules.range(10, 1e3),
        'Radius must be between 10 and 1000 meters'
      ),
      this.validator.addRule(
        'standard_working_hours',
        ValidationRules.range(1, 24),
        'Working hours must be between 1 and 24'
      ),
      this.validator.addRule(
        'overtime_threshold',
        ValidationRules.range(1, 24),
        'Overtime threshold must be between 1 and 24'
      ),
      this.validator.addRule(
        'break_duration_minutes',
        ValidationRules.range(0, 480),
        'Break duration must be between 0 and 480 minutes'
      ),
      this.validator.addRule(
        'face_confidence_threshold',
        ValidationRules.range(0.1, 1),
        'Confidence threshold must be between 0.1 and 1.0'
      ),
      this.validator.addRule(
        'max_face_attempts',
        ValidationRules.range(1, 10),
        'Max attempts must be between 1 and 10'
      ))
  }
  bindEvents() {
    const t = document.getElementById('get-current-location')
    t && t.addEventListener('click', () => this.getCurrentLocation())
    const e = document.getElementById('test-gps')
    e && e.addEventListener('click', () => this.testGpsCoordinates())
    const n = document.getElementById('save-settings')
    n && n.addEventListener('click', () => this.saveSettings())
    const a = document.getElementById('export-settings')
    a && a.addEventListener('click', () => this.exportSettings())
    const i = document.getElementById('attendance-settings-form')
    if (i) {
      let r
      i.addEventListener('input', () => {
        ;(clearTimeout(r), (r = setTimeout(() => this.autoSave(), 2e3)))
      })
    }
    const s = document.getElementById('attendance_latitude'),
      o = document.getElementById('attendance_longitude')
    ;(s && s.addEventListener('input', () => this.updateMapDisplay()),
      o && o.addEventListener('input', () => this.updateMapDisplay()))
  }
  async getCurrentLocation() {
    const t = document.getElementById('get-current-location'),
      e = t == null ? void 0 : t.innerHTML
    try {
      if ((t && this.ajaxHandler.showLoading(t, 'Getting location...'), !navigator.geolocation))
        throw new Error('Geolocation is not supported by this browser')
      const n = await new Promise((o, r) => {
        navigator.geolocation.getCurrentPosition(o, r, { enableHighAccuracy: !0, timeout: 1e4, maximumAge: 0 })
      })
      ;((this.userLocation.latitude = n.coords.latitude), (this.userLocation.longitude = n.coords.longitude))
      const a = document.querySelector('input[name="test_coordinates"]')
      a && (a.value = `${this.userLocation.latitude.toFixed(6)}, ${this.userLocation.longitude.toFixed(6)}`)
      const i = document.querySelector('input[name="attendance_latitude"]'),
        s = document.querySelector('input[name="attendance_longitude"]')
      ;((!(i != null && i.value) || !(s != null && s.value)) &&
        (await this.modalHandler.showConfirmation({
          title: 'Use Current Location',
          message: 'Would you like to use your current location as the school location?',
          confirmText: 'Yes, use it',
          confirmClass: 'btn-primary'
        })) &&
        (i && (i.value = this.userLocation.latitude.toFixed(6)),
        s && (s.value = this.userLocation.longitude.toFixed(6)),
        this.updateMapDisplay()),
        this.notificationManager.success('Location obtained successfully! You can now test the GPS coordinates.'))
    } catch (n) {
      ;(console.error('Error getting location:', n),
        this.notificationManager.error('Could not get your location. Please ensure location permissions are enabled.'))
    } finally {
      t && e && this.ajaxHandler.hideLoading(t, e)
    }
  }
  async testGpsCoordinates() {
    var a, i, s
    if (!this.userLocation.latitude || !this.userLocation.longitude) {
      this.notificationManager.warning('Please get your current location first.')
      return
    }
    const t = parseFloat((a = document.querySelector('input[name="attendance_latitude"]')) == null ? void 0 : a.value),
      e = parseFloat((i = document.querySelector('input[name="attendance_longitude"]')) == null ? void 0 : i.value),
      n = parseInt((s = document.querySelector('input[name="attendance_radius"]')) == null ? void 0 : s.value)
    if (!t || !e || !n) {
      this.notificationManager.warning('Please fill in school coordinates and radius first.')
      return
    }
    try {
      const o = await this.ajaxHandler.post('/attendance-settings/test-gps', {
        latitude: t,
        longitude: e,
        test_latitude: this.userLocation.latitude,
        test_longitude: this.userLocation.longitude,
        radius: n
      })
      if (o.success) {
        const r = document.getElementById('gps-test-result')
        o.data.within_radius
          ? ((r.innerHTML = `<span class="text-success">✓ Within radius</span><br><small>Distance: ${o.data.distance}m</small>`),
            (r.className = 'form-control-plaintext text-success'),
            this.notificationManager.success('GPS test successful - within allowed radius'))
          : ((r.innerHTML = `<span class="text-danger">✗ Outside radius</span><br><small>Distance: ${o.data.distance}m (max: ${o.data.radius}m)</small>`),
            (r.className = 'form-control-plaintext text-danger'),
            this.notificationManager.warning('GPS test failed - outside allowed radius'))
      } else this.notificationManager.showResponse(o)
    } catch (o) {
      ;(console.error('Error testing GPS:', o),
        this.notificationManager.error('An error occurred while testing GPS coordinates.'))
    }
  }
  async saveSettings() {
    const t = document.getElementById('save-settings'),
      e = t == null ? void 0 : t.innerHTML
    try {
      t && this.ajaxHandler.showLoading(t, 'Saving...')
      const n = document.getElementById('attendance-settings-form')
      if (!this.validator.validateForm(n)) {
        this.notificationManager.error('Please fix validation errors before saving')
        return
      }
      const a = this.getFormData(n),
        i = await this.ajaxHandler.post('/attendance-settings', a)
      i.success
        ? (this.notificationManager.success('Settings saved successfully!'),
          this.updateLastSaved(),
          this.markFormAsSaved())
        : this.notificationManager.showResponse(i)
    } catch (n) {
      ;(console.error('Error saving settings:', n),
        this.notificationManager.error('An error occurred while saving settings.'))
    } finally {
      t && e && this.ajaxHandler.hideLoading(t, e)
    }
  }
  async autoSave() {
    const t = document.getElementById('attendance-settings-form')
    if (t)
      try {
        const e = this.getFormData(t)
        ;(await this.ajaxHandler.post('/attendance-settings', { ...e, auto_save: !0 })).success &&
          (this.showAutoSaveIndicator(), this.updateLastSaved())
      } catch (e) {
        console.error('Auto-save failed:', e)
      }
  }
  getFormData(t) {
    const e = new FormData(t),
      n = {}
    for (let [a, i] of e.entries()) {
      const s = t.querySelector(`[name="${a}"]`)
      ;(s == null ? void 0 : s.type) === 'checkbox' ? (n[a] = s.checked) : (n[a] = i)
    }
    return n
  }
  async exportSettings() {
    try {
      const t = await this.ajaxHandler.get('/attendance-settings/export')
      if (t.success) {
        const e = new Blob([JSON.stringify(t.data.settings, null, 2)], { type: 'application/json' }),
          n = URL.createObjectURL(e),
          a = document.createElement('a')
        ;((a.href = n),
          (a.download = `attendance-settings-${new Date().toISOString().split('T')[0]}.json`),
          document.body.appendChild(a),
          a.click(),
          document.body.removeChild(a),
          URL.revokeObjectURL(n),
          this.notificationManager.success('Settings exported successfully!'))
      } else this.notificationManager.showResponse(t)
    } catch (t) {
      ;(console.error('Error exporting settings:', t),
        this.notificationManager.error('An error occurred while exporting settings.'))
    }
  }
  async importSettings(t) {
    const e = t.files[0]
    if (e) {
      try {
        const n = await e.text(),
          a = JSON.parse(n)
        if (
          await this.modalHandler.showConfirmation({
            title: 'Import Settings',
            message: 'This will replace all current settings. Are you sure you want to continue?',
            confirmText: 'Import',
            confirmClass: 'btn-warning'
          })
        ) {
          const s = await this.ajaxHandler.post('/attendance-settings/import', { settings: a })
          s.success
            ? (this.notificationManager.success('Settings imported successfully!'), window.location.reload())
            : this.notificationManager.showResponse(s)
        }
      } catch (n) {
        ;(console.error('Error importing settings:', n),
          this.notificationManager.error('Invalid settings file or import failed.'))
      }
      t.value = ''
    }
  }
  async resetToDefaults() {
    if (
      await this.modalHandler.showConfirmation({
        title: 'Reset to Defaults',
        message: 'This will reset all attendance settings to their default values. This action cannot be undone.',
        confirmText: 'Reset',
        confirmClass: 'btn-danger'
      })
    )
      try {
        const e = await this.ajaxHandler.post('/attendance-settings/reset')
        e.success
          ? (this.notificationManager.success('Settings reset to defaults successfully!'), window.location.reload())
          : this.notificationManager.showResponse(e)
      } catch (e) {
        ;(console.error('Error resetting settings:', e),
          this.notificationManager.error('An error occurred while resetting settings.'))
      }
  }
  updateMapDisplay() {
    var a, i
    const t = (a = document.querySelector('input[name="attendance_latitude"]')) == null ? void 0 : a.value,
      e = (i = document.querySelector('input[name="attendance_longitude"]')) == null ? void 0 : i.value,
      n = document.getElementById('location-map')
    n &&
      (t && e
        ? (n.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100 text-success">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-lg mb-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="11" r="3"/>
                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>
                        </svg>
                        <div>School Location Set</div>
                        <small>Latitude: ${t}</small><br>
                        <small>Longitude: ${e}</small><br>
                        <a href="https://www.google.com/maps?q=${t},${e}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">
                            View on Google Maps
                        </a>
                    </div>
                </div>
            `)
        : (n.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100 text-muted">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-lg mb-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="11" r="3"/>
                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>
                        </svg>
                        <div>Map will appear here when coordinates are set</div>
                        <small>You can integrate Google Maps or OpenStreetMap</small>
                    </div>
                </div>
            `))
  }
  updateLastSaved() {
    const t = document.getElementById('last-updated')
    t && (t.textContent = new Date().toLocaleString())
  }
  showAutoSaveIndicator() {
    const t = document.createElement('div')
    ;((t.className = 'alert alert-success alert-dismissible fade show position-fixed'),
      (t.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 200px;'),
      (t.innerHTML = `
            <strong>Auto-saved!</strong> Changes saved automatically.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `),
      document.body.appendChild(t),
      setTimeout(() => {
        t.parentNode && t.parentNode.removeChild(t)
      }, 3e3))
  }
  markFormAsSaved() {
    const t = document.getElementById('attendance-settings-form')
    t &&
      (t.classList.add('form-saved'),
      setTimeout(() => {
        t.classList.remove('form-saved')
      }, 2e3))
  }
  loadLastSaved() {
    this.updateLastSaved()
  }
  validateSettings() {
    const t = document.getElementById('attendance-settings-form'),
      e = this.validator.validateForm(t)
    return (
      e
        ? this.notificationManager.success('All settings are valid!')
        : this.notificationManager.error('Please fix validation errors'),
      e
    )
  }
  previewSettings() {
    const t = document.getElementById('attendance-settings-form')
    ;(this.getFormData(t), this.notificationManager.info('Settings preview feature coming soon...'))
  }
}
window.SettingsManager = c
