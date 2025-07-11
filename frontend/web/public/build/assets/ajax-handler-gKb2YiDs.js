class a {
  constructor() {
    var e
    this.csrfToken =
      (e = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : e.getAttribute('content')
  }
  getHeaders() {
    const e = { 'Content-Type': 'application/json', Accept: 'application/json' }
    return (this.csrfToken && (e['X-CSRF-TOKEN'] = this.csrfToken), e)
  }
  async request(e, s = {}) {
    const n = { ...{ headers: this.getHeaders(), credentials: 'same-origin' }, ...s }
    try {
      const r = await fetch(e, n),
        o = await r.json()
      if (!r.ok) throw new Error(o.message || `HTTP error! status: ${r.status}`)
      return { success: !0, data: o }
    } catch (r) {
      return (console.error('Request failed:', r), { success: !1, error: r.message })
    }
  }
  async get(e, s = {}) {
    const t = new URLSearchParams(s),
      n = t.toString() ? `${e}?${t}` : e
    return this.request(n, { method: 'GET' })
  }
  async post(e, s = {}) {
    return this.request(e, { method: 'POST', body: JSON.stringify(s) })
  }
  async put(e, s = {}) {
    return this.request(e, { method: 'PUT', body: JSON.stringify(s) })
  }
  async delete(e) {
    return this.request(e, { method: 'DELETE' })
  }
  async postForm(e, s) {
    const t = {}
    return (
      this.csrfToken && (t['X-CSRF-TOKEN'] = this.csrfToken),
      this.request(e, { method: 'POST', headers: t, body: s })
    )
  }
  showLoading(e, s = 'Loading...') {
    e &&
      ((e.disabled = !0),
      (e.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>${s}`))
  }
  hideLoading(e, s) {
    e && ((e.disabled = !1), (e.innerHTML = s))
  }
}
window.AjaxHandler = new a()
