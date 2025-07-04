class o {
  constructor() {
    ;((this.ajaxHandler = window.AjaxHandler),
      (this.modalHandler = window.ModalHandler),
      (this.notificationManager = window.NotificationManager),
      (this.camera = { stream: null, video: null, canvas: null, context: null }),
      (this.currentEmployee = null),
      (this.gestureData = { blink: !1, smile: !1, head_nod: !1, head_shake: !1 }),
      this.init())
  }
  init() {
    ;(this.setupElements(), this.setupModals(), this.checkApiStatus(), this.bindEvents())
  }
  setupElements() {
    ;((this.camera.video = document.getElementById('cameraVideo')),
      (this.camera.canvas = document.getElementById('cameraCanvas')),
      this.camera.canvas && (this.camera.context = this.camera.canvas.getContext('2d')))
  }
  setupModals() {
    this.modalHandler.register('cameraModal', {
      onShow: () => this.onCameraModalShow(),
      onHide: () => this.onCameraModalHide(),
      resetOnHide: !1
    })
  }
  bindEvents() {
    const e = document.getElementById('refresh-status')
    e && e.addEventListener('click', () => this.checkApiStatus())
    const t = document.getElementById('test-camera')
    t && t.addEventListener('click', () => this.testCamera())
  }
  async checkApiStatus() {
    const e = document.getElementById('api-status')
    ;(document.getElementById('api-indicator'),
      document.getElementById('api-status-dot'),
      document.getElementById('api-status-text'),
      e && (e.textContent = 'Checking...'))
    try {
      const t = await this.ajaxHandler.get('/face-recognition/status')
      t.success && t.data.status === 'online'
        ? (this.updateStatus('api', 'online', 'API Online'),
          this.notificationManager.success('Face recognition API is online'))
        : (this.updateStatus('api', 'offline', 'API Offline'),
          this.notificationManager.warning('Face recognition API is offline'))
    } catch {
      ;(this.updateStatus('api', 'error', 'Connection Error'),
        this.notificationManager.error('Failed to connect to face recognition API'))
    }
  }
  updateStatus(e, t, a) {
    const s = document.getElementById(`${e}-status`),
      n = document.getElementById(`${e}-status-dot`),
      i = document.getElementById(`${e}-status-text`)
    ;(s && (s.textContent = a),
      n &&
        (n.className = `status-dot ${t === 'online' ? 'status-dot-animated bg-green' : t === 'offline' ? 'bg-red' : 'bg-yellow'}`),
      i && (i.textContent = a))
  }
  async testCamera() {
    try {
      const e = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      ;(this.updateStatus('camera', 'online', 'Camera accessible'),
        this.notificationManager.success('Camera access granted'),
        e.getTracks().forEach(t => t.stop()))
    } catch {
      ;(this.updateStatus('camera', 'error', 'Camera access denied'),
        this.notificationManager.error('Camera access denied. Please check permissions.'))
    }
  }
  async startCamera() {
    const e = this.camera.video,
      t = document.getElementById('captureBtn'),
      a = document.getElementById('camera-status')
    try {
      ;((this.camera.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      })),
        e &&
          ((e.srcObject = this.camera.stream),
          (e.onloadedmetadata = () => {
            ;(e.play(),
              t && (t.disabled = !1),
              a && (a.textContent = 'Camera Active'),
              (a.className = 'badge bg-success'))
          })),
        this.startGestureDetection())
    } catch (s) {
      ;(console.error('Camera access error:', s),
        this.notificationManager.error('Unable to access camera. Please check permissions.'),
        a && ((a.textContent = 'Camera Error'), (a.className = 'badge bg-danger')))
    }
  }
  stopCamera() {
    this.camera.stream && (this.camera.stream.getTracks().forEach(s => s.stop()), (this.camera.stream = null))
    const e = this.camera.video,
      t = document.getElementById('captureBtn'),
      a = document.getElementById('camera-status')
    ;(e && (e.srcObject = null),
      t && (t.disabled = !0),
      a && ((a.textContent = 'Camera Stopped'), (a.className = 'badge bg-secondary')),
      this.resetGestureStatus())
  }
  startGestureDetection() {
    const e = ['blink', 'smile', 'nod', 'shake']
    let t = 0
    const a = () => {
      if (t < e.length) {
        const s = e[t]
        setTimeout(
          () => {
            if (
              (this.updateGestureStatus(s, 'detected'),
              (this.gestureData[s === 'nod' ? 'head_nod' : s === 'shake' ? 'head_shake' : s] = !0),
              t++,
              a(),
              t >= e.length)
            ) {
              const n = document.getElementById('saveBtn')
              n && (n.disabled = !1)
            }
          },
          2e3 + t * 1e3
        )
      }
    }
    a()
  }
  updateGestureStatus(e, t) {
    const a = document.getElementById(`gesture-${e}`)
    if (a) {
      const s = a.querySelector('.badge')
      s &&
        ((s.textContent = t === 'detected' ? 'Detected' : 'Waiting'),
        (s.className = t === 'detected' ? 'badge bg-success' : 'badge bg-secondary'))
    }
  }
  resetGestureStatus() {
    ;['blink', 'smile', 'nod', 'shake'].forEach(a => {
      ;(this.updateGestureStatus(a, 'waiting'),
        (this.gestureData[a === 'nod' ? 'head_nod' : a === 'shake' ? 'head_shake' : a] = !1))
    })
    const t = document.getElementById('saveBtn')
    t && (t.disabled = !0)
  }
  captureImage() {
    const e = this.camera.video,
      t = this.camera.canvas
    if (e && t && this.camera.context) {
      ;((t.width = e.videoWidth), (t.height = e.videoHeight), this.camera.context.drawImage(e, 0, 0))
      const a = t.toDataURL('image/jpeg', 0.8)
      ;((this.currentImageData = a), this.notificationManager.success('Image captured successfully'))
    }
  }
  async saveFaceData() {
    if (!this.currentEmployee || !this.currentImageData) {
      this.notificationManager.error('Missing employee or image data')
      return
    }
    const e = document.getElementById('saveBtn'),
      t = e == null ? void 0 : e.innerHTML
    try {
      e && this.ajaxHandler.showLoading(e, 'Saving...')
      const a = await this.ajaxHandler.post('/face-recognition/register-face', {
        employee_id: this.currentEmployee.id,
        image_data: this.currentImageData,
        gestures: this.gestureData
      })
      a.success
        ? (this.notificationManager.success(`Face registration completed for ${this.currentEmployee.name}`),
          this.modalHandler.hide('cameraModal'),
          this.refreshEmployeeList())
        : this.notificationManager.showResponse(a)
    } catch {
      this.notificationManager.error('Failed to save face registration')
    } finally {
      e && t && this.ajaxHandler.hideLoading(e, t)
    }
  }
  registerFace(e, t) {
    this.currentEmployee = { id: e, name: t }
    const a = document.getElementById('selected-employee-name'),
      s = document.getElementById('selected-employee-id')
    ;(a && (a.textContent = t),
      s && (s.textContent = `ID: ${e}`),
      this.resetGestureStatus(),
      (this.currentImageData = null),
      this.modalHandler.show('cameraModal'))
  }
  async removeFace(e, t) {
    if (
      await this.modalHandler.showConfirmation({
        title: 'Remove Face Registration',
        message: `Are you sure you want to remove face registration for ${t}?`,
        confirmText: 'Remove',
        confirmClass: 'btn-danger'
      })
    )
      try {
        const s = await this.ajaxHandler.delete('/face-recognition/remove-face', { employee_id: e })
        s.success
          ? (this.notificationManager.success(`Face registration removed for ${t}`), this.refreshEmployeeList())
          : this.notificationManager.showResponse(s)
      } catch {
        this.notificationManager.error('Failed to remove face registration')
      }
  }
  reRegisterFace(e, t) {
    this.registerFace(e, t)
  }
  viewFaceData(e, t) {
    this.notificationManager.info(`Viewing face data for ${t} (Feature coming soon)`)
  }
  onCameraModalShow() {}
  onCameraModalHide() {
    ;(this.stopCamera(), (this.currentEmployee = null), (this.currentImageData = null))
  }
  refreshEmployeeList() {
    window.location.reload()
  }
  runSystemCheck() {
    ;(this.notificationManager.info('Running full system check...'), this.checkApiStatus(), this.testCamera())
  }
  testGestureDetection() {
    this.notificationManager.info('Testing gesture detection...')
  }
  viewSystemLogs() {
    this.notificationManager.info('System logs feature coming soon...')
  }
}
window.FaceRecognitionManager = o
