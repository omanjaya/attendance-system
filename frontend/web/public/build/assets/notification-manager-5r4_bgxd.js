class c {
  constructor() {
    ;((this.container = null), this.init())
  }
  init() {
    ;((this.container = document.getElementById('notification-container')),
      this.container ||
        ((this.container = document.createElement('div')),
        (this.container.id = 'notification-container'),
        (this.container.className = 'notification-container'),
        (this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
            `),
        document.body.appendChild(this.container)))
  }
  show(t, i = 'info', s = {}) {
    const e = { title: null, duration: 5e3, dismissible: !0, icon: null, actions: null, ...s },
      n = this.createNotification(t, i, e)
    return (
      this.container.appendChild(n),
      setTimeout(() => {
        n.classList.add('show')
      }, 10),
      e.duration > 0 &&
        setTimeout(() => {
          this.dismiss(n)
        }, e.duration),
      n
    )
  }
  createNotification(t, i, s) {
    const e = document.createElement('div')
    ;((e.className = `alert alert-${i} notification-item`),
      (e.style.cssText = `
            margin-bottom: 10px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `))
    const n = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info-circle' },
      a = s.icon || n[i] || n.info
    let o = `
            <div class="d-flex">
                <div>
                    <svg class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                        ${this.getIconPath(a)}
                    </svg>
                </div>
                <div class="flex-1">
        `
    if (
      (s.title && (o += `<h4 class="alert-title">${s.title}</h4>`),
      (o += `<div class="text-muted">${t}</div>`),
      s.actions && (o += `<div class="btn-list mt-2">${s.actions}</div>`),
      (o += `
                </div>
        `),
      s.dismissible &&
        (o += `
                <button type="button" class="btn-close" data-dismiss="notification" aria-label="Close"></button>
            `),
      (o += '</div>'),
      (e.innerHTML = o),
      s.dismissible)
    ) {
      const r = e.querySelector('[data-dismiss="notification"]')
      r &&
        r.addEventListener('click', () => {
          this.dismiss(e)
        })
    }
    return (
      (e.classList.add = function (r) {
        r === 'show'
          ? ((this.style.opacity = '1'), (this.style.transform = 'translateX(0)'))
          : Element.prototype.classList.add.call(this, r)
      }),
      e
    )
  }
  dismiss(t) {
    ;((t.style.opacity = '0'),
      (t.style.transform = 'translateX(100%)'),
      setTimeout(() => {
        t.parentNode && t.parentNode.removeChild(t)
      }, 300))
  }
  success(t, i = {}) {
    return this.show(t, 'success', i)
  }
  error(t, i = {}) {
    return this.show(t, 'danger', { ...i, duration: 0 })
  }
  warning(t, i = {}) {
    return this.show(t, 'warning', i)
  }
  info(t, i = {}) {
    return this.show(t, 'info', i)
  }
  clearAll() {
    this.container.querySelectorAll('.notification-item').forEach(i => {
      this.dismiss(i)
    })
  }
  getIconPath(t) {
    const i = {
      'check-circle': '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>',
      'x-circle':
        '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      'alert-triangle':
        '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      'info-circle':
        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    }
    return i[t] || i['info-circle']
  }
  showValidationErrors(t) {
    if (typeof t == 'object') {
      const i = Object.values(t).flat().join('<br>')
      this.error(i, { title: 'Validation Errors', duration: 0 })
    } else this.error(t, { title: 'Validation Error', duration: 0 })
  }
  showResponse(t) {
    t.success
      ? this.success(t.message || 'Operation completed successfully')
      : t.errors
        ? this.showValidationErrors(t.errors)
        : this.error(t.message || 'An error occurred')
  }
}
window.NotificationManager = new c()
