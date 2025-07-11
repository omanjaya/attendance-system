class l {
  constructor() {
    ;((this.rules = {}), (this.messages = {}))
  }
  addRule(e, t, a) {
    ;(this.rules[e] || (this.rules[e] = []),
      this.rules[e].push(t),
      this.messages[e] || (this.messages[e] = []),
      this.messages[e].push(a))
  }
  static validateTime(e) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(e)
  }
  static validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }
  static validateRequired(e) {
    return e != null && e.toString().trim() !== ''
  }
  static validateMinLength(e, t) {
    return e && e.toString().length >= t
  }
  static validateMaxLength(e, t) {
    return !e || e.toString().length <= t
  }
  static validateRange(e, t, a) {
    const s = parseFloat(e)
    return !isNaN(s) && s >= t && s <= a
  }
  static validateTimeRange(e, t) {
    if (!e || !t) return !0
    const a = new Date(`2000-01-01 ${e}`),
      s = new Date(`2000-01-01 ${t}`)
    return a < s
  }
  validateForm(e) {
    const t = {},
      a = new FormData(e)
    this.clearErrors(e)
    for (const [s, r] of Object.entries(this.rules)) {
      const o = a.get(s)
      for (let n = 0; n < r.length; n++) {
        const c = r[n],
          d = this.messages[s][n]
        if (typeof c == 'function' && !c(o)) {
          t[s] = d
          break
        }
      }
    }
    return (this.displayErrors(e, t), Object.keys(t).length === 0)
  }
  clearErrors(e) {
    ;(e.querySelectorAll('.is-invalid').forEach(s => s.classList.remove('is-invalid')),
      e.querySelectorAll('.invalid-feedback').forEach(s => s.remove()))
  }
  displayErrors(e, t) {
    for (const [a, s] of Object.entries(t)) {
      const r = e.querySelector(`[name="${a}"]`)
      if (r) {
        r.classList.add('is-invalid')
        const o = r.parentNode.querySelector('.invalid-feedback')
        o && o.remove()
        const n = document.createElement('div')
        ;((n.className = 'invalid-feedback'), (n.textContent = s), r.parentNode.appendChild(n))
      }
    }
  }
  setupRealTimeValidation(e) {
    e.querySelectorAll('input, select, textarea').forEach(a => {
      ;(a.addEventListener('blur', () => {
        this.validateField(a)
      }),
        a.addEventListener('input', () => {
          a.classList.remove('is-invalid')
          const s = a.parentNode.querySelector('.invalid-feedback')
          s && s.remove()
        }))
    })
  }
  validateField(e) {
    const t = e.name,
      a = e.value
    if (this.rules[t])
      for (let s = 0; s < this.rules[t].length; s++) {
        const r = this.rules[t][s],
          o = this.messages[t][s]
        if (typeof r == 'function' && !r(a)) {
          e.classList.add('is-invalid')
          const n = e.parentNode.querySelector('.invalid-feedback')
          n && n.remove()
          const c = document.createElement('div')
          return ((c.className = 'invalid-feedback'), (c.textContent = o), e.parentNode.appendChild(c), !1)
        }
      }
    return !0
  }
}
const u = {
  required: i => l.validateRequired(i),
  email: i => !i || l.validateEmail(i),
  time: i => !i || l.validateTime(i),
  minLength: i => e => l.validateMinLength(e, i),
  maxLength: i => e => l.validateMaxLength(e, i),
  range: (i, e) => t => l.validateRange(t, i, e),
  timeRange: (i, e) => (t, a) => {
    const s = a.get(i),
      r = a.get(e)
    return l.validateTimeRange(s, r)
  }
}
window.FormValidator = l
window.ValidationRules = u
