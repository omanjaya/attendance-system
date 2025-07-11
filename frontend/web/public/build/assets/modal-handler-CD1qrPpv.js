class d {
  constructor() {
    ;((this.modals = new Map()), this.setupGlobalEvents())
  }
  register(n, e = {}) {
    const s = document.getElementById(n)
    if (!s) {
      console.warn(`Modal with id "${n}" not found`)
      return
    }
    const o = { form: null, validator: null, onShow: null, onHide: null, onSubmit: null, resetOnHide: !0, ...e }
    ;(this.modals.set(n, { element: s, instance: new bootstrap.Modal(s), config: o }), this.setupModalEvents(n))
  }
  setupModalEvents(n) {
    const e = this.modals.get(n)
    if (!e) return
    const { element: s, config: o } = e
    if (
      (s.addEventListener('show.bs.modal', t => {
        o.onShow && o.onShow(t)
      }),
      s.addEventListener('hide.bs.modal', t => {
        ;(o.onHide && o.onHide(t), o.resetOnHide && o.form && this.resetForm(o.form))
      }),
      o.form)
    ) {
      const t = typeof o.form == 'string' ? s.querySelector(o.form) : o.form
      t &&
        t.addEventListener('submit', async a => {
          ;(a.preventDefault(),
            !(o.validator && !o.validator.validateForm(t)) && o.onSubmit && (await o.onSubmit(a, t)))
        })
    }
  }
  show(n, e = null) {
    const s = this.modals.get(n)
    if (!s) {
      console.warn(`Modal "${n}" not registered`)
      return
    }
    ;(e && s.config.form && this.populateForm(s.config.form, e), s.instance.show())
  }
  hide(n) {
    const e = this.modals.get(n)
    if (!e) {
      console.warn(`Modal "${n}" not registered`)
      return
    }
    e.instance.hide()
  }
  populateForm(n, e) {
    const s = typeof n == 'string' ? document.querySelector(n) : n
    s &&
      Object.keys(e).forEach(o => {
        const t = s.querySelector(`[name="${o}"]`)
        if (t)
          if (t.type === 'checkbox') t.checked = !!e[o]
          else if (t.type === 'radio') {
            const a = s.querySelector(`[name="${o}"][value="${e[o]}"]`)
            a && (a.checked = !0)
          } else t.value = e[o] || ''
      })
  }
  resetForm(n) {
    const e = typeof n == 'string' ? document.querySelector(n) : n
    if (!e) return
    ;(e.reset(),
      e.querySelectorAll('.is-invalid').forEach(t => t.classList.remove('is-invalid')),
      e.querySelectorAll('.invalid-feedback').forEach(t => t.remove()))
  }
  getFormData(n) {
    const e = typeof n == 'string' ? document.querySelector(n) : n
    if (!e) return {}
    const s = new FormData(e),
      o = {}
    for (const [t, a] of s.entries()) {
      const i = e.querySelector(`[name="${t}"]`)
      i && i.type === 'checkbox' ? (o[t] = i.checked) : (o[t] = a)
    }
    return o
  }
  setupGlobalEvents() {
    document.addEventListener('click', n => {
      const e = n.target.closest('[data-modal-target]')
      if (e) {
        const s = e.getAttribute('data-modal-target'),
          o = e.getAttribute('data-modal-action') || 'show'
        if (o === 'show') {
          const t = {}
          ;(Object.keys(e.dataset).forEach(a => {
            if (a.startsWith('modal') && a !== 'modalTarget' && a !== 'modalAction') {
              const i = a.replace('modal', '').toLowerCase()
              t[i] = e.dataset[a]
            }
          }),
            this.show(s, Object.keys(t).length ? t : null))
        } else o === 'hide' && this.hide(s)
      }
    })
  }
  showConfirmation(n = {}) {
    const e = {
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmClass: 'btn-danger',
      onConfirm: null,
      ...n
    }
    return new Promise(s => {
      const o = 'confirmationModal'
      let t = document.getElementById(o)
      t
        ? ((t.querySelector('.modal-title').textContent = e.title),
          (t.querySelector('.modal-body').innerHTML = e.message),
          (t.querySelector('#confirmBtn').textContent = e.confirmText),
          (t.querySelector('#confirmBtn').className = `btn ${e.confirmClass}`))
        : ((t = document.createElement('div')),
          (t.innerHTML = `
                    <div class="modal fade" id="${o}" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">${e.title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    ${e.message}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${e.cancelText}</button>
                                    <button type="button" class="btn ${e.confirmClass}" id="confirmBtn">${e.confirmText}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `),
          document.body.appendChild(t.firstElementChild),
          (t = document.getElementById(o)))
      const a = new bootstrap.Modal(t),
        i = t.querySelector('#confirmBtn'),
        r = async () => {
          ;(e.onConfirm && (await e.onConfirm()), a.hide(), s(!0))
        }
      ;(i.removeEventListener('click', r), i.addEventListener('click', r))
      const l = () => {
        s(!1)
      }
      ;(t.removeEventListener('hide.bs.modal', l), t.addEventListener('hide.bs.modal', l, { once: !0 }), a.show())
    })
  }
}
window.ModalHandler = new d()
