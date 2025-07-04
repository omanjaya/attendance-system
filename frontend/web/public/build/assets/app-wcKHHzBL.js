function th(e, t) {
  return function () {
    return e.apply(t, arguments)
  }
}
const { toString: zv } = Object.prototype,
  { getPrototypeOf: yu } = Object,
  { iterator: kl, toStringTag: nh } = Symbol,
  El = (e => t => {
    const r = zv.call(t)
    return e[r] || (e[r] = r.slice(8, -1).toLowerCase())
  })(Object.create(null)),
  Dr = e => ((e = e.toLowerCase()), t => El(t) === e),
  Ol = e => t => typeof t === e,
  { isArray: ts } = Array,
  Ks = Ol('undefined')
function Kv(e) {
  return (
    e !== null &&
    !Ks(e) &&
    e.constructor !== null &&
    !Ks(e.constructor) &&
    Yn(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  )
}
const rh = Dr('ArrayBuffer')
function Xv(e) {
  let t
  return (
    typeof ArrayBuffer < 'u' && ArrayBuffer.isView ? (t = ArrayBuffer.isView(e)) : (t = e && e.buffer && rh(e.buffer)),
    t
  )
}
const Gv = Ol('string'),
  Yn = Ol('function'),
  ih = Ol('number'),
  Pl = e => e !== null && typeof e == 'object',
  Jv = e => e === !0 || e === !1,
  Za = e => {
    if (El(e) !== 'object') return !1
    const t = yu(e)
    return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(nh in e) && !(kl in e)
  },
  Yv = Dr('Date'),
  Qv = Dr('File'),
  Zv = Dr('Blob'),
  eg = Dr('FileList'),
  tg = e => Pl(e) && Yn(e.pipe),
  ng = e => {
    let t
    return (
      e &&
      ((typeof FormData == 'function' && e instanceof FormData) ||
        (Yn(e.append) &&
          ((t = El(e)) === 'formdata' || (t === 'object' && Yn(e.toString) && e.toString() === '[object FormData]'))))
    )
  },
  rg = Dr('URLSearchParams'),
  [ig, og, sg, ag] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(Dr),
  lg = e => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
function sa(e, t, { allOwnKeys: r = !1 } = {}) {
  if (e === null || typeof e > 'u') return
  let n, i
  if ((typeof e != 'object' && (e = [e]), ts(e))) for (n = 0, i = e.length; n < i; n++) t.call(null, e[n], n, e)
  else {
    const s = r ? Object.getOwnPropertyNames(e) : Object.keys(e),
      a = s.length
    let d
    for (n = 0; n < a; n++) ((d = s[n]), t.call(null, e[d], d, e))
  }
}
function oh(e, t) {
  t = t.toLowerCase()
  const r = Object.keys(e)
  let n = r.length,
    i
  for (; n-- > 0; ) if (((i = r[n]), t === i.toLowerCase())) return i
  return null
}
const ho = typeof globalThis < 'u' ? globalThis : typeof self < 'u' ? self : typeof window < 'u' ? window : global,
  sh = e => !Ks(e) && e !== ho
function Wc() {
  const { caseless: e } = (sh(this) && this) || {},
    t = {},
    r = (n, i) => {
      const s = (e && oh(t, i)) || i
      Za(t[s]) && Za(n) ? (t[s] = Wc(t[s], n)) : Za(n) ? (t[s] = Wc({}, n)) : ts(n) ? (t[s] = n.slice()) : (t[s] = n)
    }
  for (let n = 0, i = arguments.length; n < i; n++) arguments[n] && sa(arguments[n], r)
  return t
}
const cg = (e, t, r, { allOwnKeys: n } = {}) => (
    sa(
      t,
      (i, s) => {
        r && Yn(i) ? (e[s] = th(i, r)) : (e[s] = i)
      },
      { allOwnKeys: n }
    ),
    e
  ),
  ug = e => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  dg = (e, t, r, n) => {
    ;((e.prototype = Object.create(t.prototype, n)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, 'super', { value: t.prototype }),
      r && Object.assign(e.prototype, r))
  },
  fg = (e, t, r, n) => {
    let i, s, a
    const d = {}
    if (((t = t || {}), e == null)) return t
    do {
      for (i = Object.getOwnPropertyNames(e), s = i.length; s-- > 0; )
        ((a = i[s]), (!n || n(a, e, t)) && !d[a] && ((t[a] = e[a]), (d[a] = !0)))
      e = r !== !1 && yu(e)
    } while (e && (!r || r(e, t)) && e !== Object.prototype)
    return t
  },
  hg = (e, t, r) => {
    ;((e = String(e)), (r === void 0 || r > e.length) && (r = e.length), (r -= t.length))
    const n = e.indexOf(t, r)
    return n !== -1 && n === r
  },
  pg = e => {
    if (!e) return null
    if (ts(e)) return e
    let t = e.length
    if (!ih(t)) return null
    const r = new Array(t)
    for (; t-- > 0; ) r[t] = e[t]
    return r
  },
  mg = (
    e => t =>
      e && t instanceof e
  )(typeof Uint8Array < 'u' && yu(Uint8Array)),
  vg = (e, t) => {
    const n = (e && e[kl]).call(e)
    let i
    for (; (i = n.next()) && !i.done; ) {
      const s = i.value
      t.call(e, s[0], s[1])
    }
  },
  gg = (e, t) => {
    let r
    const n = []
    for (; (r = e.exec(t)) !== null; ) n.push(r)
    return n
  },
  bg = Dr('HTMLFormElement'),
  yg = e =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (r, n, i) {
      return n.toUpperCase() + i
    }),
  Fd = (
    ({ hasOwnProperty: e }) =>
    (t, r) =>
      e.call(t, r)
  )(Object.prototype),
  _g = Dr('RegExp'),
  ah = (e, t) => {
    const r = Object.getOwnPropertyDescriptors(e),
      n = {}
    ;(sa(r, (i, s) => {
      let a
      ;(a = t(i, s, e)) !== !1 && (n[s] = a || i)
    }),
      Object.defineProperties(e, n))
  },
  wg = e => {
    ah(e, (t, r) => {
      if (Yn(e) && ['arguments', 'caller', 'callee'].indexOf(r) !== -1) return !1
      const n = e[r]
      if (Yn(n)) {
        if (((t.enumerable = !1), 'writable' in t)) {
          t.writable = !1
          return
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + r + "'")
          })
      }
    })
  },
  xg = (e, t) => {
    const r = {},
      n = i => {
        i.forEach(s => {
          r[s] = !0
        })
      }
    return (ts(e) ? n(e) : n(String(e).split(t)), r)
  },
  Sg = () => {},
  Cg = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t)
function Tg(e) {
  return !!(e && Yn(e.append) && e[nh] === 'FormData' && e[kl])
}
const Ag = e => {
    const t = new Array(10),
      r = (n, i) => {
        if (Pl(n)) {
          if (t.indexOf(n) >= 0) return
          if (!('toJSON' in n)) {
            t[i] = n
            const s = ts(n) ? [] : {}
            return (
              sa(n, (a, d) => {
                const f = r(a, i + 1)
                !Ks(f) && (s[d] = f)
              }),
              (t[i] = void 0),
              s
            )
          }
        }
        return n
      }
    return r(e, 0)
  },
  Dg = Dr('AsyncFunction'),
  kg = e => e && (Pl(e) || Yn(e)) && Yn(e.then) && Yn(e.catch),
  lh = ((e, t) =>
    e
      ? setImmediate
      : t
        ? ((r, n) => (
            ho.addEventListener(
              'message',
              ({ source: i, data: s }) => {
                i === ho && s === r && n.length && n.shift()()
              },
              !1
            ),
            i => {
              ;(n.push(i), ho.postMessage(r, '*'))
            }
          ))(`axios@${Math.random()}`, [])
        : r => setTimeout(r))(typeof setImmediate == 'function', Yn(ho.postMessage)),
  Eg = typeof queueMicrotask < 'u' ? queueMicrotask.bind(ho) : (typeof process < 'u' && process.nextTick) || lh,
  Og = e => e != null && Yn(e[kl]),
  G = {
    isArray: ts,
    isArrayBuffer: rh,
    isBuffer: Kv,
    isFormData: ng,
    isArrayBufferView: Xv,
    isString: Gv,
    isNumber: ih,
    isBoolean: Jv,
    isObject: Pl,
    isPlainObject: Za,
    isReadableStream: ig,
    isRequest: og,
    isResponse: sg,
    isHeaders: ag,
    isUndefined: Ks,
    isDate: Yv,
    isFile: Qv,
    isBlob: Zv,
    isRegExp: _g,
    isFunction: Yn,
    isStream: tg,
    isURLSearchParams: rg,
    isTypedArray: mg,
    isFileList: eg,
    forEach: sa,
    merge: Wc,
    extend: cg,
    trim: lg,
    stripBOM: ug,
    inherits: dg,
    toFlatObject: fg,
    kindOf: El,
    kindOfTest: Dr,
    endsWith: hg,
    toArray: pg,
    forEachEntry: vg,
    matchAll: gg,
    isHTMLForm: bg,
    hasOwnProperty: Fd,
    hasOwnProp: Fd,
    reduceDescriptors: ah,
    freezeMethods: wg,
    toObjectSet: xg,
    toCamelCase: yg,
    noop: Sg,
    toFiniteNumber: Cg,
    findKey: oh,
    global: ho,
    isContextDefined: sh,
    isSpecCompliantForm: Tg,
    toJSONObject: Ag,
    isAsyncFn: Dg,
    isThenable: kg,
    setImmediate: lh,
    asap: Eg,
    isIterable: Og
  }
function at(e, t, r, n, i) {
  ;(Error.call(this),
    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = 'AxiosError'),
    t && (this.code = t),
    r && (this.config = r),
    n && (this.request = n),
    i && ((this.response = i), (this.status = i.status ? i.status : null)))
}
G.inherits(at, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: G.toJSONObject(this.config),
      code: this.code,
      status: this.status
    }
  }
})
const ch = at.prototype,
  uh = {}
;[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
].forEach(e => {
  uh[e] = { value: e }
})
Object.defineProperties(at, uh)
Object.defineProperty(ch, 'isAxiosError', { value: !0 })
at.from = (e, t, r, n, i, s) => {
  const a = Object.create(ch)
  return (
    G.toFlatObject(
      e,
      a,
      function (f) {
        return f !== Error.prototype
      },
      d => d !== 'isAxiosError'
    ),
    at.call(a, e.message, t, r, n, i),
    (a.cause = e),
    (a.name = e.name),
    s && Object.assign(a, s),
    a
  )
}
const Pg = null
function Vc(e) {
  return G.isPlainObject(e) || G.isArray(e)
}
function dh(e) {
  return G.endsWith(e, '[]') ? e.slice(0, -2) : e
}
function jd(e, t, r) {
  return e
    ? e
        .concat(t)
        .map(function (i, s) {
          return ((i = dh(i)), !r && s ? '[' + i + ']' : i)
        })
        .join(r ? '.' : '')
    : t
}
function Rg(e) {
  return G.isArray(e) && !e.some(Vc)
}
const Lg = G.toFlatObject(G, {}, null, function (t) {
  return /^is[A-Z]/.test(t)
})
function Rl(e, t, r) {
  if (!G.isObject(e)) throw new TypeError('target must be an object')
  ;((t = t || new FormData()),
    (r = G.toFlatObject(r, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (k, F) {
      return !G.isUndefined(F[k])
    })))
  const n = r.metaTokens,
    i = r.visitor || p,
    s = r.dots,
    a = r.indexes,
    f = (r.Blob || (typeof Blob < 'u' && Blob)) && G.isSpecCompliantForm(t)
  if (!G.isFunction(i)) throw new TypeError('visitor must be a function')
  function g(A) {
    if (A === null) return ''
    if (G.isDate(A)) return A.toISOString()
    if (G.isBoolean(A)) return A.toString()
    if (!f && G.isBlob(A)) throw new at('Blob is not supported. Use a Buffer instead.')
    return G.isArrayBuffer(A) || G.isTypedArray(A)
      ? f && typeof Blob == 'function'
        ? new Blob([A])
        : Buffer.from(A)
      : A
  }
  function p(A, k, F) {
    let N = A
    if (A && !F && typeof A == 'object') {
      if (G.endsWith(k, '{}')) ((k = n ? k : k.slice(0, -2)), (A = JSON.stringify(A)))
      else if ((G.isArray(A) && Rg(A)) || ((G.isFileList(A) || G.endsWith(k, '[]')) && (N = G.toArray(A))))
        return (
          (k = dh(k)),
          N.forEach(function (z, Y) {
            !(G.isUndefined(z) || z === null) && t.append(a === !0 ? jd([k], Y, s) : a === null ? k : k + '[]', g(z))
          }),
          !1
        )
    }
    return Vc(A) ? !0 : (t.append(jd(F, k, s), g(A)), !1)
  }
  const y = [],
    _ = Object.assign(Lg, { defaultVisitor: p, convertValue: g, isVisitable: Vc })
  function C(A, k) {
    if (!G.isUndefined(A)) {
      if (y.indexOf(A) !== -1) throw Error('Circular reference detected in ' + k.join('.'))
      ;(y.push(A),
        G.forEach(A, function (N, E) {
          ;(!(G.isUndefined(N) || N === null) && i.call(t, N, G.isString(E) ? E.trim() : E, k, _)) === !0 &&
            C(N, k ? k.concat(E) : [E])
        }),
        y.pop())
    }
  }
  if (!G.isObject(e)) throw new TypeError('data must be an object')
  return (C(e), t)
}
function Nd(e) {
  const t = { '!': '%21', "'": '%27', '(': '%28', ')': '%29', '~': '%7E', '%20': '+', '%00': '\0' }
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (n) {
    return t[n]
  })
}
function _u(e, t) {
  ;((this._pairs = []), e && Rl(e, this, t))
}
const fh = _u.prototype
fh.append = function (t, r) {
  this._pairs.push([t, r])
}
fh.toString = function (t) {
  const r = t
    ? function (n) {
        return t.call(this, n, Nd)
      }
    : Nd
  return this._pairs
    .map(function (i) {
      return r(i[0]) + '=' + r(i[1])
    }, '')
    .join('&')
}
function Mg(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
function hh(e, t, r) {
  if (!t) return e
  const n = (r && r.encode) || Mg
  G.isFunction(r) && (r = { serialize: r })
  const i = r && r.serialize
  let s
  if ((i ? (s = i(t, r)) : (s = G.isURLSearchParams(t) ? t.toString() : new _u(t, r).toString(n)), s)) {
    const a = e.indexOf('#')
    ;(a !== -1 && (e = e.slice(0, a)), (e += (e.indexOf('?') === -1 ? '?' : '&') + s))
  }
  return e
}
class Hd {
  constructor() {
    this.handlers = []
  }
  use(t, r, n) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: r,
        synchronous: n ? n.synchronous : !1,
        runWhen: n ? n.runWhen : null
      }),
      this.handlers.length - 1
    )
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null)
  }
  clear() {
    this.handlers && (this.handlers = [])
  }
  forEach(t) {
    G.forEach(this.handlers, function (n) {
      n !== null && t(n)
    })
  }
}
const ph = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
  Ig = typeof URLSearchParams < 'u' ? URLSearchParams : _u,
  Fg = typeof FormData < 'u' ? FormData : null,
  jg = typeof Blob < 'u' ? Blob : null,
  Ng = {
    isBrowser: !0,
    classes: { URLSearchParams: Ig, FormData: Fg, Blob: jg },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
  },
  wu = typeof window < 'u' && typeof document < 'u',
  zc = (typeof navigator == 'object' && navigator) || void 0,
  Hg = wu && (!zc || ['ReactNative', 'NativeScript', 'NS'].indexOf(zc.product) < 0),
  $g = typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope && typeof self.importScripts == 'function',
  Bg = (wu && window.location.href) || 'http://localhost',
  qg = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: wu,
        hasStandardBrowserEnv: Hg,
        hasStandardBrowserWebWorkerEnv: $g,
        navigator: zc,
        origin: Bg
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  kn = { ...qg, ...Ng }
function Ug(e, t) {
  return Rl(
    e,
    new kn.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (r, n, i, s) {
          return kn.isNode && G.isBuffer(r)
            ? (this.append(n, r.toString('base64')), !1)
            : s.defaultVisitor.apply(this, arguments)
        }
      },
      t
    )
  )
}
function Wg(e) {
  return G.matchAll(/\w+|\[(\w*)]/g, e).map(t => (t[0] === '[]' ? '' : t[1] || t[0]))
}
function Vg(e) {
  const t = {},
    r = Object.keys(e)
  let n
  const i = r.length
  let s
  for (n = 0; n < i; n++) ((s = r[n]), (t[s] = e[s]))
  return t
}
function mh(e) {
  function t(r, n, i, s) {
    let a = r[s++]
    if (a === '__proto__') return !0
    const d = Number.isFinite(+a),
      f = s >= r.length
    return (
      (a = !a && G.isArray(i) ? i.length : a),
      f
        ? (G.hasOwnProp(i, a) ? (i[a] = [i[a], n]) : (i[a] = n), !d)
        : ((!i[a] || !G.isObject(i[a])) && (i[a] = []), t(r, n, i[a], s) && G.isArray(i[a]) && (i[a] = Vg(i[a])), !d)
    )
  }
  if (G.isFormData(e) && G.isFunction(e.entries)) {
    const r = {}
    return (
      G.forEachEntry(e, (n, i) => {
        t(Wg(n), i, r, 0)
      }),
      r
    )
  }
  return null
}
function zg(e, t, r) {
  if (G.isString(e))
    try {
      return ((t || JSON.parse)(e), G.trim(e))
    } catch (n) {
      if (n.name !== 'SyntaxError') throw n
    }
  return (r || JSON.stringify)(e)
}
const aa = {
  transitional: ph,
  adapter: ['xhr', 'http', 'fetch'],
  transformRequest: [
    function (t, r) {
      const n = r.getContentType() || '',
        i = n.indexOf('application/json') > -1,
        s = G.isObject(t)
      if ((s && G.isHTMLForm(t) && (t = new FormData(t)), G.isFormData(t))) return i ? JSON.stringify(mh(t)) : t
      if (G.isArrayBuffer(t) || G.isBuffer(t) || G.isStream(t) || G.isFile(t) || G.isBlob(t) || G.isReadableStream(t))
        return t
      if (G.isArrayBufferView(t)) return t.buffer
      if (G.isURLSearchParams(t))
        return (r.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1), t.toString())
      let d
      if (s) {
        if (n.indexOf('application/x-www-form-urlencoded') > -1) return Ug(t, this.formSerializer).toString()
        if ((d = G.isFileList(t)) || n.indexOf('multipart/form-data') > -1) {
          const f = this.env && this.env.FormData
          return Rl(d ? { 'files[]': t } : t, f && new f(), this.formSerializer)
        }
      }
      return s || i ? (r.setContentType('application/json', !1), zg(t)) : t
    }
  ],
  transformResponse: [
    function (t) {
      const r = this.transitional || aa.transitional,
        n = r && r.forcedJSONParsing,
        i = this.responseType === 'json'
      if (G.isResponse(t) || G.isReadableStream(t)) return t
      if (t && G.isString(t) && ((n && !this.responseType) || i)) {
        const a = !(r && r.silentJSONParsing) && i
        try {
          return JSON.parse(t)
        } catch (d) {
          if (a) throw d.name === 'SyntaxError' ? at.from(d, at.ERR_BAD_RESPONSE, this, null, this.response) : d
        }
      }
      return t
    }
  ],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: kn.classes.FormData, Blob: kn.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300
  },
  headers: { common: { Accept: 'application/json, text/plain, */*', 'Content-Type': void 0 } }
}
G.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], e => {
  aa.headers[e] = {}
})
const Kg = G.toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent'
  ]),
  Xg = e => {
    const t = {}
    let r, n, i
    return (
      e &&
        e
          .split(
            `
`
          )
          .forEach(function (a) {
            ;((i = a.indexOf(':')),
              (r = a.substring(0, i).trim().toLowerCase()),
              (n = a.substring(i + 1).trim()),
              !(!r || (t[r] && Kg[r])) &&
                (r === 'set-cookie' ? (t[r] ? t[r].push(n) : (t[r] = [n])) : (t[r] = t[r] ? t[r] + ', ' + n : n)))
          }),
      t
    )
  },
  $d = Symbol('internals')
function ks(e) {
  return e && String(e).trim().toLowerCase()
}
function el(e) {
  return e === !1 || e == null ? e : G.isArray(e) ? e.map(el) : String(e)
}
function Gg(e) {
  const t = Object.create(null),
    r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g
  let n
  for (; (n = r.exec(e)); ) t[n[1]] = n[2]
  return t
}
const Jg = e => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
function Dc(e, t, r, n, i) {
  if (G.isFunction(n)) return n.call(this, t, r)
  if ((i && (t = r), !!G.isString(t))) {
    if (G.isString(n)) return t.indexOf(n) !== -1
    if (G.isRegExp(n)) return n.test(t)
  }
}
function Yg(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, r, n) => r.toUpperCase() + n)
}
function Qg(e, t) {
  const r = G.toCamelCase(' ' + t)
  ;['get', 'set', 'has'].forEach(n => {
    Object.defineProperty(e, n + r, {
      value: function (i, s, a) {
        return this[n].call(this, t, i, s, a)
      },
      configurable: !0
    })
  })
}
let Qn = class {
  constructor(t) {
    t && this.set(t)
  }
  set(t, r, n) {
    const i = this
    function s(d, f, g) {
      const p = ks(f)
      if (!p) throw new Error('header name must be a non-empty string')
      const y = G.findKey(i, p)
      ;(!y || i[y] === void 0 || g === !0 || (g === void 0 && i[y] !== !1)) && (i[y || f] = el(d))
    }
    const a = (d, f) => G.forEach(d, (g, p) => s(g, p, f))
    if (G.isPlainObject(t) || t instanceof this.constructor) a(t, r)
    else if (G.isString(t) && (t = t.trim()) && !Jg(t)) a(Xg(t), r)
    else if (G.isObject(t) && G.isIterable(t)) {
      let d = {},
        f,
        g
      for (const p of t) {
        if (!G.isArray(p)) throw TypeError('Object iterator must return a key-value pair')
        d[(g = p[0])] = (f = d[g]) ? (G.isArray(f) ? [...f, p[1]] : [f, p[1]]) : p[1]
      }
      a(d, r)
    } else t != null && s(r, t, n)
    return this
  }
  get(t, r) {
    if (((t = ks(t)), t)) {
      const n = G.findKey(this, t)
      if (n) {
        const i = this[n]
        if (!r) return i
        if (r === !0) return Gg(i)
        if (G.isFunction(r)) return r.call(this, i, n)
        if (G.isRegExp(r)) return r.exec(i)
        throw new TypeError('parser must be boolean|regexp|function')
      }
    }
  }
  has(t, r) {
    if (((t = ks(t)), t)) {
      const n = G.findKey(this, t)
      return !!(n && this[n] !== void 0 && (!r || Dc(this, this[n], n, r)))
    }
    return !1
  }
  delete(t, r) {
    const n = this
    let i = !1
    function s(a) {
      if (((a = ks(a)), a)) {
        const d = G.findKey(n, a)
        d && (!r || Dc(n, n[d], d, r)) && (delete n[d], (i = !0))
      }
    }
    return (G.isArray(t) ? t.forEach(s) : s(t), i)
  }
  clear(t) {
    const r = Object.keys(this)
    let n = r.length,
      i = !1
    for (; n--; ) {
      const s = r[n]
      ;(!t || Dc(this, this[s], s, t, !0)) && (delete this[s], (i = !0))
    }
    return i
  }
  normalize(t) {
    const r = this,
      n = {}
    return (
      G.forEach(this, (i, s) => {
        const a = G.findKey(n, s)
        if (a) {
          ;((r[a] = el(i)), delete r[s])
          return
        }
        const d = t ? Yg(s) : String(s).trim()
        ;(d !== s && delete r[s], (r[d] = el(i)), (n[d] = !0))
      }),
      this
    )
  }
  concat(...t) {
    return this.constructor.concat(this, ...t)
  }
  toJSON(t) {
    const r = Object.create(null)
    return (
      G.forEach(this, (n, i) => {
        n != null && n !== !1 && (r[i] = t && G.isArray(n) ? n.join(', ') : n)
      }),
      r
    )
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]()
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, r]) => t + ': ' + r).join(`
`)
  }
  getSetCookie() {
    return this.get('set-cookie') || []
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders'
  }
  static from(t) {
    return t instanceof this ? t : new this(t)
  }
  static concat(t, ...r) {
    const n = new this(t)
    return (r.forEach(i => n.set(i)), n)
  }
  static accessor(t) {
    const n = (this[$d] = this[$d] = { accessors: {} }).accessors,
      i = this.prototype
    function s(a) {
      const d = ks(a)
      n[d] || (Qg(i, a), (n[d] = !0))
    }
    return (G.isArray(t) ? t.forEach(s) : s(t), this)
  }
}
Qn.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization'])
G.reduceDescriptors(Qn.prototype, ({ value: e }, t) => {
  let r = t[0].toUpperCase() + t.slice(1)
  return {
    get: () => e,
    set(n) {
      this[r] = n
    }
  }
})
G.freezeMethods(Qn)
function kc(e, t) {
  const r = this || aa,
    n = t || r,
    i = Qn.from(n.headers)
  let s = n.data
  return (
    G.forEach(e, function (d) {
      s = d.call(r, s, i.normalize(), t ? t.status : void 0)
    }),
    i.normalize(),
    s
  )
}
function vh(e) {
  return !!(e && e.__CANCEL__)
}
function ns(e, t, r) {
  ;(at.call(this, e ?? 'canceled', at.ERR_CANCELED, t, r), (this.name = 'CanceledError'))
}
G.inherits(ns, at, { __CANCEL__: !0 })
function gh(e, t, r) {
  const n = r.config.validateStatus
  !r.status || !n || n(r.status)
    ? e(r)
    : t(
        new at(
          'Request failed with status code ' + r.status,
          [at.ERR_BAD_REQUEST, at.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4],
          r.config,
          r.request,
          r
        )
      )
}
function Zg(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e)
  return (t && t[1]) || ''
}
function eb(e, t) {
  e = e || 10
  const r = new Array(e),
    n = new Array(e)
  let i = 0,
    s = 0,
    a
  return (
    (t = t !== void 0 ? t : 1e3),
    function (f) {
      const g = Date.now(),
        p = n[s]
      ;(a || (a = g), (r[i] = f), (n[i] = g))
      let y = s,
        _ = 0
      for (; y !== i; ) ((_ += r[y++]), (y = y % e))
      if (((i = (i + 1) % e), i === s && (s = (s + 1) % e), g - a < t)) return
      const C = p && g - p
      return C ? Math.round((_ * 1e3) / C) : void 0
    }
  )
}
function tb(e, t) {
  let r = 0,
    n = 1e3 / t,
    i,
    s
  const a = (g, p = Date.now()) => {
    ;((r = p), (i = null), s && (clearTimeout(s), (s = null)), e.apply(null, g))
  }
  return [
    (...g) => {
      const p = Date.now(),
        y = p - r
      y >= n
        ? a(g, p)
        : ((i = g),
          s ||
            (s = setTimeout(() => {
              ;((s = null), a(i))
            }, n - y)))
    },
    () => i && a(i)
  ]
}
const fl = (e, t, r = 3) => {
    let n = 0
    const i = eb(50, 250)
    return tb(s => {
      const a = s.loaded,
        d = s.lengthComputable ? s.total : void 0,
        f = a - n,
        g = i(f),
        p = a <= d
      n = a
      const y = {
        loaded: a,
        total: d,
        progress: d ? a / d : void 0,
        bytes: f,
        rate: g || void 0,
        estimated: g && d && p ? (d - a) / g : void 0,
        event: s,
        lengthComputable: d != null,
        [t ? 'download' : 'upload']: !0
      }
      e(y)
    }, r)
  },
  Bd = (e, t) => {
    const r = e != null
    return [n => t[0]({ lengthComputable: r, total: e, loaded: n }), t[1]]
  },
  qd =
    e =>
    (...t) =>
      G.asap(() => e(...t)),
  nb = kn.hasStandardBrowserEnv
    ? ((e, t) => r => (
        (r = new URL(r, kn.origin)),
        e.protocol === r.protocol && e.host === r.host && (t || e.port === r.port)
      ))(new URL(kn.origin), kn.navigator && /(msie|trident)/i.test(kn.navigator.userAgent))
    : () => !0,
  rb = kn.hasStandardBrowserEnv
    ? {
        write(e, t, r, n, i, s) {
          const a = [e + '=' + encodeURIComponent(t)]
          ;(G.isNumber(r) && a.push('expires=' + new Date(r).toGMTString()),
            G.isString(n) && a.push('path=' + n),
            G.isString(i) && a.push('domain=' + i),
            s === !0 && a.push('secure'),
            (document.cookie = a.join('; ')))
        },
        read(e) {
          const t = document.cookie.match(new RegExp('(^|;\\s*)(' + e + ')=([^;]*)'))
          return t ? decodeURIComponent(t[3]) : null
        },
        remove(e) {
          this.write(e, '', Date.now() - 864e5)
        }
      }
    : {
        write() {},
        read() {
          return null
        },
        remove() {}
      }
function ib(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
}
function ob(e, t) {
  return t ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '') : e
}
function bh(e, t, r) {
  let n = !ib(t)
  return e && (n || r == !1) ? ob(e, t) : t
}
const Ud = e => (e instanceof Qn ? { ...e } : e)
function vo(e, t) {
  t = t || {}
  const r = {}
  function n(g, p, y, _) {
    return G.isPlainObject(g) && G.isPlainObject(p)
      ? G.merge.call({ caseless: _ }, g, p)
      : G.isPlainObject(p)
        ? G.merge({}, p)
        : G.isArray(p)
          ? p.slice()
          : p
  }
  function i(g, p, y, _) {
    if (G.isUndefined(p)) {
      if (!G.isUndefined(g)) return n(void 0, g, y, _)
    } else return n(g, p, y, _)
  }
  function s(g, p) {
    if (!G.isUndefined(p)) return n(void 0, p)
  }
  function a(g, p) {
    if (G.isUndefined(p)) {
      if (!G.isUndefined(g)) return n(void 0, g)
    } else return n(void 0, p)
  }
  function d(g, p, y) {
    if (y in t) return n(g, p)
    if (y in e) return n(void 0, g)
  }
  const f = {
    url: s,
    method: s,
    data: s,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    withXSRFToken: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: d,
    headers: (g, p, y) => i(Ud(g), Ud(p), y, !0)
  }
  return (
    G.forEach(Object.keys(Object.assign({}, e, t)), function (p) {
      const y = f[p] || i,
        _ = y(e[p], t[p], p)
      ;(G.isUndefined(_) && y !== d) || (r[p] = _)
    }),
    r
  )
}
const yh = e => {
    const t = vo({}, e)
    let { data: r, withXSRFToken: n, xsrfHeaderName: i, xsrfCookieName: s, headers: a, auth: d } = t
    ;((t.headers = a = Qn.from(a)),
      (t.url = hh(bh(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer)),
      d &&
        a.set(
          'Authorization',
          'Basic ' + btoa((d.username || '') + ':' + (d.password ? unescape(encodeURIComponent(d.password)) : ''))
        ))
    let f
    if (G.isFormData(r)) {
      if (kn.hasStandardBrowserEnv || kn.hasStandardBrowserWebWorkerEnv) a.setContentType(void 0)
      else if ((f = a.getContentType()) !== !1) {
        const [g, ...p] = f
          ? f
              .split(';')
              .map(y => y.trim())
              .filter(Boolean)
          : []
        a.setContentType([g || 'multipart/form-data', ...p].join('; '))
      }
    }
    if (kn.hasStandardBrowserEnv && (n && G.isFunction(n) && (n = n(t)), n || (n !== !1 && nb(t.url)))) {
      const g = i && s && rb.read(s)
      g && a.set(i, g)
    }
    return t
  },
  sb = typeof XMLHttpRequest < 'u',
  ab =
    sb &&
    function (e) {
      return new Promise(function (r, n) {
        const i = yh(e)
        let s = i.data
        const a = Qn.from(i.headers).normalize()
        let { responseType: d, onUploadProgress: f, onDownloadProgress: g } = i,
          p,
          y,
          _,
          C,
          A
        function k() {
          ;(C && C(),
            A && A(),
            i.cancelToken && i.cancelToken.unsubscribe(p),
            i.signal && i.signal.removeEventListener('abort', p))
        }
        let F = new XMLHttpRequest()
        ;(F.open(i.method.toUpperCase(), i.url, !0), (F.timeout = i.timeout))
        function N() {
          if (!F) return
          const z = Qn.from('getAllResponseHeaders' in F && F.getAllResponseHeaders()),
            ue = {
              data: !d || d === 'text' || d === 'json' ? F.responseText : F.response,
              status: F.status,
              statusText: F.statusText,
              headers: z,
              config: e,
              request: F
            }
          ;(gh(
            function (m) {
              ;(r(m), k())
            },
            function (m) {
              ;(n(m), k())
            },
            ue
          ),
            (F = null))
        }
        ;('onloadend' in F
          ? (F.onloadend = N)
          : (F.onreadystatechange = function () {
              !F ||
                F.readyState !== 4 ||
                (F.status === 0 && !(F.responseURL && F.responseURL.indexOf('file:') === 0)) ||
                setTimeout(N)
            }),
          (F.onabort = function () {
            F && (n(new at('Request aborted', at.ECONNABORTED, e, F)), (F = null))
          }),
          (F.onerror = function () {
            ;(n(new at('Network Error', at.ERR_NETWORK, e, F)), (F = null))
          }),
          (F.ontimeout = function () {
            let Y = i.timeout ? 'timeout of ' + i.timeout + 'ms exceeded' : 'timeout exceeded'
            const ue = i.transitional || ph
            ;(i.timeoutErrorMessage && (Y = i.timeoutErrorMessage),
              n(new at(Y, ue.clarifyTimeoutError ? at.ETIMEDOUT : at.ECONNABORTED, e, F)),
              (F = null))
          }),
          s === void 0 && a.setContentType(null),
          'setRequestHeader' in F &&
            G.forEach(a.toJSON(), function (Y, ue) {
              F.setRequestHeader(ue, Y)
            }),
          G.isUndefined(i.withCredentials) || (F.withCredentials = !!i.withCredentials),
          d && d !== 'json' && (F.responseType = i.responseType),
          g && (([_, A] = fl(g, !0)), F.addEventListener('progress', _)),
          f &&
            F.upload &&
            (([y, C] = fl(f)), F.upload.addEventListener('progress', y), F.upload.addEventListener('loadend', C)),
          (i.cancelToken || i.signal) &&
            ((p = z => {
              F && (n(!z || z.type ? new ns(null, e, F) : z), F.abort(), (F = null))
            }),
            i.cancelToken && i.cancelToken.subscribe(p),
            i.signal && (i.signal.aborted ? p() : i.signal.addEventListener('abort', p))))
        const E = Zg(i.url)
        if (E && kn.protocols.indexOf(E) === -1) {
          n(new at('Unsupported protocol ' + E + ':', at.ERR_BAD_REQUEST, e))
          return
        }
        F.send(s || null)
      })
    },
  lb = (e, t) => {
    const { length: r } = (e = e ? e.filter(Boolean) : [])
    if (t || r) {
      let n = new AbortController(),
        i
      const s = function (g) {
        if (!i) {
          ;((i = !0), d())
          const p = g instanceof Error ? g : this.reason
          n.abort(p instanceof at ? p : new ns(p instanceof Error ? p.message : p))
        }
      }
      let a =
        t &&
        setTimeout(() => {
          ;((a = null), s(new at(`timeout ${t} of ms exceeded`, at.ETIMEDOUT)))
        }, t)
      const d = () => {
        e &&
          (a && clearTimeout(a),
          (a = null),
          e.forEach(g => {
            g.unsubscribe ? g.unsubscribe(s) : g.removeEventListener('abort', s)
          }),
          (e = null))
      }
      e.forEach(g => g.addEventListener('abort', s))
      const { signal: f } = n
      return ((f.unsubscribe = () => G.asap(d)), f)
    }
  },
  cb = function* (e, t) {
    let r = e.byteLength
    if (r < t) {
      yield e
      return
    }
    let n = 0,
      i
    for (; n < r; ) ((i = n + t), yield e.slice(n, i), (n = i))
  },
  ub = async function* (e, t) {
    for await (const r of db(e)) yield* cb(r, t)
  },
  db = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e
      return
    }
    const t = e.getReader()
    try {
      for (;;) {
        const { done: r, value: n } = await t.read()
        if (r) break
        yield n
      }
    } finally {
      await t.cancel()
    }
  },
  Wd = (e, t, r, n) => {
    const i = ub(e, t)
    let s = 0,
      a,
      d = f => {
        a || ((a = !0), n && n(f))
      }
    return new ReadableStream(
      {
        async pull(f) {
          try {
            const { done: g, value: p } = await i.next()
            if (g) {
              ;(d(), f.close())
              return
            }
            let y = p.byteLength
            if (r) {
              let _ = (s += y)
              r(_)
            }
            f.enqueue(new Uint8Array(p))
          } catch (g) {
            throw (d(g), g)
          }
        },
        cancel(f) {
          return (d(f), i.return())
        }
      },
      { highWaterMark: 2 }
    )
  },
  Ll = typeof fetch == 'function' && typeof Request == 'function' && typeof Response == 'function',
  _h = Ll && typeof ReadableStream == 'function',
  fb =
    Ll &&
    (typeof TextEncoder == 'function'
      ? (
          e => t =>
            e.encode(t)
        )(new TextEncoder())
      : async e => new Uint8Array(await new Response(e).arrayBuffer())),
  wh = (e, ...t) => {
    try {
      return !!e(...t)
    } catch {
      return !1
    }
  },
  hb =
    _h &&
    wh(() => {
      let e = !1
      const t = new Request(kn.origin, {
        body: new ReadableStream(),
        method: 'POST',
        get duplex() {
          return ((e = !0), 'half')
        }
      }).headers.has('Content-Type')
      return e && !t
    }),
  Vd = 64 * 1024,
  Kc = _h && wh(() => G.isReadableStream(new Response('').body)),
  hl = { stream: Kc && (e => e.body) }
Ll &&
  (e => {
    ;['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(t => {
      !hl[t] &&
        (hl[t] = G.isFunction(e[t])
          ? r => r[t]()
          : (r, n) => {
              throw new at(`Response type '${t}' is not supported`, at.ERR_NOT_SUPPORT, n)
            })
    })
  })(new Response())
const pb = async e => {
    if (e == null) return 0
    if (G.isBlob(e)) return e.size
    if (G.isSpecCompliantForm(e))
      return (await new Request(kn.origin, { method: 'POST', body: e }).arrayBuffer()).byteLength
    if (G.isArrayBufferView(e) || G.isArrayBuffer(e)) return e.byteLength
    if ((G.isURLSearchParams(e) && (e = e + ''), G.isString(e))) return (await fb(e)).byteLength
  },
  mb = async (e, t) => {
    const r = G.toFiniteNumber(e.getContentLength())
    return r ?? pb(t)
  },
  vb =
    Ll &&
    (async e => {
      let {
        url: t,
        method: r,
        data: n,
        signal: i,
        cancelToken: s,
        timeout: a,
        onDownloadProgress: d,
        onUploadProgress: f,
        responseType: g,
        headers: p,
        withCredentials: y = 'same-origin',
        fetchOptions: _
      } = yh(e)
      g = g ? (g + '').toLowerCase() : 'text'
      let C = lb([i, s && s.toAbortSignal()], a),
        A
      const k =
        C &&
        C.unsubscribe &&
        (() => {
          C.unsubscribe()
        })
      let F
      try {
        if (f && hb && r !== 'get' && r !== 'head' && (F = await mb(p, n)) !== 0) {
          let ue = new Request(t, { method: 'POST', body: n, duplex: 'half' }),
            ke
          if ((G.isFormData(n) && (ke = ue.headers.get('content-type')) && p.setContentType(ke), ue.body)) {
            const [m, rt] = Bd(F, fl(qd(f)))
            n = Wd(ue.body, Vd, m, rt)
          }
        }
        G.isString(y) || (y = y ? 'include' : 'omit')
        const N = 'credentials' in Request.prototype
        A = new Request(t, {
          ..._,
          signal: C,
          method: r.toUpperCase(),
          headers: p.normalize().toJSON(),
          body: n,
          duplex: 'half',
          credentials: N ? y : void 0
        })
        let E = await fetch(A, _)
        const z = Kc && (g === 'stream' || g === 'response')
        if (Kc && (d || (z && k))) {
          const ue = {}
          ;['status', 'statusText', 'headers'].forEach(Ne => {
            ue[Ne] = E[Ne]
          })
          const ke = G.toFiniteNumber(E.headers.get('content-length')),
            [m, rt] = (d && Bd(ke, fl(qd(d), !0))) || []
          E = new Response(
            Wd(E.body, Vd, m, () => {
              ;(rt && rt(), k && k())
            }),
            ue
          )
        }
        g = g || 'text'
        let Y = await hl[G.findKey(hl, g) || 'text'](E, e)
        return (
          !z && k && k(),
          await new Promise((ue, ke) => {
            gh(ue, ke, {
              data: Y,
              headers: Qn.from(E.headers),
              status: E.status,
              statusText: E.statusText,
              config: e,
              request: A
            })
          })
        )
      } catch (N) {
        throw (
          k && k(),
          N && N.name === 'TypeError' && /Load failed|fetch/i.test(N.message)
            ? Object.assign(new at('Network Error', at.ERR_NETWORK, e, A), { cause: N.cause || N })
            : at.from(N, N && N.code, e, A)
        )
      }
    }),
  Xc = { http: Pg, xhr: ab, fetch: vb }
G.forEach(Xc, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, 'name', { value: t })
    } catch {}
    Object.defineProperty(e, 'adapterName', { value: t })
  }
})
const zd = e => `- ${e}`,
  gb = e => G.isFunction(e) || e === null || e === !1,
  xh = {
    getAdapter: e => {
      e = G.isArray(e) ? e : [e]
      const { length: t } = e
      let r, n
      const i = {}
      for (let s = 0; s < t; s++) {
        r = e[s]
        let a
        if (((n = r), !gb(r) && ((n = Xc[(a = String(r)).toLowerCase()]), n === void 0)))
          throw new at(`Unknown adapter '${a}'`)
        if (n) break
        i[a || '#' + s] = n
      }
      if (!n) {
        const s = Object.entries(i).map(
          ([d, f]) =>
            `adapter ${d} ` + (f === !1 ? 'is not supported by the environment' : 'is not available in the build')
        )
        let a = t
          ? s.length > 1
            ? `since :
` +
              s.map(zd).join(`
`)
            : ' ' + zd(s[0])
          : 'as no adapter specified'
        throw new at('There is no suitable adapter to dispatch the request ' + a, 'ERR_NOT_SUPPORT')
      }
      return n
    },
    adapters: Xc
  }
function Ec(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)) throw new ns(null, e)
}
function Kd(e) {
  return (
    Ec(e),
    (e.headers = Qn.from(e.headers)),
    (e.data = kc.call(e, e.transformRequest)),
    ['post', 'put', 'patch'].indexOf(e.method) !== -1 &&
      e.headers.setContentType('application/x-www-form-urlencoded', !1),
    xh
      .getAdapter(e.adapter || aa.adapter)(e)
      .then(
        function (n) {
          return (Ec(e), (n.data = kc.call(e, e.transformResponse, n)), (n.headers = Qn.from(n.headers)), n)
        },
        function (n) {
          return (
            vh(n) ||
              (Ec(e),
              n &&
                n.response &&
                ((n.response.data = kc.call(e, e.transformResponse, n.response)),
                (n.response.headers = Qn.from(n.response.headers)))),
            Promise.reject(n)
          )
        }
      )
  )
}
const Sh = '1.10.0',
  Ml = {}
;['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((e, t) => {
  Ml[e] = function (n) {
    return typeof n === e || 'a' + (t < 1 ? 'n ' : ' ') + e
  }
})
const Xd = {}
Ml.transitional = function (t, r, n) {
  function i(s, a) {
    return '[Axios v' + Sh + "] Transitional option '" + s + "'" + a + (n ? '. ' + n : '')
  }
  return (s, a, d) => {
    if (t === !1) throw new at(i(a, ' has been removed' + (r ? ' in ' + r : '')), at.ERR_DEPRECATED)
    return (
      r &&
        !Xd[a] &&
        ((Xd[a] = !0),
        console.warn(i(a, ' has been deprecated since v' + r + ' and will be removed in the near future'))),
      t ? t(s, a, d) : !0
    )
  }
}
Ml.spelling = function (t) {
  return (r, n) => (console.warn(`${n} is likely a misspelling of ${t}`), !0)
}
function bb(e, t, r) {
  if (typeof e != 'object') throw new at('options must be an object', at.ERR_BAD_OPTION_VALUE)
  const n = Object.keys(e)
  let i = n.length
  for (; i-- > 0; ) {
    const s = n[i],
      a = t[s]
    if (a) {
      const d = e[s],
        f = d === void 0 || a(d, s, e)
      if (f !== !0) throw new at('option ' + s + ' must be ' + f, at.ERR_BAD_OPTION_VALUE)
      continue
    }
    if (r !== !0) throw new at('Unknown option ' + s, at.ERR_BAD_OPTION)
  }
}
const tl = { assertOptions: bb, validators: Ml },
  Fr = tl.validators
let po = class {
  constructor(t) {
    ;((this.defaults = t || {}), (this.interceptors = { request: new Hd(), response: new Hd() }))
  }
  async request(t, r) {
    try {
      return await this._request(t, r)
    } catch (n) {
      if (n instanceof Error) {
        let i = {}
        Error.captureStackTrace ? Error.captureStackTrace(i) : (i = new Error())
        const s = i.stack ? i.stack.replace(/^.+\n/, '') : ''
        try {
          n.stack
            ? s &&
              !String(n.stack).endsWith(s.replace(/^.+\n.+\n/, '')) &&
              (n.stack +=
                `
` + s)
            : (n.stack = s)
        } catch {}
      }
      throw n
    }
  }
  _request(t, r) {
    ;(typeof t == 'string' ? ((r = r || {}), (r.url = t)) : (r = t || {}), (r = vo(this.defaults, r)))
    const { transitional: n, paramsSerializer: i, headers: s } = r
    ;(n !== void 0 &&
      tl.assertOptions(
        n,
        {
          silentJSONParsing: Fr.transitional(Fr.boolean),
          forcedJSONParsing: Fr.transitional(Fr.boolean),
          clarifyTimeoutError: Fr.transitional(Fr.boolean)
        },
        !1
      ),
      i != null &&
        (G.isFunction(i)
          ? (r.paramsSerializer = { serialize: i })
          : tl.assertOptions(i, { encode: Fr.function, serialize: Fr.function }, !0)),
      r.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (r.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (r.allowAbsoluteUrls = !0)),
      tl.assertOptions(r, { baseUrl: Fr.spelling('baseURL'), withXsrfToken: Fr.spelling('withXSRFToken') }, !0),
      (r.method = (r.method || this.defaults.method || 'get').toLowerCase()))
    let a = s && G.merge(s.common, s[r.method])
    ;(s &&
      G.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], A => {
        delete s[A]
      }),
      (r.headers = Qn.concat(a, s)))
    const d = []
    let f = !0
    this.interceptors.request.forEach(function (k) {
      ;(typeof k.runWhen == 'function' && k.runWhen(r) === !1) ||
        ((f = f && k.synchronous), d.unshift(k.fulfilled, k.rejected))
    })
    const g = []
    this.interceptors.response.forEach(function (k) {
      g.push(k.fulfilled, k.rejected)
    })
    let p,
      y = 0,
      _
    if (!f) {
      const A = [Kd.bind(this), void 0]
      for (A.unshift.apply(A, d), A.push.apply(A, g), _ = A.length, p = Promise.resolve(r); y < _; )
        p = p.then(A[y++], A[y++])
      return p
    }
    _ = d.length
    let C = r
    for (y = 0; y < _; ) {
      const A = d[y++],
        k = d[y++]
      try {
        C = A(C)
      } catch (F) {
        k.call(this, F)
        break
      }
    }
    try {
      p = Kd.call(this, C)
    } catch (A) {
      return Promise.reject(A)
    }
    for (y = 0, _ = g.length; y < _; ) p = p.then(g[y++], g[y++])
    return p
  }
  getUri(t) {
    t = vo(this.defaults, t)
    const r = bh(t.baseURL, t.url, t.allowAbsoluteUrls)
    return hh(r, t.params, t.paramsSerializer)
  }
}
G.forEach(['delete', 'get', 'head', 'options'], function (t) {
  po.prototype[t] = function (r, n) {
    return this.request(vo(n || {}, { method: t, url: r, data: (n || {}).data }))
  }
})
G.forEach(['post', 'put', 'patch'], function (t) {
  function r(n) {
    return function (s, a, d) {
      return this.request(
        vo(d || {}, { method: t, headers: n ? { 'Content-Type': 'multipart/form-data' } : {}, url: s, data: a })
      )
    }
  }
  ;((po.prototype[t] = r()), (po.prototype[t + 'Form'] = r(!0)))
})
let yb = class Ch {
  constructor(t) {
    if (typeof t != 'function') throw new TypeError('executor must be a function.')
    let r
    this.promise = new Promise(function (s) {
      r = s
    })
    const n = this
    ;(this.promise.then(i => {
      if (!n._listeners) return
      let s = n._listeners.length
      for (; s-- > 0; ) n._listeners[s](i)
      n._listeners = null
    }),
      (this.promise.then = i => {
        let s
        const a = new Promise(d => {
          ;(n.subscribe(d), (s = d))
        }).then(i)
        return (
          (a.cancel = function () {
            n.unsubscribe(s)
          }),
          a
        )
      }),
      t(function (s, a, d) {
        n.reason || ((n.reason = new ns(s, a, d)), r(n.reason))
      }))
  }
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason)
      return
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t])
  }
  unsubscribe(t) {
    if (!this._listeners) return
    const r = this._listeners.indexOf(t)
    r !== -1 && this._listeners.splice(r, 1)
  }
  toAbortSignal() {
    const t = new AbortController(),
      r = n => {
        t.abort(n)
      }
    return (this.subscribe(r), (t.signal.unsubscribe = () => this.unsubscribe(r)), t.signal)
  }
  static source() {
    let t
    return {
      token: new Ch(function (i) {
        t = i
      }),
      cancel: t
    }
  }
}
function _b(e) {
  return function (r) {
    return e.apply(null, r)
  }
}
function wb(e) {
  return G.isObject(e) && e.isAxiosError === !0
}
const Gc = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
}
Object.entries(Gc).forEach(([e, t]) => {
  Gc[t] = e
})
function Th(e) {
  const t = new po(e),
    r = th(po.prototype.request, t)
  return (
    G.extend(r, po.prototype, t, { allOwnKeys: !0 }),
    G.extend(r, t, null, { allOwnKeys: !0 }),
    (r.create = function (i) {
      return Th(vo(e, i))
    }),
    r
  )
}
const Fe = Th(aa)
Fe.Axios = po
Fe.CanceledError = ns
Fe.CancelToken = yb
Fe.isCancel = vh
Fe.VERSION = Sh
Fe.toFormData = Rl
Fe.AxiosError = at
Fe.Cancel = Fe.CanceledError
Fe.all = function (t) {
  return Promise.all(t)
}
Fe.spread = _b
Fe.isAxiosError = wb
Fe.mergeConfig = vo
Fe.AxiosHeaders = Qn
Fe.formToJSON = e => mh(G.isHTMLForm(e) ? new FormData(e) : e)
Fe.getAdapter = xh.getAdapter
Fe.HttpStatusCode = Gc
Fe.default = Fe
const {
  Axios: nE,
  AxiosError: rE,
  CanceledError: iE,
  isCancel: oE,
  CancelToken: sE,
  VERSION: aE,
  all: lE,
  Cancel: cE,
  isAxiosError: uE,
  spread: dE,
  toFormData: fE,
  AxiosHeaders: hE,
  HttpStatusCode: pE,
  formToJSON: mE,
  getAdapter: vE,
  mergeConfig: gE
} = Fe
window.axios = Fe
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
function xb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e
}
var nl = { exports: {} }
/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */ var Sb = nl.exports,
  Gd
function Cb() {
  return (
    Gd ||
      ((Gd = 1),
      (function (e) {
        ;(function (t, r) {
          e.exports = t.document
            ? r(t, !0)
            : function (n) {
                if (!n.document) throw new Error('jQuery requires a window with a document')
                return r(n)
              }
        })(typeof window < 'u' ? window : Sb, function (t, r) {
          var n = [],
            i = Object.getPrototypeOf,
            s = n.slice,
            a = n.flat
              ? function (o) {
                  return n.flat.call(o)
                }
              : function (o) {
                  return n.concat.apply([], o)
                },
            d = n.push,
            f = n.indexOf,
            g = {},
            p = g.toString,
            y = g.hasOwnProperty,
            _ = y.toString,
            C = _.call(Object),
            A = {},
            k = function (c) {
              return typeof c == 'function' && typeof c.nodeType != 'number' && typeof c.item != 'function'
            },
            F = function (c) {
              return c != null && c === c.window
            },
            N = t.document,
            E = { type: !0, src: !0, nonce: !0, noModule: !0 }
          function z(o, c, h) {
            h = h || N
            var v,
              w,
              x = h.createElement('script')
            if (((x.text = o), c))
              for (v in E) ((w = c[v] || (c.getAttribute && c.getAttribute(v))), w && x.setAttribute(v, w))
            h.head.appendChild(x).parentNode.removeChild(x)
          }
          function Y(o) {
            return o == null
              ? o + ''
              : typeof o == 'object' || typeof o == 'function'
                ? g[p.call(o)] || 'object'
                : typeof o
          }
          var ue = '3.7.1',
            ke = /HTML$/i,
            m = function (o, c) {
              return new m.fn.init(o, c)
            }
          ;((m.fn = m.prototype =
            {
              jquery: ue,
              constructor: m,
              length: 0,
              toArray: function () {
                return s.call(this)
              },
              get: function (o) {
                return o == null ? s.call(this) : o < 0 ? this[o + this.length] : this[o]
              },
              pushStack: function (o) {
                var c = m.merge(this.constructor(), o)
                return ((c.prevObject = this), c)
              },
              each: function (o) {
                return m.each(this, o)
              },
              map: function (o) {
                return this.pushStack(
                  m.map(this, function (c, h) {
                    return o.call(c, h, c)
                  })
                )
              },
              slice: function () {
                return this.pushStack(s.apply(this, arguments))
              },
              first: function () {
                return this.eq(0)
              },
              last: function () {
                return this.eq(-1)
              },
              even: function () {
                return this.pushStack(
                  m.grep(this, function (o, c) {
                    return (c + 1) % 2
                  })
                )
              },
              odd: function () {
                return this.pushStack(
                  m.grep(this, function (o, c) {
                    return c % 2
                  })
                )
              },
              eq: function (o) {
                var c = this.length,
                  h = +o + (o < 0 ? c : 0)
                return this.pushStack(h >= 0 && h < c ? [this[h]] : [])
              },
              end: function () {
                return this.prevObject || this.constructor()
              },
              push: d,
              sort: n.sort,
              splice: n.splice
            }),
            (m.extend = m.fn.extend =
              function () {
                var o,
                  c,
                  h,
                  v,
                  w,
                  x,
                  T = arguments[0] || {},
                  I = 1,
                  L = arguments.length,
                  H = !1
                for (
                  typeof T == 'boolean' && ((H = T), (T = arguments[I] || {}), I++),
                    typeof T != 'object' && !k(T) && (T = {}),
                    I === L && ((T = this), I--);
                  I < L;
                  I++
                )
                  if ((o = arguments[I]) != null)
                    for (c in o)
                      ((v = o[c]),
                        !(c === '__proto__' || T === v) &&
                          (H && v && (m.isPlainObject(v) || (w = Array.isArray(v)))
                            ? ((h = T[c]),
                              w && !Array.isArray(h) ? (x = []) : !w && !m.isPlainObject(h) ? (x = {}) : (x = h),
                              (w = !1),
                              (T[c] = m.extend(H, x, v)))
                            : v !== void 0 && (T[c] = v)))
                return T
              }),
            m.extend({
              expando: 'jQuery' + (ue + Math.random()).replace(/\D/g, ''),
              isReady: !0,
              error: function (o) {
                throw new Error(o)
              },
              noop: function () {},
              isPlainObject: function (o) {
                var c, h
                return !o || p.call(o) !== '[object Object]'
                  ? !1
                  : ((c = i(o)),
                    c
                      ? ((h = y.call(c, 'constructor') && c.constructor), typeof h == 'function' && _.call(h) === C)
                      : !0)
              },
              isEmptyObject: function (o) {
                var c
                for (c in o) return !1
                return !0
              },
              globalEval: function (o, c, h) {
                z(o, { nonce: c && c.nonce }, h)
              },
              each: function (o, c) {
                var h,
                  v = 0
                if (rt(o)) for (h = o.length; v < h && c.call(o[v], v, o[v]) !== !1; v++);
                else for (v in o) if (c.call(o[v], v, o[v]) === !1) break
                return o
              },
              text: function (o) {
                var c,
                  h = '',
                  v = 0,
                  w = o.nodeType
                if (!w) for (; (c = o[v++]); ) h += m.text(c)
                return w === 1 || w === 11
                  ? o.textContent
                  : w === 9
                    ? o.documentElement.textContent
                    : w === 3 || w === 4
                      ? o.nodeValue
                      : h
              },
              makeArray: function (o, c) {
                var h = c || []
                return (o != null && (rt(Object(o)) ? m.merge(h, typeof o == 'string' ? [o] : o) : d.call(h, o)), h)
              },
              inArray: function (o, c, h) {
                return c == null ? -1 : f.call(c, o, h)
              },
              isXMLDoc: function (o) {
                var c = o && o.namespaceURI,
                  h = o && (o.ownerDocument || o).documentElement
                return !ke.test(c || (h && h.nodeName) || 'HTML')
              },
              merge: function (o, c) {
                for (var h = +c.length, v = 0, w = o.length; v < h; v++) o[w++] = c[v]
                return ((o.length = w), o)
              },
              grep: function (o, c, h) {
                for (var v, w = [], x = 0, T = o.length, I = !h; x < T; x++)
                  ((v = !c(o[x], x)), v !== I && w.push(o[x]))
                return w
              },
              map: function (o, c, h) {
                var v,
                  w,
                  x = 0,
                  T = []
                if (rt(o)) for (v = o.length; x < v; x++) ((w = c(o[x], x, h)), w != null && T.push(w))
                else for (x in o) ((w = c(o[x], x, h)), w != null && T.push(w))
                return a(T)
              },
              guid: 1,
              support: A
            }),
            typeof Symbol == 'function' && (m.fn[Symbol.iterator] = n[Symbol.iterator]),
            m.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '), function (o, c) {
              g['[object ' + c + ']'] = c.toLowerCase()
            }))
          function rt(o) {
            var c = !!o && 'length' in o && o.length,
              h = Y(o)
            return k(o) || F(o) ? !1 : h === 'array' || c === 0 || (typeof c == 'number' && c > 0 && c - 1 in o)
          }
          function Ne(o, c) {
            return o.nodeName && o.nodeName.toLowerCase() === c.toLowerCase()
          }
          var fe = n.pop,
            He = n.sort,
            it = n.splice,
            Pe = '[\\x20\\t\\r\\n\\f]',
            re = new RegExp('^' + Pe + '+|((?:^|[^\\\\])(?:\\\\.)*)' + Pe + '+$', 'g')
          m.contains = function (o, c) {
            var h = c && c.parentNode
            return (
              o === h ||
              !!(
                h &&
                h.nodeType === 1 &&
                (o.contains ? o.contains(h) : o.compareDocumentPosition && o.compareDocumentPosition(h) & 16)
              )
            )
          }
          var Ee = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g
          function Me(o, c) {
            return c
              ? o === '\0'
                ? '�'
                : o.slice(0, -1) + '\\' + o.charCodeAt(o.length - 1).toString(16) + ' '
              : '\\' + o
          }
          m.escapeSelector = function (o) {
            return (o + '').replace(Ee, Me)
          }
          var Be = N,
            We = d
          ;(function () {
            var o,
              c,
              h,
              v,
              w,
              x = We,
              T,
              I,
              L,
              H,
              X,
              Z = m.expando,
              W = 0,
              ce = 0,
              Ze = Eo(),
              bt = Eo(),
              et = Eo(),
              un = Eo(),
              Ht = function (O, j) {
                return (O === j && (w = !0), 0)
              },
              Kn =
                'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
              cr = '(?:\\\\[\\da-fA-F]{1,6}' + Pe + '?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+',
              pt =
                '\\[' +
                Pe +
                '*(' +
                cr +
                ')(?:' +
                Pe +
                '*([*^$|!~]?=)' +
                Pe +
                `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` +
                cr +
                '))|)' +
                Pe +
                '*\\]',
              Zr =
                ':(' +
                cr +
                `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` +
                pt +
                ')*)|.*)\\)|)',
              _t = new RegExp(Pe + '+', 'g'),
              Jt = new RegExp('^' + Pe + '*,' + Pe + '*'),
              Zi = new RegExp('^' + Pe + '*([>+~]|' + Pe + ')' + Pe + '*'),
              ko = new RegExp(Pe + '|>'),
              tr = new RegExp(Zr),
              eo = new RegExp('^' + cr + '$'),
              xn = {
                ID: new RegExp('^#(' + cr + ')'),
                CLASS: new RegExp('^\\.(' + cr + ')'),
                TAG: new RegExp('^(' + cr + '|[*])'),
                ATTR: new RegExp('^' + pt),
                PSEUDO: new RegExp('^' + Zr),
                CHILD: new RegExp(
                  '^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
                    Pe +
                    '*(even|odd|(([+-]|)(\\d*)n|)' +
                    Pe +
                    '*(?:([+-]|)' +
                    Pe +
                    '*(\\d+)|))' +
                    Pe +
                    '*\\)|)',
                  'i'
                ),
                bool: new RegExp('^(?:' + Kn + ')$', 'i'),
                needsContext: new RegExp(
                  '^' +
                    Pe +
                    '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' +
                    Pe +
                    '*((?:-\\d)?\\d*)' +
                    Pe +
                    '*\\)|)(?=[^-]|$)',
                  'i'
                )
              },
              An = /^(?:input|select|textarea|button)$/i,
              Rr = /^h\d$/i,
              Sn = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
              Ts = /[+~]/,
              _r = new RegExp('\\\\[\\da-fA-F]{1,6}' + Pe + '?|\\\\([^\\r\\n\\f])', 'g'),
              wr = function (O, j) {
                var U = '0x' + O.slice(1) - 65536
                return (
                  j ||
                  (U < 0 ? String.fromCharCode(U + 65536) : String.fromCharCode((U >> 10) | 55296, (U & 1023) | 56320))
                )
              },
              hc = function () {
                nr()
              },
              pc = Po(
                function (O) {
                  return O.disabled === !0 && Ne(O, 'fieldset')
                },
                { dir: 'parentNode', next: 'legend' }
              )
            function mc() {
              try {
                return T.activeElement
              } catch {}
            }
            try {
              ;(x.apply((n = s.call(Be.childNodes)), Be.childNodes), n[Be.childNodes.length].nodeType)
            } catch {
              x = {
                apply: function (j, U) {
                  We.apply(j, s.call(U))
                },
                call: function (j) {
                  We.apply(j, s.call(arguments, 1))
                }
              }
            }
            function Dt(O, j, U, V) {
              var ee,
                be,
                Te,
                je,
                Ae,
                mt,
                Xe,
                tt = j && j.ownerDocument,
                ct = j ? j.nodeType : 9
              if (((U = U || []), typeof O != 'string' || !O || (ct !== 1 && ct !== 9 && ct !== 11))) return U
              if (!V && (nr(j), (j = j || T), L)) {
                if (ct !== 11 && (Ae = Sn.exec(O)))
                  if ((ee = Ae[1])) {
                    if (ct === 9)
                      if ((Te = j.getElementById(ee))) {
                        if (Te.id === ee) return (x.call(U, Te), U)
                      } else return U
                    else if (tt && (Te = tt.getElementById(ee)) && Dt.contains(j, Te) && Te.id === ee)
                      return (x.call(U, Te), U)
                  } else {
                    if (Ae[2]) return (x.apply(U, j.getElementsByTagName(O)), U)
                    if ((ee = Ae[3]) && j.getElementsByClassName) return (x.apply(U, j.getElementsByClassName(ee)), U)
                  }
                if (!un[O + ' '] && (!H || !H.test(O))) {
                  if (((Xe = O), (tt = j), ct === 1 && (ko.test(O) || Zi.test(O)))) {
                    for (
                      tt = (Ts.test(O) && Oo(j.parentNode)) || j,
                        (tt != j || !A.scope) &&
                          ((je = j.getAttribute('id')) ? (je = m.escapeSelector(je)) : j.setAttribute('id', (je = Z))),
                        mt = to(O),
                        be = mt.length;
                      be--;

                    )
                      mt[be] = (je ? '#' + je : ':scope') + ' ' + no(mt[be])
                    Xe = mt.join(',')
                  }
                  try {
                    return (x.apply(U, tt.querySelectorAll(Xe)), U)
                  } catch {
                    un(O, !0)
                  } finally {
                    je === Z && j.removeAttribute('id')
                  }
                }
              }
              return In(O.replace(re, '$1'), j, U, V)
            }
            function Eo() {
              var O = []
              function j(U, V) {
                return (O.push(U + ' ') > c.cacheLength && delete j[O.shift()], (j[U + ' '] = V))
              }
              return j
            }
            function zt(O) {
              return ((O[Z] = !0), O)
            }
            function ei(O) {
              var j = T.createElement('fieldset')
              try {
                return !!O(j)
              } catch {
                return !1
              } finally {
                ;(j.parentNode && j.parentNode.removeChild(j), (j = null))
              }
            }
            function ja(O) {
              return function (j) {
                return Ne(j, 'input') && j.type === O
              }
            }
            function Na(O) {
              return function (j) {
                return (Ne(j, 'input') || Ne(j, 'button')) && j.type === O
              }
            }
            function Ha(O) {
              return function (j) {
                return 'form' in j
                  ? j.parentNode && j.disabled === !1
                    ? 'label' in j
                      ? 'label' in j.parentNode
                        ? j.parentNode.disabled === O
                        : j.disabled === O
                      : j.isDisabled === O || (j.isDisabled !== !O && pc(j) === O)
                    : j.disabled === O
                  : 'label' in j
                    ? j.disabled === O
                    : !1
              }
            }
            function ti(O) {
              return zt(function (j) {
                return (
                  (j = +j),
                  zt(function (U, V) {
                    for (var ee, be = O([], U.length, j), Te = be.length; Te--; )
                      U[(ee = be[Te])] && (U[ee] = !(V[ee] = U[ee]))
                  })
                )
              })
            }
            function Oo(O) {
              return O && typeof O.getElementsByTagName < 'u' && O
            }
            function nr(O) {
              var j,
                U = O ? O.ownerDocument || O : Be
              return (
                U == T ||
                  U.nodeType !== 9 ||
                  !U.documentElement ||
                  ((T = U),
                  (I = T.documentElement),
                  (L = !m.isXMLDoc(T)),
                  (X = I.matches || I.webkitMatchesSelector || I.msMatchesSelector),
                  I.msMatchesSelector &&
                    Be != T &&
                    (j = T.defaultView) &&
                    j.top !== j &&
                    j.addEventListener('unload', hc),
                  (A.getById = ei(function (V) {
                    return (
                      (I.appendChild(V).id = m.expando),
                      !T.getElementsByName || !T.getElementsByName(m.expando).length
                    )
                  })),
                  (A.disconnectedMatch = ei(function (V) {
                    return X.call(V, '*')
                  })),
                  (A.scope = ei(function () {
                    return T.querySelectorAll(':scope')
                  })),
                  (A.cssHas = ei(function () {
                    try {
                      return (T.querySelector(':has(*,:jqfake)'), !1)
                    } catch {
                      return !0
                    }
                  })),
                  A.getById
                    ? ((c.filter.ID = function (V) {
                        var ee = V.replace(_r, wr)
                        return function (be) {
                          return be.getAttribute('id') === ee
                        }
                      }),
                      (c.find.ID = function (V, ee) {
                        if (typeof ee.getElementById < 'u' && L) {
                          var be = ee.getElementById(V)
                          return be ? [be] : []
                        }
                      }))
                    : ((c.filter.ID = function (V) {
                        var ee = V.replace(_r, wr)
                        return function (be) {
                          var Te = typeof be.getAttributeNode < 'u' && be.getAttributeNode('id')
                          return Te && Te.value === ee
                        }
                      }),
                      (c.find.ID = function (V, ee) {
                        if (typeof ee.getElementById < 'u' && L) {
                          var be,
                            Te,
                            je,
                            Ae = ee.getElementById(V)
                          if (Ae) {
                            if (((be = Ae.getAttributeNode('id')), be && be.value === V)) return [Ae]
                            for (je = ee.getElementsByName(V), Te = 0; (Ae = je[Te++]); )
                              if (((be = Ae.getAttributeNode('id')), be && be.value === V)) return [Ae]
                          }
                          return []
                        }
                      })),
                  (c.find.TAG = function (V, ee) {
                    return typeof ee.getElementsByTagName < 'u' ? ee.getElementsByTagName(V) : ee.querySelectorAll(V)
                  }),
                  (c.find.CLASS = function (V, ee) {
                    if (typeof ee.getElementsByClassName < 'u' && L) return ee.getElementsByClassName(V)
                  }),
                  (H = []),
                  ei(function (V) {
                    var ee
                    ;((I.appendChild(V).innerHTML =
                      "<a id='" +
                      Z +
                      "' href='' disabled='disabled'></a><select id='" +
                      Z +
                      "-\r\\' disabled='disabled'><option selected=''></option></select>"),
                      V.querySelectorAll('[selected]').length || H.push('\\[' + Pe + '*(?:value|' + Kn + ')'),
                      V.querySelectorAll('[id~=' + Z + '-]').length || H.push('~='),
                      V.querySelectorAll('a#' + Z + '+*').length || H.push('.#.+[+~]'),
                      V.querySelectorAll(':checked').length || H.push(':checked'),
                      (ee = T.createElement('input')),
                      ee.setAttribute('type', 'hidden'),
                      V.appendChild(ee).setAttribute('name', 'D'),
                      (I.appendChild(V).disabled = !0),
                      V.querySelectorAll(':disabled').length !== 2 && H.push(':enabled', ':disabled'),
                      (ee = T.createElement('input')),
                      ee.setAttribute('name', ''),
                      V.appendChild(ee),
                      V.querySelectorAll("[name='']").length ||
                        H.push('\\[' + Pe + '*name' + Pe + '*=' + Pe + `*(?:''|"")`))
                  }),
                  A.cssHas || H.push(':has'),
                  (H = H.length && new RegExp(H.join('|'))),
                  (Ht = function (V, ee) {
                    if (V === ee) return ((w = !0), 0)
                    var be = !V.compareDocumentPosition - !ee.compareDocumentPosition
                    return (
                      be ||
                      ((be = (V.ownerDocument || V) == (ee.ownerDocument || ee) ? V.compareDocumentPosition(ee) : 1),
                      be & 1 || (!A.sortDetached && ee.compareDocumentPosition(V) === be)
                        ? V === T || (V.ownerDocument == Be && Dt.contains(Be, V))
                          ? -1
                          : ee === T || (ee.ownerDocument == Be && Dt.contains(Be, ee))
                            ? 1
                            : v
                              ? f.call(v, V) - f.call(v, ee)
                              : 0
                        : be & 4
                          ? -1
                          : 1)
                    )
                  })),
                T
              )
            }
            ;((Dt.matches = function (O, j) {
              return Dt(O, null, null, j)
            }),
              (Dt.matchesSelector = function (O, j) {
                if ((nr(O), L && !un[j + ' '] && (!H || !H.test(j))))
                  try {
                    var U = X.call(O, j)
                    if (U || A.disconnectedMatch || (O.document && O.document.nodeType !== 11)) return U
                  } catch {
                    un(j, !0)
                  }
                return Dt(j, T, null, [O]).length > 0
              }),
              (Dt.contains = function (O, j) {
                return ((O.ownerDocument || O) != T && nr(O), m.contains(O, j))
              }),
              (Dt.attr = function (O, j) {
                ;(O.ownerDocument || O) != T && nr(O)
                var U = c.attrHandle[j.toLowerCase()],
                  V = U && y.call(c.attrHandle, j.toLowerCase()) ? U(O, j, !L) : void 0
                return V !== void 0 ? V : O.getAttribute(j)
              }),
              (Dt.error = function (O) {
                throw new Error('Syntax error, unrecognized expression: ' + O)
              }),
              (m.uniqueSort = function (O) {
                var j,
                  U = [],
                  V = 0,
                  ee = 0
                if (((w = !A.sortStable), (v = !A.sortStable && s.call(O, 0)), He.call(O, Ht), w)) {
                  for (; (j = O[ee++]); ) j === O[ee] && (V = U.push(ee))
                  for (; V--; ) it.call(O, U[V], 1)
                }
                return ((v = null), O)
              }),
              (m.fn.uniqueSort = function () {
                return this.pushStack(m.uniqueSort(s.apply(this)))
              }),
              (c = m.expr =
                {
                  cacheLength: 50,
                  createPseudo: zt,
                  match: xn,
                  attrHandle: {},
                  find: {},
                  relative: {
                    '>': { dir: 'parentNode', first: !0 },
                    ' ': { dir: 'parentNode' },
                    '+': { dir: 'previousSibling', first: !0 },
                    '~': { dir: 'previousSibling' }
                  },
                  preFilter: {
                    ATTR: function (O) {
                      return (
                        (O[1] = O[1].replace(_r, wr)),
                        (O[3] = (O[3] || O[4] || O[5] || '').replace(_r, wr)),
                        O[2] === '~=' && (O[3] = ' ' + O[3] + ' '),
                        O.slice(0, 4)
                      )
                    },
                    CHILD: function (O) {
                      return (
                        (O[1] = O[1].toLowerCase()),
                        O[1].slice(0, 3) === 'nth'
                          ? (O[3] || Dt.error(O[0]),
                            (O[4] = +(O[4] ? O[5] + (O[6] || 1) : 2 * (O[3] === 'even' || O[3] === 'odd'))),
                            (O[5] = +(O[7] + O[8] || O[3] === 'odd')))
                          : O[3] && Dt.error(O[0]),
                        O
                      )
                    },
                    PSEUDO: function (O) {
                      var j,
                        U = !O[6] && O[2]
                      return xn.CHILD.test(O[0])
                        ? null
                        : (O[3]
                            ? (O[2] = O[4] || O[5] || '')
                            : U &&
                              tr.test(U) &&
                              (j = to(U, !0)) &&
                              (j = U.indexOf(')', U.length - j) - U.length) &&
                              ((O[0] = O[0].slice(0, j)), (O[2] = U.slice(0, j))),
                          O.slice(0, 3))
                    }
                  },
                  filter: {
                    TAG: function (O) {
                      var j = O.replace(_r, wr).toLowerCase()
                      return O === '*'
                        ? function () {
                            return !0
                          }
                        : function (U) {
                            return Ne(U, j)
                          }
                    },
                    CLASS: function (O) {
                      var j = Ze[O + ' ']
                      return (
                        j ||
                        ((j = new RegExp('(^|' + Pe + ')' + O + '(' + Pe + '|$)')) &&
                          Ze(O, function (U) {
                            return j.test(
                              (typeof U.className == 'string' && U.className) ||
                                (typeof U.getAttribute < 'u' && U.getAttribute('class')) ||
                                ''
                            )
                          }))
                      )
                    },
                    ATTR: function (O, j, U) {
                      return function (V) {
                        var ee = Dt.attr(V, O)
                        return ee == null
                          ? j === '!='
                          : j
                            ? ((ee += ''),
                              j === '='
                                ? ee === U
                                : j === '!='
                                  ? ee !== U
                                  : j === '^='
                                    ? U && ee.indexOf(U) === 0
                                    : j === '*='
                                      ? U && ee.indexOf(U) > -1
                                      : j === '$='
                                        ? U && ee.slice(-U.length) === U
                                        : j === '~='
                                          ? (' ' + ee.replace(_t, ' ') + ' ').indexOf(U) > -1
                                          : j === '|='
                                            ? ee === U || ee.slice(0, U.length + 1) === U + '-'
                                            : !1)
                            : !0
                      }
                    },
                    CHILD: function (O, j, U, V, ee) {
                      var be = O.slice(0, 3) !== 'nth',
                        Te = O.slice(-4) !== 'last',
                        je = j === 'of-type'
                      return V === 1 && ee === 0
                        ? function (Ae) {
                            return !!Ae.parentNode
                          }
                        : function (Ae, mt, Xe) {
                            var tt,
                              ct,
                              ze,
                              Ft,
                              Qt,
                              qt = be !== Te ? 'nextSibling' : 'previousSibling',
                              Fn = Ae.parentNode,
                              ur = je && Ae.nodeName.toLowerCase(),
                              ni = !Xe && !je,
                              mn = !1
                            if (Fn) {
                              if (be) {
                                for (; qt; ) {
                                  for (ze = Ae; (ze = ze[qt]); ) if (je ? Ne(ze, ur) : ze.nodeType === 1) return !1
                                  Qt = qt = O === 'only' && !Qt && 'nextSibling'
                                }
                                return !0
                              }
                              if (((Qt = [Te ? Fn.firstChild : Fn.lastChild]), Te && ni)) {
                                for (
                                  ct = Fn[Z] || (Fn[Z] = {}),
                                    tt = ct[O] || [],
                                    Ft = tt[0] === W && tt[1],
                                    mn = Ft && tt[2],
                                    ze = Ft && Fn.childNodes[Ft];
                                  (ze = (++Ft && ze && ze[qt]) || (mn = Ft = 0) || Qt.pop());

                                )
                                  if (ze.nodeType === 1 && ++mn && ze === Ae) {
                                    ct[O] = [W, Ft, mn]
                                    break
                                  }
                              } else if (
                                (ni &&
                                  ((ct = Ae[Z] || (Ae[Z] = {})),
                                  (tt = ct[O] || []),
                                  (Ft = tt[0] === W && tt[1]),
                                  (mn = Ft)),
                                mn === !1)
                              )
                                for (
                                  ;
                                  (ze = (++Ft && ze && ze[qt]) || (mn = Ft = 0) || Qt.pop()) &&
                                  !(
                                    (je ? Ne(ze, ur) : ze.nodeType === 1) &&
                                    ++mn &&
                                    (ni && ((ct = ze[Z] || (ze[Z] = {})), (ct[O] = [W, mn])), ze === Ae)
                                  );

                                );
                              return ((mn -= ee), mn === V || (mn % V === 0 && mn / V >= 0))
                            }
                          }
                    },
                    PSEUDO: function (O, j) {
                      var U,
                        V = c.pseudos[O] || c.setFilters[O.toLowerCase()] || Dt.error('unsupported pseudo: ' + O)
                      return V[Z]
                        ? V(j)
                        : V.length > 1
                          ? ((U = [O, O, '', j]),
                            c.setFilters.hasOwnProperty(O.toLowerCase())
                              ? zt(function (ee, be) {
                                  for (var Te, je = V(ee, j), Ae = je.length; Ae--; )
                                    ((Te = f.call(ee, je[Ae])), (ee[Te] = !(be[Te] = je[Ae])))
                                })
                              : function (ee) {
                                  return V(ee, 0, U)
                                })
                          : V
                    }
                  },
                  pseudos: {
                    not: zt(function (O) {
                      var j = [],
                        U = [],
                        V = io(O.replace(re, '$1'))
                      return V[Z]
                        ? zt(function (ee, be, Te, je) {
                            for (var Ae, mt = V(ee, null, je, []), Xe = ee.length; Xe--; )
                              (Ae = mt[Xe]) && (ee[Xe] = !(be[Xe] = Ae))
                          })
                        : function (ee, be, Te) {
                            return ((j[0] = ee), V(j, null, Te, U), (j[0] = null), !U.pop())
                          }
                    }),
                    has: zt(function (O) {
                      return function (j) {
                        return Dt(O, j).length > 0
                      }
                    }),
                    contains: zt(function (O) {
                      return (
                        (O = O.replace(_r, wr)),
                        function (j) {
                          return (j.textContent || m.text(j)).indexOf(O) > -1
                        }
                      )
                    }),
                    lang: zt(function (O) {
                      return (
                        eo.test(O || '') || Dt.error('unsupported lang: ' + O),
                        (O = O.replace(_r, wr).toLowerCase()),
                        function (j) {
                          var U
                          do
                            if ((U = L ? j.lang : j.getAttribute('xml:lang') || j.getAttribute('lang')))
                              return ((U = U.toLowerCase()), U === O || U.indexOf(O + '-') === 0)
                          while ((j = j.parentNode) && j.nodeType === 1)
                          return !1
                        }
                      )
                    }),
                    target: function (O) {
                      var j = t.location && t.location.hash
                      return j && j.slice(1) === O.id
                    },
                    root: function (O) {
                      return O === I
                    },
                    focus: function (O) {
                      return O === mc() && T.hasFocus() && !!(O.type || O.href || ~O.tabIndex)
                    },
                    enabled: Ha(!1),
                    disabled: Ha(!0),
                    checked: function (O) {
                      return (Ne(O, 'input') && !!O.checked) || (Ne(O, 'option') && !!O.selected)
                    },
                    selected: function (O) {
                      return (O.parentNode && O.parentNode.selectedIndex, O.selected === !0)
                    },
                    empty: function (O) {
                      for (O = O.firstChild; O; O = O.nextSibling) if (O.nodeType < 6) return !1
                      return !0
                    },
                    parent: function (O) {
                      return !c.pseudos.empty(O)
                    },
                    header: function (O) {
                      return Rr.test(O.nodeName)
                    },
                    input: function (O) {
                      return An.test(O.nodeName)
                    },
                    button: function (O) {
                      return (Ne(O, 'input') && O.type === 'button') || Ne(O, 'button')
                    },
                    text: function (O) {
                      var j
                      return (
                        Ne(O, 'input') &&
                        O.type === 'text' &&
                        ((j = O.getAttribute('type')) == null || j.toLowerCase() === 'text')
                      )
                    },
                    first: ti(function () {
                      return [0]
                    }),
                    last: ti(function (O, j) {
                      return [j - 1]
                    }),
                    eq: ti(function (O, j, U) {
                      return [U < 0 ? U + j : U]
                    }),
                    even: ti(function (O, j) {
                      for (var U = 0; U < j; U += 2) O.push(U)
                      return O
                    }),
                    odd: ti(function (O, j) {
                      for (var U = 1; U < j; U += 2) O.push(U)
                      return O
                    }),
                    lt: ti(function (O, j, U) {
                      var V
                      for (U < 0 ? (V = U + j) : U > j ? (V = j) : (V = U); --V >= 0; ) O.push(V)
                      return O
                    }),
                    gt: ti(function (O, j, U) {
                      for (var V = U < 0 ? U + j : U; ++V < j; ) O.push(V)
                      return O
                    })
                  }
                }),
              (c.pseudos.nth = c.pseudos.eq))
            for (o in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) c.pseudos[o] = ja(o)
            for (o in { submit: !0, reset: !0 }) c.pseudos[o] = Na(o)
            function $a() {}
            ;(($a.prototype = c.filters = c.pseudos), (c.setFilters = new $a()))
            function to(O, j) {
              var U,
                V,
                ee,
                be,
                Te,
                je,
                Ae,
                mt = bt[O + ' ']
              if (mt) return j ? 0 : mt.slice(0)
              for (Te = O, je = [], Ae = c.preFilter; Te; ) {
                ;((!U || (V = Jt.exec(Te))) && (V && (Te = Te.slice(V[0].length) || Te), je.push((ee = []))),
                  (U = !1),
                  (V = Zi.exec(Te)) &&
                    ((U = V.shift()), ee.push({ value: U, type: V[0].replace(re, ' ') }), (Te = Te.slice(U.length))))
                for (be in c.filter)
                  (V = xn[be].exec(Te)) &&
                    (!Ae[be] || (V = Ae[be](V))) &&
                    ((U = V.shift()), ee.push({ value: U, type: be, matches: V }), (Te = Te.slice(U.length)))
                if (!U) break
              }
              return j ? Te.length : Te ? Dt.error(O) : bt(O, je).slice(0)
            }
            function no(O) {
              for (var j = 0, U = O.length, V = ''; j < U; j++) V += O[j].value
              return V
            }
            function Po(O, j, U) {
              var V = j.dir,
                ee = j.next,
                be = ee || V,
                Te = U && be === 'parentNode',
                je = ce++
              return j.first
                ? function (Ae, mt, Xe) {
                    for (; (Ae = Ae[V]); ) if (Ae.nodeType === 1 || Te) return O(Ae, mt, Xe)
                    return !1
                  }
                : function (Ae, mt, Xe) {
                    var tt,
                      ct,
                      ze = [W, je]
                    if (Xe) {
                      for (; (Ae = Ae[V]); ) if ((Ae.nodeType === 1 || Te) && O(Ae, mt, Xe)) return !0
                    } else
                      for (; (Ae = Ae[V]); )
                        if (Ae.nodeType === 1 || Te)
                          if (((ct = Ae[Z] || (Ae[Z] = {})), ee && Ne(Ae, ee))) Ae = Ae[V] || Ae
                          else {
                            if ((tt = ct[be]) && tt[0] === W && tt[1] === je) return (ze[2] = tt[2])
                            if (((ct[be] = ze), (ze[2] = O(Ae, mt, Xe)))) return !0
                          }
                    return !1
                  }
            }
            function As(O) {
              return O.length > 1
                ? function (j, U, V) {
                    for (var ee = O.length; ee--; ) if (!O[ee](j, U, V)) return !1
                    return !0
                  }
                : O[0]
            }
            function Ba(O, j, U) {
              for (var V = 0, ee = j.length; V < ee; V++) Dt(O, j[V], U)
              return U
            }
            function ro(O, j, U, V, ee) {
              for (var be, Te = [], je = 0, Ae = O.length, mt = j != null; je < Ae; je++)
                (be = O[je]) && (!U || U(be, V, ee)) && (Te.push(be), mt && j.push(je))
              return Te
            }
            function Ro(O, j, U, V, ee, be) {
              return (
                V && !V[Z] && (V = Ro(V)),
                ee && !ee[Z] && (ee = Ro(ee, be)),
                zt(function (Te, je, Ae, mt) {
                  var Xe,
                    tt,
                    ct,
                    ze,
                    Ft = [],
                    Qt = [],
                    qt = je.length,
                    Fn = Te || Ba(j || '*', Ae.nodeType ? [Ae] : Ae, []),
                    ur = O && (Te || !j) ? ro(Fn, Ft, O, Ae, mt) : Fn
                  if ((U ? ((ze = ee || (Te ? O : qt || V) ? [] : je), U(ur, ze, Ae, mt)) : (ze = ur), V))
                    for (Xe = ro(ze, Qt), V(Xe, [], Ae, mt), tt = Xe.length; tt--; )
                      (ct = Xe[tt]) && (ze[Qt[tt]] = !(ur[Qt[tt]] = ct))
                  if (Te) {
                    if (ee || O) {
                      if (ee) {
                        for (Xe = [], tt = ze.length; tt--; ) (ct = ze[tt]) && Xe.push((ur[tt] = ct))
                        ee(null, (ze = []), Xe, mt)
                      }
                      for (tt = ze.length; tt--; )
                        (ct = ze[tt]) && (Xe = ee ? f.call(Te, ct) : Ft[tt]) > -1 && (Te[Xe] = !(je[Xe] = ct))
                    }
                  } else
                    ((ze = ro(ze === je ? ze.splice(qt, ze.length) : ze)), ee ? ee(null, je, ze, mt) : x.apply(je, ze))
                })
              )
            }
            function Di(O) {
              for (
                var j,
                  U,
                  V,
                  ee = O.length,
                  be = c.relative[O[0].type],
                  Te = be || c.relative[' '],
                  je = be ? 1 : 0,
                  Ae = Po(
                    function (tt) {
                      return tt === j
                    },
                    Te,
                    !0
                  ),
                  mt = Po(
                    function (tt) {
                      return f.call(j, tt) > -1
                    },
                    Te,
                    !0
                  ),
                  Xe = [
                    function (tt, ct, ze) {
                      var Ft = (!be && (ze || ct != h)) || ((j = ct).nodeType ? Ae(tt, ct, ze) : mt(tt, ct, ze))
                      return ((j = null), Ft)
                    }
                  ];
                je < ee;
                je++
              )
                if ((U = c.relative[O[je].type])) Xe = [Po(As(Xe), U)]
                else {
                  if (((U = c.filter[O[je].type].apply(null, O[je].matches)), U[Z])) {
                    for (V = ++je; V < ee && !c.relative[O[V].type]; V++);
                    return Ro(
                      je > 1 && As(Xe),
                      je > 1 &&
                        no(O.slice(0, je - 1).concat({ value: O[je - 2].type === ' ' ? '*' : '' })).replace(re, '$1'),
                      U,
                      je < V && Di(O.slice(je, V)),
                      V < ee && Di((O = O.slice(V))),
                      V < ee && no(O)
                    )
                  }
                  Xe.push(U)
                }
              return As(Xe)
            }
            function qa(O, j) {
              var U = j.length > 0,
                V = O.length > 0,
                ee = function (be, Te, je, Ae, mt) {
                  var Xe,
                    tt,
                    ct,
                    ze = 0,
                    Ft = '0',
                    Qt = be && [],
                    qt = [],
                    Fn = h,
                    ur = be || (V && c.find.TAG('*', mt)),
                    ni = (W += Fn == null ? 1 : Math.random() || 0.1),
                    mn = ur.length
                  for (mt && (h = Te == T || Te || mt); Ft !== mn && (Xe = ur[Ft]) != null; Ft++) {
                    if (V && Xe) {
                      for (tt = 0, !Te && Xe.ownerDocument != T && (nr(Xe), (je = !L)); (ct = O[tt++]); )
                        if (ct(Xe, Te || T, je)) {
                          x.call(Ae, Xe)
                          break
                        }
                      mt && (W = ni)
                    }
                    U && ((Xe = !ct && Xe) && ze--, be && Qt.push(Xe))
                  }
                  if (((ze += Ft), U && Ft !== ze)) {
                    for (tt = 0; (ct = j[tt++]); ) ct(Qt, qt, Te, je)
                    if (be) {
                      if (ze > 0) for (; Ft--; ) Qt[Ft] || qt[Ft] || (qt[Ft] = fe.call(Ae))
                      qt = ro(qt)
                    }
                    ;(x.apply(Ae, qt), mt && !be && qt.length > 0 && ze + j.length > 1 && m.uniqueSort(Ae))
                  }
                  return (mt && ((W = ni), (h = Fn)), Qt)
                }
              return U ? zt(ee) : ee
            }
            function io(O, j) {
              var U,
                V = [],
                ee = [],
                be = et[O + ' ']
              if (!be) {
                for (j || (j = to(O)), U = j.length; U--; ) ((be = Di(j[U])), be[Z] ? V.push(be) : ee.push(be))
                ;((be = et(O, qa(ee, V))), (be.selector = O))
              }
              return be
            }
            function In(O, j, U, V) {
              var ee,
                be,
                Te,
                je,
                Ae,
                mt = typeof O == 'function' && O,
                Xe = !V && to((O = mt.selector || O))
              if (((U = U || []), Xe.length === 1)) {
                if (
                  ((be = Xe[0] = Xe[0].slice(0)),
                  be.length > 2 && (Te = be[0]).type === 'ID' && j.nodeType === 9 && L && c.relative[be[1].type])
                ) {
                  if (((j = (c.find.ID(Te.matches[0].replace(_r, wr), j) || [])[0]), j)) mt && (j = j.parentNode)
                  else return U
                  O = O.slice(be.shift().value.length)
                }
                for (
                  ee = xn.needsContext.test(O) ? 0 : be.length;
                  ee-- && ((Te = be[ee]), !c.relative[(je = Te.type)]);

                )
                  if (
                    (Ae = c.find[je]) &&
                    (V = Ae(Te.matches[0].replace(_r, wr), (Ts.test(be[0].type) && Oo(j.parentNode)) || j))
                  ) {
                    if ((be.splice(ee, 1), (O = V.length && no(be)), !O)) return (x.apply(U, V), U)
                    break
                  }
              }
              return ((mt || io(O, Xe))(V, j, !L, U, !j || (Ts.test(O) && Oo(j.parentNode)) || j), U)
            }
            ;((A.sortStable = Z.split('').sort(Ht).join('') === Z),
              nr(),
              (A.sortDetached = ei(function (O) {
                return O.compareDocumentPosition(T.createElement('fieldset')) & 1
              })),
              (m.find = Dt),
              (m.expr[':'] = m.expr.pseudos),
              (m.unique = m.uniqueSort),
              (Dt.compile = io),
              (Dt.select = In),
              (Dt.setDocument = nr),
              (Dt.tokenize = to),
              (Dt.escape = m.escapeSelector),
              (Dt.getText = m.text),
              (Dt.isXML = m.isXMLDoc),
              (Dt.selectors = m.expr),
              (Dt.support = m.support),
              (Dt.uniqueSort = m.uniqueSort))
          })()
          var ht = function (o, c, h) {
              for (var v = [], w = h !== void 0; (o = o[c]) && o.nodeType !== 9; )
                if (o.nodeType === 1) {
                  if (w && m(o).is(h)) break
                  v.push(o)
                }
              return v
            },
            At = function (o, c) {
              for (var h = []; o; o = o.nextSibling) o.nodeType === 1 && o !== c && h.push(o)
              return h
            },
            Gt = m.expr.match.needsContext,
            Tt = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i
          function rn(o, c, h) {
            return k(c)
              ? m.grep(o, function (v, w) {
                  return !!c.call(v, w, v) !== h
                })
              : c.nodeType
                ? m.grep(o, function (v) {
                    return (v === c) !== h
                  })
                : typeof c != 'string'
                  ? m.grep(o, function (v) {
                      return f.call(c, v) > -1 !== h
                    })
                  : m.filter(c, o, h)
          }
          ;((m.filter = function (o, c, h) {
            var v = c[0]
            return (
              h && (o = ':not(' + o + ')'),
              c.length === 1 && v.nodeType === 1
                ? m.find.matchesSelector(v, o)
                  ? [v]
                  : []
                : m.find.matches(
                    o,
                    m.grep(c, function (w) {
                      return w.nodeType === 1
                    })
                  )
            )
          }),
            m.fn.extend({
              find: function (o) {
                var c,
                  h,
                  v = this.length,
                  w = this
                if (typeof o != 'string')
                  return this.pushStack(
                    m(o).filter(function () {
                      for (c = 0; c < v; c++) if (m.contains(w[c], this)) return !0
                    })
                  )
                for (h = this.pushStack([]), c = 0; c < v; c++) m.find(o, w[c], h)
                return v > 1 ? m.uniqueSort(h) : h
              },
              filter: function (o) {
                return this.pushStack(rn(this, o || [], !1))
              },
              not: function (o) {
                return this.pushStack(rn(this, o || [], !0))
              },
              is: function (o) {
                return !!rn(this, typeof o == 'string' && Gt.test(o) ? m(o) : o || [], !1).length
              }
            }))
          var _e,
            Ke = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
            $e = (m.fn.init = function (o, c, h) {
              var v, w
              if (!o) return this
              if (((h = h || _e), typeof o == 'string'))
                if (
                  (o[0] === '<' && o[o.length - 1] === '>' && o.length >= 3 ? (v = [null, o, null]) : (v = Ke.exec(o)),
                  v && (v[1] || !c))
                )
                  if (v[1]) {
                    if (
                      ((c = c instanceof m ? c[0] : c),
                      m.merge(this, m.parseHTML(v[1], c && c.nodeType ? c.ownerDocument || c : N, !0)),
                      Tt.test(v[1]) && m.isPlainObject(c))
                    )
                      for (v in c) k(this[v]) ? this[v](c[v]) : this.attr(v, c[v])
                    return this
                  } else return ((w = N.getElementById(v[2])), w && ((this[0] = w), (this.length = 1)), this)
                else return !c || c.jquery ? (c || h).find(o) : this.constructor(c).find(o)
              else {
                if (o.nodeType) return ((this[0] = o), (this.length = 1), this)
                if (k(o)) return h.ready !== void 0 ? h.ready(o) : o(m)
              }
              return m.makeArray(o, this)
            })
          ;(($e.prototype = m.fn), (_e = m(N)))
          var K = /^(?:parents|prev(?:Until|All))/,
            ve = { children: !0, contents: !0, next: !0, prev: !0 }
          m.fn.extend({
            has: function (o) {
              var c = m(o, this),
                h = c.length
              return this.filter(function () {
                for (var v = 0; v < h; v++) if (m.contains(this, c[v])) return !0
              })
            },
            closest: function (o, c) {
              var h,
                v = 0,
                w = this.length,
                x = [],
                T = typeof o != 'string' && m(o)
              if (!Gt.test(o)) {
                for (; v < w; v++)
                  for (h = this[v]; h && h !== c; h = h.parentNode)
                    if (h.nodeType < 11 && (T ? T.index(h) > -1 : h.nodeType === 1 && m.find.matchesSelector(h, o))) {
                      x.push(h)
                      break
                    }
              }
              return this.pushStack(x.length > 1 ? m.uniqueSort(x) : x)
            },
            index: function (o) {
              return o
                ? typeof o == 'string'
                  ? f.call(m(o), this[0])
                  : f.call(this, o.jquery ? o[0] : o)
                : this[0] && this[0].parentNode
                  ? this.first().prevAll().length
                  : -1
            },
            add: function (o, c) {
              return this.pushStack(m.uniqueSort(m.merge(this.get(), m(o, c))))
            },
            addBack: function (o) {
              return this.add(o == null ? this.prevObject : this.prevObject.filter(o))
            }
          })
          function Se(o, c) {
            for (; (o = o[c]) && o.nodeType !== 1; );
            return o
          }
          m.each(
            {
              parent: function (o) {
                var c = o.parentNode
                return c && c.nodeType !== 11 ? c : null
              },
              parents: function (o) {
                return ht(o, 'parentNode')
              },
              parentsUntil: function (o, c, h) {
                return ht(o, 'parentNode', h)
              },
              next: function (o) {
                return Se(o, 'nextSibling')
              },
              prev: function (o) {
                return Se(o, 'previousSibling')
              },
              nextAll: function (o) {
                return ht(o, 'nextSibling')
              },
              prevAll: function (o) {
                return ht(o, 'previousSibling')
              },
              nextUntil: function (o, c, h) {
                return ht(o, 'nextSibling', h)
              },
              prevUntil: function (o, c, h) {
                return ht(o, 'previousSibling', h)
              },
              siblings: function (o) {
                return At((o.parentNode || {}).firstChild, o)
              },
              children: function (o) {
                return At(o.firstChild)
              },
              contents: function (o) {
                return o.contentDocument != null && i(o.contentDocument)
                  ? o.contentDocument
                  : (Ne(o, 'template') && (o = o.content || o), m.merge([], o.childNodes))
              }
            },
            function (o, c) {
              m.fn[o] = function (h, v) {
                var w = m.map(this, c, h)
                return (
                  o.slice(-5) !== 'Until' && (v = h),
                  v && typeof v == 'string' && (w = m.filter(v, w)),
                  this.length > 1 && (ve[o] || m.uniqueSort(w), K.test(o) && w.reverse()),
                  this.pushStack(w)
                )
              }
            }
          )
          var Ce = /[^\x20\t\r\n\f]+/g
          function xt(o) {
            var c = {}
            return (
              m.each(o.match(Ce) || [], function (h, v) {
                c[v] = !0
              }),
              c
            )
          }
          m.Callbacks = function (o) {
            o = typeof o == 'string' ? xt(o) : m.extend({}, o)
            var c,
              h,
              v,
              w,
              x = [],
              T = [],
              I = -1,
              L = function () {
                for (w = w || o.once, v = c = !0; T.length; I = -1)
                  for (h = T.shift(); ++I < x.length; )
                    x[I].apply(h[0], h[1]) === !1 && o.stopOnFalse && ((I = x.length), (h = !1))
                ;(o.memory || (h = !1), (c = !1), w && (h ? (x = []) : (x = '')))
              },
              H = {
                add: function () {
                  return (
                    x &&
                      (h && !c && ((I = x.length - 1), T.push(h)),
                      (function X(Z) {
                        m.each(Z, function (W, ce) {
                          k(ce)
                            ? (!o.unique || !H.has(ce)) && x.push(ce)
                            : ce && ce.length && Y(ce) !== 'string' && X(ce)
                        })
                      })(arguments),
                      h && !c && L()),
                    this
                  )
                },
                remove: function () {
                  return (
                    m.each(arguments, function (X, Z) {
                      for (var W; (W = m.inArray(Z, x, W)) > -1; ) (x.splice(W, 1), W <= I && I--)
                    }),
                    this
                  )
                },
                has: function (X) {
                  return X ? m.inArray(X, x) > -1 : x.length > 0
                },
                empty: function () {
                  return (x && (x = []), this)
                },
                disable: function () {
                  return ((w = T = []), (x = h = ''), this)
                },
                disabled: function () {
                  return !x
                },
                lock: function () {
                  return ((w = T = []), !h && !c && (x = h = ''), this)
                },
                locked: function () {
                  return !!w
                },
                fireWith: function (X, Z) {
                  return (w || ((Z = Z || []), (Z = [X, Z.slice ? Z.slice() : Z]), T.push(Z), c || L()), this)
                },
                fire: function () {
                  return (H.fireWith(this, arguments), this)
                },
                fired: function () {
                  return !!v
                }
              }
            return H
          }
          function R(o) {
            return o
          }
          function M(o) {
            throw o
          }
          function q(o, c, h, v) {
            var w
            try {
              o && k((w = o.promise))
                ? w.call(o).done(c).fail(h)
                : o && k((w = o.then))
                  ? w.call(o, c, h)
                  : c.apply(void 0, [o].slice(v))
            } catch (x) {
              h.apply(void 0, [x])
            }
          }
          m.extend({
            Deferred: function (o) {
              var c = [
                  ['notify', 'progress', m.Callbacks('memory'), m.Callbacks('memory'), 2],
                  ['resolve', 'done', m.Callbacks('once memory'), m.Callbacks('once memory'), 0, 'resolved'],
                  ['reject', 'fail', m.Callbacks('once memory'), m.Callbacks('once memory'), 1, 'rejected']
                ],
                h = 'pending',
                v = {
                  state: function () {
                    return h
                  },
                  always: function () {
                    return (w.done(arguments).fail(arguments), this)
                  },
                  catch: function (x) {
                    return v.then(null, x)
                  },
                  pipe: function () {
                    var x = arguments
                    return m
                      .Deferred(function (T) {
                        ;(m.each(c, function (I, L) {
                          var H = k(x[L[4]]) && x[L[4]]
                          w[L[1]](function () {
                            var X = H && H.apply(this, arguments)
                            X && k(X.promise)
                              ? X.promise().progress(T.notify).done(T.resolve).fail(T.reject)
                              : T[L[0] + 'With'](this, H ? [X] : arguments)
                          })
                        }),
                          (x = null))
                      })
                      .promise()
                  },
                  then: function (x, T, I) {
                    var L = 0
                    function H(X, Z, W, ce) {
                      return function () {
                        var Ze = this,
                          bt = arguments,
                          et = function () {
                            var Ht, Kn
                            if (!(X < L)) {
                              if (((Ht = W.apply(Ze, bt)), Ht === Z.promise()))
                                throw new TypeError('Thenable self-resolution')
                              ;((Kn = Ht && (typeof Ht == 'object' || typeof Ht == 'function') && Ht.then),
                                k(Kn)
                                  ? ce
                                    ? Kn.call(Ht, H(L, Z, R, ce), H(L, Z, M, ce))
                                    : (L++, Kn.call(Ht, H(L, Z, R, ce), H(L, Z, M, ce), H(L, Z, R, Z.notifyWith)))
                                  : (W !== R && ((Ze = void 0), (bt = [Ht])), (ce || Z.resolveWith)(Ze, bt)))
                            }
                          },
                          un = ce
                            ? et
                            : function () {
                                try {
                                  et()
                                } catch (Ht) {
                                  ;(m.Deferred.exceptionHook && m.Deferred.exceptionHook(Ht, un.error),
                                    X + 1 >= L && (W !== M && ((Ze = void 0), (bt = [Ht])), Z.rejectWith(Ze, bt)))
                                }
                              }
                        X
                          ? un()
                          : (m.Deferred.getErrorHook
                              ? (un.error = m.Deferred.getErrorHook())
                              : m.Deferred.getStackHook && (un.error = m.Deferred.getStackHook()),
                            t.setTimeout(un))
                      }
                    }
                    return m
                      .Deferred(function (X) {
                        ;(c[0][3].add(H(0, X, k(I) ? I : R, X.notifyWith)),
                          c[1][3].add(H(0, X, k(x) ? x : R)),
                          c[2][3].add(H(0, X, k(T) ? T : M)))
                      })
                      .promise()
                  },
                  promise: function (x) {
                    return x != null ? m.extend(x, v) : v
                  }
                },
                w = {}
              return (
                m.each(c, function (x, T) {
                  var I = T[2],
                    L = T[5]
                  ;((v[T[1]] = I.add),
                    L &&
                      I.add(
                        function () {
                          h = L
                        },
                        c[3 - x][2].disable,
                        c[3 - x][3].disable,
                        c[0][2].lock,
                        c[0][3].lock
                      ),
                    I.add(T[3].fire),
                    (w[T[0]] = function () {
                      return (w[T[0] + 'With'](this === w ? void 0 : this, arguments), this)
                    }),
                    (w[T[0] + 'With'] = I.fireWith))
                }),
                v.promise(w),
                o && o.call(w, w),
                w
              )
            },
            when: function (o) {
              var c = arguments.length,
                h = c,
                v = Array(h),
                w = s.call(arguments),
                x = m.Deferred(),
                T = function (I) {
                  return function (L) {
                    ;((v[I] = this), (w[I] = arguments.length > 1 ? s.call(arguments) : L), --c || x.resolveWith(v, w))
                  }
                }
              if (c <= 1 && (q(o, x.done(T(h)).resolve, x.reject, !c), x.state() === 'pending' || k(w[h] && w[h].then)))
                return x.then()
              for (; h--; ) q(w[h], T(h), x.reject)
              return x.promise()
            }
          })
          var te = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/
          ;((m.Deferred.exceptionHook = function (o, c) {
            t.console &&
              t.console.warn &&
              o &&
              te.test(o.name) &&
              t.console.warn('jQuery.Deferred exception: ' + o.message, o.stack, c)
          }),
            (m.readyException = function (o) {
              t.setTimeout(function () {
                throw o
              })
            }))
          var ie = m.Deferred()
          ;((m.fn.ready = function (o) {
            return (
              ie.then(o).catch(function (c) {
                m.readyException(c)
              }),
              this
            )
          }),
            m.extend({
              isReady: !1,
              readyWait: 1,
              ready: function (o) {
                ;(o === !0 ? --m.readyWait : m.isReady) ||
                  ((m.isReady = !0), !(o !== !0 && --m.readyWait > 0) && ie.resolveWith(N, [m]))
              }
            }),
            (m.ready.then = ie.then))
          function ne() {
            ;(N.removeEventListener('DOMContentLoaded', ne), t.removeEventListener('load', ne), m.ready())
          }
          N.readyState === 'complete' || (N.readyState !== 'loading' && !N.documentElement.doScroll)
            ? t.setTimeout(m.ready)
            : (N.addEventListener('DOMContentLoaded', ne), t.addEventListener('load', ne))
          var ge = function (o, c, h, v, w, x, T) {
              var I = 0,
                L = o.length,
                H = h == null
              if (Y(h) === 'object') {
                w = !0
                for (I in h) ge(o, c, I, h[I], !0, x, T)
              } else if (
                v !== void 0 &&
                ((w = !0),
                k(v) || (T = !0),
                H &&
                  (T
                    ? (c.call(o, v), (c = null))
                    : ((H = c),
                      (c = function (X, Z, W) {
                        return H.call(m(X), W)
                      }))),
                c)
              )
                for (; I < L; I++) c(o[I], h, T ? v : v.call(o[I], I, c(o[I], h)))
              return w ? o : H ? c.call(o) : L ? c(o[0], h) : x
            },
            me = /^-ms-/,
            ye = /-([a-z])/g
          function de(o, c) {
            return c.toUpperCase()
          }
          function Oe(o) {
            return o.replace(me, 'ms-').replace(ye, de)
          }
          var we = function (o) {
            return o.nodeType === 1 || o.nodeType === 9 || !+o.nodeType
          }
          function Ie() {
            this.expando = m.expando + Ie.uid++
          }
          ;((Ie.uid = 1),
            (Ie.prototype = {
              cache: function (o) {
                var c = o[this.expando]
                return (
                  c ||
                    ((c = {}),
                    we(o) &&
                      (o.nodeType
                        ? (o[this.expando] = c)
                        : Object.defineProperty(o, this.expando, { value: c, configurable: !0 }))),
                  c
                )
              },
              set: function (o, c, h) {
                var v,
                  w = this.cache(o)
                if (typeof c == 'string') w[Oe(c)] = h
                else for (v in c) w[Oe(v)] = c[v]
                return w
              },
              get: function (o, c) {
                return c === void 0 ? this.cache(o) : o[this.expando] && o[this.expando][Oe(c)]
              },
              access: function (o, c, h) {
                return c === void 0 || (c && typeof c == 'string' && h === void 0)
                  ? this.get(o, c)
                  : (this.set(o, c, h), h !== void 0 ? h : c)
              },
              remove: function (o, c) {
                var h,
                  v = o[this.expando]
                if (v !== void 0) {
                  if (c !== void 0)
                    for (
                      Array.isArray(c) ? (c = c.map(Oe)) : ((c = Oe(c)), (c = (c in v) ? [c] : c.match(Ce) || [])),
                        h = c.length;
                      h--;

                    )
                      delete v[c[h]]
                  ;(c === void 0 || m.isEmptyObject(v)) &&
                    (o.nodeType ? (o[this.expando] = void 0) : delete o[this.expando])
                }
              },
              hasData: function (o) {
                var c = o[this.expando]
                return c !== void 0 && !m.isEmptyObject(c)
              }
            }))
          var se = new Ie(),
            Ve = new Ie(),
            Ot = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            St = /[A-Z]/g
          function cn(o) {
            return o === 'true'
              ? !0
              : o === 'false'
                ? !1
                : o === 'null'
                  ? null
                  : o === +o + ''
                    ? +o
                    : Ot.test(o)
                      ? JSON.parse(o)
                      : o
          }
          function on(o, c, h) {
            var v
            if (h === void 0 && o.nodeType === 1)
              if (((v = 'data-' + c.replace(St, '-$&').toLowerCase()), (h = o.getAttribute(v)), typeof h == 'string')) {
                try {
                  h = cn(h)
                } catch {}
                Ve.set(o, c, h)
              } else h = void 0
            return h
          }
          ;(m.extend({
            hasData: function (o) {
              return Ve.hasData(o) || se.hasData(o)
            },
            data: function (o, c, h) {
              return Ve.access(o, c, h)
            },
            removeData: function (o, c) {
              Ve.remove(o, c)
            },
            _data: function (o, c, h) {
              return se.access(o, c, h)
            },
            _removeData: function (o, c) {
              se.remove(o, c)
            }
          }),
            m.fn.extend({
              data: function (o, c) {
                var h,
                  v,
                  w,
                  x = this[0],
                  T = x && x.attributes
                if (o === void 0) {
                  if (this.length && ((w = Ve.get(x)), x.nodeType === 1 && !se.get(x, 'hasDataAttrs'))) {
                    for (h = T.length; h--; )
                      T[h] && ((v = T[h].name), v.indexOf('data-') === 0 && ((v = Oe(v.slice(5))), on(x, v, w[v])))
                    se.set(x, 'hasDataAttrs', !0)
                  }
                  return w
                }
                return typeof o == 'object'
                  ? this.each(function () {
                      Ve.set(this, o)
                    })
                  : ge(
                      this,
                      function (I) {
                        var L
                        if (x && I === void 0)
                          return ((L = Ve.get(x, o)), L !== void 0 || ((L = on(x, o)), L !== void 0) ? L : void 0)
                        this.each(function () {
                          Ve.set(this, o, I)
                        })
                      },
                      null,
                      c,
                      arguments.length > 1,
                      null,
                      !0
                    )
              },
              removeData: function (o) {
                return this.each(function () {
                  Ve.remove(this, o)
                })
              }
            }),
            m.extend({
              queue: function (o, c, h) {
                var v
                if (o)
                  return (
                    (c = (c || 'fx') + 'queue'),
                    (v = se.get(o, c)),
                    h && (!v || Array.isArray(h) ? (v = se.access(o, c, m.makeArray(h))) : v.push(h)),
                    v || []
                  )
              },
              dequeue: function (o, c) {
                c = c || 'fx'
                var h = m.queue(o, c),
                  v = h.length,
                  w = h.shift(),
                  x = m._queueHooks(o, c),
                  T = function () {
                    m.dequeue(o, c)
                  }
                ;(w === 'inprogress' && ((w = h.shift()), v--),
                  w && (c === 'fx' && h.unshift('inprogress'), delete x.stop, w.call(o, T, x)),
                  !v && x && x.empty.fire())
              },
              _queueHooks: function (o, c) {
                var h = c + 'queueHooks'
                return (
                  se.get(o, h) ||
                  se.access(o, h, {
                    empty: m.Callbacks('once memory').add(function () {
                      se.remove(o, [c + 'queue', h])
                    })
                  })
                )
              }
            }),
            m.fn.extend({
              queue: function (o, c) {
                var h = 2
                return (
                  typeof o != 'string' && ((c = o), (o = 'fx'), h--),
                  arguments.length < h
                    ? m.queue(this[0], o)
                    : c === void 0
                      ? this
                      : this.each(function () {
                          var v = m.queue(this, o, c)
                          ;(m._queueHooks(this, o), o === 'fx' && v[0] !== 'inprogress' && m.dequeue(this, o))
                        })
                )
              },
              dequeue: function (o) {
                return this.each(function () {
                  m.dequeue(this, o)
                })
              },
              clearQueue: function (o) {
                return this.queue(o || 'fx', [])
              },
              promise: function (o, c) {
                var h,
                  v = 1,
                  w = m.Deferred(),
                  x = this,
                  T = this.length,
                  I = function () {
                    --v || w.resolveWith(x, [x])
                  }
                for (typeof o != 'string' && ((c = o), (o = void 0)), o = o || 'fx'; T--; )
                  ((h = se.get(x[T], o + 'queueHooks')), h && h.empty && (v++, h.empty.add(I)))
                return (I(), w.promise(c))
              }
            }))
          var bn = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            hn = new RegExp('^(?:([+-])=|)(' + bn + ')([a-z%]*)$', 'i'),
            sn = ['Top', 'Right', 'Bottom', 'Left'],
            Un = N.documentElement,
            Yt = function (o) {
              return m.contains(o.ownerDocument, o)
            },
            Rn = { composed: !0 }
          Un.getRootNode &&
            (Yt = function (o) {
              return m.contains(o.ownerDocument, o) || o.getRootNode(Rn) === o.ownerDocument
            })
          var Wn = function (o, c) {
            return (
              (o = c || o),
              o.style.display === 'none' || (o.style.display === '' && Yt(o) && m.css(o, 'display') === 'none')
            )
          }
          function xa(o, c, h, v) {
            var w,
              x,
              T = 20,
              I = v
                ? function () {
                    return v.cur()
                  }
                : function () {
                    return m.css(o, c, '')
                  },
              L = I(),
              H = (h && h[3]) || (m.cssNumber[c] ? '' : 'px'),
              X = o.nodeType && (m.cssNumber[c] || (H !== 'px' && +L)) && hn.exec(m.css(o, c))
            if (X && X[3] !== H) {
              for (L = L / 2, H = H || X[3], X = +L || 1; T--; )
                (m.style(o, c, X + H), (1 - x) * (1 - (x = I() / L || 0.5)) <= 0 && (T = 0), (X = X / x))
              ;((X = X * 2), m.style(o, c, X + H), (h = h || []))
            }
            return (
              h &&
                ((X = +X || +L || 0),
                (w = h[1] ? X + (h[1] + 1) * h[2] : +h[2]),
                v && ((v.unit = H), (v.start = X), (v.end = w))),
              w
            )
          }
          var ss = {}
          function Sa(o) {
            var c,
              h = o.ownerDocument,
              v = o.nodeName,
              w = ss[v]
            return (
              w ||
              ((c = h.body.appendChild(h.createElement(v))),
              (w = m.css(c, 'display')),
              c.parentNode.removeChild(c),
              w === 'none' && (w = 'block'),
              (ss[v] = w),
              w)
            )
          }
          function zr(o, c) {
            for (var h, v, w = [], x = 0, T = o.length; x < T; x++)
              ((v = o[x]),
                v.style &&
                  ((h = v.style.display),
                  c
                    ? (h === 'none' && ((w[x] = se.get(v, 'display') || null), w[x] || (v.style.display = '')),
                      v.style.display === '' && Wn(v) && (w[x] = Sa(v)))
                    : h !== 'none' && ((w[x] = 'none'), se.set(v, 'display', h))))
            for (x = 0; x < T; x++) w[x] != null && (o[x].style.display = w[x])
            return o
          }
          m.fn.extend({
            show: function () {
              return zr(this, !0)
            },
            hide: function () {
              return zr(this)
            },
            toggle: function (o) {
              return typeof o == 'boolean'
                ? o
                  ? this.show()
                  : this.hide()
                : this.each(function () {
                    Wn(this) ? m(this).show() : m(this).hide()
                  })
            }
          })
          var vi = /^(?:checkbox|radio)$/i,
            as = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
            _o = /^$|^module$|\/(?:java|ecma)script/i
          ;(function () {
            var o = N.createDocumentFragment(),
              c = o.appendChild(N.createElement('div')),
              h = N.createElement('input')
            ;(h.setAttribute('type', 'radio'),
              h.setAttribute('checked', 'checked'),
              h.setAttribute('name', 't'),
              c.appendChild(h),
              (A.checkClone = c.cloneNode(!0).cloneNode(!0).lastChild.checked),
              (c.innerHTML = '<textarea>x</textarea>'),
              (A.noCloneChecked = !!c.cloneNode(!0).lastChild.defaultValue),
              (c.innerHTML = '<option></option>'),
              (A.option = !!c.lastChild))
          })()
          var Ln = {
            thead: [1, '<table>', '</table>'],
            col: [2, '<table><colgroup>', '</colgroup></table>'],
            tr: [2, '<table><tbody>', '</tbody></table>'],
            td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            _default: [0, '', '']
          }
          ;((Ln.tbody = Ln.tfoot = Ln.colgroup = Ln.caption = Ln.thead),
            (Ln.th = Ln.td),
            A.option || (Ln.optgroup = Ln.option = [1, "<select multiple='multiple'>", '</select>']))
          function Tn(o, c) {
            var h
            return (
              typeof o.getElementsByTagName < 'u'
                ? (h = o.getElementsByTagName(c || '*'))
                : typeof o.querySelectorAll < 'u'
                  ? (h = o.querySelectorAll(c || '*'))
                  : (h = []),
              c === void 0 || (c && Ne(o, c)) ? m.merge([o], h) : h
            )
          }
          function ls(o, c) {
            for (var h = 0, v = o.length; h < v; h++) se.set(o[h], 'globalEval', !c || se.get(c[h], 'globalEval'))
          }
          var Ca = /<|&#?\w+;/
          function cs(o, c, h, v, w) {
            for (var x, T, I, L, H, X, Z = c.createDocumentFragment(), W = [], ce = 0, Ze = o.length; ce < Ze; ce++)
              if (((x = o[ce]), x || x === 0))
                if (Y(x) === 'object') m.merge(W, x.nodeType ? [x] : x)
                else if (!Ca.test(x)) W.push(c.createTextNode(x))
                else {
                  for (
                    T = T || Z.appendChild(c.createElement('div')),
                      I = (as.exec(x) || ['', ''])[1].toLowerCase(),
                      L = Ln[I] || Ln._default,
                      T.innerHTML = L[1] + m.htmlPrefilter(x) + L[2],
                      X = L[0];
                    X--;

                  )
                    T = T.lastChild
                  ;(m.merge(W, T.childNodes), (T = Z.firstChild), (T.textContent = ''))
                }
            for (Z.textContent = '', ce = 0; (x = W[ce++]); ) {
              if (v && m.inArray(x, v) > -1) {
                w && w.push(x)
                continue
              }
              if (((H = Yt(x)), (T = Tn(Z.appendChild(x), 'script')), H && ls(T), h))
                for (X = 0; (x = T[X++]); ) _o.test(x.type || '') && h.push(x)
            }
            return Z
          }
          var Vi = /^([^.]*)(?:\.(.+)|)/
          function gi() {
            return !0
          }
          function bi() {
            return !1
          }
          function zi(o, c, h, v, w, x) {
            var T, I
            if (typeof c == 'object') {
              typeof h != 'string' && ((v = v || h), (h = void 0))
              for (I in c) zi(o, I, h, v, c[I], x)
              return o
            }
            if (
              (v == null && w == null
                ? ((w = h), (v = h = void 0))
                : w == null && (typeof h == 'string' ? ((w = v), (v = void 0)) : ((w = v), (v = h), (h = void 0))),
              w === !1)
            )
              w = bi
            else if (!w) return o
            return (
              x === 1 &&
                ((T = w),
                (w = function (L) {
                  return (m().off(L), T.apply(this, arguments))
                }),
                (w.guid = T.guid || (T.guid = m.guid++))),
              o.each(function () {
                m.event.add(this, c, w, v, h)
              })
            )
          }
          m.event = {
            global: {},
            add: function (o, c, h, v, w) {
              var x,
                T,
                I,
                L,
                H,
                X,
                Z,
                W,
                ce,
                Ze,
                bt,
                et = se.get(o)
              if (we(o))
                for (
                  h.handler && ((x = h), (h = x.handler), (w = x.selector)),
                    w && m.find.matchesSelector(Un, w),
                    h.guid || (h.guid = m.guid++),
                    (L = et.events) || (L = et.events = Object.create(null)),
                    (T = et.handle) ||
                      (T = et.handle =
                        function (un) {
                          return typeof m < 'u' && m.event.triggered !== un.type
                            ? m.event.dispatch.apply(o, arguments)
                            : void 0
                        }),
                    c = (c || '').match(Ce) || [''],
                    H = c.length;
                  H--;

                )
                  ((I = Vi.exec(c[H]) || []),
                    (ce = bt = I[1]),
                    (Ze = (I[2] || '').split('.').sort()),
                    ce &&
                      ((Z = m.event.special[ce] || {}),
                      (ce = (w ? Z.delegateType : Z.bindType) || ce),
                      (Z = m.event.special[ce] || {}),
                      (X = m.extend(
                        {
                          type: ce,
                          origType: bt,
                          data: v,
                          handler: h,
                          guid: h.guid,
                          selector: w,
                          needsContext: w && m.expr.match.needsContext.test(w),
                          namespace: Ze.join('.')
                        },
                        x
                      )),
                      (W = L[ce]) ||
                        ((W = L[ce] = []),
                        (W.delegateCount = 0),
                        (!Z.setup || Z.setup.call(o, v, Ze, T) === !1) &&
                          o.addEventListener &&
                          o.addEventListener(ce, T)),
                      Z.add && (Z.add.call(o, X), X.handler.guid || (X.handler.guid = h.guid)),
                      w ? W.splice(W.delegateCount++, 0, X) : W.push(X),
                      (m.event.global[ce] = !0)))
            },
            remove: function (o, c, h, v, w) {
              var x,
                T,
                I,
                L,
                H,
                X,
                Z,
                W,
                ce,
                Ze,
                bt,
                et = se.hasData(o) && se.get(o)
              if (!(!et || !(L = et.events))) {
                for (c = (c || '').match(Ce) || [''], H = c.length; H--; ) {
                  if (((I = Vi.exec(c[H]) || []), (ce = bt = I[1]), (Ze = (I[2] || '').split('.').sort()), !ce)) {
                    for (ce in L) m.event.remove(o, ce + c[H], h, v, !0)
                    continue
                  }
                  for (
                    Z = m.event.special[ce] || {},
                      ce = (v ? Z.delegateType : Z.bindType) || ce,
                      W = L[ce] || [],
                      I = I[2] && new RegExp('(^|\\.)' + Ze.join('\\.(?:.*\\.|)') + '(\\.|$)'),
                      T = x = W.length;
                    x--;

                  )
                    ((X = W[x]),
                      (w || bt === X.origType) &&
                        (!h || h.guid === X.guid) &&
                        (!I || I.test(X.namespace)) &&
                        (!v || v === X.selector || (v === '**' && X.selector)) &&
                        (W.splice(x, 1), X.selector && W.delegateCount--, Z.remove && Z.remove.call(o, X)))
                  T &&
                    !W.length &&
                    ((!Z.teardown || Z.teardown.call(o, Ze, et.handle) === !1) && m.removeEvent(o, ce, et.handle),
                    delete L[ce])
                }
                m.isEmptyObject(L) && se.remove(o, 'handle events')
              }
            },
            dispatch: function (o) {
              var c,
                h,
                v,
                w,
                x,
                T,
                I = new Array(arguments.length),
                L = m.event.fix(o),
                H = (se.get(this, 'events') || Object.create(null))[L.type] || [],
                X = m.event.special[L.type] || {}
              for (I[0] = L, c = 1; c < arguments.length; c++) I[c] = arguments[c]
              if (((L.delegateTarget = this), !(X.preDispatch && X.preDispatch.call(this, L) === !1))) {
                for (T = m.event.handlers.call(this, L, H), c = 0; (w = T[c++]) && !L.isPropagationStopped(); )
                  for (L.currentTarget = w.elem, h = 0; (x = w.handlers[h++]) && !L.isImmediatePropagationStopped(); )
                    (!L.rnamespace || x.namespace === !1 || L.rnamespace.test(x.namespace)) &&
                      ((L.handleObj = x),
                      (L.data = x.data),
                      (v = ((m.event.special[x.origType] || {}).handle || x.handler).apply(w.elem, I)),
                      v !== void 0 && (L.result = v) === !1 && (L.preventDefault(), L.stopPropagation()))
                return (X.postDispatch && X.postDispatch.call(this, L), L.result)
              }
            },
            handlers: function (o, c) {
              var h,
                v,
                w,
                x,
                T,
                I = [],
                L = c.delegateCount,
                H = o.target
              if (L && H.nodeType && !(o.type === 'click' && o.button >= 1)) {
                for (; H !== this; H = H.parentNode || this)
                  if (H.nodeType === 1 && !(o.type === 'click' && H.disabled === !0)) {
                    for (x = [], T = {}, h = 0; h < L; h++)
                      ((v = c[h]),
                        (w = v.selector + ' '),
                        T[w] === void 0 &&
                          (T[w] = v.needsContext ? m(w, this).index(H) > -1 : m.find(w, this, null, [H]).length),
                        T[w] && x.push(v))
                    x.length && I.push({ elem: H, handlers: x })
                  }
              }
              return ((H = this), L < c.length && I.push({ elem: H, handlers: c.slice(L) }), I)
            },
            addProp: function (o, c) {
              Object.defineProperty(m.Event.prototype, o, {
                enumerable: !0,
                configurable: !0,
                get: k(c)
                  ? function () {
                      if (this.originalEvent) return c(this.originalEvent)
                    }
                  : function () {
                      if (this.originalEvent) return this.originalEvent[o]
                    },
                set: function (h) {
                  Object.defineProperty(this, o, { enumerable: !0, configurable: !0, writable: !0, value: h })
                }
              })
            },
            fix: function (o) {
              return o[m.expando] ? o : new m.Event(o)
            },
            special: {
              load: { noBubble: !0 },
              click: {
                setup: function (o) {
                  var c = this || o
                  return (vi.test(c.type) && c.click && Ne(c, 'input') && Ki(c, 'click', !0), !1)
                },
                trigger: function (o) {
                  var c = this || o
                  return (vi.test(c.type) && c.click && Ne(c, 'input') && Ki(c, 'click'), !0)
                },
                _default: function (o) {
                  var c = o.target
                  return (vi.test(c.type) && c.click && Ne(c, 'input') && se.get(c, 'click')) || Ne(c, 'a')
                }
              },
              beforeunload: {
                postDispatch: function (o) {
                  o.result !== void 0 && o.originalEvent && (o.originalEvent.returnValue = o.result)
                }
              }
            }
          }
          function Ki(o, c, h) {
            if (!h) {
              se.get(o, c) === void 0 && m.event.add(o, c, gi)
              return
            }
            ;(se.set(o, c, !1),
              m.event.add(o, c, {
                namespace: !1,
                handler: function (v) {
                  var w,
                    x = se.get(this, c)
                  if (v.isTrigger & 1 && this[c]) {
                    if (x) (m.event.special[c] || {}).delegateType && v.stopPropagation()
                    else if (
                      ((x = s.call(arguments)),
                      se.set(this, c, x),
                      this[c](),
                      (w = se.get(this, c)),
                      se.set(this, c, !1),
                      x !== w)
                    )
                      return (v.stopImmediatePropagation(), v.preventDefault(), w)
                  } else
                    x &&
                      (se.set(this, c, m.event.trigger(x[0], x.slice(1), this)),
                      v.stopPropagation(),
                      (v.isImmediatePropagationStopped = gi))
                }
              }))
          }
          ;((m.removeEvent = function (o, c, h) {
            o.removeEventListener && o.removeEventListener(c, h)
          }),
            (m.Event = function (o, c) {
              if (!(this instanceof m.Event)) return new m.Event(o, c)
              ;(o && o.type
                ? ((this.originalEvent = o),
                  (this.type = o.type),
                  (this.isDefaultPrevented =
                    o.defaultPrevented || (o.defaultPrevented === void 0 && o.returnValue === !1) ? gi : bi),
                  (this.target = o.target && o.target.nodeType === 3 ? o.target.parentNode : o.target),
                  (this.currentTarget = o.currentTarget),
                  (this.relatedTarget = o.relatedTarget))
                : (this.type = o),
                c && m.extend(this, c),
                (this.timeStamp = (o && o.timeStamp) || Date.now()),
                (this[m.expando] = !0))
            }),
            (m.Event.prototype = {
              constructor: m.Event,
              isDefaultPrevented: bi,
              isPropagationStopped: bi,
              isImmediatePropagationStopped: bi,
              isSimulated: !1,
              preventDefault: function () {
                var o = this.originalEvent
                ;((this.isDefaultPrevented = gi), o && !this.isSimulated && o.preventDefault())
              },
              stopPropagation: function () {
                var o = this.originalEvent
                ;((this.isPropagationStopped = gi), o && !this.isSimulated && o.stopPropagation())
              },
              stopImmediatePropagation: function () {
                var o = this.originalEvent
                ;((this.isImmediatePropagationStopped = gi),
                  o && !this.isSimulated && o.stopImmediatePropagation(),
                  this.stopPropagation())
              }
            }),
            m.each(
              {
                altKey: !0,
                bubbles: !0,
                cancelable: !0,
                changedTouches: !0,
                ctrlKey: !0,
                detail: !0,
                eventPhase: !0,
                metaKey: !0,
                pageX: !0,
                pageY: !0,
                shiftKey: !0,
                view: !0,
                char: !0,
                code: !0,
                charCode: !0,
                key: !0,
                keyCode: !0,
                button: !0,
                buttons: !0,
                clientX: !0,
                clientY: !0,
                offsetX: !0,
                offsetY: !0,
                pointerId: !0,
                pointerType: !0,
                screenX: !0,
                screenY: !0,
                targetTouches: !0,
                toElement: !0,
                touches: !0,
                which: !0
              },
              m.event.addProp
            ),
            m.each({ focus: 'focusin', blur: 'focusout' }, function (o, c) {
              function h(v) {
                if (N.documentMode) {
                  var w = se.get(this, 'handle'),
                    x = m.event.fix(v)
                  ;((x.type = v.type === 'focusin' ? 'focus' : 'blur'),
                    (x.isSimulated = !0),
                    w(v),
                    x.target === x.currentTarget && w(x))
                } else m.event.simulate(c, v.target, m.event.fix(v))
              }
              ;((m.event.special[o] = {
                setup: function () {
                  var v
                  if ((Ki(this, o, !0), N.documentMode))
                    ((v = se.get(this, c)), v || this.addEventListener(c, h), se.set(this, c, (v || 0) + 1))
                  else return !1
                },
                trigger: function () {
                  return (Ki(this, o), !0)
                },
                teardown: function () {
                  var v
                  if (N.documentMode)
                    ((v = se.get(this, c) - 1),
                      v ? se.set(this, c, v) : (this.removeEventListener(c, h), se.remove(this, c)))
                  else return !1
                },
                _default: function (v) {
                  return se.get(v.target, o)
                },
                delegateType: c
              }),
                (m.event.special[c] = {
                  setup: function () {
                    var v = this.ownerDocument || this.document || this,
                      w = N.documentMode ? this : v,
                      x = se.get(w, c)
                    ;(x || (N.documentMode ? this.addEventListener(c, h) : v.addEventListener(o, h, !0)),
                      se.set(w, c, (x || 0) + 1))
                  },
                  teardown: function () {
                    var v = this.ownerDocument || this.document || this,
                      w = N.documentMode ? this : v,
                      x = se.get(w, c) - 1
                    x
                      ? se.set(w, c, x)
                      : (N.documentMode ? this.removeEventListener(c, h) : v.removeEventListener(o, h, !0),
                        se.remove(w, c))
                  }
                }))
            }),
            m.each(
              {
                mouseenter: 'mouseover',
                mouseleave: 'mouseout',
                pointerenter: 'pointerover',
                pointerleave: 'pointerout'
              },
              function (o, c) {
                m.event.special[o] = {
                  delegateType: c,
                  bindType: c,
                  handle: function (h) {
                    var v,
                      w = this,
                      x = h.relatedTarget,
                      T = h.handleObj
                    return (
                      (!x || (x !== w && !m.contains(w, x))) &&
                        ((h.type = T.origType), (v = T.handler.apply(this, arguments)), (h.type = c)),
                      v
                    )
                  }
                }
              }
            ),
            m.fn.extend({
              on: function (o, c, h, v) {
                return zi(this, o, c, h, v)
              },
              one: function (o, c, h, v) {
                return zi(this, o, c, h, v, 1)
              },
              off: function (o, c, h) {
                var v, w
                if (o && o.preventDefault && o.handleObj)
                  return (
                    (v = o.handleObj),
                    m(o.delegateTarget).off(
                      v.namespace ? v.origType + '.' + v.namespace : v.origType,
                      v.selector,
                      v.handler
                    ),
                    this
                  )
                if (typeof o == 'object') {
                  for (w in o) this.off(w, c, o[w])
                  return this
                }
                return (
                  (c === !1 || typeof c == 'function') && ((h = c), (c = void 0)),
                  h === !1 && (h = bi),
                  this.each(function () {
                    m.event.remove(this, o, h, c)
                  })
                )
              }
            }))
          var kr = /<script|<style|<link/i,
            us = /checked\s*(?:[^=]|=\s*.checked.)/i,
            ds = /^\s*<!\[CDATA\[|\]\]>\s*$/g
          function fs(o, c) {
            return (Ne(o, 'table') && Ne(c.nodeType !== 11 ? c : c.firstChild, 'tr') && m(o).children('tbody')[0]) || o
          }
          function Ta(o) {
            return ((o.type = (o.getAttribute('type') !== null) + '/' + o.type), o)
          }
          function gr(o) {
            return ((o.type || '').slice(0, 5) === 'true/' ? (o.type = o.type.slice(5)) : o.removeAttribute('type'), o)
          }
          function br(o, c) {
            var h, v, w, x, T, I, L
            if (c.nodeType === 1) {
              if (se.hasData(o) && ((x = se.get(o)), (L = x.events), L)) {
                se.remove(c, 'handle events')
                for (w in L) for (h = 0, v = L[w].length; h < v; h++) m.event.add(c, w, L[w][h])
              }
              Ve.hasData(o) && ((T = Ve.access(o)), (I = m.extend({}, T)), Ve.set(c, I))
            }
          }
          function yi(o, c) {
            var h = c.nodeName.toLowerCase()
            h === 'input' && vi.test(o.type)
              ? (c.checked = o.checked)
              : (h === 'input' || h === 'textarea') && (c.defaultValue = o.defaultValue)
          }
          function Mn(o, c, h, v) {
            c = a(c)
            var w,
              x,
              T,
              I,
              L,
              H,
              X = 0,
              Z = o.length,
              W = Z - 1,
              ce = c[0],
              Ze = k(ce)
            if (Ze || (Z > 1 && typeof ce == 'string' && !A.checkClone && us.test(ce)))
              return o.each(function (bt) {
                var et = o.eq(bt)
                ;(Ze && (c[0] = ce.call(this, bt, et.html())), Mn(et, c, h, v))
              })
            if (
              Z &&
              ((w = cs(c, o[0].ownerDocument, !1, o, v)),
              (x = w.firstChild),
              w.childNodes.length === 1 && (w = x),
              x || v)
            ) {
              for (T = m.map(Tn(w, 'script'), Ta), I = T.length; X < Z; X++)
                ((L = w), X !== W && ((L = m.clone(L, !0, !0)), I && m.merge(T, Tn(L, 'script'))), h.call(o[X], L, X))
              if (I)
                for (H = T[T.length - 1].ownerDocument, m.map(T, gr), X = 0; X < I; X++)
                  ((L = T[X]),
                    _o.test(L.type || '') &&
                      !se.access(L, 'globalEval') &&
                      m.contains(H, L) &&
                      (L.src && (L.type || '').toLowerCase() !== 'module'
                        ? m._evalUrl &&
                          !L.noModule &&
                          m._evalUrl(L.src, { nonce: L.nonce || L.getAttribute('nonce') }, H)
                        : z(L.textContent.replace(ds, ''), L, H)))
            }
            return o
          }
          function hs(o, c, h) {
            for (var v, w = c ? m.filter(c, o) : o, x = 0; (v = w[x]) != null; x++)
              (!h && v.nodeType === 1 && m.cleanData(Tn(v)),
                v.parentNode && (h && Yt(v) && ls(Tn(v, 'script')), v.parentNode.removeChild(v)))
            return o
          }
          ;(m.extend({
            htmlPrefilter: function (o) {
              return o
            },
            clone: function (o, c, h) {
              var v,
                w,
                x,
                T,
                I = o.cloneNode(!0),
                L = Yt(o)
              if (!A.noCloneChecked && (o.nodeType === 1 || o.nodeType === 11) && !m.isXMLDoc(o))
                for (T = Tn(I), x = Tn(o), v = 0, w = x.length; v < w; v++) yi(x[v], T[v])
              if (c)
                if (h) for (x = x || Tn(o), T = T || Tn(I), v = 0, w = x.length; v < w; v++) br(x[v], T[v])
                else br(o, I)
              return ((T = Tn(I, 'script')), T.length > 0 && ls(T, !L && Tn(o, 'script')), I)
            },
            cleanData: function (o) {
              for (var c, h, v, w = m.event.special, x = 0; (h = o[x]) !== void 0; x++)
                if (we(h)) {
                  if ((c = h[se.expando])) {
                    if (c.events) for (v in c.events) w[v] ? m.event.remove(h, v) : m.removeEvent(h, v, c.handle)
                    h[se.expando] = void 0
                  }
                  h[Ve.expando] && (h[Ve.expando] = void 0)
                }
            }
          }),
            m.fn.extend({
              detach: function (o) {
                return hs(this, o, !0)
              },
              remove: function (o) {
                return hs(this, o)
              },
              text: function (o) {
                return ge(
                  this,
                  function (c) {
                    return c === void 0
                      ? m.text(this)
                      : this.empty().each(function () {
                          ;(this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) &&
                            (this.textContent = c)
                        })
                  },
                  null,
                  o,
                  arguments.length
                )
              },
              append: function () {
                return Mn(this, arguments, function (o) {
                  if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var c = fs(this, o)
                    c.appendChild(o)
                  }
                })
              },
              prepend: function () {
                return Mn(this, arguments, function (o) {
                  if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var c = fs(this, o)
                    c.insertBefore(o, c.firstChild)
                  }
                })
              },
              before: function () {
                return Mn(this, arguments, function (o) {
                  this.parentNode && this.parentNode.insertBefore(o, this)
                })
              },
              after: function () {
                return Mn(this, arguments, function (o) {
                  this.parentNode && this.parentNode.insertBefore(o, this.nextSibling)
                })
              },
              empty: function () {
                for (var o, c = 0; (o = this[c]) != null; c++)
                  o.nodeType === 1 && (m.cleanData(Tn(o, !1)), (o.textContent = ''))
                return this
              },
              clone: function (o, c) {
                return (
                  (o = o ?? !1),
                  (c = c ?? o),
                  this.map(function () {
                    return m.clone(this, o, c)
                  })
                )
              },
              html: function (o) {
                return ge(
                  this,
                  function (c) {
                    var h = this[0] || {},
                      v = 0,
                      w = this.length
                    if (c === void 0 && h.nodeType === 1) return h.innerHTML
                    if (typeof c == 'string' && !kr.test(c) && !Ln[(as.exec(c) || ['', ''])[1].toLowerCase()]) {
                      c = m.htmlPrefilter(c)
                      try {
                        for (; v < w; v++)
                          ((h = this[v] || {}), h.nodeType === 1 && (m.cleanData(Tn(h, !1)), (h.innerHTML = c)))
                        h = 0
                      } catch {}
                    }
                    h && this.empty().append(c)
                  },
                  null,
                  o,
                  arguments.length
                )
              },
              replaceWith: function () {
                var o = []
                return Mn(
                  this,
                  arguments,
                  function (c) {
                    var h = this.parentNode
                    m.inArray(this, o) < 0 && (m.cleanData(Tn(this)), h && h.replaceChild(c, this))
                  },
                  o
                )
              }
            }),
            m.each(
              {
                appendTo: 'append',
                prependTo: 'prepend',
                insertBefore: 'before',
                insertAfter: 'after',
                replaceAll: 'replaceWith'
              },
              function (o, c) {
                m.fn[o] = function (h) {
                  for (var v, w = [], x = m(h), T = x.length - 1, I = 0; I <= T; I++)
                    ((v = I === T ? this : this.clone(!0)), m(x[I])[c](v), d.apply(w, v.get()))
                  return this.pushStack(w)
                }
              }
            ))
          var _i = new RegExp('^(' + bn + ')(?!px)[a-z%]+$', 'i'),
            Kr = /^--/,
            Xi = function (o) {
              var c = o.ownerDocument.defaultView
              return ((!c || !c.opener) && (c = t), c.getComputedStyle(o))
            },
            wo = function (o, c, h) {
              var v,
                w,
                x = {}
              for (w in c) ((x[w] = o.style[w]), (o.style[w] = c[w]))
              v = h.call(o)
              for (w in c) o.style[w] = x[w]
              return v
            },
            Vn = new RegExp(sn.join('|'), 'i')
          ;(function () {
            function o() {
              if (H) {
                ;((L.style.cssText = 'position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0'),
                  (H.style.cssText =
                    'position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%'),
                  Un.appendChild(L).appendChild(H))
                var X = t.getComputedStyle(H)
                ;((h = X.top !== '1%'),
                  (I = c(X.marginLeft) === 12),
                  (H.style.right = '60%'),
                  (x = c(X.right) === 36),
                  (v = c(X.width) === 36),
                  (H.style.position = 'absolute'),
                  (w = c(H.offsetWidth / 3) === 12),
                  Un.removeChild(L),
                  (H = null))
              }
            }
            function c(X) {
              return Math.round(parseFloat(X))
            }
            var h,
              v,
              w,
              x,
              T,
              I,
              L = N.createElement('div'),
              H = N.createElement('div')
            H.style &&
              ((H.style.backgroundClip = 'content-box'),
              (H.cloneNode(!0).style.backgroundClip = ''),
              (A.clearCloneStyle = H.style.backgroundClip === 'content-box'),
              m.extend(A, {
                boxSizingReliable: function () {
                  return (o(), v)
                },
                pixelBoxStyles: function () {
                  return (o(), x)
                },
                pixelPosition: function () {
                  return (o(), h)
                },
                reliableMarginLeft: function () {
                  return (o(), I)
                },
                scrollboxSize: function () {
                  return (o(), w)
                },
                reliableTrDimensions: function () {
                  var X, Z, W, ce
                  return (
                    T == null &&
                      ((X = N.createElement('table')),
                      (Z = N.createElement('tr')),
                      (W = N.createElement('div')),
                      (X.style.cssText = 'position:absolute;left:-11111px;border-collapse:separate'),
                      (Z.style.cssText = 'box-sizing:content-box;border:1px solid'),
                      (Z.style.height = '1px'),
                      (W.style.height = '9px'),
                      (W.style.display = 'block'),
                      Un.appendChild(X).appendChild(Z).appendChild(W),
                      (ce = t.getComputedStyle(Z)),
                      (T =
                        parseInt(ce.height, 10) +
                          parseInt(ce.borderTopWidth, 10) +
                          parseInt(ce.borderBottomWidth, 10) ===
                        Z.offsetHeight),
                      Un.removeChild(X)),
                    T
                  )
                }
              }))
          })()
          function pn(o, c, h) {
            var v,
              w,
              x,
              T,
              I = Kr.test(c),
              L = o.style
            return (
              (h = h || Xi(o)),
              h &&
                ((T = h.getPropertyValue(c) || h[c]),
                I && T && (T = T.replace(re, '$1') || void 0),
                T === '' && !Yt(o) && (T = m.style(o, c)),
                !A.pixelBoxStyles() &&
                  _i.test(T) &&
                  Vn.test(c) &&
                  ((v = L.width),
                  (w = L.minWidth),
                  (x = L.maxWidth),
                  (L.minWidth = L.maxWidth = L.width = T),
                  (T = h.width),
                  (L.width = v),
                  (L.minWidth = w),
                  (L.maxWidth = x))),
              T !== void 0 ? T + '' : T
            )
          }
          function yn(o, c) {
            return {
              get: function () {
                if (o()) {
                  delete this.get
                  return
                }
                return (this.get = c).apply(this, arguments)
              }
            }
          }
          var ps = ['Webkit', 'Moz', 'ms'],
            xo = N.createElement('div').style,
            Aa = {}
          function tc(o) {
            for (var c = o[0].toUpperCase() + o.slice(1), h = ps.length; h--; ) if (((o = ps[h] + c), o in xo)) return o
          }
          function ms(o) {
            var c = m.cssProps[o] || Aa[o]
            return c || (o in xo ? o : (Aa[o] = tc(o) || o))
          }
          var vs = /^(none|table(?!-c[ea]).+)/,
            Da = { position: 'absolute', visibility: 'hidden', display: 'block' },
            gs = { letterSpacing: '0', fontWeight: '400' }
          function ka(o, c, h) {
            var v = hn.exec(c)
            return v ? Math.max(0, v[2] - (h || 0)) + (v[3] || 'px') : c
          }
          function So(o, c, h, v, w, x) {
            var T = c === 'width' ? 1 : 0,
              I = 0,
              L = 0,
              H = 0
            if (h === (v ? 'border' : 'content')) return 0
            for (; T < 4; T += 2)
              (h === 'margin' && (H += m.css(o, h + sn[T], !0, w)),
                v
                  ? (h === 'content' && (L -= m.css(o, 'padding' + sn[T], !0, w)),
                    h !== 'margin' && (L -= m.css(o, 'border' + sn[T] + 'Width', !0, w)))
                  : ((L += m.css(o, 'padding' + sn[T], !0, w)),
                    h !== 'padding'
                      ? (L += m.css(o, 'border' + sn[T] + 'Width', !0, w))
                      : (I += m.css(o, 'border' + sn[T] + 'Width', !0, w))))
            return (
              !v &&
                x >= 0 &&
                (L += Math.max(0, Math.ceil(o['offset' + c[0].toUpperCase() + c.slice(1)] - x - L - I - 0.5)) || 0),
              L + H
            )
          }
          function bs(o, c, h) {
            var v = Xi(o),
              w = !A.boxSizingReliable() || h,
              x = w && m.css(o, 'boxSizing', !1, v) === 'border-box',
              T = x,
              I = pn(o, c, v),
              L = 'offset' + c[0].toUpperCase() + c.slice(1)
            if (_i.test(I)) {
              if (!h) return I
              I = 'auto'
            }
            return (
              ((!A.boxSizingReliable() && x) ||
                (!A.reliableTrDimensions() && Ne(o, 'tr')) ||
                I === 'auto' ||
                (!parseFloat(I) && m.css(o, 'display', !1, v) === 'inline')) &&
                o.getClientRects().length &&
                ((x = m.css(o, 'boxSizing', !1, v) === 'border-box'), (T = L in o), T && (I = o[L])),
              (I = parseFloat(I) || 0),
              I + So(o, c, h || (x ? 'border' : 'content'), T, v, I) + 'px'
            )
          }
          ;(m.extend({
            cssHooks: {
              opacity: {
                get: function (o, c) {
                  if (c) {
                    var h = pn(o, 'opacity')
                    return h === '' ? '1' : h
                  }
                }
              }
            },
            cssNumber: {
              animationIterationCount: !0,
              aspectRatio: !0,
              borderImageSlice: !0,
              columnCount: !0,
              flexGrow: !0,
              flexShrink: !0,
              fontWeight: !0,
              gridArea: !0,
              gridColumn: !0,
              gridColumnEnd: !0,
              gridColumnStart: !0,
              gridRow: !0,
              gridRowEnd: !0,
              gridRowStart: !0,
              lineHeight: !0,
              opacity: !0,
              order: !0,
              orphans: !0,
              scale: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0,
              fillOpacity: !0,
              floodOpacity: !0,
              stopOpacity: !0,
              strokeMiterlimit: !0,
              strokeOpacity: !0
            },
            cssProps: {},
            style: function (o, c, h, v) {
              if (!(!o || o.nodeType === 3 || o.nodeType === 8 || !o.style)) {
                var w,
                  x,
                  T,
                  I = Oe(c),
                  L = Kr.test(c),
                  H = o.style
                if ((L || (c = ms(I)), (T = m.cssHooks[c] || m.cssHooks[I]), h !== void 0)) {
                  if (
                    ((x = typeof h),
                    x === 'string' && (w = hn.exec(h)) && w[1] && ((h = xa(o, c, w)), (x = 'number')),
                    h == null || h !== h)
                  )
                    return
                  ;(x === 'number' && !L && (h += (w && w[3]) || (m.cssNumber[I] ? '' : 'px')),
                    !A.clearCloneStyle && h === '' && c.indexOf('background') === 0 && (H[c] = 'inherit'),
                    (!T || !('set' in T) || (h = T.set(o, h, v)) !== void 0) && (L ? H.setProperty(c, h) : (H[c] = h)))
                } else return T && 'get' in T && (w = T.get(o, !1, v)) !== void 0 ? w : H[c]
              }
            },
            css: function (o, c, h, v) {
              var w,
                x,
                T,
                I = Oe(c),
                L = Kr.test(c)
              return (
                L || (c = ms(I)),
                (T = m.cssHooks[c] || m.cssHooks[I]),
                T && 'get' in T && (w = T.get(o, !0, h)),
                w === void 0 && (w = pn(o, c, v)),
                w === 'normal' && c in gs && (w = gs[c]),
                h === '' || h ? ((x = parseFloat(w)), h === !0 || isFinite(x) ? x || 0 : w) : w
              )
            }
          }),
            m.each(['height', 'width'], function (o, c) {
              m.cssHooks[c] = {
                get: function (h, v, w) {
                  if (v)
                    return vs.test(m.css(h, 'display')) &&
                      (!h.getClientRects().length || !h.getBoundingClientRect().width)
                      ? wo(h, Da, function () {
                          return bs(h, c, w)
                        })
                      : bs(h, c, w)
                },
                set: function (h, v, w) {
                  var x,
                    T = Xi(h),
                    I = !A.scrollboxSize() && T.position === 'absolute',
                    L = I || w,
                    H = L && m.css(h, 'boxSizing', !1, T) === 'border-box',
                    X = w ? So(h, c, w, H, T) : 0
                  return (
                    H &&
                      I &&
                      (X -= Math.ceil(
                        h['offset' + c[0].toUpperCase() + c.slice(1)] -
                          parseFloat(T[c]) -
                          So(h, c, 'border', !1, T) -
                          0.5
                      )),
                    X && (x = hn.exec(v)) && (x[3] || 'px') !== 'px' && ((h.style[c] = v), (v = m.css(h, c))),
                    ka(h, v, X)
                  )
                }
              }
            }),
            (m.cssHooks.marginLeft = yn(A.reliableMarginLeft, function (o, c) {
              if (c)
                return (
                  (parseFloat(pn(o, 'marginLeft')) ||
                    o.getBoundingClientRect().left -
                      wo(o, { marginLeft: 0 }, function () {
                        return o.getBoundingClientRect().left
                      })) + 'px'
                )
            })),
            m.each({ margin: '', padding: '', border: 'Width' }, function (o, c) {
              ;((m.cssHooks[o + c] = {
                expand: function (h) {
                  for (var v = 0, w = {}, x = typeof h == 'string' ? h.split(' ') : [h]; v < 4; v++)
                    w[o + sn[v] + c] = x[v] || x[v - 2] || x[0]
                  return w
                }
              }),
                o !== 'margin' && (m.cssHooks[o + c].set = ka))
            }),
            m.fn.extend({
              css: function (o, c) {
                return ge(
                  this,
                  function (h, v, w) {
                    var x,
                      T,
                      I = {},
                      L = 0
                    if (Array.isArray(v)) {
                      for (x = Xi(h), T = v.length; L < T; L++) I[v[L]] = m.css(h, v[L], !1, x)
                      return I
                    }
                    return w !== void 0 ? m.style(h, v, w) : m.css(h, v)
                  },
                  o,
                  c,
                  arguments.length > 1
                )
              }
            }))
          function _n(o, c, h, v, w) {
            return new _n.prototype.init(o, c, h, v, w)
          }
          ;((m.Tween = _n),
            (_n.prototype = {
              constructor: _n,
              init: function (o, c, h, v, w, x) {
                ;((this.elem = o),
                  (this.prop = h),
                  (this.easing = w || m.easing._default),
                  (this.options = c),
                  (this.start = this.now = this.cur()),
                  (this.end = v),
                  (this.unit = x || (m.cssNumber[h] ? '' : 'px')))
              },
              cur: function () {
                var o = _n.propHooks[this.prop]
                return o && o.get ? o.get(this) : _n.propHooks._default.get(this)
              },
              run: function (o) {
                var c,
                  h = _n.propHooks[this.prop]
                return (
                  this.options.duration
                    ? (this.pos = c = m.easing[this.easing](o, this.options.duration * o, 0, 1, this.options.duration))
                    : (this.pos = c = o),
                  (this.now = (this.end - this.start) * c + this.start),
                  this.options.step && this.options.step.call(this.elem, this.now, this),
                  h && h.set ? h.set(this) : _n.propHooks._default.set(this),
                  this
                )
              }
            }),
            (_n.prototype.init.prototype = _n.prototype),
            (_n.propHooks = {
              _default: {
                get: function (o) {
                  var c
                  return o.elem.nodeType !== 1 || (o.elem[o.prop] != null && o.elem.style[o.prop] == null)
                    ? o.elem[o.prop]
                    : ((c = m.css(o.elem, o.prop, '')), !c || c === 'auto' ? 0 : c)
                },
                set: function (o) {
                  m.fx.step[o.prop]
                    ? m.fx.step[o.prop](o)
                    : o.elem.nodeType === 1 && (m.cssHooks[o.prop] || o.elem.style[ms(o.prop)] != null)
                      ? m.style(o.elem, o.prop, o.now + o.unit)
                      : (o.elem[o.prop] = o.now)
                }
              }
            }),
            (_n.propHooks.scrollTop = _n.propHooks.scrollLeft =
              {
                set: function (o) {
                  o.elem.nodeType && o.elem.parentNode && (o.elem[o.prop] = o.now)
                }
              }),
            (m.easing = {
              linear: function (o) {
                return o
              },
              swing: function (o) {
                return 0.5 - Math.cos(o * Math.PI) / 2
              },
              _default: 'swing'
            }),
            (m.fx = _n.prototype.init),
            (m.fx.step = {}))
          var Xr,
            Gi,
            ys = /^(?:toggle|show|hide)$/,
            nc = /queueHooks$/
          function Co() {
            Gi &&
              (N.hidden === !1 && t.requestAnimationFrame
                ? t.requestAnimationFrame(Co)
                : t.setTimeout(Co, m.fx.interval),
              m.fx.tick())
          }
          function ae() {
            return (
              t.setTimeout(function () {
                Xr = void 0
              }),
              (Xr = Date.now())
            )
          }
          function wi(o, c) {
            var h,
              v = 0,
              w = { height: o }
            for (c = c ? 1 : 0; v < 4; v += 2 - c) ((h = sn[v]), (w['margin' + h] = w['padding' + h] = o))
            return (c && (w.opacity = w.width = o), w)
          }
          function _s(o, c, h) {
            for (var v, w = (wn.tweeners[c] || []).concat(wn.tweeners['*']), x = 0, T = w.length; x < T; x++)
              if ((v = w[x].call(h, c, o))) return v
          }
          function ws(o, c, h) {
            var v,
              w,
              x,
              T,
              I,
              L,
              H,
              X,
              Z = 'width' in c || 'height' in c,
              W = this,
              ce = {},
              Ze = o.style,
              bt = o.nodeType && Wn(o),
              et = se.get(o, 'fxshow')
            h.queue ||
              ((T = m._queueHooks(o, 'fx')),
              T.unqueued == null &&
                ((T.unqueued = 0),
                (I = T.empty.fire),
                (T.empty.fire = function () {
                  T.unqueued || I()
                })),
              T.unqueued++,
              W.always(function () {
                W.always(function () {
                  ;(T.unqueued--, m.queue(o, 'fx').length || T.empty.fire())
                })
              }))
            for (v in c)
              if (((w = c[v]), ys.test(w))) {
                if ((delete c[v], (x = x || w === 'toggle'), w === (bt ? 'hide' : 'show')))
                  if (w === 'show' && et && et[v] !== void 0) bt = !0
                  else continue
                ce[v] = (et && et[v]) || m.style(o, v)
              }
            if (((L = !m.isEmptyObject(c)), !(!L && m.isEmptyObject(ce)))) {
              ;(Z &&
                o.nodeType === 1 &&
                ((h.overflow = [Ze.overflow, Ze.overflowX, Ze.overflowY]),
                (H = et && et.display),
                H == null && (H = se.get(o, 'display')),
                (X = m.css(o, 'display')),
                X === 'none' &&
                  (H ? (X = H) : (zr([o], !0), (H = o.style.display || H), (X = m.css(o, 'display')), zr([o]))),
                (X === 'inline' || (X === 'inline-block' && H != null)) &&
                  m.css(o, 'float') === 'none' &&
                  (L ||
                    (W.done(function () {
                      Ze.display = H
                    }),
                    H == null && ((X = Ze.display), (H = X === 'none' ? '' : X))),
                  (Ze.display = 'inline-block'))),
                h.overflow &&
                  ((Ze.overflow = 'hidden'),
                  W.always(function () {
                    ;((Ze.overflow = h.overflow[0]), (Ze.overflowX = h.overflow[1]), (Ze.overflowY = h.overflow[2]))
                  })),
                (L = !1))
              for (v in ce)
                (L ||
                  (et ? 'hidden' in et && (bt = et.hidden) : (et = se.access(o, 'fxshow', { display: H })),
                  x && (et.hidden = !bt),
                  bt && zr([o], !0),
                  W.done(function () {
                    ;(bt || zr([o]), se.remove(o, 'fxshow'))
                    for (v in ce) m.style(o, v, ce[v])
                  })),
                  (L = _s(bt ? et[v] : 0, v, W)),
                  v in et || ((et[v] = L.start), bt && ((L.end = L.start), (L.start = 0))))
            }
          }
          function yr(o, c) {
            var h, v, w, x, T
            for (h in o)
              if (
                ((v = Oe(h)),
                (w = c[v]),
                (x = o[h]),
                Array.isArray(x) && ((w = x[1]), (x = o[h] = x[0])),
                h !== v && ((o[v] = x), delete o[h]),
                (T = m.cssHooks[v]),
                T && 'expand' in T)
              ) {
                ;((x = T.expand(x)), delete o[v])
                for (h in x) h in o || ((o[h] = x[h]), (c[h] = w))
              } else c[v] = w
          }
          function wn(o, c, h) {
            var v,
              w,
              x = 0,
              T = wn.prefilters.length,
              I = m.Deferred().always(function () {
                delete L.elem
              }),
              L = function () {
                if (w) return !1
                for (
                  var Z = Xr || ae(),
                    W = Math.max(0, H.startTime + H.duration - Z),
                    ce = W / H.duration || 0,
                    Ze = 1 - ce,
                    bt = 0,
                    et = H.tweens.length;
                  bt < et;
                  bt++
                )
                  H.tweens[bt].run(Ze)
                return (
                  I.notifyWith(o, [H, Ze, W]),
                  Ze < 1 && et ? W : (et || I.notifyWith(o, [H, 1, 0]), I.resolveWith(o, [H]), !1)
                )
              },
              H = I.promise({
                elem: o,
                props: m.extend({}, c),
                opts: m.extend(!0, { specialEasing: {}, easing: m.easing._default }, h),
                originalProperties: c,
                originalOptions: h,
                startTime: Xr || ae(),
                duration: h.duration,
                tweens: [],
                createTween: function (Z, W) {
                  var ce = m.Tween(o, H.opts, Z, W, H.opts.specialEasing[Z] || H.opts.easing)
                  return (H.tweens.push(ce), ce)
                },
                stop: function (Z) {
                  var W = 0,
                    ce = Z ? H.tweens.length : 0
                  if (w) return this
                  for (w = !0; W < ce; W++) H.tweens[W].run(1)
                  return (Z ? (I.notifyWith(o, [H, 1, 0]), I.resolveWith(o, [H, Z])) : I.rejectWith(o, [H, Z]), this)
                }
              }),
              X = H.props
            for (yr(X, H.opts.specialEasing); x < T; x++)
              if (((v = wn.prefilters[x].call(H, o, X, H.opts)), v))
                return (k(v.stop) && (m._queueHooks(H.elem, H.opts.queue).stop = v.stop.bind(v)), v)
            return (
              m.map(X, _s, H),
              k(H.opts.start) && H.opts.start.call(o, H),
              H.progress(H.opts.progress).done(H.opts.done, H.opts.complete).fail(H.opts.fail).always(H.opts.always),
              m.fx.timer(m.extend(L, { elem: o, anim: H, queue: H.opts.queue })),
              H
            )
          }
          ;((m.Animation = m.extend(wn, {
            tweeners: {
              '*': [
                function (o, c) {
                  var h = this.createTween(o, c)
                  return (xa(h.elem, o, hn.exec(c), h), h)
                }
              ]
            },
            tweener: function (o, c) {
              k(o) ? ((c = o), (o = ['*'])) : (o = o.match(Ce))
              for (var h, v = 0, w = o.length; v < w; v++)
                ((h = o[v]), (wn.tweeners[h] = wn.tweeners[h] || []), wn.tweeners[h].unshift(c))
            },
            prefilters: [ws],
            prefilter: function (o, c) {
              c ? wn.prefilters.unshift(o) : wn.prefilters.push(o)
            }
          })),
            (m.speed = function (o, c, h) {
              var v =
                o && typeof o == 'object'
                  ? m.extend({}, o)
                  : { complete: h || (!h && c) || (k(o) && o), duration: o, easing: (h && c) || (c && !k(c) && c) }
              return (
                m.fx.off
                  ? (v.duration = 0)
                  : typeof v.duration != 'number' &&
                    (v.duration in m.fx.speeds
                      ? (v.duration = m.fx.speeds[v.duration])
                      : (v.duration = m.fx.speeds._default)),
                (v.queue == null || v.queue === !0) && (v.queue = 'fx'),
                (v.old = v.complete),
                (v.complete = function () {
                  ;(k(v.old) && v.old.call(this), v.queue && m.dequeue(this, v.queue))
                }),
                v
              )
            }),
            m.fn.extend({
              fadeTo: function (o, c, h, v) {
                return this.filter(Wn).css('opacity', 0).show().end().animate({ opacity: c }, o, h, v)
              },
              animate: function (o, c, h, v) {
                var w = m.isEmptyObject(o),
                  x = m.speed(c, h, v),
                  T = function () {
                    var I = wn(this, m.extend({}, o), x)
                    ;(w || se.get(this, 'finish')) && I.stop(!0)
                  }
                return ((T.finish = T), w || x.queue === !1 ? this.each(T) : this.queue(x.queue, T))
              },
              stop: function (o, c, h) {
                var v = function (w) {
                  var x = w.stop
                  ;(delete w.stop, x(h))
                }
                return (
                  typeof o != 'string' && ((h = c), (c = o), (o = void 0)),
                  c && this.queue(o || 'fx', []),
                  this.each(function () {
                    var w = !0,
                      x = o != null && o + 'queueHooks',
                      T = m.timers,
                      I = se.get(this)
                    if (x) I[x] && I[x].stop && v(I[x])
                    else for (x in I) I[x] && I[x].stop && nc.test(x) && v(I[x])
                    for (x = T.length; x--; )
                      T[x].elem === this &&
                        (o == null || T[x].queue === o) &&
                        (T[x].anim.stop(h), (w = !1), T.splice(x, 1))
                    ;(w || !h) && m.dequeue(this, o)
                  })
                )
              },
              finish: function (o) {
                return (
                  o !== !1 && (o = o || 'fx'),
                  this.each(function () {
                    var c,
                      h = se.get(this),
                      v = h[o + 'queue'],
                      w = h[o + 'queueHooks'],
                      x = m.timers,
                      T = v ? v.length : 0
                    for (h.finish = !0, m.queue(this, o, []), w && w.stop && w.stop.call(this, !0), c = x.length; c--; )
                      x[c].elem === this && x[c].queue === o && (x[c].anim.stop(!0), x.splice(c, 1))
                    for (c = 0; c < T; c++) v[c] && v[c].finish && v[c].finish.call(this)
                    delete h.finish
                  })
                )
              }
            }),
            m.each(['toggle', 'show', 'hide'], function (o, c) {
              var h = m.fn[c]
              m.fn[c] = function (v, w, x) {
                return v == null || typeof v == 'boolean' ? h.apply(this, arguments) : this.animate(wi(c, !0), v, w, x)
              }
            }),
            m.each(
              {
                slideDown: wi('show'),
                slideUp: wi('hide'),
                slideToggle: wi('toggle'),
                fadeIn: { opacity: 'show' },
                fadeOut: { opacity: 'hide' },
                fadeToggle: { opacity: 'toggle' }
              },
              function (o, c) {
                m.fn[o] = function (h, v, w) {
                  return this.animate(c, h, v, w)
                }
              }
            ),
            (m.timers = []),
            (m.fx.tick = function () {
              var o,
                c = 0,
                h = m.timers
              for (Xr = Date.now(); c < h.length; c++) ((o = h[c]), !o() && h[c] === o && h.splice(c--, 1))
              ;(h.length || m.fx.stop(), (Xr = void 0))
            }),
            (m.fx.timer = function (o) {
              ;(m.timers.push(o), m.fx.start())
            }),
            (m.fx.interval = 13),
            (m.fx.start = function () {
              Gi || ((Gi = !0), Co())
            }),
            (m.fx.stop = function () {
              Gi = null
            }),
            (m.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
            (m.fn.delay = function (o, c) {
              return (
                (o = (m.fx && m.fx.speeds[o]) || o),
                (c = c || 'fx'),
                this.queue(c, function (h, v) {
                  var w = t.setTimeout(h, o)
                  v.stop = function () {
                    t.clearTimeout(w)
                  }
                })
              )
            }),
            (function () {
              var o = N.createElement('input'),
                c = N.createElement('select'),
                h = c.appendChild(N.createElement('option'))
              ;((o.type = 'checkbox'),
                (A.checkOn = o.value !== ''),
                (A.optSelected = h.selected),
                (o = N.createElement('input')),
                (o.value = 't'),
                (o.type = 'radio'),
                (A.radioValue = o.value === 't'))
            })())
          var zn,
            Gr = m.expr.attrHandle
          ;(m.fn.extend({
            attr: function (o, c) {
              return ge(this, m.attr, o, c, arguments.length > 1)
            },
            removeAttr: function (o) {
              return this.each(function () {
                m.removeAttr(this, o)
              })
            }
          }),
            m.extend({
              attr: function (o, c, h) {
                var v,
                  w,
                  x = o.nodeType
                if (!(x === 3 || x === 8 || x === 2)) {
                  if (typeof o.getAttribute > 'u') return m.prop(o, c, h)
                  if (
                    ((x !== 1 || !m.isXMLDoc(o)) &&
                      (w = m.attrHooks[c.toLowerCase()] || (m.expr.match.bool.test(c) ? zn : void 0)),
                    h !== void 0)
                  ) {
                    if (h === null) {
                      m.removeAttr(o, c)
                      return
                    }
                    return w && 'set' in w && (v = w.set(o, h, c)) !== void 0 ? v : (o.setAttribute(c, h + ''), h)
                  }
                  return w && 'get' in w && (v = w.get(o, c)) !== null ? v : ((v = m.find.attr(o, c)), v ?? void 0)
                }
              },
              attrHooks: {
                type: {
                  set: function (o, c) {
                    if (!A.radioValue && c === 'radio' && Ne(o, 'input')) {
                      var h = o.value
                      return (o.setAttribute('type', c), h && (o.value = h), c)
                    }
                  }
                }
              },
              removeAttr: function (o, c) {
                var h,
                  v = 0,
                  w = c && c.match(Ce)
                if (w && o.nodeType === 1) for (; (h = w[v++]); ) o.removeAttribute(h)
              }
            }),
            (zn = {
              set: function (o, c, h) {
                return (c === !1 ? m.removeAttr(o, h) : o.setAttribute(h, h), h)
              }
            }),
            m.each(m.expr.match.bool.source.match(/\w+/g), function (o, c) {
              var h = Gr[c] || m.find.attr
              Gr[c] = function (v, w, x) {
                var T,
                  I,
                  L = w.toLowerCase()
                return (x || ((I = Gr[L]), (Gr[L] = T), (T = h(v, w, x) != null ? L : null), (Gr[L] = I)), T)
              }
            }))
          var Ue = /^(?:input|select|textarea|button)$/i,
            To = /^(?:a|area)$/i
          ;(m.fn.extend({
            prop: function (o, c) {
              return ge(this, m.prop, o, c, arguments.length > 1)
            },
            removeProp: function (o) {
              return this.each(function () {
                delete this[m.propFix[o] || o]
              })
            }
          }),
            m.extend({
              prop: function (o, c, h) {
                var v,
                  w,
                  x = o.nodeType
                if (!(x === 3 || x === 8 || x === 2))
                  return (
                    (x !== 1 || !m.isXMLDoc(o)) && ((c = m.propFix[c] || c), (w = m.propHooks[c])),
                    h !== void 0
                      ? w && 'set' in w && (v = w.set(o, h, c)) !== void 0
                        ? v
                        : (o[c] = h)
                      : w && 'get' in w && (v = w.get(o, c)) !== null
                        ? v
                        : o[c]
                  )
              },
              propHooks: {
                tabIndex: {
                  get: function (o) {
                    var c = m.find.attr(o, 'tabindex')
                    return c ? parseInt(c, 10) : Ue.test(o.nodeName) || (To.test(o.nodeName) && o.href) ? 0 : -1
                  }
                }
              },
              propFix: { for: 'htmlFor', class: 'className' }
            }),
            A.optSelected ||
              (m.propHooks.selected = {
                get: function (o) {
                  var c = o.parentNode
                  return (c && c.parentNode && c.parentNode.selectedIndex, null)
                },
                set: function (o) {
                  var c = o.parentNode
                  c && (c.selectedIndex, c.parentNode && c.parentNode.selectedIndex)
                }
              }),
            m.each(
              [
                'tabIndex',
                'readOnly',
                'maxLength',
                'cellSpacing',
                'cellPadding',
                'rowSpan',
                'colSpan',
                'useMap',
                'frameBorder',
                'contentEditable'
              ],
              function () {
                m.propFix[this.toLowerCase()] = this
              }
            ))
          function Er(o) {
            var c = o.match(Ce) || []
            return c.join(' ')
          }
          function Jr(o) {
            return (o.getAttribute && o.getAttribute('class')) || ''
          }
          function xs(o) {
            return Array.isArray(o) ? o : typeof o == 'string' ? o.match(Ce) || [] : []
          }
          m.fn.extend({
            addClass: function (o) {
              var c, h, v, w, x, T
              return k(o)
                ? this.each(function (I) {
                    m(this).addClass(o.call(this, I, Jr(this)))
                  })
                : ((c = xs(o)),
                  c.length
                    ? this.each(function () {
                        if (((v = Jr(this)), (h = this.nodeType === 1 && ' ' + Er(v) + ' '), h)) {
                          for (x = 0; x < c.length; x++) ((w = c[x]), h.indexOf(' ' + w + ' ') < 0 && (h += w + ' '))
                          ;((T = Er(h)), v !== T && this.setAttribute('class', T))
                        }
                      })
                    : this)
            },
            removeClass: function (o) {
              var c, h, v, w, x, T
              return k(o)
                ? this.each(function (I) {
                    m(this).removeClass(o.call(this, I, Jr(this)))
                  })
                : arguments.length
                  ? ((c = xs(o)),
                    c.length
                      ? this.each(function () {
                          if (((v = Jr(this)), (h = this.nodeType === 1 && ' ' + Er(v) + ' '), h)) {
                            for (x = 0; x < c.length; x++)
                              for (w = c[x]; h.indexOf(' ' + w + ' ') > -1; ) h = h.replace(' ' + w + ' ', ' ')
                            ;((T = Er(h)), v !== T && this.setAttribute('class', T))
                          }
                        })
                      : this)
                  : this.attr('class', '')
            },
            toggleClass: function (o, c) {
              var h,
                v,
                w,
                x,
                T = typeof o,
                I = T === 'string' || Array.isArray(o)
              return k(o)
                ? this.each(function (L) {
                    m(this).toggleClass(o.call(this, L, Jr(this), c), c)
                  })
                : typeof c == 'boolean' && I
                  ? c
                    ? this.addClass(o)
                    : this.removeClass(o)
                  : ((h = xs(o)),
                    this.each(function () {
                      if (I)
                        for (x = m(this), w = 0; w < h.length; w++)
                          ((v = h[w]), x.hasClass(v) ? x.removeClass(v) : x.addClass(v))
                      else
                        (o === void 0 || T === 'boolean') &&
                          ((v = Jr(this)),
                          v && se.set(this, '__className__', v),
                          this.setAttribute &&
                            this.setAttribute('class', v || o === !1 ? '' : se.get(this, '__className__') || ''))
                    }))
            },
            hasClass: function (o) {
              var c,
                h,
                v = 0
              for (c = ' ' + o + ' '; (h = this[v++]); )
                if (h.nodeType === 1 && (' ' + Er(Jr(h)) + ' ').indexOf(c) > -1) return !0
              return !1
            }
          })
          var xi = /\r/g
          ;(m.fn.extend({
            val: function (o) {
              var c,
                h,
                v,
                w = this[0]
              return arguments.length
                ? ((v = k(o)),
                  this.each(function (x) {
                    var T
                    this.nodeType === 1 &&
                      (v ? (T = o.call(this, x, m(this).val())) : (T = o),
                      T == null
                        ? (T = '')
                        : typeof T == 'number'
                          ? (T += '')
                          : Array.isArray(T) &&
                            (T = m.map(T, function (I) {
                              return I == null ? '' : I + ''
                            })),
                      (c = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()]),
                      (!c || !('set' in c) || c.set(this, T, 'value') === void 0) && (this.value = T))
                  }))
                : w
                  ? ((c = m.valHooks[w.type] || m.valHooks[w.nodeName.toLowerCase()]),
                    c && 'get' in c && (h = c.get(w, 'value')) !== void 0
                      ? h
                      : ((h = w.value), typeof h == 'string' ? h.replace(xi, '') : (h ?? '')))
                  : void 0
            }
          }),
            m.extend({
              valHooks: {
                option: {
                  get: function (o) {
                    var c = m.find.attr(o, 'value')
                    return c ?? Er(m.text(o))
                  }
                },
                select: {
                  get: function (o) {
                    var c,
                      h,
                      v,
                      w = o.options,
                      x = o.selectedIndex,
                      T = o.type === 'select-one',
                      I = T ? null : [],
                      L = T ? x + 1 : w.length
                    for (x < 0 ? (v = L) : (v = T ? x : 0); v < L; v++)
                      if (
                        ((h = w[v]),
                        (h.selected || v === x) &&
                          !h.disabled &&
                          (!h.parentNode.disabled || !Ne(h.parentNode, 'optgroup')))
                      ) {
                        if (((c = m(h).val()), T)) return c
                        I.push(c)
                      }
                    return I
                  },
                  set: function (o, c) {
                    for (var h, v, w = o.options, x = m.makeArray(c), T = w.length; T--; )
                      ((v = w[T]), (v.selected = m.inArray(m.valHooks.option.get(v), x) > -1) && (h = !0))
                    return (h || (o.selectedIndex = -1), x)
                  }
                }
              }
            }),
            m.each(['radio', 'checkbox'], function () {
              ;((m.valHooks[this] = {
                set: function (o, c) {
                  if (Array.isArray(c)) return (o.checked = m.inArray(m(o).val(), c) > -1)
                }
              }),
                A.checkOn ||
                  (m.valHooks[this].get = function (o) {
                    return o.getAttribute('value') === null ? 'on' : o.value
                  }))
            }))
          var Si = t.location,
            Yr = { guid: Date.now() },
            Or = /\?/
          m.parseXML = function (o) {
            var c, h
            if (!o || typeof o != 'string') return null
            try {
              c = new t.DOMParser().parseFromString(o, 'text/xml')
            } catch {}
            return (
              (h = c && c.getElementsByTagName('parsererror')[0]),
              (!c || h) &&
                m.error(
                  'Invalid XML: ' +
                    (h
                      ? m.map(h.childNodes, function (v) {
                          return v.textContent
                        }).join(`
`)
                      : o)
                ),
              c
            )
          }
          var Ea = /^(?:focusinfocus|focusoutblur)$/,
            Oa = function (o) {
              o.stopPropagation()
            }
          ;(m.extend(m.event, {
            trigger: function (o, c, h, v) {
              var w,
                x,
                T,
                I,
                L,
                H,
                X,
                Z,
                W = [h || N],
                ce = y.call(o, 'type') ? o.type : o,
                Ze = y.call(o, 'namespace') ? o.namespace.split('.') : []
              if (
                ((x = Z = T = h = h || N),
                !(h.nodeType === 3 || h.nodeType === 8) &&
                  !Ea.test(ce + m.event.triggered) &&
                  (ce.indexOf('.') > -1 && ((Ze = ce.split('.')), (ce = Ze.shift()), Ze.sort()),
                  (L = ce.indexOf(':') < 0 && 'on' + ce),
                  (o = o[m.expando] ? o : new m.Event(ce, typeof o == 'object' && o)),
                  (o.isTrigger = v ? 2 : 3),
                  (o.namespace = Ze.join('.')),
                  (o.rnamespace = o.namespace ? new RegExp('(^|\\.)' + Ze.join('\\.(?:.*\\.|)') + '(\\.|$)') : null),
                  (o.result = void 0),
                  o.target || (o.target = h),
                  (c = c == null ? [o] : m.makeArray(c, [o])),
                  (X = m.event.special[ce] || {}),
                  !(!v && X.trigger && X.trigger.apply(h, c) === !1)))
              ) {
                if (!v && !X.noBubble && !F(h)) {
                  for (I = X.delegateType || ce, Ea.test(I + ce) || (x = x.parentNode); x; x = x.parentNode)
                    (W.push(x), (T = x))
                  T === (h.ownerDocument || N) && W.push(T.defaultView || T.parentWindow || t)
                }
                for (w = 0; (x = W[w++]) && !o.isPropagationStopped(); )
                  ((Z = x),
                    (o.type = w > 1 ? I : X.bindType || ce),
                    (H = (se.get(x, 'events') || Object.create(null))[o.type] && se.get(x, 'handle')),
                    H && H.apply(x, c),
                    (H = L && x[L]),
                    H && H.apply && we(x) && ((o.result = H.apply(x, c)), o.result === !1 && o.preventDefault()))
                return (
                  (o.type = ce),
                  !v &&
                    !o.isDefaultPrevented() &&
                    (!X._default || X._default.apply(W.pop(), c) === !1) &&
                    we(h) &&
                    L &&
                    k(h[ce]) &&
                    !F(h) &&
                    ((T = h[L]),
                    T && (h[L] = null),
                    (m.event.triggered = ce),
                    o.isPropagationStopped() && Z.addEventListener(ce, Oa),
                    h[ce](),
                    o.isPropagationStopped() && Z.removeEventListener(ce, Oa),
                    (m.event.triggered = void 0),
                    T && (h[L] = T)),
                  o.result
                )
              }
            },
            simulate: function (o, c, h) {
              var v = m.extend(new m.Event(), h, { type: o, isSimulated: !0 })
              m.event.trigger(v, null, c)
            }
          }),
            m.fn.extend({
              trigger: function (o, c) {
                return this.each(function () {
                  m.event.trigger(o, c, this)
                })
              },
              triggerHandler: function (o, c) {
                var h = this[0]
                if (h) return m.event.trigger(o, c, h, !0)
              }
            }))
          var rc = /\[\]$/,
            Pa = /\r?\n/g,
            ic = /^(?:submit|button|image|reset|file)$/i,
            oc = /^(?:input|select|textarea|keygen)/i
          function Ss(o, c, h, v) {
            var w
            if (Array.isArray(c))
              m.each(c, function (x, T) {
                h || rc.test(o) ? v(o, T) : Ss(o + '[' + (typeof T == 'object' && T != null ? x : '') + ']', T, h, v)
              })
            else if (!h && Y(c) === 'object') for (w in c) Ss(o + '[' + w + ']', c[w], h, v)
            else v(o, c)
          }
          ;((m.param = function (o, c) {
            var h,
              v = [],
              w = function (x, T) {
                var I = k(T) ? T() : T
                v[v.length] = encodeURIComponent(x) + '=' + encodeURIComponent(I ?? '')
              }
            if (o == null) return ''
            if (Array.isArray(o) || (o.jquery && !m.isPlainObject(o)))
              m.each(o, function () {
                w(this.name, this.value)
              })
            else for (h in o) Ss(h, o[h], c, w)
            return v.join('&')
          }),
            m.fn.extend({
              serialize: function () {
                return m.param(this.serializeArray())
              },
              serializeArray: function () {
                return this.map(function () {
                  var o = m.prop(this, 'elements')
                  return o ? m.makeArray(o) : this
                })
                  .filter(function () {
                    var o = this.type
                    return (
                      this.name &&
                      !m(this).is(':disabled') &&
                      oc.test(this.nodeName) &&
                      !ic.test(o) &&
                      (this.checked || !vi.test(o))
                    )
                  })
                  .map(function (o, c) {
                    var h = m(this).val()
                    return h == null
                      ? null
                      : Array.isArray(h)
                        ? m.map(h, function (v) {
                            return {
                              name: c.name,
                              value: v.replace(
                                Pa,
                                `\r
`
                              )
                            }
                          })
                        : {
                            name: c.name,
                            value: h.replace(
                              Pa,
                              `\r
`
                            )
                          }
                  })
                  .get()
              }
            }))
          var Ao = /%20/g,
            Pr = /#.*$/,
            Ra = /([?&])_=[^&]*/,
            sc = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            ac = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Ji = /^(?:GET|HEAD)$/,
            Ci = /^\/\//,
            Qr = {},
            Ti = {},
            La = '*/'.concat('*'),
            Yi = N.createElement('a')
          Yi.href = Si.href
          function Ma(o) {
            return function (c, h) {
              typeof c != 'string' && ((h = c), (c = '*'))
              var v,
                w = 0,
                x = c.toLowerCase().match(Ce) || []
              if (k(h))
                for (; (v = x[w++]); )
                  v[0] === '+' ? ((v = v.slice(1) || '*'), (o[v] = o[v] || []).unshift(h)) : (o[v] = o[v] || []).push(h)
            }
          }
          function Ia(o, c, h, v) {
            var w = {},
              x = o === Ti
            function T(I) {
              var L
              return (
                (w[I] = !0),
                m.each(o[I] || [], function (H, X) {
                  var Z = X(c, h, v)
                  if (typeof Z == 'string' && !x && !w[Z]) return (c.dataTypes.unshift(Z), T(Z), !1)
                  if (x) return !(L = Z)
                }),
                L
              )
            }
            return T(c.dataTypes[0]) || (!w['*'] && T('*'))
          }
          function Cs(o, c) {
            var h,
              v,
              w = m.ajaxSettings.flatOptions || {}
            for (h in c) c[h] !== void 0 && ((w[h] ? o : v || (v = {}))[h] = c[h])
            return (v && m.extend(!0, o, v), o)
          }
          function lc(o, c, h) {
            for (var v, w, x, T, I = o.contents, L = o.dataTypes; L[0] === '*'; )
              (L.shift(), v === void 0 && (v = o.mimeType || c.getResponseHeader('Content-Type')))
            if (v) {
              for (w in I)
                if (I[w] && I[w].test(v)) {
                  L.unshift(w)
                  break
                }
            }
            if (L[0] in h) x = L[0]
            else {
              for (w in h) {
                if (!L[0] || o.converters[w + ' ' + L[0]]) {
                  x = w
                  break
                }
                T || (T = w)
              }
              x = x || T
            }
            if (x) return (x !== L[0] && L.unshift(x), h[x])
          }
          function cc(o, c, h, v) {
            var w,
              x,
              T,
              I,
              L,
              H = {},
              X = o.dataTypes.slice()
            if (X[1]) for (T in o.converters) H[T.toLowerCase()] = o.converters[T]
            for (x = X.shift(); x; )
              if (
                (o.responseFields[x] && (h[o.responseFields[x]] = c),
                !L && v && o.dataFilter && (c = o.dataFilter(c, o.dataType)),
                (L = x),
                (x = X.shift()),
                x)
              ) {
                if (x === '*') x = L
                else if (L !== '*' && L !== x) {
                  if (((T = H[L + ' ' + x] || H['* ' + x]), !T)) {
                    for (w in H)
                      if (((I = w.split(' ')), I[1] === x && ((T = H[L + ' ' + I[0]] || H['* ' + I[0]]), T))) {
                        T === !0 ? (T = H[w]) : H[w] !== !0 && ((x = I[0]), X.unshift(I[1]))
                        break
                      }
                  }
                  if (T !== !0)
                    if (T && o.throws) c = T(c)
                    else
                      try {
                        c = T(c)
                      } catch (Z) {
                        return { state: 'parsererror', error: T ? Z : 'No conversion from ' + L + ' to ' + x }
                      }
                }
              }
            return { state: 'success', data: c }
          }
          ;(m.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
              url: Si.href,
              type: 'GET',
              isLocal: ac.test(Si.protocol),
              global: !0,
              processData: !0,
              async: !0,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              accepts: {
                '*': La,
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript'
              },
              contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
              responseFields: { xml: 'responseXML', text: 'responseText', json: 'responseJSON' },
              converters: { '* text': String, 'text html': !0, 'text json': JSON.parse, 'text xml': m.parseXML },
              flatOptions: { url: !0, context: !0 }
            },
            ajaxSetup: function (o, c) {
              return c ? Cs(Cs(o, m.ajaxSettings), c) : Cs(m.ajaxSettings, o)
            },
            ajaxPrefilter: Ma(Qr),
            ajaxTransport: Ma(Ti),
            ajax: function (o, c) {
              ;(typeof o == 'object' && ((c = o), (o = void 0)), (c = c || {}))
              var h,
                v,
                w,
                x,
                T,
                I,
                L,
                H,
                X,
                Z,
                W = m.ajaxSetup({}, c),
                ce = W.context || W,
                Ze = W.context && (ce.nodeType || ce.jquery) ? m(ce) : m.event,
                bt = m.Deferred(),
                et = m.Callbacks('once memory'),
                un = W.statusCode || {},
                Ht = {},
                Kn = {},
                cr = 'canceled',
                pt = {
                  readyState: 0,
                  getResponseHeader: function (_t) {
                    var Jt
                    if (L) {
                      if (!x)
                        for (x = {}; (Jt = sc.exec(w)); )
                          x[Jt[1].toLowerCase() + ' '] = (x[Jt[1].toLowerCase() + ' '] || []).concat(Jt[2])
                      Jt = x[_t.toLowerCase() + ' ']
                    }
                    return Jt == null ? null : Jt.join(', ')
                  },
                  getAllResponseHeaders: function () {
                    return L ? w : null
                  },
                  setRequestHeader: function (_t, Jt) {
                    return (
                      L == null && ((_t = Kn[_t.toLowerCase()] = Kn[_t.toLowerCase()] || _t), (Ht[_t] = Jt)),
                      this
                    )
                  },
                  overrideMimeType: function (_t) {
                    return (L == null && (W.mimeType = _t), this)
                  },
                  statusCode: function (_t) {
                    var Jt
                    if (_t)
                      if (L) pt.always(_t[pt.status])
                      else for (Jt in _t) un[Jt] = [un[Jt], _t[Jt]]
                    return this
                  },
                  abort: function (_t) {
                    var Jt = _t || cr
                    return (h && h.abort(Jt), Zr(0, Jt), this)
                  }
                }
              if (
                (bt.promise(pt),
                (W.url = ((o || W.url || Si.href) + '').replace(Ci, Si.protocol + '//')),
                (W.type = c.method || c.type || W.method || W.type),
                (W.dataTypes = (W.dataType || '*').toLowerCase().match(Ce) || ['']),
                W.crossDomain == null)
              ) {
                I = N.createElement('a')
                try {
                  ;((I.href = W.url),
                    (I.href = I.href),
                    (W.crossDomain = Yi.protocol + '//' + Yi.host != I.protocol + '//' + I.host))
                } catch {
                  W.crossDomain = !0
                }
              }
              if (
                (W.data && W.processData && typeof W.data != 'string' && (W.data = m.param(W.data, W.traditional)),
                Ia(Qr, W, c, pt),
                L)
              )
                return pt
              ;((H = m.event && W.global),
                H && m.active++ === 0 && m.event.trigger('ajaxStart'),
                (W.type = W.type.toUpperCase()),
                (W.hasContent = !Ji.test(W.type)),
                (v = W.url.replace(Pr, '')),
                W.hasContent
                  ? W.data &&
                    W.processData &&
                    (W.contentType || '').indexOf('application/x-www-form-urlencoded') === 0 &&
                    (W.data = W.data.replace(Ao, '+'))
                  : ((Z = W.url.slice(v.length)),
                    W.data &&
                      (W.processData || typeof W.data == 'string') &&
                      ((v += (Or.test(v) ? '&' : '?') + W.data), delete W.data),
                    W.cache === !1 &&
                      ((v = v.replace(Ra, '$1')), (Z = (Or.test(v) ? '&' : '?') + '_=' + Yr.guid++ + Z)),
                    (W.url = v + Z)),
                W.ifModified &&
                  (m.lastModified[v] && pt.setRequestHeader('If-Modified-Since', m.lastModified[v]),
                  m.etag[v] && pt.setRequestHeader('If-None-Match', m.etag[v])),
                ((W.data && W.hasContent && W.contentType !== !1) || c.contentType) &&
                  pt.setRequestHeader('Content-Type', W.contentType),
                pt.setRequestHeader(
                  'Accept',
                  W.dataTypes[0] && W.accepts[W.dataTypes[0]]
                    ? W.accepts[W.dataTypes[0]] + (W.dataTypes[0] !== '*' ? ', ' + La + '; q=0.01' : '')
                    : W.accepts['*']
                ))
              for (X in W.headers) pt.setRequestHeader(X, W.headers[X])
              if (W.beforeSend && (W.beforeSend.call(ce, pt, W) === !1 || L)) return pt.abort()
              if (
                ((cr = 'abort'), et.add(W.complete), pt.done(W.success), pt.fail(W.error), (h = Ia(Ti, W, c, pt)), !h)
              )
                Zr(-1, 'No Transport')
              else {
                if (((pt.readyState = 1), H && Ze.trigger('ajaxSend', [pt, W]), L)) return pt
                W.async &&
                  W.timeout > 0 &&
                  (T = t.setTimeout(function () {
                    pt.abort('timeout')
                  }, W.timeout))
                try {
                  ;((L = !1), h.send(Ht, Zr))
                } catch (_t) {
                  if (L) throw _t
                  Zr(-1, _t)
                }
              }
              function Zr(_t, Jt, Zi, ko) {
                var tr,
                  eo,
                  xn,
                  An,
                  Rr,
                  Sn = Jt
                L ||
                  ((L = !0),
                  T && t.clearTimeout(T),
                  (h = void 0),
                  (w = ko || ''),
                  (pt.readyState = _t > 0 ? 4 : 0),
                  (tr = (_t >= 200 && _t < 300) || _t === 304),
                  Zi && (An = lc(W, pt, Zi)),
                  !tr &&
                    m.inArray('script', W.dataTypes) > -1 &&
                    m.inArray('json', W.dataTypes) < 0 &&
                    (W.converters['text script'] = function () {}),
                  (An = cc(W, An, pt, tr)),
                  tr
                    ? (W.ifModified &&
                        ((Rr = pt.getResponseHeader('Last-Modified')),
                        Rr && (m.lastModified[v] = Rr),
                        (Rr = pt.getResponseHeader('etag')),
                        Rr && (m.etag[v] = Rr)),
                      _t === 204 || W.type === 'HEAD'
                        ? (Sn = 'nocontent')
                        : _t === 304
                          ? (Sn = 'notmodified')
                          : ((Sn = An.state), (eo = An.data), (xn = An.error), (tr = !xn)))
                    : ((xn = Sn), (_t || !Sn) && ((Sn = 'error'), _t < 0 && (_t = 0))),
                  (pt.status = _t),
                  (pt.statusText = (Jt || Sn) + ''),
                  tr ? bt.resolveWith(ce, [eo, Sn, pt]) : bt.rejectWith(ce, [pt, Sn, xn]),
                  pt.statusCode(un),
                  (un = void 0),
                  H && Ze.trigger(tr ? 'ajaxSuccess' : 'ajaxError', [pt, W, tr ? eo : xn]),
                  et.fireWith(ce, [pt, Sn]),
                  H && (Ze.trigger('ajaxComplete', [pt, W]), --m.active || m.event.trigger('ajaxStop')))
              }
              return pt
            },
            getJSON: function (o, c, h) {
              return m.get(o, c, h, 'json')
            },
            getScript: function (o, c) {
              return m.get(o, void 0, c, 'script')
            }
          }),
            m.each(['get', 'post'], function (o, c) {
              m[c] = function (h, v, w, x) {
                return (
                  k(v) && ((x = x || w), (w = v), (v = void 0)),
                  m.ajax(m.extend({ url: h, type: c, dataType: x, data: v, success: w }, m.isPlainObject(h) && h))
                )
              }
            }),
            m.ajaxPrefilter(function (o) {
              var c
              for (c in o.headers) c.toLowerCase() === 'content-type' && (o.contentType = o.headers[c] || '')
            }),
            (m._evalUrl = function (o, c, h) {
              return m.ajax({
                url: o,
                type: 'GET',
                dataType: 'script',
                cache: !0,
                async: !1,
                global: !1,
                converters: { 'text script': function () {} },
                dataFilter: function (v) {
                  m.globalEval(v, c, h)
                }
              })
            }),
            m.fn.extend({
              wrapAll: function (o) {
                var c
                return (
                  this[0] &&
                    (k(o) && (o = o.call(this[0])),
                    (c = m(o, this[0].ownerDocument).eq(0).clone(!0)),
                    this[0].parentNode && c.insertBefore(this[0]),
                    c
                      .map(function () {
                        for (var h = this; h.firstElementChild; ) h = h.firstElementChild
                        return h
                      })
                      .append(this)),
                  this
                )
              },
              wrapInner: function (o) {
                return k(o)
                  ? this.each(function (c) {
                      m(this).wrapInner(o.call(this, c))
                    })
                  : this.each(function () {
                      var c = m(this),
                        h = c.contents()
                      h.length ? h.wrapAll(o) : c.append(o)
                    })
              },
              wrap: function (o) {
                var c = k(o)
                return this.each(function (h) {
                  m(this).wrapAll(c ? o.call(this, h) : o)
                })
              },
              unwrap: function (o) {
                return (
                  this.parent(o)
                    .not('body')
                    .each(function () {
                      m(this).replaceWith(this.childNodes)
                    }),
                  this
                )
              }
            }),
            (m.expr.pseudos.hidden = function (o) {
              return !m.expr.pseudos.visible(o)
            }),
            (m.expr.pseudos.visible = function (o) {
              return !!(o.offsetWidth || o.offsetHeight || o.getClientRects().length)
            }),
            (m.ajaxSettings.xhr = function () {
              try {
                return new t.XMLHttpRequest()
              } catch {}
            }))
          var uc = { 0: 200, 1223: 204 },
            Ai = m.ajaxSettings.xhr()
          ;((A.cors = !!Ai && 'withCredentials' in Ai),
            (A.ajax = Ai = !!Ai),
            m.ajaxTransport(function (o) {
              var c, h
              if (A.cors || (Ai && !o.crossDomain))
                return {
                  send: function (v, w) {
                    var x,
                      T = o.xhr()
                    if ((T.open(o.type, o.url, o.async, o.username, o.password), o.xhrFields))
                      for (x in o.xhrFields) T[x] = o.xhrFields[x]
                    ;(o.mimeType && T.overrideMimeType && T.overrideMimeType(o.mimeType),
                      !o.crossDomain && !v['X-Requested-With'] && (v['X-Requested-With'] = 'XMLHttpRequest'))
                    for (x in v) T.setRequestHeader(x, v[x])
                    ;((c = function (I) {
                      return function () {
                        c &&
                          ((c = h = T.onload = T.onerror = T.onabort = T.ontimeout = T.onreadystatechange = null),
                          I === 'abort'
                            ? T.abort()
                            : I === 'error'
                              ? typeof T.status != 'number'
                                ? w(0, 'error')
                                : w(T.status, T.statusText)
                              : w(
                                  uc[T.status] || T.status,
                                  T.statusText,
                                  (T.responseType || 'text') !== 'text' || typeof T.responseText != 'string'
                                    ? { binary: T.response }
                                    : { text: T.responseText },
                                  T.getAllResponseHeaders()
                                ))
                      }
                    }),
                      (T.onload = c()),
                      (h = T.onerror = T.ontimeout = c('error')),
                      T.onabort !== void 0
                        ? (T.onabort = h)
                        : (T.onreadystatechange = function () {
                            T.readyState === 4 &&
                              t.setTimeout(function () {
                                c && h()
                              })
                          }),
                      (c = c('abort')))
                    try {
                      T.send((o.hasContent && o.data) || null)
                    } catch (I) {
                      if (c) throw I
                    }
                  },
                  abort: function () {
                    c && c()
                  }
                }
            }),
            m.ajaxPrefilter(function (o) {
              o.crossDomain && (o.contents.script = !1)
            }),
            m.ajaxSetup({
              accepts: {
                script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
              },
              contents: { script: /\b(?:java|ecma)script\b/ },
              converters: {
                'text script': function (o) {
                  return (m.globalEval(o), o)
                }
              }
            }),
            m.ajaxPrefilter('script', function (o) {
              ;(o.cache === void 0 && (o.cache = !1), o.crossDomain && (o.type = 'GET'))
            }),
            m.ajaxTransport('script', function (o) {
              if (o.crossDomain || o.scriptAttrs) {
                var c, h
                return {
                  send: function (v, w) {
                    ;((c = m('<script>')
                      .attr(o.scriptAttrs || {})
                      .prop({ charset: o.scriptCharset, src: o.url })
                      .on(
                        'load error',
                        (h = function (x) {
                          ;(c.remove(), (h = null), x && w(x.type === 'error' ? 404 : 200, x.type))
                        })
                      )),
                      N.head.appendChild(c[0]))
                  },
                  abort: function () {
                    h && h()
                  }
                }
              }
            }))
          var Qi = [],
            Do = /(=)\?(?=&|$)|\?\?/
          ;(m.ajaxSetup({
            jsonp: 'callback',
            jsonpCallback: function () {
              var o = Qi.pop() || m.expando + '_' + Yr.guid++
              return ((this[o] = !0), o)
            }
          }),
            m.ajaxPrefilter('json jsonp', function (o, c, h) {
              var v,
                w,
                x,
                T =
                  o.jsonp !== !1 &&
                  (Do.test(o.url)
                    ? 'url'
                    : typeof o.data == 'string' &&
                      (o.contentType || '').indexOf('application/x-www-form-urlencoded') === 0 &&
                      Do.test(o.data) &&
                      'data')
              if (T || o.dataTypes[0] === 'jsonp')
                return (
                  (v = o.jsonpCallback = k(o.jsonpCallback) ? o.jsonpCallback() : o.jsonpCallback),
                  T
                    ? (o[T] = o[T].replace(Do, '$1' + v))
                    : o.jsonp !== !1 && (o.url += (Or.test(o.url) ? '&' : '?') + o.jsonp + '=' + v),
                  (o.converters['script json'] = function () {
                    return (x || m.error(v + ' was not called'), x[0])
                  }),
                  (o.dataTypes[0] = 'json'),
                  (w = t[v]),
                  (t[v] = function () {
                    x = arguments
                  }),
                  h.always(function () {
                    ;(w === void 0 ? m(t).removeProp(v) : (t[v] = w),
                      o[v] && ((o.jsonpCallback = c.jsonpCallback), Qi.push(v)),
                      x && k(w) && w(x[0]),
                      (x = w = void 0))
                  }),
                  'script'
                )
            }),
            (A.createHTMLDocument = (function () {
              var o = N.implementation.createHTMLDocument('').body
              return ((o.innerHTML = '<form></form><form></form>'), o.childNodes.length === 2)
            })()),
            (m.parseHTML = function (o, c, h) {
              if (typeof o != 'string') return []
              typeof c == 'boolean' && ((h = c), (c = !1))
              var v, w, x
              return (
                c ||
                  (A.createHTMLDocument
                    ? ((c = N.implementation.createHTMLDocument('')),
                      (v = c.createElement('base')),
                      (v.href = N.location.href),
                      c.head.appendChild(v))
                    : (c = N)),
                (w = Tt.exec(o)),
                (x = !h && []),
                w
                  ? [c.createElement(w[1])]
                  : ((w = cs([o], c, x)), x && x.length && m(x).remove(), m.merge([], w.childNodes))
              )
            }),
            (m.fn.load = function (o, c, h) {
              var v,
                w,
                x,
                T = this,
                I = o.indexOf(' ')
              return (
                I > -1 && ((v = Er(o.slice(I))), (o = o.slice(0, I))),
                k(c) ? ((h = c), (c = void 0)) : c && typeof c == 'object' && (w = 'POST'),
                T.length > 0 &&
                  m
                    .ajax({ url: o, type: w || 'GET', dataType: 'html', data: c })
                    .done(function (L) {
                      ;((x = arguments), T.html(v ? m('<div>').append(m.parseHTML(L)).find(v) : L))
                    })
                    .always(
                      h &&
                        function (L, H) {
                          T.each(function () {
                            h.apply(this, x || [L.responseText, H, L])
                          })
                        }
                    ),
                this
              )
            }),
            (m.expr.pseudos.animated = function (o) {
              return m.grep(m.timers, function (c) {
                return o === c.elem
              }).length
            }),
            (m.offset = {
              setOffset: function (o, c, h) {
                var v,
                  w,
                  x,
                  T,
                  I,
                  L,
                  H,
                  X = m.css(o, 'position'),
                  Z = m(o),
                  W = {}
                ;(X === 'static' && (o.style.position = 'relative'),
                  (I = Z.offset()),
                  (x = m.css(o, 'top')),
                  (L = m.css(o, 'left')),
                  (H = (X === 'absolute' || X === 'fixed') && (x + L).indexOf('auto') > -1),
                  H
                    ? ((v = Z.position()), (T = v.top), (w = v.left))
                    : ((T = parseFloat(x) || 0), (w = parseFloat(L) || 0)),
                  k(c) && (c = c.call(o, h, m.extend({}, I))),
                  c.top != null && (W.top = c.top - I.top + T),
                  c.left != null && (W.left = c.left - I.left + w),
                  'using' in c ? c.using.call(o, W) : Z.css(W))
              }
            }),
            m.fn.extend({
              offset: function (o) {
                if (arguments.length)
                  return o === void 0
                    ? this
                    : this.each(function (w) {
                        m.offset.setOffset(this, o, w)
                      })
                var c,
                  h,
                  v = this[0]
                if (v)
                  return v.getClientRects().length
                    ? ((c = v.getBoundingClientRect()),
                      (h = v.ownerDocument.defaultView),
                      { top: c.top + h.pageYOffset, left: c.left + h.pageXOffset })
                    : { top: 0, left: 0 }
              },
              position: function () {
                if (this[0]) {
                  var o,
                    c,
                    h,
                    v = this[0],
                    w = { top: 0, left: 0 }
                  if (m.css(v, 'position') === 'fixed') c = v.getBoundingClientRect()
                  else {
                    for (
                      c = this.offset(), h = v.ownerDocument, o = v.offsetParent || h.documentElement;
                      o && (o === h.body || o === h.documentElement) && m.css(o, 'position') === 'static';

                    )
                      o = o.parentNode
                    o &&
                      o !== v &&
                      o.nodeType === 1 &&
                      ((w = m(o).offset()),
                      (w.top += m.css(o, 'borderTopWidth', !0)),
                      (w.left += m.css(o, 'borderLeftWidth', !0)))
                  }
                  return {
                    top: c.top - w.top - m.css(v, 'marginTop', !0),
                    left: c.left - w.left - m.css(v, 'marginLeft', !0)
                  }
                }
              },
              offsetParent: function () {
                return this.map(function () {
                  for (var o = this.offsetParent; o && m.css(o, 'position') === 'static'; ) o = o.offsetParent
                  return o || Un
                })
              }
            }),
            m.each({ scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' }, function (o, c) {
              var h = c === 'pageYOffset'
              m.fn[o] = function (v) {
                return ge(
                  this,
                  function (w, x, T) {
                    var I
                    if ((F(w) ? (I = w) : w.nodeType === 9 && (I = w.defaultView), T === void 0)) return I ? I[c] : w[x]
                    I ? I.scrollTo(h ? I.pageXOffset : T, h ? T : I.pageYOffset) : (w[x] = T)
                  },
                  o,
                  v,
                  arguments.length
                )
              }
            }),
            m.each(['top', 'left'], function (o, c) {
              m.cssHooks[c] = yn(A.pixelPosition, function (h, v) {
                if (v) return ((v = pn(h, c)), _i.test(v) ? m(h).position()[c] + 'px' : v)
              })
            }),
            m.each({ Height: 'height', Width: 'width' }, function (o, c) {
              m.each({ padding: 'inner' + o, content: c, '': 'outer' + o }, function (h, v) {
                m.fn[v] = function (w, x) {
                  var T = arguments.length && (h || typeof w != 'boolean'),
                    I = h || (w === !0 || x === !0 ? 'margin' : 'border')
                  return ge(
                    this,
                    function (L, H, X) {
                      var Z
                      return F(L)
                        ? v.indexOf('outer') === 0
                          ? L['inner' + o]
                          : L.document.documentElement['client' + o]
                        : L.nodeType === 9
                          ? ((Z = L.documentElement),
                            Math.max(
                              L.body['scroll' + o],
                              Z['scroll' + o],
                              L.body['offset' + o],
                              Z['offset' + o],
                              Z['client' + o]
                            ))
                          : X === void 0
                            ? m.css(L, H, I)
                            : m.style(L, H, X, I)
                    },
                    c,
                    T ? w : void 0,
                    T
                  )
                }
              })
            }),
            m.each(['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'], function (o, c) {
              m.fn[c] = function (h) {
                return this.on(c, h)
              }
            }),
            m.fn.extend({
              bind: function (o, c, h) {
                return this.on(o, null, c, h)
              },
              unbind: function (o, c) {
                return this.off(o, null, c)
              },
              delegate: function (o, c, h, v) {
                return this.on(c, o, h, v)
              },
              undelegate: function (o, c, h) {
                return arguments.length === 1 ? this.off(o, '**') : this.off(c, o || '**', h)
              },
              hover: function (o, c) {
                return this.on('mouseenter', o).on('mouseleave', c || o)
              }
            }),
            m.each(
              'blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(
                ' '
              ),
              function (o, c) {
                m.fn[c] = function (h, v) {
                  return arguments.length > 0 ? this.on(c, null, h, v) : this.trigger(c)
                }
              }
            ))
          var Fa = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g
          ;((m.proxy = function (o, c) {
            var h, v, w
            if ((typeof c == 'string' && ((h = o[c]), (c = o), (o = h)), !!k(o)))
              return (
                (v = s.call(arguments, 2)),
                (w = function () {
                  return o.apply(c || this, v.concat(s.call(arguments)))
                }),
                (w.guid = o.guid = o.guid || m.guid++),
                w
              )
          }),
            (m.holdReady = function (o) {
              o ? m.readyWait++ : m.ready(!0)
            }),
            (m.isArray = Array.isArray),
            (m.parseJSON = JSON.parse),
            (m.nodeName = Ne),
            (m.isFunction = k),
            (m.isWindow = F),
            (m.camelCase = Oe),
            (m.type = Y),
            (m.now = Date.now),
            (m.isNumeric = function (o) {
              var c = m.type(o)
              return (c === 'number' || c === 'string') && !isNaN(o - parseFloat(o))
            }),
            (m.trim = function (o) {
              return o == null ? '' : (o + '').replace(Fa, '$1')
            }))
          var dc = t.jQuery,
            fc = t.$
          return (
            (m.noConflict = function (o) {
              return (t.$ === m && (t.$ = fc), o && t.jQuery === m && (t.jQuery = dc), m)
            }),
            typeof r > 'u' && (t.jQuery = t.$ = m),
            m
          )
        })
      })(nl)),
    nl.exports
  )
}
var Tb = Cb()
const gt = xb(Tb)
/**
 * @vue/shared v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ /*! #__NO_SIDE_EFFECTS__ */ function xu(e) {
  const t = Object.create(null)
  for (const r of e.split(',')) t[r] = 1
  return r => r in t
}
const Bt = {},
  Uo = [],
  Br = () => {},
  Ab = () => !1,
  Il = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  Su = e => e.startsWith('onUpdate:'),
  On = Object.assign,
  Cu = (e, t) => {
    const r = e.indexOf(t)
    r > -1 && e.splice(r, 1)
  },
  Db = Object.prototype.hasOwnProperty,
  Lt = (e, t) => Db.call(e, t),
  Ge = Array.isArray,
  Wo = e => la(e) === '[object Map]',
  rs = e => la(e) === '[object Set]',
  Jd = e => la(e) === '[object Date]',
  lt = e => typeof e == 'function',
  fn = e => typeof e == 'string',
  qr = e => typeof e == 'symbol',
  Vt = e => e !== null && typeof e == 'object',
  Ah = e => (Vt(e) || lt(e)) && lt(e.then) && lt(e.catch),
  Dh = Object.prototype.toString,
  la = e => Dh.call(e),
  kb = e => la(e).slice(8, -1),
  kh = e => la(e) === '[object Object]',
  Tu = e => fn(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
  js = xu(
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
  ),
  Fl = e => {
    const t = Object.create(null)
    return r => t[r] || (t[r] = e(r))
  },
  Eb = /-(\w)/g,
  Ni = Fl(e => e.replace(Eb, (t, r) => (r ? r.toUpperCase() : ''))),
  Ob = /\B([A-Z])/g,
  bo = Fl(e => e.replace(Ob, '-$1').toLowerCase()),
  Eh = Fl(e => e.charAt(0).toUpperCase() + e.slice(1)),
  Oc = Fl(e => (e ? `on${Eh(e)}` : '')),
  ji = (e, t) => !Object.is(e, t),
  rl = (e, ...t) => {
    for (let r = 0; r < e.length; r++) e[r](...t)
  },
  Jc = (e, t, r, n = !1) => {
    Object.defineProperty(e, t, { configurable: !0, enumerable: !1, writable: n, value: r })
  },
  pl = e => {
    const t = parseFloat(e)
    return isNaN(t) ? e : t
  }
let Yd
const jl = () =>
  Yd ||
  (Yd =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {})
function Go(e) {
  if (Ge(e)) {
    const t = {}
    for (let r = 0; r < e.length; r++) {
      const n = e[r],
        i = fn(n) ? Mb(n) : Go(n)
      if (i) for (const s in i) t[s] = i[s]
    }
    return t
  } else if (fn(e) || Vt(e)) return e
}
const Pb = /;(?![^(]*\))/g,
  Rb = /:([^]+)/,
  Lb = /\/\*[^]*?\*\//g
function Mb(e) {
  const t = {}
  return (
    e
      .replace(Lb, '')
      .split(Pb)
      .forEach(r => {
        if (r) {
          const n = r.split(Rb)
          n.length > 1 && (t[n[0].trim()] = n[1].trim())
        }
      }),
    t
  )
}
function dt(e) {
  let t = ''
  if (fn(e)) t = e
  else if (Ge(e))
    for (let r = 0; r < e.length; r++) {
      const n = dt(e[r])
      n && (t += n + ' ')
    }
  else if (Vt(e)) for (const r in e) e[r] && (t += r + ' ')
  return t.trim()
}
const Ib = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
  Fb = xu(Ib)
function Oh(e) {
  return !!e || e === ''
}
function jb(e, t) {
  if (e.length !== t.length) return !1
  let r = !0
  for (let n = 0; r && n < e.length; n++) r = ca(e[n], t[n])
  return r
}
function ca(e, t) {
  if (e === t) return !0
  let r = Jd(e),
    n = Jd(t)
  if (r || n) return r && n ? e.getTime() === t.getTime() : !1
  if (((r = qr(e)), (n = qr(t)), r || n)) return e === t
  if (((r = Ge(e)), (n = Ge(t)), r || n)) return r && n ? jb(e, t) : !1
  if (((r = Vt(e)), (n = Vt(t)), r || n)) {
    if (!r || !n) return !1
    const i = Object.keys(e).length,
      s = Object.keys(t).length
    if (i !== s) return !1
    for (const a in e) {
      const d = e.hasOwnProperty(a),
        f = t.hasOwnProperty(a)
      if ((d && !f) || (!d && f) || !ca(e[a], t[a])) return !1
    }
  }
  return String(e) === String(t)
}
function Au(e, t) {
  return e.findIndex(r => ca(r, t))
}
const Ph = e => !!(e && e.__v_isRef === !0),
  Q = e =>
    fn(e)
      ? e
      : e == null
        ? ''
        : Ge(e) || (Vt(e) && (e.toString === Dh || !lt(e.toString)))
          ? Ph(e)
            ? Q(e.value)
            : JSON.stringify(e, Rh, 2)
          : String(e),
  Rh = (e, t) =>
    Ph(t)
      ? Rh(e, t.value)
      : Wo(t)
        ? { [`Map(${t.size})`]: [...t.entries()].reduce((r, [n, i], s) => ((r[Pc(n, s) + ' =>'] = i), r), {}) }
        : rs(t)
          ? { [`Set(${t.size})`]: [...t.values()].map(r => Pc(r)) }
          : qr(t)
            ? Pc(t)
            : Vt(t) && !Ge(t) && !kh(t)
              ? String(t)
              : t,
  Pc = (e, t = '') => {
    var r
    return qr(e) ? `Symbol(${(r = e.description) != null ? r : t})` : e
  }
/**
 * @vue/reactivity v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Xn
class Lh {
  constructor(t = !1) {
    ;((this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = Xn),
      !t && Xn && (this.index = (Xn.scopes || (Xn.scopes = [])).push(this) - 1))
  }
  get active() {
    return this._active
  }
  pause() {
    if (this._active) {
      this._isPaused = !0
      let t, r
      if (this.scopes) for (t = 0, r = this.scopes.length; t < r; t++) this.scopes[t].pause()
      for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].pause()
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1
      let t, r
      if (this.scopes) for (t = 0, r = this.scopes.length; t < r; t++) this.scopes[t].resume()
      for (t = 0, r = this.effects.length; t < r; t++) this.effects[t].resume()
    }
  }
  run(t) {
    if (this._active) {
      const r = Xn
      try {
        return ((Xn = this), t())
      } finally {
        Xn = r
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = Xn), (Xn = this))
  }
  off() {
    this._on > 0 && --this._on === 0 && ((Xn = this.prevScope), (this.prevScope = void 0))
  }
  stop(t) {
    if (this._active) {
      this._active = !1
      let r, n
      for (r = 0, n = this.effects.length; r < n; r++) this.effects[r].stop()
      for (this.effects.length = 0, r = 0, n = this.cleanups.length; r < n; r++) this.cleanups[r]()
      if (((this.cleanups.length = 0), this.scopes)) {
        for (r = 0, n = this.scopes.length; r < n; r++) this.scopes[r].stop(!0)
        this.scopes.length = 0
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop()
        i && i !== this && ((this.parent.scopes[this.index] = i), (i.index = this.index))
      }
      this.parent = void 0
    }
  }
}
function Nb(e) {
  return new Lh(e)
}
function Hb() {
  return Xn
}
let Wt
const Rc = new WeakSet()
class Mh {
  constructor(t) {
    ;((this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      Xn && Xn.active && Xn.effects.push(this))
  }
  pause() {
    this.flags |= 64
  }
  resume() {
    this.flags & 64 && ((this.flags &= -65), Rc.has(this) && (Rc.delete(this), this.trigger()))
  }
  notify() {
    ;(this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || Fh(this)
  }
  run() {
    if (!(this.flags & 1)) return this.fn()
    ;((this.flags |= 2), Qd(this), jh(this))
    const t = Wt,
      r = Cr
    ;((Wt = this), (Cr = !0))
    try {
      return this.fn()
    } finally {
      ;(Nh(this), (Wt = t), (Cr = r), (this.flags &= -3))
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) Eu(t)
      ;((this.deps = this.depsTail = void 0), Qd(this), this.onStop && this.onStop(), (this.flags &= -2))
    }
  }
  trigger() {
    this.flags & 64 ? Rc.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty()
  }
  runIfDirty() {
    Yc(this) && this.run()
  }
  get dirty() {
    return Yc(this)
  }
}
let Ih = 0,
  Ns,
  Hs
function Fh(e, t = !1) {
  if (((e.flags |= 8), t)) {
    ;((e.next = Hs), (Hs = e))
    return
  }
  ;((e.next = Ns), (Ns = e))
}
function Du() {
  Ih++
}
function ku() {
  if (--Ih > 0) return
  if (Hs) {
    let t = Hs
    for (Hs = void 0; t; ) {
      const r = t.next
      ;((t.next = void 0), (t.flags &= -9), (t = r))
    }
  }
  let e
  for (; Ns; ) {
    let t = Ns
    for (Ns = void 0; t; ) {
      const r = t.next
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger()
        } catch (n) {
          e || (e = n)
        }
      t = r
    }
  }
  if (e) throw e
}
function jh(e) {
  for (let t = e.deps; t; t = t.nextDep)
    ((t.version = -1), (t.prevActiveLink = t.dep.activeLink), (t.dep.activeLink = t))
}
function Nh(e) {
  let t,
    r = e.depsTail,
    n = r
  for (; n; ) {
    const i = n.prevDep
    ;(n.version === -1 ? (n === r && (r = i), Eu(n), $b(n)) : (t = n),
      (n.dep.activeLink = n.prevActiveLink),
      (n.prevActiveLink = void 0),
      (n = i))
  }
  ;((e.deps = t), (e.depsTail = r))
}
function Yc(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || (t.dep.computed && (Hh(t.dep.computed) || t.dep.version !== t.version)))
      return !0
  return !!e._dirty
}
function Hh(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === Xs) ||
    ((e.globalVersion = Xs), !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Yc(e)))
  )
    return
  e.flags |= 2
  const t = e.dep,
    r = Wt,
    n = Cr
  ;((Wt = e), (Cr = !0))
  try {
    jh(e)
    const i = e.fn(e._value)
    ;(t.version === 0 || ji(i, e._value)) && ((e.flags |= 128), (e._value = i), t.version++)
  } catch (i) {
    throw (t.version++, i)
  } finally {
    ;((Wt = r), (Cr = n), Nh(e), (e.flags &= -3))
  }
}
function Eu(e, t = !1) {
  const { dep: r, prevSub: n, nextSub: i } = e
  if (
    (n && ((n.nextSub = i), (e.prevSub = void 0)),
    i && ((i.prevSub = n), (e.nextSub = void 0)),
    r.subs === e && ((r.subs = n), !n && r.computed))
  ) {
    r.computed.flags &= -5
    for (let s = r.computed.deps; s; s = s.nextDep) Eu(s, !0)
  }
  !t && !--r.sc && r.map && r.map.delete(r.key)
}
function $b(e) {
  const { prevDep: t, nextDep: r } = e
  ;(t && ((t.nextDep = r), (e.prevDep = void 0)), r && ((r.prevDep = t), (e.nextDep = void 0)))
}
let Cr = !0
const $h = []
function hi() {
  ;($h.push(Cr), (Cr = !1))
}
function pi() {
  const e = $h.pop()
  Cr = e === void 0 ? !0 : e
}
function Qd(e) {
  const { cleanup: t } = e
  if (((e.cleanup = void 0), t)) {
    const r = Wt
    Wt = void 0
    try {
      t()
    } finally {
      Wt = r
    }
  }
}
let Xs = 0
class Bb {
  constructor(t, r) {
    ;((this.sub = t),
      (this.dep = r),
      (this.version = r.version),
      (this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0))
  }
}
class Ou {
  constructor(t) {
    ;((this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0))
  }
  track(t) {
    if (!Wt || !Cr || Wt === this.computed) return
    let r = this.activeLink
    if (r === void 0 || r.sub !== Wt)
      ((r = this.activeLink = new Bb(Wt, this)),
        Wt.deps
          ? ((r.prevDep = Wt.depsTail), (Wt.depsTail.nextDep = r), (Wt.depsTail = r))
          : (Wt.deps = Wt.depsTail = r),
        Bh(r))
    else if (r.version === -1 && ((r.version = this.version), r.nextDep)) {
      const n = r.nextDep
      ;((n.prevDep = r.prevDep),
        r.prevDep && (r.prevDep.nextDep = n),
        (r.prevDep = Wt.depsTail),
        (r.nextDep = void 0),
        (Wt.depsTail.nextDep = r),
        (Wt.depsTail = r),
        Wt.deps === r && (Wt.deps = n))
    }
    return r
  }
  trigger(t) {
    ;(this.version++, Xs++, this.notify(t))
  }
  notify(t) {
    Du()
    try {
      for (let r = this.subs; r; r = r.prevSub) r.sub.notify() && r.sub.dep.notify()
    } finally {
      ku()
    }
  }
}
function Bh(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed
    if (t && !e.dep.subs) {
      t.flags |= 20
      for (let n = t.deps; n; n = n.nextDep) Bh(n)
    }
    const r = e.dep.subs
    ;(r !== e && ((e.prevSub = r), r && (r.nextSub = e)), (e.dep.subs = e))
  }
}
const Qc = new WeakMap(),
  mo = Symbol(''),
  Zc = Symbol(''),
  Gs = Symbol('')
function Dn(e, t, r) {
  if (Cr && Wt) {
    let n = Qc.get(e)
    n || Qc.set(e, (n = new Map()))
    let i = n.get(r)
    ;(i || (n.set(r, (i = new Ou())), (i.map = n), (i.key = r)), i.track())
  }
}
function li(e, t, r, n, i, s) {
  const a = Qc.get(e)
  if (!a) {
    Xs++
    return
  }
  const d = f => {
    f && f.trigger()
  }
  if ((Du(), t === 'clear')) a.forEach(d)
  else {
    const f = Ge(e),
      g = f && Tu(r)
    if (f && r === 'length') {
      const p = Number(n)
      a.forEach((y, _) => {
        ;(_ === 'length' || _ === Gs || (!qr(_) && _ >= p)) && d(y)
      })
    } else
      switch (((r !== void 0 || a.has(void 0)) && d(a.get(r)), g && d(a.get(Gs)), t)) {
        case 'add':
          f ? g && d(a.get('length')) : (d(a.get(mo)), Wo(e) && d(a.get(Zc)))
          break
        case 'delete':
          f || (d(a.get(mo)), Wo(e) && d(a.get(Zc)))
          break
        case 'set':
          Wo(e) && d(a.get(mo))
          break
      }
  }
  ku()
}
function jo(e) {
  const t = Rt(e)
  return t === e ? t : (Dn(t, 'iterate', Gs), mr(e) ? t : t.map(Cn))
}
function Nl(e) {
  return (Dn((e = Rt(e)), 'iterate', Gs), e)
}
const qb = {
  __proto__: null,
  [Symbol.iterator]() {
    return Lc(this, Symbol.iterator, Cn)
  },
  concat(...e) {
    return jo(this).concat(...e.map(t => (Ge(t) ? jo(t) : t)))
  },
  entries() {
    return Lc(this, 'entries', e => ((e[1] = Cn(e[1])), e))
  },
  every(e, t) {
    return oi(this, 'every', e, t, void 0, arguments)
  },
  filter(e, t) {
    return oi(this, 'filter', e, t, r => r.map(Cn), arguments)
  },
  find(e, t) {
    return oi(this, 'find', e, t, Cn, arguments)
  },
  findIndex(e, t) {
    return oi(this, 'findIndex', e, t, void 0, arguments)
  },
  findLast(e, t) {
    return oi(this, 'findLast', e, t, Cn, arguments)
  },
  findLastIndex(e, t) {
    return oi(this, 'findLastIndex', e, t, void 0, arguments)
  },
  forEach(e, t) {
    return oi(this, 'forEach', e, t, void 0, arguments)
  },
  includes(...e) {
    return Mc(this, 'includes', e)
  },
  indexOf(...e) {
    return Mc(this, 'indexOf', e)
  },
  join(e) {
    return jo(this).join(e)
  },
  lastIndexOf(...e) {
    return Mc(this, 'lastIndexOf', e)
  },
  map(e, t) {
    return oi(this, 'map', e, t, void 0, arguments)
  },
  pop() {
    return Es(this, 'pop')
  },
  push(...e) {
    return Es(this, 'push', e)
  },
  reduce(e, ...t) {
    return Zd(this, 'reduce', e, t)
  },
  reduceRight(e, ...t) {
    return Zd(this, 'reduceRight', e, t)
  },
  shift() {
    return Es(this, 'shift')
  },
  some(e, t) {
    return oi(this, 'some', e, t, void 0, arguments)
  },
  splice(...e) {
    return Es(this, 'splice', e)
  },
  toReversed() {
    return jo(this).toReversed()
  },
  toSorted(e) {
    return jo(this).toSorted(e)
  },
  toSpliced(...e) {
    return jo(this).toSpliced(...e)
  },
  unshift(...e) {
    return Es(this, 'unshift', e)
  },
  values() {
    return Lc(this, 'values', Cn)
  }
}
function Lc(e, t, r) {
  const n = Nl(e),
    i = n[t]()
  return (
    n !== e &&
      !mr(e) &&
      ((i._next = i.next),
      (i.next = () => {
        const s = i._next()
        return (s.value && (s.value = r(s.value)), s)
      })),
    i
  )
}
const Ub = Array.prototype
function oi(e, t, r, n, i, s) {
  const a = Nl(e),
    d = a !== e && !mr(e),
    f = a[t]
  if (f !== Ub[t]) {
    const y = f.apply(e, s)
    return d ? Cn(y) : y
  }
  let g = r
  a !== e &&
    (d
      ? (g = function (y, _) {
          return r.call(this, Cn(y), _, e)
        })
      : r.length > 2 &&
        (g = function (y, _) {
          return r.call(this, y, _, e)
        }))
  const p = f.call(a, g, n)
  return d && i ? i(p) : p
}
function Zd(e, t, r, n) {
  const i = Nl(e)
  let s = r
  return (
    i !== e &&
      (mr(e)
        ? r.length > 3 &&
          (s = function (a, d, f) {
            return r.call(this, a, d, f, e)
          })
        : (s = function (a, d, f) {
            return r.call(this, a, Cn(d), f, e)
          })),
    i[t](s, ...n)
  )
}
function Mc(e, t, r) {
  const n = Rt(e)
  Dn(n, 'iterate', Gs)
  const i = n[t](...r)
  return (i === -1 || i === !1) && Lu(r[0]) ? ((r[0] = Rt(r[0])), n[t](...r)) : i
}
function Es(e, t, r = []) {
  ;(hi(), Du())
  const n = Rt(e)[t].apply(e, r)
  return (ku(), pi(), n)
}
const Wb = xu('__proto__,__v_isRef,__isVue'),
  qh = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter(e => e !== 'arguments' && e !== 'caller')
      .map(e => Symbol[e])
      .filter(qr)
  )
function Vb(e) {
  qr(e) || (e = String(e))
  const t = Rt(this)
  return (Dn(t, 'has', e), t.hasOwnProperty(e))
}
class Uh {
  constructor(t = !1, r = !1) {
    ;((this._isReadonly = t), (this._isShallow = r))
  }
  get(t, r, n) {
    if (r === '__v_skip') return t.__v_skip
    const i = this._isReadonly,
      s = this._isShallow
    if (r === '__v_isReactive') return !i
    if (r === '__v_isReadonly') return i
    if (r === '__v_isShallow') return s
    if (r === '__v_raw')
      return n === (i ? (s ? ty : Kh) : s ? zh : Vh).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
        ? t
        : void 0
    const a = Ge(t)
    if (!i) {
      let f
      if (a && (f = qb[r])) return f
      if (r === 'hasOwnProperty') return Vb
    }
    const d = Reflect.get(t, r, En(t) ? t : n)
    return (qr(r) ? qh.has(r) : Wb(r)) || (i || Dn(t, 'get', r), s)
      ? d
      : En(d)
        ? a && Tu(r)
          ? d
          : d.value
        : Vt(d)
          ? i
            ? Gh(d)
            : nn(d)
          : d
  }
}
class Wh extends Uh {
  constructor(t = !1) {
    super(!1, t)
  }
  set(t, r, n, i) {
    let s = t[r]
    if (!this._isShallow) {
      const f = Hi(s)
      if ((!mr(n) && !Hi(n) && ((s = Rt(s)), (n = Rt(n))), !Ge(t) && En(s) && !En(n)))
        return f ? !1 : ((s.value = n), !0)
    }
    const a = Ge(t) && Tu(r) ? Number(r) < t.length : Lt(t, r),
      d = Reflect.set(t, r, n, En(t) ? t : i)
    return (t === Rt(i) && (a ? ji(n, s) && li(t, 'set', r, n) : li(t, 'add', r, n)), d)
  }
  deleteProperty(t, r) {
    const n = Lt(t, r)
    t[r]
    const i = Reflect.deleteProperty(t, r)
    return (i && n && li(t, 'delete', r, void 0), i)
  }
  has(t, r) {
    const n = Reflect.has(t, r)
    return ((!qr(r) || !qh.has(r)) && Dn(t, 'has', r), n)
  }
  ownKeys(t) {
    return (Dn(t, 'iterate', Ge(t) ? 'length' : mo), Reflect.ownKeys(t))
  }
}
class zb extends Uh {
  constructor(t = !1) {
    super(!0, t)
  }
  set(t, r) {
    return !0
  }
  deleteProperty(t, r) {
    return !0
  }
}
const Kb = new Wh(),
  Xb = new zb(),
  Gb = new Wh(!0)
const eu = e => e,
  Ga = e => Reflect.getPrototypeOf(e)
function Jb(e, t, r) {
  return function (...n) {
    const i = this.__v_raw,
      s = Rt(i),
      a = Wo(s),
      d = e === 'entries' || (e === Symbol.iterator && a),
      f = e === 'keys' && a,
      g = i[e](...n),
      p = r ? eu : t ? ml : Cn
    return (
      !t && Dn(s, 'iterate', f ? Zc : mo),
      {
        next() {
          const { value: y, done: _ } = g.next()
          return _ ? { value: y, done: _ } : { value: d ? [p(y[0]), p(y[1])] : p(y), done: _ }
        },
        [Symbol.iterator]() {
          return this
        }
      }
    )
  }
}
function Ja(e) {
  return function (...t) {
    return e === 'delete' ? !1 : e === 'clear' ? void 0 : this
  }
}
function Yb(e, t) {
  const r = {
    get(i) {
      const s = this.__v_raw,
        a = Rt(s),
        d = Rt(i)
      e || (ji(i, d) && Dn(a, 'get', i), Dn(a, 'get', d))
      const { has: f } = Ga(a),
        g = t ? eu : e ? ml : Cn
      if (f.call(a, i)) return g(s.get(i))
      if (f.call(a, d)) return g(s.get(d))
      s !== a && s.get(i)
    },
    get size() {
      const i = this.__v_raw
      return (!e && Dn(Rt(i), 'iterate', mo), Reflect.get(i, 'size', i))
    },
    has(i) {
      const s = this.__v_raw,
        a = Rt(s),
        d = Rt(i)
      return (e || (ji(i, d) && Dn(a, 'has', i), Dn(a, 'has', d)), i === d ? s.has(i) : s.has(i) || s.has(d))
    },
    forEach(i, s) {
      const a = this,
        d = a.__v_raw,
        f = Rt(d),
        g = t ? eu : e ? ml : Cn
      return (!e && Dn(f, 'iterate', mo), d.forEach((p, y) => i.call(s, g(p), g(y), a)))
    }
  }
  return (
    On(
      r,
      e
        ? { add: Ja('add'), set: Ja('set'), delete: Ja('delete'), clear: Ja('clear') }
        : {
            add(i) {
              !t && !mr(i) && !Hi(i) && (i = Rt(i))
              const s = Rt(this)
              return (Ga(s).has.call(s, i) || (s.add(i), li(s, 'add', i, i)), this)
            },
            set(i, s) {
              !t && !mr(s) && !Hi(s) && (s = Rt(s))
              const a = Rt(this),
                { has: d, get: f } = Ga(a)
              let g = d.call(a, i)
              g || ((i = Rt(i)), (g = d.call(a, i)))
              const p = f.call(a, i)
              return (a.set(i, s), g ? ji(s, p) && li(a, 'set', i, s) : li(a, 'add', i, s), this)
            },
            delete(i) {
              const s = Rt(this),
                { has: a, get: d } = Ga(s)
              let f = a.call(s, i)
              ;(f || ((i = Rt(i)), (f = a.call(s, i))), d && d.call(s, i))
              const g = s.delete(i)
              return (f && li(s, 'delete', i, void 0), g)
            },
            clear() {
              const i = Rt(this),
                s = i.size !== 0,
                a = i.clear()
              return (s && li(i, 'clear', void 0, void 0), a)
            }
          }
    ),
    ['keys', 'values', 'entries', Symbol.iterator].forEach(i => {
      r[i] = Jb(i, e, t)
    }),
    r
  )
}
function Pu(e, t) {
  const r = Yb(e, t)
  return (n, i, s) =>
    i === '__v_isReactive'
      ? !e
      : i === '__v_isReadonly'
        ? e
        : i === '__v_raw'
          ? n
          : Reflect.get(Lt(r, i) && i in n ? r : n, i, s)
}
const Qb = { get: Pu(!1, !1) },
  Zb = { get: Pu(!1, !0) },
  ey = { get: Pu(!0, !1) }
const Vh = new WeakMap(),
  zh = new WeakMap(),
  Kh = new WeakMap(),
  ty = new WeakMap()
function ny(e) {
  switch (e) {
    case 'Object':
    case 'Array':
      return 1
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2
    default:
      return 0
  }
}
function ry(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : ny(kb(e))
}
function nn(e) {
  return Hi(e) ? e : Ru(e, !1, Kb, Qb, Vh)
}
function Xh(e) {
  return Ru(e, !1, Gb, Zb, zh)
}
function Gh(e) {
  return Ru(e, !0, Xb, ey, Kh)
}
function Ru(e, t, r, n, i) {
  if (!Vt(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e
  const s = ry(e)
  if (s === 0) return e
  const a = i.get(e)
  if (a) return a
  const d = new Proxy(e, s === 2 ? n : r)
  return (i.set(e, d), d)
}
function Vo(e) {
  return Hi(e) ? Vo(e.__v_raw) : !!(e && e.__v_isReactive)
}
function Hi(e) {
  return !!(e && e.__v_isReadonly)
}
function mr(e) {
  return !!(e && e.__v_isShallow)
}
function Lu(e) {
  return e ? !!e.__v_raw : !1
}
function Rt(e) {
  const t = e && e.__v_raw
  return t ? Rt(t) : e
}
function Jh(e) {
  return (!Lt(e, '__v_skip') && Object.isExtensible(e) && Jc(e, '__v_skip', !0), e)
}
const Cn = e => (Vt(e) ? nn(e) : e),
  ml = e => (Vt(e) ? Gh(e) : e)
function En(e) {
  return e ? e.__v_isRef === !0 : !1
}
function qe(e) {
  return Yh(e, !1)
}
function iy(e) {
  return Yh(e, !0)
}
function Yh(e, t) {
  return En(e) ? e : new oy(e, t)
}
class oy {
  constructor(t, r) {
    ;((this.dep = new Ou()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = r ? t : Rt(t)),
      (this._value = r ? t : Cn(t)),
      (this.__v_isShallow = r))
  }
  get value() {
    return (this.dep.track(), this._value)
  }
  set value(t) {
    const r = this._rawValue,
      n = this.__v_isShallow || mr(t) || Hi(t)
    ;((t = n ? t : Rt(t)), ji(t, r) && ((this._rawValue = t), (this._value = n ? t : Cn(t)), this.dep.trigger()))
  }
}
function zo(e) {
  return En(e) ? e.value : e
}
const sy = {
  get: (e, t, r) => (t === '__v_raw' ? e : zo(Reflect.get(e, t, r))),
  set: (e, t, r, n) => {
    const i = e[t]
    return En(i) && !En(r) ? ((i.value = r), !0) : Reflect.set(e, t, r, n)
  }
}
function Qh(e) {
  return Vo(e) ? e : new Proxy(e, sy)
}
class ay {
  constructor(t, r, n) {
    ;((this.fn = t),
      (this.setter = r),
      (this._value = void 0),
      (this.dep = new Ou(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = Xs - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !r),
      (this.isSSR = n))
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && Wt !== this)) return (Fh(this, !0), !0)
  }
  get value() {
    const t = this.dep.track()
    return (Hh(this), t && (t.version = this.dep.version), this._value)
  }
  set value(t) {
    this.setter && this.setter(t)
  }
}
function ly(e, t, r = !1) {
  let n, i
  return (lt(e) ? (n = e) : ((n = e.get), (i = e.set)), new ay(n, i, r))
}
const Ya = {},
  vl = new WeakMap()
let fo
function cy(e, t = !1, r = fo) {
  if (r) {
    let n = vl.get(r)
    ;(n || vl.set(r, (n = [])), n.push(e))
  }
}
function uy(e, t, r = Bt) {
  const { immediate: n, deep: i, once: s, scheduler: a, augmentJob: d, call: f } = r,
    g = Y => (i ? Y : mr(Y) || i === !1 || i === 0 ? ci(Y, 1) : ci(Y))
  let p,
    y,
    _,
    C,
    A = !1,
    k = !1
  if (
    (En(e)
      ? ((y = () => e.value), (A = mr(e)))
      : Vo(e)
        ? ((y = () => g(e)), (A = !0))
        : Ge(e)
          ? ((k = !0),
            (A = e.some(Y => Vo(Y) || mr(Y))),
            (y = () =>
              e.map(Y => {
                if (En(Y)) return Y.value
                if (Vo(Y)) return g(Y)
                if (lt(Y)) return f ? f(Y, 2) : Y()
              })))
          : lt(e)
            ? t
              ? (y = f ? () => f(e, 2) : e)
              : (y = () => {
                  if (_) {
                    hi()
                    try {
                      _()
                    } finally {
                      pi()
                    }
                  }
                  const Y = fo
                  fo = p
                  try {
                    return f ? f(e, 3, [C]) : e(C)
                  } finally {
                    fo = Y
                  }
                })
            : (y = Br),
    t && i)
  ) {
    const Y = y,
      ue = i === !0 ? 1 / 0 : i
    y = () => ci(Y(), ue)
  }
  const F = Hb(),
    N = () => {
      ;(p.stop(), F && F.active && Cu(F.effects, p))
    }
  if (s && t) {
    const Y = t
    t = (...ue) => {
      ;(Y(...ue), N())
    }
  }
  let E = k ? new Array(e.length).fill(Ya) : Ya
  const z = Y => {
    if (!(!(p.flags & 1) || (!p.dirty && !Y)))
      if (t) {
        const ue = p.run()
        if (i || A || (k ? ue.some((ke, m) => ji(ke, E[m])) : ji(ue, E))) {
          _ && _()
          const ke = fo
          fo = p
          try {
            const m = [ue, E === Ya ? void 0 : k && E[0] === Ya ? [] : E, C]
            ;((E = ue), f ? f(t, 3, m) : t(...m))
          } finally {
            fo = ke
          }
        }
      } else p.run()
  }
  return (
    d && d(z),
    (p = new Mh(y)),
    (p.scheduler = a ? () => a(z, !1) : z),
    (C = Y => cy(Y, !1, p)),
    (_ = p.onStop =
      () => {
        const Y = vl.get(p)
        if (Y) {
          if (f) f(Y, 4)
          else for (const ue of Y) ue()
          vl.delete(p)
        }
      }),
    t ? (n ? z(!0) : (E = p.run())) : a ? a(z.bind(null, !0), !0) : p.run(),
    (N.pause = p.pause.bind(p)),
    (N.resume = p.resume.bind(p)),
    (N.stop = N),
    N
  )
}
function ci(e, t = 1 / 0, r) {
  if (t <= 0 || !Vt(e) || e.__v_skip || ((r = r || new Set()), r.has(e))) return e
  if ((r.add(e), t--, En(e))) ci(e.value, t, r)
  else if (Ge(e)) for (let n = 0; n < e.length; n++) ci(e[n], t, r)
  else if (rs(e) || Wo(e))
    e.forEach(n => {
      ci(n, t, r)
    })
  else if (kh(e)) {
    for (const n in e) ci(e[n], t, r)
    for (const n of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, n) && ci(e[n], t, r)
  }
  return e
}
/**
 * @vue/runtime-core v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function ua(e, t, r, n) {
  try {
    return n ? e(...n) : e()
  } catch (i) {
    Hl(i, t, r)
  }
}
function Ur(e, t, r, n) {
  if (lt(e)) {
    const i = ua(e, t, r, n)
    return (
      i &&
        Ah(i) &&
        i.catch(s => {
          Hl(s, t, r)
        }),
      i
    )
  }
  if (Ge(e)) {
    const i = []
    for (let s = 0; s < e.length; s++) i.push(Ur(e[s], t, r, n))
    return i
  }
}
function Hl(e, t, r, n = !0) {
  const i = t ? t.vnode : null,
    { errorHandler: s, throwUnhandledErrorInProduction: a } = (t && t.appContext.config) || Bt
  if (t) {
    let d = t.parent
    const f = t.proxy,
      g = `https://vuejs.org/error-reference/#runtime-${r}`
    for (; d; ) {
      const p = d.ec
      if (p) {
        for (let y = 0; y < p.length; y++) if (p[y](e, f, g) === !1) return
      }
      d = d.parent
    }
    if (s) {
      ;(hi(), ua(s, null, 10, [e, f, g]), pi())
      return
    }
  }
  dy(e, r, i, n, a)
}
function dy(e, t, r, n = !0, i = !1) {
  if (i) throw e
  console.error(e)
}
const Bn = []
let Hr = -1
const Ko = []
let Pi = null,
  $o = 0
const Zh = Promise.resolve()
let gl = null
function Bi(e) {
  const t = gl || Zh
  return e ? t.then(this ? e.bind(this) : e) : t
}
function fy(e) {
  let t = Hr + 1,
    r = Bn.length
  for (; t < r; ) {
    const n = (t + r) >>> 1,
      i = Bn[n],
      s = Js(i)
    s < e || (s === e && i.flags & 2) ? (t = n + 1) : (r = n)
  }
  return t
}
function Mu(e) {
  if (!(e.flags & 1)) {
    const t = Js(e),
      r = Bn[Bn.length - 1]
    ;(!r || (!(e.flags & 2) && t >= Js(r)) ? Bn.push(e) : Bn.splice(fy(t), 0, e), (e.flags |= 1), ep())
  }
}
function ep() {
  gl || (gl = Zh.then(np))
}
function hy(e) {
  ;(Ge(e) ? Ko.push(...e) : Pi && e.id === -1 ? Pi.splice($o + 1, 0, e) : e.flags & 1 || (Ko.push(e), (e.flags |= 1)),
    ep())
}
function ef(e, t, r = Hr + 1) {
  for (; r < Bn.length; r++) {
    const n = Bn[r]
    if (n && n.flags & 2) {
      if (e && n.id !== e.uid) continue
      ;(Bn.splice(r, 1), r--, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2))
    }
  }
}
function tp(e) {
  if (Ko.length) {
    const t = [...new Set(Ko)].sort((r, n) => Js(r) - Js(n))
    if (((Ko.length = 0), Pi)) {
      Pi.push(...t)
      return
    }
    for (Pi = t, $o = 0; $o < Pi.length; $o++) {
      const r = Pi[$o]
      ;(r.flags & 4 && (r.flags &= -2), r.flags & 8 || r(), (r.flags &= -2))
    }
    ;((Pi = null), ($o = 0))
  }
}
const Js = e => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id)
function np(e) {
  try {
    for (Hr = 0; Hr < Bn.length; Hr++) {
      const t = Bn[Hr]
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), ua(t, t.i, t.i ? 15 : 14), t.flags & 4 || (t.flags &= -2))
    }
  } finally {
    for (; Hr < Bn.length; Hr++) {
      const t = Bn[Hr]
      t && (t.flags &= -2)
    }
    ;((Hr = -1), (Bn.length = 0), tp(), (gl = null), (Bn.length || Ko.length) && np())
  }
}
let pr = null,
  rp = null
function bl(e) {
  const t = pr
  return ((pr = e), (rp = (e && e.type.__scopeId) || null), t)
}
function py(e, t = pr, r) {
  if (!t || e._n) return e
  const n = (...i) => {
    n._d && uf(-1)
    const s = bl(t)
    let a
    try {
      a = e(...i)
    } finally {
      ;(bl(s), n._d && uf(1))
    }
    return a
  }
  return ((n._n = !0), (n._c = !0), (n._d = !0), n)
}
function Ct(e, t) {
  if (pr === null) return e
  const r = Ul(pr),
    n = e.dirs || (e.dirs = [])
  for (let i = 0; i < t.length; i++) {
    let [s, a, d, f = Bt] = t[i]
    s &&
      (lt(s) && (s = { mounted: s, updated: s }),
      s.deep && ci(a),
      n.push({ dir: s, instance: r, value: a, oldValue: void 0, arg: d, modifiers: f }))
  }
  return e
}
function co(e, t, r, n) {
  const i = e.dirs,
    s = t && t.dirs
  for (let a = 0; a < i.length; a++) {
    const d = i[a]
    s && (d.oldValue = s[a].value)
    let f = d.dir[n]
    f && (hi(), Ur(f, r, 8, [e.el, d, e, t]), pi())
  }
}
const my = Symbol('_vte'),
  vy = e => e.__isTeleport
function Iu(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), Iu(e.component.subTree, t))
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)), (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t)
}
/*! #__NO_SIDE_EFFECTS__ */ function ip(e, t) {
  return lt(e) ? On({ name: e.name }, t, { setup: e }) : e
}
function op(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + '-', 0, 0]
}
function $s(e, t, r, n, i = !1) {
  if (Ge(e)) {
    e.forEach((A, k) => $s(A, t && (Ge(t) ? t[k] : t), r, n, i))
    return
  }
  if (Bs(n) && !i) {
    n.shapeFlag & 512 && n.type.__asyncResolved && n.component.subTree.component && $s(e, t, r, n.component.subTree)
    return
  }
  const s = n.shapeFlag & 4 ? Ul(n.component) : n.el,
    a = i ? null : s,
    { i: d, r: f } = e,
    g = t && t.r,
    p = d.refs === Bt ? (d.refs = {}) : d.refs,
    y = d.setupState,
    _ = Rt(y),
    C = y === Bt ? () => !1 : A => Lt(_, A)
  if ((g != null && g !== f && (fn(g) ? ((p[g] = null), C(g) && (y[g] = null)) : En(g) && (g.value = null)), lt(f)))
    ua(f, d, 12, [a, p])
  else {
    const A = fn(f),
      k = En(f)
    if (A || k) {
      const F = () => {
        if (e.f) {
          const N = A ? (C(f) ? y[f] : p[f]) : f.value
          i
            ? Ge(N) && Cu(N, s)
            : Ge(N)
              ? N.includes(s) || N.push(s)
              : A
                ? ((p[f] = [s]), C(f) && (y[f] = p[f]))
                : ((f.value = [s]), e.k && (p[e.k] = f.value))
        } else A ? ((p[f] = a), C(f) && (y[f] = a)) : k && ((f.value = a), e.k && (p[e.k] = a))
      }
      a ? ((F.id = -1), ir(F, r)) : F()
    }
  }
}
jl().requestIdleCallback
jl().cancelIdleCallback
const Bs = e => !!e.type.__asyncLoader,
  sp = e => e.type.__isKeepAlive
function gy(e, t) {
  ap(e, 'a', t)
}
function by(e, t) {
  ap(e, 'da', t)
}
function ap(e, t, r = qn) {
  const n =
    e.__wdc ||
    (e.__wdc = () => {
      let i = r
      for (; i; ) {
        if (i.isDeactivated) return
        i = i.parent
      }
      return e()
    })
  if (($l(t, n, r), r)) {
    let i = r.parent
    for (; i && i.parent; ) (sp(i.parent.vnode) && yy(n, t, r, i), (i = i.parent))
  }
}
function yy(e, t, r, n) {
  const i = $l(t, e, n, !0)
  Fu(() => {
    Cu(n[t], i)
  }, r)
}
function $l(e, t, r = qn, n = !1) {
  if (r) {
    const i = r[e] || (r[e] = []),
      s =
        t.__weh ||
        (t.__weh = (...a) => {
          hi()
          const d = da(r),
            f = Ur(t, r, e, a)
          return (d(), pi(), f)
        })
    return (n ? i.unshift(s) : i.push(s), s)
  }
}
const mi =
    e =>
    (t, r = qn) => {
      ;(!Qs || e === 'sp') && $l(e, (...n) => t(...n), r)
    },
  _y = mi('bm'),
  qi = mi('m'),
  wy = mi('bu'),
  xy = mi('u'),
  Sy = mi('bum'),
  Fu = mi('um'),
  Cy = mi('sp'),
  Ty = mi('rtg'),
  Ay = mi('rtc')
function Dy(e, t = qn) {
  $l('ec', e, t)
}
const ky = Symbol.for('v-ndc')
function or(e, t, r, n) {
  let i
  const s = r,
    a = Ge(e)
  if (a || fn(e)) {
    const d = a && Vo(e)
    let f = !1,
      g = !1
    ;(d && ((f = !mr(e)), (g = Hi(e)), (e = Nl(e))), (i = new Array(e.length)))
    for (let p = 0, y = e.length; p < y; p++) i[p] = t(f ? (g ? ml(Cn(e[p])) : Cn(e[p])) : e[p], p, void 0, s)
  } else if (typeof e == 'number') {
    i = new Array(e)
    for (let d = 0; d < e; d++) i[d] = t(d + 1, d, void 0, s)
  } else if (Vt(e))
    if (e[Symbol.iterator]) i = Array.from(e, (d, f) => t(d, f, void 0, s))
    else {
      const d = Object.keys(e)
      i = new Array(d.length)
      for (let f = 0, g = d.length; f < g; f++) {
        const p = d[f]
        i[f] = t(e[p], p, f, s)
      }
    }
  else i = []
  return i
}
const tu = e => (e ? (Dp(e) ? Ul(e) : tu(e.parent)) : null),
  qs = On(Object.create(null), {
    $: e => e,
    $el: e => e.vnode.el,
    $data: e => e.data,
    $props: e => e.props,
    $attrs: e => e.attrs,
    $slots: e => e.slots,
    $refs: e => e.refs,
    $parent: e => tu(e.parent),
    $root: e => tu(e.root),
    $host: e => e.ce,
    $emit: e => e.emit,
    $options: e => cp(e),
    $forceUpdate: e =>
      e.f ||
      (e.f = () => {
        Mu(e.update)
      }),
    $nextTick: e => e.n || (e.n = Bi.bind(e.proxy)),
    $watch: e => Gy.bind(e)
  }),
  Ic = (e, t) => e !== Bt && !e.__isScriptSetup && Lt(e, t),
  Ey = {
    get({ _: e }, t) {
      if (t === '__v_skip') return !0
      const { ctx: r, setupState: n, data: i, props: s, accessCache: a, type: d, appContext: f } = e
      let g
      if (t[0] !== '$') {
        const C = a[t]
        if (C !== void 0)
          switch (C) {
            case 1:
              return n[t]
            case 2:
              return i[t]
            case 4:
              return r[t]
            case 3:
              return s[t]
          }
        else {
          if (Ic(n, t)) return ((a[t] = 1), n[t])
          if (i !== Bt && Lt(i, t)) return ((a[t] = 2), i[t])
          if ((g = e.propsOptions[0]) && Lt(g, t)) return ((a[t] = 3), s[t])
          if (r !== Bt && Lt(r, t)) return ((a[t] = 4), r[t])
          nu && (a[t] = 0)
        }
      }
      const p = qs[t]
      let y, _
      if (p) return (t === '$attrs' && Dn(e.attrs, 'get', ''), p(e))
      if ((y = d.__cssModules) && (y = y[t])) return y
      if (r !== Bt && Lt(r, t)) return ((a[t] = 4), r[t])
      if (((_ = f.config.globalProperties), Lt(_, t))) return _[t]
    },
    set({ _: e }, t, r) {
      const { data: n, setupState: i, ctx: s } = e
      return Ic(i, t)
        ? ((i[t] = r), !0)
        : n !== Bt && Lt(n, t)
          ? ((n[t] = r), !0)
          : Lt(e.props, t) || (t[0] === '$' && t.slice(1) in e)
            ? !1
            : ((s[t] = r), !0)
    },
    has({ _: { data: e, setupState: t, accessCache: r, ctx: n, appContext: i, propsOptions: s } }, a) {
      let d
      return (
        !!r[a] ||
        (e !== Bt && Lt(e, a)) ||
        Ic(t, a) ||
        ((d = s[0]) && Lt(d, a)) ||
        Lt(n, a) ||
        Lt(qs, a) ||
        Lt(i.config.globalProperties, a)
      )
    },
    defineProperty(e, t, r) {
      return (
        r.get != null ? (e._.accessCache[t] = 0) : Lt(r, 'value') && this.set(e, t, r.value, null),
        Reflect.defineProperty(e, t, r)
      )
    }
  }
function tf(e) {
  return Ge(e) ? e.reduce((t, r) => ((t[r] = null), t), {}) : e
}
let nu = !0
function Oy(e) {
  const t = cp(e),
    r = e.proxy,
    n = e.ctx
  ;((nu = !1), t.beforeCreate && nf(t.beforeCreate, e, 'bc'))
  const {
    data: i,
    computed: s,
    methods: a,
    watch: d,
    provide: f,
    inject: g,
    created: p,
    beforeMount: y,
    mounted: _,
    beforeUpdate: C,
    updated: A,
    activated: k,
    deactivated: F,
    beforeDestroy: N,
    beforeUnmount: E,
    destroyed: z,
    unmounted: Y,
    render: ue,
    renderTracked: ke,
    renderTriggered: m,
    errorCaptured: rt,
    serverPrefetch: Ne,
    expose: fe,
    inheritAttrs: He,
    components: it,
    directives: Pe,
    filters: re
  } = t
  if ((g && Py(g, n, null), a))
    for (const Be in a) {
      const We = a[Be]
      lt(We) && (n[Be] = We.bind(r))
    }
  if (i) {
    const Be = i.call(r, r)
    Vt(Be) && (e.data = nn(Be))
  }
  if (((nu = !0), s))
    for (const Be in s) {
      const We = s[Be],
        ht = lt(We) ? We.bind(r, r) : lt(We.get) ? We.get.bind(r, r) : Br,
        At = !lt(We) && lt(We.set) ? We.set.bind(r) : Br,
        Gt = sr({ get: ht, set: At })
      Object.defineProperty(n, Be, {
        enumerable: !0,
        configurable: !0,
        get: () => Gt.value,
        set: Tt => (Gt.value = Tt)
      })
    }
  if (d) for (const Be in d) lp(d[Be], n, r, Be)
  if (f) {
    const Be = lt(f) ? f.call(r) : f
    Reflect.ownKeys(Be).forEach(We => {
      il(We, Be[We])
    })
  }
  p && nf(p, e, 'c')
  function Me(Be, We) {
    Ge(We) ? We.forEach(ht => Be(ht.bind(r))) : We && Be(We.bind(r))
  }
  if (
    (Me(_y, y),
    Me(qi, _),
    Me(wy, C),
    Me(xy, A),
    Me(gy, k),
    Me(by, F),
    Me(Dy, rt),
    Me(Ay, ke),
    Me(Ty, m),
    Me(Sy, E),
    Me(Fu, Y),
    Me(Cy, Ne),
    Ge(fe))
  )
    if (fe.length) {
      const Be = e.exposed || (e.exposed = {})
      fe.forEach(We => {
        Object.defineProperty(Be, We, { get: () => r[We], set: ht => (r[We] = ht) })
      })
    } else e.exposed || (e.exposed = {})
  ;(ue && e.render === Br && (e.render = ue),
    He != null && (e.inheritAttrs = He),
    it && (e.components = it),
    Pe && (e.directives = Pe),
    Ne && op(e))
}
function Py(e, t, r = Br) {
  Ge(e) && (e = ru(e))
  for (const n in e) {
    const i = e[n]
    let s
    ;(Vt(i) ? ('default' in i ? (s = di(i.from || n, i.default, !0)) : (s = di(i.from || n))) : (s = di(i)),
      En(s)
        ? Object.defineProperty(t, n, { enumerable: !0, configurable: !0, get: () => s.value, set: a => (s.value = a) })
        : (t[n] = s))
  }
}
function nf(e, t, r) {
  Ur(Ge(e) ? e.map(n => n.bind(t.proxy)) : e.bind(t.proxy), t, r)
}
function lp(e, t, r, n) {
  let i = n.includes('.') ? xp(r, n) : () => r[n]
  if (fn(e)) {
    const s = t[e]
    lt(s) && ol(i, s)
  } else if (lt(e)) ol(i, e.bind(r))
  else if (Vt(e))
    if (Ge(e)) e.forEach(s => lp(s, t, r, n))
    else {
      const s = lt(e.handler) ? e.handler.bind(r) : t[e.handler]
      lt(s) && ol(i, s, e)
    }
}
function cp(e) {
  const t = e.type,
    { mixins: r, extends: n } = t,
    {
      mixins: i,
      optionsCache: s,
      config: { optionMergeStrategies: a }
    } = e.appContext,
    d = s.get(t)
  let f
  return (
    d
      ? (f = d)
      : !i.length && !r && !n
        ? (f = t)
        : ((f = {}), i.length && i.forEach(g => yl(f, g, a, !0)), yl(f, t, a)),
    Vt(t) && s.set(t, f),
    f
  )
}
function yl(e, t, r, n = !1) {
  const { mixins: i, extends: s } = t
  ;(s && yl(e, s, r, !0), i && i.forEach(a => yl(e, a, r, !0)))
  for (const a in t)
    if (!(n && a === 'expose')) {
      const d = Ry[a] || (r && r[a])
      e[a] = d ? d(e[a], t[a]) : t[a]
    }
  return e
}
const Ry = {
  data: rf,
  props: of,
  emits: of,
  methods: Is,
  computed: Is,
  beforeCreate: Hn,
  created: Hn,
  beforeMount: Hn,
  mounted: Hn,
  beforeUpdate: Hn,
  updated: Hn,
  beforeDestroy: Hn,
  beforeUnmount: Hn,
  destroyed: Hn,
  unmounted: Hn,
  activated: Hn,
  deactivated: Hn,
  errorCaptured: Hn,
  serverPrefetch: Hn,
  components: Is,
  directives: Is,
  watch: My,
  provide: rf,
  inject: Ly
}
function rf(e, t) {
  return t
    ? e
      ? function () {
          return On(lt(e) ? e.call(this, this) : e, lt(t) ? t.call(this, this) : t)
        }
      : t
    : e
}
function Ly(e, t) {
  return Is(ru(e), ru(t))
}
function ru(e) {
  if (Ge(e)) {
    const t = {}
    for (let r = 0; r < e.length; r++) t[e[r]] = e[r]
    return t
  }
  return e
}
function Hn(e, t) {
  return e ? [...new Set([].concat(e, t))] : t
}
function Is(e, t) {
  return e ? On(Object.create(null), e, t) : t
}
function of(e, t) {
  return e ? (Ge(e) && Ge(t) ? [...new Set([...e, ...t])] : On(Object.create(null), tf(e), tf(t ?? {}))) : t
}
function My(e, t) {
  if (!e) return t
  if (!t) return e
  const r = On(Object.create(null), e)
  for (const n in t) r[n] = Hn(e[n], t[n])
  return r
}
function up() {
  return {
    app: null,
    config: {
      isNativeTag: Ab,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  }
}
let Iy = 0
function Fy(e, t) {
  return function (n, i = null) {
    ;(lt(n) || (n = On({}, n)), i != null && !Vt(i) && (i = null))
    const s = up(),
      a = new WeakSet(),
      d = []
    let f = !1
    const g = (s.app = {
      _uid: Iy++,
      _component: n,
      _props: i,
      _container: null,
      _context: s,
      _instance: null,
      version: v_,
      get config() {
        return s.config
      },
      set config(p) {},
      use(p, ...y) {
        return (a.has(p) || (p && lt(p.install) ? (a.add(p), p.install(g, ...y)) : lt(p) && (a.add(p), p(g, ...y))), g)
      },
      mixin(p) {
        return (s.mixins.includes(p) || s.mixins.push(p), g)
      },
      component(p, y) {
        return y ? ((s.components[p] = y), g) : s.components[p]
      },
      directive(p, y) {
        return y ? ((s.directives[p] = y), g) : s.directives[p]
      },
      mount(p, y, _) {
        if (!f) {
          const C = g._ceVNode || Jn(n, i)
          return (
            (C.appContext = s),
            _ === !0 ? (_ = 'svg') : _ === !1 && (_ = void 0),
            e(C, p, _),
            (f = !0),
            (g._container = p),
            (p.__vue_app__ = g),
            Ul(C.component)
          )
        }
      },
      onUnmount(p) {
        d.push(p)
      },
      unmount() {
        f && (Ur(d, g._instance, 16), e(null, g._container), delete g._container.__vue_app__)
      },
      provide(p, y) {
        return ((s.provides[p] = y), g)
      },
      runWithContext(p) {
        const y = Xo
        Xo = g
        try {
          return p()
        } finally {
          Xo = y
        }
      }
    })
    return g
  }
}
let Xo = null
function il(e, t) {
  if (qn) {
    let r = qn.provides
    const n = qn.parent && qn.parent.provides
    ;(n === r && (r = qn.provides = Object.create(n)), (r[e] = t))
  }
}
function di(e, t, r = !1) {
  const n = qn || pr
  if (n || Xo) {
    let i = Xo
      ? Xo._context.provides
      : n
        ? n.parent == null || n.ce
          ? n.vnode.appContext && n.vnode.appContext.provides
          : n.parent.provides
        : void 0
    if (i && e in i) return i[e]
    if (arguments.length > 1) return r && lt(t) ? t.call(n && n.proxy) : t
  }
}
const dp = {},
  fp = () => Object.create(dp),
  hp = e => Object.getPrototypeOf(e) === dp
function jy(e, t, r, n = !1) {
  const i = {},
    s = fp()
  ;((e.propsDefaults = Object.create(null)), pp(e, t, i, s))
  for (const a in e.propsOptions[0]) a in i || (i[a] = void 0)
  ;(r ? (e.props = n ? i : Xh(i)) : e.type.props ? (e.props = i) : (e.props = s), (e.attrs = s))
}
function Ny(e, t, r, n) {
  const {
      props: i,
      attrs: s,
      vnode: { patchFlag: a }
    } = e,
    d = Rt(i),
    [f] = e.propsOptions
  let g = !1
  if ((n || a > 0) && !(a & 16)) {
    if (a & 8) {
      const p = e.vnode.dynamicProps
      for (let y = 0; y < p.length; y++) {
        let _ = p[y]
        if (Bl(e.emitsOptions, _)) continue
        const C = t[_]
        if (f)
          if (Lt(s, _)) C !== s[_] && ((s[_] = C), (g = !0))
          else {
            const A = Ni(_)
            i[A] = iu(f, d, A, C, e, !1)
          }
        else C !== s[_] && ((s[_] = C), (g = !0))
      }
    }
  } else {
    pp(e, t, i, s) && (g = !0)
    let p
    for (const y in d)
      (!t || (!Lt(t, y) && ((p = bo(y)) === y || !Lt(t, p)))) &&
        (f ? r && (r[y] !== void 0 || r[p] !== void 0) && (i[y] = iu(f, d, y, void 0, e, !0)) : delete i[y])
    if (s !== d) for (const y in s) (!t || !Lt(t, y)) && (delete s[y], (g = !0))
  }
  g && li(e.attrs, 'set', '')
}
function pp(e, t, r, n) {
  const [i, s] = e.propsOptions
  let a = !1,
    d
  if (t)
    for (let f in t) {
      if (js(f)) continue
      const g = t[f]
      let p
      i && Lt(i, (p = Ni(f)))
        ? !s || !s.includes(p)
          ? (r[p] = g)
          : ((d || (d = {}))[p] = g)
        : Bl(e.emitsOptions, f) || ((!(f in n) || g !== n[f]) && ((n[f] = g), (a = !0)))
    }
  if (s) {
    const f = Rt(r),
      g = d || Bt
    for (let p = 0; p < s.length; p++) {
      const y = s[p]
      r[y] = iu(i, f, y, g[y], e, !Lt(g, y))
    }
  }
  return a
}
function iu(e, t, r, n, i, s) {
  const a = e[r]
  if (a != null) {
    const d = Lt(a, 'default')
    if (d && n === void 0) {
      const f = a.default
      if (a.type !== Function && !a.skipFactory && lt(f)) {
        const { propsDefaults: g } = i
        if (r in g) n = g[r]
        else {
          const p = da(i)
          ;((n = g[r] = f.call(null, t)), p())
        }
      } else n = f
      i.ce && i.ce._setProp(r, n)
    }
    a[0] && (s && !d ? (n = !1) : a[1] && (n === '' || n === bo(r)) && (n = !0))
  }
  return n
}
const Hy = new WeakMap()
function mp(e, t, r = !1) {
  const n = r ? Hy : t.propsCache,
    i = n.get(e)
  if (i) return i
  const s = e.props,
    a = {},
    d = []
  let f = !1
  if (!lt(e)) {
    const p = y => {
      f = !0
      const [_, C] = mp(y, t, !0)
      ;(On(a, _), C && d.push(...C))
    }
    ;(!r && t.mixins.length && t.mixins.forEach(p), e.extends && p(e.extends), e.mixins && e.mixins.forEach(p))
  }
  if (!s && !f) return (Vt(e) && n.set(e, Uo), Uo)
  if (Ge(s))
    for (let p = 0; p < s.length; p++) {
      const y = Ni(s[p])
      sf(y) && (a[y] = Bt)
    }
  else if (s)
    for (const p in s) {
      const y = Ni(p)
      if (sf(y)) {
        const _ = s[p],
          C = (a[y] = Ge(_) || lt(_) ? { type: _ } : On({}, _)),
          A = C.type
        let k = !1,
          F = !0
        if (Ge(A))
          for (let N = 0; N < A.length; ++N) {
            const E = A[N],
              z = lt(E) && E.name
            if (z === 'Boolean') {
              k = !0
              break
            } else z === 'String' && (F = !1)
          }
        else k = lt(A) && A.name === 'Boolean'
        ;((C[0] = k), (C[1] = F), (k || Lt(C, 'default')) && d.push(y))
      }
    }
  const g = [a, d]
  return (Vt(e) && n.set(e, g), g)
}
function sf(e) {
  return e[0] !== '$' && !js(e)
}
const ju = e => e[0] === '_' || e === '$stable',
  Nu = e => (Ge(e) ? e.map($r) : [$r(e)]),
  $y = (e, t, r) => {
    if (t._n) return t
    const n = py((...i) => Nu(t(...i)), r)
    return ((n._c = !1), n)
  },
  vp = (e, t, r) => {
    const n = e._ctx
    for (const i in e) {
      if (ju(i)) continue
      const s = e[i]
      if (lt(s)) t[i] = $y(i, s, n)
      else if (s != null) {
        const a = Nu(s)
        t[i] = () => a
      }
    }
  },
  gp = (e, t) => {
    const r = Nu(t)
    e.slots.default = () => r
  },
  bp = (e, t, r) => {
    for (const n in t) (r || !ju(n)) && (e[n] = t[n])
  },
  By = (e, t, r) => {
    const n = (e.slots = fp())
    if (e.vnode.shapeFlag & 32) {
      const i = t.__
      i && Jc(n, '__', i, !0)
      const s = t._
      s ? (bp(n, t, r), r && Jc(n, '_', s, !0)) : vp(t, n)
    } else t && gp(e, t)
  },
  qy = (e, t, r) => {
    const { vnode: n, slots: i } = e
    let s = !0,
      a = Bt
    if (n.shapeFlag & 32) {
      const d = t._
      ;(d ? (r && d === 1 ? (s = !1) : bp(i, t, r)) : ((s = !t.$stable), vp(t, i)), (a = t))
    } else t && (gp(e, t), (a = { default: 1 }))
    if (s) for (const d in i) !ju(d) && a[d] == null && delete i[d]
  },
  ir = n_
function Uy(e) {
  return Wy(e)
}
function Wy(e, t) {
  const r = jl()
  r.__VUE__ = !0
  const {
      insert: n,
      remove: i,
      patchProp: s,
      createElement: a,
      createText: d,
      createComment: f,
      setText: g,
      setElementText: p,
      parentNode: y,
      nextSibling: _,
      setScopeId: C = Br,
      insertStaticContent: A
    } = e,
    k = (R, M, q, te = null, ie = null, ne = null, ge = void 0, me = null, ye = !!M.dynamicChildren) => {
      if (R === M) return
      ;(R && !Os(R, M) && ((te = K(R)), Tt(R, ie, ne, !0), (R = null)),
        M.patchFlag === -2 && ((ye = !1), (M.dynamicChildren = null)))
      const { type: de, ref: Oe, shapeFlag: we } = M
      switch (de) {
        case ql:
          F(R, M, q, te)
          break
        case $i:
          N(R, M, q, te)
          break
        case sl:
          R == null && E(M, q, te, ge)
          break
        case tn:
          it(R, M, q, te, ie, ne, ge, me, ye)
          break
        default:
          we & 1
            ? ue(R, M, q, te, ie, ne, ge, me, ye)
            : we & 6
              ? Pe(R, M, q, te, ie, ne, ge, me, ye)
              : (we & 64 || we & 128) && de.process(R, M, q, te, ie, ne, ge, me, ye, Ce)
      }
      Oe != null && ie
        ? $s(Oe, R && R.ref, ne, M || R, !M)
        : Oe == null && R && R.ref != null && $s(R.ref, null, ne, R, !0)
    },
    F = (R, M, q, te) => {
      if (R == null) n((M.el = d(M.children)), q, te)
      else {
        const ie = (M.el = R.el)
        M.children !== R.children && g(ie, M.children)
      }
    },
    N = (R, M, q, te) => {
      R == null ? n((M.el = f(M.children || '')), q, te) : (M.el = R.el)
    },
    E = (R, M, q, te) => {
      ;[R.el, R.anchor] = A(R.children, M, q, te, R.el, R.anchor)
    },
    z = ({ el: R, anchor: M }, q, te) => {
      let ie
      for (; R && R !== M; ) ((ie = _(R)), n(R, q, te), (R = ie))
      n(M, q, te)
    },
    Y = ({ el: R, anchor: M }) => {
      let q
      for (; R && R !== M; ) ((q = _(R)), i(R), (R = q))
      i(M)
    },
    ue = (R, M, q, te, ie, ne, ge, me, ye) => {
      ;(M.type === 'svg' ? (ge = 'svg') : M.type === 'math' && (ge = 'mathml'),
        R == null ? ke(M, q, te, ie, ne, ge, me, ye) : Ne(R, M, ie, ne, ge, me, ye))
    },
    ke = (R, M, q, te, ie, ne, ge, me) => {
      let ye, de
      const { props: Oe, shapeFlag: we, transition: Ie, dirs: se } = R
      if (
        ((ye = R.el = a(R.type, ne, Oe && Oe.is, Oe)),
        we & 8 ? p(ye, R.children) : we & 16 && rt(R.children, ye, null, te, ie, Fc(R, ne), ge, me),
        se && co(R, null, te, 'created'),
        m(ye, R, R.scopeId, ge, te),
        Oe)
      ) {
        for (const Ot in Oe) Ot !== 'value' && !js(Ot) && s(ye, Ot, null, Oe[Ot], ne, te)
        ;('value' in Oe && s(ye, 'value', null, Oe.value, ne), (de = Oe.onVnodeBeforeMount) && jr(de, te, R))
      }
      se && co(R, null, te, 'beforeMount')
      const Ve = Vy(ie, Ie)
      ;(Ve && Ie.beforeEnter(ye),
        n(ye, M, q),
        ((de = Oe && Oe.onVnodeMounted) || Ve || se) &&
          ir(() => {
            ;(de && jr(de, te, R), Ve && Ie.enter(ye), se && co(R, null, te, 'mounted'))
          }, ie))
    },
    m = (R, M, q, te, ie) => {
      if ((q && C(R, q), te)) for (let ne = 0; ne < te.length; ne++) C(R, te[ne])
      if (ie) {
        let ne = ie.subTree
        if (M === ne || (Cp(ne.type) && (ne.ssContent === M || ne.ssFallback === M))) {
          const ge = ie.vnode
          m(R, ge, ge.scopeId, ge.slotScopeIds, ie.parent)
        }
      }
    },
    rt = (R, M, q, te, ie, ne, ge, me, ye = 0) => {
      for (let de = ye; de < R.length; de++) {
        const Oe = (R[de] = me ? Ri(R[de]) : $r(R[de]))
        k(null, Oe, M, q, te, ie, ne, ge, me)
      }
    },
    Ne = (R, M, q, te, ie, ne, ge) => {
      const me = (M.el = R.el)
      let { patchFlag: ye, dynamicChildren: de, dirs: Oe } = M
      ye |= R.patchFlag & 16
      const we = R.props || Bt,
        Ie = M.props || Bt
      let se
      if (
        (q && uo(q, !1),
        (se = Ie.onVnodeBeforeUpdate) && jr(se, q, M, R),
        Oe && co(M, R, q, 'beforeUpdate'),
        q && uo(q, !0),
        ((we.innerHTML && Ie.innerHTML == null) || (we.textContent && Ie.textContent == null)) && p(me, ''),
        de ? fe(R.dynamicChildren, de, me, q, te, Fc(M, ie), ne) : ge || We(R, M, me, null, q, te, Fc(M, ie), ne, !1),
        ye > 0)
      ) {
        if (ye & 16) He(me, we, Ie, q, ie)
        else if (
          (ye & 2 && we.class !== Ie.class && s(me, 'class', null, Ie.class, ie),
          ye & 4 && s(me, 'style', we.style, Ie.style, ie),
          ye & 8)
        ) {
          const Ve = M.dynamicProps
          for (let Ot = 0; Ot < Ve.length; Ot++) {
            const St = Ve[Ot],
              cn = we[St],
              on = Ie[St]
            ;(on !== cn || St === 'value') && s(me, St, cn, on, ie, q)
          }
        }
        ye & 1 && R.children !== M.children && p(me, M.children)
      } else !ge && de == null && He(me, we, Ie, q, ie)
      ;((se = Ie.onVnodeUpdated) || Oe) &&
        ir(() => {
          ;(se && jr(se, q, M, R), Oe && co(M, R, q, 'updated'))
        }, te)
    },
    fe = (R, M, q, te, ie, ne, ge) => {
      for (let me = 0; me < M.length; me++) {
        const ye = R[me],
          de = M[me],
          Oe = ye.el && (ye.type === tn || !Os(ye, de) || ye.shapeFlag & 198) ? y(ye.el) : q
        k(ye, de, Oe, null, te, ie, ne, ge, !0)
      }
    },
    He = (R, M, q, te, ie) => {
      if (M !== q) {
        if (M !== Bt) for (const ne in M) !js(ne) && !(ne in q) && s(R, ne, M[ne], null, ie, te)
        for (const ne in q) {
          if (js(ne)) continue
          const ge = q[ne],
            me = M[ne]
          ge !== me && ne !== 'value' && s(R, ne, me, ge, ie, te)
        }
        'value' in q && s(R, 'value', M.value, q.value, ie)
      }
    },
    it = (R, M, q, te, ie, ne, ge, me, ye) => {
      const de = (M.el = R ? R.el : d('')),
        Oe = (M.anchor = R ? R.anchor : d(''))
      let { patchFlag: we, dynamicChildren: Ie, slotScopeIds: se } = M
      ;(se && (me = me ? me.concat(se) : se),
        R == null
          ? (n(de, q, te), n(Oe, q, te), rt(M.children || [], q, Oe, ie, ne, ge, me, ye))
          : we > 0 && we & 64 && Ie && R.dynamicChildren
            ? (fe(R.dynamicChildren, Ie, q, ie, ne, ge, me),
              (M.key != null || (ie && M === ie.subTree)) && yp(R, M, !0))
            : We(R, M, q, Oe, ie, ne, ge, me, ye))
    },
    Pe = (R, M, q, te, ie, ne, ge, me, ye) => {
      ;((M.slotScopeIds = me),
        R == null
          ? M.shapeFlag & 512
            ? ie.ctx.activate(M, q, te, ge, ye)
            : re(M, q, te, ie, ne, ge, ye)
          : Ee(R, M, ye))
    },
    re = (R, M, q, te, ie, ne, ge) => {
      const me = (R.component = u_(R, te, ie))
      if ((sp(R) && (me.ctx.renderer = Ce), d_(me, !1, ge), me.asyncDep)) {
        if ((ie && ie.registerDep(me, Me, ge), !R.el)) {
          const ye = (me.subTree = Jn($i))
          N(null, ye, M, q)
        }
      } else Me(me, R, M, q, ie, ne, ge)
    },
    Ee = (R, M, q) => {
      const te = (M.component = R.component)
      if (e_(R, M, q))
        if (te.asyncDep && !te.asyncResolved) {
          Be(te, M, q)
          return
        } else ((te.next = M), te.update())
      else ((M.el = R.el), (te.vnode = M))
    },
    Me = (R, M, q, te, ie, ne, ge) => {
      const me = () => {
        if (R.isMounted) {
          let { next: we, bu: Ie, u: se, parent: Ve, vnode: Ot } = R
          {
            const hn = _p(R)
            if (hn) {
              ;(we && ((we.el = Ot.el), Be(R, we, ge)),
                hn.asyncDep.then(() => {
                  R.isUnmounted || me()
                }))
              return
            }
          }
          let St = we,
            cn
          ;(uo(R, !1),
            we ? ((we.el = Ot.el), Be(R, we, ge)) : (we = Ot),
            Ie && rl(Ie),
            (cn = we.props && we.props.onVnodeBeforeUpdate) && jr(cn, Ve, we, Ot),
            uo(R, !0))
          const on = lf(R),
            bn = R.subTree
          ;((R.subTree = on),
            k(bn, on, y(bn.el), K(bn), R, ie, ne),
            (we.el = on.el),
            St === null && t_(R, on.el),
            se && ir(se, ie),
            (cn = we.props && we.props.onVnodeUpdated) && ir(() => jr(cn, Ve, we, Ot), ie))
        } else {
          let we
          const { el: Ie, props: se } = M,
            { bm: Ve, m: Ot, parent: St, root: cn, type: on } = R,
            bn = Bs(M)
          ;(uo(R, !1), Ve && rl(Ve), !bn && (we = se && se.onVnodeBeforeMount) && jr(we, St, M), uo(R, !0))
          {
            cn.ce && cn.ce._def.shadowRoot !== !1 && cn.ce._injectChildStyle(on)
            const hn = (R.subTree = lf(R))
            ;(k(null, hn, q, te, R, ie, ne), (M.el = hn.el))
          }
          if ((Ot && ir(Ot, ie), !bn && (we = se && se.onVnodeMounted))) {
            const hn = M
            ir(() => jr(we, St, hn), ie)
          }
          ;((M.shapeFlag & 256 || (St && Bs(St.vnode) && St.vnode.shapeFlag & 256)) && R.a && ir(R.a, ie),
            (R.isMounted = !0),
            (M = q = te = null))
        }
      }
      R.scope.on()
      const ye = (R.effect = new Mh(me))
      R.scope.off()
      const de = (R.update = ye.run.bind(ye)),
        Oe = (R.job = ye.runIfDirty.bind(ye))
      ;((Oe.i = R), (Oe.id = R.uid), (ye.scheduler = () => Mu(Oe)), uo(R, !0), de())
    },
    Be = (R, M, q) => {
      M.component = R
      const te = R.vnode.props
      ;((R.vnode = M), (R.next = null), Ny(R, M.props, te, q), qy(R, M.children, q), hi(), ef(R), pi())
    },
    We = (R, M, q, te, ie, ne, ge, me, ye = !1) => {
      const de = R && R.children,
        Oe = R ? R.shapeFlag : 0,
        we = M.children,
        { patchFlag: Ie, shapeFlag: se } = M
      if (Ie > 0) {
        if (Ie & 128) {
          At(de, we, q, te, ie, ne, ge, me, ye)
          return
        } else if (Ie & 256) {
          ht(de, we, q, te, ie, ne, ge, me, ye)
          return
        }
      }
      se & 8
        ? (Oe & 16 && $e(de, ie, ne), we !== de && p(q, we))
        : Oe & 16
          ? se & 16
            ? At(de, we, q, te, ie, ne, ge, me, ye)
            : $e(de, ie, ne, !0)
          : (Oe & 8 && p(q, ''), se & 16 && rt(we, q, te, ie, ne, ge, me, ye))
    },
    ht = (R, M, q, te, ie, ne, ge, me, ye) => {
      ;((R = R || Uo), (M = M || Uo))
      const de = R.length,
        Oe = M.length,
        we = Math.min(de, Oe)
      let Ie
      for (Ie = 0; Ie < we; Ie++) {
        const se = (M[Ie] = ye ? Ri(M[Ie]) : $r(M[Ie]))
        k(R[Ie], se, q, null, ie, ne, ge, me, ye)
      }
      de > Oe ? $e(R, ie, ne, !0, !1, we) : rt(M, q, te, ie, ne, ge, me, ye, we)
    },
    At = (R, M, q, te, ie, ne, ge, me, ye) => {
      let de = 0
      const Oe = M.length
      let we = R.length - 1,
        Ie = Oe - 1
      for (; de <= we && de <= Ie; ) {
        const se = R[de],
          Ve = (M[de] = ye ? Ri(M[de]) : $r(M[de]))
        if (Os(se, Ve)) k(se, Ve, q, null, ie, ne, ge, me, ye)
        else break
        de++
      }
      for (; de <= we && de <= Ie; ) {
        const se = R[we],
          Ve = (M[Ie] = ye ? Ri(M[Ie]) : $r(M[Ie]))
        if (Os(se, Ve)) k(se, Ve, q, null, ie, ne, ge, me, ye)
        else break
        ;(we--, Ie--)
      }
      if (de > we) {
        if (de <= Ie) {
          const se = Ie + 1,
            Ve = se < Oe ? M[se].el : te
          for (; de <= Ie; ) (k(null, (M[de] = ye ? Ri(M[de]) : $r(M[de])), q, Ve, ie, ne, ge, me, ye), de++)
        }
      } else if (de > Ie) for (; de <= we; ) (Tt(R[de], ie, ne, !0), de++)
      else {
        const se = de,
          Ve = de,
          Ot = new Map()
        for (de = Ve; de <= Ie; de++) {
          const Yt = (M[de] = ye ? Ri(M[de]) : $r(M[de]))
          Yt.key != null && Ot.set(Yt.key, de)
        }
        let St,
          cn = 0
        const on = Ie - Ve + 1
        let bn = !1,
          hn = 0
        const sn = new Array(on)
        for (de = 0; de < on; de++) sn[de] = 0
        for (de = se; de <= we; de++) {
          const Yt = R[de]
          if (cn >= on) {
            Tt(Yt, ie, ne, !0)
            continue
          }
          let Rn
          if (Yt.key != null) Rn = Ot.get(Yt.key)
          else
            for (St = Ve; St <= Ie; St++)
              if (sn[St - Ve] === 0 && Os(Yt, M[St])) {
                Rn = St
                break
              }
          Rn === void 0
            ? Tt(Yt, ie, ne, !0)
            : ((sn[Rn - Ve] = de + 1),
              Rn >= hn ? (hn = Rn) : (bn = !0),
              k(Yt, M[Rn], q, null, ie, ne, ge, me, ye),
              cn++)
        }
        const Un = bn ? zy(sn) : Uo
        for (St = Un.length - 1, de = on - 1; de >= 0; de--) {
          const Yt = Ve + de,
            Rn = M[Yt],
            Wn = Yt + 1 < Oe ? M[Yt + 1].el : te
          sn[de] === 0
            ? k(null, Rn, q, Wn, ie, ne, ge, me, ye)
            : bn && (St < 0 || de !== Un[St] ? Gt(Rn, q, Wn, 2) : St--)
        }
      }
    },
    Gt = (R, M, q, te, ie = null) => {
      const { el: ne, type: ge, transition: me, children: ye, shapeFlag: de } = R
      if (de & 6) {
        Gt(R.component.subTree, M, q, te)
        return
      }
      if (de & 128) {
        R.suspense.move(M, q, te)
        return
      }
      if (de & 64) {
        ge.move(R, M, q, Ce)
        return
      }
      if (ge === tn) {
        n(ne, M, q)
        for (let we = 0; we < ye.length; we++) Gt(ye[we], M, q, te)
        n(R.anchor, M, q)
        return
      }
      if (ge === sl) {
        z(R, M, q)
        return
      }
      if (te !== 2 && de & 1 && me)
        if (te === 0) (me.beforeEnter(ne), n(ne, M, q), ir(() => me.enter(ne), ie))
        else {
          const { leave: we, delayLeave: Ie, afterLeave: se } = me,
            Ve = () => {
              R.ctx.isUnmounted ? i(ne) : n(ne, M, q)
            },
            Ot = () => {
              we(ne, () => {
                ;(Ve(), se && se())
              })
            }
          Ie ? Ie(ne, Ve, Ot) : Ot()
        }
      else n(ne, M, q)
    },
    Tt = (R, M, q, te = !1, ie = !1) => {
      const {
        type: ne,
        props: ge,
        ref: me,
        children: ye,
        dynamicChildren: de,
        shapeFlag: Oe,
        patchFlag: we,
        dirs: Ie,
        cacheIndex: se
      } = R
      if (
        (we === -2 && (ie = !1),
        me != null && (hi(), $s(me, null, q, R, !0), pi()),
        se != null && (M.renderCache[se] = void 0),
        Oe & 256)
      ) {
        M.ctx.deactivate(R)
        return
      }
      const Ve = Oe & 1 && Ie,
        Ot = !Bs(R)
      let St
      if ((Ot && (St = ge && ge.onVnodeBeforeUnmount) && jr(St, M, R), Oe & 6)) Ke(R.component, q, te)
      else {
        if (Oe & 128) {
          R.suspense.unmount(q, te)
          return
        }
        ;(Ve && co(R, null, M, 'beforeUnmount'),
          Oe & 64
            ? R.type.remove(R, M, q, Ce, te)
            : de && !de.hasOnce && (ne !== tn || (we > 0 && we & 64))
              ? $e(de, M, q, !1, !0)
              : ((ne === tn && we & 384) || (!ie && Oe & 16)) && $e(ye, M, q),
          te && rn(R))
      }
      ;((Ot && (St = ge && ge.onVnodeUnmounted)) || Ve) &&
        ir(() => {
          ;(St && jr(St, M, R), Ve && co(R, null, M, 'unmounted'))
        }, q)
    },
    rn = R => {
      const { type: M, el: q, anchor: te, transition: ie } = R
      if (M === tn) {
        _e(q, te)
        return
      }
      if (M === sl) {
        Y(R)
        return
      }
      const ne = () => {
        ;(i(q), ie && !ie.persisted && ie.afterLeave && ie.afterLeave())
      }
      if (R.shapeFlag & 1 && ie && !ie.persisted) {
        const { leave: ge, delayLeave: me } = ie,
          ye = () => ge(q, ne)
        me ? me(R.el, ne, ye) : ye()
      } else ne()
    },
    _e = (R, M) => {
      let q
      for (; R !== M; ) ((q = _(R)), i(R), (R = q))
      i(M)
    },
    Ke = (R, M, q) => {
      const {
        bum: te,
        scope: ie,
        job: ne,
        subTree: ge,
        um: me,
        m: ye,
        a: de,
        parent: Oe,
        slots: { __: we }
      } = R
      ;(af(ye),
        af(de),
        te && rl(te),
        Oe &&
          Ge(we) &&
          we.forEach(Ie => {
            Oe.renderCache[Ie] = void 0
          }),
        ie.stop(),
        ne && ((ne.flags |= 8), Tt(ge, R, M, q)),
        me && ir(me, M),
        ir(() => {
          R.isUnmounted = !0
        }, M),
        M &&
          M.pendingBranch &&
          !M.isUnmounted &&
          R.asyncDep &&
          !R.asyncResolved &&
          R.suspenseId === M.pendingId &&
          (M.deps--, M.deps === 0 && M.resolve()))
    },
    $e = (R, M, q, te = !1, ie = !1, ne = 0) => {
      for (let ge = ne; ge < R.length; ge++) Tt(R[ge], M, q, te, ie)
    },
    K = R => {
      if (R.shapeFlag & 6) return K(R.component.subTree)
      if (R.shapeFlag & 128) return R.suspense.next()
      const M = _(R.anchor || R.el),
        q = M && M[my]
      return q ? _(q) : M
    }
  let ve = !1
  const Se = (R, M, q) => {
      ;(R == null ? M._vnode && Tt(M._vnode, null, null, !0) : k(M._vnode || null, R, M, null, null, null, q),
        (M._vnode = R),
        ve || ((ve = !0), ef(), tp(), (ve = !1)))
    },
    Ce = { p: k, um: Tt, m: Gt, r: rn, mt: re, mc: rt, pc: We, pbc: fe, n: K, o: e }
  return { render: Se, hydrate: void 0, createApp: Fy(Se) }
}
function Fc({ type: e, props: t }, r) {
  return (r === 'svg' && e === 'foreignObject') ||
    (r === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
    ? void 0
    : r
}
function uo({ effect: e, job: t }, r) {
  r ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5))
}
function Vy(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted
}
function yp(e, t, r = !1) {
  const n = e.children,
    i = t.children
  if (Ge(n) && Ge(i))
    for (let s = 0; s < n.length; s++) {
      const a = n[s]
      let d = i[s]
      ;(d.shapeFlag & 1 &&
        !d.dynamicChildren &&
        ((d.patchFlag <= 0 || d.patchFlag === 32) && ((d = i[s] = Ri(i[s])), (d.el = a.el)),
        !r && d.patchFlag !== -2 && yp(a, d)),
        d.type === ql && (d.el = a.el),
        d.type === $i && !d.el && (d.el = a.el))
    }
}
function zy(e) {
  const t = e.slice(),
    r = [0]
  let n, i, s, a, d
  const f = e.length
  for (n = 0; n < f; n++) {
    const g = e[n]
    if (g !== 0) {
      if (((i = r[r.length - 1]), e[i] < g)) {
        ;((t[n] = i), r.push(n))
        continue
      }
      for (s = 0, a = r.length - 1; s < a; ) ((d = (s + a) >> 1), e[r[d]] < g ? (s = d + 1) : (a = d))
      g < e[r[s]] && (s > 0 && (t[n] = r[s - 1]), (r[s] = n))
    }
  }
  for (s = r.length, a = r[s - 1]; s-- > 0; ) ((r[s] = a), (a = t[a]))
  return r
}
function _p(e) {
  const t = e.subTree.component
  if (t) return t.asyncDep && !t.asyncResolved ? t : _p(t)
}
function af(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8
}
const Ky = Symbol.for('v-scx'),
  Xy = () => di(Ky)
function ol(e, t, r) {
  return wp(e, t, r)
}
function wp(e, t, r = Bt) {
  const { immediate: n, deep: i, flush: s, once: a } = r,
    d = On({}, r),
    f = (t && n) || (!t && s !== 'post')
  let g
  if (Qs) {
    if (s === 'sync') {
      const C = Xy()
      g = C.__watcherHandles || (C.__watcherHandles = [])
    } else if (!f) {
      const C = () => {}
      return ((C.stop = Br), (C.resume = Br), (C.pause = Br), C)
    }
  }
  const p = qn
  d.call = (C, A, k) => Ur(C, p, A, k)
  let y = !1
  ;(s === 'post'
    ? (d.scheduler = C => {
        ir(C, p && p.suspense)
      })
    : s !== 'sync' &&
      ((y = !0),
      (d.scheduler = (C, A) => {
        A ? C() : Mu(C)
      })),
    (d.augmentJob = C => {
      ;(t && (C.flags |= 4), y && ((C.flags |= 2), p && ((C.id = p.uid), (C.i = p))))
    }))
  const _ = uy(e, t, d)
  return (Qs && (g ? g.push(_) : f && _()), _)
}
function Gy(e, t, r) {
  const n = this.proxy,
    i = fn(e) ? (e.includes('.') ? xp(n, e) : () => n[e]) : e.bind(n, n)
  let s
  lt(t) ? (s = t) : ((s = t.handler), (r = t))
  const a = da(this),
    d = wp(i, s.bind(n), r)
  return (a(), d)
}
function xp(e, t) {
  const r = t.split('.')
  return () => {
    let n = e
    for (let i = 0; i < r.length && n; i++) n = n[r[i]]
    return n
  }
}
const Jy = (e, t) =>
  t === 'modelValue' || t === 'model-value'
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${Ni(t)}Modifiers`] || e[`${bo(t)}Modifiers`]
function Yy(e, t, ...r) {
  if (e.isUnmounted) return
  const n = e.vnode.props || Bt
  let i = r
  const s = t.startsWith('update:'),
    a = s && Jy(n, t.slice(7))
  a && (a.trim && (i = r.map(p => (fn(p) ? p.trim() : p))), a.number && (i = r.map(pl)))
  let d,
    f = n[(d = Oc(t))] || n[(d = Oc(Ni(t)))]
  ;(!f && s && (f = n[(d = Oc(bo(t)))]), f && Ur(f, e, 6, i))
  const g = n[d + 'Once']
  if (g) {
    if (!e.emitted) e.emitted = {}
    else if (e.emitted[d]) return
    ;((e.emitted[d] = !0), Ur(g, e, 6, i))
  }
}
function Sp(e, t, r = !1) {
  const n = t.emitsCache,
    i = n.get(e)
  if (i !== void 0) return i
  const s = e.emits
  let a = {},
    d = !1
  if (!lt(e)) {
    const f = g => {
      const p = Sp(g, t, !0)
      p && ((d = !0), On(a, p))
    }
    ;(!r && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f))
  }
  return !s && !d
    ? (Vt(e) && n.set(e, null), null)
    : (Ge(s) ? s.forEach(f => (a[f] = null)) : On(a, s), Vt(e) && n.set(e, a), a)
}
function Bl(e, t) {
  return !e || !Il(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, '')), Lt(e, t[0].toLowerCase() + t.slice(1)) || Lt(e, bo(t)) || Lt(e, t))
}
function lf(e) {
  const {
      type: t,
      vnode: r,
      proxy: n,
      withProxy: i,
      propsOptions: [s],
      slots: a,
      attrs: d,
      emit: f,
      render: g,
      renderCache: p,
      props: y,
      data: _,
      setupState: C,
      ctx: A,
      inheritAttrs: k
    } = e,
    F = bl(e)
  let N, E
  try {
    if (r.shapeFlag & 4) {
      const Y = i || n,
        ue = Y
      ;((N = $r(g.call(ue, Y, p, y, C, _, A))), (E = d))
    } else {
      const Y = t
      ;((N = $r(Y.length > 1 ? Y(y, { attrs: d, slots: a, emit: f }) : Y(y, null))), (E = t.props ? d : Qy(d)))
    }
  } catch (Y) {
    ;((Us.length = 0), Hl(Y, e, 1), (N = Jn($i)))
  }
  let z = N
  if (E && k !== !1) {
    const Y = Object.keys(E),
      { shapeFlag: ue } = z
    Y.length && ue & 7 && (s && Y.some(Su) && (E = Zy(E, s)), (z = Jo(z, E, !1, !0)))
  }
  return (
    r.dirs && ((z = Jo(z, null, !1, !0)), (z.dirs = z.dirs ? z.dirs.concat(r.dirs) : r.dirs)),
    r.transition && Iu(z, r.transition),
    (N = z),
    bl(F),
    N
  )
}
const Qy = e => {
    let t
    for (const r in e) (r === 'class' || r === 'style' || Il(r)) && ((t || (t = {}))[r] = e[r])
    return t
  },
  Zy = (e, t) => {
    const r = {}
    for (const n in e) (!Su(n) || !(n.slice(9) in t)) && (r[n] = e[n])
    return r
  }
function e_(e, t, r) {
  const { props: n, children: i, component: s } = e,
    { props: a, children: d, patchFlag: f } = t,
    g = s.emitsOptions
  if (t.dirs || t.transition) return !0
  if (r && f >= 0) {
    if (f & 1024) return !0
    if (f & 16) return n ? cf(n, a, g) : !!a
    if (f & 8) {
      const p = t.dynamicProps
      for (let y = 0; y < p.length; y++) {
        const _ = p[y]
        if (a[_] !== n[_] && !Bl(g, _)) return !0
      }
    }
  } else return (i || d) && (!d || !d.$stable) ? !0 : n === a ? !1 : n ? (a ? cf(n, a, g) : !0) : !!a
  return !1
}
function cf(e, t, r) {
  const n = Object.keys(t)
  if (n.length !== Object.keys(e).length) return !0
  for (let i = 0; i < n.length; i++) {
    const s = n[i]
    if (t[s] !== e[s] && !Bl(r, s)) return !0
  }
  return !1
}
function t_({ vnode: e, parent: t }, r) {
  for (; t; ) {
    const n = t.subTree
    if ((n.suspense && n.suspense.activeBranch === e && (n.el = e.el), n === e))
      (((e = t.vnode).el = r), (t = t.parent))
    else break
  }
}
const Cp = e => e.__isSuspense
function n_(e, t) {
  t && t.pendingBranch ? (Ge(e) ? t.effects.push(...e) : t.effects.push(e)) : hy(e)
}
const tn = Symbol.for('v-fgt'),
  ql = Symbol.for('v-txt'),
  $i = Symbol.for('v-cmt'),
  sl = Symbol.for('v-stc'),
  Us = []
let ar = null
function he(e = !1) {
  Us.push((ar = e ? null : []))
}
function r_() {
  ;(Us.pop(), (ar = Us[Us.length - 1] || null))
}
let Ys = 1
function uf(e, t = !1) {
  ;((Ys += e), e < 0 && ar && t && (ar.hasOnce = !0))
}
function Tp(e) {
  return ((e.dynamicChildren = Ys > 0 ? ar || Uo : null), r_(), Ys > 0 && ar && ar.push(e), e)
}
function pe(e, t, r, n, i, s) {
  return Tp(l(e, t, r, n, i, s, !0))
}
function i_(e, t, r, n, i) {
  return Tp(Jn(e, t, r, n, i, !0))
}
function _l(e) {
  return e ? e.__v_isVNode === !0 : !1
}
function Os(e, t) {
  return e.type === t.type && e.key === t.key
}
const Ap = ({ key: e }) => e ?? null,
  al = ({ ref: e, ref_key: t, ref_for: r }) => (
    typeof e == 'number' && (e = '' + e),
    e != null ? (fn(e) || En(e) || lt(e) ? { i: pr, r: e, k: t, f: !!r } : e) : null
  )
function l(e, t = null, r = null, n = 0, i = null, s = e === tn ? 0 : 1, a = !1, d = !1) {
  const f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Ap(t),
    ref: t && al(t),
    scopeId: rp,
    slotScopeIds: null,
    children: r,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: s,
    patchFlag: n,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: pr
  }
  return (
    d ? (Hu(f, r), s & 128 && e.normalize(f)) : r && (f.shapeFlag |= fn(r) ? 8 : 16),
    Ys > 0 && !a && ar && (f.patchFlag > 0 || s & 6) && f.patchFlag !== 32 && ar.push(f),
    f
  )
}
const Jn = o_
function o_(e, t = null, r = null, n = 0, i = null, s = !1) {
  if (((!e || e === ky) && (e = $i), _l(e))) {
    const d = Jo(e, t, !0)
    return (
      r && Hu(d, r),
      Ys > 0 && !s && ar && (d.shapeFlag & 6 ? (ar[ar.indexOf(e)] = d) : ar.push(d)),
      (d.patchFlag = -2),
      d
    )
  }
  if ((m_(e) && (e = e.__vccOpts), t)) {
    t = s_(t)
    let { class: d, style: f } = t
    ;(d && !fn(d) && (t.class = dt(d)), Vt(f) && (Lu(f) && !Ge(f) && (f = On({}, f)), (t.style = Go(f))))
  }
  const a = fn(e) ? 1 : Cp(e) ? 128 : vy(e) ? 64 : Vt(e) ? 4 : lt(e) ? 2 : 0
  return l(e, t, r, n, i, a, s, !0)
}
function s_(e) {
  return e ? (Lu(e) || hp(e) ? On({}, e) : e) : null
}
function Jo(e, t, r = !1, n = !1) {
  const { props: i, ref: s, patchFlag: a, children: d, transition: f } = e,
    g = t ? a_(i || {}, t) : i,
    p = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: g,
      key: g && Ap(g),
      ref: t && t.ref ? (r && s ? (Ge(s) ? s.concat(al(t)) : [s, al(t)]) : al(t)) : s,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: d,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== tn ? (a === -1 ? 16 : a | 16) : a,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: f,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && Jo(e.ssContent),
      ssFallback: e.ssFallback && Jo(e.ssFallback),
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce
    }
  return (f && n && Iu(p, f.clone(p)), p)
}
function Kt(e = ' ', t = 0) {
  return Jn(ql, null, e, t)
}
function Tr(e, t) {
  const r = Jn(sl, null, e)
  return ((r.staticCount = t), r)
}
function Ye(e = '', t = !1) {
  return t ? (he(), i_($i, null, e)) : Jn($i, null, e)
}
function $r(e) {
  return e == null || typeof e == 'boolean'
    ? Jn($i)
    : Ge(e)
      ? Jn(tn, null, e.slice())
      : _l(e)
        ? Ri(e)
        : Jn(ql, null, String(e))
}
function Ri(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : Jo(e)
}
function Hu(e, t) {
  let r = 0
  const { shapeFlag: n } = e
  if (t == null) t = null
  else if (Ge(t)) r = 16
  else if (typeof t == 'object')
    if (n & 65) {
      const i = t.default
      i && (i._c && (i._d = !1), Hu(e, i()), i._c && (i._d = !0))
      return
    } else {
      r = 32
      const i = t._
      !i && !hp(t)
        ? (t._ctx = pr)
        : i === 3 && pr && (pr.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)))
    }
  else
    lt(t) ? ((t = { default: t, _ctx: pr }), (r = 32)) : ((t = String(t)), n & 64 ? ((r = 16), (t = [Kt(t)])) : (r = 8))
  ;((e.children = t), (e.shapeFlag |= r))
}
function a_(...e) {
  const t = {}
  for (let r = 0; r < e.length; r++) {
    const n = e[r]
    for (const i in n)
      if (i === 'class') t.class !== n.class && (t.class = dt([t.class, n.class]))
      else if (i === 'style') t.style = Go([t.style, n.style])
      else if (Il(i)) {
        const s = t[i],
          a = n[i]
        a && s !== a && !(Ge(s) && s.includes(a)) && (t[i] = s ? [].concat(s, a) : a)
      } else i !== '' && (t[i] = n[i])
  }
  return t
}
function jr(e, t, r, n = null) {
  Ur(e, t, 7, [r, n])
}
const l_ = up()
let c_ = 0
function u_(e, t, r) {
  const n = e.type,
    i = (t ? t.appContext : e.appContext) || l_,
    s = {
      uid: c_++,
      vnode: e,
      type: n,
      parent: t,
      appContext: i,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new Lh(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(i.provides),
      ids: t ? t.ids : ['', 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: mp(n, i),
      emitsOptions: Sp(n, i),
      emit: null,
      emitted: null,
      propsDefaults: Bt,
      inheritAttrs: n.inheritAttrs,
      ctx: Bt,
      data: Bt,
      props: Bt,
      attrs: Bt,
      slots: Bt,
      refs: Bt,
      setupState: Bt,
      setupContext: null,
      suspense: r,
      suspenseId: r ? r.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    }
  return ((s.ctx = { _: s }), (s.root = t ? t.root : s), (s.emit = Yy.bind(null, s)), e.ce && e.ce(s), s)
}
let qn = null,
  wl,
  ou
{
  const e = jl(),
    t = (r, n) => {
      let i
      return (
        (i = e[r]) || (i = e[r] = []),
        i.push(n),
        s => {
          i.length > 1 ? i.forEach(a => a(s)) : i[0](s)
        }
      )
    }
  ;((wl = t('__VUE_INSTANCE_SETTERS__', r => (qn = r))), (ou = t('__VUE_SSR_SETTERS__', r => (Qs = r))))
}
const da = e => {
    const t = qn
    return (
      wl(e),
      e.scope.on(),
      () => {
        ;(e.scope.off(), wl(t))
      }
    )
  },
  df = () => {
    ;(qn && qn.scope.off(), wl(null))
  }
function Dp(e) {
  return e.vnode.shapeFlag & 4
}
let Qs = !1
function d_(e, t = !1, r = !1) {
  t && ou(t)
  const { props: n, children: i } = e.vnode,
    s = Dp(e)
  ;(jy(e, n, s, t), By(e, i, r || t))
  const a = s ? f_(e, t) : void 0
  return (t && ou(!1), a)
}
function f_(e, t) {
  const r = e.type
  ;((e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, Ey)))
  const { setup: n } = r
  if (n) {
    hi()
    const i = (e.setupContext = n.length > 1 ? p_(e) : null),
      s = da(e),
      a = ua(n, e, 0, [e.props, i]),
      d = Ah(a)
    if ((pi(), s(), (d || e.sp) && !Bs(e) && op(e), d)) {
      if ((a.then(df, df), t))
        return a
          .then(f => {
            ff(e, f)
          })
          .catch(f => {
            Hl(f, e, 0)
          })
      e.asyncDep = a
    } else ff(e, a)
  } else kp(e)
}
function ff(e, t, r) {
  ;(lt(t) ? (e.type.__ssrInlineRender ? (e.ssrRender = t) : (e.render = t)) : Vt(t) && (e.setupState = Qh(t)), kp(e))
}
function kp(e, t, r) {
  const n = e.type
  e.render || (e.render = n.render || Br)
  {
    const i = da(e)
    hi()
    try {
      Oy(e)
    } finally {
      ;(pi(), i())
    }
  }
}
const h_ = {
  get(e, t) {
    return (Dn(e, 'get', ''), e[t])
  }
}
function p_(e) {
  const t = r => {
    e.exposed = r || {}
  }
  return { attrs: new Proxy(e.attrs, h_), slots: e.slots, emit: e.emit, expose: t }
}
function Ul(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(Qh(Jh(e.exposed)), {
          get(t, r) {
            if (r in t) return t[r]
            if (r in qs) return qs[r](e)
          },
          has(t, r) {
            return r in t || r in qs
          }
        }))
    : e.proxy
}
function m_(e) {
  return lt(e) && '__vccOpts' in e
}
const sr = (e, t) => ly(e, t, Qs)
function Ep(e, t, r) {
  const n = arguments.length
  return n === 2
    ? Vt(t) && !Ge(t)
      ? _l(t)
        ? Jn(e, null, [t])
        : Jn(e, t)
      : Jn(e, null, t)
    : (n > 3 ? (r = Array.prototype.slice.call(arguments, 2)) : n === 3 && _l(r) && (r = [r]), Jn(e, t, r))
}
const v_ = '3.5.17'
/**
 * @vue/runtime-dom v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let su
const hf = typeof window < 'u' && window.trustedTypes
if (hf)
  try {
    su = hf.createPolicy('vue', { createHTML: e => e })
  } catch {}
const Op = su ? e => su.createHTML(e) : e => e,
  g_ = 'http://www.w3.org/2000/svg',
  b_ = 'http://www.w3.org/1998/Math/MathML',
  ai = typeof document < 'u' ? document : null,
  pf = ai && ai.createElement('template'),
  y_ = {
    insert: (e, t, r) => {
      t.insertBefore(e, r || null)
    },
    remove: e => {
      const t = e.parentNode
      t && t.removeChild(e)
    },
    createElement: (e, t, r, n) => {
      const i =
        t === 'svg'
          ? ai.createElementNS(g_, e)
          : t === 'mathml'
            ? ai.createElementNS(b_, e)
            : r
              ? ai.createElement(e, { is: r })
              : ai.createElement(e)
      return (e === 'select' && n && n.multiple != null && i.setAttribute('multiple', n.multiple), i)
    },
    createText: e => ai.createTextNode(e),
    createComment: e => ai.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t
    },
    setElementText: (e, t) => {
      e.textContent = t
    },
    parentNode: e => e.parentNode,
    nextSibling: e => e.nextSibling,
    querySelector: e => ai.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, '')
    },
    insertStaticContent(e, t, r, n, i, s) {
      const a = r ? r.previousSibling : t.lastChild
      if (i && (i === s || i.nextSibling))
        for (; t.insertBefore(i.cloneNode(!0), r), !(i === s || !(i = i.nextSibling)); );
      else {
        pf.innerHTML = Op(n === 'svg' ? `<svg>${e}</svg>` : n === 'mathml' ? `<math>${e}</math>` : e)
        const d = pf.content
        if (n === 'svg' || n === 'mathml') {
          const f = d.firstChild
          for (; f.firstChild; ) d.appendChild(f.firstChild)
          d.removeChild(f)
        }
        t.insertBefore(d, r)
      }
      return [a ? a.nextSibling : t.firstChild, r ? r.previousSibling : t.lastChild]
    }
  },
  __ = Symbol('_vtc')
function w_(e, t, r) {
  const n = e[__]
  ;(n && (t = (t ? [t, ...n] : [...n]).join(' ')),
    t == null ? e.removeAttribute('class') : r ? e.setAttribute('class', t) : (e.className = t))
}
const mf = Symbol('_vod'),
  x_ = Symbol('_vsh'),
  S_ = Symbol(''),
  C_ = /(^|;)\s*display\s*:/
function T_(e, t, r) {
  const n = e.style,
    i = fn(r)
  let s = !1
  if (r && !i) {
    if (t)
      if (fn(t))
        for (const a of t.split(';')) {
          const d = a.slice(0, a.indexOf(':')).trim()
          r[d] == null && ll(n, d, '')
        }
      else for (const a in t) r[a] == null && ll(n, a, '')
    for (const a in r) (a === 'display' && (s = !0), ll(n, a, r[a]))
  } else if (i) {
    if (t !== r) {
      const a = n[S_]
      ;(a && (r += ';' + a), (n.cssText = r), (s = C_.test(r)))
    }
  } else t && e.removeAttribute('style')
  mf in e && ((e[mf] = s ? n.display : ''), e[x_] && (n.display = 'none'))
}
const vf = /\s*!important$/
function ll(e, t, r) {
  if (Ge(r)) r.forEach(n => ll(e, t, n))
  else if ((r == null && (r = ''), t.startsWith('--'))) e.setProperty(t, r)
  else {
    const n = A_(e, t)
    vf.test(r) ? e.setProperty(bo(n), r.replace(vf, ''), 'important') : (e[n] = r)
  }
}
const gf = ['Webkit', 'Moz', 'ms'],
  jc = {}
function A_(e, t) {
  const r = jc[t]
  if (r) return r
  let n = Ni(t)
  if (n !== 'filter' && n in e) return (jc[t] = n)
  n = Eh(n)
  for (let i = 0; i < gf.length; i++) {
    const s = gf[i] + n
    if (s in e) return (jc[t] = s)
  }
  return t
}
const bf = 'http://www.w3.org/1999/xlink'
function yf(e, t, r, n, i, s = Fb(t)) {
  n && t.startsWith('xlink:')
    ? r == null
      ? e.removeAttributeNS(bf, t.slice(6, t.length))
      : e.setAttributeNS(bf, t, r)
    : r == null || (s && !Oh(r))
      ? e.removeAttribute(t)
      : e.setAttribute(t, s ? '' : qr(r) ? String(r) : r)
}
function _f(e, t, r, n, i) {
  if (t === 'innerHTML' || t === 'textContent') {
    r != null && (e[t] = t === 'innerHTML' ? Op(r) : r)
    return
  }
  const s = e.tagName
  if (t === 'value' && s !== 'PROGRESS' && !s.includes('-')) {
    const d = s === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      f = r == null ? (e.type === 'checkbox' ? 'on' : '') : String(r)
    ;((d !== f || !('_value' in e)) && (e.value = f), r == null && e.removeAttribute(t), (e._value = r))
    return
  }
  let a = !1
  if (r === '' || r == null) {
    const d = typeof e[t]
    d === 'boolean'
      ? (r = Oh(r))
      : r == null && d === 'string'
        ? ((r = ''), (a = !0))
        : d === 'number' && ((r = 0), (a = !0))
  }
  try {
    e[t] = r
  } catch {}
  a && e.removeAttribute(i || t)
}
function Mi(e, t, r, n) {
  e.addEventListener(t, r, n)
}
function D_(e, t, r, n) {
  e.removeEventListener(t, r, n)
}
const wf = Symbol('_vei')
function k_(e, t, r, n, i = null) {
  const s = e[wf] || (e[wf] = {}),
    a = s[t]
  if (n && a) a.value = n
  else {
    const [d, f] = E_(t)
    if (n) {
      const g = (s[t] = R_(n, i))
      Mi(e, d, g, f)
    } else a && (D_(e, d, a, f), (s[t] = void 0))
  }
}
const xf = /(?:Once|Passive|Capture)$/
function E_(e) {
  let t
  if (xf.test(e)) {
    t = {}
    let n
    for (; (n = e.match(xf)); ) ((e = e.slice(0, e.length - n[0].length)), (t[n[0].toLowerCase()] = !0))
  }
  return [e[2] === ':' ? e.slice(3) : bo(e.slice(2)), t]
}
let Nc = 0
const O_ = Promise.resolve(),
  P_ = () => Nc || (O_.then(() => (Nc = 0)), (Nc = Date.now()))
function R_(e, t) {
  const r = n => {
    if (!n._vts) n._vts = Date.now()
    else if (n._vts <= r.attached) return
    Ur(L_(n, r.value), t, 5, [n])
  }
  return ((r.value = e), (r.attached = P_()), r)
}
function L_(e, t) {
  if (Ge(t)) {
    const r = e.stopImmediatePropagation
    return (
      (e.stopImmediatePropagation = () => {
        ;(r.call(e), (e._stopped = !0))
      }),
      t.map(n => i => !i._stopped && n && n(i))
    )
  } else return t
}
const Sf = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123,
  M_ = (e, t, r, n, i, s) => {
    const a = i === 'svg'
    t === 'class'
      ? w_(e, n, a)
      : t === 'style'
        ? T_(e, r, n)
        : Il(t)
          ? Su(t) || k_(e, t, r, n, s)
          : (t[0] === '.' ? ((t = t.slice(1)), !0) : t[0] === '^' ? ((t = t.slice(1)), !1) : I_(e, t, n, a))
            ? (_f(e, t, n),
              !e.tagName.includes('-') &&
                (t === 'value' || t === 'checked' || t === 'selected') &&
                yf(e, t, n, a, s, t !== 'value'))
            : e._isVueCE && (/[A-Z]/.test(t) || !fn(n))
              ? _f(e, Ni(t), n, s, t)
              : (t === 'true-value' ? (e._trueValue = n) : t === 'false-value' && (e._falseValue = n), yf(e, t, n, a))
  }
function I_(e, t, r, n) {
  if (n) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && Sf(t) && lt(r)))
  if (
    t === 'spellcheck' ||
    t === 'draggable' ||
    t === 'translate' ||
    t === 'autocorrect' ||
    t === 'form' ||
    (t === 'list' && e.tagName === 'INPUT') ||
    (t === 'type' && e.tagName === 'TEXTAREA')
  )
    return !1
  if (t === 'width' || t === 'height') {
    const i = e.tagName
    if (i === 'IMG' || i === 'VIDEO' || i === 'CANVAS' || i === 'SOURCE') return !1
  }
  return Sf(t) && fn(r) ? !1 : t in e
}
const Yo = e => {
  const t = e.props['onUpdate:modelValue'] || !1
  return Ge(t) ? r => rl(t, r) : t
}
function F_(e) {
  e.target.composing = !0
}
function Cf(e) {
  const t = e.target
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event('input')))
}
const fi = Symbol('_assign'),
  ln = {
    created(e, { modifiers: { lazy: t, trim: r, number: n } }, i) {
      e[fi] = Yo(i)
      const s = n || (i.props && i.props.type === 'number')
      ;(Mi(e, t ? 'change' : 'input', a => {
        if (a.target.composing) return
        let d = e.value
        ;(r && (d = d.trim()), s && (d = pl(d)), e[fi](d))
      }),
        r &&
          Mi(e, 'change', () => {
            e.value = e.value.trim()
          }),
        t || (Mi(e, 'compositionstart', F_), Mi(e, 'compositionend', Cf), Mi(e, 'change', Cf)))
    },
    mounted(e, { value: t }) {
      e.value = t ?? ''
    },
    beforeUpdate(e, { value: t, oldValue: r, modifiers: { lazy: n, trim: i, number: s } }, a) {
      if (((e[fi] = Yo(a)), e.composing)) return
      const d = (s || e.type === 'number') && !/^0\d/.test(e.value) ? pl(e.value) : e.value,
        f = t ?? ''
      d !== f &&
        ((document.activeElement === e && e.type !== 'range' && ((n && t === r) || (i && e.value.trim() === f))) ||
          (e.value = f))
    }
  },
  Ii = {
    deep: !0,
    created(e, t, r) {
      ;((e[fi] = Yo(r)),
        Mi(e, 'change', () => {
          const n = e._modelValue,
            i = ea(e),
            s = e.checked,
            a = e[fi]
          if (Ge(n)) {
            const d = Au(n, i),
              f = d !== -1
            if (s && !f) a(n.concat(i))
            else if (!s && f) {
              const g = [...n]
              ;(g.splice(d, 1), a(g))
            }
          } else if (rs(n)) {
            const d = new Set(n)
            ;(s ? d.add(i) : d.delete(i), a(d))
          } else a(Pp(e, s))
        }))
    },
    mounted: Tf,
    beforeUpdate(e, t, r) {
      ;((e[fi] = Yo(r)), Tf(e, t, r))
    }
  }
function Tf(e, { value: t, oldValue: r }, n) {
  e._modelValue = t
  let i
  if (Ge(t)) i = Au(t, n.props.value) > -1
  else if (rs(t)) i = t.has(n.props.value)
  else {
    if (t === r) return
    i = ca(t, Pp(e, !0))
  }
  e.checked !== i && (e.checked = i)
}
const Zs = {
  deep: !0,
  created(e, { value: t, modifiers: { number: r } }, n) {
    const i = rs(t)
    ;(Mi(e, 'change', () => {
      const s = Array.prototype.filter.call(e.options, a => a.selected).map(a => (r ? pl(ea(a)) : ea(a)))
      ;(e[fi](e.multiple ? (i ? new Set(s) : s) : s[0]),
        (e._assigning = !0),
        Bi(() => {
          e._assigning = !1
        }))
    }),
      (e[fi] = Yo(n)))
  },
  mounted(e, { value: t }) {
    Af(e, t)
  },
  beforeUpdate(e, t, r) {
    e[fi] = Yo(r)
  },
  updated(e, { value: t }) {
    e._assigning || Af(e, t)
  }
}
function Af(e, t) {
  const r = e.multiple,
    n = Ge(t)
  if (!(r && !n && !rs(t))) {
    for (let i = 0, s = e.options.length; i < s; i++) {
      const a = e.options[i],
        d = ea(a)
      if (r)
        if (n) {
          const f = typeof d
          f === 'string' || f === 'number'
            ? (a.selected = t.some(g => String(g) === String(d)))
            : (a.selected = Au(t, d) > -1)
        } else a.selected = t.has(d)
      else if (ca(ea(a), t)) {
        e.selectedIndex !== i && (e.selectedIndex = i)
        return
      }
    }
    !r && e.selectedIndex !== -1 && (e.selectedIndex = -1)
  }
}
function ea(e) {
  return '_value' in e ? e._value : e.value
}
function Pp(e, t) {
  const r = t ? '_trueValue' : '_falseValue'
  return r in e ? e[r] : t
}
const j_ = ['ctrl', 'shift', 'alt', 'meta'],
  N_ = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
    exact: (e, t) => j_.some(r => e[`${r}Key`] && !t.includes(r))
  },
  ta = (e, t) => {
    const r = e._withMods || (e._withMods = {}),
      n = t.join('.')
    return (
      r[n] ||
      (r[n] = (i, ...s) => {
        for (let a = 0; a < t.length; a++) {
          const d = N_[t[a]]
          if (d && d(i, t)) return
        }
        return e(i, ...s)
      })
    )
  },
  H_ = On({ patchProp: M_ }, y_)
let Df
function $_() {
  return Df || (Df = Uy(H_))
}
const B_ = (...e) => {
  const t = $_().createApp(...e),
    { mount: r } = t
  return (
    (t.mount = n => {
      const i = U_(n)
      if (!i) return
      const s = t._component
      ;(!lt(s) && !s.render && !s.template && (s.template = i.innerHTML), i.nodeType === 1 && (i.textContent = ''))
      const a = r(i, !1, q_(i))
      return (i instanceof Element && (i.removeAttribute('v-cloak'), i.setAttribute('data-v-app', '')), a)
    }),
    t
  )
}
function q_(e) {
  if (e instanceof SVGElement) return 'svg'
  if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml'
}
function U_(e) {
  return fn(e) ? document.querySelector(e) : e
}
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ const W_ = Symbol()
var kf
;(function (e) {
  ;((e.direct = 'direct'), (e.patchObject = 'patch object'), (e.patchFunction = 'patch function'))
})(kf || (kf = {}))
function V_() {
  const e = Nb(!0),
    t = e.run(() => qe({}))
  let r = [],
    n = []
  const i = Jh({
    install(s) {
      ;((i._a = s), s.provide(W_, i), (s.config.globalProperties.$pinia = i), n.forEach(a => r.push(a)), (n = []))
    },
    use(s) {
      return (this._a ? r.push(s) : n.push(s), this)
    },
    _p: r,
    _a: null,
    _e: e,
    _s: new Map(),
    state: t
  })
  return i
}
/*!
 * vue-router v4.5.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ const Bo = typeof document < 'u'
function Rp(e) {
  return typeof e == 'object' || 'displayName' in e || 'props' in e || '__vccOpts' in e
}
function z_(e) {
  return e.__esModule || e[Symbol.toStringTag] === 'Module' || (e.default && Rp(e.default))
}
const Pt = Object.assign
function Hc(e, t) {
  const r = {}
  for (const n in t) {
    const i = t[n]
    r[n] = Ar(i) ? i.map(e) : e(i)
  }
  return r
}
const Ws = () => {},
  Ar = Array.isArray,
  Lp = /#/g,
  K_ = /&/g,
  X_ = /\//g,
  G_ = /=/g,
  J_ = /\?/g,
  Mp = /\+/g,
  Y_ = /%5B/g,
  Q_ = /%5D/g,
  Ip = /%5E/g,
  Z_ = /%60/g,
  Fp = /%7B/g,
  e0 = /%7C/g,
  jp = /%7D/g,
  t0 = /%20/g
function $u(e) {
  return encodeURI('' + e)
    .replace(e0, '|')
    .replace(Y_, '[')
    .replace(Q_, ']')
}
function n0(e) {
  return $u(e).replace(Fp, '{').replace(jp, '}').replace(Ip, '^')
}
function au(e) {
  return $u(e)
    .replace(Mp, '%2B')
    .replace(t0, '+')
    .replace(Lp, '%23')
    .replace(K_, '%26')
    .replace(Z_, '`')
    .replace(Fp, '{')
    .replace(jp, '}')
    .replace(Ip, '^')
}
function r0(e) {
  return au(e).replace(G_, '%3D')
}
function i0(e) {
  return $u(e).replace(Lp, '%23').replace(J_, '%3F')
}
function o0(e) {
  return e == null ? '' : i0(e).replace(X_, '%2F')
}
function na(e) {
  try {
    return decodeURIComponent('' + e)
  } catch {}
  return '' + e
}
const s0 = /\/$/,
  a0 = e => e.replace(s0, '')
function $c(e, t, r = '/') {
  let n,
    i = {},
    s = '',
    a = ''
  const d = t.indexOf('#')
  let f = t.indexOf('?')
  return (
    d < f && d >= 0 && (f = -1),
    f > -1 && ((n = t.slice(0, f)), (s = t.slice(f + 1, d > -1 ? d : t.length)), (i = e(s))),
    d > -1 && ((n = n || t.slice(0, d)), (a = t.slice(d, t.length))),
    (n = d0(n ?? t, r)),
    { fullPath: n + (s && '?') + s + a, path: n, query: i, hash: na(a) }
  )
}
function l0(e, t) {
  const r = t.query ? e(t.query) : ''
  return t.path + (r && '?') + r + (t.hash || '')
}
function Ef(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || '/'
}
function c0(e, t, r) {
  const n = t.matched.length - 1,
    i = r.matched.length - 1
  return (
    n > -1 &&
    n === i &&
    Qo(t.matched[n], r.matched[i]) &&
    Np(t.params, r.params) &&
    e(t.query) === e(r.query) &&
    t.hash === r.hash
  )
}
function Qo(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t)
}
function Np(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1
  for (const r in e) if (!u0(e[r], t[r])) return !1
  return !0
}
function u0(e, t) {
  return Ar(e) ? Of(e, t) : Ar(t) ? Of(t, e) : e === t
}
function Of(e, t) {
  return Ar(t) ? e.length === t.length && e.every((r, n) => r === t[n]) : e.length === 1 && e[0] === t
}
function d0(e, t) {
  if (e.startsWith('/')) return e
  if (!e) return t
  const r = t.split('/'),
    n = e.split('/'),
    i = n[n.length - 1]
  ;(i === '..' || i === '.') && n.push('')
  let s = r.length - 1,
    a,
    d
  for (a = 0; a < n.length; a++)
    if (((d = n[a]), d !== '.'))
      if (d === '..') s > 1 && s--
      else break
  return r.slice(0, s).join('/') + '/' + n.slice(a).join('/')
}
const Oi = {
  path: '/',
  name: void 0,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: void 0
}
var ra
;(function (e) {
  ;((e.pop = 'pop'), (e.push = 'push'))
})(ra || (ra = {}))
var Vs
;(function (e) {
  ;((e.back = 'back'), (e.forward = 'forward'), (e.unknown = ''))
})(Vs || (Vs = {}))
function f0(e) {
  if (!e)
    if (Bo) {
      const t = document.querySelector('base')
      ;((e = (t && t.getAttribute('href')) || '/'), (e = e.replace(/^\w+:\/\/[^\/]+/, '')))
    } else e = '/'
  return (e[0] !== '/' && e[0] !== '#' && (e = '/' + e), a0(e))
}
const h0 = /^[^#]+#/
function p0(e, t) {
  return e.replace(h0, '#') + t
}
function m0(e, t) {
  const r = document.documentElement.getBoundingClientRect(),
    n = e.getBoundingClientRect()
  return { behavior: t.behavior, left: n.left - r.left - (t.left || 0), top: n.top - r.top - (t.top || 0) }
}
const Wl = () => ({ left: window.scrollX, top: window.scrollY })
function v0(e) {
  let t
  if ('el' in e) {
    const r = e.el,
      n = typeof r == 'string' && r.startsWith('#'),
      i = typeof r == 'string' ? (n ? document.getElementById(r.slice(1)) : document.querySelector(r)) : r
    if (!i) return
    t = m0(i, e)
  } else t = e
  'scrollBehavior' in document.documentElement.style
    ? window.scrollTo(t)
    : window.scrollTo(t.left != null ? t.left : window.scrollX, t.top != null ? t.top : window.scrollY)
}
function Pf(e, t) {
  return (history.state ? history.state.position - t : -1) + e
}
const lu = new Map()
function g0(e, t) {
  lu.set(e, t)
}
function b0(e) {
  const t = lu.get(e)
  return (lu.delete(e), t)
}
let y0 = () => location.protocol + '//' + location.host
function Hp(e, t) {
  const { pathname: r, search: n, hash: i } = t,
    s = e.indexOf('#')
  if (s > -1) {
    let d = i.includes(e.slice(s)) ? e.slice(s).length : 1,
      f = i.slice(d)
    return (f[0] !== '/' && (f = '/' + f), Ef(f, ''))
  }
  return Ef(r, e) + n + i
}
function _0(e, t, r, n) {
  let i = [],
    s = [],
    a = null
  const d = ({ state: _ }) => {
    const C = Hp(e, location),
      A = r.value,
      k = t.value
    let F = 0
    if (_) {
      if (((r.value = C), (t.value = _), a && a === A)) {
        a = null
        return
      }
      F = k ? _.position - k.position : 0
    } else n(C)
    i.forEach(N => {
      N(r.value, A, { delta: F, type: ra.pop, direction: F ? (F > 0 ? Vs.forward : Vs.back) : Vs.unknown })
    })
  }
  function f() {
    a = r.value
  }
  function g(_) {
    i.push(_)
    const C = () => {
      const A = i.indexOf(_)
      A > -1 && i.splice(A, 1)
    }
    return (s.push(C), C)
  }
  function p() {
    const { history: _ } = window
    _.state && _.replaceState(Pt({}, _.state, { scroll: Wl() }), '')
  }
  function y() {
    for (const _ of s) _()
    ;((s = []), window.removeEventListener('popstate', d), window.removeEventListener('beforeunload', p))
  }
  return (
    window.addEventListener('popstate', d),
    window.addEventListener('beforeunload', p, { passive: !0 }),
    { pauseListeners: f, listen: g, destroy: y }
  )
}
function Rf(e, t, r, n = !1, i = !1) {
  return { back: e, current: t, forward: r, replaced: n, position: window.history.length, scroll: i ? Wl() : null }
}
function w0(e) {
  const { history: t, location: r } = window,
    n = { value: Hp(e, r) },
    i = { value: t.state }
  i.value ||
    s(n.value, { back: null, current: n.value, forward: null, position: t.length - 1, replaced: !0, scroll: null }, !0)
  function s(f, g, p) {
    const y = e.indexOf('#'),
      _ = y > -1 ? (r.host && document.querySelector('base') ? e : e.slice(y)) + f : y0() + e + f
    try {
      ;(t[p ? 'replaceState' : 'pushState'](g, '', _), (i.value = g))
    } catch (C) {
      ;(console.error(C), r[p ? 'replace' : 'assign'](_))
    }
  }
  function a(f, g) {
    const p = Pt({}, t.state, Rf(i.value.back, f, i.value.forward, !0), g, { position: i.value.position })
    ;(s(f, p, !0), (n.value = f))
  }
  function d(f, g) {
    const p = Pt({}, i.value, t.state, { forward: f, scroll: Wl() })
    s(p.current, p, !0)
    const y = Pt({}, Rf(n.value, f, null), { position: p.position + 1 }, g)
    ;(s(f, y, !1), (n.value = f))
  }
  return { location: n, state: i, push: d, replace: a }
}
function x0(e) {
  e = f0(e)
  const t = w0(e),
    r = _0(e, t.state, t.location, t.replace)
  function n(s, a = !0) {
    ;(a || r.pauseListeners(), history.go(s))
  }
  const i = Pt({ location: '', base: e, go: n, createHref: p0.bind(null, e) }, t, r)
  return (
    Object.defineProperty(i, 'location', { enumerable: !0, get: () => t.location.value }),
    Object.defineProperty(i, 'state', { enumerable: !0, get: () => t.state.value }),
    i
  )
}
function S0(e) {
  return typeof e == 'string' || (e && typeof e == 'object')
}
function $p(e) {
  return typeof e == 'string' || typeof e == 'symbol'
}
const Bp = Symbol('')
var Lf
;(function (e) {
  ;((e[(e.aborted = 4)] = 'aborted'), (e[(e.cancelled = 8)] = 'cancelled'), (e[(e.duplicated = 16)] = 'duplicated'))
})(Lf || (Lf = {}))
function Zo(e, t) {
  return Pt(new Error(), { type: e, [Bp]: !0 }, t)
}
function si(e, t) {
  return e instanceof Error && Bp in e && (t == null || !!(e.type & t))
}
const Mf = '[^/]+?',
  C0 = { sensitive: !1, strict: !1, start: !0, end: !0 },
  T0 = /[.+*?^${}()[\]/\\]/g
function A0(e, t) {
  const r = Pt({}, C0, t),
    n = []
  let i = r.start ? '^' : ''
  const s = []
  for (const g of e) {
    const p = g.length ? [] : [90]
    r.strict && !g.length && (i += '/')
    for (let y = 0; y < g.length; y++) {
      const _ = g[y]
      let C = 40 + (r.sensitive ? 0.25 : 0)
      if (_.type === 0) (y || (i += '/'), (i += _.value.replace(T0, '\\$&')), (C += 40))
      else if (_.type === 1) {
        const { value: A, repeatable: k, optional: F, regexp: N } = _
        s.push({ name: A, repeatable: k, optional: F })
        const E = N || Mf
        if (E !== Mf) {
          C += 10
          try {
            new RegExp(`(${E})`)
          } catch (Y) {
            throw new Error(`Invalid custom RegExp for param "${A}" (${E}): ` + Y.message)
          }
        }
        let z = k ? `((?:${E})(?:/(?:${E}))*)` : `(${E})`
        ;(y || (z = F && g.length < 2 ? `(?:/${z})` : '/' + z),
          F && (z += '?'),
          (i += z),
          (C += 20),
          F && (C += -8),
          k && (C += -20),
          E === '.*' && (C += -50))
      }
      p.push(C)
    }
    n.push(p)
  }
  if (r.strict && r.end) {
    const g = n.length - 1
    n[g][n[g].length - 1] += 0.7000000000000001
  }
  ;(r.strict || (i += '/?'), r.end ? (i += '$') : r.strict && !i.endsWith('/') && (i += '(?:/|$)'))
  const a = new RegExp(i, r.sensitive ? '' : 'i')
  function d(g) {
    const p = g.match(a),
      y = {}
    if (!p) return null
    for (let _ = 1; _ < p.length; _++) {
      const C = p[_] || '',
        A = s[_ - 1]
      y[A.name] = C && A.repeatable ? C.split('/') : C
    }
    return y
  }
  function f(g) {
    let p = '',
      y = !1
    for (const _ of e) {
      ;((!y || !p.endsWith('/')) && (p += '/'), (y = !1))
      for (const C of _)
        if (C.type === 0) p += C.value
        else if (C.type === 1) {
          const { value: A, repeatable: k, optional: F } = C,
            N = A in g ? g[A] : ''
          if (Ar(N) && !k)
            throw new Error(`Provided param "${A}" is an array but it is not repeatable (* or + modifiers)`)
          const E = Ar(N) ? N.join('/') : N
          if (!E)
            if (F) _.length < 2 && (p.endsWith('/') ? (p = p.slice(0, -1)) : (y = !0))
            else throw new Error(`Missing required param "${A}"`)
          p += E
        }
    }
    return p || '/'
  }
  return { re: a, score: n, keys: s, parse: d, stringify: f }
}
function D0(e, t) {
  let r = 0
  for (; r < e.length && r < t.length; ) {
    const n = t[r] - e[r]
    if (n) return n
    r++
  }
  return e.length < t.length
    ? e.length === 1 && e[0] === 80
      ? -1
      : 1
    : e.length > t.length
      ? t.length === 1 && t[0] === 80
        ? 1
        : -1
      : 0
}
function qp(e, t) {
  let r = 0
  const n = e.score,
    i = t.score
  for (; r < n.length && r < i.length; ) {
    const s = D0(n[r], i[r])
    if (s) return s
    r++
  }
  if (Math.abs(i.length - n.length) === 1) {
    if (If(n)) return 1
    if (If(i)) return -1
  }
  return i.length - n.length
}
function If(e) {
  const t = e[e.length - 1]
  return e.length > 0 && t[t.length - 1] < 0
}
const k0 = { type: 0, value: '' },
  E0 = /[a-zA-Z0-9_]/
function O0(e) {
  if (!e) return [[]]
  if (e === '/') return [[k0]]
  if (!e.startsWith('/')) throw new Error(`Invalid path "${e}"`)
  function t(C) {
    throw new Error(`ERR (${r})/"${g}": ${C}`)
  }
  let r = 0,
    n = r
  const i = []
  let s
  function a() {
    ;(s && i.push(s), (s = []))
  }
  let d = 0,
    f,
    g = '',
    p = ''
  function y() {
    g &&
      (r === 0
        ? s.push({ type: 0, value: g })
        : r === 1 || r === 2 || r === 3
          ? (s.length > 1 &&
              (f === '*' || f === '+') &&
              t(`A repeatable param (${g}) must be alone in its segment. eg: '/:ids+.`),
            s.push({
              type: 1,
              value: g,
              regexp: p,
              repeatable: f === '*' || f === '+',
              optional: f === '*' || f === '?'
            }))
          : t('Invalid state to consume buffer'),
      (g = ''))
  }
  function _() {
    g += f
  }
  for (; d < e.length; ) {
    if (((f = e[d++]), f === '\\' && r !== 2)) {
      ;((n = r), (r = 4))
      continue
    }
    switch (r) {
      case 0:
        f === '/' ? (g && y(), a()) : f === ':' ? (y(), (r = 1)) : _()
        break
      case 4:
        ;(_(), (r = n))
        break
      case 1:
        f === '(' ? (r = 2) : E0.test(f) ? _() : (y(), (r = 0), f !== '*' && f !== '?' && f !== '+' && d--)
        break
      case 2:
        f === ')' ? (p[p.length - 1] == '\\' ? (p = p.slice(0, -1) + f) : (r = 3)) : (p += f)
        break
      case 3:
        ;(y(), (r = 0), f !== '*' && f !== '?' && f !== '+' && d--, (p = ''))
        break
      default:
        t('Unknown state')
        break
    }
  }
  return (r === 2 && t(`Unfinished custom RegExp for param "${g}"`), y(), a(), i)
}
function P0(e, t, r) {
  const n = A0(O0(e.path), r),
    i = Pt(n, { record: e, parent: t, children: [], alias: [] })
  return (t && !i.record.aliasOf == !t.record.aliasOf && t.children.push(i), i)
}
function R0(e, t) {
  const r = [],
    n = new Map()
  t = Hf({ strict: !1, end: !0, sensitive: !1 }, t)
  function i(y) {
    return n.get(y)
  }
  function s(y, _, C) {
    const A = !C,
      k = jf(y)
    k.aliasOf = C && C.record
    const F = Hf(t, y),
      N = [k]
    if ('alias' in y) {
      const Y = typeof y.alias == 'string' ? [y.alias] : y.alias
      for (const ue of Y)
        N.push(
          jf(Pt({}, k, { components: C ? C.record.components : k.components, path: ue, aliasOf: C ? C.record : k }))
        )
    }
    let E, z
    for (const Y of N) {
      const { path: ue } = Y
      if (_ && ue[0] !== '/') {
        const ke = _.record.path,
          m = ke[ke.length - 1] === '/' ? '' : '/'
        Y.path = _.record.path + (ue && m + ue)
      }
      if (
        ((E = P0(Y, _, F)),
        C ? C.alias.push(E) : ((z = z || E), z !== E && z.alias.push(E), A && y.name && !Nf(E) && a(y.name)),
        Up(E) && f(E),
        k.children)
      ) {
        const ke = k.children
        for (let m = 0; m < ke.length; m++) s(ke[m], E, C && C.children[m])
      }
      C = C || E
    }
    return z
      ? () => {
          a(z)
        }
      : Ws
  }
  function a(y) {
    if ($p(y)) {
      const _ = n.get(y)
      _ && (n.delete(y), r.splice(r.indexOf(_), 1), _.children.forEach(a), _.alias.forEach(a))
    } else {
      const _ = r.indexOf(y)
      _ > -1 && (r.splice(_, 1), y.record.name && n.delete(y.record.name), y.children.forEach(a), y.alias.forEach(a))
    }
  }
  function d() {
    return r
  }
  function f(y) {
    const _ = I0(y, r)
    ;(r.splice(_, 0, y), y.record.name && !Nf(y) && n.set(y.record.name, y))
  }
  function g(y, _) {
    let C,
      A = {},
      k,
      F
    if ('name' in y && y.name) {
      if (((C = n.get(y.name)), !C)) throw Zo(1, { location: y })
      ;((F = C.record.name),
        (A = Pt(
          Ff(
            _.params,
            C.keys
              .filter(z => !z.optional)
              .concat(C.parent ? C.parent.keys.filter(z => z.optional) : [])
              .map(z => z.name)
          ),
          y.params &&
            Ff(
              y.params,
              C.keys.map(z => z.name)
            )
        )),
        (k = C.stringify(A)))
    } else if (y.path != null)
      ((k = y.path), (C = r.find(z => z.re.test(k))), C && ((A = C.parse(k)), (F = C.record.name)))
    else {
      if (((C = _.name ? n.get(_.name) : r.find(z => z.re.test(_.path))), !C))
        throw Zo(1, { location: y, currentLocation: _ })
      ;((F = C.record.name), (A = Pt({}, _.params, y.params)), (k = C.stringify(A)))
    }
    const N = []
    let E = C
    for (; E; ) (N.unshift(E.record), (E = E.parent))
    return { name: F, path: k, params: A, matched: N, meta: M0(N) }
  }
  e.forEach(y => s(y))
  function p() {
    ;((r.length = 0), n.clear())
  }
  return { addRoute: s, resolve: g, removeRoute: a, clearRoutes: p, getRoutes: d, getRecordMatcher: i }
}
function Ff(e, t) {
  const r = {}
  for (const n of t) n in e && (r[n] = e[n])
  return r
}
function jf(e) {
  const t = {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: e.aliasOf,
    beforeEnter: e.beforeEnter,
    props: L0(e),
    children: e.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: 'components' in e ? e.components || null : e.component && { default: e.component }
  }
  return (Object.defineProperty(t, 'mods', { value: {} }), t)
}
function L0(e) {
  const t = {},
    r = e.props || !1
  if ('component' in e) t.default = r
  else for (const n in e.components) t[n] = typeof r == 'object' ? r[n] : r
  return t
}
function Nf(e) {
  for (; e; ) {
    if (e.record.aliasOf) return !0
    e = e.parent
  }
  return !1
}
function M0(e) {
  return e.reduce((t, r) => Pt(t, r.meta), {})
}
function Hf(e, t) {
  const r = {}
  for (const n in e) r[n] = n in t ? t[n] : e[n]
  return r
}
function I0(e, t) {
  let r = 0,
    n = t.length
  for (; r !== n; ) {
    const s = (r + n) >> 1
    qp(e, t[s]) < 0 ? (n = s) : (r = s + 1)
  }
  const i = F0(e)
  return (i && (n = t.lastIndexOf(i, n - 1)), n)
}
function F0(e) {
  let t = e
  for (; (t = t.parent); ) if (Up(t) && qp(e, t) === 0) return t
}
function Up({ record: e }) {
  return !!(e.name || (e.components && Object.keys(e.components).length) || e.redirect)
}
function j0(e) {
  const t = {}
  if (e === '' || e === '?') return t
  const n = (e[0] === '?' ? e.slice(1) : e).split('&')
  for (let i = 0; i < n.length; ++i) {
    const s = n[i].replace(Mp, ' '),
      a = s.indexOf('='),
      d = na(a < 0 ? s : s.slice(0, a)),
      f = a < 0 ? null : na(s.slice(a + 1))
    if (d in t) {
      let g = t[d]
      ;(Ar(g) || (g = t[d] = [g]), g.push(f))
    } else t[d] = f
  }
  return t
}
function $f(e) {
  let t = ''
  for (let r in e) {
    const n = e[r]
    if (((r = r0(r)), n == null)) {
      n !== void 0 && (t += (t.length ? '&' : '') + r)
      continue
    }
    ;(Ar(n) ? n.map(s => s && au(s)) : [n && au(n)]).forEach(s => {
      s !== void 0 && ((t += (t.length ? '&' : '') + r), s != null && (t += '=' + s))
    })
  }
  return t
}
function N0(e) {
  const t = {}
  for (const r in e) {
    const n = e[r]
    n !== void 0 && (t[r] = Ar(n) ? n.map(i => (i == null ? null : '' + i)) : n == null ? n : '' + n)
  }
  return t
}
const H0 = Symbol(''),
  Bf = Symbol(''),
  Bu = Symbol(''),
  Wp = Symbol(''),
  cu = Symbol('')
function Ps() {
  let e = []
  function t(n) {
    return (
      e.push(n),
      () => {
        const i = e.indexOf(n)
        i > -1 && e.splice(i, 1)
      }
    )
  }
  function r() {
    e = []
  }
  return { add: t, list: () => e.slice(), reset: r }
}
function Li(e, t, r, n, i, s = a => a()) {
  const a = n && (n.enterCallbacks[i] = n.enterCallbacks[i] || [])
  return () =>
    new Promise((d, f) => {
      const g = _ => {
          _ === !1
            ? f(Zo(4, { from: r, to: t }))
            : _ instanceof Error
              ? f(_)
              : S0(_)
                ? f(Zo(2, { from: t, to: _ }))
                : (a && n.enterCallbacks[i] === a && typeof _ == 'function' && a.push(_), d())
        },
        p = s(() => e.call(n && n.instances[i], t, r, g))
      let y = Promise.resolve(p)
      ;(e.length < 3 && (y = y.then(g)), y.catch(_ => f(_)))
    })
}
function Bc(e, t, r, n, i = s => s()) {
  const s = []
  for (const a of e)
    for (const d in a.components) {
      let f = a.components[d]
      if (!(t !== 'beforeRouteEnter' && !a.instances[d]))
        if (Rp(f)) {
          const p = (f.__vccOpts || f)[t]
          p && s.push(Li(p, r, n, a, d, i))
        } else {
          let g = f()
          s.push(() =>
            g.then(p => {
              if (!p) throw new Error(`Couldn't resolve component "${d}" at "${a.path}"`)
              const y = z_(p) ? p.default : p
              ;((a.mods[d] = p), (a.components[d] = y))
              const C = (y.__vccOpts || y)[t]
              return C && Li(C, r, n, a, d, i)()
            })
          )
        }
    }
  return s
}
function qf(e) {
  const t = di(Bu),
    r = di(Wp),
    n = sr(() => {
      const f = zo(e.to)
      return t.resolve(f)
    }),
    i = sr(() => {
      const { matched: f } = n.value,
        { length: g } = f,
        p = f[g - 1],
        y = r.matched
      if (!p || !y.length) return -1
      const _ = y.findIndex(Qo.bind(null, p))
      if (_ > -1) return _
      const C = Uf(f[g - 2])
      return g > 1 && Uf(p) === C && y[y.length - 1].path !== C ? y.findIndex(Qo.bind(null, f[g - 2])) : _
    }),
    s = sr(() => i.value > -1 && W0(r.params, n.value.params)),
    a = sr(() => i.value > -1 && i.value === r.matched.length - 1 && Np(r.params, n.value.params))
  function d(f = {}) {
    if (U0(f)) {
      const g = t[zo(e.replace) ? 'replace' : 'push'](zo(e.to)).catch(Ws)
      return (
        e.viewTransition &&
          typeof document < 'u' &&
          'startViewTransition' in document &&
          document.startViewTransition(() => g),
        g
      )
    }
    return Promise.resolve()
  }
  return { route: n, href: sr(() => n.value.href), isActive: s, isExactActive: a, navigate: d }
}
function $0(e) {
  return e.length === 1 ? e[0] : e
}
const B0 = ip({
    name: 'RouterLink',
    compatConfig: { MODE: 3 },
    props: {
      to: { type: [String, Object], required: !0 },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: { type: String, default: 'page' },
      viewTransition: Boolean
    },
    useLink: qf,
    setup(e, { slots: t }) {
      const r = nn(qf(e)),
        { options: n } = di(Bu),
        i = sr(() => ({
          [Wf(e.activeClass, n.linkActiveClass, 'router-link-active')]: r.isActive,
          [Wf(e.exactActiveClass, n.linkExactActiveClass, 'router-link-exact-active')]: r.isExactActive
        }))
      return () => {
        const s = t.default && $0(t.default(r))
        return e.custom
          ? s
          : Ep(
              'a',
              {
                'aria-current': r.isExactActive ? e.ariaCurrentValue : null,
                href: r.href,
                onClick: r.navigate,
                class: i.value
              },
              s
            )
      }
    }
  }),
  q0 = B0
function U0(e) {
  if (
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) &&
    !e.defaultPrevented &&
    !(e.button !== void 0 && e.button !== 0)
  ) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute('target')
      if (/\b_blank\b/i.test(t)) return
    }
    return (e.preventDefault && e.preventDefault(), !0)
  }
}
function W0(e, t) {
  for (const r in t) {
    const n = t[r],
      i = e[r]
    if (typeof n == 'string') {
      if (n !== i) return !1
    } else if (!Ar(i) || i.length !== n.length || n.some((s, a) => s !== i[a])) return !1
  }
  return !0
}
function Uf(e) {
  return e ? (e.aliasOf ? e.aliasOf.path : e.path) : ''
}
const Wf = (e, t, r) => e ?? t ?? r,
  V0 = ip({
    name: 'RouterView',
    inheritAttrs: !1,
    props: { name: { type: String, default: 'default' }, route: Object },
    compatConfig: { MODE: 3 },
    setup(e, { attrs: t, slots: r }) {
      const n = di(cu),
        i = sr(() => e.route || n.value),
        s = di(Bf, 0),
        a = sr(() => {
          let g = zo(s)
          const { matched: p } = i.value
          let y
          for (; (y = p[g]) && !y.components; ) g++
          return g
        }),
        d = sr(() => i.value.matched[a.value])
      ;(il(
        Bf,
        sr(() => a.value + 1)
      ),
        il(H0, d),
        il(cu, i))
      const f = qe()
      return (
        ol(
          () => [f.value, d.value, e.name],
          ([g, p, y], [_, C, A]) => {
            ;(p &&
              ((p.instances[y] = g),
              C &&
                C !== p &&
                g &&
                g === _ &&
                (p.leaveGuards.size || (p.leaveGuards = C.leaveGuards),
                p.updateGuards.size || (p.updateGuards = C.updateGuards))),
              g && p && (!C || !Qo(p, C) || !_) && (p.enterCallbacks[y] || []).forEach(k => k(g)))
          },
          { flush: 'post' }
        ),
        () => {
          const g = i.value,
            p = e.name,
            y = d.value,
            _ = y && y.components[p]
          if (!_) return Vf(r.default, { Component: _, route: g })
          const C = y.props[p],
            A = C ? (C === !0 ? g.params : typeof C == 'function' ? C(g) : C) : null,
            F = Ep(
              _,
              Pt({}, A, t, {
                onVnodeUnmounted: N => {
                  N.component.isUnmounted && (y.instances[p] = null)
                },
                ref: f
              })
            )
          return Vf(r.default, { Component: F, route: g }) || F
        }
      )
    }
  })
function Vf(e, t) {
  if (!e) return null
  const r = e(t)
  return r.length === 1 ? r[0] : r
}
const z0 = V0
function K0(e) {
  const t = R0(e.routes, e),
    r = e.parseQuery || j0,
    n = e.stringifyQuery || $f,
    i = e.history,
    s = Ps(),
    a = Ps(),
    d = Ps(),
    f = iy(Oi)
  let g = Oi
  Bo && e.scrollBehavior && 'scrollRestoration' in history && (history.scrollRestoration = 'manual')
  const p = Hc.bind(null, K => '' + K),
    y = Hc.bind(null, o0),
    _ = Hc.bind(null, na)
  function C(K, ve) {
    let Se, Ce
    return ($p(K) ? ((Se = t.getRecordMatcher(K)), (Ce = ve)) : (Ce = K), t.addRoute(Ce, Se))
  }
  function A(K) {
    const ve = t.getRecordMatcher(K)
    ve && t.removeRoute(ve)
  }
  function k() {
    return t.getRoutes().map(K => K.record)
  }
  function F(K) {
    return !!t.getRecordMatcher(K)
  }
  function N(K, ve) {
    if (((ve = Pt({}, ve || f.value)), typeof K == 'string')) {
      const q = $c(r, K, ve.path),
        te = t.resolve({ path: q.path }, ve),
        ie = i.createHref(q.fullPath)
      return Pt(q, te, { params: _(te.params), hash: na(q.hash), redirectedFrom: void 0, href: ie })
    }
    let Se
    if (K.path != null) Se = Pt({}, K, { path: $c(r, K.path, ve.path).path })
    else {
      const q = Pt({}, K.params)
      for (const te in q) q[te] == null && delete q[te]
      ;((Se = Pt({}, K, { params: y(q) })), (ve.params = y(ve.params)))
    }
    const Ce = t.resolve(Se, ve),
      xt = K.hash || ''
    Ce.params = p(_(Ce.params))
    const R = l0(n, Pt({}, K, { hash: n0(xt), path: Ce.path })),
      M = i.createHref(R)
    return Pt({ fullPath: R, hash: xt, query: n === $f ? N0(K.query) : K.query || {} }, Ce, {
      redirectedFrom: void 0,
      href: M
    })
  }
  function E(K) {
    return typeof K == 'string' ? $c(r, K, f.value.path) : Pt({}, K)
  }
  function z(K, ve) {
    if (g !== K) return Zo(8, { from: ve, to: K })
  }
  function Y(K) {
    return m(K)
  }
  function ue(K) {
    return Y(Pt(E(K), { replace: !0 }))
  }
  function ke(K) {
    const ve = K.matched[K.matched.length - 1]
    if (ve && ve.redirect) {
      const { redirect: Se } = ve
      let Ce = typeof Se == 'function' ? Se(K) : Se
      return (
        typeof Ce == 'string' &&
          ((Ce = Ce.includes('?') || Ce.includes('#') ? (Ce = E(Ce)) : { path: Ce }), (Ce.params = {})),
        Pt({ query: K.query, hash: K.hash, params: Ce.path != null ? {} : K.params }, Ce)
      )
    }
  }
  function m(K, ve) {
    const Se = (g = N(K)),
      Ce = f.value,
      xt = K.state,
      R = K.force,
      M = K.replace === !0,
      q = ke(Se)
    if (q)
      return m(Pt(E(q), { state: typeof q == 'object' ? Pt({}, xt, q.state) : xt, force: R, replace: M }), ve || Se)
    const te = Se
    te.redirectedFrom = ve
    let ie
    return (
      !R && c0(n, Ce, Se) && ((ie = Zo(16, { to: te, from: Ce })), Gt(Ce, Ce, !0, !1)),
      (ie ? Promise.resolve(ie) : fe(te, Ce))
        .catch(ne => (si(ne) ? (si(ne, 2) ? ne : At(ne)) : We(ne, te, Ce)))
        .then(ne => {
          if (ne) {
            if (si(ne, 2))
              return m(
                Pt({ replace: M }, E(ne.to), {
                  state: typeof ne.to == 'object' ? Pt({}, xt, ne.to.state) : xt,
                  force: R
                }),
                ve || te
              )
          } else ne = it(te, Ce, !0, M, xt)
          return (He(te, Ce, ne), ne)
        })
    )
  }
  function rt(K, ve) {
    const Se = z(K, ve)
    return Se ? Promise.reject(Se) : Promise.resolve()
  }
  function Ne(K) {
    const ve = _e.values().next().value
    return ve && typeof ve.runWithContext == 'function' ? ve.runWithContext(K) : K()
  }
  function fe(K, ve) {
    let Se
    const [Ce, xt, R] = X0(K, ve)
    Se = Bc(Ce.reverse(), 'beforeRouteLeave', K, ve)
    for (const q of Ce)
      q.leaveGuards.forEach(te => {
        Se.push(Li(te, K, ve))
      })
    const M = rt.bind(null, K, ve)
    return (
      Se.push(M),
      $e(Se)
        .then(() => {
          Se = []
          for (const q of s.list()) Se.push(Li(q, K, ve))
          return (Se.push(M), $e(Se))
        })
        .then(() => {
          Se = Bc(xt, 'beforeRouteUpdate', K, ve)
          for (const q of xt)
            q.updateGuards.forEach(te => {
              Se.push(Li(te, K, ve))
            })
          return (Se.push(M), $e(Se))
        })
        .then(() => {
          Se = []
          for (const q of R)
            if (q.beforeEnter)
              if (Ar(q.beforeEnter)) for (const te of q.beforeEnter) Se.push(Li(te, K, ve))
              else Se.push(Li(q.beforeEnter, K, ve))
          return (Se.push(M), $e(Se))
        })
        .then(
          () => (
            K.matched.forEach(q => (q.enterCallbacks = {})),
            (Se = Bc(R, 'beforeRouteEnter', K, ve, Ne)),
            Se.push(M),
            $e(Se)
          )
        )
        .then(() => {
          Se = []
          for (const q of a.list()) Se.push(Li(q, K, ve))
          return (Se.push(M), $e(Se))
        })
        .catch(q => (si(q, 8) ? q : Promise.reject(q)))
    )
  }
  function He(K, ve, Se) {
    d.list().forEach(Ce => Ne(() => Ce(K, ve, Se)))
  }
  function it(K, ve, Se, Ce, xt) {
    const R = z(K, ve)
    if (R) return R
    const M = ve === Oi,
      q = Bo ? history.state : {}
    ;(Se && (Ce || M ? i.replace(K.fullPath, Pt({ scroll: M && q && q.scroll }, xt)) : i.push(K.fullPath, xt)),
      (f.value = K),
      Gt(K, ve, Se, M),
      At())
  }
  let Pe
  function re() {
    Pe ||
      (Pe = i.listen((K, ve, Se) => {
        if (!Ke.listening) return
        const Ce = N(K),
          xt = ke(Ce)
        if (xt) {
          m(Pt(xt, { replace: !0, force: !0 }), Ce).catch(Ws)
          return
        }
        g = Ce
        const R = f.value
        ;(Bo && g0(Pf(R.fullPath, Se.delta), Wl()),
          fe(Ce, R)
            .catch(M =>
              si(M, 12)
                ? M
                : si(M, 2)
                  ? (m(Pt(E(M.to), { force: !0 }), Ce)
                      .then(q => {
                        si(q, 20) && !Se.delta && Se.type === ra.pop && i.go(-1, !1)
                      })
                      .catch(Ws),
                    Promise.reject())
                  : (Se.delta && i.go(-Se.delta, !1), We(M, Ce, R))
            )
            .then(M => {
              ;((M = M || it(Ce, R, !1)),
                M && (Se.delta && !si(M, 8) ? i.go(-Se.delta, !1) : Se.type === ra.pop && si(M, 20) && i.go(-1, !1)),
                He(Ce, R, M))
            })
            .catch(Ws))
      }))
  }
  let Ee = Ps(),
    Me = Ps(),
    Be
  function We(K, ve, Se) {
    At(K)
    const Ce = Me.list()
    return (Ce.length ? Ce.forEach(xt => xt(K, ve, Se)) : console.error(K), Promise.reject(K))
  }
  function ht() {
    return Be && f.value !== Oi
      ? Promise.resolve()
      : new Promise((K, ve) => {
          Ee.add([K, ve])
        })
  }
  function At(K) {
    return (Be || ((Be = !K), re(), Ee.list().forEach(([ve, Se]) => (K ? Se(K) : ve())), Ee.reset()), K)
  }
  function Gt(K, ve, Se, Ce) {
    const { scrollBehavior: xt } = e
    if (!Bo || !xt) return Promise.resolve()
    const R = (!Se && b0(Pf(K.fullPath, 0))) || ((Ce || !Se) && history.state && history.state.scroll) || null
    return Bi()
      .then(() => xt(K, ve, R))
      .then(M => M && v0(M))
      .catch(M => We(M, K, ve))
  }
  const Tt = K => i.go(K)
  let rn
  const _e = new Set(),
    Ke = {
      currentRoute: f,
      listening: !0,
      addRoute: C,
      removeRoute: A,
      clearRoutes: t.clearRoutes,
      hasRoute: F,
      getRoutes: k,
      resolve: N,
      options: e,
      push: Y,
      replace: ue,
      go: Tt,
      back: () => Tt(-1),
      forward: () => Tt(1),
      beforeEach: s.add,
      beforeResolve: a.add,
      afterEach: d.add,
      onError: Me.add,
      isReady: ht,
      install(K) {
        const ve = this
        ;(K.component('RouterLink', q0),
          K.component('RouterView', z0),
          (K.config.globalProperties.$router = ve),
          Object.defineProperty(K.config.globalProperties, '$route', { enumerable: !0, get: () => zo(f) }),
          Bo && !rn && f.value === Oi && ((rn = !0), Y(i.location).catch(xt => {})))
        const Se = {}
        for (const xt in Oi) Object.defineProperty(Se, xt, { get: () => f.value[xt], enumerable: !0 })
        ;(K.provide(Bu, ve), K.provide(Wp, Xh(Se)), K.provide(cu, f))
        const Ce = K.unmount
        ;(_e.add(K),
          (K.unmount = function () {
            ;(_e.delete(K),
              _e.size < 1 && ((g = Oi), Pe && Pe(), (Pe = null), (f.value = Oi), (rn = !1), (Be = !1)),
              Ce())
          }))
      }
    }
  function $e(K) {
    return K.reduce((ve, Se) => ve.then(() => Ne(Se)), Promise.resolve())
  }
  return Ke
}
function X0(e, t) {
  const r = [],
    n = [],
    i = [],
    s = Math.max(t.matched.length, e.matched.length)
  for (let a = 0; a < s; a++) {
    const d = t.matched[a]
    d && (e.matched.find(g => Qo(g, d)) ? n.push(d) : r.push(d))
    const f = e.matched[a]
    f && (t.matched.find(g => Qo(g, f)) || i.push(f))
  }
  return [r, n, i]
}
var Fs = { exports: {} }
/*!
 * Tabler v1.3.2 (https://tabler.io)
 * Copyright 2018-2025 The Tabler Authors
 * Copyright 2018-2025 codecalm.net Paweł Kuna
 * Licensed under MIT (https://github.com/tabler/tabler/blob/master/LICENSE)
 */ var G0 = Fs.exports,
  zf
function J0() {
  return (
    zf ||
      ((zf = 1),
      (function (e, t) {
        ;(function (r, n) {
          n(t)
        })(G0, function (r) {
          const n = document.querySelectorAll('[data-bs-toggle="autosize"]')
          n.length &&
            n.forEach(function (S) {
              window.autosize && window.autosize(S)
            })
          const i = document.querySelectorAll('[data-countup]')
          ;(i.length &&
            i.forEach(function (S) {
              let u = {}
              try {
                const D = S.getAttribute('data-countup') ? JSON.parse(S.getAttribute('data-countup')) : {}
                u = Object.assign({ enableScrollSpy: !0 }, D)
              } catch {}
              const b = parseInt(S.innerHTML, 10)
              if (window.countUp && window.countUp.CountUp) {
                const D = new window.countUp.CountUp(S, b, u)
                D.error || D.start()
              }
            }),
            [].slice.call(document.querySelectorAll('[data-mask]')).map(function (S) {
              window.IMask && new window.IMask(S, { mask: S.dataset.mask, lazy: S.dataset['mask-visible'] === 'true' })
            }))
          var s = 'top',
            a = 'bottom',
            d = 'right',
            f = 'left',
            g = 'auto',
            p = [s, a, d, f],
            y = 'start',
            _ = 'end',
            C = 'clippingParents',
            A = 'viewport',
            k = 'popper',
            F = 'reference',
            N = p.reduce(function (S, u) {
              return S.concat([u + '-' + y, u + '-' + _])
            }, []),
            E = [].concat(p, [g]).reduce(function (S, u) {
              return S.concat([u, u + '-' + y, u + '-' + _])
            }, []),
            z = 'beforeRead',
            Y = 'read',
            ue = 'afterRead',
            ke = 'beforeMain',
            m = 'main',
            rt = 'afterMain',
            Ne = 'beforeWrite',
            fe = 'write',
            He = 'afterWrite',
            it = [z, Y, ue, ke, m, rt, Ne, fe, He]
          function Pe(S) {
            return S ? (S.nodeName || '').toLowerCase() : null
          }
          function re(S) {
            if (S == null) return window
            if (S.toString() !== '[object Window]') {
              var u = S.ownerDocument
              return (u && u.defaultView) || window
            }
            return S
          }
          function Ee(S) {
            return S instanceof re(S).Element || S instanceof Element
          }
          function Me(S) {
            return S instanceof re(S).HTMLElement || S instanceof HTMLElement
          }
          function Be(S) {
            return typeof ShadowRoot < 'u' && (S instanceof re(S).ShadowRoot || S instanceof ShadowRoot)
          }
          const We = {
            name: 'applyStyles',
            enabled: !0,
            phase: 'write',
            fn: function (S) {
              var u = S.state
              Object.keys(u.elements).forEach(function (b) {
                var D = u.styles[b] || {},
                  $ = u.attributes[b] || {},
                  B = u.elements[b]
                Me(B) &&
                  Pe(B) &&
                  (Object.assign(B.style, D),
                  Object.keys($).forEach(function (J) {
                    var oe = $[J]
                    oe === !1 ? B.removeAttribute(J) : B.setAttribute(J, oe === !0 ? '' : oe)
                  }))
              })
            },
            effect: function (S) {
              var u = S.state,
                b = {
                  popper: { position: u.options.strategy, left: '0', top: '0', margin: '0' },
                  arrow: { position: 'absolute' },
                  reference: {}
                }
              return (
                Object.assign(u.elements.popper.style, b.popper),
                (u.styles = b),
                u.elements.arrow && Object.assign(u.elements.arrow.style, b.arrow),
                function () {
                  Object.keys(u.elements).forEach(function (D) {
                    var $ = u.elements[D],
                      B = u.attributes[D] || {},
                      J = Object.keys(u.styles.hasOwnProperty(D) ? u.styles[D] : b[D]).reduce(function (oe, xe) {
                        return ((oe[xe] = ''), oe)
                      }, {})
                    Me($) &&
                      Pe($) &&
                      (Object.assign($.style, J),
                      Object.keys(B).forEach(function (oe) {
                        $.removeAttribute(oe)
                      }))
                  })
                }
              )
            },
            requires: ['computeStyles']
          }
          function ht(S) {
            return S.split('-')[0]
          }
          var At = Math.max,
            Gt = Math.min,
            Tt = Math.round
          function rn() {
            var S = navigator.userAgentData
            return S != null && S.brands && Array.isArray(S.brands)
              ? S.brands
                  .map(function (u) {
                    return u.brand + '/' + u.version
                  })
                  .join(' ')
              : navigator.userAgent
          }
          function _e() {
            return !/^((?!chrome|android).)*safari/i.test(rn())
          }
          function Ke(S, u, b) {
            ;(u === void 0 && (u = !1), b === void 0 && (b = !1))
            var D = S.getBoundingClientRect(),
              $ = 1,
              B = 1
            u &&
              Me(S) &&
              (($ = (S.offsetWidth > 0 && Tt(D.width) / S.offsetWidth) || 1),
              (B = (S.offsetHeight > 0 && Tt(D.height) / S.offsetHeight) || 1))
            var J = (Ee(S) ? re(S) : window).visualViewport,
              oe = !_e() && b,
              xe = (D.left + (oe && J ? J.offsetLeft : 0)) / $,
              Re = (D.top + (oe && J ? J.offsetTop : 0)) / B,
              Le = D.width / $,
              De = D.height / B
            return { width: Le, height: De, top: Re, right: xe + Le, bottom: Re + De, left: xe, x: xe, y: Re }
          }
          function $e(S) {
            var u = Ke(S),
              b = S.offsetWidth,
              D = S.offsetHeight
            return (
              Math.abs(u.width - b) <= 1 && (b = u.width),
              Math.abs(u.height - D) <= 1 && (D = u.height),
              { x: S.offsetLeft, y: S.offsetTop, width: b, height: D }
            )
          }
          function K(S, u) {
            var b = u.getRootNode && u.getRootNode()
            if (S.contains(u)) return !0
            if (b && Be(b)) {
              var D = u
              do {
                if (D && S.isSameNode(D)) return !0
                D = D.parentNode || D.host
              } while (D)
            }
            return !1
          }
          function ve(S) {
            return re(S).getComputedStyle(S)
          }
          function Se(S) {
            return ['table', 'td', 'th'].indexOf(Pe(S)) >= 0
          }
          function Ce(S) {
            return ((Ee(S) ? S.ownerDocument : S.document) || window.document).documentElement
          }
          function xt(S) {
            return Pe(S) === 'html' ? S : S.assignedSlot || S.parentNode || (Be(S) ? S.host : null) || Ce(S)
          }
          function R(S) {
            return Me(S) && ve(S).position !== 'fixed' ? S.offsetParent : null
          }
          function M(S) {
            for (var u = re(S), b = R(S); b && Se(b) && ve(b).position === 'static'; ) b = R(b)
            return b && (Pe(b) === 'html' || (Pe(b) === 'body' && ve(b).position === 'static'))
              ? u
              : b ||
                  (function (D) {
                    var $ = /firefox/i.test(rn())
                    if (/Trident/i.test(rn()) && Me(D) && ve(D).position === 'fixed') return null
                    var B = xt(D)
                    for (Be(B) && (B = B.host); Me(B) && ['html', 'body'].indexOf(Pe(B)) < 0; ) {
                      var J = ve(B)
                      if (
                        J.transform !== 'none' ||
                        J.perspective !== 'none' ||
                        J.contain === 'paint' ||
                        ['transform', 'perspective'].indexOf(J.willChange) !== -1 ||
                        ($ && J.willChange === 'filter') ||
                        ($ && J.filter && J.filter !== 'none')
                      )
                        return B
                      B = B.parentNode
                    }
                    return null
                  })(S) ||
                  u
          }
          function q(S) {
            return ['top', 'bottom'].indexOf(S) >= 0 ? 'x' : 'y'
          }
          function te(S, u, b) {
            return At(S, Gt(u, b))
          }
          function ie(S) {
            return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, S)
          }
          function ne(S, u) {
            return u.reduce(function (b, D) {
              return ((b[D] = S), b)
            }, {})
          }
          const ge = {
            name: 'arrow',
            enabled: !0,
            phase: 'main',
            fn: function (S) {
              var u,
                b = S.state,
                D = S.name,
                $ = S.options,
                B = b.elements.arrow,
                J = b.modifiersData.popperOffsets,
                oe = ht(b.placement),
                xe = q(oe),
                Re = [f, d].indexOf(oe) >= 0 ? 'height' : 'width'
              if (B && J) {
                var Le = (function (Nt, It) {
                    return ie(
                      typeof (Nt =
                        typeof Nt == 'function' ? Nt(Object.assign({}, It.rects, { placement: It.placement })) : Nt) !=
                        'number'
                        ? Nt
                        : ne(Nt, p)
                    )
                  })($.padding, b),
                  De = $e(B),
                  ut = xe === 'y' ? s : f,
                  Qe = xe === 'y' ? a : d,
                  ot = b.rects.reference[Re] + b.rects.reference[xe] - J[xe] - b.rects.popper[Re],
                  nt = J[xe] - b.rects.reference[xe],
                  st = M(B),
                  jt = st ? (xe === 'y' ? st.clientHeight || 0 : st.clientWidth || 0) : 0,
                  Ut = ot / 2 - nt / 2,
                  vt = Le[ut],
                  kt = jt - De[Re] - Le[Qe],
                  ft = jt / 2 - De[Re] / 2 + Ut,
                  wt = te(vt, ft, kt),
                  Mt = xe
                b.modifiersData[D] = (((u = {})[Mt] = wt), (u.centerOffset = wt - ft), u)
              }
            },
            effect: function (S) {
              var u = S.state,
                b = S.options.element,
                D = b === void 0 ? '[data-popper-arrow]' : b
              D != null &&
                (typeof D != 'string' || (D = u.elements.popper.querySelector(D))) &&
                K(u.elements.popper, D) &&
                (u.elements.arrow = D)
            },
            requires: ['popperOffsets'],
            requiresIfExists: ['preventOverflow']
          }
          function me(S) {
            return S.split('-')[1]
          }
          var ye = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' }
          function de(S) {
            var u,
              b = S.popper,
              D = S.popperRect,
              $ = S.placement,
              B = S.variation,
              J = S.offsets,
              oe = S.position,
              xe = S.gpuAcceleration,
              Re = S.adaptive,
              Le = S.roundOffsets,
              De = S.isFixed,
              ut = J.x,
              Qe = ut === void 0 ? 0 : ut,
              ot = J.y,
              nt = ot === void 0 ? 0 : ot,
              st = typeof Le == 'function' ? Le({ x: Qe, y: nt }) : { x: Qe, y: nt }
            ;((Qe = st.x), (nt = st.y))
            var jt = J.hasOwnProperty('x'),
              Ut = J.hasOwnProperty('y'),
              vt = f,
              kt = s,
              ft = window
            if (Re) {
              var wt = M(b),
                Mt = 'clientHeight',
                Nt = 'clientWidth'
              ;(wt === re(b) &&
                ve((wt = Ce(b))).position !== 'static' &&
                oe === 'absolute' &&
                ((Mt = 'scrollHeight'), (Nt = 'scrollWidth')),
                ($ === s || (($ === f || $ === d) && B === _)) &&
                  ((kt = a),
                  (nt -= (De && wt === ft && ft.visualViewport ? ft.visualViewport.height : wt[Mt]) - D.height),
                  (nt *= xe ? 1 : -1)),
                ($ !== f && (($ !== s && $ !== a) || B !== _)) ||
                  ((vt = d),
                  (Qe -= (De && wt === ft && ft.visualViewport ? ft.visualViewport.width : wt[Nt]) - D.width),
                  (Qe *= xe ? 1 : -1)))
            }
            var It,
              an = Object.assign({ position: oe }, Re && ye),
              rr =
                Le === !0
                  ? (function (xr, jn) {
                      var dr = xr.x,
                        fr = xr.y,
                        Zt = jn.devicePixelRatio || 1
                      return { x: Tt(dr * Zt) / Zt || 0, y: Tt(fr * Zt) / Zt || 0 }
                    })({ x: Qe, y: nt }, re(b))
                  : { x: Qe, y: nt }
            return (
              (Qe = rr.x),
              (nt = rr.y),
              xe
                ? Object.assign(
                    {},
                    an,
                    (((It = {})[kt] = Ut ? '0' : ''),
                    (It[vt] = jt ? '0' : ''),
                    (It.transform =
                      (ft.devicePixelRatio || 1) <= 1
                        ? 'translate(' + Qe + 'px, ' + nt + 'px)'
                        : 'translate3d(' + Qe + 'px, ' + nt + 'px, 0)'),
                    It)
                  )
                : Object.assign(
                    {},
                    an,
                    (((u = {})[kt] = Ut ? nt + 'px' : ''), (u[vt] = jt ? Qe + 'px' : ''), (u.transform = ''), u)
                  )
            )
          }
          const Oe = {
            name: 'computeStyles',
            enabled: !0,
            phase: 'beforeWrite',
            fn: function (S) {
              var u = S.state,
                b = S.options,
                D = b.gpuAcceleration,
                $ = D === void 0 || D,
                B = b.adaptive,
                J = B === void 0 || B,
                oe = b.roundOffsets,
                xe = oe === void 0 || oe,
                Re = {
                  placement: ht(u.placement),
                  variation: me(u.placement),
                  popper: u.elements.popper,
                  popperRect: u.rects.popper,
                  gpuAcceleration: $,
                  isFixed: u.options.strategy === 'fixed'
                }
              ;(u.modifiersData.popperOffsets != null &&
                (u.styles.popper = Object.assign(
                  {},
                  u.styles.popper,
                  de(
                    Object.assign({}, Re, {
                      offsets: u.modifiersData.popperOffsets,
                      position: u.options.strategy,
                      adaptive: J,
                      roundOffsets: xe
                    })
                  )
                )),
                u.modifiersData.arrow != null &&
                  (u.styles.arrow = Object.assign(
                    {},
                    u.styles.arrow,
                    de(
                      Object.assign({}, Re, {
                        offsets: u.modifiersData.arrow,
                        position: 'absolute',
                        adaptive: !1,
                        roundOffsets: xe
                      })
                    )
                  )),
                (u.attributes.popper = Object.assign({}, u.attributes.popper, {
                  'data-popper-placement': u.placement
                })))
            },
            data: {}
          }
          var we = { passive: !0 }
          const Ie = {
            name: 'eventListeners',
            enabled: !0,
            phase: 'write',
            fn: function () {},
            effect: function (S) {
              var u = S.state,
                b = S.instance,
                D = S.options,
                $ = D.scroll,
                B = $ === void 0 || $,
                J = D.resize,
                oe = J === void 0 || J,
                xe = re(u.elements.popper),
                Re = [].concat(u.scrollParents.reference, u.scrollParents.popper)
              return (
                B &&
                  Re.forEach(function (Le) {
                    Le.addEventListener('scroll', b.update, we)
                  }),
                oe && xe.addEventListener('resize', b.update, we),
                function () {
                  ;(B &&
                    Re.forEach(function (Le) {
                      Le.removeEventListener('scroll', b.update, we)
                    }),
                    oe && xe.removeEventListener('resize', b.update, we))
                }
              )
            },
            data: {}
          }
          var se = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' }
          function Ve(S) {
            return S.replace(/left|right|bottom|top/g, function (u) {
              return se[u]
            })
          }
          var Ot = { start: 'end', end: 'start' }
          function St(S) {
            return S.replace(/start|end/g, function (u) {
              return Ot[u]
            })
          }
          function cn(S) {
            var u = re(S)
            return { scrollLeft: u.pageXOffset, scrollTop: u.pageYOffset }
          }
          function on(S) {
            return Ke(Ce(S)).left + cn(S).scrollLeft
          }
          function bn(S) {
            var u = ve(S),
              b = u.overflow,
              D = u.overflowX,
              $ = u.overflowY
            return /auto|scroll|overlay|hidden/.test(b + $ + D)
          }
          function hn(S) {
            return ['html', 'body', '#document'].indexOf(Pe(S)) >= 0
              ? S.ownerDocument.body
              : Me(S) && bn(S)
                ? S
                : hn(xt(S))
          }
          function sn(S, u) {
            var b
            u === void 0 && (u = [])
            var D = hn(S),
              $ = D === ((b = S.ownerDocument) == null ? void 0 : b.body),
              B = re(D),
              J = $ ? [B].concat(B.visualViewport || [], bn(D) ? D : []) : D,
              oe = u.concat(J)
            return $ ? oe : oe.concat(sn(xt(J)))
          }
          function Un(S) {
            return Object.assign({}, S, { left: S.x, top: S.y, right: S.x + S.width, bottom: S.y + S.height })
          }
          function Yt(S, u, b) {
            return u === A
              ? Un(
                  (function (D, $) {
                    var B = re(D),
                      J = Ce(D),
                      oe = B.visualViewport,
                      xe = J.clientWidth,
                      Re = J.clientHeight,
                      Le = 0,
                      De = 0
                    if (oe) {
                      ;((xe = oe.width), (Re = oe.height))
                      var ut = _e()
                      ;(ut || (!ut && $ === 'fixed')) && ((Le = oe.offsetLeft), (De = oe.offsetTop))
                    }
                    return { width: xe, height: Re, x: Le + on(D), y: De }
                  })(S, b)
                )
              : Ee(u)
                ? (function (D, $) {
                    var B = Ke(D, !1, $ === 'fixed')
                    return (
                      (B.top = B.top + D.clientTop),
                      (B.left = B.left + D.clientLeft),
                      (B.bottom = B.top + D.clientHeight),
                      (B.right = B.left + D.clientWidth),
                      (B.width = D.clientWidth),
                      (B.height = D.clientHeight),
                      (B.x = B.left),
                      (B.y = B.top),
                      B
                    )
                  })(u, b)
                : Un(
                    (function (D) {
                      var $,
                        B = Ce(D),
                        J = cn(D),
                        oe = ($ = D.ownerDocument) == null ? void 0 : $.body,
                        xe = At(B.scrollWidth, B.clientWidth, oe ? oe.scrollWidth : 0, oe ? oe.clientWidth : 0),
                        Re = At(B.scrollHeight, B.clientHeight, oe ? oe.scrollHeight : 0, oe ? oe.clientHeight : 0),
                        Le = -J.scrollLeft + on(D),
                        De = -J.scrollTop
                      return (
                        ve(oe || B).direction === 'rtl' && (Le += At(B.clientWidth, oe ? oe.clientWidth : 0) - xe),
                        { width: xe, height: Re, x: Le, y: De }
                      )
                    })(Ce(S))
                  )
          }
          function Rn(S) {
            var u,
              b = S.reference,
              D = S.element,
              $ = S.placement,
              B = $ ? ht($) : null,
              J = $ ? me($) : null,
              oe = b.x + b.width / 2 - D.width / 2,
              xe = b.y + b.height / 2 - D.height / 2
            switch (B) {
              case s:
                u = { x: oe, y: b.y - D.height }
                break
              case a:
                u = { x: oe, y: b.y + b.height }
                break
              case d:
                u = { x: b.x + b.width, y: xe }
                break
              case f:
                u = { x: b.x - D.width, y: xe }
                break
              default:
                u = { x: b.x, y: b.y }
            }
            var Re = B ? q(B) : null
            if (Re != null) {
              var Le = Re === 'y' ? 'height' : 'width'
              switch (J) {
                case y:
                  u[Re] = u[Re] - (b[Le] / 2 - D[Le] / 2)
                  break
                case _:
                  u[Re] = u[Re] + (b[Le] / 2 - D[Le] / 2)
              }
            }
            return u
          }
          function Wn(S, u) {
            u === void 0 && (u = {})
            var b = u,
              D = b.placement,
              $ = D === void 0 ? S.placement : D,
              B = b.strategy,
              J = B === void 0 ? S.strategy : B,
              oe = b.boundary,
              xe = oe === void 0 ? C : oe,
              Re = b.rootBoundary,
              Le = Re === void 0 ? A : Re,
              De = b.elementContext,
              ut = De === void 0 ? k : De,
              Qe = b.altBoundary,
              ot = Qe !== void 0 && Qe,
              nt = b.padding,
              st = nt === void 0 ? 0 : nt,
              jt = ie(typeof st != 'number' ? st : ne(st, p)),
              Ut = ut === k ? F : k,
              vt = S.rects.popper,
              kt = S.elements[ot ? Ut : ut],
              ft = (function (jn, dr, fr, Zt) {
                var Mr =
                    dr === 'clippingParents'
                      ? (function ($t) {
                          var Nn = sn(xt($t)),
                            hr = ['absolute', 'fixed'].indexOf(ve($t).position) >= 0 && Me($t) ? M($t) : $t
                          return Ee(hr)
                            ? Nn.filter(function (Ei) {
                                return Ee(Ei) && K(Ei, hr) && Pe(Ei) !== 'body'
                              })
                            : []
                        })(jn)
                      : [].concat(dr),
                  Ir = [].concat(Mr, [fr]),
                  Fo = Ir[0],
                  vn = Ir.reduce(
                    function ($t, Nn) {
                      var hr = Yt(jn, Nn, Zt)
                      return (
                        ($t.top = At(hr.top, $t.top)),
                        ($t.right = Gt(hr.right, $t.right)),
                        ($t.bottom = Gt(hr.bottom, $t.bottom)),
                        ($t.left = At(hr.left, $t.left)),
                        $t
                      )
                    },
                    Yt(jn, Fo, Zt)
                  )
                return (
                  (vn.width = vn.right - vn.left),
                  (vn.height = vn.bottom - vn.top),
                  (vn.x = vn.left),
                  (vn.y = vn.top),
                  vn
                )
              })(Ee(kt) ? kt : kt.contextElement || Ce(S.elements.popper), xe, Le, J),
              wt = Ke(S.elements.reference),
              Mt = Rn({ reference: wt, element: vt, placement: $ }),
              Nt = Un(Object.assign({}, vt, Mt)),
              It = ut === k ? Nt : wt,
              an = {
                top: ft.top - It.top + jt.top,
                bottom: It.bottom - ft.bottom + jt.bottom,
                left: ft.left - It.left + jt.left,
                right: It.right - ft.right + jt.right
              },
              rr = S.modifiersData.offset
            if (ut === k && rr) {
              var xr = rr[$]
              Object.keys(an).forEach(function (jn) {
                var dr = [d, a].indexOf(jn) >= 0 ? 1 : -1,
                  fr = [s, a].indexOf(jn) >= 0 ? 'y' : 'x'
                an[jn] += xr[fr] * dr
              })
            }
            return an
          }
          function xa(S, u) {
            u === void 0 && (u = {})
            var b = u,
              D = b.placement,
              $ = b.boundary,
              B = b.rootBoundary,
              J = b.padding,
              oe = b.flipVariations,
              xe = b.allowedAutoPlacements,
              Re = xe === void 0 ? E : xe,
              Le = me(D),
              De = Le
                ? oe
                  ? N
                  : N.filter(function (ot) {
                      return me(ot) === Le
                    })
                : p,
              ut = De.filter(function (ot) {
                return Re.indexOf(ot) >= 0
              })
            ut.length === 0 && (ut = De)
            var Qe = ut.reduce(function (ot, nt) {
              return ((ot[nt] = Wn(S, { placement: nt, boundary: $, rootBoundary: B, padding: J })[ht(nt)]), ot)
            }, {})
            return Object.keys(Qe).sort(function (ot, nt) {
              return Qe[ot] - Qe[nt]
            })
          }
          const ss = {
            name: 'flip',
            enabled: !0,
            phase: 'main',
            fn: function (S) {
              var u = S.state,
                b = S.options,
                D = S.name
              if (!u.modifiersData[D]._skip) {
                for (
                  var $ = b.mainAxis,
                    B = $ === void 0 || $,
                    J = b.altAxis,
                    oe = J === void 0 || J,
                    xe = b.fallbackPlacements,
                    Re = b.padding,
                    Le = b.boundary,
                    De = b.rootBoundary,
                    ut = b.altBoundary,
                    Qe = b.flipVariations,
                    ot = Qe === void 0 || Qe,
                    nt = b.allowedAutoPlacements,
                    st = u.options.placement,
                    jt = ht(st),
                    Ut =
                      xe ||
                      (jt !== st && ot
                        ? (function ($t) {
                            if (ht($t) === g) return []
                            var Nn = Ve($t)
                            return [St($t), Nn, St(Nn)]
                          })(st)
                        : [Ve(st)]),
                    vt = [st].concat(Ut).reduce(function ($t, Nn) {
                      return $t.concat(
                        ht(Nn) === g
                          ? xa(u, {
                              placement: Nn,
                              boundary: Le,
                              rootBoundary: De,
                              padding: Re,
                              flipVariations: ot,
                              allowedAutoPlacements: nt
                            })
                          : Nn
                      )
                    }, []),
                    kt = u.rects.reference,
                    ft = u.rects.popper,
                    wt = new Map(),
                    Mt = !0,
                    Nt = vt[0],
                    It = 0;
                  It < vt.length;
                  It++
                ) {
                  var an = vt[It],
                    rr = ht(an),
                    xr = me(an) === y,
                    jn = [s, a].indexOf(rr) >= 0,
                    dr = jn ? 'width' : 'height',
                    fr = Wn(u, { placement: an, boundary: Le, rootBoundary: De, altBoundary: ut, padding: Re }),
                    Zt = jn ? (xr ? d : f) : xr ? a : s
                  kt[dr] > ft[dr] && (Zt = Ve(Zt))
                  var Mr = Ve(Zt),
                    Ir = []
                  if (
                    (B && Ir.push(fr[rr] <= 0),
                    oe && Ir.push(fr[Zt] <= 0, fr[Mr] <= 0),
                    Ir.every(function ($t) {
                      return $t
                    }))
                  ) {
                    ;((Nt = an), (Mt = !1))
                    break
                  }
                  wt.set(an, Ir)
                }
                if (Mt)
                  for (
                    var Fo = function ($t) {
                        var Nn = vt.find(function (hr) {
                          var Ei = wt.get(hr)
                          if (Ei)
                            return Ei.slice(0, $t).every(function (za) {
                              return za
                            })
                        })
                        if (Nn) return ((Nt = Nn), 'break')
                      },
                      vn = ot ? 3 : 1;
                    vn > 0 && Fo(vn) !== 'break';
                    vn--
                  );
                u.placement !== Nt && ((u.modifiersData[D]._skip = !0), (u.placement = Nt), (u.reset = !0))
              }
            },
            requiresIfExists: ['offset'],
            data: { _skip: !1 }
          }
          function Sa(S, u, b) {
            return (
              b === void 0 && (b = { x: 0, y: 0 }),
              {
                top: S.top - u.height - b.y,
                right: S.right - u.width + b.x,
                bottom: S.bottom - u.height + b.y,
                left: S.left - u.width - b.x
              }
            )
          }
          function zr(S) {
            return [s, d, a, f].some(function (u) {
              return S[u] >= 0
            })
          }
          const vi = {
              name: 'hide',
              enabled: !0,
              phase: 'main',
              requiresIfExists: ['preventOverflow'],
              fn: function (S) {
                var u = S.state,
                  b = S.name,
                  D = u.rects.reference,
                  $ = u.rects.popper,
                  B = u.modifiersData.preventOverflow,
                  J = Wn(u, { elementContext: 'reference' }),
                  oe = Wn(u, { altBoundary: !0 }),
                  xe = Sa(J, D),
                  Re = Sa(oe, $, B),
                  Le = zr(xe),
                  De = zr(Re)
                ;((u.modifiersData[b] = {
                  referenceClippingOffsets: xe,
                  popperEscapeOffsets: Re,
                  isReferenceHidden: Le,
                  hasPopperEscaped: De
                }),
                  (u.attributes.popper = Object.assign({}, u.attributes.popper, {
                    'data-popper-reference-hidden': Le,
                    'data-popper-escaped': De
                  })))
              }
            },
            as = {
              name: 'offset',
              enabled: !0,
              phase: 'main',
              requires: ['popperOffsets'],
              fn: function (S) {
                var u = S.state,
                  b = S.options,
                  D = S.name,
                  $ = b.offset,
                  B = $ === void 0 ? [0, 0] : $,
                  J = E.reduce(function (Le, De) {
                    return (
                      (Le[De] = (function (ut, Qe, ot) {
                        var nt = ht(ut),
                          st = [f, s].indexOf(nt) >= 0 ? -1 : 1,
                          jt = typeof ot == 'function' ? ot(Object.assign({}, Qe, { placement: ut })) : ot,
                          Ut = jt[0],
                          vt = jt[1]
                        return (
                          (Ut = Ut || 0),
                          (vt = (vt || 0) * st),
                          [f, d].indexOf(nt) >= 0 ? { x: vt, y: Ut } : { x: Ut, y: vt }
                        )
                      })(De, u.rects, B)),
                      Le
                    )
                  }, {}),
                  oe = J[u.placement],
                  xe = oe.x,
                  Re = oe.y
                ;(u.modifiersData.popperOffsets != null &&
                  ((u.modifiersData.popperOffsets.x += xe), (u.modifiersData.popperOffsets.y += Re)),
                  (u.modifiersData[D] = J))
              }
            },
            _o = {
              name: 'popperOffsets',
              enabled: !0,
              phase: 'read',
              fn: function (S) {
                var u = S.state,
                  b = S.name
                u.modifiersData[b] = Rn({
                  reference: u.rects.reference,
                  element: u.rects.popper,
                  placement: u.placement
                })
              },
              data: {}
            },
            Ln = {
              name: 'preventOverflow',
              enabled: !0,
              phase: 'main',
              fn: function (S) {
                var u = S.state,
                  b = S.options,
                  D = S.name,
                  $ = b.mainAxis,
                  B = $ === void 0 || $,
                  J = b.altAxis,
                  oe = J !== void 0 && J,
                  xe = b.boundary,
                  Re = b.rootBoundary,
                  Le = b.altBoundary,
                  De = b.padding,
                  ut = b.tether,
                  Qe = ut === void 0 || ut,
                  ot = b.tetherOffset,
                  nt = ot === void 0 ? 0 : ot,
                  st = Wn(u, { boundary: xe, rootBoundary: Re, padding: De, altBoundary: Le }),
                  jt = ht(u.placement),
                  Ut = me(u.placement),
                  vt = !Ut,
                  kt = q(jt),
                  ft = kt === 'x' ? 'y' : 'x',
                  wt = u.modifiersData.popperOffsets,
                  Mt = u.rects.reference,
                  Nt = u.rects.popper,
                  It = typeof nt == 'function' ? nt(Object.assign({}, u.rects, { placement: u.placement })) : nt,
                  an =
                    typeof It == 'number'
                      ? { mainAxis: It, altAxis: It }
                      : Object.assign({ mainAxis: 0, altAxis: 0 }, It),
                  rr = u.modifiersData.offset ? u.modifiersData.offset[u.placement] : null,
                  xr = { x: 0, y: 0 }
                if (wt) {
                  if (B) {
                    var jn,
                      dr = kt === 'y' ? s : f,
                      fr = kt === 'y' ? a : d,
                      Zt = kt === 'y' ? 'height' : 'width',
                      Mr = wt[kt],
                      Ir = Mr + st[dr],
                      Fo = Mr - st[fr],
                      vn = Qe ? -Nt[Zt] / 2 : 0,
                      $t = Ut === y ? Mt[Zt] : Nt[Zt],
                      Nn = Ut === y ? -Nt[Zt] : -Mt[Zt],
                      hr = u.elements.arrow,
                      Ei = Qe && hr ? $e(hr) : { width: 0, height: 0 },
                      za = u.modifiersData['arrow#persistent']
                        ? u.modifiersData['arrow#persistent'].padding
                        : { top: 0, right: 0, bottom: 0, left: 0 },
                      Cd = za[dr],
                      Td = za[fr],
                      Ka = te(0, Mt[Zt], Ei[Zt]),
                      Nv = vt ? Mt[Zt] / 2 - vn - Ka - Cd - an.mainAxis : $t - Ka - Cd - an.mainAxis,
                      Hv = vt ? -Mt[Zt] / 2 + vn + Ka + Td + an.mainAxis : Nn + Ka + Td + an.mainAxis,
                      Cc = u.elements.arrow && M(u.elements.arrow),
                      $v = Cc ? (kt === 'y' ? Cc.clientTop || 0 : Cc.clientLeft || 0) : 0,
                      Ad = (jn = rr == null ? void 0 : rr[kt]) != null ? jn : 0,
                      Bv = Mr + Hv - Ad,
                      Dd = te(Qe ? Gt(Ir, Mr + Nv - Ad - $v) : Ir, Mr, Qe ? At(Fo, Bv) : Fo)
                    ;((wt[kt] = Dd), (xr[kt] = Dd - Mr))
                  }
                  if (oe) {
                    var kd,
                      qv = kt === 'x' ? s : f,
                      Uv = kt === 'x' ? a : d,
                      lo = wt[ft],
                      Xa = ft === 'y' ? 'height' : 'width',
                      Ed = lo + st[qv],
                      Od = lo - st[Uv],
                      Tc = [s, f].indexOf(jt) !== -1,
                      Pd = (kd = rr == null ? void 0 : rr[ft]) != null ? kd : 0,
                      Rd = Tc ? Ed : lo - Mt[Xa] - Nt[Xa] - Pd + an.altAxis,
                      Ld = Tc ? lo + Mt[Xa] + Nt[Xa] - Pd - an.altAxis : Od,
                      Md =
                        Qe && Tc
                          ? (function (Wv, Vv, Ac) {
                              var Id = te(Wv, Vv, Ac)
                              return Id > Ac ? Ac : Id
                            })(Rd, lo, Ld)
                          : te(Qe ? Rd : Ed, lo, Qe ? Ld : Od)
                    ;((wt[ft] = Md), (xr[ft] = Md - lo))
                  }
                  u.modifiersData[D] = xr
                }
              },
              requiresIfExists: ['offset']
            }
          function Tn(S, u, b) {
            b === void 0 && (b = !1)
            var D,
              $,
              B = Me(u),
              J =
                Me(u) &&
                (function (De) {
                  var ut = De.getBoundingClientRect(),
                    Qe = Tt(ut.width) / De.offsetWidth || 1,
                    ot = Tt(ut.height) / De.offsetHeight || 1
                  return Qe !== 1 || ot !== 1
                })(u),
              oe = Ce(u),
              xe = Ke(S, J, b),
              Re = { scrollLeft: 0, scrollTop: 0 },
              Le = { x: 0, y: 0 }
            return (
              (B || (!B && !b)) &&
                ((Pe(u) !== 'body' || bn(oe)) &&
                  (Re =
                    (D = u) !== re(D) && Me(D) ? { scrollLeft: ($ = D).scrollLeft, scrollTop: $.scrollTop } : cn(D)),
                Me(u) ? (((Le = Ke(u, !0)).x += u.clientLeft), (Le.y += u.clientTop)) : oe && (Le.x = on(oe))),
              { x: xe.left + Re.scrollLeft - Le.x, y: xe.top + Re.scrollTop - Le.y, width: xe.width, height: xe.height }
            )
          }
          function ls(S) {
            var u = new Map(),
              b = new Set(),
              D = []
            function $(B) {
              ;(b.add(B.name),
                [].concat(B.requires || [], B.requiresIfExists || []).forEach(function (J) {
                  if (!b.has(J)) {
                    var oe = u.get(J)
                    oe && $(oe)
                  }
                }),
                D.push(B))
            }
            return (
              S.forEach(function (B) {
                u.set(B.name, B)
              }),
              S.forEach(function (B) {
                b.has(B.name) || $(B)
              }),
              D
            )
          }
          var Ca = { placement: 'bottom', modifiers: [], strategy: 'absolute' }
          function cs() {
            for (var S = arguments.length, u = new Array(S), b = 0; b < S; b++) u[b] = arguments[b]
            return !u.some(function (D) {
              return !(D && typeof D.getBoundingClientRect == 'function')
            })
          }
          function Vi(S) {
            S === void 0 && (S = {})
            var u = S,
              b = u.defaultModifiers,
              D = b === void 0 ? [] : b,
              $ = u.defaultOptions,
              B = $ === void 0 ? Ca : $
            return function (J, oe, xe) {
              xe === void 0 && (xe = B)
              var Re,
                Le,
                De = {
                  placement: 'bottom',
                  orderedModifiers: [],
                  options: Object.assign({}, Ca, B),
                  modifiersData: {},
                  elements: { reference: J, popper: oe },
                  attributes: {},
                  styles: {}
                },
                ut = [],
                Qe = !1,
                ot = {
                  state: De,
                  setOptions: function (st) {
                    var jt = typeof st == 'function' ? st(De.options) : st
                    ;(nt(),
                      (De.options = Object.assign({}, B, De.options, jt)),
                      (De.scrollParents = {
                        reference: Ee(J) ? sn(J) : J.contextElement ? sn(J.contextElement) : [],
                        popper: sn(oe)
                      }))
                    var Ut,
                      vt,
                      kt = (function (ft) {
                        var wt = ls(ft)
                        return it.reduce(function (Mt, Nt) {
                          return Mt.concat(
                            wt.filter(function (It) {
                              return It.phase === Nt
                            })
                          )
                        }, [])
                      })(
                        ((Ut = [].concat(D, De.options.modifiers)),
                        (vt = Ut.reduce(function (ft, wt) {
                          var Mt = ft[wt.name]
                          return (
                            (ft[wt.name] = Mt
                              ? Object.assign({}, Mt, wt, {
                                  options: Object.assign({}, Mt.options, wt.options),
                                  data: Object.assign({}, Mt.data, wt.data)
                                })
                              : wt),
                            ft
                          )
                        }, {})),
                        Object.keys(vt).map(function (ft) {
                          return vt[ft]
                        }))
                      )
                    return (
                      (De.orderedModifiers = kt.filter(function (ft) {
                        return ft.enabled
                      })),
                      De.orderedModifiers.forEach(function (ft) {
                        var wt = ft.name,
                          Mt = ft.options,
                          Nt = Mt === void 0 ? {} : Mt,
                          It = ft.effect
                        if (typeof It == 'function') {
                          var an = It({ state: De, name: wt, instance: ot, options: Nt })
                          ut.push(an || function () {})
                        }
                      }),
                      ot.update()
                    )
                  },
                  forceUpdate: function () {
                    if (!Qe) {
                      var st = De.elements,
                        jt = st.reference,
                        Ut = st.popper
                      if (cs(jt, Ut)) {
                        ;((De.rects = { reference: Tn(jt, M(Ut), De.options.strategy === 'fixed'), popper: $e(Ut) }),
                          (De.reset = !1),
                          (De.placement = De.options.placement),
                          De.orderedModifiers.forEach(function (It) {
                            return (De.modifiersData[It.name] = Object.assign({}, It.data))
                          }))
                        for (var vt = 0; vt < De.orderedModifiers.length; vt++)
                          if (De.reset !== !0) {
                            var kt = De.orderedModifiers[vt],
                              ft = kt.fn,
                              wt = kt.options,
                              Mt = wt === void 0 ? {} : wt,
                              Nt = kt.name
                            typeof ft == 'function' &&
                              (De = ft({ state: De, options: Mt, name: Nt, instance: ot }) || De)
                          } else ((De.reset = !1), (vt = -1))
                      }
                    }
                  },
                  update:
                    ((Re = function () {
                      return new Promise(function (st) {
                        ;(ot.forceUpdate(), st(De))
                      })
                    }),
                    function () {
                      return (
                        Le ||
                          (Le = new Promise(function (st) {
                            Promise.resolve().then(function () {
                              ;((Le = void 0), st(Re()))
                            })
                          })),
                        Le
                      )
                    }),
                  destroy: function () {
                    ;(nt(), (Qe = !0))
                  }
                }
              if (!cs(J, oe)) return ot
              function nt() {
                ;(ut.forEach(function (st) {
                  return st()
                }),
                  (ut = []))
              }
              return (
                ot.setOptions(xe).then(function (st) {
                  !Qe && xe.onFirstUpdate && xe.onFirstUpdate(st)
                }),
                ot
              )
            }
          }
          var gi = Vi(),
            bi = Vi({ defaultModifiers: [Ie, _o, Oe, We] }),
            zi = Vi({ defaultModifiers: [Ie, _o, Oe, We, as, ss, Ln, ge, vi] })
          const Ki = Object.freeze(
              Object.defineProperty(
                {
                  __proto__: null,
                  afterMain: rt,
                  afterRead: ue,
                  afterWrite: He,
                  applyStyles: We,
                  arrow: ge,
                  auto: g,
                  basePlacements: p,
                  beforeMain: ke,
                  beforeRead: z,
                  beforeWrite: Ne,
                  bottom: a,
                  clippingParents: C,
                  computeStyles: Oe,
                  createPopper: zi,
                  createPopperBase: gi,
                  createPopperLite: bi,
                  detectOverflow: Wn,
                  end: _,
                  eventListeners: Ie,
                  flip: ss,
                  hide: vi,
                  left: f,
                  main: m,
                  modifierPhases: it,
                  offset: as,
                  placements: E,
                  popper: k,
                  popperGenerator: Vi,
                  popperOffsets: _o,
                  preventOverflow: Ln,
                  read: Y,
                  reference: F,
                  right: d,
                  start: y,
                  top: s,
                  variationPlacements: N,
                  viewport: A,
                  write: fe
                },
                Symbol.toStringTag,
                { value: 'Module' }
              )
            ),
            kr = new Map(),
            us = {
              set(S, u, b) {
                kr.has(S) || kr.set(S, new Map())
                const D = kr.get(S)
                D.has(u) || D.size === 0
                  ? D.set(u, b)
                  : console.error(
                      `Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(D.keys())[0]}.`
                    )
              },
              get: (S, u) => (kr.has(S) && kr.get(S).get(u)) || null,
              remove(S, u) {
                if (!kr.has(S)) return
                const b = kr.get(S)
                ;(b.delete(u), b.size === 0 && kr.delete(S))
              }
            },
            ds = 'transitionend',
            fs = S => (
              S && window.CSS && window.CSS.escape && (S = S.replace(/#([^\s"#']+)/g, (u, b) => `#${CSS.escape(b)}`)),
              S
            ),
            Ta = S => {
              S.dispatchEvent(new Event(ds))
            },
            gr = S => !(!S || typeof S != 'object') && (S.jquery !== void 0 && (S = S[0]), S.nodeType !== void 0),
            br = S =>
              gr(S)
                ? S.jquery
                  ? S[0]
                  : S
                : typeof S == 'string' && S.length > 0
                  ? document.querySelector(fs(S))
                  : null,
            yi = S => {
              if (!gr(S) || S.getClientRects().length === 0) return !1
              const u = getComputedStyle(S).getPropertyValue('visibility') === 'visible',
                b = S.closest('details:not([open])')
              if (!b) return u
              if (b !== S) {
                const D = S.closest('summary')
                if ((D && D.parentNode !== b) || D === null) return !1
              }
              return u
            },
            Mn = S =>
              !S ||
              S.nodeType !== Node.ELEMENT_NODE ||
              !!S.classList.contains('disabled') ||
              (S.disabled !== void 0
                ? S.disabled
                : S.hasAttribute('disabled') && S.getAttribute('disabled') !== 'false'),
            hs = S => {
              if (!document.documentElement.attachShadow) return null
              if (typeof S.getRootNode == 'function') {
                const u = S.getRootNode()
                return u instanceof ShadowRoot ? u : null
              }
              return S instanceof ShadowRoot ? S : S.parentNode ? hs(S.parentNode) : null
            },
            _i = () => {},
            Kr = S => {
              S.offsetHeight
            },
            Xi = () => (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery') ? window.jQuery : null),
            wo = [],
            Vn = () => document.documentElement.dir === 'rtl',
            pn = S => {
              var u
              ;((u = () => {
                const b = Xi()
                if (b) {
                  const D = S.NAME,
                    $ = b.fn[D]
                  ;((b.fn[D] = S.jQueryInterface),
                    (b.fn[D].Constructor = S),
                    (b.fn[D].noConflict = () => ((b.fn[D] = $), S.jQueryInterface)))
                }
              }),
                document.readyState === 'loading'
                  ? (wo.length ||
                      document.addEventListener('DOMContentLoaded', () => {
                        for (const b of wo) b()
                      }),
                    wo.push(u))
                  : u())
            },
            yn = (S, u = [], b = S) => (typeof S == 'function' ? S.call(...u) : b),
            ps = (S, u, b = !0) => {
              if (!b) return void yn(S)
              const D =
                (J => {
                  if (!J) return 0
                  let { transitionDuration: oe, transitionDelay: xe } = window.getComputedStyle(J)
                  const Re = Number.parseFloat(oe),
                    Le = Number.parseFloat(xe)
                  return Re || Le
                    ? ((oe = oe.split(',')[0]),
                      (xe = xe.split(',')[0]),
                      1e3 * (Number.parseFloat(oe) + Number.parseFloat(xe)))
                    : 0
                })(u) + 5
              let $ = !1
              const B = ({ target: J }) => {
                J === u && (($ = !0), u.removeEventListener(ds, B), yn(S))
              }
              ;(u.addEventListener(ds, B),
                setTimeout(() => {
                  $ || Ta(u)
                }, D))
            },
            xo = (S, u, b, D) => {
              const $ = S.length
              let B = S.indexOf(u)
              return B === -1
                ? !b && D
                  ? S[$ - 1]
                  : S[0]
                : ((B += b ? 1 : -1), D && (B = (B + $) % $), S[Math.max(0, Math.min(B, $ - 1))])
            },
            Aa = /[^.]*(?=\..*)\.|.*/,
            tc = /\..*/,
            ms = /::\d+$/,
            vs = {}
          /*!
           * Bootstrap v5.3.6 (https://getbootstrap.com/)
           * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
           * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
           */ let Da = 1
          const gs = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
            ka = new Set([
              'click',
              'dblclick',
              'mouseup',
              'mousedown',
              'contextmenu',
              'mousewheel',
              'DOMMouseScroll',
              'mouseover',
              'mouseout',
              'mousemove',
              'selectstart',
              'selectend',
              'keydown',
              'keypress',
              'keyup',
              'orientationchange',
              'touchstart',
              'touchmove',
              'touchend',
              'touchcancel',
              'pointerdown',
              'pointermove',
              'pointerup',
              'pointerleave',
              'pointercancel',
              'gesturestart',
              'gesturechange',
              'gestureend',
              'focus',
              'blur',
              'change',
              'reset',
              'select',
              'submit',
              'focusin',
              'focusout',
              'load',
              'unload',
              'beforeunload',
              'resize',
              'move',
              'DOMContentLoaded',
              'readystatechange',
              'error',
              'abort',
              'scroll'
            ])
          function So(S, u) {
            return (u && `${u}::${Da++}`) || S.uidEvent || Da++
          }
          function bs(S) {
            const u = So(S)
            return ((S.uidEvent = u), (vs[u] = vs[u] || {}), vs[u])
          }
          function _n(S, u, b = null) {
            return Object.values(S).find(D => D.callable === u && D.delegationSelector === b)
          }
          function Xr(S, u, b) {
            const D = typeof u == 'string',
              $ = D ? b : u || b
            let B = Co(S)
            return (ka.has(B) || (B = S), [D, $, B])
          }
          function Gi(S, u, b, D, $) {
            if (typeof u != 'string' || !S) return
            let [B, J, oe] = Xr(u, b, D)
            u in gs &&
              (J = (ot =>
                function (nt) {
                  if (
                    !nt.relatedTarget ||
                    (nt.relatedTarget !== nt.delegateTarget && !nt.delegateTarget.contains(nt.relatedTarget))
                  )
                    return ot.call(this, nt)
                })(J))
            const xe = bs(S),
              Re = xe[oe] || (xe[oe] = {}),
              Le = _n(Re, J, B ? b : null)
            if (Le) return void (Le.oneOff = Le.oneOff && $)
            const De = So(J, u.replace(Aa, '')),
              ut = B
                ? (function (Qe, ot, nt) {
                    return function st(jt) {
                      const Ut = Qe.querySelectorAll(ot)
                      for (let { target: vt } = jt; vt && vt !== this; vt = vt.parentNode)
                        for (const kt of Ut)
                          if (kt === vt)
                            return (
                              wi(jt, { delegateTarget: vt }),
                              st.oneOff && ae.off(Qe, jt.type, ot, nt),
                              nt.apply(vt, [jt])
                            )
                    }
                  })(S, b, J)
                : (function (Qe, ot) {
                    return function nt(st) {
                      return (wi(st, { delegateTarget: Qe }), nt.oneOff && ae.off(Qe, st.type, ot), ot.apply(Qe, [st]))
                    }
                  })(S, J)
            ;((ut.delegationSelector = B ? b : null),
              (ut.callable = J),
              (ut.oneOff = $),
              (ut.uidEvent = De),
              (Re[De] = ut),
              S.addEventListener(oe, ut, B))
          }
          function ys(S, u, b, D, $) {
            const B = _n(u[b], D, $)
            B && (S.removeEventListener(b, B, !!$), delete u[b][B.uidEvent])
          }
          function nc(S, u, b, D) {
            const $ = u[b] || {}
            for (const [B, J] of Object.entries($)) B.includes(D) && ys(S, u, b, J.callable, J.delegationSelector)
          }
          function Co(S) {
            return ((S = S.replace(tc, '')), gs[S] || S)
          }
          const ae = {
            on(S, u, b, D) {
              Gi(S, u, b, D, !1)
            },
            one(S, u, b, D) {
              Gi(S, u, b, D, !0)
            },
            off(S, u, b, D) {
              if (typeof u != 'string' || !S) return
              const [$, B, J] = Xr(u, b, D),
                oe = J !== u,
                xe = bs(S),
                Re = xe[J] || {},
                Le = u.startsWith('.')
              if (B === void 0) {
                if (Le) for (const De of Object.keys(xe)) nc(S, xe, De, u.slice(1))
                for (const [De, ut] of Object.entries(Re)) {
                  const Qe = De.replace(ms, '')
                  ;(oe && !u.includes(Qe)) || ys(S, xe, J, ut.callable, ut.delegationSelector)
                }
              } else {
                if (!Object.keys(Re).length) return
                ys(S, xe, J, B, $ ? b : null)
              }
            },
            trigger(S, u, b) {
              if (typeof u != 'string' || !S) return null
              const D = Xi()
              let $ = null,
                B = !0,
                J = !0,
                oe = !1
              u !== Co(u) &&
                D &&
                (($ = D.Event(u, b)),
                D(S).trigger($),
                (B = !$.isPropagationStopped()),
                (J = !$.isImmediatePropagationStopped()),
                (oe = $.isDefaultPrevented()))
              const xe = wi(new Event(u, { bubbles: B, cancelable: !0 }), b)
              return (
                oe && xe.preventDefault(),
                J && S.dispatchEvent(xe),
                xe.defaultPrevented && $ && $.preventDefault(),
                xe
              )
            }
          }
          function wi(S, u = {}) {
            for (const [b, D] of Object.entries(u))
              try {
                S[b] = D
              } catch {
                Object.defineProperty(S, b, { configurable: !0, get: () => D })
              }
            return S
          }
          function _s(S) {
            if (S === 'true') return !0
            if (S === 'false') return !1
            if (S === Number(S).toString()) return Number(S)
            if (S === '' || S === 'null') return null
            if (typeof S != 'string') return S
            try {
              return JSON.parse(decodeURIComponent(S))
            } catch {
              return S
            }
          }
          function ws(S) {
            return S.replace(/[A-Z]/g, u => `-${u.toLowerCase()}`)
          }
          const yr = {
            setDataAttribute(S, u, b) {
              S.setAttribute(`data-bs-${ws(u)}`, b)
            },
            removeDataAttribute(S, u) {
              S.removeAttribute(`data-bs-${ws(u)}`)
            },
            getDataAttributes(S) {
              if (!S) return {}
              const u = {},
                b = Object.keys(S.dataset).filter(D => D.startsWith('bs') && !D.startsWith('bsConfig'))
              for (const D of b) {
                let $ = D.replace(/^bs/, '')
                ;(($ = $.charAt(0).toLowerCase() + $.slice(1)), (u[$] = _s(S.dataset[D])))
              }
              return u
            },
            getDataAttribute: (S, u) => _s(S.getAttribute(`data-bs-${ws(u)}`))
          }
          class wn {
            static get Default() {
              return {}
            }
            static get DefaultType() {
              return {}
            }
            static get NAME() {
              throw new Error('You have to implement the static method "NAME", for each component!')
            }
            _getConfig(u) {
              return ((u = this._mergeConfigObj(u)), (u = this._configAfterMerge(u)), this._typeCheckConfig(u), u)
            }
            _configAfterMerge(u) {
              return u
            }
            _mergeConfigObj(u, b) {
              const D = gr(b) ? yr.getDataAttribute(b, 'config') : {}
              return {
                ...this.constructor.Default,
                ...(typeof D == 'object' ? D : {}),
                ...(gr(b) ? yr.getDataAttributes(b) : {}),
                ...(typeof u == 'object' ? u : {})
              }
            }
            _typeCheckConfig(u, b = this.constructor.DefaultType) {
              for (const [$, B] of Object.entries(b)) {
                const J = u[$],
                  oe = gr(J)
                    ? 'element'
                    : (D = J) == null
                      ? `${D}`
                      : Object.prototype.toString
                          .call(D)
                          .match(/\s([a-z]+)/i)[1]
                          .toLowerCase()
                if (!new RegExp(B).test(oe))
                  throw new TypeError(
                    `${this.constructor.NAME.toUpperCase()}: Option "${$}" provided type "${oe}" but expected type "${B}".`
                  )
              }
              var D
            }
          }
          class zn extends wn {
            constructor(u, b) {
              ;(super(),
                (u = br(u)) &&
                  ((this._element = u),
                  (this._config = this._getConfig(b)),
                  us.set(this._element, this.constructor.DATA_KEY, this)))
            }
            dispose() {
              ;(us.remove(this._element, this.constructor.DATA_KEY), ae.off(this._element, this.constructor.EVENT_KEY))
              for (const u of Object.getOwnPropertyNames(this)) this[u] = null
            }
            _queueCallback(u, b, D = !0) {
              ps(u, b, D)
            }
            _getConfig(u) {
              return (
                (u = this._mergeConfigObj(u, this._element)),
                (u = this._configAfterMerge(u)),
                this._typeCheckConfig(u),
                u
              )
            }
            static getInstance(u) {
              return us.get(br(u), this.DATA_KEY)
            }
            static getOrCreateInstance(u, b = {}) {
              return this.getInstance(u) || new this(u, typeof b == 'object' ? b : null)
            }
            static get VERSION() {
              return '5.3.6'
            }
            static get DATA_KEY() {
              return `bs.${this.NAME}`
            }
            static get EVENT_KEY() {
              return `.${this.DATA_KEY}`
            }
            static eventName(u) {
              return `${u}${this.EVENT_KEY}`
            }
          }
          const Gr = S => {
              let u = S.getAttribute('data-bs-target')
              if (!u || u === '#') {
                let b = S.getAttribute('href')
                if (!b || (!b.includes('#') && !b.startsWith('.'))) return null
                ;(b.includes('#') && !b.startsWith('#') && (b = `#${b.split('#')[1]}`),
                  (u = b && b !== '#' ? b.trim() : null))
              }
              return u
                ? u
                    .split(',')
                    .map(b => fs(b))
                    .join(',')
                : null
            },
            Ue = {
              find: (S, u = document.documentElement) => [].concat(...Element.prototype.querySelectorAll.call(u, S)),
              findOne: (S, u = document.documentElement) => Element.prototype.querySelector.call(u, S),
              children: (S, u) => [].concat(...S.children).filter(b => b.matches(u)),
              parents(S, u) {
                const b = []
                let D = S.parentNode.closest(u)
                for (; D; ) (b.push(D), (D = D.parentNode.closest(u)))
                return b
              },
              prev(S, u) {
                let b = S.previousElementSibling
                for (; b; ) {
                  if (b.matches(u)) return [b]
                  b = b.previousElementSibling
                }
                return []
              },
              next(S, u) {
                let b = S.nextElementSibling
                for (; b; ) {
                  if (b.matches(u)) return [b]
                  b = b.nextElementSibling
                }
                return []
              },
              focusableChildren(S) {
                const u = [
                  'a',
                  'button',
                  'input',
                  'textarea',
                  'select',
                  'details',
                  '[tabindex]',
                  '[contenteditable="true"]'
                ]
                  .map(b => `${b}:not([tabindex^="-"])`)
                  .join(',')
                return this.find(u, S).filter(b => !Mn(b) && yi(b))
              },
              getSelectorFromElement(S) {
                const u = Gr(S)
                return u && Ue.findOne(u) ? u : null
              },
              getElementFromSelector(S) {
                const u = Gr(S)
                return u ? Ue.findOne(u) : null
              },
              getMultipleElementsFromSelector(S) {
                const u = Gr(S)
                return u ? Ue.find(u) : []
              }
            },
            To = (S, u = 'hide') => {
              const b = `click.dismiss${S.EVENT_KEY}`,
                D = S.NAME
              ae.on(document, b, `[data-bs-dismiss="${D}"]`, function ($) {
                if ((['A', 'AREA'].includes(this.tagName) && $.preventDefault(), Mn(this))) return
                const B = Ue.getElementFromSelector(this) || this.closest(`.${D}`)
                S.getOrCreateInstance(B)[u]()
              })
            },
            Er = '.bs.alert',
            Jr = `close${Er}`,
            xs = `closed${Er}`
          class xi extends zn {
            static get NAME() {
              return 'alert'
            }
            close() {
              if (ae.trigger(this._element, Jr).defaultPrevented) return
              this._element.classList.remove('show')
              const u = this._element.classList.contains('fade')
              this._queueCallback(() => this._destroyElement(), this._element, u)
            }
            _destroyElement() {
              ;(this._element.remove(), ae.trigger(this._element, xs), this.dispose())
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = xi.getOrCreateInstance(this)
                if (typeof u == 'string') {
                  if (b[u] === void 0 || u.startsWith('_') || u === 'constructor')
                    throw new TypeError(`No method named "${u}"`)
                  b[u](this)
                }
              })
            }
          }
          ;(To(xi, 'close'), pn(xi))
          const Si = '[data-bs-toggle="button"]'
          class Yr extends zn {
            static get NAME() {
              return 'button'
            }
            toggle() {
              this._element.setAttribute('aria-pressed', this._element.classList.toggle('active'))
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = Yr.getOrCreateInstance(this)
                u === 'toggle' && b[u]()
              })
            }
          }
          ;(ae.on(document, 'click.bs.button.data-api', Si, S => {
            S.preventDefault()
            const u = S.target.closest(Si)
            Yr.getOrCreateInstance(u).toggle()
          }),
            pn(Yr))
          const Or = '.bs.swipe',
            Ea = `touchstart${Or}`,
            Oa = `touchmove${Or}`,
            rc = `touchend${Or}`,
            Pa = `pointerdown${Or}`,
            ic = `pointerup${Or}`,
            oc = { endCallback: null, leftCallback: null, rightCallback: null },
            Ss = { endCallback: '(function|null)', leftCallback: '(function|null)', rightCallback: '(function|null)' }
          class Ao extends wn {
            constructor(u, b) {
              ;(super(),
                (this._element = u),
                u &&
                  Ao.isSupported() &&
                  ((this._config = this._getConfig(b)),
                  (this._deltaX = 0),
                  (this._supportPointerEvents = !!window.PointerEvent),
                  this._initEvents()))
            }
            static get Default() {
              return oc
            }
            static get DefaultType() {
              return Ss
            }
            static get NAME() {
              return 'swipe'
            }
            dispose() {
              ae.off(this._element, Or)
            }
            _start(u) {
              this._supportPointerEvents
                ? this._eventIsPointerPenTouch(u) && (this._deltaX = u.clientX)
                : (this._deltaX = u.touches[0].clientX)
            }
            _end(u) {
              ;(this._eventIsPointerPenTouch(u) && (this._deltaX = u.clientX - this._deltaX),
                this._handleSwipe(),
                yn(this._config.endCallback))
            }
            _move(u) {
              this._deltaX = u.touches && u.touches.length > 1 ? 0 : u.touches[0].clientX - this._deltaX
            }
            _handleSwipe() {
              const u = Math.abs(this._deltaX)
              if (u <= 40) return
              const b = u / this._deltaX
              ;((this._deltaX = 0), b && yn(b > 0 ? this._config.rightCallback : this._config.leftCallback))
            }
            _initEvents() {
              this._supportPointerEvents
                ? (ae.on(this._element, Pa, u => this._start(u)),
                  ae.on(this._element, ic, u => this._end(u)),
                  this._element.classList.add('pointer-event'))
                : (ae.on(this._element, Ea, u => this._start(u)),
                  ae.on(this._element, Oa, u => this._move(u)),
                  ae.on(this._element, rc, u => this._end(u)))
            }
            _eventIsPointerPenTouch(u) {
              return this._supportPointerEvents && (u.pointerType === 'pen' || u.pointerType === 'touch')
            }
            static isSupported() {
              return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0
            }
          }
          const Pr = '.bs.carousel',
            Ra = '.data-api',
            sc = 'ArrowLeft',
            ac = 'ArrowRight',
            Ji = 'next',
            Ci = 'prev',
            Qr = 'left',
            Ti = 'right',
            La = `slide${Pr}`,
            Yi = `slid${Pr}`,
            Ma = `keydown${Pr}`,
            Ia = `mouseenter${Pr}`,
            Cs = `mouseleave${Pr}`,
            lc = `dragstart${Pr}`,
            cc = `load${Pr}${Ra}`,
            uc = `click${Pr}${Ra}`,
            Ai = 'carousel',
            Qi = 'active',
            Do = '.active',
            Fa = '.carousel-item',
            dc = Do + Fa,
            fc = { [sc]: Ti, [ac]: Qr },
            o = { interval: 5e3, keyboard: !0, pause: 'hover', ride: !1, touch: !0, wrap: !0 },
            c = {
              interval: '(number|boolean)',
              keyboard: 'boolean',
              pause: '(string|boolean)',
              ride: '(boolean|string)',
              touch: 'boolean',
              wrap: 'boolean'
            }
          class h extends zn {
            constructor(u, b) {
              ;(super(u, b),
                (this._interval = null),
                (this._activeElement = null),
                (this._isSliding = !1),
                (this.touchTimeout = null),
                (this._swipeHelper = null),
                (this._indicatorsElement = Ue.findOne('.carousel-indicators', this._element)),
                this._addEventListeners(),
                this._config.ride === Ai && this.cycle())
            }
            static get Default() {
              return o
            }
            static get DefaultType() {
              return c
            }
            static get NAME() {
              return 'carousel'
            }
            next() {
              this._slide(Ji)
            }
            nextWhenVisible() {
              !document.hidden && yi(this._element) && this.next()
            }
            prev() {
              this._slide(Ci)
            }
            pause() {
              ;(this._isSliding && Ta(this._element), this._clearInterval())
            }
            cycle() {
              ;(this._clearInterval(),
                this._updateInterval(),
                (this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval)))
            }
            _maybeEnableCycle() {
              this._config.ride && (this._isSliding ? ae.one(this._element, Yi, () => this.cycle()) : this.cycle())
            }
            to(u) {
              const b = this._getItems()
              if (u > b.length - 1 || u < 0) return
              if (this._isSliding) return void ae.one(this._element, Yi, () => this.to(u))
              const D = this._getItemIndex(this._getActive())
              if (D === u) return
              const $ = u > D ? Ji : Ci
              this._slide($, b[u])
            }
            dispose() {
              ;(this._swipeHelper && this._swipeHelper.dispose(), super.dispose())
            }
            _configAfterMerge(u) {
              return ((u.defaultInterval = u.interval), u)
            }
            _addEventListeners() {
              ;(this._config.keyboard && ae.on(this._element, Ma, u => this._keydown(u)),
                this._config.pause === 'hover' &&
                  (ae.on(this._element, Ia, () => this.pause()),
                  ae.on(this._element, Cs, () => this._maybeEnableCycle())),
                this._config.touch && Ao.isSupported() && this._addTouchEventListeners())
            }
            _addTouchEventListeners() {
              for (const b of Ue.find('.carousel-item img', this._element)) ae.on(b, lc, D => D.preventDefault())
              const u = {
                leftCallback: () => this._slide(this._directionToOrder(Qr)),
                rightCallback: () => this._slide(this._directionToOrder(Ti)),
                endCallback: () => {
                  this._config.pause === 'hover' &&
                    (this.pause(),
                    this.touchTimeout && clearTimeout(this.touchTimeout),
                    (this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), 500 + this._config.interval)))
                }
              }
              this._swipeHelper = new Ao(this._element, u)
            }
            _keydown(u) {
              if (/input|textarea/i.test(u.target.tagName)) return
              const b = fc[u.key]
              b && (u.preventDefault(), this._slide(this._directionToOrder(b)))
            }
            _getItemIndex(u) {
              return this._getItems().indexOf(u)
            }
            _setActiveIndicatorElement(u) {
              if (!this._indicatorsElement) return
              const b = Ue.findOne(Do, this._indicatorsElement)
              ;(b.classList.remove(Qi), b.removeAttribute('aria-current'))
              const D = Ue.findOne(`[data-bs-slide-to="${u}"]`, this._indicatorsElement)
              D && (D.classList.add(Qi), D.setAttribute('aria-current', 'true'))
            }
            _updateInterval() {
              const u = this._activeElement || this._getActive()
              if (!u) return
              const b = Number.parseInt(u.getAttribute('data-bs-interval'), 10)
              this._config.interval = b || this._config.defaultInterval
            }
            _slide(u, b = null) {
              if (this._isSliding) return
              const D = this._getActive(),
                $ = u === Ji,
                B = b || xo(this._getItems(), D, $, this._config.wrap)
              if (B === D) return
              const J = this._getItemIndex(B),
                oe = De =>
                  ae.trigger(this._element, De, {
                    relatedTarget: B,
                    direction: this._orderToDirection(u),
                    from: this._getItemIndex(D),
                    to: J
                  })
              if (oe(La).defaultPrevented || !D || !B) return
              const xe = !!this._interval
              ;(this.pause(), (this._isSliding = !0), this._setActiveIndicatorElement(J), (this._activeElement = B))
              const Re = $ ? 'carousel-item-start' : 'carousel-item-end',
                Le = $ ? 'carousel-item-next' : 'carousel-item-prev'
              ;(B.classList.add(Le),
                Kr(B),
                D.classList.add(Re),
                B.classList.add(Re),
                this._queueCallback(
                  () => {
                    ;(B.classList.remove(Re, Le),
                      B.classList.add(Qi),
                      D.classList.remove(Qi, Le, Re),
                      (this._isSliding = !1),
                      oe(Yi))
                  },
                  D,
                  this._isAnimated()
                ),
                xe && this.cycle())
            }
            _isAnimated() {
              return this._element.classList.contains('slide')
            }
            _getActive() {
              return Ue.findOne(dc, this._element)
            }
            _getItems() {
              return Ue.find(Fa, this._element)
            }
            _clearInterval() {
              this._interval && (clearInterval(this._interval), (this._interval = null))
            }
            _directionToOrder(u) {
              return Vn() ? (u === Qr ? Ci : Ji) : u === Qr ? Ji : Ci
            }
            _orderToDirection(u) {
              return Vn() ? (u === Ci ? Qr : Ti) : u === Ci ? Ti : Qr
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = h.getOrCreateInstance(this, u)
                if (typeof u != 'number') {
                  if (typeof u == 'string') {
                    if (b[u] === void 0 || u.startsWith('_') || u === 'constructor')
                      throw new TypeError(`No method named "${u}"`)
                    b[u]()
                  }
                } else b.to(u)
              })
            }
          }
          ;(ae.on(document, uc, '[data-bs-slide], [data-bs-slide-to]', function (S) {
            const u = Ue.getElementFromSelector(this)
            if (!u || !u.classList.contains(Ai)) return
            S.preventDefault()
            const b = h.getOrCreateInstance(u),
              D = this.getAttribute('data-bs-slide-to')
            return D
              ? (b.to(D), void b._maybeEnableCycle())
              : yr.getDataAttribute(this, 'slide') === 'next'
                ? (b.next(), void b._maybeEnableCycle())
                : (b.prev(), void b._maybeEnableCycle())
          }),
            ae.on(window, cc, () => {
              const S = Ue.find('[data-bs-ride="carousel"]')
              for (const u of S) h.getOrCreateInstance(u)
            }),
            pn(h))
          const v = '.bs.collapse',
            w = `show${v}`,
            x = `shown${v}`,
            T = `hide${v}`,
            I = `hidden${v}`,
            L = `click${v}.data-api`,
            H = 'show',
            X = 'collapse',
            Z = 'collapsing',
            W = `:scope .${X} .${X}`,
            ce = '[data-bs-toggle="collapse"]',
            Ze = { parent: null, toggle: !0 },
            bt = { parent: '(null|element)', toggle: 'boolean' }
          class et extends zn {
            constructor(u, b) {
              ;(super(u, b), (this._isTransitioning = !1), (this._triggerArray = []))
              const D = Ue.find(ce)
              for (const $ of D) {
                const B = Ue.getSelectorFromElement($),
                  J = Ue.find(B).filter(oe => oe === this._element)
                B !== null && J.length && this._triggerArray.push($)
              }
              ;(this._initializeChildren(),
                this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()),
                this._config.toggle && this.toggle())
            }
            static get Default() {
              return Ze
            }
            static get DefaultType() {
              return bt
            }
            static get NAME() {
              return 'collapse'
            }
            toggle() {
              this._isShown() ? this.hide() : this.show()
            }
            show() {
              if (this._isTransitioning || this._isShown()) return
              let u = []
              if (
                (this._config.parent &&
                  (u = this._getFirstLevelChildren('.collapse.show, .collapse.collapsing')
                    .filter($ => $ !== this._element)
                    .map($ => et.getOrCreateInstance($, { toggle: !1 }))),
                (u.length && u[0]._isTransitioning) || ae.trigger(this._element, w).defaultPrevented)
              )
                return
              for (const $ of u) $.hide()
              const b = this._getDimension()
              ;(this._element.classList.remove(X),
                this._element.classList.add(Z),
                (this._element.style[b] = 0),
                this._addAriaAndCollapsedClass(this._triggerArray, !0),
                (this._isTransitioning = !0))
              const D = `scroll${b[0].toUpperCase() + b.slice(1)}`
              ;(this._queueCallback(
                () => {
                  ;((this._isTransitioning = !1),
                    this._element.classList.remove(Z),
                    this._element.classList.add(X, H),
                    (this._element.style[b] = ''),
                    ae.trigger(this._element, x))
                },
                this._element,
                !0
              ),
                (this._element.style[b] = `${this._element[D]}px`))
            }
            hide() {
              if (this._isTransitioning || !this._isShown() || ae.trigger(this._element, T).defaultPrevented) return
              const u = this._getDimension()
              ;((this._element.style[u] = `${this._element.getBoundingClientRect()[u]}px`),
                Kr(this._element),
                this._element.classList.add(Z),
                this._element.classList.remove(X, H))
              for (const b of this._triggerArray) {
                const D = Ue.getElementFromSelector(b)
                D && !this._isShown(D) && this._addAriaAndCollapsedClass([b], !1)
              }
              ;((this._isTransitioning = !0),
                (this._element.style[u] = ''),
                this._queueCallback(
                  () => {
                    ;((this._isTransitioning = !1),
                      this._element.classList.remove(Z),
                      this._element.classList.add(X),
                      ae.trigger(this._element, I))
                  },
                  this._element,
                  !0
                ))
            }
            _isShown(u = this._element) {
              return u.classList.contains(H)
            }
            _configAfterMerge(u) {
              return ((u.toggle = !!u.toggle), (u.parent = br(u.parent)), u)
            }
            _getDimension() {
              return this._element.classList.contains('collapse-horizontal') ? 'width' : 'height'
            }
            _initializeChildren() {
              if (!this._config.parent) return
              const u = this._getFirstLevelChildren(ce)
              for (const b of u) {
                const D = Ue.getElementFromSelector(b)
                D && this._addAriaAndCollapsedClass([b], this._isShown(D))
              }
            }
            _getFirstLevelChildren(u) {
              const b = Ue.find(W, this._config.parent)
              return Ue.find(u, this._config.parent).filter(D => !b.includes(D))
            }
            _addAriaAndCollapsedClass(u, b) {
              if (u.length) for (const D of u) (D.classList.toggle('collapsed', !b), D.setAttribute('aria-expanded', b))
            }
            static jQueryInterface(u) {
              const b = {}
              return (
                typeof u == 'string' && /show|hide/.test(u) && (b.toggle = !1),
                this.each(function () {
                  const D = et.getOrCreateInstance(this, b)
                  if (typeof u == 'string') {
                    if (D[u] === void 0) throw new TypeError(`No method named "${u}"`)
                    D[u]()
                  }
                })
              )
            }
          }
          ;(ae.on(document, L, ce, function (S) {
            ;(S.target.tagName === 'A' || (S.delegateTarget && S.delegateTarget.tagName === 'A')) && S.preventDefault()
            for (const u of Ue.getMultipleElementsFromSelector(this)) et.getOrCreateInstance(u, { toggle: !1 }).toggle()
          }),
            pn(et))
          const un = 'dropdown',
            Ht = '.bs.dropdown',
            Kn = '.data-api',
            cr = 'ArrowUp',
            pt = 'ArrowDown',
            Zr = `hide${Ht}`,
            _t = `hidden${Ht}`,
            Jt = `show${Ht}`,
            Zi = `shown${Ht}`,
            ko = `click${Ht}${Kn}`,
            tr = `keydown${Ht}${Kn}`,
            eo = `keyup${Ht}${Kn}`,
            xn = 'show',
            An = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)',
            Rr = `${An}.${xn}`,
            Sn = '.dropdown-menu',
            Ts = Vn() ? 'top-end' : 'top-start',
            _r = Vn() ? 'top-start' : 'top-end',
            wr = Vn() ? 'bottom-end' : 'bottom-start',
            hc = Vn() ? 'bottom-start' : 'bottom-end',
            pc = Vn() ? 'left-start' : 'right-start',
            mc = Vn() ? 'right-start' : 'left-start',
            Dt = {
              autoClose: !0,
              boundary: 'clippingParents',
              display: 'dynamic',
              offset: [0, 2],
              popperConfig: null,
              reference: 'toggle'
            },
            Eo = {
              autoClose: '(boolean|string)',
              boundary: '(string|element)',
              display: 'string',
              offset: '(array|string|function)',
              popperConfig: '(null|object|function)',
              reference: '(string|element|object)'
            }
          class zt extends zn {
            constructor(u, b) {
              ;(super(u, b),
                (this._popper = null),
                (this._parent = this._element.parentNode),
                (this._menu =
                  Ue.next(this._element, Sn)[0] || Ue.prev(this._element, Sn)[0] || Ue.findOne(Sn, this._parent)),
                (this._inNavbar = this._detectNavbar()))
            }
            static get Default() {
              return Dt
            }
            static get DefaultType() {
              return Eo
            }
            static get NAME() {
              return un
            }
            toggle() {
              return this._isShown() ? this.hide() : this.show()
            }
            show() {
              if (Mn(this._element) || this._isShown()) return
              const u = { relatedTarget: this._element }
              if (!ae.trigger(this._element, Jt, u).defaultPrevented) {
                if (
                  (this._createPopper(),
                  'ontouchstart' in document.documentElement && !this._parent.closest('.navbar-nav'))
                )
                  for (const b of [].concat(...document.body.children)) ae.on(b, 'mouseover', _i)
                ;(this._element.focus(),
                  this._element.setAttribute('aria-expanded', !0),
                  this._menu.classList.add(xn),
                  this._element.classList.add(xn),
                  ae.trigger(this._element, Zi, u))
              }
            }
            hide() {
              if (Mn(this._element) || !this._isShown()) return
              const u = { relatedTarget: this._element }
              this._completeHide(u)
            }
            dispose() {
              ;(this._popper && this._popper.destroy(), super.dispose())
            }
            update() {
              ;((this._inNavbar = this._detectNavbar()), this._popper && this._popper.update())
            }
            _completeHide(u) {
              if (!ae.trigger(this._element, Zr, u).defaultPrevented) {
                if ('ontouchstart' in document.documentElement)
                  for (const b of [].concat(...document.body.children)) ae.off(b, 'mouseover', _i)
                ;(this._popper && this._popper.destroy(),
                  this._menu.classList.remove(xn),
                  this._element.classList.remove(xn),
                  this._element.setAttribute('aria-expanded', 'false'),
                  yr.removeDataAttribute(this._menu, 'popper'),
                  ae.trigger(this._element, _t, u),
                  this._element.focus())
              }
            }
            _getConfig(u) {
              if (
                typeof (u = super._getConfig(u)).reference == 'object' &&
                !gr(u.reference) &&
                typeof u.reference.getBoundingClientRect != 'function'
              )
                throw new TypeError(
                  `${un.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`
                )
              return u
            }
            _createPopper() {
              if (Ki === void 0)
                throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)")
              let u = this._element
              this._config.reference === 'parent'
                ? (u = this._parent)
                : gr(this._config.reference)
                  ? (u = br(this._config.reference))
                  : typeof this._config.reference == 'object' && (u = this._config.reference)
              const b = this._getPopperConfig()
              this._popper = zi(u, this._menu, b)
            }
            _isShown() {
              return this._menu.classList.contains(xn)
            }
            _getPlacement() {
              const u = this._parent
              if (u.classList.contains('dropend')) return pc
              if (u.classList.contains('dropstart')) return mc
              if (u.classList.contains('dropup-center')) return 'top'
              if (u.classList.contains('dropdown-center')) return 'bottom'
              const b = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end'
              return u.classList.contains('dropup') ? (b ? _r : Ts) : b ? hc : wr
            }
            _detectNavbar() {
              return this._element.closest('.navbar') !== null
            }
            _getOffset() {
              const { offset: u } = this._config
              return typeof u == 'string'
                ? u.split(',').map(b => Number.parseInt(b, 10))
                : typeof u == 'function'
                  ? b => u(b, this._element)
                  : u
            }
            _getPopperConfig() {
              const u = {
                placement: this._getPlacement(),
                modifiers: [
                  { name: 'preventOverflow', options: { boundary: this._config.boundary } },
                  { name: 'offset', options: { offset: this._getOffset() } }
                ]
              }
              return (
                (this._inNavbar || this._config.display === 'static') &&
                  (yr.setDataAttribute(this._menu, 'popper', 'static'),
                  (u.modifiers = [{ name: 'applyStyles', enabled: !1 }])),
                { ...u, ...yn(this._config.popperConfig, [void 0, u]) }
              )
            }
            _selectMenuItem({ key: u, target: b }) {
              const D = Ue.find('.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)', this._menu).filter($ =>
                yi($)
              )
              D.length && xo(D, b, u === pt, !D.includes(b)).focus()
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = zt.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (b[u] === void 0) throw new TypeError(`No method named "${u}"`)
                  b[u]()
                }
              })
            }
            static clearMenus(u) {
              if (u.button === 2 || (u.type === 'keyup' && u.key !== 'Tab')) return
              const b = Ue.find(Rr)
              for (const D of b) {
                const $ = zt.getInstance(D)
                if (!$ || $._config.autoClose === !1) continue
                const B = u.composedPath(),
                  J = B.includes($._menu)
                if (
                  B.includes($._element) ||
                  ($._config.autoClose === 'inside' && !J) ||
                  ($._config.autoClose === 'outside' && J) ||
                  ($._menu.contains(u.target) &&
                    ((u.type === 'keyup' && u.key === 'Tab') ||
                      /input|select|option|textarea|form/i.test(u.target.tagName)))
                )
                  continue
                const oe = { relatedTarget: $._element }
                ;(u.type === 'click' && (oe.clickEvent = u), $._completeHide(oe))
              }
            }
            static dataApiKeydownHandler(u) {
              const b = /input|textarea/i.test(u.target.tagName),
                D = u.key === 'Escape',
                $ = [cr, pt].includes(u.key)
              if ((!$ && !D) || (b && !D)) return
              u.preventDefault()
              const B = this.matches(An)
                  ? this
                  : Ue.prev(this, An)[0] || Ue.next(this, An)[0] || Ue.findOne(An, u.delegateTarget.parentNode),
                J = zt.getOrCreateInstance(B)
              if ($) return (u.stopPropagation(), J.show(), void J._selectMenuItem(u))
              J._isShown() && (u.stopPropagation(), J.hide(), B.focus())
            }
          }
          ;(ae.on(document, tr, An, zt.dataApiKeydownHandler),
            ae.on(document, tr, Sn, zt.dataApiKeydownHandler),
            ae.on(document, ko, zt.clearMenus),
            ae.on(document, eo, zt.clearMenus),
            ae.on(document, ko, An, function (S) {
              ;(S.preventDefault(), zt.getOrCreateInstance(this).toggle())
            }),
            pn(zt))
          const ei = 'backdrop',
            ja = 'show',
            Na = `mousedown.bs.${ei}`,
            Ha = {
              className: 'modal-backdrop',
              clickCallback: null,
              isAnimated: !1,
              isVisible: !0,
              rootElement: 'body'
            },
            ti = {
              className: 'string',
              clickCallback: '(function|null)',
              isAnimated: 'boolean',
              isVisible: 'boolean',
              rootElement: '(element|string)'
            }
          class Oo extends wn {
            constructor(u) {
              ;(super(), (this._config = this._getConfig(u)), (this._isAppended = !1), (this._element = null))
            }
            static get Default() {
              return Ha
            }
            static get DefaultType() {
              return ti
            }
            static get NAME() {
              return ei
            }
            show(u) {
              if (!this._config.isVisible) return void yn(u)
              this._append()
              const b = this._getElement()
              ;(this._config.isAnimated && Kr(b),
                b.classList.add(ja),
                this._emulateAnimation(() => {
                  yn(u)
                }))
            }
            hide(u) {
              this._config.isVisible
                ? (this._getElement().classList.remove(ja),
                  this._emulateAnimation(() => {
                    ;(this.dispose(), yn(u))
                  }))
                : yn(u)
            }
            dispose() {
              this._isAppended && (ae.off(this._element, Na), this._element.remove(), (this._isAppended = !1))
            }
            _getElement() {
              if (!this._element) {
                const u = document.createElement('div')
                ;((u.className = this._config.className),
                  this._config.isAnimated && u.classList.add('fade'),
                  (this._element = u))
              }
              return this._element
            }
            _configAfterMerge(u) {
              return ((u.rootElement = br(u.rootElement)), u)
            }
            _append() {
              if (this._isAppended) return
              const u = this._getElement()
              ;(this._config.rootElement.append(u),
                ae.on(u, Na, () => {
                  yn(this._config.clickCallback)
                }),
                (this._isAppended = !0))
            }
            _emulateAnimation(u) {
              ps(u, this._getElement(), this._config.isAnimated)
            }
          }
          const nr = '.bs.focustrap',
            $a = `focusin${nr}`,
            to = `keydown.tab${nr}`,
            no = 'backward',
            Po = { autofocus: !0, trapElement: null },
            As = { autofocus: 'boolean', trapElement: 'element' }
          class Ba extends wn {
            constructor(u) {
              ;(super(), (this._config = this._getConfig(u)), (this._isActive = !1), (this._lastTabNavDirection = null))
            }
            static get Default() {
              return Po
            }
            static get DefaultType() {
              return As
            }
            static get NAME() {
              return 'focustrap'
            }
            activate() {
              this._isActive ||
                (this._config.autofocus && this._config.trapElement.focus(),
                ae.off(document, nr),
                ae.on(document, $a, u => this._handleFocusin(u)),
                ae.on(document, to, u => this._handleKeydown(u)),
                (this._isActive = !0))
            }
            deactivate() {
              this._isActive && ((this._isActive = !1), ae.off(document, nr))
            }
            _handleFocusin(u) {
              const { trapElement: b } = this._config
              if (u.target === document || u.target === b || b.contains(u.target)) return
              const D = Ue.focusableChildren(b)
              D.length === 0 ? b.focus() : this._lastTabNavDirection === no ? D[D.length - 1].focus() : D[0].focus()
            }
            _handleKeydown(u) {
              u.key === 'Tab' && (this._lastTabNavDirection = u.shiftKey ? no : 'forward')
            }
          }
          const ro = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
            Ro = '.sticky-top',
            Di = 'padding-right',
            qa = 'margin-right'
          class io {
            constructor() {
              this._element = document.body
            }
            getWidth() {
              const u = document.documentElement.clientWidth
              return Math.abs(window.innerWidth - u)
            }
            hide() {
              const u = this.getWidth()
              ;(this._disableOverFlow(),
                this._setElementAttributes(this._element, Di, b => b + u),
                this._setElementAttributes(ro, Di, b => b + u),
                this._setElementAttributes(Ro, qa, b => b - u))
            }
            reset() {
              ;(this._resetElementAttributes(this._element, 'overflow'),
                this._resetElementAttributes(this._element, Di),
                this._resetElementAttributes(ro, Di),
                this._resetElementAttributes(Ro, qa))
            }
            isOverflowing() {
              return this.getWidth() > 0
            }
            _disableOverFlow() {
              ;(this._saveInitialAttribute(this._element, 'overflow'), (this._element.style.overflow = 'hidden'))
            }
            _setElementAttributes(u, b, D) {
              const $ = this.getWidth()
              this._applyManipulationCallback(u, B => {
                if (B !== this._element && window.innerWidth > B.clientWidth + $) return
                this._saveInitialAttribute(B, b)
                const J = window.getComputedStyle(B).getPropertyValue(b)
                B.style.setProperty(b, `${D(Number.parseFloat(J))}px`)
              })
            }
            _saveInitialAttribute(u, b) {
              const D = u.style.getPropertyValue(b)
              D && yr.setDataAttribute(u, b, D)
            }
            _resetElementAttributes(u, b) {
              this._applyManipulationCallback(u, D => {
                const $ = yr.getDataAttribute(D, b)
                $ !== null ? (yr.removeDataAttribute(D, b), D.style.setProperty(b, $)) : D.style.removeProperty(b)
              })
            }
            _applyManipulationCallback(u, b) {
              if (gr(u)) b(u)
              else for (const D of Ue.find(u, this._element)) b(D)
            }
          }
          const In = '.bs.modal',
            O = `hide${In}`,
            j = `hidePrevented${In}`,
            U = `hidden${In}`,
            V = `show${In}`,
            ee = `shown${In}`,
            be = `resize${In}`,
            Te = `click.dismiss${In}`,
            je = `mousedown.dismiss${In}`,
            Ae = `keydown.dismiss${In}`,
            mt = `click${In}.data-api`,
            Xe = 'modal-open',
            tt = 'show',
            ct = 'modal-static',
            ze = { backdrop: !0, focus: !0, keyboard: !0 },
            Ft = { backdrop: '(boolean|string)', focus: 'boolean', keyboard: 'boolean' }
          class Qt extends zn {
            constructor(u, b) {
              ;(super(u, b),
                (this._dialog = Ue.findOne('.modal-dialog', this._element)),
                (this._backdrop = this._initializeBackDrop()),
                (this._focustrap = this._initializeFocusTrap()),
                (this._isShown = !1),
                (this._isTransitioning = !1),
                (this._scrollBar = new io()),
                this._addEventListeners())
            }
            static get Default() {
              return ze
            }
            static get DefaultType() {
              return Ft
            }
            static get NAME() {
              return 'modal'
            }
            toggle(u) {
              return this._isShown ? this.hide() : this.show(u)
            }
            show(u) {
              this._isShown ||
                this._isTransitioning ||
                ae.trigger(this._element, V, { relatedTarget: u }).defaultPrevented ||
                ((this._isShown = !0),
                (this._isTransitioning = !0),
                this._scrollBar.hide(),
                document.body.classList.add(Xe),
                this._adjustDialog(),
                this._backdrop.show(() => this._showElement(u)))
            }
            hide() {
              this._isShown &&
                !this._isTransitioning &&
                (ae.trigger(this._element, O).defaultPrevented ||
                  ((this._isShown = !1),
                  (this._isTransitioning = !0),
                  this._focustrap.deactivate(),
                  this._element.classList.remove(tt),
                  this._queueCallback(() => this._hideModal(), this._element, this._isAnimated())))
            }
            dispose() {
              ;(ae.off(window, In),
                ae.off(this._dialog, In),
                this._backdrop.dispose(),
                this._focustrap.deactivate(),
                super.dispose())
            }
            handleUpdate() {
              this._adjustDialog()
            }
            _initializeBackDrop() {
              return new Oo({ isVisible: !!this._config.backdrop, isAnimated: this._isAnimated() })
            }
            _initializeFocusTrap() {
              return new Ba({ trapElement: this._element })
            }
            _showElement(u) {
              ;(document.body.contains(this._element) || document.body.append(this._element),
                (this._element.style.display = 'block'),
                this._element.removeAttribute('aria-hidden'),
                this._element.setAttribute('aria-modal', !0),
                this._element.setAttribute('role', 'dialog'),
                (this._element.scrollTop = 0))
              const b = Ue.findOne('.modal-body', this._dialog)
              ;(b && (b.scrollTop = 0),
                Kr(this._element),
                this._element.classList.add(tt),
                this._queueCallback(
                  () => {
                    ;(this._config.focus && this._focustrap.activate(),
                      (this._isTransitioning = !1),
                      ae.trigger(this._element, ee, { relatedTarget: u }))
                  },
                  this._dialog,
                  this._isAnimated()
                ))
            }
            _addEventListeners() {
              ;(ae.on(this._element, Ae, u => {
                u.key === 'Escape' && (this._config.keyboard ? this.hide() : this._triggerBackdropTransition())
              }),
                ae.on(window, be, () => {
                  this._isShown && !this._isTransitioning && this._adjustDialog()
                }),
                ae.on(this._element, je, u => {
                  ae.one(this._element, Te, b => {
                    this._element === u.target &&
                      this._element === b.target &&
                      (this._config.backdrop !== 'static'
                        ? this._config.backdrop && this.hide()
                        : this._triggerBackdropTransition())
                  })
                }))
            }
            _hideModal() {
              ;((this._element.style.display = 'none'),
                this._element.setAttribute('aria-hidden', !0),
                this._element.removeAttribute('aria-modal'),
                this._element.removeAttribute('role'),
                (this._isTransitioning = !1),
                this._backdrop.hide(() => {
                  ;(document.body.classList.remove(Xe),
                    this._resetAdjustments(),
                    this._scrollBar.reset(),
                    ae.trigger(this._element, U))
                }))
            }
            _isAnimated() {
              return this._element.classList.contains('fade')
            }
            _triggerBackdropTransition() {
              if (ae.trigger(this._element, j).defaultPrevented) return
              const u = this._element.scrollHeight > document.documentElement.clientHeight,
                b = this._element.style.overflowY
              b === 'hidden' ||
                this._element.classList.contains(ct) ||
                (u || (this._element.style.overflowY = 'hidden'),
                this._element.classList.add(ct),
                this._queueCallback(() => {
                  ;(this._element.classList.remove(ct),
                    this._queueCallback(() => {
                      this._element.style.overflowY = b
                    }, this._dialog))
                }, this._dialog),
                this._element.focus())
            }
            _adjustDialog() {
              const u = this._element.scrollHeight > document.documentElement.clientHeight,
                b = this._scrollBar.getWidth(),
                D = b > 0
              if (D && !u) {
                const $ = Vn() ? 'paddingLeft' : 'paddingRight'
                this._element.style[$] = `${b}px`
              }
              if (!D && u) {
                const $ = Vn() ? 'paddingRight' : 'paddingLeft'
                this._element.style[$] = `${b}px`
              }
            }
            _resetAdjustments() {
              ;((this._element.style.paddingLeft = ''), (this._element.style.paddingRight = ''))
            }
            static jQueryInterface(u, b) {
              return this.each(function () {
                const D = Qt.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (D[u] === void 0) throw new TypeError(`No method named "${u}"`)
                  D[u](b)
                }
              })
            }
          }
          ;(ae.on(document, mt, '[data-bs-toggle="modal"]', function (S) {
            const u = Ue.getElementFromSelector(this)
            ;(['A', 'AREA'].includes(this.tagName) && S.preventDefault(),
              ae.one(u, V, D => {
                D.defaultPrevented ||
                  ae.one(u, U, () => {
                    yi(this) && this.focus()
                  })
              }))
            const b = Ue.findOne('.modal.show')
            ;(b && Qt.getInstance(b).hide(), Qt.getOrCreateInstance(u).toggle(this))
          }),
            To(Qt),
            pn(Qt))
          const qt = '.bs.offcanvas',
            Fn = '.data-api',
            ur = `load${qt}${Fn}`,
            ni = 'show',
            mn = 'showing',
            sd = 'hiding',
            ad = '.offcanvas.show',
            Bm = `show${qt}`,
            qm = `shown${qt}`,
            Um = `hide${qt}`,
            ld = `hidePrevented${qt}`,
            cd = `hidden${qt}`,
            Wm = `resize${qt}`,
            Vm = `click${qt}${Fn}`,
            zm = `keydown.dismiss${qt}`,
            Km = { backdrop: !0, keyboard: !0, scroll: !1 },
            Xm = { backdrop: '(boolean|string)', keyboard: 'boolean', scroll: 'boolean' }
          class Lr extends zn {
            constructor(u, b) {
              ;(super(u, b),
                (this._isShown = !1),
                (this._backdrop = this._initializeBackDrop()),
                (this._focustrap = this._initializeFocusTrap()),
                this._addEventListeners())
            }
            static get Default() {
              return Km
            }
            static get DefaultType() {
              return Xm
            }
            static get NAME() {
              return 'offcanvas'
            }
            toggle(u) {
              return this._isShown ? this.hide() : this.show(u)
            }
            show(u) {
              this._isShown ||
                ae.trigger(this._element, Bm, { relatedTarget: u }).defaultPrevented ||
                ((this._isShown = !0),
                this._backdrop.show(),
                this._config.scroll || new io().hide(),
                this._element.setAttribute('aria-modal', !0),
                this._element.setAttribute('role', 'dialog'),
                this._element.classList.add(mn),
                this._queueCallback(
                  () => {
                    ;((this._config.scroll && !this._config.backdrop) || this._focustrap.activate(),
                      this._element.classList.add(ni),
                      this._element.classList.remove(mn),
                      ae.trigger(this._element, qm, { relatedTarget: u }))
                  },
                  this._element,
                  !0
                ))
            }
            hide() {
              this._isShown &&
                (ae.trigger(this._element, Um).defaultPrevented ||
                  (this._focustrap.deactivate(),
                  this._element.blur(),
                  (this._isShown = !1),
                  this._element.classList.add(sd),
                  this._backdrop.hide(),
                  this._queueCallback(
                    () => {
                      ;(this._element.classList.remove(ni, sd),
                        this._element.removeAttribute('aria-modal'),
                        this._element.removeAttribute('role'),
                        this._config.scroll || new io().reset(),
                        ae.trigger(this._element, cd))
                    },
                    this._element,
                    !0
                  )))
            }
            dispose() {
              ;(this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose())
            }
            _initializeBackDrop() {
              const u = !!this._config.backdrop
              return new Oo({
                className: 'offcanvas-backdrop',
                isVisible: u,
                isAnimated: !0,
                rootElement: this._element.parentNode,
                clickCallback: u
                  ? () => {
                      this._config.backdrop !== 'static' ? this.hide() : ae.trigger(this._element, ld)
                    }
                  : null
              })
            }
            _initializeFocusTrap() {
              return new Ba({ trapElement: this._element })
            }
            _addEventListeners() {
              ae.on(this._element, zm, u => {
                u.key === 'Escape' && (this._config.keyboard ? this.hide() : ae.trigger(this._element, ld))
              })
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = Lr.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (b[u] === void 0 || u.startsWith('_') || u === 'constructor')
                    throw new TypeError(`No method named "${u}"`)
                  b[u](this)
                }
              })
            }
          }
          ;(ae.on(document, Vm, '[data-bs-toggle="offcanvas"]', function (S) {
            const u = Ue.getElementFromSelector(this)
            if ((['A', 'AREA'].includes(this.tagName) && S.preventDefault(), Mn(this))) return
            ae.one(u, cd, () => {
              yi(this) && this.focus()
            })
            const b = Ue.findOne(ad)
            ;(b && b !== u && Lr.getInstance(b).hide(), Lr.getOrCreateInstance(u).toggle(this))
          }),
            ae.on(window, ur, () => {
              for (const S of Ue.find(ad)) Lr.getOrCreateInstance(S).show()
            }),
            ae.on(window, Wm, () => {
              for (const S of Ue.find('[aria-modal][class*=show][class*=offcanvas-]'))
                getComputedStyle(S).position !== 'fixed' && Lr.getOrCreateInstance(S).hide()
            }),
            To(Lr),
            pn(Lr))
          const ud = {
              '*': ['class', 'dir', 'id', 'lang', 'role', /^aria-[\w-]*$/i],
              a: ['target', 'href', 'title', 'rel'],
              area: [],
              b: [],
              br: [],
              col: [],
              code: [],
              dd: [],
              div: [],
              dl: [],
              dt: [],
              em: [],
              hr: [],
              h1: [],
              h2: [],
              h3: [],
              h4: [],
              h5: [],
              h6: [],
              i: [],
              img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
              li: [],
              ol: [],
              p: [],
              pre: [],
              s: [],
              small: [],
              span: [],
              sub: [],
              sup: [],
              strong: [],
              u: [],
              ul: []
            },
            Gm = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']),
            Jm = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i,
            Ym = (S, u) => {
              const b = S.nodeName.toLowerCase()
              return u.includes(b)
                ? !Gm.has(b) || !!Jm.test(S.nodeValue)
                : u.filter(D => D instanceof RegExp).some(D => D.test(b))
            },
            Qm = {
              allowList: ud,
              content: {},
              extraClass: '',
              html: !1,
              sanitize: !0,
              sanitizeFn: null,
              template: '<div></div>'
            },
            Zm = {
              allowList: 'object',
              content: 'object',
              extraClass: '(string|function)',
              html: 'boolean',
              sanitize: 'boolean',
              sanitizeFn: '(null|function)',
              template: 'string'
            },
            ev = { entry: '(string|element|function|null)', selector: '(string|element)' }
          class tv extends wn {
            constructor(u) {
              ;(super(), (this._config = this._getConfig(u)))
            }
            static get Default() {
              return Qm
            }
            static get DefaultType() {
              return Zm
            }
            static get NAME() {
              return 'TemplateFactory'
            }
            getContent() {
              return Object.values(this._config.content)
                .map(u => this._resolvePossibleFunction(u))
                .filter(Boolean)
            }
            hasContent() {
              return this.getContent().length > 0
            }
            changeContent(u) {
              return (this._checkContent(u), (this._config.content = { ...this._config.content, ...u }), this)
            }
            toHtml() {
              const u = document.createElement('div')
              u.innerHTML = this._maybeSanitize(this._config.template)
              for (const [$, B] of Object.entries(this._config.content)) this._setContent(u, B, $)
              const b = u.children[0],
                D = this._resolvePossibleFunction(this._config.extraClass)
              return (D && b.classList.add(...D.split(' ')), b)
            }
            _typeCheckConfig(u) {
              ;(super._typeCheckConfig(u), this._checkContent(u.content))
            }
            _checkContent(u) {
              for (const [b, D] of Object.entries(u)) super._typeCheckConfig({ selector: b, entry: D }, ev)
            }
            _setContent(u, b, D) {
              const $ = Ue.findOne(D, u)
              $ &&
                ((b = this._resolvePossibleFunction(b))
                  ? gr(b)
                    ? this._putElementInTemplate(br(b), $)
                    : this._config.html
                      ? ($.innerHTML = this._maybeSanitize(b))
                      : ($.textContent = b)
                  : $.remove())
            }
            _maybeSanitize(u) {
              return this._config.sanitize
                ? (function (b, D, $) {
                    if (!b.length) return b
                    if ($ && typeof $ == 'function') return $(b)
                    const B = new window.DOMParser().parseFromString(b, 'text/html'),
                      J = [].concat(...B.body.querySelectorAll('*'))
                    for (const oe of J) {
                      const xe = oe.nodeName.toLowerCase()
                      if (!Object.keys(D).includes(xe)) {
                        oe.remove()
                        continue
                      }
                      const Re = [].concat(...oe.attributes),
                        Le = [].concat(D['*'] || [], D[xe] || [])
                      for (const De of Re) Ym(De, Le) || oe.removeAttribute(De.nodeName)
                    }
                    return B.body.innerHTML
                  })(u, this._config.allowList, this._config.sanitizeFn)
                : u
            }
            _resolvePossibleFunction(u) {
              return yn(u, [void 0, this])
            }
            _putElementInTemplate(u, b) {
              if (this._config.html) return ((b.innerHTML = ''), void b.append(u))
              b.textContent = u.textContent
            }
          }
          const nv = new Set(['sanitize', 'allowList', 'sanitizeFn']),
            vc = 'fade',
            Ua = 'show',
            rv = '.tooltip-inner',
            dd = '.modal',
            fd = 'hide.bs.modal',
            Ds = 'hover',
            gc = 'focus',
            iv = {
              AUTO: 'auto',
              TOP: 'top',
              RIGHT: Vn() ? 'left' : 'right',
              BOTTOM: 'bottom',
              LEFT: Vn() ? 'right' : 'left'
            },
            ov = {
              allowList: ud,
              animation: !0,
              boundary: 'clippingParents',
              container: !1,
              customClass: '',
              delay: 0,
              fallbackPlacements: ['top', 'right', 'bottom', 'left'],
              html: !1,
              offset: [0, 6],
              placement: 'top',
              popperConfig: null,
              sanitize: !0,
              sanitizeFn: null,
              selector: !1,
              template:
                '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
              title: '',
              trigger: 'hover focus'
            },
            sv = {
              allowList: 'object',
              animation: 'boolean',
              boundary: '(string|element)',
              container: '(string|element|boolean)',
              customClass: '(string|function)',
              delay: '(number|object)',
              fallbackPlacements: 'array',
              html: 'boolean',
              offset: '(array|string|function)',
              placement: '(string|function)',
              popperConfig: '(null|object|function)',
              sanitize: 'boolean',
              sanitizeFn: '(null|function)',
              selector: '(string|boolean)',
              template: 'string',
              title: '(string|element|function)',
              trigger: 'string'
            }
          class ri extends zn {
            constructor(u, b) {
              if (Ki === void 0)
                throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)")
              ;(super(u, b),
                (this._isEnabled = !0),
                (this._timeout = 0),
                (this._isHovered = null),
                (this._activeTrigger = {}),
                (this._popper = null),
                (this._templateFactory = null),
                (this._newContent = null),
                (this.tip = null),
                this._setListeners(),
                this._config.selector || this._fixTitle())
            }
            static get Default() {
              return ov
            }
            static get DefaultType() {
              return sv
            }
            static get NAME() {
              return 'tooltip'
            }
            enable() {
              this._isEnabled = !0
            }
            disable() {
              this._isEnabled = !1
            }
            toggleEnabled() {
              this._isEnabled = !this._isEnabled
            }
            toggle() {
              this._isEnabled && (this._isShown() ? this._leave() : this._enter())
            }
            dispose() {
              ;(clearTimeout(this._timeout),
                ae.off(this._element.closest(dd), fd, this._hideModalHandler),
                this._element.getAttribute('data-bs-original-title') &&
                  this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title')),
                this._disposePopper(),
                super.dispose())
            }
            show() {
              if (this._element.style.display === 'none') throw new Error('Please use show on visible elements')
              if (!this._isWithContent() || !this._isEnabled) return
              const u = ae.trigger(this._element, this.constructor.eventName('show')),
                b = (hs(this._element) || this._element.ownerDocument.documentElement).contains(this._element)
              if (u.defaultPrevented || !b) return
              this._disposePopper()
              const D = this._getTipElement()
              this._element.setAttribute('aria-describedby', D.getAttribute('id'))
              const { container: $ } = this._config
              if (
                (this._element.ownerDocument.documentElement.contains(this.tip) ||
                  ($.append(D), ae.trigger(this._element, this.constructor.eventName('inserted'))),
                (this._popper = this._createPopper(D)),
                D.classList.add(Ua),
                'ontouchstart' in document.documentElement)
              )
                for (const B of [].concat(...document.body.children)) ae.on(B, 'mouseover', _i)
              this._queueCallback(
                () => {
                  ;(ae.trigger(this._element, this.constructor.eventName('shown')),
                    this._isHovered === !1 && this._leave(),
                    (this._isHovered = !1))
                },
                this.tip,
                this._isAnimated()
              )
            }
            hide() {
              if (this._isShown() && !ae.trigger(this._element, this.constructor.eventName('hide')).defaultPrevented) {
                if ((this._getTipElement().classList.remove(Ua), 'ontouchstart' in document.documentElement))
                  for (const u of [].concat(...document.body.children)) ae.off(u, 'mouseover', _i)
                ;((this._activeTrigger.click = !1),
                  (this._activeTrigger[gc] = !1),
                  (this._activeTrigger[Ds] = !1),
                  (this._isHovered = null),
                  this._queueCallback(
                    () => {
                      this._isWithActiveTrigger() ||
                        (this._isHovered || this._disposePopper(),
                        this._element.removeAttribute('aria-describedby'),
                        ae.trigger(this._element, this.constructor.eventName('hidden')))
                    },
                    this.tip,
                    this._isAnimated()
                  ))
              }
            }
            update() {
              this._popper && this._popper.update()
            }
            _isWithContent() {
              return !!this._getTitle()
            }
            _getTipElement() {
              return (
                this.tip || (this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())),
                this.tip
              )
            }
            _createTipElement(u) {
              const b = this._getTemplateFactory(u).toHtml()
              if (!b) return null
              ;(b.classList.remove(vc, Ua), b.classList.add(`bs-${this.constructor.NAME}-auto`))
              const D = ($ => {
                do $ += Math.floor(1e6 * Math.random())
                while (document.getElementById($))
                return $
              })(this.constructor.NAME).toString()
              return (b.setAttribute('id', D), this._isAnimated() && b.classList.add(vc), b)
            }
            setContent(u) {
              ;((this._newContent = u), this._isShown() && (this._disposePopper(), this.show()))
            }
            _getTemplateFactory(u) {
              return (
                this._templateFactory
                  ? this._templateFactory.changeContent(u)
                  : (this._templateFactory = new tv({
                      ...this._config,
                      content: u,
                      extraClass: this._resolvePossibleFunction(this._config.customClass)
                    })),
                this._templateFactory
              )
            }
            _getContentForTemplate() {
              return { [rv]: this._getTitle() }
            }
            _getTitle() {
              return (
                this._resolvePossibleFunction(this._config.title) ||
                this._element.getAttribute('data-bs-original-title')
              )
            }
            _initializeOnDelegatedTarget(u) {
              return this.constructor.getOrCreateInstance(u.delegateTarget, this._getDelegateConfig())
            }
            _isAnimated() {
              return this._config.animation || (this.tip && this.tip.classList.contains(vc))
            }
            _isShown() {
              return this.tip && this.tip.classList.contains(Ua)
            }
            _createPopper(u) {
              const b = yn(this._config.placement, [this, u, this._element]),
                D = iv[b.toUpperCase()]
              return zi(this._element, u, this._getPopperConfig(D))
            }
            _getOffset() {
              const { offset: u } = this._config
              return typeof u == 'string'
                ? u.split(',').map(b => Number.parseInt(b, 10))
                : typeof u == 'function'
                  ? b => u(b, this._element)
                  : u
            }
            _resolvePossibleFunction(u) {
              return yn(u, [this._element, this._element])
            }
            _getPopperConfig(u) {
              const b = {
                placement: u,
                modifiers: [
                  { name: 'flip', options: { fallbackPlacements: this._config.fallbackPlacements } },
                  { name: 'offset', options: { offset: this._getOffset() } },
                  { name: 'preventOverflow', options: { boundary: this._config.boundary } },
                  { name: 'arrow', options: { element: `.${this.constructor.NAME}-arrow` } },
                  {
                    name: 'preSetPlacement',
                    enabled: !0,
                    phase: 'beforeMain',
                    fn: D => {
                      this._getTipElement().setAttribute('data-popper-placement', D.state.placement)
                    }
                  }
                ]
              }
              return { ...b, ...yn(this._config.popperConfig, [void 0, b]) }
            }
            _setListeners() {
              const u = this._config.trigger.split(' ')
              for (const b of u)
                if (b === 'click')
                  ae.on(this._element, this.constructor.eventName('click'), this._config.selector, D => {
                    this._initializeOnDelegatedTarget(D).toggle()
                  })
                else if (b !== 'manual') {
                  const D = b === Ds ? this.constructor.eventName('mouseenter') : this.constructor.eventName('focusin'),
                    $ = b === Ds ? this.constructor.eventName('mouseleave') : this.constructor.eventName('focusout')
                  ;(ae.on(this._element, D, this._config.selector, B => {
                    const J = this._initializeOnDelegatedTarget(B)
                    ;((J._activeTrigger[B.type === 'focusin' ? gc : Ds] = !0), J._enter())
                  }),
                    ae.on(this._element, $, this._config.selector, B => {
                      const J = this._initializeOnDelegatedTarget(B)
                      ;((J._activeTrigger[B.type === 'focusout' ? gc : Ds] = J._element.contains(B.relatedTarget)),
                        J._leave())
                    }))
                }
              ;((this._hideModalHandler = () => {
                this._element && this.hide()
              }),
                ae.on(this._element.closest(dd), fd, this._hideModalHandler))
            }
            _fixTitle() {
              const u = this._element.getAttribute('title')
              u &&
                (this._element.getAttribute('aria-label') ||
                  this._element.textContent.trim() ||
                  this._element.setAttribute('aria-label', u),
                this._element.setAttribute('data-bs-original-title', u),
                this._element.removeAttribute('title'))
            }
            _enter() {
              this._isShown() || this._isHovered
                ? (this._isHovered = !0)
                : ((this._isHovered = !0),
                  this._setTimeout(() => {
                    this._isHovered && this.show()
                  }, this._config.delay.show))
            }
            _leave() {
              this._isWithActiveTrigger() ||
                ((this._isHovered = !1),
                this._setTimeout(() => {
                  this._isHovered || this.hide()
                }, this._config.delay.hide))
            }
            _setTimeout(u, b) {
              ;(clearTimeout(this._timeout), (this._timeout = setTimeout(u, b)))
            }
            _isWithActiveTrigger() {
              return Object.values(this._activeTrigger).includes(!0)
            }
            _getConfig(u) {
              const b = yr.getDataAttributes(this._element)
              for (const D of Object.keys(b)) nv.has(D) && delete b[D]
              return (
                (u = { ...b, ...(typeof u == 'object' && u ? u : {}) }),
                (u = this._mergeConfigObj(u)),
                (u = this._configAfterMerge(u)),
                this._typeCheckConfig(u),
                u
              )
            }
            _configAfterMerge(u) {
              return (
                (u.container = u.container === !1 ? document.body : br(u.container)),
                typeof u.delay == 'number' && (u.delay = { show: u.delay, hide: u.delay }),
                typeof u.title == 'number' && (u.title = u.title.toString()),
                typeof u.content == 'number' && (u.content = u.content.toString()),
                u
              )
            }
            _getDelegateConfig() {
              const u = {}
              for (const [b, D] of Object.entries(this._config)) this.constructor.Default[b] !== D && (u[b] = D)
              return ((u.selector = !1), (u.trigger = 'manual'), u)
            }
            _disposePopper() {
              ;(this._popper && (this._popper.destroy(), (this._popper = null)),
                this.tip && (this.tip.remove(), (this.tip = null)))
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = ri.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (b[u] === void 0) throw new TypeError(`No method named "${u}"`)
                  b[u]()
                }
              })
            }
          }
          pn(ri)
          const av = '.popover-header',
            lv = '.popover-body',
            cv = {
              ...ri.Default,
              content: '',
              offset: [0, 8],
              placement: 'right',
              template:
                '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
              trigger: 'click'
            },
            uv = { ...ri.DefaultType, content: '(null|string|element|function)' }
          class Lo extends ri {
            static get Default() {
              return cv
            }
            static get DefaultType() {
              return uv
            }
            static get NAME() {
              return 'popover'
            }
            _isWithContent() {
              return this._getTitle() || this._getContent()
            }
            _getContentForTemplate() {
              return { [av]: this._getTitle(), [lv]: this._getContent() }
            }
            _getContent() {
              return this._resolvePossibleFunction(this._config.content)
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = Lo.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (b[u] === void 0) throw new TypeError(`No method named "${u}"`)
                  b[u]()
                }
              })
            }
          }
          pn(Lo)
          const bc = '.bs.scrollspy',
            dv = `activate${bc}`,
            hd = `click${bc}`,
            fv = `load${bc}.data-api`,
            Mo = 'active',
            yc = '[href]',
            pd = '.nav-link',
            hv = `${pd}, .nav-item > ${pd}, .list-group-item`,
            pv = { offset: null, rootMargin: '0px 0px -25%', smoothScroll: !1, target: null, threshold: [0.1, 0.5, 1] },
            mv = {
              offset: '(number|null)',
              rootMargin: 'string',
              smoothScroll: 'boolean',
              target: 'element',
              threshold: 'array'
            }
          class Io extends zn {
            constructor(u, b) {
              ;(super(u, b),
                (this._targetLinks = new Map()),
                (this._observableSections = new Map()),
                (this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element),
                (this._activeTarget = null),
                (this._observer = null),
                (this._previousScrollData = { visibleEntryTop: 0, parentScrollTop: 0 }),
                this.refresh())
            }
            static get Default() {
              return pv
            }
            static get DefaultType() {
              return mv
            }
            static get NAME() {
              return 'scrollspy'
            }
            refresh() {
              ;(this._initializeTargetsAndObservables(),
                this._maybeEnableSmoothScroll(),
                this._observer ? this._observer.disconnect() : (this._observer = this._getNewObserver()))
              for (const u of this._observableSections.values()) this._observer.observe(u)
            }
            dispose() {
              ;(this._observer.disconnect(), super.dispose())
            }
            _configAfterMerge(u) {
              return (
                (u.target = br(u.target) || document.body),
                (u.rootMargin = u.offset ? `${u.offset}px 0px -30%` : u.rootMargin),
                typeof u.threshold == 'string' && (u.threshold = u.threshold.split(',').map(b => Number.parseFloat(b))),
                u
              )
            }
            _maybeEnableSmoothScroll() {
              this._config.smoothScroll &&
                (ae.off(this._config.target, hd),
                ae.on(this._config.target, hd, yc, u => {
                  const b = this._observableSections.get(u.target.hash)
                  if (b) {
                    u.preventDefault()
                    const D = this._rootElement || window,
                      $ = b.offsetTop - this._element.offsetTop
                    if (D.scrollTo) return void D.scrollTo({ top: $, behavior: 'smooth' })
                    D.scrollTop = $
                  }
                }))
            }
            _getNewObserver() {
              const u = {
                root: this._rootElement,
                threshold: this._config.threshold,
                rootMargin: this._config.rootMargin
              }
              return new IntersectionObserver(b => this._observerCallback(b), u)
            }
            _observerCallback(u) {
              const b = J => this._targetLinks.get(`#${J.target.id}`),
                D = J => {
                  ;((this._previousScrollData.visibleEntryTop = J.target.offsetTop), this._process(b(J)))
                },
                $ = (this._rootElement || document.documentElement).scrollTop,
                B = $ >= this._previousScrollData.parentScrollTop
              this._previousScrollData.parentScrollTop = $
              for (const J of u) {
                if (!J.isIntersecting) {
                  ;((this._activeTarget = null), this._clearActiveClass(b(J)))
                  continue
                }
                const oe = J.target.offsetTop >= this._previousScrollData.visibleEntryTop
                if (B && oe) {
                  if ((D(J), !$)) return
                } else B || oe || D(J)
              }
            }
            _initializeTargetsAndObservables() {
              ;((this._targetLinks = new Map()), (this._observableSections = new Map()))
              const u = Ue.find(yc, this._config.target)
              for (const b of u) {
                if (!b.hash || Mn(b)) continue
                const D = Ue.findOne(decodeURI(b.hash), this._element)
                yi(D) && (this._targetLinks.set(decodeURI(b.hash), b), this._observableSections.set(b.hash, D))
              }
            }
            _process(u) {
              this._activeTarget !== u &&
                (this._clearActiveClass(this._config.target),
                (this._activeTarget = u),
                u.classList.add(Mo),
                this._activateParents(u),
                ae.trigger(this._element, dv, { relatedTarget: u }))
            }
            _activateParents(u) {
              if (u.classList.contains('dropdown-item'))
                Ue.findOne('.dropdown-toggle', u.closest('.dropdown')).classList.add(Mo)
              else
                for (const b of Ue.parents(u, '.nav, .list-group')) for (const D of Ue.prev(b, hv)) D.classList.add(Mo)
            }
            _clearActiveClass(u) {
              u.classList.remove(Mo)
              const b = Ue.find(`${yc}.${Mo}`, u)
              for (const D of b) D.classList.remove(Mo)
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = Io.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (b[u] === void 0 || u.startsWith('_') || u === 'constructor')
                    throw new TypeError(`No method named "${u}"`)
                  b[u]()
                }
              })
            }
          }
          ;(ae.on(window, fv, () => {
            for (const S of Ue.find('[data-bs-spy="scroll"]')) Io.getOrCreateInstance(S)
          }),
            pn(Io))
          const oo = '.bs.tab',
            vv = `hide${oo}`,
            gv = `hidden${oo}`,
            bv = `show${oo}`,
            yv = `shown${oo}`,
            _v = `click${oo}`,
            wv = `keydown${oo}`,
            xv = `load${oo}`,
            Sv = 'ArrowLeft',
            md = 'ArrowRight',
            Cv = 'ArrowUp',
            vd = 'ArrowDown',
            _c = 'Home',
            gd = 'End',
            so = 'active',
            bd = 'fade',
            wc = 'show',
            yd = '.dropdown-toggle',
            xc = `:not(${yd})`,
            _d = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',
            Sc = `.nav-link${xc}, .list-group-item${xc}, [role="tab"]${xc}, ${_d}`,
            Tv = `.${so}[data-bs-toggle="tab"], .${so}[data-bs-toggle="pill"], .${so}[data-bs-toggle="list"]`
          class ii extends zn {
            constructor(u) {
              ;(super(u),
                (this._parent = this._element.closest('.list-group, .nav, [role="tablist"]')),
                this._parent &&
                  (this._setInitialAttributes(this._parent, this._getChildren()),
                  ae.on(this._element, wv, b => this._keydown(b))))
            }
            static get NAME() {
              return 'tab'
            }
            show() {
              const u = this._element
              if (this._elemIsActive(u)) return
              const b = this._getActiveElem(),
                D = b ? ae.trigger(b, vv, { relatedTarget: u }) : null
              ae.trigger(u, bv, { relatedTarget: b }).defaultPrevented ||
                (D && D.defaultPrevented) ||
                (this._deactivate(b, u), this._activate(u, b))
            }
            _activate(u, b) {
              u &&
                (u.classList.add(so),
                this._activate(Ue.getElementFromSelector(u)),
                this._queueCallback(
                  () => {
                    u.getAttribute('role') === 'tab'
                      ? (u.removeAttribute('tabindex'),
                        u.setAttribute('aria-selected', !0),
                        this._toggleDropDown(u, !0),
                        ae.trigger(u, yv, { relatedTarget: b }))
                      : u.classList.add(wc)
                  },
                  u,
                  u.classList.contains(bd)
                ))
            }
            _deactivate(u, b) {
              u &&
                (u.classList.remove(so),
                u.blur(),
                this._deactivate(Ue.getElementFromSelector(u)),
                this._queueCallback(
                  () => {
                    u.getAttribute('role') === 'tab'
                      ? (u.setAttribute('aria-selected', !1),
                        u.setAttribute('tabindex', '-1'),
                        this._toggleDropDown(u, !1),
                        ae.trigger(u, gv, { relatedTarget: b }))
                      : u.classList.remove(wc)
                  },
                  u,
                  u.classList.contains(bd)
                ))
            }
            _keydown(u) {
              if (![Sv, md, Cv, vd, _c, gd].includes(u.key)) return
              ;(u.stopPropagation(), u.preventDefault())
              const b = this._getChildren().filter($ => !Mn($))
              let D
              if ([_c, gd].includes(u.key)) D = b[u.key === _c ? 0 : b.length - 1]
              else {
                const $ = [md, vd].includes(u.key)
                D = xo(b, u.target, $, !0)
              }
              D && (D.focus({ preventScroll: !0 }), ii.getOrCreateInstance(D).show())
            }
            _getChildren() {
              return Ue.find(Sc, this._parent)
            }
            _getActiveElem() {
              return this._getChildren().find(u => this._elemIsActive(u)) || null
            }
            _setInitialAttributes(u, b) {
              this._setAttributeIfNotExists(u, 'role', 'tablist')
              for (const D of b) this._setInitialAttributesOnChild(D)
            }
            _setInitialAttributesOnChild(u) {
              u = this._getInnerElement(u)
              const b = this._elemIsActive(u),
                D = this._getOuterElement(u)
              ;(u.setAttribute('aria-selected', b),
                D !== u && this._setAttributeIfNotExists(D, 'role', 'presentation'),
                b || u.setAttribute('tabindex', '-1'),
                this._setAttributeIfNotExists(u, 'role', 'tab'),
                this._setInitialAttributesOnTargetPanel(u))
            }
            _setInitialAttributesOnTargetPanel(u) {
              const b = Ue.getElementFromSelector(u)
              b &&
                (this._setAttributeIfNotExists(b, 'role', 'tabpanel'),
                u.id && this._setAttributeIfNotExists(b, 'aria-labelledby', `${u.id}`))
            }
            _toggleDropDown(u, b) {
              const D = this._getOuterElement(u)
              if (!D.classList.contains('dropdown')) return
              const $ = (B, J) => {
                const oe = Ue.findOne(B, D)
                oe && oe.classList.toggle(J, b)
              }
              ;($(yd, so), $('.dropdown-menu', wc), D.setAttribute('aria-expanded', b))
            }
            _setAttributeIfNotExists(u, b, D) {
              u.hasAttribute(b) || u.setAttribute(b, D)
            }
            _elemIsActive(u) {
              return u.classList.contains(so)
            }
            _getInnerElement(u) {
              return u.matches(Sc) ? u : Ue.findOne(Sc, u)
            }
            _getOuterElement(u) {
              return u.closest('.nav-item, .list-group-item') || u
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = ii.getOrCreateInstance(this)
                if (typeof u == 'string') {
                  if (b[u] === void 0 || u.startsWith('_') || u === 'constructor')
                    throw new TypeError(`No method named "${u}"`)
                  b[u]()
                }
              })
            }
          }
          ;(ae.on(document, _v, _d, function (S) {
            ;(['A', 'AREA'].includes(this.tagName) && S.preventDefault(),
              Mn(this) || ii.getOrCreateInstance(this).show())
          }),
            ae.on(window, xv, () => {
              for (const S of Ue.find(Tv)) ii.getOrCreateInstance(S)
            }),
            pn(ii))
          const ki = '.bs.toast',
            Av = `mouseover${ki}`,
            Dv = `mouseout${ki}`,
            kv = `focusin${ki}`,
            Ev = `focusout${ki}`,
            Ov = `hide${ki}`,
            Pv = `hidden${ki}`,
            Rv = `show${ki}`,
            Lv = `shown${ki}`,
            wd = 'hide',
            Wa = 'show',
            Va = 'showing',
            Mv = { animation: 'boolean', autohide: 'boolean', delay: 'number' },
            Iv = { animation: !0, autohide: !0, delay: 5e3 }
          class ao extends zn {
            constructor(u, b) {
              ;(super(u, b),
                (this._timeout = null),
                (this._hasMouseInteraction = !1),
                (this._hasKeyboardInteraction = !1),
                this._setListeners())
            }
            static get Default() {
              return Iv
            }
            static get DefaultType() {
              return Mv
            }
            static get NAME() {
              return 'toast'
            }
            show() {
              ae.trigger(this._element, Rv).defaultPrevented ||
                (this._clearTimeout(),
                this._config.animation && this._element.classList.add('fade'),
                this._element.classList.remove(wd),
                Kr(this._element),
                this._element.classList.add(Wa, Va),
                this._queueCallback(
                  () => {
                    ;(this._element.classList.remove(Va), ae.trigger(this._element, Lv), this._maybeScheduleHide())
                  },
                  this._element,
                  this._config.animation
                ))
            }
            hide() {
              this.isShown() &&
                (ae.trigger(this._element, Ov).defaultPrevented ||
                  (this._element.classList.add(Va),
                  this._queueCallback(
                    () => {
                      ;(this._element.classList.add(wd),
                        this._element.classList.remove(Va, Wa),
                        ae.trigger(this._element, Pv))
                    },
                    this._element,
                    this._config.animation
                  )))
            }
            dispose() {
              ;(this._clearTimeout(), this.isShown() && this._element.classList.remove(Wa), super.dispose())
            }
            isShown() {
              return this._element.classList.contains(Wa)
            }
            _maybeScheduleHide() {
              this._config.autohide &&
                (this._hasMouseInteraction ||
                  this._hasKeyboardInteraction ||
                  (this._timeout = setTimeout(() => {
                    this.hide()
                  }, this._config.delay)))
            }
            _onInteraction(u, b) {
              switch (u.type) {
                case 'mouseover':
                case 'mouseout':
                  this._hasMouseInteraction = b
                  break
                case 'focusin':
                case 'focusout':
                  this._hasKeyboardInteraction = b
              }
              if (b) return void this._clearTimeout()
              const D = u.relatedTarget
              this._element === D || this._element.contains(D) || this._maybeScheduleHide()
            }
            _setListeners() {
              ;(ae.on(this._element, Av, u => this._onInteraction(u, !0)),
                ae.on(this._element, Dv, u => this._onInteraction(u, !1)),
                ae.on(this._element, kv, u => this._onInteraction(u, !0)),
                ae.on(this._element, Ev, u => this._onInteraction(u, !1)))
            }
            _clearTimeout() {
              ;(clearTimeout(this._timeout), (this._timeout = null))
            }
            static jQueryInterface(u) {
              return this.each(function () {
                const b = ao.getOrCreateInstance(this, u)
                if (typeof u == 'string') {
                  if (b[u] === void 0) throw new TypeError(`No method named "${u}"`)
                  b[u](this)
                }
              })
            }
          }
          ;(To(ao), pn(ao))
          const Fv = Object.freeze(
            Object.defineProperty(
              {
                __proto__: null,
                Alert: xi,
                Button: Yr,
                Carousel: h,
                Collapse: et,
                Dropdown: zt,
                Modal: Qt,
                Offcanvas: Lr,
                Popover: Lo,
                ScrollSpy: Io,
                Tab: ii,
                Toast: ao,
                Tooltip: ri
              },
              Symbol.toStringTag,
              { value: 'Module' }
            )
          )
          ;([].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]')).map(function (S) {
            let u = {
              boundary:
                S.getAttribute('data-bs-boundary') === 'viewport' ? document.querySelector('.btn') : 'clippingParents'
            }
            return new zt(S, u)
          }),
            [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (S) {
              let u = {
                delay: { show: 50, hide: 50 },
                html: S.getAttribute('data-bs-html') === 'true',
                placement: S.getAttribute('data-bs-placement') ?? 'auto'
              }
              return new ri(S, u)
            }),
            [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')).map(function (S) {
              let u = {
                delay: { show: 50, hide: 50 },
                html: S.getAttribute('data-bs-html') === 'true',
                placement: S.getAttribute('data-bs-placement') ?? 'auto'
              }
              return new Lo(S, u)
            }),
            [].slice.call(document.querySelectorAll('[data-bs-toggle="switch-icon"]')).map(function (S) {
              S.addEventListener('click', u => {
                ;(u.stopPropagation(), S.classList.toggle('active'))
              })
            }),
            (() => {
              const S = window.location.hash
              S &&
                [].slice
                  .call(document.querySelectorAll('[data-bs-toggle="tab"]'))
                  .filter(u => u.hash === S)
                  .map(u => {
                    new ii(u).show()
                  })
            })(),
            [].slice.call(document.querySelectorAll('[data-bs-toggle="toast"]')).map(function (S) {
              if (!S.hasAttribute('data-bs-target')) return
              const u = new ao(S.getAttribute('data-bs-target'))
              S.addEventListener('click', () => {
                u.show()
              })
            }))
          const xd = 'tblr-',
            Sd = (S, u) => {
              const b = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(S)
              return b ? `rgba(${parseInt(b[1], 16)}, ${parseInt(b[2], 16)}, ${parseInt(b[3], 16)}, ${u})` : null
            },
            jv = Object.freeze(
              Object.defineProperty(
                {
                  __proto__: null,
                  getColor: (S, u = 1) => {
                    const b = getComputedStyle(document.body).getPropertyValue(`--${xd}${S}`).trim()
                    return u !== 1 ? Sd(b, u) : b
                  },
                  hexToRgba: Sd,
                  prefix: xd
                },
                Symbol.toStringTag,
                { value: 'Module' }
              )
            )
          ;((r.Alert = xi),
            (r.Button = Yr),
            (r.Carousel = h),
            (r.Collapse = et),
            (r.Dropdown = zt),
            (r.Modal = Qt),
            (r.Offcanvas = Lr),
            (r.Popover = Lo),
            (r.ScrollSpy = Io),
            (r.Tab = ii),
            (r.Toast = ao),
            (r.Tooltip = ri),
            (r.bootstrap = Fv),
            (r.tabler = jv),
            Object.defineProperty(r, Symbol.toStringTag, { value: 'Module' }))
        })
      })(Fs, Fs.exports)),
    Fs.exports
  )
}
J0()
const yo = (e, t) => {
    const r = e.__vccOpts || e
    for (const [n, i] of t) r[n] = i
    return r
  },
  Y0 = {
    name: 'DashboardApp',
    setup() {
      const e = qe(!1),
        t = nn({
          status: 'Not Checked In',
          checkIn: null,
          checkOut: null,
          hasAlert: !0,
          alertMessage: 'Welcome to School Attendance System! Please check in to start your day.'
        }),
        r = nn({ presentDays: 22, totalDays: 24, attendancePercentage: 92 }),
        n = nn({ total: 12, used: 3, remaining: 9 }),
        i = nn({ thisMonth: 8, thisYear: 45 }),
        s = qe([
          { id: 1, date: 'Today', status: 'present', checkIn: '08:00', checkOut: null, totalHours: 0 },
          { id: 2, date: 'Yesterday', status: 'present', checkIn: '08:15', checkOut: '17:00', totalHours: 8.75 },
          { id: 3, date: '2 days ago', status: 'late', checkIn: '08:30', checkOut: '17:00', totalHours: 8.5 },
          { id: 4, date: '3 days ago', status: 'present', checkIn: '07:55', checkOut: '17:05', totalHours: 9.1 },
          { id: 5, date: '4 days ago', status: 'present', checkIn: '08:00', checkOut: '17:00', totalHours: 9 }
        ]),
        a = qe([
          { id: 1, period: '1', subject: 'Mathematics', time: '08:00 - 09:00', room: 'A101' },
          { id: 2, period: '2', subject: 'Physics', time: '09:00 - 10:00', room: 'B205' },
          { id: 3, period: '3', subject: 'Chemistry', time: '10:30 - 11:30', room: 'C301' },
          { id: 4, period: '4', subject: 'Biology', time: '11:30 - 12:30', room: 'C302' }
        ]),
        d = qe(!0),
        f = qe(!1),
        g = async () => {
          e.value = !0
          try {
            const k = await Fe.get('/api/v1/dashboard/stats')
            ;(Object.assign(r, k.data.monthly_stats),
              Object.assign(n, k.data.leave_balance),
              Object.assign(i, k.data.overtime))
          } catch (k) {
            console.error('Error fetching dashboard data:', k)
          } finally {
            e.value = !1
          }
        },
        p = async () => {
          try {
            'geolocation' in navigator &&
              navigator.geolocation.getCurrentPosition(
                async k => {
                  const { latitude: F, longitude: N } = k.coords,
                    E = await Fe.post('/api/v1/attendance/check-in', { latitude: F, longitude: N })
                  ;((t.status = 'Checked In'),
                    (t.checkIn = new Date().toLocaleTimeString('en-US', {
                      hour12: !1,
                      hour: '2-digit',
                      minute: '2-digit'
                    })),
                    (d.value = !1),
                    (f.value = !0),
                    (t.hasAlert = !1))
                },
                k => {
                  alert('Location access is required for check-in')
                }
              )
          } catch (k) {
            ;(console.error('Check-in error:', k), alert('Failed to check in. Please try again.'))
          }
        },
        y = async () => {
          try {
            const k = await Fe.post('/api/v1/attendance/check-out')
            ;((t.status = 'Checked Out'),
              (t.checkOut = new Date().toLocaleTimeString('en-US', { hour12: !1, hour: '2-digit', minute: '2-digit' })),
              (f.value = !1),
              (d.value = !0))
          } catch (k) {
            ;(console.error('Check-out error:', k), alert('Failed to check out. Please try again.'))
          }
        },
        _ = () => {
          window.location.href = '/leaves/create'
        },
        C = () => {
          window.location.href = '/schedules'
        },
        A = k => {
          switch (k) {
            case 'present':
              return 'bg-success'
            case 'late':
              return 'bg-warning'
            case 'absent':
              return 'bg-danger'
            case 'half_day':
              return 'bg-info'
            default:
              return 'bg-secondary'
          }
        }
      return (
        qi(() => {
          g()
        }),
        {
          loading: e,
          todayStatus: t,
          monthlyStats: r,
          leaveBalance: n,
          overtime: i,
          recentAttendance: s,
          upcomingSchedule: a,
          canCheckIn: d,
          canCheckOut: f,
          refreshData: g,
          checkIn: p,
          checkOut: y,
          requestLeave: _,
          viewSchedule: C,
          getStatusBadgeClass: A
        }
      )
    }
  },
  Q0 = { class: 'page' },
  Z0 = { class: 'page-header d-print-none' },
  e1 = { class: 'container-xl' },
  t1 = { class: 'row g-2 align-items-center' },
  n1 = { class: 'col-auto ms-auto d-print-none' },
  r1 = { class: 'btn-list' },
  i1 = { class: 'd-none d-sm-inline' },
  o1 = ['disabled'],
  s1 = { class: 'page-body' },
  a1 = { class: 'container-xl' },
  l1 = { key: 0, class: 'alert alert-important alert-warning alert-dismissible mb-3', role: 'alert' },
  c1 = { class: 'd-flex' },
  u1 = { class: 'row row-deck row-cards mb-3' },
  d1 = { class: 'col-sm-6 col-lg-3' },
  f1 = { class: 'card' },
  h1 = { class: 'card-body' },
  p1 = { class: 'h1 mb-3' },
  m1 = { class: 'd-flex mb-2' },
  v1 = { class: 'col-sm-6 col-lg-3' },
  g1 = { class: 'card' },
  b1 = { class: 'card-body' },
  y1 = { class: 'd-flex align-items-baseline' },
  _1 = { class: 'h1 mb-0 me-2' },
  w1 = { class: 'me-auto' },
  x1 = { class: 'text-green d-inline-flex align-items-center lh-1' },
  S1 = { class: 'text-muted' },
  C1 = { class: 'col-sm-6 col-lg-3' },
  T1 = { class: 'card' },
  A1 = { class: 'card-body' },
  D1 = { class: 'd-flex align-items-baseline' },
  k1 = { class: 'h1 mb-3 me-2' },
  E1 = { class: 'me-auto' },
  O1 = { class: 'text-yellow d-inline-flex align-items-center lh-1' },
  P1 = { class: 'text-muted' },
  R1 = { class: 'col-sm-6 col-lg-3' },
  L1 = { class: 'card' },
  M1 = { class: 'card-body' },
  I1 = { class: 'd-flex align-items-baseline' },
  F1 = { class: 'h1 mb-3 me-2' },
  j1 = { class: 'text-muted' },
  N1 = { class: 'row row-deck row-cards mb-3' },
  H1 = { class: 'col-12' },
  $1 = { class: 'card' },
  B1 = { class: 'card-body' },
  q1 = { class: 'row' },
  U1 = { class: 'col-md-3 col-sm-6 mb-3' },
  W1 = ['disabled'],
  V1 = { class: 'col-md-3 col-sm-6 mb-3' },
  z1 = ['disabled'],
  K1 = { class: 'col-md-3 col-sm-6 mb-3' },
  X1 = { class: 'col-md-3 col-sm-6 mb-3' },
  G1 = { class: 'row row-deck row-cards' },
  J1 = { class: 'col-md-6' },
  Y1 = { class: 'card' },
  Q1 = { class: 'card-body' },
  Z1 = { key: 0, class: 'text-center py-4' },
  ew = { key: 1, class: 'divide-y' },
  tw = { class: 'col-auto' },
  nw = { class: 'col' },
  rw = { class: 'text-truncate' },
  iw = { class: 'text-muted' },
  ow = { class: 'col-auto' },
  sw = { class: 'text-muted' },
  aw = { class: 'col-md-6' },
  lw = { class: 'card' },
  cw = { class: 'card-body' },
  uw = { key: 0, class: 'text-center py-4' },
  dw = { key: 1, class: 'divide-y' },
  fw = { class: 'col-auto' },
  hw = { class: 'avatar avatar-sm' },
  pw = { class: 'col' },
  mw = { class: 'text-truncate' },
  vw = { class: 'text-muted' },
  gw = { class: 'col-auto' },
  bw = { class: 'text-muted' }
function yw(e, t, r, n, i, s) {
  return (
    he(),
    pe('div', Q0, [
      l('div', Z0, [
        l('div', e1, [
          l('div', t1, [
            t[7] ||
              (t[7] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' School Attendance System '),
                  l('h2', { class: 'page-title' }, ' Dashboard ')
                ],
                -1
              )),
            l('div', n1, [
              l('div', r1, [
                l('span', i1, [
                  l(
                    'button',
                    {
                      onClick: t[0] || (t[0] = (...a) => n.refreshData && n.refreshData(...a)),
                      class: 'btn btn-primary',
                      disabled: n.loading
                    },
                    t[6] ||
                      (t[6] = [
                        l(
                          'svg',
                          {
                            xmlns: 'http://www.w3.org/2000/svg',
                            class: 'icon',
                            width: '24',
                            height: '24',
                            viewBox: '0 0 24 24',
                            'stroke-width': '2',
                            stroke: 'currentColor',
                            fill: 'none',
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round'
                          },
                          [
                            l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                            l('path', { d: 'M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4' }),
                            l('path', { d: 'M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4' })
                          ],
                          -1
                        ),
                        Kt(' Refresh ')
                      ]),
                    8,
                    o1
                  )
                ])
              ])
            ])
          ])
        ])
      ]),
      l('div', s1, [
        l('div', a1, [
          n.todayStatus.hasAlert
            ? (he(),
              pe('div', l1, [
                l('div', c1, [
                  t[8] ||
                    (t[8] = l(
                      'div',
                      null,
                      [
                        l(
                          'svg',
                          {
                            xmlns: 'http://www.w3.org/2000/svg',
                            class: 'icon alert-icon',
                            width: '24',
                            height: '24',
                            viewBox: '0 0 24 24',
                            'stroke-width': '2',
                            stroke: 'currentColor',
                            fill: 'none',
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round'
                          },
                          [
                            l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                            l('path', { d: 'M12 9v2m0 4v.01' }),
                            l('path', {
                              d: 'M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75'
                            })
                          ]
                        )
                      ],
                      -1
                    )),
                  l('div', null, Q(n.todayStatus.alertMessage), 1)
                ]),
                l('button', {
                  type: 'button',
                  class: 'btn-close',
                  onClick: t[1] || (t[1] = a => (n.todayStatus.hasAlert = !1))
                })
              ]))
            : Ye('', !0),
          l('div', u1, [
            l('div', d1, [
              l('div', f1, [
                l('div', h1, [
                  t[9] ||
                    (t[9] = Tr(
                      '<div class="d-flex align-items-center" data-v-7664bc88><div class="subheader" data-v-7664bc88>Today&#39;s Status</div><div class="ms-auto lh-1" data-v-7664bc88><div class="dropdown" data-v-7664bc88><a class="dropdown-toggle text-muted" href="#" data-bs-toggle="dropdown" data-v-7664bc88>Last 7 days</a><div class="dropdown-menu dropdown-menu-end" data-v-7664bc88><a class="dropdown-item active" href="#" data-v-7664bc88>Last 7 days</a><a class="dropdown-item" href="#" data-v-7664bc88>Last 30 days</a><a class="dropdown-item" href="#" data-v-7664bc88>Last 3 months</a></div></div></div></div>',
                      1
                    )),
                  l('div', p1, Q(n.todayStatus.status), 1),
                  l('div', m1, [l('div', null, 'Check-in: ' + Q(n.todayStatus.checkIn || 'Not checked in'), 1)]),
                  t[10] ||
                    (t[10] = l(
                      'div',
                      { class: 'progress progress-sm' },
                      [l('div', { class: 'progress-bar bg-primary', style: { width: '75%' }, role: 'progressbar' })],
                      -1
                    ))
                ])
              ])
            ]),
            l('div', v1, [
              l('div', g1, [
                l('div', b1, [
                  t[12] ||
                    (t[12] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'This Month')],
                      -1
                    )),
                  l('div', y1, [
                    l('div', _1, Q(n.monthlyStats.presentDays), 1),
                    l('div', w1, [
                      l('span', x1, [
                        Kt(Q(n.monthlyStats.attendancePercentage) + '% ', 1),
                        t[11] ||
                          (t[11] = l(
                            'svg',
                            {
                              xmlns: 'http://www.w3.org/2000/svg',
                              class: 'icon ms-1',
                              width: '24',
                              height: '24',
                              viewBox: '0 0 24 24',
                              'stroke-width': '2',
                              stroke: 'currentColor',
                              fill: 'none',
                              'stroke-linecap': 'round',
                              'stroke-linejoin': 'round'
                            },
                            [
                              l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                              l('path', { d: 'M3 17l6 -6l4 4l8 -8' }),
                              l('path', { d: 'M14 7l7 0l0 7' })
                            ],
                            -1
                          ))
                      ])
                    ])
                  ]),
                  l('div', S1, 'Present days out of ' + Q(n.monthlyStats.totalDays), 1)
                ])
              ])
            ]),
            l('div', C1, [
              l('div', T1, [
                l('div', A1, [
                  t[13] ||
                    (t[13] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Leave Balance')],
                      -1
                    )),
                  l('div', D1, [
                    l('div', k1, Q(n.leaveBalance.remaining), 1),
                    l('div', E1, [l('span', O1, ' of ' + Q(n.leaveBalance.total) + ' days ', 1)])
                  ]),
                  l('div', P1, Q(n.leaveBalance.used) + ' days used this year', 1)
                ])
              ])
            ]),
            l('div', R1, [
              l('div', L1, [
                l('div', M1, [
                  t[15] ||
                    (t[15] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Overtime')],
                      -1
                    )),
                  l('div', I1, [
                    l('div', F1, Q(n.overtime.thisMonth) + 'h', 1),
                    t[14] ||
                      (t[14] = l(
                        'div',
                        { class: 'me-auto' },
                        [l('span', { class: 'text-blue d-inline-flex align-items-center lh-1' }, ' This month ')],
                        -1
                      ))
                  ]),
                  l('div', j1, Q(n.overtime.thisYear) + 'h this year', 1)
                ])
              ])
            ])
          ]),
          l('div', N1, [
            l('div', H1, [
              l('div', $1, [
                t[20] ||
                  (t[20] = l('div', { class: 'card-header' }, [l('h3', { class: 'card-title' }, 'Quick Actions')], -1)),
                l('div', B1, [
                  l('div', q1, [
                    l('div', U1, [
                      l(
                        'button',
                        {
                          onClick: t[2] || (t[2] = (...a) => n.checkIn && n.checkIn(...a)),
                          class: 'btn btn-success w-100',
                          disabled: !n.canCheckIn
                        },
                        t[16] ||
                          (t[16] = [
                            l(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                class: 'icon me-2',
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24',
                                'stroke-width': '2',
                                stroke: 'currentColor',
                                fill: 'none',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                l('path', { d: 'M9 11l3 3l8 -8' }),
                                l('path', { d: 'M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9' })
                              ],
                              -1
                            ),
                            Kt(' Check In ')
                          ]),
                        8,
                        W1
                      )
                    ]),
                    l('div', V1, [
                      l(
                        'button',
                        {
                          onClick: t[3] || (t[3] = (...a) => n.checkOut && n.checkOut(...a)),
                          class: 'btn btn-outline-danger w-100',
                          disabled: !n.canCheckOut
                        },
                        t[17] ||
                          (t[17] = [
                            l(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                class: 'icon me-2',
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24',
                                'stroke-width': '2',
                                stroke: 'currentColor',
                                fill: 'none',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                l('path', { d: 'M9 11l3 3l8 -8' }),
                                l('path', { d: 'M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9' })
                              ],
                              -1
                            ),
                            Kt(' Check Out ')
                          ]),
                        8,
                        z1
                      )
                    ]),
                    l('div', K1, [
                      l(
                        'button',
                        {
                          onClick: t[4] || (t[4] = (...a) => n.requestLeave && n.requestLeave(...a)),
                          class: 'btn btn-outline-primary w-100'
                        },
                        t[18] ||
                          (t[18] = [
                            Tr(
                              '<svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-7664bc88><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-7664bc88></path><path d="M14 3v4a1 1 0 0 0 1 1h4" data-v-7664bc88></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" data-v-7664bc88></path><path d="M9 9l1 0" data-v-7664bc88></path><path d="M9 13l6 0" data-v-7664bc88></path><path d="M9 17l6 0" data-v-7664bc88></path></svg> Request Leave ',
                              2
                            )
                          ])
                      )
                    ]),
                    l('div', X1, [
                      l(
                        'button',
                        {
                          onClick: t[5] || (t[5] = (...a) => n.viewSchedule && n.viewSchedule(...a)),
                          class: 'btn btn-outline-secondary w-100'
                        },
                        t[19] ||
                          (t[19] = [
                            Tr(
                              '<svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-7664bc88><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-7664bc88></path><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" data-v-7664bc88></path><path d="M16 3v4" data-v-7664bc88></path><path d="M8 3v4" data-v-7664bc88></path><path d="M4 11h16" data-v-7664bc88></path></svg> View Schedule ',
                              2
                            )
                          ])
                      )
                    ])
                  ])
                ])
              ])
            ])
          ]),
          l('div', G1, [
            l('div', J1, [
              l('div', Y1, [
                t[22] ||
                  (t[22] = l(
                    'div',
                    { class: 'card-header' },
                    [l('h3', { class: 'card-title' }, 'Recent Attendance')],
                    -1
                  )),
                l('div', Q1, [
                  n.loading
                    ? (he(),
                      pe(
                        'div',
                        Z1,
                        t[21] ||
                          (t[21] = [
                            l(
                              'div',
                              { class: 'spinner-border', role: 'status' },
                              [l('span', { class: 'visually-hidden' }, 'Loading...')],
                              -1
                            )
                          ])
                      ))
                    : (he(),
                      pe('div', ew, [
                        (he(!0),
                        pe(
                          tn,
                          null,
                          or(
                            n.recentAttendance,
                            a => (
                              he(),
                              pe('div', { key: a.id, class: 'row py-2' }, [
                                l('div', tw, [
                                  l('span', { class: dt(['badge', n.getStatusBadgeClass(a.status)]) }, Q(a.status), 3)
                                ]),
                                l('div', nw, [
                                  l('div', rw, [l('strong', null, Q(a.date), 1)]),
                                  l('div', iw, Q(a.checkIn) + ' - ' + Q(a.checkOut || 'In progress'), 1)
                                ]),
                                l('div', ow, [l('span', sw, Q(a.totalHours) + 'h', 1)])
                              ])
                            )
                          ),
                          128
                        ))
                      ]))
                ])
              ])
            ]),
            l('div', aw, [
              l('div', lw, [
                t[24] ||
                  (t[24] = l(
                    'div',
                    { class: 'card-header' },
                    [l('h3', { class: 'card-title' }, 'Upcoming Schedule')],
                    -1
                  )),
                l('div', cw, [
                  n.loading
                    ? (he(),
                      pe(
                        'div',
                        uw,
                        t[23] ||
                          (t[23] = [
                            l(
                              'div',
                              { class: 'spinner-border', role: 'status' },
                              [l('span', { class: 'visually-hidden' }, 'Loading...')],
                              -1
                            )
                          ])
                      ))
                    : (he(),
                      pe('div', dw, [
                        (he(!0),
                        pe(
                          tn,
                          null,
                          or(
                            n.upcomingSchedule,
                            a => (
                              he(),
                              pe('div', { key: a.id, class: 'row py-2' }, [
                                l('div', fw, [l('span', hw, Q(a.period), 1)]),
                                l('div', pw, [
                                  l('div', mw, [l('strong', null, Q(a.subject), 1)]),
                                  l('div', vw, Q(a.time), 1)
                                ]),
                                l('div', gw, [l('span', bw, Q(a.room), 1)])
                              ])
                            )
                          ),
                          128
                        ))
                      ]))
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  )
}
const Vp = yo(Y0, [
  ['render', yw],
  ['__scopeId', 'data-v-7664bc88']
])
/*! DataTables 1.13.11
 * ©2008-2024 SpryMedia Ltd - datatables.net/license
 */ var P = gt,
  le = function (e, t) {
    if (le.factory(e, t)) return le
    if (this instanceof le) return P(e).DataTable(t)
    ;((t = e),
      (this.$ = function (a, d) {
        return this.api(!0).$(a, d)
      }),
      (this._ = function (a, d) {
        return this.api(!0).rows(a, d).data()
      }),
      (this.api = function (a) {
        return a ? new yt(Al(this[dn.iApiIndex])) : new yt(this)
      }),
      (this.fnAddData = function (a, d) {
        var f = this.api(!0),
          g = Array.isArray(a) && (Array.isArray(a[0]) || P.isPlainObject(a[0])) ? f.rows.add(a) : f.row.add(a)
        return ((d === void 0 || d) && f.draw(), g.flatten().toArray())
      }),
      (this.fnAdjustColumnSizing = function (a) {
        var d = this.api(!0).columns.adjust(),
          f = d.settings()[0],
          g = f.oScroll
        a === void 0 || a ? d.draw(!1) : (g.sX !== '' || g.sY !== '') && Ql(f)
      }),
      (this.fnClearTable = function (a) {
        var d = this.api(!0).clear()
        ;(a === void 0 || a) && d.draw()
      }),
      (this.fnClose = function (a) {
        this.api(!0).row(a).child.hide()
      }),
      (this.fnDeleteRow = function (a, d, f) {
        var g = this.api(!0),
          p = g.rows(a),
          y = p.settings()[0],
          _ = y.aoData[p[0][0]]
        return (p.remove(), d && d.call(this, y, _), (f === void 0 || f) && g.draw(), _)
      }),
      (this.fnDestroy = function (a) {
        this.api(!0).destroy(a)
      }),
      (this.fnDraw = function (a) {
        this.api(!0).draw(a)
      }),
      (this.fnFilter = function (a, d, f, g, p, y) {
        var _ = this.api(!0)
        ;(d == null ? _.search(a, f, g, y) : _.column(d).search(a, f, g, y), _.draw())
      }),
      (this.fnGetData = function (a, d) {
        var f = this.api(!0)
        if (a !== void 0) {
          var g = a.nodeName ? a.nodeName.toLowerCase() : ''
          return d !== void 0 || g == 'td' || g == 'th' ? f.cell(a, d).data() : f.row(a).data() || null
        }
        return f.data().toArray()
      }),
      (this.fnGetNodes = function (a) {
        var d = this.api(!0)
        return a !== void 0 ? d.row(a).node() : d.rows().nodes().flatten().toArray()
      }),
      (this.fnGetPosition = function (a) {
        var d = this.api(!0),
          f = a.nodeName.toUpperCase()
        if (f == 'TR') return d.row(a).index()
        if (f == 'TD' || f == 'TH') {
          var g = d.cell(a).index()
          return [g.row, g.columnVisible, g.column]
        }
        return null
      }),
      (this.fnIsOpen = function (a) {
        return this.api(!0).row(a).child.isShown()
      }),
      (this.fnOpen = function (a, d, f) {
        return this.api(!0).row(a).child(d, f).show().child()[0]
      }),
      (this.fnPageChange = function (a, d) {
        var f = this.api(!0).page(a)
        ;(d === void 0 || d) && f.draw(!1)
      }),
      (this.fnSetColumnVis = function (a, d, f) {
        var g = this.api(!0).column(a).visible(d)
        ;(f === void 0 || f) && g.columns.adjust().draw()
      }),
      (this.fnSettings = function () {
        return Al(this[dn.iApiIndex])
      }),
      (this.fnSort = function (a) {
        this.api(!0).order(a).draw()
      }),
      (this.fnSortListener = function (a, d, f) {
        this.api(!0).order.listener(a, d, f)
      }),
      (this.fnUpdate = function (a, d, f, g, p) {
        var y = this.api(!0)
        return (
          f == null ? y.row(d).data(a) : y.cell(d, f).data(a),
          (p === void 0 || p) && y.columns.adjust(),
          (g === void 0 || g) && y.draw(),
          0
        )
      }),
      (this.fnVersionCheck = dn.fnVersionCheck))
    var r = this,
      n = t === void 0,
      i = this.length
    ;(n && (t = {}), (this.oApi = this.internal = dn.internal))
    for (var s in le.ext.internal) s && (this[s] = Mm(s))
    return (
      this.each(function () {
        var a = {},
          d = i > 1 ? gu(a, t, !0) : t,
          f = 0,
          g,
          p = this.getAttribute('id'),
          y = !1,
          _ = le.defaults,
          C = P(this)
        if (this.nodeName.toLowerCase() != 'table') {
          vr(null, 0, 'Non-table node initialisation (' + this.nodeName + ')', 2)
          return
        }
        ;(Gf(_), Yp(_.column), ui(_, _, !0), ui(_.column, _.column, !0), ui(_, P.extend(d, C.data()), !0))
        var A = le.settings
        for (f = 0, g = A.length; f < g; f++) {
          var k = A[f]
          if (
            k.nTable == this ||
            (k.nTHead && k.nTHead.parentNode == this) ||
            (k.nTFoot && k.nTFoot.parentNode == this)
          ) {
            var F = d.bRetrieve !== void 0 ? d.bRetrieve : _.bRetrieve,
              N = d.bDestroy !== void 0 ? d.bDestroy : _.bDestroy
            if (n || F) return k.oInstance
            if (N) {
              k.oInstance.fnDestroy()
              break
            } else {
              vr(k, 0, 'Cannot reinitialise DataTable', 3)
              return
            }
          }
          if (k.sTableId == this.id) {
            A.splice(f, 1)
            break
          }
        }
        ;(p === null || p === '') && ((p = 'DataTables_Table_' + le.ext._unique++), (this.id = p))
        var E = P.extend(!0, {}, le.models.oSettings, { sDestroyWidth: C[0].style.width, sInstance: p, sTableId: p })
        ;((E.nTable = this),
          (E.oApi = r.internal),
          (E.oInit = d),
          A.push(E),
          (E.oInstance = r.length === 1 ? r : C.dataTable()),
          Gf(d),
          fu(d.oLanguage),
          d.aLengthMenu &&
            !d.iDisplayLength &&
            (d.iDisplayLength = Array.isArray(d.aLengthMenu[0]) ? d.aLengthMenu[0][0] : d.aLengthMenu[0]),
          (d = gu(P.extend(!0, {}, _), d)),
          Sr(E.oFeatures, d, [
            'bPaginate',
            'bLengthChange',
            'bFilter',
            'bSort',
            'bSortMulti',
            'bInfo',
            'bProcessing',
            'bAutoWidth',
            'bSortClasses',
            'bServerSide',
            'bDeferRender'
          ]),
          Sr(E, d, [
            'asStripeClasses',
            'ajax',
            'fnServerData',
            'fnFormatNumber',
            'sServerMethod',
            'aaSorting',
            'aaSortingFixed',
            'aLengthMenu',
            'sPaginationType',
            'sAjaxSource',
            'sAjaxDataProp',
            'iStateDuration',
            'sDom',
            'bSortCellsTop',
            'iTabIndex',
            'fnStateLoadCallback',
            'fnStateSaveCallback',
            'renderer',
            'searchDelay',
            'rowId',
            ['iCookieDuration', 'iStateDuration'],
            ['oSearch', 'oPreviousSearch'],
            ['aoSearchCols', 'aoPreSearchCols'],
            ['iDisplayLength', '_iDisplayLength']
          ]),
          Sr(E.oScroll, d, [
            ['sScrollX', 'sX'],
            ['sScrollXInner', 'sXInner'],
            ['sScrollY', 'sY'],
            ['bScrollCollapse', 'bCollapse']
          ]),
          Sr(E.oLanguage, d, 'fnInfoCallback'),
          $n(E, 'aoDrawCallback', d.fnDrawCallback, 'user'),
          $n(E, 'aoServerParams', d.fnServerParams, 'user'),
          $n(E, 'aoStateSaveParams', d.fnStateSaveParams, 'user'),
          $n(E, 'aoStateLoadParams', d.fnStateLoadParams, 'user'),
          $n(E, 'aoStateLoaded', d.fnStateLoaded, 'user'),
          $n(E, 'aoRowCallback', d.fnRowCallback, 'user'),
          $n(E, 'aoRowCreatedCallback', d.fnCreatedRow, 'user'),
          $n(E, 'aoHeaderCallback', d.fnHeaderCallback, 'user'),
          $n(E, 'aoFooterCallback', d.fnFooterCallback, 'user'),
          $n(E, 'aoInitComplete', d.fnInitComplete, 'user'),
          $n(E, 'aoPreDrawCallback', d.fnPreDrawCallback, 'user'),
          (E.rowIdFn = es(d.rowId)),
          Qp(E))
        var z = E.oClasses
        if (
          (P.extend(z, le.ext.classes, d.oClasses),
          C.addClass(z.sTable),
          E.iInitDisplayStart === void 0 &&
            ((E.iInitDisplayStart = d.iDisplayStart), (E._iDisplayStart = d.iDisplayStart)),
          d.iDeferLoading !== null)
        ) {
          E.bDeferLoading = !0
          var Y = Array.isArray(d.iDeferLoading)
          ;((E._iRecordsDisplay = Y ? d.iDeferLoading[0] : d.iDeferLoading),
            (E._iRecordsTotal = Y ? d.iDeferLoading[1] : d.iDeferLoading))
        }
        var ue = E.oLanguage
        ;(P.extend(!0, ue, d.oLanguage),
          ue.sUrl
            ? (P.ajax({
                dataType: 'json',
                url: ue.sUrl,
                success: function (re) {
                  ;(ui(_.oLanguage, re),
                    fu(re),
                    P.extend(!0, ue, re, E.oInit.oLanguage),
                    Et(E, null, 'i18n', [E]),
                    zs(E))
                },
                error: function () {
                  zs(E)
                }
              }),
              (y = !0))
            : Et(E, null, 'i18n', [E]),
          d.asStripeClasses === null && (E.asStripeClasses = [z.sStripeOdd, z.sStripeEven]))
        var ke = E.asStripeClasses,
          m = C.children('tbody').find('tr').eq(0)
        P.inArray(
          !0,
          P.map(ke, function (re, Ee) {
            return m.hasClass(re)
          })
        ) !== -1 && (P('tbody tr', this).removeClass(ke.join(' ')), (E.asDestroyStripes = ke.slice()))
        var rt = [],
          Ne,
          fe = this.getElementsByTagName('thead')
        if ((fe.length !== 0 && (oa(E.aoHeader, fe[0]), (rt = Gl(E))), d.aoColumns === null))
          for (Ne = [], f = 0, g = rt.length; f < g; f++) Ne.push(null)
        else Ne = d.aoColumns
        for (f = 0, g = Ne.length; f < g; f++) qu(E, rt ? rt[f] : null)
        if (
          (Zp(E, d.aoColumnDefs, Ne, function (re, Ee) {
            Sl(E, re, Ee)
          }),
          m.length)
        ) {
          var He = function (re, Ee) {
            return re.getAttribute('data-' + Ee) !== null ? Ee : null
          }
          P(m[0])
            .children('th, td')
            .each(function (re, Ee) {
              var Me = E.aoColumns[re]
              if ((Me || vr(E, 0, 'Incorrect column count', 18), Me.mData === re)) {
                var Be = He(Ee, 'sort') || He(Ee, 'order'),
                  We = He(Ee, 'filter') || He(Ee, 'search')
                ;(Be !== null || We !== null) &&
                  ((Me.mData = {
                    _: re + '.display',
                    sort: Be !== null ? re + '.@data-' + Be : void 0,
                    type: Be !== null ? re + '.@data-' + Be : void 0,
                    filter: We !== null ? re + '.@data-' + We : void 0
                  }),
                  (Me._isArrayHost = !0),
                  Sl(E, re))
              }
            })
        }
        var it = E.oFeatures,
          Pe = function () {
            if (d.aaSorting === void 0) {
              var re = E.aaSorting
              for (f = 0, g = re.length; f < g; f++) re[f][1] = E.aoColumns[f].asSorting[0]
            }
            ;(Tl(E),
              it.bSort &&
                $n(E, 'aoDrawCallback', function () {
                  if (E.bSorted) {
                    var ht = os(E),
                      At = {}
                    ;(P.each(ht, function (Gt, Tt) {
                      At[Tt.src] = Tt.dir
                    }),
                      Et(E, null, 'order', [E, ht, At]),
                      xm(E))
                  }
                }),
              $n(
                E,
                'aoDrawCallback',
                function () {
                  ;(E.bSorted || Pn(E) === 'ssp' || it.bDeferRender) && Tl(E)
                },
                'sc'
              ))
            var Ee = C.children('caption').each(function () {
                this._captionSide = P(this).css('caption-side')
              }),
              Me = C.children('thead')
            ;(Me.length === 0 && (Me = P('<thead/>').appendTo(C)), (E.nTHead = Me[0]))
            var Be = C.children('tbody')
            ;(Be.length === 0 && (Be = P('<tbody/>').insertAfter(Me)), (E.nTBody = Be[0]))
            var We = C.children('tfoot')
            if (
              (We.length === 0 &&
                Ee.length > 0 &&
                (E.oScroll.sX !== '' || E.oScroll.sY !== '') &&
                (We = P('<tfoot/>').appendTo(C)),
              We.length === 0 || We.children().length === 0
                ? C.addClass(z.sNoFooter)
                : We.length > 0 && ((E.nTFoot = We[0]), oa(E.aoFooter, E.nTFoot)),
              d.aaData)
            )
              for (f = 0; f < d.aaData.length; f++) Ui(E, d.aaData[f])
            else (E.bDeferLoading || Pn(E) == 'dom') && Kl(E, P(E.nTBody).children('tr'))
            ;((E.aiDisplay = E.aiDisplayMaster.slice()), (E.bInitialised = !0), y === !1 && zs(E))
          }
        ;($n(E, 'aoDrawCallback', _a, 'state_save'), d.bStateSave ? ((it.bStateSave = !0), Cm(E, d, Pe)) : Pe())
      }),
      (r = null),
      this
    )
  },
  dn,
  yt,
  Je,
  Xt,
  qc = {},
  Kf = /[\r\n\u2028]/g,
  xl = /<.*?>/g,
  _w = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/,
  ww = new RegExp(
    '(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join('|\\') + ')',
    'g'
  ),
  uu = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi,
  Wr = function (e) {
    return !e || e === !0 || e === '-'
  },
  zp = function (e) {
    var t = parseInt(e, 10)
    return !isNaN(t) && isFinite(e) ? t : null
  },
  Kp = function (e, t) {
    return (
      qc[t] || (qc[t] = new RegExp(Xu(t), 'g')),
      typeof e == 'string' && t !== '.' ? e.replace(/\./g, '').replace(qc[t], '.') : e
    )
  },
  du = function (e, t, r) {
    var n = typeof e,
      i = n === 'string'
    return n === 'number' || n === 'bigint' || Wr(e)
      ? !0
      : (t && i && (e = Kp(e, t)), r && i && (e = e.replace(uu, '')), !isNaN(parseFloat(e)) && isFinite(e))
  },
  xw = function (e) {
    return Wr(e) || typeof e == 'string'
  },
  Xf = function (e, t, r) {
    if (Wr(e)) return !0
    var n = xw(e)
    return n && du(Sw(e), t, r) ? !0 : null
  },
  Zn = function (e, t, r) {
    var n = [],
      i = 0,
      s = e.length
    if (r !== void 0) for (; i < s; i++) e[i] && e[i][t] && n.push(e[i][t][r])
    else for (; i < s; i++) e[i] && n.push(e[i][t])
    return n
  },
  fa = function (e, t, r, n) {
    var i = [],
      s = 0,
      a = t.length
    if (n !== void 0) for (; s < a; s++) e[t[s]][r] && i.push(e[t[s]][r][n])
    else for (; s < a; s++) i.push(e[t[s]][r])
    return i
  },
  qo = function (e, t) {
    var r = [],
      n
    t === void 0 ? ((t = 0), (n = e)) : ((n = t), (t = e))
    for (var i = t; i < n; i++) r.push(i)
    return r
  },
  Xp = function (e) {
    for (var t = [], r = 0, n = e.length; r < n; r++) e[r] && t.push(e[r])
    return t
  },
  Sw = function (e) {
    return e.replace(xl, '').replace(/<script/i, '')
  },
  Cw = function (e) {
    if (e.length < 2) return !0
    for (var t = e.slice().sort(), r = t[0], n = 1, i = t.length; n < i; n++) {
      if (t[n] === r) return !1
      r = t[n]
    }
    return !0
  },
  Vl = function (e) {
    if (Cw(e)) return e.slice()
    var t = [],
      r,
      n,
      i = e.length,
      s,
      a = 0
    e: for (n = 0; n < i; n++) {
      for (r = e[n], s = 0; s < a; s++) if (t[s] === r) continue e
      ;(t.push(r), a++)
    }
    return t
  },
  Gp = function (e, t) {
    if (Array.isArray(t)) for (var r = 0; r < t.length; r++) Gp(e, t[r])
    else e.push(t)
    return e
  },
  Jp = function (e, t) {
    return (t === void 0 && (t = 0), this.indexOf(e, t) !== -1)
  }
Array.isArray ||
  (Array.isArray = function (e) {
    return Object.prototype.toString.call(e) === '[object Array]'
  })
Array.prototype.includes || (Array.prototype.includes = Jp)
String.prototype.trim ||
  (String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  })
String.prototype.includes || (String.prototype.includes = Jp)
le.util = {
  throttle: function (e, t) {
    var r = t !== void 0 ? t : 200,
      n,
      i
    return function () {
      var s = this,
        a = +new Date(),
        d = arguments
      n && a < n + r
        ? (clearTimeout(i),
          (i = setTimeout(function () {
            ;((n = void 0), e.apply(s, d))
          }, r)))
        : ((n = a), e.apply(s, d))
    }
  },
  escapeRegex: function (e) {
    return e.replace(ww, '\\$1')
  },
  set: function (e) {
    if (P.isPlainObject(e)) return le.util.set(e._)
    if (e === null) return function () {}
    if (typeof e == 'function')
      return function (r, n, i) {
        e(r, 'set', n, i)
      }
    if (typeof e == 'string' && (e.indexOf('.') !== -1 || e.indexOf('[') !== -1 || e.indexOf('(') !== -1)) {
      var t = function (r, n, i) {
        for (var s = hu(i), a, d = s[s.length - 1], f, g, p, y, _ = 0, C = s.length - 1; _ < C; _++) {
          if (s[_] === '__proto__' || s[_] === 'constructor') throw new Error('Cannot set prototype values')
          if (((f = s[_].match(Rs)), (g = s[_].match(No)), f)) {
            if (
              ((s[_] = s[_].replace(Rs, '')),
              (r[s[_]] = []),
              (a = s.slice()),
              a.splice(0, _ + 1),
              (y = a.join('.')),
              Array.isArray(n))
            )
              for (var A = 0, k = n.length; A < k; A++) ((p = {}), t(p, n[A], y), r[s[_]].push(p))
            else r[s[_]] = n
            return
          } else g && ((s[_] = s[_].replace(No, '')), (r = r[s[_]](n)))
          ;((r[s[_]] === null || r[s[_]] === void 0) && (r[s[_]] = {}), (r = r[s[_]]))
        }
        d.match(No) ? (r = r[d.replace(No, '')](n)) : (r[d.replace(Rs, '')] = n)
      }
      return function (r, n) {
        return t(r, n, e)
      }
    } else
      return function (r, n) {
        r[e] = n
      }
  },
  get: function (e) {
    if (P.isPlainObject(e)) {
      var t = {}
      return (
        P.each(e, function (n, i) {
          i && (t[n] = le.util.get(i))
        }),
        function (n, i, s, a) {
          var d = t[i] || t._
          return d !== void 0 ? d(n, i, s, a) : n
        }
      )
    } else {
      if (e === null)
        return function (n) {
          return n
        }
      if (typeof e == 'function')
        return function (n, i, s, a) {
          return e(n, i, s, a)
        }
      if (typeof e == 'string' && (e.indexOf('.') !== -1 || e.indexOf('[') !== -1 || e.indexOf('(') !== -1)) {
        var r = function (n, i, s) {
          var a, d, f, g
          if (s !== '')
            for (var p = hu(s), y = 0, _ = p.length; y < _; y++) {
              if (((a = p[y].match(Rs)), (d = p[y].match(No)), a)) {
                if (
                  ((p[y] = p[y].replace(Rs, '')),
                  p[y] !== '' && (n = n[p[y]]),
                  (f = []),
                  p.splice(0, y + 1),
                  (g = p.join('.')),
                  Array.isArray(n))
                )
                  for (var C = 0, A = n.length; C < A; C++) f.push(r(n[C], i, g))
                var k = a[0].substring(1, a[0].length - 1)
                n = k === '' ? f : f.join(k)
                break
              } else if (d) {
                ;((p[y] = p[y].replace(No, '')), (n = n[p[y]]()))
                continue
              }
              if (n === null || n[p[y]] === null) return null
              if (n === void 0 || n[p[y]] === void 0) return
              n = n[p[y]]
            }
          return n
        }
        return function (n, i) {
          return r(n, i, e)
        }
      } else
        return function (n, i) {
          return n[e]
        }
    }
  }
}
function ha(e) {
  var t = 'a aa ai ao as b fn i m o s ',
    r,
    n,
    i = {}
  ;(P.each(e, function (s, a) {
    ;((r = s.match(/^([^A-Z]+?)([A-Z])/)),
      r &&
        t.indexOf(r[1] + ' ') !== -1 &&
        ((n = s.replace(r[0], r[2].toLowerCase())), (i[n] = s), r[1] === 'o' && ha(e[s])))
  }),
    (e._hungarianMap = i))
}
function ui(e, t, r) {
  e._hungarianMap || ha(e)
  var n
  P.each(t, function (i, s) {
    ;((n = e._hungarianMap[i]),
      n !== void 0 &&
        (r || t[n] === void 0) &&
        (n.charAt(0) === 'o' ? (t[n] || (t[n] = {}), P.extend(!0, t[n], t[i]), ui(e[n], t[n], r)) : (t[n] = t[i])))
  })
}
function fu(e) {
  var t = le.defaults.oLanguage,
    r = t.sDecimal
  if ((r && bu(r), e)) {
    var n = e.sZeroRecords
    ;(!e.sEmptyTable && n && t.sEmptyTable === 'No data available in table' && Sr(e, e, 'sZeroRecords', 'sEmptyTable'),
      !e.sLoadingRecords && n && t.sLoadingRecords === 'Loading...' && Sr(e, e, 'sZeroRecords', 'sLoadingRecords'),
      e.sInfoThousands && (e.sThousands = e.sInfoThousands))
    var i = e.sDecimal
    i && r !== i && bu(i)
  }
}
var Gn = function (e, t, r) {
  e[t] !== void 0 && (e[r] = e[t])
}
function Gf(e) {
  ;(Gn(e, 'ordering', 'bSort'),
    Gn(e, 'orderMulti', 'bSortMulti'),
    Gn(e, 'orderClasses', 'bSortClasses'),
    Gn(e, 'orderCellsTop', 'bSortCellsTop'),
    Gn(e, 'order', 'aaSorting'),
    Gn(e, 'orderFixed', 'aaSortingFixed'),
    Gn(e, 'paging', 'bPaginate'),
    Gn(e, 'pagingType', 'sPaginationType'),
    Gn(e, 'pageLength', 'iDisplayLength'),
    Gn(e, 'searching', 'bFilter'),
    typeof e.sScrollX == 'boolean' && (e.sScrollX = e.sScrollX ? '100%' : ''),
    typeof e.scrollX == 'boolean' && (e.scrollX = e.scrollX ? '100%' : ''))
  var t = e.aoSearchCols
  if (t) for (var r = 0, n = t.length; r < n; r++) t[r] && ui(le.models.oSearch, t[r])
}
function Yp(e) {
  ;(Gn(e, 'orderable', 'bSortable'),
    Gn(e, 'orderData', 'aDataSort'),
    Gn(e, 'orderSequence', 'asSorting'),
    Gn(e, 'orderDataType', 'sortDataType'))
  var t = e.aDataSort
  typeof t == 'number' && !Array.isArray(t) && (e.aDataSort = [t])
}
function Qp(e) {
  if (!le.__browser) {
    var t = {}
    le.__browser = t
    var r = P('<div/>')
        .css({ position: 'fixed', top: 0, left: P(window).scrollLeft() * -1, height: 1, width: 1, overflow: 'hidden' })
        .append(
          P('<div/>')
            .css({ position: 'absolute', top: 1, left: 1, width: 100, overflow: 'scroll' })
            .append(P('<div/>').css({ width: '100%', height: 10 }))
        )
        .appendTo('body'),
      n = r.children(),
      i = n.children()
    ;((t.barWidth = n[0].offsetWidth - n[0].clientWidth),
      (t.bScrollOversize = i[0].offsetWidth === 100 && n[0].clientWidth !== 100),
      (t.bScrollbarLeft = Math.round(i.offset().left) !== 1),
      (t.bBounding = !!r[0].getBoundingClientRect().width),
      r.remove())
  }
  ;(P.extend(e.oBrowser, le.__browser), (e.oScroll.iBarWidth = le.__browser.barWidth))
}
function Jf(e, t, r, n, i, s) {
  var a = n,
    d,
    f = !1
  for (r !== void 0 && ((d = r), (f = !0)); a !== i; )
    e.hasOwnProperty(a) && ((d = f ? t(d, e[a], a, e) : e[a]), (f = !0), (a += s))
  return d
}
function qu(e, t) {
  var r = le.defaults.column,
    n = e.aoColumns.length,
    i = P.extend({}, le.models.oColumn, r, {
      nTh: t || document.createElement('th'),
      sTitle: r.sTitle ? r.sTitle : t ? t.innerHTML : '',
      aDataSort: r.aDataSort ? r.aDataSort : [n],
      mData: r.mData ? r.mData : n,
      idx: n
    })
  e.aoColumns.push(i)
  var s = e.aoPreSearchCols
  ;((s[n] = P.extend({}, le.models.oSearch, s[n])), Sl(e, n, P(t).data()))
}
function Sl(e, t, r) {
  var n = e.aoColumns[t],
    i = e.oClasses,
    s = P(n.nTh)
  if (!n.sWidthOrig) {
    n.sWidthOrig = s.attr('width') || null
    var a = (s.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/)
    a && (n.sWidthOrig = a[1])
  }
  if (r != null) {
    ;(Yp(r),
      ui(le.defaults.column, r, !0),
      r.mDataProp !== void 0 && !r.mData && (r.mData = r.mDataProp),
      r.sType && (n._sManualType = r.sType),
      r.className && !r.sClass && (r.sClass = r.className),
      r.sClass && s.addClass(r.sClass))
    var d = n.sClass
    ;(P.extend(n, r),
      Sr(n, r, 'sWidth', 'sWidthOrig'),
      d !== n.sClass && (n.sClass = d + ' ' + n.sClass),
      r.iDataSort !== void 0 && (n.aDataSort = [r.iDataSort]),
      Sr(n, r, 'aDataSort'),
      n.ariaTitle || (n.ariaTitle = s.attr('aria-label')))
  }
  var f = n.mData,
    g = es(f),
    p = n.mRender ? es(n.mRender) : null,
    y = function (A) {
      return typeof A == 'string' && A.indexOf('@') !== -1
    }
  ;((n._bAttrSrc = P.isPlainObject(f) && (y(f.sort) || y(f.type) || y(f.filter))),
    (n._setter = null),
    (n.fnGetData = function (A, k, F) {
      var N = g(A, k, void 0, F)
      return p && k ? p(N, k, A, F) : N
    }),
    (n.fnSetData = function (A, k, F) {
      return Fi(f)(A, k, F)
    }),
    typeof f != 'number' && !n._isArrayHost && (e._rowReadObject = !0),
    e.oFeatures.bSort || ((n.bSortable = !1), s.addClass(i.sSortableNone)))
  var _ = P.inArray('asc', n.asSorting) !== -1,
    C = P.inArray('desc', n.asSorting) !== -1
  !n.bSortable || (!_ && !C)
    ? ((n.sSortingClass = i.sSortableNone), (n.sSortingClassJUI = ''))
    : _ && !C
      ? ((n.sSortingClass = i.sSortableAsc), (n.sSortingClassJUI = i.sSortJUIAscAllowed))
      : !_ && C
        ? ((n.sSortingClass = i.sSortableDesc), (n.sSortingClassJUI = i.sSortJUIDescAllowed))
        : ((n.sSortingClass = i.sSortable), (n.sSortingClassJUI = i.sSortJUI))
}
function pa(e) {
  if (e.oFeatures.bAutoWidth !== !1) {
    var t = e.aoColumns
    Ju(e)
    for (var r = 0, n = t.length; r < n; r++) t[r].nTh.style.width = t[r].sWidth
  }
  var i = e.oScroll
  ;((i.sY !== '' || i.sX !== '') && Ql(e), Et(e, null, 'column-sizing', [e]))
}
function ma(e, t) {
  var r = zl(e, 'bVisible')
  return typeof r[t] == 'number' ? r[t] : null
}
function va(e, t) {
  var r = zl(e, 'bVisible'),
    n = P.inArray(t, r)
  return n !== -1 ? n : null
}
function is(e) {
  var t = 0
  return (
    P.each(e.aoColumns, function (r, n) {
      n.bVisible && P(n.nTh).css('display') !== 'none' && t++
    }),
    t
  )
}
function zl(e, t) {
  var r = []
  return (
    P.map(e.aoColumns, function (n, i) {
      n[t] && r.push(i)
    }),
    r
  )
}
function Uu(e) {
  var t = e.aoColumns,
    r = e.aoData,
    n = le.ext.type.detect,
    i,
    s,
    a,
    d,
    f,
    g,
    p,
    y,
    _
  for (i = 0, s = t.length; i < s; i++)
    if (((p = t[i]), (_ = []), !p.sType && p._sManualType)) p.sType = p._sManualType
    else if (!p.sType) {
      for (a = 0, d = n.length; a < d; a++) {
        for (
          f = 0, g = r.length;
          f < g &&
          (_[f] === void 0 && (_[f] = er(e, f, i, 'type')),
          (y = n[a](_[f], e)),
          !((!y && a !== n.length - 1) || (y === 'html' && !Wr(_[f]))));
          f++
        );
        if (y) {
          p.sType = y
          break
        }
      }
      p.sType || (p.sType = 'string')
    }
}
function Zp(e, t, r, n) {
  var i,
    s,
    a,
    d,
    f,
    g,
    p,
    y = e.aoColumns
  if (t)
    for (i = t.length - 1; i >= 0; i--) {
      p = t[i]
      var _ = p.target !== void 0 ? p.target : p.targets !== void 0 ? p.targets : p.aTargets
      for (Array.isArray(_) || (_ = [_]), a = 0, d = _.length; a < d; a++)
        if (typeof _[a] == 'number' && _[a] >= 0) {
          for (; y.length <= _[a]; ) qu(e)
          n(_[a], p)
        } else if (typeof _[a] == 'number' && _[a] < 0) n(y.length + _[a], p)
        else if (typeof _[a] == 'string')
          for (f = 0, g = y.length; f < g; f++) (_[a] == '_all' || P(y[f].nTh).hasClass(_[a])) && n(f, p)
    }
  if (r) for (i = 0, s = r.length; i < s; i++) n(i, r[i])
}
function Ui(e, t, r, n) {
  var i = e.aoData.length,
    s = P.extend(!0, {}, le.models.oRow, { src: r ? 'dom' : 'data', idx: i })
  ;((s._aData = t), e.aoData.push(s))
  for (var a = e.aoColumns, d = 0, f = a.length; d < f; d++) a[d].sType = null
  e.aiDisplayMaster.push(i)
  var g = e.rowIdFn(t)
  return (g !== void 0 && (e.aIds[g] = s), (r || !e.oFeatures.bDeferRender) && Vu(e, i, r, n), i)
}
function Kl(e, t) {
  var r
  return (
    t instanceof P || (t = P(t)),
    t.map(function (n, i) {
      return ((r = Wu(e, i)), Ui(e, r.data, i, r.cells))
    })
  )
}
function Tw(e, t) {
  return t._DT_RowIndex !== void 0 ? t._DT_RowIndex : null
}
function Aw(e, t, r) {
  return P.inArray(r, e.aoData[t].anCells)
}
function er(e, t, r, n) {
  n === 'search' ? (n = 'filter') : n === 'order' && (n = 'sort')
  var i = e.iDraw,
    s = e.aoColumns[r],
    a = e.aoData[t]._aData,
    d = s.sDefaultContent,
    f = s.fnGetData(a, n, { settings: e, row: t, col: r })
  if (f === void 0)
    return (
      e.iDrawError != i &&
        d === null &&
        (vr(
          e,
          0,
          'Requested unknown parameter ' +
            (typeof s.mData == 'function' ? '{function}' : "'" + s.mData + "'") +
            ' for row ' +
            t +
            ', column ' +
            r,
          4
        ),
        (e.iDrawError = i)),
      d
    )
  if ((f === a || f === null) && d !== null && n !== void 0) f = d
  else if (typeof f == 'function') return f.call(a)
  if (f === null && n === 'display') return ''
  if (n === 'filter') {
    var g = le.ext.type.search
    g[s.sType] && (f = g[s.sType](f))
  }
  return f
}
function em(e, t, r, n) {
  var i = e.aoColumns[r],
    s = e.aoData[t]._aData
  i.fnSetData(s, n, { settings: e, row: t, col: r })
}
var Rs = /\[.*?\]$/,
  No = /\(\)$/
function hu(e) {
  return P.map(e.match(/(\\.|[^\.])+/g) || [''], function (t) {
    return t.replace(/\\\./g, '.')
  })
}
var es = le.util.get,
  Fi = le.util.set
function pu(e) {
  return Zn(e.aoData, '_aData')
}
function Xl(e) {
  ;((e.aoData.length = 0), (e.aiDisplayMaster.length = 0), (e.aiDisplay.length = 0), (e.aIds = {}))
}
function cl(e, t, r) {
  for (var n = -1, i = 0, s = e.length; i < s; i++) e[i] == t ? (n = i) : e[i] > t && e[i]--
  n != -1 && r === void 0 && e.splice(n, 1)
}
function ga(e, t, r, n) {
  var i = e.aoData[t],
    s,
    a,
    d = function (p, y) {
      for (; p.childNodes.length; ) p.removeChild(p.firstChild)
      p.innerHTML = er(e, t, y, 'display')
    }
  if (r === 'dom' || ((!r || r === 'auto') && i.src === 'dom'))
    i._aData = Wu(e, i, n, n === void 0 ? void 0 : i._aData).data
  else {
    var f = i.anCells
    if (f)
      if (n !== void 0) d(f[n], n)
      else for (s = 0, a = f.length; s < a; s++) d(f[s], s)
  }
  ;((i._aSortData = null), (i._aFilterData = null))
  var g = e.aoColumns
  if (n !== void 0) g[n].sType = null
  else {
    for (s = 0, a = g.length; s < a; s++) g[s].sType = null
    zu(e, i)
  }
}
function Wu(e, t, r, n) {
  var i = [],
    s = t.firstChild,
    a,
    d,
    f = 0,
    g,
    p = e.aoColumns,
    y = e._rowReadObject
  n = n !== void 0 ? n : y ? {} : []
  var _ = function (E, z) {
      if (typeof E == 'string') {
        var Y = E.indexOf('@')
        if (Y !== -1) {
          var ue = E.substring(Y + 1),
            ke = Fi(E)
          ke(n, z.getAttribute(ue))
        }
      }
    },
    C = function (E) {
      if (r === void 0 || r === f)
        if (((d = p[f]), (g = E.innerHTML.trim()), d && d._bAttrSrc)) {
          var z = Fi(d.mData._)
          ;(z(n, g), _(d.mData.sort, E), _(d.mData.type, E), _(d.mData.filter, E))
        } else y ? (d._setter || (d._setter = Fi(d.mData)), d._setter(n, g)) : (n[f] = g)
      f++
    }
  if (s)
    for (; s; ) ((a = s.nodeName.toUpperCase()), (a == 'TD' || a == 'TH') && (C(s), i.push(s)), (s = s.nextSibling))
  else {
    i = t.anCells
    for (var A = 0, k = i.length; A < k; A++) C(i[A])
  }
  var F = t.firstChild ? t : t.nTr
  if (F) {
    var N = F.getAttribute('id')
    N && Fi(e.rowId)(n, N)
  }
  return { data: n, cells: i }
}
function Vu(e, t, r, n) {
  var i = e.aoData[t],
    s = i._aData,
    a = [],
    d,
    f,
    g,
    p,
    y,
    _
  if (i.nTr === null) {
    for (
      d = r || document.createElement('tr'),
        i.nTr = d,
        i.anCells = a,
        d._DT_RowIndex = t,
        zu(e, i),
        p = 0,
        y = e.aoColumns.length;
      p < y;
      p++
    )
      ((g = e.aoColumns[p]),
        (_ = !r),
        (f = _ ? document.createElement(g.sCellType) : n[p]),
        f || vr(e, 0, 'Incorrect column count', 18),
        (f._DT_CellIndex = { row: t, column: p }),
        a.push(f),
        (_ || ((g.mRender || g.mData !== p) && (!P.isPlainObject(g.mData) || g.mData._ !== p + '.display'))) &&
          (f.innerHTML = er(e, t, p, 'display')),
        g.sClass && (f.className += ' ' + g.sClass),
        g.bVisible && !r ? d.appendChild(f) : !g.bVisible && r && f.parentNode.removeChild(f),
        g.fnCreatedCell && g.fnCreatedCell.call(e.oInstance, f, er(e, t, p), s, t, p))
    Et(e, 'aoRowCreatedCallback', null, [d, s, t, a])
  }
}
function zu(e, t) {
  var r = t.nTr,
    n = t._aData
  if (r) {
    var i = e.rowIdFn(n)
    if ((i && (r.id = i), n.DT_RowClass)) {
      var s = n.DT_RowClass.split(' ')
      ;((t.__rowc = t.__rowc ? Vl(t.__rowc.concat(s)) : s),
        P(r).removeClass(t.__rowc.join(' ')).addClass(n.DT_RowClass))
    }
    ;(n.DT_RowAttr && P(r).attr(n.DT_RowAttr), n.DT_RowData && P(r).data(n.DT_RowData))
  }
}
function tm(e) {
  var t,
    r,
    n,
    i,
    s,
    a = e.nTHead,
    d = e.nTFoot,
    f = P('th, td', a).length === 0,
    g = e.oClasses,
    p = e.aoColumns
  for (f && (i = P('<tr/>').appendTo(a)), t = 0, r = p.length; t < r; t++)
    ((s = p[t]),
      (n = P(s.nTh).addClass(s.sClass)),
      f && n.appendTo(i),
      e.oFeatures.bSort &&
        (n.addClass(s.sSortingClass),
        s.bSortable !== !1 && (n.attr('tabindex', e.iTabIndex).attr('aria-controls', e.sTableId), Qu(e, s.nTh, t))),
      s.sTitle != n[0].innerHTML && n.html(s.sTitle),
      td(e, 'header')(e, n, s, g))
  if (
    (f && oa(e.aoHeader, a),
    P(a).children('tr').children('th, td').addClass(g.sHeaderTH),
    P(d).children('tr').children('th, td').addClass(g.sFooterTH),
    d !== null)
  ) {
    var y = e.aoFooter[0]
    for (t = 0, r = y.length; t < r; t++)
      ((s = p[t]),
        s ? ((s.nTf = y[t].cell), s.sClass && P(s.nTf).addClass(s.sClass)) : vr(e, 0, 'Incorrect column count', 18))
  }
}
function ia(e, t, r) {
  var n,
    i,
    s,
    a,
    d,
    f,
    g,
    p = [],
    y = [],
    _ = e.aoColumns.length,
    C,
    A
  if (t) {
    for (r === void 0 && (r = !1), n = 0, i = t.length; n < i; n++) {
      for (p[n] = t[n].slice(), p[n].nTr = t[n].nTr, s = _ - 1; s >= 0; s--)
        !e.aoColumns[s].bVisible && !r && p[n].splice(s, 1)
      y.push([])
    }
    for (n = 0, i = p.length; n < i; n++) {
      if (((g = p[n].nTr), g)) for (; (f = g.firstChild); ) g.removeChild(f)
      for (s = 0, a = p[n].length; s < a; s++)
        if (((C = 1), (A = 1), y[n][s] === void 0)) {
          for (g.appendChild(p[n][s].cell), y[n][s] = 1; p[n + C] !== void 0 && p[n][s].cell == p[n + C][s].cell; )
            ((y[n + C][s] = 1), C++)
          for (; p[n][s + A] !== void 0 && p[n][s].cell == p[n][s + A].cell; ) {
            for (d = 0; d < C; d++) y[n + d][s + A] = 1
            A++
          }
          P(p[n][s].cell).attr('rowspan', C).attr('colspan', A)
        }
    }
  }
}
function Wi(e, t) {
  Dw(e)
  var r = Et(e, 'aoPreDrawCallback', 'preDraw', [e])
  if (P.inArray(!1, r) !== -1) {
    lr(e, !1)
    return
  }
  var n = [],
    i = 0,
    s = e.asStripeClasses,
    a = s.length,
    d = e.oLanguage,
    f = Pn(e) == 'ssp',
    g = e.aiDisplay,
    p = e._iDisplayStart,
    y = e.fnDisplayEnd()
  if (((e.bDrawing = !0), e.bDeferLoading)) ((e.bDeferLoading = !1), e.iDraw++, lr(e, !1))
  else if (!f) e.iDraw++
  else if (!e.bDestroying && !t) {
    rm(e)
    return
  }
  if (g.length !== 0)
    for (var _ = f ? 0 : p, C = f ? e.aoData.length : y, A = _; A < C; A++) {
      var k = g[A],
        F = e.aoData[k]
      F.nTr === null && Vu(e, k)
      var N = F.nTr
      if (a !== 0) {
        var E = s[i % a]
        F._sRowStripe != E && (P(N).removeClass(F._sRowStripe).addClass(E), (F._sRowStripe = E))
      }
      ;(Et(e, 'aoRowCallback', null, [N, F._aData, i, A, k]), n.push(N), i++)
    }
  else {
    var z = d.sZeroRecords
    ;(e.iDraw == 1 && Pn(e) == 'ajax'
      ? (z = d.sLoadingRecords)
      : d.sEmptyTable && e.fnRecordsTotal() === 0 && (z = d.sEmptyTable),
      (n[0] = P('<tr/>', { class: a ? s[0] : '' }).append(
        P('<td />', { valign: 'top', colSpan: is(e), class: e.oClasses.sRowEmpty }).html(z)
      )[0]))
  }
  ;(Et(e, 'aoHeaderCallback', 'header', [P(e.nTHead).children('tr')[0], pu(e), p, y, g]),
    Et(e, 'aoFooterCallback', 'footer', [P(e.nTFoot).children('tr')[0], pu(e), p, y, g]))
  var Y = P(e.nTBody)
  ;(Y.children().detach(),
    Y.append(P(n)),
    Et(e, 'aoDrawCallback', 'draw', [e]),
    (e.bSorted = !1),
    (e.bFiltered = !1),
    (e.bDrawing = !1))
}
function go(e, t) {
  var r = e.oFeatures,
    n = r.bSort,
    i = r.bFilter
  ;(n && wm(e),
    i ? ya(e, e.oPreviousSearch) : (e.aiDisplay = e.aiDisplayMaster.slice()),
    t !== !0 && (e._iDisplayStart = 0),
    (e._drawHold = t),
    Wi(e),
    (e._drawHold = !1))
}
function nm(e) {
  var t = e.oClasses,
    r = P(e.nTable),
    n = P('<div/>').insertBefore(r),
    i = e.oFeatures,
    s = P('<div/>', { id: e.sTableId + '_wrapper', class: t.sWrapper + (e.nTFoot ? '' : ' ' + t.sNoFooter) })
  ;((e.nHolding = n[0]), (e.nTableWrapper = s[0]), (e.nTableReinsertBefore = e.nTable.nextSibling))
  for (var a = e.sDom.split(''), d, f, g, p, y, _, C = 0; C < a.length; C++) {
    if (((d = null), (f = a[C]), f == '<')) {
      if (((g = P('<div/>')[0]), (p = a[C + 1]), p == "'" || p == '"')) {
        for (y = '', _ = 2; a[C + _] != p; ) ((y += a[C + _]), _++)
        if ((y == 'H' ? (y = t.sJUIHeader) : y == 'F' && (y = t.sJUIFooter), y.indexOf('.') != -1)) {
          var A = y.split('.')
          ;((g.id = A[0].substr(1, A[0].length - 1)), (g.className = A[1]))
        } else y.charAt(0) == '#' ? (g.id = y.substr(1, y.length - 1)) : (g.className = y)
        C += _
      }
      ;(s.append(g), (s = P(g)))
    } else if (f == '>') s = s.parent()
    else if (f == 'l' && i.bPaginate && i.bLengthChange) d = pm(e)
    else if (f == 'f' && i.bFilter) d = sm(e)
    else if (f == 'r' && i.bProcessing) d = vm(e)
    else if (f == 't') d = gm(e)
    else if (f == 'i' && i.bInfo) d = dm(e)
    else if (f == 'p' && i.bPaginate) d = mm(e)
    else if (le.ext.feature.length !== 0) {
      for (var k = le.ext.feature, F = 0, N = k.length; F < N; F++)
        if (f == k[F].cFeature) {
          d = k[F].fnInit(e)
          break
        }
    }
    if (d) {
      var E = e.aanFeatures
      ;(E[f] || (E[f] = []), E[f].push(d), s.append(d))
    }
  }
  ;(n.replaceWith(s), (e.nHolding = null))
}
function oa(e, t) {
  var r = P(t).children('tr'),
    n,
    i,
    s,
    a,
    d,
    f,
    g,
    p,
    y,
    _,
    C,
    A = function (k, F, N) {
      for (var E = k[F]; E[N]; ) N++
      return N
    }
  for (e.splice(0, e.length), s = 0, f = r.length; s < f; s++) e.push([])
  for (s = 0, f = r.length; s < f; s++)
    for (n = r[s], p = 0, i = n.firstChild; i; ) {
      if (i.nodeName.toUpperCase() == 'TD' || i.nodeName.toUpperCase() == 'TH')
        for (
          y = i.getAttribute('colspan') * 1,
            _ = i.getAttribute('rowspan') * 1,
            y = !y || y === 0 || y === 1 ? 1 : y,
            _ = !_ || _ === 0 || _ === 1 ? 1 : _,
            g = A(e, s, p),
            C = y === 1,
            d = 0;
          d < y;
          d++
        )
          for (a = 0; a < _; a++) ((e[s + a][g + d] = { cell: i, unique: C }), (e[s + a].nTr = n))
      i = i.nextSibling
    }
}
function Gl(e, t, r) {
  var n = []
  r || ((r = e.aoHeader), t && ((r = []), oa(r, t)))
  for (var i = 0, s = r.length; i < s; i++)
    for (var a = 0, d = r[i].length; a < d; a++) r[i][a].unique && (!n[a] || !e.bSortCellsTop) && (n[a] = r[i][a].cell)
  return n
}
function Dw(e) {
  var t = Pn(e) == 'ssp',
    r = e.iInitDisplayStart
  r !== void 0 &&
    r !== -1 &&
    ((e._iDisplayStart = t ? r : r >= e.fnRecordsDisplay() ? 0 : r), (e.iInitDisplayStart = -1))
}
function Jl(e, t, r) {
  if ((Et(e, 'aoServerParams', 'serverParams', [t]), t && Array.isArray(t))) {
    var n = {},
      i = /(.*?)\[\]$/
    ;(P.each(t, function (y, _) {
      var C = _.name.match(i)
      if (C) {
        var A = C[0]
        ;(n[A] || (n[A] = []), n[A].push(_.value))
      } else n[_.name] = _.value
    }),
      (t = n))
  }
  var s,
    a = e.ajax,
    d = e.oInstance,
    f = function (y) {
      var _ = e.jqXHR ? e.jqXHR.status : null
      ;(y === null || (typeof _ == 'number' && _ == 204)) && ((y = {}), ba(e, y, []))
      var C = y.error || y.sError
      ;(C && vr(e, 0, C), (e.json = y), Et(e, null, 'xhr', [e, y, e.jqXHR]), r(y))
    }
  if (P.isPlainObject(a) && a.data) {
    s = a.data
    var g = typeof s == 'function' ? s(t, e) : s
    ;((t = typeof s == 'function' && g ? g : P.extend(!0, t, g)), delete a.data)
  }
  var p = {
    data: t,
    success: f,
    dataType: 'json',
    cache: !1,
    type: e.sServerMethod,
    error: function (y, _, C) {
      var A = Et(e, null, 'xhr', [e, null, e.jqXHR])
      ;(P.inArray(!0, A) === -1 &&
        (_ == 'parsererror' ? vr(e, 0, 'Invalid JSON response', 1) : y.readyState === 4 && vr(e, 0, 'Ajax error', 7)),
        lr(e, !1))
    }
  }
  ;((e.oAjaxData = t),
    Et(e, null, 'preXhr', [e, t]),
    e.fnServerData
      ? e.fnServerData.call(
          d,
          e.sAjaxSource,
          P.map(t, function (y, _) {
            return { name: _, value: y }
          }),
          f,
          e
        )
      : e.sAjaxSource || typeof a == 'string'
        ? (e.jqXHR = P.ajax(P.extend(p, { url: a || e.sAjaxSource })))
        : typeof a == 'function'
          ? (e.jqXHR = a.call(d, t, f, e))
          : ((e.jqXHR = P.ajax(P.extend(p, a))), (a.data = s)))
}
function rm(e) {
  ;(e.iDraw++, lr(e, !0))
  var t = e._drawHold
  Jl(e, im(e), function (r) {
    ;((e._drawHold = t), om(e, r), (e._drawHold = !1))
  })
}
function im(e) {
  var t = e.aoColumns,
    r = t.length,
    n = e.oFeatures,
    i = e.oPreviousSearch,
    s = e.aoPreSearchCols,
    a,
    d = [],
    f,
    g,
    p,
    y = os(e),
    _ = e._iDisplayStart,
    C = n.bPaginate !== !1 ? e._iDisplayLength : -1,
    A = function (N, E) {
      d.push({ name: N, value: E })
    }
  ;(A('sEcho', e.iDraw),
    A('iColumns', r),
    A('sColumns', Zn(t, 'sName').join(',')),
    A('iDisplayStart', _),
    A('iDisplayLength', C))
  var k = { draw: e.iDraw, columns: [], order: [], start: _, length: C, search: { value: i.sSearch, regex: i.bRegex } }
  for (a = 0; a < r; a++)
    ((g = t[a]),
      (p = s[a]),
      (f = typeof g.mData == 'function' ? 'function' : g.mData),
      k.columns.push({
        data: f,
        name: g.sName,
        searchable: g.bSearchable,
        orderable: g.bSortable,
        search: { value: p.sSearch, regex: p.bRegex }
      }),
      A('mDataProp_' + a, f),
      n.bFilter && (A('sSearch_' + a, p.sSearch), A('bRegex_' + a, p.bRegex), A('bSearchable_' + a, g.bSearchable)),
      n.bSort && A('bSortable_' + a, g.bSortable))
  ;(n.bFilter && (A('sSearch', i.sSearch), A('bRegex', i.bRegex)),
    n.bSort &&
      (P.each(y, function (N, E) {
        ;(k.order.push({ column: E.col, dir: E.dir }), A('iSortCol_' + N, E.col), A('sSortDir_' + N, E.dir))
      }),
      A('iSortingCols', y.length)))
  var F = le.ext.legacy.ajax
  return F === null ? (e.sAjaxSource ? d : k) : F ? d : k
}
function om(e, t) {
  var r = function (g, p) {
      return t[g] !== void 0 ? t[g] : t[p]
    },
    n = ba(e, t),
    i = r('sEcho', 'draw'),
    s = r('iTotalRecords', 'recordsTotal'),
    a = r('iTotalDisplayRecords', 'recordsFiltered')
  if (i !== void 0) {
    if (i * 1 < e.iDraw) return
    e.iDraw = i * 1
  }
  ;(n || (n = []), Xl(e), (e._iRecordsTotal = parseInt(s, 10)), (e._iRecordsDisplay = parseInt(a, 10)))
  for (var d = 0, f = n.length; d < f; d++) Ui(e, n[d])
  ;((e.aiDisplay = e.aiDisplayMaster.slice()), Wi(e, !0), e._bInitComplete || Cl(e, t), lr(e, !1))
}
function ba(e, t, r) {
  var n = P.isPlainObject(e.ajax) && e.ajax.dataSrc !== void 0 ? e.ajax.dataSrc : e.sAjaxDataProp
  if (!r) return n === 'data' ? t.aaData || t[n] : n !== '' ? es(n)(t) : t
  Fi(n)(t, r)
}
function sm(e) {
  var t = e.oClasses,
    r = e.sTableId,
    n = e.oLanguage,
    i = e.oPreviousSearch,
    s = e.aanFeatures,
    a = '<input type="search" class="' + t.sFilterInput + '"/>',
    d = n.sSearch
  d = d.match(/_INPUT_/) ? d.replace('_INPUT_', a) : d + a
  var f = P('<div/>', { id: s.f ? null : r + '_filter', class: t.sFilter }).append(P('<label/>').append(d)),
    g = function (_) {
      s.f
      var C = this.value ? this.value : ''
      ;(i.return && _.key !== 'Enter') ||
        (C != i.sSearch &&
          (ya(e, {
            sSearch: C,
            bRegex: i.bRegex,
            bSmart: i.bSmart,
            bCaseInsensitive: i.bCaseInsensitive,
            return: i.return
          }),
          (e._iDisplayStart = 0),
          Wi(e)))
    },
    p = e.searchDelay !== null ? e.searchDelay : Pn(e) === 'ssp' ? 400 : 0,
    y = P('input', f)
      .val(i.sSearch)
      .attr('placeholder', n.sSearchPlaceholder)
      .on('keyup.DT search.DT input.DT paste.DT cut.DT', p ? Yu(g, p) : g)
      .on('mouseup.DT', function (_) {
        setTimeout(function () {
          g.call(y[0], _)
        }, 10)
      })
      .on('keypress.DT', function (_) {
        if (_.keyCode == 13) return !1
      })
      .attr('aria-controls', r)
  return (
    P(e.nTable).on('search.dt.DT', function (_, C) {
      if (e === C)
        try {
          y[0] !== document.activeElement && y.val(i.sSearch)
        } catch {}
    }),
    f[0]
  )
}
function ya(e, t, r) {
  var n = e.oPreviousSearch,
    i = e.aoPreSearchCols,
    s = function (f) {
      ;((n.sSearch = f.sSearch),
        (n.bRegex = f.bRegex),
        (n.bSmart = f.bSmart),
        (n.bCaseInsensitive = f.bCaseInsensitive),
        (n.return = f.return))
    },
    a = function (f) {
      return f.bEscapeRegex !== void 0 ? !f.bEscapeRegex : f.bRegex
    }
  if ((Uu(e), Pn(e) != 'ssp')) {
    ;(cm(e, t.sSearch, r, a(t), t.bSmart, t.bCaseInsensitive), s(t))
    for (var d = 0; d < i.length; d++) lm(e, i[d].sSearch, d, a(i[d]), i[d].bSmart, i[d].bCaseInsensitive)
    am(e)
  } else s(t)
  ;((e.bFiltered = !0), Et(e, null, 'search', [e]))
}
function am(e) {
  for (var t = le.ext.search, r = e.aiDisplay, n, i, s = 0, a = t.length; s < a; s++) {
    for (var d = [], f = 0, g = r.length; f < g; f++)
      ((i = r[f]), (n = e.aoData[i]), t[s](e, n._aFilterData, i, n._aData, f) && d.push(i))
    ;((r.length = 0), P.merge(r, d))
  }
}
function lm(e, t, r, n, i, s) {
  if (t !== '') {
    for (var a, d = [], f = e.aiDisplay, g = Ku(t, n, i, s), p = 0; p < f.length; p++)
      ((a = e.aoData[f[p]]._aFilterData[r]), g.test(a) && d.push(f[p]))
    e.aiDisplay = d
  }
}
function cm(e, t, r, n, i, s) {
  var a = Ku(t, n, i, s),
    d = e.oPreviousSearch.sSearch,
    f = e.aiDisplayMaster,
    g,
    p,
    y,
    _ = []
  if ((le.ext.search.length !== 0 && (r = !0), (p = um(e)), t.length <= 0)) e.aiDisplay = f.slice()
  else {
    for (
      (p || r || n || d.length > t.length || t.indexOf(d) !== 0 || e.bSorted) && (e.aiDisplay = f.slice()),
        g = e.aiDisplay,
        y = 0;
      y < g.length;
      y++
    )
      a.test(e.aoData[g[y]]._sFilterRow) && _.push(g[y])
    e.aiDisplay = _
  }
}
function Ku(e, t, r, n) {
  if (((e = t ? e : Xu(e)), r)) {
    var i = P.map(e.match(/["\u201C][^"\u201D]+["\u201D]|[^ ]+/g) || [''], function (s) {
      if (s.charAt(0) === '"') {
        var a = s.match(/^"(.*)"$/)
        s = a ? a[1] : s
      } else if (s.charAt(0) === '“') {
        var a = s.match(/^\u201C(.*)\u201D$/)
        s = a ? a[1] : s
      }
      return s.replace('"', '')
    })
    e = '^(?=.*?' + i.join(')(?=.*?') + ').*$'
  }
  return new RegExp(e, n ? 'i' : '')
}
var Xu = le.util.escapeRegex,
  ul = P('<div>')[0],
  kw = ul.textContent !== void 0
function um(e) {
  var t = e.aoColumns,
    r,
    n,
    i,
    s,
    a,
    d,
    f,
    g,
    p = !1
  for (n = 0, s = e.aoData.length; n < s; n++)
    if (((g = e.aoData[n]), !g._aFilterData)) {
      for (d = [], i = 0, a = t.length; i < a; i++)
        ((r = t[i]),
          r.bSearchable
            ? ((f = er(e, n, i, 'filter')),
              f === null && (f = ''),
              typeof f != 'string' && f.toString && (f = f.toString()))
            : (f = ''),
          f.indexOf && f.indexOf('&') !== -1 && ((ul.innerHTML = f), (f = kw ? ul.textContent : ul.innerText)),
          f.replace && (f = f.replace(/[\r\n\u2028]/g, '')),
          d.push(f))
      ;((g._aFilterData = d), (g._sFilterRow = d.join('  ')), (p = !0))
    }
  return p
}
function Yf(e) {
  return { search: e.sSearch, smart: e.bSmart, regex: e.bRegex, caseInsensitive: e.bCaseInsensitive }
}
function Qf(e) {
  return { sSearch: e.search, bSmart: e.smart, bRegex: e.regex, bCaseInsensitive: e.caseInsensitive }
}
function dm(e) {
  var t = e.sTableId,
    r = e.aanFeatures.i,
    n = P('<div/>', { class: e.oClasses.sInfo, id: r ? null : t + '_info' })
  return (
    r ||
      (e.aoDrawCallback.push({ fn: fm, sName: 'information' }),
      n.attr('role', 'status').attr('aria-live', 'polite'),
      P(e.nTable).attr('aria-describedby', t + '_info')),
    n[0]
  )
}
function fm(e) {
  var t = e.aanFeatures.i
  if (t.length !== 0) {
    var r = e.oLanguage,
      n = e._iDisplayStart + 1,
      i = e.fnDisplayEnd(),
      s = e.fnRecordsTotal(),
      a = e.fnRecordsDisplay(),
      d = a ? r.sInfo : r.sInfoEmpty
    ;(a !== s && (d += ' ' + r.sInfoFiltered), (d += r.sInfoPostFix), (d = hm(e, d)))
    var f = r.fnInfoCallback
    ;(f !== null && (d = f.call(e.oInstance, e, n, i, s, a, d)), P(t).html(d))
  }
}
function hm(e, t) {
  var r = e.fnFormatNumber,
    n = e._iDisplayStart + 1,
    i = e._iDisplayLength,
    s = e.fnRecordsDisplay(),
    a = i === -1
  return t
    .replace(/_START_/g, r.call(e, n))
    .replace(/_END_/g, r.call(e, e.fnDisplayEnd()))
    .replace(/_MAX_/g, r.call(e, e.fnRecordsTotal()))
    .replace(/_TOTAL_/g, r.call(e, s))
    .replace(/_PAGE_/g, r.call(e, a ? 1 : Math.ceil(n / i)))
    .replace(/_PAGES_/g, r.call(e, a ? 1 : Math.ceil(s / i)))
}
function zs(e) {
  var t,
    r,
    n = e.iInitDisplayStart,
    i = e.aoColumns,
    s,
    a = e.oFeatures,
    d = e.bDeferLoading
  if (!e.bInitialised) {
    setTimeout(function () {
      zs(e)
    }, 200)
    return
  }
  for (
    nm(e), tm(e), ia(e, e.aoHeader), ia(e, e.aoFooter), lr(e, !0), a.bAutoWidth && Ju(e), t = 0, r = i.length;
    t < r;
    t++
  )
    ((s = i[t]), s.sWidth && (s.nTh.style.width = en(s.sWidth)))
  ;(Et(e, null, 'preInit', [e]), go(e))
  var f = Pn(e)
  ;(f != 'ssp' || d) &&
    (f == 'ajax'
      ? Jl(e, [], function (g) {
          var p = ba(e, g)
          for (t = 0; t < p.length; t++) Ui(e, p[t])
          ;((e.iInitDisplayStart = n), go(e), lr(e, !1), Cl(e, g))
        })
      : (lr(e, !1), Cl(e)))
}
function Cl(e, t) {
  ;((e._bInitComplete = !0),
    (t || e.oInit.aaData) && pa(e),
    Et(e, null, 'plugin-init', [e, t]),
    Et(e, 'aoInitComplete', 'init', [e, t]))
}
function Gu(e, t) {
  var r = parseInt(t, 10)
  ;((e._iDisplayLength = r), ed(e), Et(e, null, 'length', [e, r]))
}
function pm(e) {
  for (
    var t = e.oClasses,
      r = e.sTableId,
      n = e.aLengthMenu,
      i = Array.isArray(n[0]),
      s = i ? n[0] : n,
      a = i ? n[1] : n,
      d = P('<select/>', { name: r + '_length', 'aria-controls': r, class: t.sLengthSelect }),
      f = 0,
      g = s.length;
    f < g;
    f++
  )
    d[0][f] = new Option(typeof a[f] == 'number' ? e.fnFormatNumber(a[f]) : a[f], s[f])
  var p = P('<div><label/></div>').addClass(t.sLength)
  return (
    e.aanFeatures.l || (p[0].id = r + '_length'),
    p.children().append(e.oLanguage.sLengthMenu.replace('_MENU_', d[0].outerHTML)),
    P('select', p)
      .val(e._iDisplayLength)
      .on('change.DT', function (y) {
        ;(Gu(e, P(this).val()), Wi(e))
      }),
    P(e.nTable).on('length.dt.DT', function (y, _, C) {
      e === _ && P('select', p).val(C)
    }),
    p[0]
  )
}
function mm(e) {
  var t = e.sPaginationType,
    r = le.ext.pager[t],
    n = typeof r == 'function',
    i = function (d) {
      Wi(d)
    },
    s = P('<div/>').addClass(e.oClasses.sPaging + t)[0],
    a = e.aanFeatures
  return (
    n || r.fnInit(e, s, i),
    a.p ||
      ((s.id = e.sTableId + '_paginate'),
      e.aoDrawCallback.push({
        fn: function (d) {
          if (n) {
            var f = d._iDisplayStart,
              g = d._iDisplayLength,
              p = d.fnRecordsDisplay(),
              y = g === -1,
              _ = y ? 0 : Math.ceil(f / g),
              C = y ? 1 : Math.ceil(p / g),
              A = r(_, C),
              k,
              F
            for (k = 0, F = a.p.length; k < F; k++) td(d, 'pageButton')(d, a.p[k], k, A, _, C)
          } else r.fnUpdate(d, i)
        },
        sName: 'pagination'
      })),
    s
  )
}
function Yl(e, t, r) {
  var n = e._iDisplayStart,
    i = e._iDisplayLength,
    s = e.fnRecordsDisplay()
  s === 0 || i === -1
    ? (n = 0)
    : typeof t == 'number'
      ? ((n = t * i), n > s && (n = 0))
      : t == 'first'
        ? (n = 0)
        : t == 'previous'
          ? ((n = i >= 0 ? n - i : 0), n < 0 && (n = 0))
          : t == 'next'
            ? n + i < s && (n += i)
            : t == 'last'
              ? (n = Math.floor((s - 1) / i) * i)
              : vr(e, 0, 'Unknown paging action: ' + t, 5)
  var a = e._iDisplayStart !== n
  return ((e._iDisplayStart = n), a ? (Et(e, null, 'page', [e]), r && Wi(e)) : Et(e, null, 'page-nc', [e]), a)
}
function vm(e) {
  return P('<div/>', {
    id: e.aanFeatures.r ? null : e.sTableId + '_processing',
    class: e.oClasses.sProcessing,
    role: 'status'
  })
    .html(e.oLanguage.sProcessing)
    .append('<div><div></div><div></div><div></div><div></div></div>')
    .insertBefore(e.nTable)[0]
}
function lr(e, t) {
  ;(e.oFeatures.bProcessing && P(e.aanFeatures.r).css('display', t ? 'block' : 'none'),
    Et(e, null, 'processing', [e, t]))
}
function gm(e) {
  var t = P(e.nTable),
    r = e.oScroll
  if (r.sX === '' && r.sY === '') return e.nTable
  var n = r.sX,
    i = r.sY,
    s = e.oClasses,
    a = t.children('caption'),
    d = a.length ? a[0]._captionSide : null,
    f = P(t[0].cloneNode(!1)),
    g = P(t[0].cloneNode(!1)),
    p = t.children('tfoot'),
    y = '<div/>',
    _ = function (E) {
      return E ? en(E) : null
    }
  p.length || (p = null)
  var C = P(y, { class: s.sScrollWrapper })
    .append(
      P(y, { class: s.sScrollHead })
        .css({ overflow: 'hidden', position: 'relative', border: 0, width: n ? _(n) : '100%' })
        .append(
          P(y, { class: s.sScrollHeadInner })
            .css({ 'box-sizing': 'content-box', width: r.sXInner || '100%' })
            .append(
              f
                .removeAttr('id')
                .css('margin-left', 0)
                .append(d === 'top' ? a : null)
                .append(t.children('thead'))
            )
        )
    )
    .append(
      P(y, { class: s.sScrollBody })
        .css({ position: 'relative', overflow: 'auto', width: _(n) })
        .append(t)
    )
  p &&
    C.append(
      P(y, { class: s.sScrollFoot })
        .css({ overflow: 'hidden', border: 0, width: n ? _(n) : '100%' })
        .append(
          P(y, { class: s.sScrollFootInner }).append(
            g
              .removeAttr('id')
              .css('margin-left', 0)
              .append(d === 'bottom' ? a : null)
              .append(t.children('tfoot'))
          )
        )
    )
  var A = C.children(),
    k = A[0],
    F = A[1],
    N = p ? A[2] : null
  return (
    n &&
      P(F).on('scroll.DT', function (E) {
        var z = this.scrollLeft
        ;((k.scrollLeft = z), p && (N.scrollLeft = z))
      }),
    P(F).css('max-height', i),
    r.bCollapse || P(F).css('height', i),
    (e.nScrollHead = k),
    (e.nScrollBody = F),
    (e.nScrollFoot = N),
    e.aoDrawCallback.push({ fn: Ql, sName: 'scrolling' }),
    C[0]
  )
}
function Ql(e) {
  var t = e.oScroll,
    r = t.sX,
    n = t.sXInner,
    i = t.sY,
    s = t.iBarWidth,
    a = P(e.nScrollHead),
    d = a[0].style,
    f = a.children('div'),
    g = f[0].style,
    p = f.children('table'),
    y = e.nScrollBody,
    _ = P(y),
    C = y.style,
    A = P(e.nScrollFoot),
    k = A.children('div'),
    F = k.children('table'),
    N = P(e.nTHead),
    E = P(e.nTable),
    z = E[0],
    Y = z.style,
    ue = e.nTFoot ? P(e.nTFoot) : null,
    ke = e.oBrowser,
    m = ke.bScrollOversize
  Zn(e.aoColumns, 'nTh')
  var rt,
    Ne,
    fe,
    He,
    it,
    Pe,
    re = [],
    Ee = [],
    Me = [],
    Be = [],
    We,
    ht,
    At,
    Gt = function ($e) {
      var K = $e.style
      ;((K.paddingTop = '0'),
        (K.paddingBottom = '0'),
        (K.borderTopWidth = '0'),
        (K.borderBottomWidth = '0'),
        (K.height = 0))
    },
    Tt = y.scrollHeight > y.clientHeight
  if (e.scrollBarVis !== Tt && e.scrollBarVis !== void 0) {
    ;((e.scrollBarVis = Tt), pa(e))
    return
  } else e.scrollBarVis = Tt
  ;(E.children('thead, tfoot').remove(),
    ue &&
      ((Pe = ue.clone().prependTo(E)), (Ne = ue.find('tr')), (He = Pe.find('tr')), Pe.find('[id]').removeAttr('id')),
    (it = N.clone().prependTo(E)),
    (rt = N.find('tr')),
    (fe = it.find('tr')),
    it.find('th, td').removeAttr('tabindex'),
    it.find('[id]').removeAttr('id'),
    r || ((C.width = '100%'), (a[0].style.width = '100%')),
    P.each(Gl(e, it), function ($e, K) {
      ;((We = ma(e, $e)), (K.style.width = e.aoColumns[We].sWidth))
    }),
    ue &&
      Nr(function ($e) {
        $e.style.width = ''
      }, He),
    (At = E.outerWidth()),
    r === ''
      ? ((Y.width = '100%'),
        m &&
          (E.find('tbody').height() > y.offsetHeight || _.css('overflow-y') == 'scroll') &&
          (Y.width = en(E.outerWidth() - s)),
        (At = E.outerWidth()))
      : n !== '' && ((Y.width = en(n)), (At = E.outerWidth())),
    Nr(Gt, fe),
    Nr(function ($e) {
      var K = window.getComputedStyle ? window.getComputedStyle($e).width : en(P($e).width())
      ;(Me.push($e.innerHTML), re.push(K))
    }, fe),
    Nr(function ($e, K) {
      $e.style.width = re[K]
    }, rt),
    P(fe).css('height', 0),
    ue &&
      (Nr(Gt, He),
      Nr(function ($e) {
        ;(Be.push($e.innerHTML), Ee.push(en(P($e).css('width'))))
      }, He),
      Nr(function ($e, K) {
        $e.style.width = Ee[K]
      }, Ne),
      P(He).height(0)),
    Nr(function ($e, K) {
      ;(($e.innerHTML = '<div class="dataTables_sizing">' + Me[K] + '</div>'),
        ($e.childNodes[0].style.height = '0'),
        ($e.childNodes[0].style.overflow = 'hidden'),
        ($e.style.width = re[K]))
    }, fe),
    ue &&
      Nr(function ($e, K) {
        ;(($e.innerHTML = '<div class="dataTables_sizing">' + Be[K] + '</div>'),
          ($e.childNodes[0].style.height = '0'),
          ($e.childNodes[0].style.overflow = 'hidden'),
          ($e.style.width = Ee[K]))
      }, He),
    Math.round(E.outerWidth()) < Math.round(At)
      ? ((ht = y.scrollHeight > y.offsetHeight || _.css('overflow-y') == 'scroll' ? At + s : At),
        m && (y.scrollHeight > y.offsetHeight || _.css('overflow-y') == 'scroll') && (Y.width = en(ht - s)),
        (r === '' || n !== '') && vr(e, 1, 'Possible column misalignment', 6))
      : (ht = '100%'),
    (C.width = en(ht)),
    (d.width = en(ht)),
    ue && (e.nScrollFoot.style.width = en(ht)),
    i || (m && (C.height = en(z.offsetHeight + s))))
  var rn = E.outerWidth()
  ;((p[0].style.width = en(rn)), (g.width = en(rn)))
  var _e = E.height() > y.clientHeight || _.css('overflow-y') == 'scroll',
    Ke = 'padding' + (ke.bScrollbarLeft ? 'Left' : 'Right')
  ;((g[Ke] = _e ? s + 'px' : '0px'),
    ue && ((F[0].style.width = en(rn)), (k[0].style.width = en(rn)), (k[0].style[Ke] = _e ? s + 'px' : '0px')),
    E.children('colgroup').insertBefore(E.children('thead')),
    _.trigger('scroll'),
    (e.bSorted || e.bFiltered) && !e._drawHold && (y.scrollTop = 0))
}
function Nr(e, t, r) {
  for (var n = 0, i = 0, s = t.length, a, d; i < s; ) {
    for (a = t[i].firstChild, d = r ? r[i].firstChild : null; a; )
      (a.nodeType === 1 && (r ? e(a, d, n) : e(a, n), n++), (a = a.nextSibling), (d = r ? d.nextSibling : null))
    i++
  }
}
var Ew = /<.*?>/g
function Ju(e) {
  var t = e.nTable,
    r = e.aoColumns,
    n = e.oScroll,
    i = n.sY,
    s = n.sX,
    a = n.sXInner,
    d = r.length,
    f = zl(e, 'bVisible'),
    g = P('th', e.nTHead),
    p = t.getAttribute('width'),
    y = t.parentNode,
    _ = !1,
    C,
    A,
    k,
    F = e.oBrowser,
    N = F.bScrollOversize,
    E = t.style.width
  E && E.indexOf('%') !== -1 && (p = E)
  var z = bm(Zn(r, 'sWidthOrig'), y)
  for (C = 0; C < f.length; C++) ((A = r[f[C]]), A.sWidth !== null && ((A.sWidth = z[C]), (_ = !0)))
  if (N || (!_ && !s && !i && d == is(e) && d == g.length))
    for (C = 0; C < d; C++) {
      var Y = ma(e, C)
      Y !== null && (r[Y].sWidth = en(g.eq(C).width()))
    }
  else {
    var ue = P(t).clone().css('visibility', 'hidden').removeAttr('id')
    ue.find('tbody tr').remove()
    var ke = P('<tr/>').appendTo(ue.find('tbody'))
    for (
      ue.find('thead, tfoot').remove(),
        ue.append(P(e.nTHead).clone()).append(P(e.nTFoot).clone()),
        ue.find('tfoot th, tfoot td').css('width', ''),
        g = Gl(e, ue.find('thead')[0]),
        C = 0;
      C < f.length;
      C++
    )
      ((A = r[f[C]]),
        (g[C].style.width = A.sWidthOrig !== null && A.sWidthOrig !== '' ? en(A.sWidthOrig) : ''),
        A.sWidthOrig &&
          s &&
          P(g[C]).append(P('<div/>').css({ width: A.sWidthOrig, margin: 0, padding: 0, border: 0, height: 1 })))
    if (e.aoData.length)
      for (C = 0; C < f.length; C++)
        ((k = f[C]), (A = r[k]), P(ym(e, k)).clone(!1).append(A.sContentPadding).appendTo(ke))
    P('[name]', ue).removeAttr('name')
    var m = P('<div/>')
      .css(s || i ? { position: 'absolute', top: 0, left: 0, height: 1, right: 0, overflow: 'hidden' } : {})
      .append(ue)
      .appendTo(y)
    s && a
      ? ue.width(a)
      : s
        ? (ue.css('width', 'auto'), ue.removeAttr('width'), ue.width() < y.clientWidth && p && ue.width(y.clientWidth))
        : i
          ? ue.width(y.clientWidth)
          : p && ue.width(p)
    var rt = 0
    for (C = 0; C < f.length; C++) {
      var Ne = P(g[C]),
        fe = Ne.outerWidth() - Ne.width(),
        He = F.bBounding ? Math.ceil(g[C].getBoundingClientRect().width) : Ne.outerWidth()
      ;((rt += He), (r[f[C]].sWidth = en(He - fe)))
    }
    ;((t.style.width = en(rt)), m.remove())
  }
  if ((p && (t.style.width = en(p)), (p || s) && !e._reszEvt)) {
    var it = function () {
      P(window).on(
        'resize.DT-' + e.sInstance,
        Yu(function () {
          pa(e)
        })
      )
    }
    ;(N ? setTimeout(it, 1e3) : it(), (e._reszEvt = !0))
  }
}
var Yu = le.util.throttle
function bm(e, t) {
  for (var r = [], n = [], i = 0; i < e.length; i++)
    e[i]
      ? r.push(
          P('<div/>')
            .css('width', en(e[i]))
            .appendTo(t || document.body)
        )
      : r.push(null)
  for (var i = 0; i < e.length; i++) n.push(r[i] ? r[i][0].offsetWidth : null)
  return (P(r).remove(), n)
}
function ym(e, t) {
  var r = _m(e, t)
  if (r < 0) return null
  var n = e.aoData[r]
  return n.nTr ? n.anCells[t] : P('<td/>').html(er(e, r, t, 'display'))[0]
}
function _m(e, t) {
  for (var r, n = -1, i = -1, s = 0, a = e.aoData.length; s < a; s++)
    ((r = er(e, s, t, 'display') + ''),
      (r = r.replace(Ew, '')),
      (r = r.replace(/&nbsp;/g, ' ')),
      r.length > n && ((n = r.length), (i = s)))
  return i
}
function en(e) {
  return e === null ? '0px' : typeof e == 'number' ? (e < 0 ? '0px' : e + 'px') : e.match(/\d$/) ? e + 'px' : e
}
function os(e) {
  var t,
    r,
    n,
    i = [],
    s = e.aoColumns,
    a,
    d,
    f,
    g,
    p = e.aaSortingFixed,
    y = P.isPlainObject(p),
    _ = [],
    C = function (A) {
      A.length && !Array.isArray(A[0]) ? _.push(A) : P.merge(_, A)
    }
  for (
    Array.isArray(p) && C(p), y && p.pre && C(p.pre), C(e.aaSorting), y && p.post && C(p.post), t = 0;
    t < _.length;
    t++
  )
    for (g = _[t][0], a = s[g].aDataSort, r = 0, n = a.length; r < n; r++)
      ((d = a[r]),
        (f = s[d].sType || 'string'),
        _[t]._idx === void 0 && (_[t]._idx = P.inArray(_[t][1], s[d].asSorting)),
        i.push({ src: g, col: d, dir: _[t][1], index: _[t]._idx, type: f, formatter: le.ext.type.order[f + '-pre'] }))
  return i
}
function wm(e) {
  var t,
    r,
    n,
    i = [],
    s = le.ext.type.order,
    a = e.aoData
  e.aoColumns
  var d = 0,
    f,
    g = e.aiDisplayMaster,
    p
  for (Uu(e), p = os(e), t = 0, r = p.length; t < r; t++) ((f = p[t]), f.formatter && d++, Sm(e, f.col))
  if (Pn(e) != 'ssp' && p.length !== 0) {
    for (t = 0, n = g.length; t < n; t++) i[g[t]] = t
    d === p.length
      ? g.sort(function (y, _) {
          var C,
            A,
            k,
            F,
            N,
            E = p.length,
            z = a[y]._aSortData,
            Y = a[_]._aSortData
          for (k = 0; k < E; k++)
            if (((N = p[k]), (C = z[N.col]), (A = Y[N.col]), (F = C < A ? -1 : C > A ? 1 : 0), F !== 0))
              return N.dir === 'asc' ? F : -F
          return ((C = i[y]), (A = i[_]), C < A ? -1 : C > A ? 1 : 0)
        })
      : g.sort(function (y, _) {
          var C,
            A,
            k,
            F,
            N,
            E,
            z = p.length,
            Y = a[y]._aSortData,
            ue = a[_]._aSortData
          for (k = 0; k < z; k++)
            if (
              ((N = p[k]),
              (C = Y[N.col]),
              (A = ue[N.col]),
              (E = s[N.type + '-' + N.dir] || s['string-' + N.dir]),
              (F = E(C, A)),
              F !== 0)
            )
              return F
          return ((C = i[y]), (A = i[_]), C < A ? -1 : C > A ? 1 : 0)
        })
  }
  e.bSorted = !0
}
function xm(e) {
  for (var t, r, n = e.aoColumns, i = os(e), s = e.oLanguage.oAria, a = 0, d = n.length; a < d; a++) {
    var f = n[a],
      g = f.asSorting,
      p = f.ariaTitle || f.sTitle.replace(/<.*?>/g, ''),
      y = f.nTh
    ;(y.removeAttribute('aria-sort'),
      f.bSortable
        ? (i.length > 0 && i[0].col == a
            ? (y.setAttribute('aria-sort', i[0].dir == 'asc' ? 'ascending' : 'descending'),
              (r = g[i[0].index + 1] || g[0]))
            : (r = g[0]),
          (t = p + (r === 'asc' ? s.sSortAscending : s.sSortDescending)))
        : (t = p),
      y.setAttribute('aria-label', t))
  }
}
function mu(e, t, r, n) {
  var i = e.aoColumns[t],
    s = e.aaSorting,
    a = i.asSorting,
    d,
    f = function (p, y) {
      var _ = p._idx
      return (_ === void 0 && (_ = P.inArray(p[1], a)), _ + 1 < a.length ? _ + 1 : y ? null : 0)
    }
  if ((typeof s[0] == 'number' && (s = e.aaSorting = [s]), r && e.oFeatures.bSortMulti)) {
    var g = P.inArray(t, Zn(s, '0'))
    g !== -1
      ? ((d = f(s[g], !0)),
        d === null && s.length === 1 && (d = 0),
        d === null ? s.splice(g, 1) : ((s[g][1] = a[d]), (s[g]._idx = d)))
      : (s.push([t, a[0], 0]), (s[s.length - 1]._idx = 0))
  } else
    s.length && s[0][0] == t
      ? ((d = f(s[0])), (s.length = 1), (s[0][1] = a[d]), (s[0]._idx = d))
      : ((s.length = 0), s.push([t, a[0]]), (s[0]._idx = 0))
  ;(go(e), typeof n == 'function' && n(e))
}
function Qu(e, t, r, n) {
  var i = e.aoColumns[r]
  Zu(t, {}, function (s) {
    i.bSortable !== !1 &&
      (e.oFeatures.bProcessing
        ? (lr(e, !0),
          setTimeout(function () {
            ;(mu(e, r, s.shiftKey, n), Pn(e) !== 'ssp' && lr(e, !1))
          }, 0))
        : mu(e, r, s.shiftKey, n))
  })
}
function Tl(e) {
  var t = e.aLastSort,
    r = e.oClasses.sSortColumn,
    n = os(e),
    i = e.oFeatures,
    s,
    a,
    d
  if (i.bSort && i.bSortClasses) {
    for (s = 0, a = t.length; s < a; s++)
      ((d = t[s].src), P(Zn(e.aoData, 'anCells', d)).removeClass(r + (s < 2 ? s + 1 : 3)))
    for (s = 0, a = n.length; s < a; s++)
      ((d = n[s].src), P(Zn(e.aoData, 'anCells', d)).addClass(r + (s < 2 ? s + 1 : 3)))
  }
  e.aLastSort = n
}
function Sm(e, t) {
  var r = e.aoColumns[t],
    n = le.ext.order[r.sSortDataType],
    i
  n && (i = n.call(e.oInstance, e, t, va(e, t)))
  for (var s, a, d = le.ext.type.order[r.sType + '-pre'], f = 0, g = e.aoData.length; f < g; f++)
    ((s = e.aoData[f]),
      s._aSortData || (s._aSortData = []),
      (!s._aSortData[t] || n) && ((a = n ? i[f] : er(e, f, t, 'sort')), (s._aSortData[t] = d ? d(a) : a)))
}
function _a(e) {
  if (!e._bLoadingState) {
    var t = {
      time: +new Date(),
      start: e._iDisplayStart,
      length: e._iDisplayLength,
      order: P.extend(!0, [], e.aaSorting),
      search: Yf(e.oPreviousSearch),
      columns: P.map(e.aoColumns, function (r, n) {
        return { visible: r.bVisible, search: Yf(e.aoPreSearchCols[n]) }
      })
    }
    ;((e.oSavedState = t),
      Et(e, 'aoStateSaveParams', 'stateSaveParams', [e, t]),
      e.oFeatures.bStateSave && !e.bDestroying && e.fnStateSaveCallback.call(e.oInstance, e, t))
  }
}
function Cm(e, t, r) {
  if (!e.oFeatures.bStateSave) {
    r()
    return
  }
  var n = function (s) {
      vu(e, s, r)
    },
    i = e.fnStateLoadCallback.call(e.oInstance, e, n)
  return (i !== void 0 && vu(e, i, r), !0)
}
function vu(e, t, r) {
  var n,
    i,
    s = e.aoColumns
  e._bLoadingState = !0
  var a = e._bInitComplete ? new le.Api(e) : null
  if (!t || !t.time) {
    ;((e._bLoadingState = !1), r())
    return
  }
  var d = Et(e, 'aoStateLoadParams', 'stateLoadParams', [e, t])
  if (P.inArray(!1, d) !== -1) {
    ;((e._bLoadingState = !1), r())
    return
  }
  var f = e.iStateDuration
  if (f > 0 && t.time < +new Date() - f * 1e3) {
    ;((e._bLoadingState = !1), r())
    return
  }
  if (t.columns && s.length !== t.columns.length) {
    ;((e._bLoadingState = !1), r())
    return
  }
  if (
    ((e.oLoadedState = P.extend(!0, {}, t)),
    t.length !== void 0 && (a ? a.page.len(t.length) : (e._iDisplayLength = t.length)),
    t.start !== void 0 &&
      (a === null
        ? ((e._iDisplayStart = t.start), (e.iInitDisplayStart = t.start))
        : Yl(e, t.start / e._iDisplayLength)),
    t.order !== void 0 &&
      ((e.aaSorting = []),
      P.each(t.order, function (p, y) {
        e.aaSorting.push(y[0] >= s.length ? [0, y[1]] : y)
      })),
    t.search !== void 0 && P.extend(e.oPreviousSearch, Qf(t.search)),
    t.columns)
  ) {
    for (n = 0, i = t.columns.length; n < i; n++) {
      var g = t.columns[n]
      ;(g.visible !== void 0 && (a ? a.column(n).visible(g.visible, !1) : (s[n].bVisible = g.visible)),
        g.search !== void 0 && P.extend(e.aoPreSearchCols[n], Qf(g.search)))
    }
    a && a.columns.adjust()
  }
  ;((e._bLoadingState = !1), Et(e, 'aoStateLoaded', 'stateLoaded', [e, t]), r())
}
function Al(e) {
  var t = le.settings,
    r = P.inArray(e, Zn(t, 'nTable'))
  return r !== -1 ? t[r] : null
}
function vr(e, t, r, n) {
  if (
    ((r = 'DataTables warning: ' + (e ? 'table id=' + e.sTableId + ' - ' : '') + r),
    n && (r += '. For more information about this error, please see https://datatables.net/tn/' + n),
    t)
  )
    window.console && console.log && console.log(r)
  else {
    var i = le.ext,
      s = i.sErrMode || i.errMode
    if ((e && Et(e, null, 'error', [e, n, r]), s == 'alert')) alert(r)
    else {
      if (s == 'throw') throw new Error(r)
      typeof s == 'function' && s(e, n, r)
    }
  }
}
function Sr(e, t, r, n) {
  if (Array.isArray(r)) {
    P.each(r, function (i, s) {
      Array.isArray(s) ? Sr(e, t, s[0], s[1]) : Sr(e, t, s)
    })
    return
  }
  ;(n === void 0 && (n = r), t[r] !== void 0 && (e[n] = t[r]))
}
function gu(e, t, r) {
  var n
  for (var i in t)
    t.hasOwnProperty(i) &&
      ((n = t[i]),
      P.isPlainObject(n)
        ? (P.isPlainObject(e[i]) || (e[i] = {}), P.extend(!0, e[i], n))
        : r && i !== 'data' && i !== 'aaData' && Array.isArray(n)
          ? (e[i] = n.slice())
          : (e[i] = n))
  return e
}
function Zu(e, t, r) {
  P(e)
    .on('click.DT', t, function (n) {
      ;(P(e).trigger('blur'), r(n))
    })
    .on('keypress.DT', t, function (n) {
      n.which === 13 && (n.preventDefault(), r(n))
    })
    .on('selectstart.DT', function () {
      return !1
    })
}
function $n(e, t, r, n) {
  r && e[t].push({ fn: r, sName: n })
}
function Et(e, t, r, n) {
  var i = []
  if (
    (t &&
      (i = P.map(e[t].slice().reverse(), function (d, f) {
        return d.fn.apply(e.oInstance, n)
      })),
    r !== null)
  ) {
    var s = P.Event(r + '.dt'),
      a = P(e.nTable)
    ;(a.trigger(s, n), a.parents('body').length === 0 && P('body').trigger(s, n), i.push(s.result))
  }
  return i
}
function ed(e) {
  var t = e._iDisplayStart,
    r = e.fnDisplayEnd(),
    n = e._iDisplayLength
  ;(t >= r && (t = r - n), (t -= t % n), (n === -1 || t < 0) && (t = 0), (e._iDisplayStart = t))
}
function td(e, t) {
  var r = e.renderer,
    n = le.ext.renderer[t]
  return P.isPlainObject(r) && r[t] ? n[r[t]] || n._ : (typeof r == 'string' && n[r]) || n._
}
function Pn(e) {
  return e.oFeatures.bServerSide ? 'ssp' : e.ajax || e.sAjaxSource ? 'ajax' : 'dom'
}
var Tm = [],
  gn = Array.prototype,
  Ow = function (e) {
    var t,
      r,
      n = le.settings,
      i = P.map(n, function (s, a) {
        return s.nTable
      })
    if (e) {
      if (e.nTable && e.oApi) return [e]
      if (e.nodeName && e.nodeName.toLowerCase() === 'table') return ((t = P.inArray(e, i)), t !== -1 ? [n[t]] : null)
      if (e && typeof e.settings == 'function') return e.settings().toArray()
      typeof e == 'string' ? (r = P(e)) : e instanceof P && (r = e)
    } else return []
    if (r)
      return r
        .map(function (s) {
          return ((t = P.inArray(this, i)), t !== -1 ? n[t] : null)
        })
        .toArray()
  }
yt = function (e, t) {
  if (!(this instanceof yt)) return new yt(e, t)
  var r = [],
    n = function (a) {
      var d = Ow(a)
      d && r.push.apply(r, d)
    }
  if (Array.isArray(e)) for (var i = 0, s = e.length; i < s; i++) n(e[i])
  else n(e)
  ;((this.context = Vl(r)),
    t && P.merge(this, t),
    (this.selector = { rows: null, cols: null, opts: null }),
    yt.extend(this, this, Tm))
}
le.Api = yt
P.extend(yt.prototype, {
  any: function () {
    return this.count() !== 0
  },
  concat: gn.concat,
  context: [],
  count: function () {
    return this.flatten().length
  },
  each: function (e) {
    for (var t = 0, r = this.length; t < r; t++) e.call(this, this[t], t, this)
    return this
  },
  eq: function (e) {
    var t = this.context
    return t.length > e ? new yt(t[e], this[e]) : null
  },
  filter: function (e) {
    var t = []
    if (gn.filter) t = gn.filter.call(this, e, this)
    else for (var r = 0, n = this.length; r < n; r++) e.call(this, this[r], r, this) && t.push(this[r])
    return new yt(this.context, t)
  },
  flatten: function () {
    var e = []
    return new yt(this.context, e.concat.apply(e, this.toArray()))
  },
  join: gn.join,
  indexOf:
    gn.indexOf ||
    function (e, t) {
      for (var r = t || 0, n = this.length; r < n; r++) if (this[r] === e) return r
      return -1
    },
  iterator: function (e, t, r, n) {
    var i = [],
      s,
      a,
      d,
      f,
      g,
      p = this.context,
      y,
      _,
      C,
      A = this.selector
    for (typeof e == 'string' && ((n = r), (r = t), (t = e), (e = !1)), a = 0, d = p.length; a < d; a++) {
      var k = new yt(p[a])
      if (t === 'table') ((s = r.call(k, p[a], a)), s !== void 0 && i.push(s))
      else if (t === 'columns' || t === 'rows') ((s = r.call(k, p[a], this[a], a)), s !== void 0 && i.push(s))
      else if (t === 'column' || t === 'column-rows' || t === 'row' || t === 'cell')
        for (_ = this[a], t === 'column-rows' && (y = Zl(p[a], A.opts)), f = 0, g = _.length; f < g; f++)
          ((C = _[f]),
            t === 'cell' ? (s = r.call(k, p[a], C.row, C.column, a, f)) : (s = r.call(k, p[a], C, a, f, y)),
            s !== void 0 && i.push(s))
    }
    if (i.length || n) {
      var F = new yt(p, e ? i.concat.apply([], i) : i),
        N = F.selector
      return ((N.rows = A.rows), (N.cols = A.cols), (N.opts = A.opts), F)
    }
    return this
  },
  lastIndexOf:
    gn.lastIndexOf ||
    function (e, t) {
      return this.indexOf.apply(this.toArray.reverse(), arguments)
    },
  length: 0,
  map: function (e) {
    var t = []
    if (gn.map) t = gn.map.call(this, e, this)
    else for (var r = 0, n = this.length; r < n; r++) t.push(e.call(this, this[r], r))
    return new yt(this.context, t)
  },
  pluck: function (e) {
    var t = le.util.get(e)
    return this.map(function (r) {
      return t(r)
    })
  },
  pop: gn.pop,
  push: gn.push,
  reduce:
    gn.reduce ||
    function (e, t) {
      return Jf(this, e, t, 0, this.length, 1)
    },
  reduceRight:
    gn.reduceRight ||
    function (e, t) {
      return Jf(this, e, t, this.length - 1, -1, -1)
    },
  reverse: gn.reverse,
  selector: null,
  shift: gn.shift,
  slice: function () {
    return new yt(this.context, this)
  },
  sort: gn.sort,
  splice: gn.splice,
  toArray: function () {
    return gn.slice.call(this)
  },
  to$: function () {
    return P(this)
  },
  toJQuery: function () {
    return P(this)
  },
  unique: function () {
    return new yt(this.context, Vl(this))
  },
  unshift: gn.unshift
})
yt.extend = function (e, t, r) {
  if (!(!r.length || !t || (!(t instanceof yt) && !t.__dt_wrapper))) {
    var n,
      i,
      s,
      a = function (d, f, g) {
        return function () {
          var p = f.apply(d, arguments)
          return (yt.extend(p, p, g.methodExt), p)
        }
      }
    for (n = 0, i = r.length; n < i; n++)
      ((s = r[n]),
        (t[s.name] = s.type === 'function' ? a(e, s.val, s) : s.type === 'object' ? {} : s.val),
        (t[s.name].__dt_wrapper = !0),
        yt.extend(e, t[s.name], s.propExt))
  }
}
yt.register = Je = function (e, t) {
  if (Array.isArray(e)) {
    for (var r = 0, n = e.length; r < n; r++) yt.register(e[r], t)
    return
  }
  var i,
    s,
    a = e.split('.'),
    d = Tm,
    f,
    g,
    p = function (_, C) {
      for (var A = 0, k = _.length; A < k; A++) if (_[A].name === C) return _[A]
      return null
    }
  for (i = 0, s = a.length; i < s; i++) {
    ;((g = a[i].indexOf('()') !== -1), (f = g ? a[i].replace('()', '') : a[i]))
    var y = p(d, f)
    ;(y || ((y = { name: f, val: {}, methodExt: [], propExt: [], type: 'object' }), d.push(y)),
      i === s - 1
        ? ((y.val = t), (y.type = typeof t == 'function' ? 'function' : P.isPlainObject(t) ? 'object' : 'other'))
        : (d = g ? y.methodExt : y.propExt))
  }
}
yt.registerPlural = Xt = function (e, t, r) {
  ;(yt.register(e, r),
    yt.register(t, function () {
      var n = r.apply(this, arguments)
      return n === this
        ? this
        : n instanceof yt
          ? n.length
            ? Array.isArray(n[0])
              ? new yt(n.context, n[0])
              : n[0]
            : void 0
          : n
    }))
}
var Am = function (e, t) {
  if (Array.isArray(e))
    return P.map(e, function (n) {
      return Am(n, t)
    })
  if (typeof e == 'number') return [t[e]]
  var r = P.map(t, function (n, i) {
    return n.nTable
  })
  return P(r)
    .filter(e)
    .map(function (n) {
      var i = P.inArray(this, r)
      return t[i]
    })
    .toArray()
}
Je('tables()', function (e) {
  return e != null ? new yt(Am(e, this.context)) : this
})
Je('table()', function (e) {
  var t = this.tables(e),
    r = t.context
  return r.length ? new yt(r[0]) : t
})
Xt('tables().nodes()', 'table().node()', function () {
  return this.iterator(
    'table',
    function (e) {
      return e.nTable
    },
    1
  )
})
Xt('tables().body()', 'table().body()', function () {
  return this.iterator(
    'table',
    function (e) {
      return e.nTBody
    },
    1
  )
})
Xt('tables().header()', 'table().header()', function () {
  return this.iterator(
    'table',
    function (e) {
      return e.nTHead
    },
    1
  )
})
Xt('tables().footer()', 'table().footer()', function () {
  return this.iterator(
    'table',
    function (e) {
      return e.nTFoot
    },
    1
  )
})
Xt('tables().containers()', 'table().container()', function () {
  return this.iterator(
    'table',
    function (e) {
      return e.nTableWrapper
    },
    1
  )
})
Je('draw()', function (e) {
  return this.iterator('table', function (t) {
    e === 'page' ? Wi(t) : (typeof e == 'string' && (e = e !== 'full-hold'), go(t, e === !1))
  })
})
Je('page()', function (e) {
  return e === void 0
    ? this.page.info().page
    : this.iterator('table', function (t) {
        Yl(t, e)
      })
})
Je('page.info()', function (e) {
  if (this.context.length !== 0) {
    var t = this.context[0],
      r = t._iDisplayStart,
      n = t.oFeatures.bPaginate ? t._iDisplayLength : -1,
      i = t.fnRecordsDisplay(),
      s = n === -1
    return {
      page: s ? 0 : Math.floor(r / n),
      pages: s ? 1 : Math.ceil(i / n),
      start: r,
      end: t.fnDisplayEnd(),
      length: n,
      recordsTotal: t.fnRecordsTotal(),
      recordsDisplay: i,
      serverSide: Pn(t) === 'ssp'
    }
  }
})
Je('page.len()', function (e) {
  return e === void 0
    ? this.context.length !== 0
      ? this.context[0]._iDisplayLength
      : void 0
    : this.iterator('table', function (t) {
        Gu(t, e)
      })
})
var Dm = function (e, t, r) {
  if (r) {
    var n = new yt(e)
    n.one('draw', function () {
      r(n.ajax.json())
    })
  }
  if (Pn(e) == 'ssp') go(e, t)
  else {
    lr(e, !0)
    var i = e.jqXHR
    ;(i && i.readyState !== 4 && i.abort(),
      Jl(e, [], function (s) {
        Xl(e)
        for (var a = ba(e, s), d = 0, f = a.length; d < f; d++) Ui(e, a[d])
        ;(go(e, t), lr(e, !1))
      }))
  }
}
Je('ajax.json()', function () {
  var e = this.context
  if (e.length > 0) return e[0].json
})
Je('ajax.params()', function () {
  var e = this.context
  if (e.length > 0) return e[0].oAjaxData
})
Je('ajax.reload()', function (e, t) {
  return this.iterator('table', function (r) {
    Dm(r, t === !1, e)
  })
})
Je('ajax.url()', function (e) {
  var t = this.context
  return e === void 0
    ? t.length === 0
      ? void 0
      : ((t = t[0]), t.ajax ? (P.isPlainObject(t.ajax) ? t.ajax.url : t.ajax) : t.sAjaxSource)
    : this.iterator('table', function (r) {
        P.isPlainObject(r.ajax) ? (r.ajax.url = e) : (r.ajax = e)
      })
})
Je('ajax.url().load()', function (e, t) {
  return this.iterator('table', function (r) {
    Dm(r, t === !1, e)
  })
})
var nd = function (e, t, r, n, i) {
    var s = [],
      a,
      d,
      f,
      g,
      p,
      y,
      _ = typeof t
    for (
      (!t || _ === 'string' || _ === 'function' || t.length === void 0) && (t = [t]), f = 0, g = t.length;
      f < g;
      f++
    )
      for (d = t[f] && t[f].split && !t[f].match(/[\[\(:]/) ? t[f].split(',') : [t[f]], p = 0, y = d.length; p < y; p++)
        ((a = r(typeof d[p] == 'string' ? d[p].trim() : d[p])), a && a.length && (s = s.concat(a)))
    var C = dn.selector[e]
    if (C.length) for (f = 0, g = C.length; f < g; f++) s = C[f](n, i, s)
    return Vl(s)
  },
  rd = function (e) {
    return (
      e || (e = {}),
      e.filter && e.search === void 0 && (e.search = e.filter),
      P.extend({ search: 'none', order: 'current', page: 'all' }, e)
    )
  },
  id = function (e) {
    for (var t = 0, r = e.length; t < r; t++)
      if (e[t].length > 0) return ((e[0] = e[t]), (e[0].length = 1), (e.length = 1), (e.context = [e.context[t]]), e)
    return ((e.length = 0), e)
  },
  Zl = function (e, t) {
    var r,
      n,
      i,
      s = [],
      a = e.aiDisplay,
      d = e.aiDisplayMaster,
      f = t.search,
      g = t.order,
      p = t.page
    if (Pn(e) == 'ssp') return f === 'removed' ? [] : qo(0, d.length)
    if (p == 'current') for (r = e._iDisplayStart, n = e.fnDisplayEnd(); r < n; r++) s.push(a[r])
    else if (g == 'current' || g == 'applied') {
      if (f == 'none') s = d.slice()
      else if (f == 'applied') s = a.slice()
      else if (f == 'removed') {
        for (var y = {}, r = 0, n = a.length; r < n; r++) y[a[r]] = null
        s = P.map(d, function (_) {
          return y.hasOwnProperty(_) ? null : _
        })
      }
    } else if (g == 'index' || g == 'original')
      for (r = 0, n = e.aoData.length; r < n; r++)
        f == 'none'
          ? s.push(r)
          : ((i = P.inArray(r, a)), ((i === -1 && f == 'removed') || (i >= 0 && f == 'applied')) && s.push(r))
    return s
  },
  Pw = function (e, t, r) {
    var n,
      i = function (s) {
        var a = zp(s),
          d = e.aoData
        if (a !== null && !r) return [a]
        if ((n || (n = Zl(e, r)), a !== null && P.inArray(a, n) !== -1)) return [a]
        if (s == null || s === '') return n
        if (typeof s == 'function')
          return P.map(n, function (C) {
            var A = d[C]
            return s(C, A._aData, A.nTr) ? C : null
          })
        if (s.nodeName) {
          var f = s._DT_RowIndex,
            g = s._DT_CellIndex
          if (f !== void 0) return d[f] && d[f].nTr === s ? [f] : []
          if (g) return d[g.row] && d[g.row].nTr === s.parentNode ? [g.row] : []
          var p = P(s).closest('*[data-dt-row]')
          return p.length ? [p.data('dt-row')] : []
        }
        if (typeof s == 'string' && s.charAt(0) === '#') {
          var y = e.aIds[s.replace(/^#/, '')]
          if (y !== void 0) return [y.idx]
        }
        var _ = Xp(fa(e.aoData, n, 'nTr'))
        return P(_)
          .filter(s)
          .map(function () {
            return this._DT_RowIndex
          })
          .toArray()
      }
    return nd('row', t, i, e, r)
  }
Je('rows()', function (e, t) {
  ;(e === void 0 ? (e = '') : P.isPlainObject(e) && ((t = e), (e = '')), (t = rd(t)))
  var r = this.iterator(
    'table',
    function (n) {
      return Pw(n, e, t)
    },
    1
  )
  return ((r.selector.rows = e), (r.selector.opts = t), r)
})
Je('rows().nodes()', function () {
  return this.iterator(
    'row',
    function (e, t) {
      return e.aoData[t].nTr || void 0
    },
    1
  )
})
Je('rows().data()', function () {
  return this.iterator(
    !0,
    'rows',
    function (e, t) {
      return fa(e.aoData, t, '_aData')
    },
    1
  )
})
Xt('rows().cache()', 'row().cache()', function (e) {
  return this.iterator(
    'row',
    function (t, r) {
      var n = t.aoData[r]
      return e === 'search' ? n._aFilterData : n._aSortData
    },
    1
  )
})
Xt('rows().invalidate()', 'row().invalidate()', function (e) {
  return this.iterator('row', function (t, r) {
    ga(t, r, e)
  })
})
Xt('rows().indexes()', 'row().index()', function () {
  return this.iterator(
    'row',
    function (e, t) {
      return t
    },
    1
  )
})
Xt('rows().ids()', 'row().id()', function (e) {
  for (var t = [], r = this.context, n = 0, i = r.length; n < i; n++)
    for (var s = 0, a = this[n].length; s < a; s++) {
      var d = r[n].rowIdFn(r[n].aoData[this[n][s]]._aData)
      t.push((e === !0 ? '#' : '') + d)
    }
  return new yt(r, t)
})
Xt('rows().remove()', 'row().remove()', function () {
  var e = this
  return (
    this.iterator('row', function (t, r, n) {
      var i = t.aoData,
        s = i[r],
        a,
        d,
        f,
        g,
        p,
        y
      for (i.splice(r, 1), a = 0, d = i.length; a < d; a++)
        if (((p = i[a]), (y = p.anCells), p.nTr !== null && (p.nTr._DT_RowIndex = a), y !== null))
          for (f = 0, g = y.length; f < g; f++) y[f]._DT_CellIndex.row = a
      ;(cl(t.aiDisplayMaster, r),
        cl(t.aiDisplay, r),
        cl(e[n], r, !1),
        t._iRecordsDisplay > 0 && t._iRecordsDisplay--,
        ed(t))
      var _ = t.rowIdFn(s._aData)
      _ !== void 0 && delete t.aIds[_]
    }),
    this.iterator('table', function (t) {
      for (var r = 0, n = t.aoData.length; r < n; r++) t.aoData[r].idx = r
    }),
    this
  )
})
Je('rows.add()', function (e) {
  var t = this.iterator(
      'table',
      function (n) {
        var i,
          s,
          a,
          d = []
        for (s = 0, a = e.length; s < a; s++)
          ((i = e[s]), i.nodeName && i.nodeName.toUpperCase() === 'TR' ? d.push(Kl(n, i)[0]) : d.push(Ui(n, i)))
        return d
      },
      1
    ),
    r = this.rows(-1)
  return (r.pop(), P.merge(r, t), r)
})
Je('row()', function (e, t) {
  return id(this.rows(e, t))
})
Je('row().data()', function (e) {
  var t = this.context
  if (e === void 0) return t.length && this.length ? t[0].aoData[this[0]]._aData : void 0
  var r = t[0].aoData[this[0]]
  return (
    (r._aData = e),
    Array.isArray(e) && r.nTr && r.nTr.id && Fi(t[0].rowId)(e, r.nTr.id),
    ga(t[0], this[0], 'data'),
    this
  )
})
Je('row().node()', function () {
  var e = this.context
  return (e.length && this.length && e[0].aoData[this[0]].nTr) || null
})
Je('row.add()', function (e) {
  e instanceof P && e.length && (e = e[0])
  var t = this.iterator('table', function (r) {
    return e.nodeName && e.nodeName.toUpperCase() === 'TR' ? Kl(r, e)[0] : Ui(r, e)
  })
  return this.row(t[0])
})
P(document).on('plugin-init.dt', function (e, t) {
  var r = new yt(t),
    n = 'on-plugin-init',
    i = 'stateSaveParams.' + n,
    s = 'destroy. ' + n
  ;(r.on(i, function (d, f, g) {
    for (var p = f.rowIdFn, y = f.aoData, _ = [], C = 0; C < y.length; C++)
      y[C]._detailsShow && _.push('#' + p(y[C]._aData))
    g.childRows = _
  }),
    r.on(s, function () {
      r.off(i + ' ' + s)
    }))
  var a = r.state.loaded()
  a &&
    a.childRows &&
    r
      .rows(
        P.map(a.childRows, function (d) {
          return d.replace(/:/g, '\\:')
        })
      )
      .every(function () {
        Et(t, null, 'requestChild', [this])
      })
})
var Rw = function (e, t, r, n) {
    var i = [],
      s = function (a, d) {
        if (Array.isArray(a) || a instanceof P) {
          for (var f = 0, g = a.length; f < g; f++) s(a[f], d)
          return
        }
        if (a.nodeName && a.nodeName.toLowerCase() === 'tr') i.push(a)
        else {
          var p = P('<tr><td></td></tr>').addClass(d)
          ;((P('td', p).addClass(d).html(a)[0].colSpan = is(e)), i.push(p[0]))
        }
      }
    ;(s(r, n), t._details && t._details.detach(), (t._details = P(i)), t._detailsShow && t._details.insertAfter(t.nTr))
  },
  km = le.util.throttle(function (e) {
    _a(e[0])
  }, 500),
  od = function (e, t) {
    var r = e.context
    if (r.length) {
      var n = r[0].aoData[t !== void 0 ? t : e[0]]
      n &&
        n._details &&
        (n._details.remove(),
        (n._detailsShow = void 0),
        (n._details = void 0),
        P(n.nTr).removeClass('dt-hasChild'),
        km(r))
    }
  },
  Em = function (e, t) {
    var r = e.context
    if (r.length && e.length) {
      var n = r[0].aoData[e[0]]
      n._details &&
        ((n._detailsShow = t),
        t
          ? (n._details.insertAfter(n.nTr), P(n.nTr).addClass('dt-hasChild'))
          : (n._details.detach(), P(n.nTr).removeClass('dt-hasChild')),
        Et(r[0], null, 'childRow', [t, e.row(e[0])]),
        Lw(r[0]),
        km(r))
    }
  },
  Lw = function (e) {
    var t = new yt(e),
      r = '.dt.DT_details',
      n = 'draw' + r,
      i = 'column-sizing' + r,
      s = 'destroy' + r,
      a = e.aoData
    ;(t.off(n + ' ' + i + ' ' + s),
      Zn(a, '_details').length > 0 &&
        (t.on(n, function (d, f) {
          e === f &&
            t
              .rows({ page: 'current' })
              .eq(0)
              .each(function (g) {
                var p = a[g]
                p._detailsShow && p._details.insertAfter(p.nTr)
              })
        }),
        t.on(i, function (d, f, g, p) {
          if (e === f)
            for (var y, _ = is(f), C = 0, A = a.length; C < A; C++)
              ((y = a[C]),
                y._details &&
                  y._details.each(function () {
                    var k = P(this).children('td')
                    k.length == 1 && k.attr('colspan', _)
                  }))
        }),
        t.on(s, function (d, f) {
          if (e === f) for (var g = 0, p = a.length; g < p; g++) a[g]._details && od(t, g)
        })))
  },
  Mw = '',
  wa = Mw + 'row().child',
  ec = wa + '()'
Je(ec, function (e, t) {
  var r = this.context
  return e === void 0
    ? r.length && this.length
      ? r[0].aoData[this[0]]._details
      : void 0
    : (e === !0
        ? this.child.show()
        : e === !1
          ? od(this)
          : r.length && this.length && Rw(r[0], r[0].aoData[this[0]], e, t),
      this)
})
Je([wa + '.show()', ec + '.show()'], function (e) {
  return (Em(this, !0), this)
})
Je([wa + '.hide()', ec + '.hide()'], function () {
  return (Em(this, !1), this)
})
Je([wa + '.remove()', ec + '.remove()'], function () {
  return (od(this), this)
})
Je(wa + '.isShown()', function () {
  var e = this.context
  return (e.length && this.length && e[0].aoData[this[0]]._detailsShow) || !1
})
var Iw = /^([^:]+):(name|visIdx|visible)$/,
  Om = function (e, t, r, n, i) {
    for (var s = [], a = 0, d = i.length; a < d; a++) s.push(er(e, i[a], t))
    return s
  },
  Fw = function (e, t, r) {
    var n = e.aoColumns,
      i = Zn(n, 'sName'),
      s = Zn(n, 'nTh'),
      a = function (d) {
        var f = zp(d)
        if (d === '') return qo(n.length)
        if (f !== null) return [f >= 0 ? f : n.length + f]
        if (typeof d == 'function') {
          var g = Zl(e, r)
          return P.map(n, function (k, F) {
            return d(F, Om(e, F, 0, 0, g), s[F]) ? F : null
          })
        }
        var p = typeof d == 'string' ? d.match(Iw) : ''
        if (p)
          switch (p[2]) {
            case 'visIdx':
            case 'visible':
              var y = parseInt(p[1], 10)
              if (y < 0) {
                var _ = P.map(n, function (k, F) {
                  return k.bVisible ? F : null
                })
                return [_[_.length + y]]
              }
              return [ma(e, y)]
            case 'name':
              return P.map(i, function (k, F) {
                return k === p[1] ? F : null
              })
            default:
              return []
          }
        if (d.nodeName && d._DT_CellIndex) return [d._DT_CellIndex.column]
        var C = P(s)
          .filter(d)
          .map(function () {
            return P.inArray(this, s)
          })
          .toArray()
        if (C.length || !d.nodeName) return C
        var A = P(d).closest('*[data-dt-column]')
        return A.length ? [A.data('dt-column')] : []
      }
    return nd('column', t, a, e, r)
  },
  jw = function (e, t, r) {
    var n = e.aoColumns,
      i = n[t],
      s = e.aoData,
      a,
      d,
      f,
      g
    if (r === void 0) return i.bVisible
    if (i.bVisible !== r) {
      if (r) {
        var p = P.inArray(!0, Zn(n, 'bVisible'), t + 1)
        for (d = 0, f = s.length; d < f; d++)
          ((g = s[d].nTr), (a = s[d].anCells), g && g.insertBefore(a[t], a[p] || null))
      } else P(Zn(e.aoData, 'anCells', t)).detach()
      i.bVisible = r
    }
  }
Je('columns()', function (e, t) {
  ;(e === void 0 ? (e = '') : P.isPlainObject(e) && ((t = e), (e = '')), (t = rd(t)))
  var r = this.iterator(
    'table',
    function (n) {
      return Fw(n, e, t)
    },
    1
  )
  return ((r.selector.cols = e), (r.selector.opts = t), r)
})
Xt('columns().header()', 'column().header()', function (e, t) {
  return this.iterator(
    'column',
    function (r, n) {
      return r.aoColumns[n].nTh
    },
    1
  )
})
Xt('columns().footer()', 'column().footer()', function (e, t) {
  return this.iterator(
    'column',
    function (r, n) {
      return r.aoColumns[n].nTf
    },
    1
  )
})
Xt('columns().data()', 'column().data()', function () {
  return this.iterator('column-rows', Om, 1)
})
Xt('columns().dataSrc()', 'column().dataSrc()', function () {
  return this.iterator(
    'column',
    function (e, t) {
      return e.aoColumns[t].mData
    },
    1
  )
})
Xt('columns().cache()', 'column().cache()', function (e) {
  return this.iterator(
    'column-rows',
    function (t, r, n, i, s) {
      return fa(t.aoData, s, e === 'search' ? '_aFilterData' : '_aSortData', r)
    },
    1
  )
})
Xt('columns().nodes()', 'column().nodes()', function () {
  return this.iterator(
    'column-rows',
    function (e, t, r, n, i) {
      return fa(e.aoData, i, 'anCells', t)
    },
    1
  )
})
Xt('columns().visible()', 'column().visible()', function (e, t) {
  var r = this,
    n = this.iterator('column', function (i, s) {
      if (e === void 0) return i.aoColumns[s].bVisible
      jw(i, s, e)
    })
  return (
    e !== void 0 &&
      this.iterator('table', function (i) {
        ;(ia(i, i.aoHeader),
          ia(i, i.aoFooter),
          i.aiDisplay.length || P(i.nTBody).find('td[colspan]').attr('colspan', is(i)),
          _a(i),
          r.iterator('column', function (s, a) {
            Et(s, null, 'column-visibility', [s, a, e, t])
          }),
          (t === void 0 || t) && r.columns.adjust())
      }),
    n
  )
})
Xt('columns().indexes()', 'column().index()', function (e) {
  return this.iterator(
    'column',
    function (t, r) {
      return e === 'visible' ? va(t, r) : r
    },
    1
  )
})
Je('columns.adjust()', function () {
  return this.iterator(
    'table',
    function (e) {
      pa(e)
    },
    1
  )
})
Je('column.index()', function (e, t) {
  if (this.context.length !== 0) {
    var r = this.context[0]
    if (e === 'fromVisible' || e === 'toData') return ma(r, t)
    if (e === 'fromData' || e === 'toVisible') return va(r, t)
  }
})
Je('column()', function (e, t) {
  return id(this.columns(e, t))
})
var Nw = function (e, t, r) {
  var n = e.aoData,
    i = Zl(e, r),
    s = Xp(fa(n, i, 'anCells')),
    a = P(Gp([], s)),
    d,
    f = e.aoColumns.length,
    g,
    p,
    y,
    _,
    C,
    A,
    k = function (F) {
      var N = typeof F == 'function'
      if (F == null || N) {
        for (g = [], p = 0, y = i.length; p < y; p++)
          for (d = i[p], _ = 0; _ < f; _++)
            ((C = { row: d, column: _ }),
              N ? ((A = n[d]), F(C, er(e, d, _), A.anCells ? A.anCells[_] : null) && g.push(C)) : g.push(C))
        return g
      }
      if (P.isPlainObject(F)) return F.column !== void 0 && F.row !== void 0 && P.inArray(F.row, i) !== -1 ? [F] : []
      var E = a
        .filter(F)
        .map(function (z, Y) {
          return { row: Y._DT_CellIndex.row, column: Y._DT_CellIndex.column }
        })
        .toArray()
      return E.length || !F.nodeName
        ? E
        : ((A = P(F).closest('*[data-dt-row]')),
          A.length ? [{ row: A.data('dt-row'), column: A.data('dt-column') }] : [])
    }
  return nd('cell', t, k, e, r)
}
Je('cells()', function (e, t, r) {
  if (
    (P.isPlainObject(e) && (e.row === void 0 ? ((r = e), (e = null)) : ((r = t), (t = null))),
    P.isPlainObject(t) && ((r = t), (t = null)),
    t == null)
  )
    return this.iterator('table', function (_) {
      return Nw(_, e, rd(r))
    })
  var n = r ? { page: r.page, order: r.order, search: r.search } : {},
    i = this.columns(t, n),
    s = this.rows(e, n),
    a,
    d,
    f,
    g,
    p = this.iterator(
      'table',
      function (_, C) {
        var A = []
        for (a = 0, d = s[C].length; a < d; a++)
          for (f = 0, g = i[C].length; f < g; f++) A.push({ row: s[C][a], column: i[C][f] })
        return A
      },
      1
    ),
    y = r && r.selected ? this.cells(p, r) : p
  return (P.extend(y.selector, { cols: t, rows: e, opts: r }), y)
})
Xt('cells().nodes()', 'cell().node()', function () {
  return this.iterator(
    'cell',
    function (e, t, r) {
      var n = e.aoData[t]
      return n && n.anCells ? n.anCells[r] : void 0
    },
    1
  )
})
Je('cells().data()', function () {
  return this.iterator(
    'cell',
    function (e, t, r) {
      return er(e, t, r)
    },
    1
  )
})
Xt('cells().cache()', 'cell().cache()', function (e) {
  return (
    (e = e === 'search' ? '_aFilterData' : '_aSortData'),
    this.iterator(
      'cell',
      function (t, r, n) {
        return t.aoData[r][e][n]
      },
      1
    )
  )
})
Xt('cells().render()', 'cell().render()', function (e) {
  return this.iterator(
    'cell',
    function (t, r, n) {
      return er(t, r, n, e)
    },
    1
  )
})
Xt('cells().indexes()', 'cell().index()', function () {
  return this.iterator(
    'cell',
    function (e, t, r) {
      return { row: t, column: r, columnVisible: va(e, r) }
    },
    1
  )
})
Xt('cells().invalidate()', 'cell().invalidate()', function (e) {
  return this.iterator('cell', function (t, r, n) {
    ga(t, r, e, n)
  })
})
Je('cell()', function (e, t, r) {
  return id(this.cells(e, t, r))
})
Je('cell().data()', function (e) {
  var t = this.context,
    r = this[0]
  return e === void 0
    ? t.length && r.length
      ? er(t[0], r[0].row, r[0].column)
      : void 0
    : (em(t[0], r[0].row, r[0].column, e), ga(t[0], r[0].row, 'data', r[0].column), this)
})
Je('order()', function (e, t) {
  var r = this.context
  return e === void 0
    ? r.length !== 0
      ? r[0].aaSorting
      : void 0
    : (typeof e == 'number'
        ? (e = [[e, t]])
        : e.length && !Array.isArray(e[0]) && (e = Array.prototype.slice.call(arguments)),
      this.iterator('table', function (n) {
        n.aaSorting = e.slice()
      }))
})
Je('order.listener()', function (e, t, r) {
  return this.iterator('table', function (n) {
    Qu(n, e, t, r)
  })
})
Je('order.fixed()', function (e) {
  if (!e) {
    var t = this.context,
      r = t.length ? t[0].aaSortingFixed : void 0
    return Array.isArray(r) ? { pre: r } : r
  }
  return this.iterator('table', function (n) {
    n.aaSortingFixed = P.extend(!0, {}, e)
  })
})
Je(['columns().order()', 'column().order()'], function (e) {
  var t = this
  return this.iterator('table', function (r, n) {
    var i = []
    ;(P.each(t[n], function (s, a) {
      i.push([a, e])
    }),
      (r.aaSorting = i))
  })
})
Je('search()', function (e, t, r, n) {
  var i = this.context
  return e === void 0
    ? i.length !== 0
      ? i[0].oPreviousSearch.sSearch
      : void 0
    : this.iterator('table', function (s) {
        s.oFeatures.bFilter &&
          ya(
            s,
            P.extend({}, s.oPreviousSearch, {
              sSearch: e + '',
              bRegex: t === null ? !1 : t,
              bSmart: r === null ? !0 : r,
              bCaseInsensitive: n === null ? !0 : n
            }),
            1
          )
      })
})
Xt('columns().search()', 'column().search()', function (e, t, r, n) {
  return this.iterator('column', function (i, s) {
    var a = i.aoPreSearchCols
    if (e === void 0) return a[s].sSearch
    i.oFeatures.bFilter &&
      (P.extend(a[s], {
        sSearch: e + '',
        bRegex: t === null ? !1 : t,
        bSmart: r === null ? !0 : r,
        bCaseInsensitive: n === null ? !0 : n
      }),
      ya(i, i.oPreviousSearch, 1))
  })
})
Je('state()', function () {
  return this.context.length ? this.context[0].oSavedState : null
})
Je('state.clear()', function () {
  return this.iterator('table', function (e) {
    e.fnStateSaveCallback.call(e.oInstance, e, {})
  })
})
Je('state.loaded()', function () {
  return this.context.length ? this.context[0].oLoadedState : null
})
Je('state.save()', function () {
  return this.iterator('table', function (e) {
    _a(e)
  })
})
le.use = function (e, t) {
  t === 'lib' || e.fn
    ? (P = e)
    : t == 'win' || e.document
      ? ((window = e), (document = e.document))
      : (t === 'datetime' || e.type === 'DateTime') && (le.DateTime = e)
}
le.factory = function (e, t) {
  var r = !1
  return (
    e && e.document && ((window = e), (document = e.document)),
    t && t.fn && t.fn.jquery && ((P = t), (r = !0)),
    r
  )
}
le.versionCheck = le.fnVersionCheck = function (e) {
  for (var t = le.version.split('.'), r = e.split('.'), n, i, s = 0, a = r.length; s < a; s++)
    if (((n = parseInt(t[s], 10) || 0), (i = parseInt(r[s], 10) || 0), n !== i)) return n > i
  return !0
}
le.isDataTable = le.fnIsDataTable = function (e) {
  var t = P(e).get(0),
    r = !1
  return e instanceof le.Api
    ? !0
    : (P.each(le.settings, function (n, i) {
        var s = i.nScrollHead ? P('table', i.nScrollHead)[0] : null,
          a = i.nScrollFoot ? P('table', i.nScrollFoot)[0] : null
        ;(i.nTable === t || s === t || a === t) && (r = !0)
      }),
      r)
}
le.tables = le.fnTables = function (e) {
  var t = !1
  P.isPlainObject(e) && ((t = e.api), (e = e.visible))
  var r = P.map(le.settings, function (n) {
    if (!e || (e && P(n.nTable).is(':visible'))) return n.nTable
  })
  return t ? new yt(r) : r
}
le.camelToHungarian = ui
Je('$()', function (e, t) {
  var r = this.rows(t).nodes(),
    n = P(r)
  return P([].concat(n.filter(e).toArray(), n.find(e).toArray()))
})
P.each(['on', 'one', 'off'], function (e, t) {
  Je(t + '()', function () {
    var r = Array.prototype.slice.call(arguments)
    r[0] = P.map(r[0].split(/\s/), function (i) {
      return i.match(/\.dt\b/) ? i : i + '.dt'
    }).join(' ')
    var n = P(this.tables().nodes())
    return (n[t].apply(n, r), this)
  })
})
Je('clear()', function () {
  return this.iterator('table', function (e) {
    Xl(e)
  })
})
Je('settings()', function () {
  return new yt(this.context, this.context)
})
Je('init()', function () {
  var e = this.context
  return e.length ? e[0].oInit : null
})
Je('data()', function () {
  return this.iterator('table', function (e) {
    return Zn(e.aoData, '_aData')
  }).flatten()
})
Je('destroy()', function (e) {
  return (
    (e = e || !1),
    this.iterator('table', function (t) {
      var r = t.oClasses,
        n = t.nTable,
        i = t.nTBody,
        s = t.nTHead,
        a = t.nTFoot,
        d = P(n),
        f = P(i),
        g = P(t.nTableWrapper),
        p = P.map(t.aoData, function (k) {
          return k.nTr
        }),
        y
      ;((t.bDestroying = !0),
        Et(t, 'aoDestroyCallback', 'destroy', [t]),
        e || new yt(t).columns().visible(!0),
        g.off('.DT').find(':not(tbody *)').off('.DT'),
        P(window).off('.DT-' + t.sInstance),
        n != s.parentNode && (d.children('thead').detach(), d.append(s)),
        a && n != a.parentNode && (d.children('tfoot').detach(), d.append(a)),
        (t.aaSorting = []),
        (t.aaSortingFixed = []),
        Tl(t),
        P(p).removeClass(t.asStripeClasses.join(' ')),
        P('th, td', s).removeClass(r.sSortable + ' ' + r.sSortableAsc + ' ' + r.sSortableDesc + ' ' + r.sSortableNone),
        f.children().detach(),
        f.append(p))
      var _ = t.nTableWrapper.parentNode,
        C = e ? 'remove' : 'detach'
      ;(d[C](),
        g[C](),
        !e &&
          _ &&
          (_.insertBefore(n, t.nTableReinsertBefore),
          d.css('width', t.sDestroyWidth).removeClass(r.sTable),
          (y = t.asDestroyStripes.length),
          y &&
            f.children().each(function (k) {
              P(this).addClass(t.asDestroyStripes[k % y])
            })))
      var A = P.inArray(t, le.settings)
      A !== -1 && le.settings.splice(A, 1)
    })
  )
})
P.each(['column', 'row', 'cell'], function (e, t) {
  Je(t + 's().every()', function (r) {
    var n = this.selector.opts,
      i = this
    return this.iterator(t, function (s, a, d, f, g) {
      r.call(i[t](a, t === 'cell' ? d : n, t === 'cell' ? n : void 0), a, d, f, g)
    })
  })
})
Je('i18n()', function (e, t, r) {
  var n = this.context[0],
    i = es(e)(n.oLanguage)
  return (
    i === void 0 && (i = t),
    r !== void 0 && P.isPlainObject(i) && (i = i[r] !== void 0 ? i[r] : i._),
    typeof i == 'string' ? i.replace('%d', r) : i
  )
})
le.version = '1.13.11'
le.settings = []
le.models = {}
le.models.oSearch = { bCaseInsensitive: !0, sSearch: '', bRegex: !1, bSmart: !0, return: !1 }
le.models.oRow = {
  nTr: null,
  anCells: null,
  _aData: [],
  _aSortData: null,
  _aFilterData: null,
  _sFilterRow: null,
  _sRowStripe: '',
  src: null,
  idx: -1
}
le.models.oColumn = {
  idx: null,
  aDataSort: null,
  asSorting: null,
  bSearchable: null,
  bSortable: null,
  bVisible: null,
  _sManualType: null,
  _bAttrSrc: !1,
  fnCreatedCell: null,
  fnGetData: null,
  fnSetData: null,
  mData: null,
  mRender: null,
  nTh: null,
  nTf: null,
  sClass: null,
  sContentPadding: null,
  sDefaultContent: null,
  sName: null,
  sSortDataType: 'std',
  sSortingClass: null,
  sSortingClassJUI: null,
  sTitle: null,
  sType: null,
  sWidth: null,
  sWidthOrig: null
}
le.defaults = {
  aaData: null,
  aaSorting: [[0, 'asc']],
  aaSortingFixed: [],
  ajax: null,
  aLengthMenu: [10, 25, 50, 100],
  aoColumns: null,
  aoColumnDefs: null,
  aoSearchCols: [],
  asStripeClasses: null,
  bAutoWidth: !0,
  bDeferRender: !1,
  bDestroy: !1,
  bFilter: !0,
  bInfo: !0,
  bLengthChange: !0,
  bPaginate: !0,
  bProcessing: !1,
  bRetrieve: !1,
  bScrollCollapse: !1,
  bServerSide: !1,
  bSort: !0,
  bSortMulti: !0,
  bSortCellsTop: !1,
  bSortClasses: !0,
  bStateSave: !1,
  fnCreatedRow: null,
  fnDrawCallback: null,
  fnFooterCallback: null,
  fnFormatNumber: function (e) {
    return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands)
  },
  fnHeaderCallback: null,
  fnInfoCallback: null,
  fnInitComplete: null,
  fnPreDrawCallback: null,
  fnRowCallback: null,
  fnServerData: null,
  fnServerParams: null,
  fnStateLoadCallback: function (e) {
    try {
      return JSON.parse(
        (e.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
          'DataTables_' + e.sInstance + '_' + location.pathname
        )
      )
    } catch {
      return {}
    }
  },
  fnStateLoadParams: null,
  fnStateLoaded: null,
  fnStateSaveCallback: function (e, t) {
    try {
      ;(e.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
        'DataTables_' + e.sInstance + '_' + location.pathname,
        JSON.stringify(t)
      )
    } catch {}
  },
  fnStateSaveParams: null,
  iStateDuration: 7200,
  iDeferLoading: null,
  iDisplayLength: 10,
  iDisplayStart: 0,
  iTabIndex: 0,
  oClasses: {},
  oLanguage: {
    oAria: {
      sSortAscending: ': activate to sort column ascending',
      sSortDescending: ': activate to sort column descending'
    },
    oPaginate: { sFirst: 'First', sLast: 'Last', sNext: 'Next', sPrevious: 'Previous' },
    sEmptyTable: 'No data available in table',
    sInfo: 'Showing _START_ to _END_ of _TOTAL_ entries',
    sInfoEmpty: 'Showing 0 to 0 of 0 entries',
    sInfoFiltered: '(filtered from _MAX_ total entries)',
    sInfoPostFix: '',
    sDecimal: '',
    sThousands: ',',
    sLengthMenu: 'Show _MENU_ entries',
    sLoadingRecords: 'Loading...',
    sProcessing: '',
    sSearch: 'Search:',
    sSearchPlaceholder: '',
    sUrl: '',
    sZeroRecords: 'No matching records found'
  },
  oSearch: P.extend({}, le.models.oSearch),
  sAjaxDataProp: 'data',
  sAjaxSource: null,
  sDom: 'lfrtip',
  searchDelay: null,
  sPaginationType: 'simple_numbers',
  sScrollX: '',
  sScrollXInner: '',
  sScrollY: '',
  sServerMethod: 'GET',
  renderer: null,
  rowId: 'DT_RowId'
}
ha(le.defaults)
le.defaults.column = {
  aDataSort: null,
  iDataSort: -1,
  asSorting: ['asc', 'desc'],
  bSearchable: !0,
  bSortable: !0,
  bVisible: !0,
  fnCreatedCell: null,
  mData: null,
  mRender: null,
  sCellType: 'td',
  sClass: '',
  sContentPadding: '',
  sDefaultContent: null,
  sName: '',
  sSortDataType: 'std',
  sTitle: null,
  sType: null,
  sWidth: null
}
ha(le.defaults.column)
le.models.oSettings = {
  oFeatures: {
    bAutoWidth: null,
    bDeferRender: null,
    bFilter: null,
    bInfo: null,
    bLengthChange: null,
    bPaginate: null,
    bProcessing: null,
    bServerSide: null,
    bSort: null,
    bSortMulti: null,
    bSortClasses: null,
    bStateSave: null
  },
  oScroll: { bCollapse: null, iBarWidth: 0, sX: null, sXInner: null, sY: null },
  oLanguage: { fnInfoCallback: null },
  oBrowser: { bScrollOversize: !1, bScrollbarLeft: !1, bBounding: !1, barWidth: 0 },
  ajax: null,
  aanFeatures: [],
  aoData: [],
  aiDisplay: [],
  aiDisplayMaster: [],
  aIds: {},
  aoColumns: [],
  aoHeader: [],
  aoFooter: [],
  oPreviousSearch: {},
  aoPreSearchCols: [],
  aaSorting: null,
  aaSortingFixed: [],
  asStripeClasses: null,
  asDestroyStripes: [],
  sDestroyWidth: 0,
  aoRowCallback: [],
  aoHeaderCallback: [],
  aoFooterCallback: [],
  aoDrawCallback: [],
  aoRowCreatedCallback: [],
  aoPreDrawCallback: [],
  aoInitComplete: [],
  aoStateSaveParams: [],
  aoStateLoadParams: [],
  aoStateLoaded: [],
  sTableId: '',
  nTable: null,
  nTHead: null,
  nTFoot: null,
  nTBody: null,
  nTableWrapper: null,
  bDeferLoading: !1,
  bInitialised: !1,
  aoOpenRows: [],
  sDom: null,
  searchDelay: null,
  sPaginationType: 'two_button',
  iStateDuration: 0,
  aoStateSave: [],
  aoStateLoad: [],
  oSavedState: null,
  oLoadedState: null,
  sAjaxSource: null,
  sAjaxDataProp: null,
  jqXHR: null,
  json: void 0,
  oAjaxData: void 0,
  fnServerData: null,
  aoServerParams: [],
  sServerMethod: null,
  fnFormatNumber: null,
  aLengthMenu: null,
  iDraw: 0,
  bDrawing: !1,
  iDrawError: -1,
  _iDisplayLength: 10,
  _iDisplayStart: 0,
  _iRecordsTotal: 0,
  _iRecordsDisplay: 0,
  oClasses: {},
  bFiltered: !1,
  bSorted: !1,
  bSortCellsTop: null,
  oInit: null,
  aoDestroyCallback: [],
  fnRecordsTotal: function () {
    return Pn(this) == 'ssp' ? this._iRecordsTotal * 1 : this.aiDisplayMaster.length
  },
  fnRecordsDisplay: function () {
    return Pn(this) == 'ssp' ? this._iRecordsDisplay * 1 : this.aiDisplay.length
  },
  fnDisplayEnd: function () {
    var e = this._iDisplayLength,
      t = this._iDisplayStart,
      r = t + e,
      n = this.aiDisplay.length,
      i = this.oFeatures,
      s = i.bPaginate
    return i.bServerSide
      ? s === !1 || e === -1
        ? t + n
        : Math.min(t + e, this._iRecordsDisplay)
      : !s || r > n || e === -1
        ? n
        : r
  },
  oInstance: null,
  sInstance: null,
  iTabIndex: 0,
  nScrollHead: null,
  nScrollFoot: null,
  aLastSort: [],
  oPlugins: {},
  rowIdFn: null,
  rowId: null
}
le.ext = dn = {
  buttons: {},
  classes: {},
  builder: '-source-',
  errMode: 'alert',
  feature: [],
  search: [],
  selector: { cell: [], column: [], row: [] },
  internal: {},
  legacy: { ajax: null },
  pager: {},
  renderer: { pageButton: {}, header: {} },
  order: {},
  type: { detect: [], search: {}, order: {} },
  _unique: 0,
  fnVersionCheck: le.fnVersionCheck,
  iApiIndex: 0,
  oJUIClasses: {},
  sVersion: le.version
}
P.extend(dn, {
  afnFiltering: dn.search,
  aTypes: dn.type.detect,
  ofnSearch: dn.type.search,
  oSort: dn.type.order,
  afnSortData: dn.order,
  aoFeatures: dn.feature,
  oApi: dn.internal,
  oStdClasses: dn.classes,
  oPagination: dn.pager
})
P.extend(le.ext.classes, {
  sTable: 'dataTable',
  sNoFooter: 'no-footer',
  sPageButton: 'paginate_button',
  sPageButtonActive: 'current',
  sPageButtonDisabled: 'disabled',
  sStripeOdd: 'odd',
  sStripeEven: 'even',
  sRowEmpty: 'dataTables_empty',
  sWrapper: 'dataTables_wrapper',
  sFilter: 'dataTables_filter',
  sInfo: 'dataTables_info',
  sPaging: 'dataTables_paginate paging_',
  sLength: 'dataTables_length',
  sProcessing: 'dataTables_processing',
  sSortAsc: 'sorting_asc',
  sSortDesc: 'sorting_desc',
  sSortable: 'sorting',
  sSortableAsc: 'sorting_desc_disabled',
  sSortableDesc: 'sorting_asc_disabled',
  sSortableNone: 'sorting_disabled',
  sSortColumn: 'sorting_',
  sFilterInput: '',
  sLengthSelect: '',
  sScrollWrapper: 'dataTables_scroll',
  sScrollHead: 'dataTables_scrollHead',
  sScrollHeadInner: 'dataTables_scrollHeadInner',
  sScrollBody: 'dataTables_scrollBody',
  sScrollFoot: 'dataTables_scrollFoot',
  sScrollFootInner: 'dataTables_scrollFootInner',
  sHeaderTH: '',
  sFooterTH: '',
  sSortJUIAsc: '',
  sSortJUIDesc: '',
  sSortJUI: '',
  sSortJUIAscAllowed: '',
  sSortJUIDescAllowed: '',
  sSortJUIWrapper: '',
  sSortIcon: '',
  sJUIHeader: '',
  sJUIFooter: ''
})
var Pm = le.ext.pager
function Ls(e, t) {
  var r = [],
    n = Pm.numbers_length,
    i = Math.floor(n / 2)
  return (
    t <= n
      ? (r = qo(0, t))
      : e <= i
        ? ((r = qo(0, n - 2)), r.push('ellipsis'), r.push(t - 1))
        : e >= t - 1 - i
          ? ((r = qo(t - (n - 2), t)), r.splice(0, 0, 'ellipsis'), r.splice(0, 0, 0))
          : ((r = qo(e - i + 2, e + i - 1)),
            r.push('ellipsis'),
            r.push(t - 1),
            r.splice(0, 0, 'ellipsis'),
            r.splice(0, 0, 0)),
    (r.DT_el = 'span'),
    r
  )
}
P.extend(Pm, {
  simple: function (e, t) {
    return ['previous', 'next']
  },
  full: function (e, t) {
    return ['first', 'previous', 'next', 'last']
  },
  numbers: function (e, t) {
    return [Ls(e, t)]
  },
  simple_numbers: function (e, t) {
    return ['previous', Ls(e, t), 'next']
  },
  full_numbers: function (e, t) {
    return ['first', 'previous', Ls(e, t), 'next', 'last']
  },
  first_last_numbers: function (e, t) {
    return ['first', Ls(e, t), 'last']
  },
  _numbers: Ls,
  numbers_length: 7
})
P.extend(!0, le.ext.renderer, {
  pageButton: {
    _: function (e, t, r, n, i, s) {
      var a = e.oClasses,
        d = e.oLanguage.oPaginate,
        f = e.oLanguage.oAria.paginate || {},
        g,
        p,
        y = function (C, A) {
          var k,
            F,
            N,
            E,
            z = a.sPageButtonDisabled,
            Y = function (rt) {
              Yl(e, rt.data.action, !0)
            }
          for (k = 0, F = A.length; k < F; k++)
            if (((E = A[k]), Array.isArray(E))) {
              var ue = P('<' + (E.DT_el || 'div') + '/>').appendTo(C)
              y(ue, E)
            } else {
              var ke = !1
              switch (((g = null), (p = E), E)) {
                case 'ellipsis':
                  C.append('<span class="ellipsis">&#x2026;</span>')
                  break
                case 'first':
                  ;((g = d.sFirst), i === 0 && (ke = !0))
                  break
                case 'previous':
                  ;((g = d.sPrevious), i === 0 && (ke = !0))
                  break
                case 'next':
                  ;((g = d.sNext), (s === 0 || i === s - 1) && (ke = !0))
                  break
                case 'last':
                  ;((g = d.sLast), (s === 0 || i === s - 1) && (ke = !0))
                  break
                default:
                  ;((g = e.fnFormatNumber(E + 1)), (p = i === E ? a.sPageButtonActive : ''))
                  break
              }
              if (g !== null) {
                var m = e.oInit.pagingTag || 'a'
                ;(ke && (p += ' ' + z),
                  (N = P('<' + m + '>', {
                    class: a.sPageButton + ' ' + p,
                    'aria-controls': e.sTableId,
                    'aria-disabled': ke ? 'true' : null,
                    'aria-label': f[E],
                    role: 'link',
                    'aria-current': p === a.sPageButtonActive ? 'page' : null,
                    'data-dt-idx': E,
                    tabindex: ke ? -1 : e.iTabIndex,
                    id: r === 0 && typeof E == 'string' ? e.sTableId + '_' + E : null
                  })
                    .html(g)
                    .appendTo(C)),
                  Zu(N, { action: E }, Y))
              }
            }
        },
        _
      try {
        _ = P(t).find(document.activeElement).data('dt-idx')
      } catch {}
      ;(y(P(t).empty(), n),
        _ !== void 0 &&
          P(t)
            .find('[data-dt-idx=' + _ + ']')
            .trigger('focus'))
    }
  }
})
P.extend(le.ext.type.detect, [
  function (e, t) {
    var r = t.oLanguage.sDecimal
    return du(e, r) ? 'num' + r : null
  },
  function (e, t) {
    if (e && !(e instanceof Date) && !_w.test(e)) return null
    var r = Date.parse(e)
    return (r !== null && !isNaN(r)) || Wr(e) ? 'date' : null
  },
  function (e, t) {
    var r = t.oLanguage.sDecimal
    return du(e, r, !0) ? 'num-fmt' + r : null
  },
  function (e, t) {
    var r = t.oLanguage.sDecimal
    return Xf(e, r) ? 'html-num' + r : null
  },
  function (e, t) {
    var r = t.oLanguage.sDecimal
    return Xf(e, r, !0) ? 'html-num-fmt' + r : null
  },
  function (e, t) {
    return Wr(e) || (typeof e == 'string' && e.indexOf('<') !== -1) ? 'html' : null
  }
])
P.extend(le.ext.type.search, {
  html: function (e) {
    return Wr(e) ? e : typeof e == 'string' ? e.replace(Kf, ' ').replace(xl, '') : ''
  },
  string: function (e) {
    return Wr(e) ? e : typeof e == 'string' ? e.replace(Kf, ' ') : e
  }
})
var Qa = function (e, t, r, n) {
  if (e !== 0 && (!e || e === '-')) return -1 / 0
  var i = typeof e
  return i === 'number' || i === 'bigint'
    ? e
    : (t && (e = Kp(e, t)), e.replace && (r && (e = e.replace(r, '')), n && (e = e.replace(n, ''))), e * 1)
}
function bu(e) {
  P.each(
    {
      num: function (t) {
        return Qa(t, e)
      },
      'num-fmt': function (t) {
        return Qa(t, e, uu)
      },
      'html-num': function (t) {
        return Qa(t, e, xl)
      },
      'html-num-fmt': function (t) {
        return Qa(t, e, xl, uu)
      }
    },
    function (t, r) {
      ;((dn.type.order[t + e + '-pre'] = r), t.match(/^html\-/) && (dn.type.search[t + e] = dn.type.search.html))
    }
  )
}
P.extend(dn.type.order, {
  'date-pre': function (e) {
    var t = Date.parse(e)
    return isNaN(t) ? -1 / 0 : t
  },
  'html-pre': function (e) {
    return Wr(e) ? '' : e.replace ? e.replace(/<.*?>/g, '').toLowerCase() : e + ''
  },
  'string-pre': function (e) {
    return Wr(e) ? '' : typeof e == 'string' ? e.toLowerCase() : e.toString ? e.toString() : ''
  },
  'string-asc': function (e, t) {
    return e < t ? -1 : e > t ? 1 : 0
  },
  'string-desc': function (e, t) {
    return e < t ? 1 : e > t ? -1 : 0
  }
})
bu('')
P.extend(!0, le.ext.renderer, {
  header: {
    _: function (e, t, r, n) {
      P(e.nTable).on('order.dt.DT', function (i, s, a, d) {
        if (e === s) {
          var f = r.idx
          t.removeClass(n.sSortAsc + ' ' + n.sSortDesc).addClass(
            d[f] == 'asc' ? n.sSortAsc : d[f] == 'desc' ? n.sSortDesc : r.sSortingClass
          )
        }
      })
    },
    jqueryui: function (e, t, r, n) {
      ;(P('<div/>')
        .addClass(n.sSortJUIWrapper)
        .append(t.contents())
        .append(P('<span/>').addClass(n.sSortIcon + ' ' + r.sSortingClassJUI))
        .appendTo(t),
        P(e.nTable).on('order.dt.DT', function (i, s, a, d) {
          if (e === s) {
            var f = r.idx
            ;(t
              .removeClass(n.sSortAsc + ' ' + n.sSortDesc)
              .addClass(d[f] == 'asc' ? n.sSortAsc : d[f] == 'desc' ? n.sSortDesc : r.sSortingClass),
              t
                .find('span.' + n.sSortIcon)
                .removeClass(
                  n.sSortJUIAsc +
                    ' ' +
                    n.sSortJUIDesc +
                    ' ' +
                    n.sSortJUI +
                    ' ' +
                    n.sSortJUIAscAllowed +
                    ' ' +
                    n.sSortJUIDescAllowed
                )
                .addClass(d[f] == 'asc' ? n.sSortJUIAsc : d[f] == 'desc' ? n.sSortJUIDesc : r.sSortingClassJUI))
          }
        }))
    }
  }
})
var dl = function (e) {
  return (
    Array.isArray(e) && (e = e.join(',')),
    typeof e == 'string'
      ? e.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      : e
  )
}
function Zf(e, t, r, n, i) {
  return window.moment ? e[t](i) : window.luxon ? e[r](i) : n ? e[n](i) : e
}
var eh = !1
function Dl(e, t, r) {
  var n
  if (window.moment) {
    if (((n = window.moment.utc(e, t, r, !0)), !n.isValid())) return null
  } else if (window.luxon) {
    if (
      ((n = t && typeof e == 'string' ? window.luxon.DateTime.fromFormat(e, t) : window.luxon.DateTime.fromISO(e)),
      !n.isValid)
    )
      return null
    n.setLocale(r)
  } else
    t
      ? (eh || alert('DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17'),
        (eh = !0))
      : (n = new Date(e))
  return n
}
function Uc(e) {
  return function (t, r, n, i) {
    arguments.length === 0
      ? ((n = 'en'), (r = null), (t = null))
      : arguments.length === 1
        ? ((n = 'en'), (r = t), (t = null))
        : arguments.length === 2 && ((n = r), (r = t), (t = null))
    var s = 'datetime-' + r
    return (
      le.ext.type.order[s] ||
        (le.ext.type.detect.unshift(function (a) {
          return a === s ? s : !1
        }),
        (le.ext.type.order[s + '-asc'] = function (a, d) {
          var f = a.valueOf(),
            g = d.valueOf()
          return f === g ? 0 : f < g ? -1 : 1
        }),
        (le.ext.type.order[s + '-desc'] = function (a, d) {
          var f = a.valueOf(),
            g = d.valueOf()
          return f === g ? 0 : f > g ? -1 : 1
        })),
      function (a, d) {
        if (a == null)
          if (i === '--now') {
            var f = new Date()
            a = new Date(
              Date.UTC(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), f.getMinutes(), f.getSeconds())
            )
          } else a = ''
        if (d === 'type') return s
        if (a === '') return d !== 'sort' ? '' : Dl('0000-01-01 00:00:00', null, n)
        if (r !== null && t === r && d !== 'sort' && d !== 'type' && !(a instanceof Date)) return a
        var g = Dl(a, t, n)
        if (g === null) return a
        if (d === 'sort') return g
        var p = r === null ? Zf(g, 'toDate', 'toJSDate', '')[e]() : Zf(g, 'format', 'toFormat', 'toISOString', r)
        return d === 'display' ? dl(p) : p
      }
    )
  }
}
var Rm = ',',
  Lm = '.'
if (window.Intl !== void 0)
  try {
    for (var Ms = new Intl.NumberFormat().formatToParts(100000.1), Ho = 0; Ho < Ms.length; Ho++)
      Ms[Ho].type === 'group' ? (Rm = Ms[Ho].value) : Ms[Ho].type === 'decimal' && (Lm = Ms[Ho].value)
  } catch {}
le.datetime = function (e, t) {
  var r = 'datetime-detect-' + e
  ;(t || (t = 'en'),
    le.ext.type.order[r] ||
      (le.ext.type.detect.unshift(function (n) {
        var i = Dl(n, e, t)
        return n === '' || i ? r : !1
      }),
      (le.ext.type.order[r + '-pre'] = function (n) {
        return Dl(n, e, t) || 0
      })))
}
le.render = {
  date: Uc('toLocaleDateString'),
  datetime: Uc('toLocaleString'),
  time: Uc('toLocaleTimeString'),
  number: function (e, t, r, n, i) {
    return (
      e == null && (e = Rm),
      t == null && (t = Lm),
      {
        display: function (s) {
          if ((typeof s != 'number' && typeof s != 'string') || s === '' || s === null) return s
          var a = s < 0 ? '-' : '',
            d = parseFloat(s)
          if (isNaN(d)) return dl(s)
          ;((d = d.toFixed(r)), (s = Math.abs(d)))
          var f = parseInt(s, 10),
            g = r ? t + (s - f).toFixed(r).substring(2) : ''
          return (
            f === 0 && parseFloat(g) === 0 && (a = ''),
            a + (n || '') + f.toString().replace(/\B(?=(\d{3})+(?!\d))/g, e) + g + (i || '')
          )
        }
      }
    )
  },
  text: function () {
    return { display: dl, filter: dl }
  }
}
function Mm(e) {
  return function () {
    var t = [Al(this[le.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments))
    return le.ext.internal[e].apply(this, t)
  }
}
P.extend(le.ext.internal, {
  _fnExternApiFunc: Mm,
  _fnBuildAjax: Jl,
  _fnAjaxUpdate: rm,
  _fnAjaxParameters: im,
  _fnAjaxUpdateDraw: om,
  _fnAjaxDataSrc: ba,
  _fnAddColumn: qu,
  _fnColumnOptions: Sl,
  _fnAdjustColumnSizing: pa,
  _fnVisibleToColumnIndex: ma,
  _fnColumnIndexToVisible: va,
  _fnVisbleColumns: is,
  _fnGetColumns: zl,
  _fnColumnTypes: Uu,
  _fnApplyColumnDefs: Zp,
  _fnHungarianMap: ha,
  _fnCamelToHungarian: ui,
  _fnLanguageCompat: fu,
  _fnBrowserDetect: Qp,
  _fnAddData: Ui,
  _fnAddTr: Kl,
  _fnNodeToDataIndex: Tw,
  _fnNodeToColumnIndex: Aw,
  _fnGetCellData: er,
  _fnSetCellData: em,
  _fnSplitObjNotation: hu,
  _fnGetObjectDataFn: es,
  _fnSetObjectDataFn: Fi,
  _fnGetDataMaster: pu,
  _fnClearTable: Xl,
  _fnDeleteIndex: cl,
  _fnInvalidate: ga,
  _fnGetRowElements: Wu,
  _fnCreateTr: Vu,
  _fnBuildHead: tm,
  _fnDrawHead: ia,
  _fnDraw: Wi,
  _fnReDraw: go,
  _fnAddOptionsHtml: nm,
  _fnDetectHeader: oa,
  _fnGetUniqueThs: Gl,
  _fnFeatureHtmlFilter: sm,
  _fnFilterComplete: ya,
  _fnFilterCustom: am,
  _fnFilterColumn: lm,
  _fnFilter: cm,
  _fnFilterCreateSearch: Ku,
  _fnEscapeRegex: Xu,
  _fnFilterData: um,
  _fnFeatureHtmlInfo: dm,
  _fnUpdateInfo: fm,
  _fnInfoMacros: hm,
  _fnInitialise: zs,
  _fnInitComplete: Cl,
  _fnLengthChange: Gu,
  _fnFeatureHtmlLength: pm,
  _fnFeatureHtmlPaginate: mm,
  _fnPageChange: Yl,
  _fnFeatureHtmlProcessing: vm,
  _fnProcessingDisplay: lr,
  _fnFeatureHtmlTable: gm,
  _fnScrollDraw: Ql,
  _fnApplyToChildren: Nr,
  _fnCalculateColumnWidths: Ju,
  _fnThrottle: Yu,
  _fnConvertToWidth: bm,
  _fnGetWidestNode: ym,
  _fnGetMaxLenString: _m,
  _fnStringToCss: en,
  _fnSortFlatten: os,
  _fnSort: wm,
  _fnSortAria: xm,
  _fnSortListener: mu,
  _fnSortAttachListener: Qu,
  _fnSortingClasses: Tl,
  _fnSortData: Sm,
  _fnSaveState: _a,
  _fnLoadState: Cm,
  _fnImplementState: vu,
  _fnSettingsFromNode: Al,
  _fnLog: vr,
  _fnMap: Sr,
  _fnBindAction: Zu,
  _fnCallbackReg: $n,
  _fnCallbackFire: Et,
  _fnLengthOverflow: ed,
  _fnRenderer: td,
  _fnDataSource: Pn,
  _fnRowAttributes: zu,
  _fnExtend: gu,
  _fnCalculateEnd: function () {}
})
P.fn.dataTable = le
le.$ = P
P.fn.dataTableSettings = le.settings
P.fn.dataTableExt = le.ext
P.fn.DataTable = function (e) {
  return P(this).dataTable(e).api()
}
P.each(le, function (e, t) {
  P.fn.DataTable[e] = t
})
const Hw = {
    name: 'EmployeeTable',
    setup() {
      const e = qe(null),
        t = qe(null),
        r = qe(!1),
        n = qe(!1),
        i = qe({}),
        s = qe([]),
        a = nn({
          id: null,
          employee_number: '',
          name: '',
          email: '',
          phone: '',
          employee_type_id: '',
          position: '',
          department: '',
          hire_date: '',
          photo: null,
          is_active: !0
        }),
        d = () => {
          ;(t.value && t.value.destroy(),
            (t.value = gt(e.value).DataTable({
              processing: !0,
              serverSide: !0,
              ajax: {
                url: '/employees/data',
                type: 'GET',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') }
              },
              columns: [
                {
                  data: 'photo',
                  name: 'photo',
                  orderable: !1,
                  searchable: !1,
                  render: function (E, z, Y) {
                    return E
                      ? `<span class="avatar avatar-sm" style="background-image: url(${E})"></span>`
                      : `<span class="avatar avatar-sm">${Y.name.charAt(0)}</span>`
                  }
                },
                { data: 'employee_number', name: 'employee_number' },
                { data: 'name', name: 'name' },
                {
                  data: 'employee_type.name',
                  name: 'employee_type.name',
                  render: function (E, z, Y) {
                    return `<span class="badge bg-${{ 'Permanent Teacher': 'success', 'Honorary Teacher': 'info', 'Permanent Staff': 'primary', 'Honorary Staff': 'warning' }[E] || 'secondary'}">${E}</span>`
                  }
                },
                { data: 'department', name: 'department' },
                { data: 'position', name: 'position' },
                {
                  data: 'is_active',
                  name: 'is_active',
                  render: function (E, z, Y) {
                    return E
                      ? '<span class="badge bg-success">Active</span>'
                      : '<span class="badge bg-danger">Inactive</span>'
                  }
                },
                {
                  data: 'id',
                  name: 'actions',
                  orderable: !1,
                  searchable: !1,
                  render: function (E, z, Y) {
                    return `
                <div class="btn-group" role="group">
                  <button onclick="window.editEmployee(${E})" class="btn btn-sm btn-outline-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"/>
                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"/>
                      <path d="M16 5l3 3"/>
                    </svg>
                  </button>
                  <button onclick="window.toggleEmployeeStatus(${E})" class="btn btn-sm btn-outline-${Y.is_active ? 'danger' : 'success'}">
                    ${Y.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              `
                  }
                }
              ],
              order: [[1, 'asc']],
              pageLength: 25,
              responsive: !0,
              language: {
                search: 'Search employees:',
                lengthMenu: 'Show _MENU_ employees per page',
                info: 'Showing _START_ to _END_ of _TOTAL_ employees',
                paginate: { first: 'First', last: 'Last', next: 'Next', previous: 'Previous' }
              }
            })))
        },
        f = async () => {
          try {
            const E = await Fe.get('/employee-types/data')
            s.value = E.data.data || [
              { id: 1, name: 'Permanent Teacher' },
              { id: 2, name: 'Honorary Teacher' },
              { id: 3, name: 'Permanent Staff' },
              { id: 4, name: 'Honorary Staff' }
            ]
          } catch (E) {
            ;(console.error('Error loading employee types:', E),
              (s.value = [
                { id: 1, name: 'Permanent Teacher' },
                { id: 2, name: 'Honorary Teacher' },
                { id: 3, name: 'Permanent Staff' },
                { id: 4, name: 'Honorary Staff' }
              ]))
          }
        },
        g = () => {
          ;((r.value = !1), C(), gt('#employeeModal').modal('show'))
        },
        p = async E => {
          try {
            const Y = (await Fe.get(`/employees/${E}/edit`)).data
            ;((r.value = !0), Object.assign(a, Y), gt('#employeeModal').modal('show'))
          } catch (z) {
            ;(console.error('Error loading employee:', z), alert('Failed to load employee data'))
          }
        },
        y = async () => {
          var E
          ;((n.value = !0), (i.value = {}))
          try {
            const z = new FormData()
            Object.keys(a).forEach(ke => {
              a[ke] !== null &&
                a[ke] !== void 0 &&
                ((ke === 'photo' && a[ke] instanceof File) || ke !== 'photo') &&
                z.append(ke, a[ke])
            })
            let Y
            ;(r.value
              ? (z.append('_method', 'PUT'),
                (Y = await Fe.post(`/employees/${a.id}`, z, { headers: { 'Content-Type': 'multipart/form-data' } })))
              : (Y = await Fe.post('/employees', z, { headers: { 'Content-Type': 'multipart/form-data' } })),
              gt('#employeeModal').modal('hide'),
              t.value.ajax.reload())
            const ue = r.value ? 'Employee updated successfully' : 'Employee created successfully'
            alert(ue)
          } catch (z) {
            ;((E = z.response) == null ? void 0 : E.status) === 422
              ? (i.value = z.response.data.errors)
              : (console.error('Error saving employee:', z), alert('Failed to save employee. Please try again.'))
          } finally {
            n.value = !1
          }
        },
        _ = async E => {
          if (confirm("Are you sure you want to change this employee's status?"))
            try {
              const Y = t.value.row(`[data-id="${E}"]`).data().is_active ? 'deactivate' : 'activate'
              ;(await Fe.post(`/employees/${E}/${Y}`),
                t.value.ajax.reload(),
                alert('Employee status updated successfully'))
            } catch (z) {
              ;(console.error('Error toggling employee status:', z), alert('Failed to update employee status'))
            }
        },
        C = () => {
          ;(Object.assign(a, {
            id: null,
            employee_number: '',
            name: '',
            email: '',
            phone: '',
            employee_type_id: '',
            position: '',
            department: '',
            hire_date: '',
            photo: null,
            is_active: !0
          }),
            (i.value = {}))
        },
        A = E => {
          const z = E.target.files[0]
          z && (a.photo = z)
        },
        k = E => {
          E === 'all' ? t.value.column(3).search('').draw() : t.value.column(3).search(E.replace('_', ' ')).draw()
        },
        F = E => {
          const z = E === 'active' ? 'Active' : 'Inactive'
          t.value.column(6).search(z).draw()
        },
        N = () => {
          window.open('/employees/export', '_blank')
        }
      return (
        qi(async () => {
          ;(await f(), await Bi(), d(), (window.editEmployee = p), (window.toggleEmployeeStatus = _))
        }),
        {
          employeeTable: e,
          editMode: r,
          saving: n,
          errors: i,
          employeeTypes: s,
          employeeForm: a,
          showAddModal: g,
          saveEmployee: y,
          resetForm: C,
          handlePhotoUpload: A,
          filterByType: k,
          filterByStatus: F,
          exportEmployees: N
        }
      )
    }
  },
  $w = { class: 'page' },
  Bw = { class: 'page-header d-print-none' },
  qw = { class: 'container-xl' },
  Uw = { class: 'row g-2 align-items-center' },
  Ww = { class: 'col-auto ms-auto d-print-none' },
  Vw = { class: 'btn-list' },
  zw = { class: 'd-none d-sm-inline' },
  Kw = { class: 'page-body' },
  Xw = { class: 'container-xl' },
  Gw = { class: 'row row-deck row-cards' },
  Jw = { class: 'col-12' },
  Yw = { class: 'card' },
  Qw = { class: 'card-header' },
  Zw = { class: 'card-actions' },
  ex = { class: 'dropdown' },
  tx = { class: 'dropdown-menu' },
  nx = { class: 'card-body' },
  rx = { class: 'table-responsive' },
  ix = { ref: 'employeeTable', class: 'table table-vcenter card-table', style: { width: '100%' } },
  ox = { class: 'modal modal-blur fade', id: 'employeeModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  sx = { class: 'modal-dialog modal-lg modal-dialog-centered', role: 'document' },
  ax = { class: 'modal-content' },
  lx = { class: 'modal-header' },
  cx = { class: 'modal-title' },
  ux = { class: 'modal-body' },
  dx = { class: 'row' },
  fx = { class: 'col-lg-6' },
  hx = { class: 'mb-3' },
  px = { key: 0, class: 'invalid-feedback' },
  mx = { class: 'col-lg-6' },
  vx = { class: 'mb-3' },
  gx = { key: 0, class: 'invalid-feedback' },
  bx = { class: 'row' },
  yx = { class: 'col-lg-6' },
  _x = { class: 'mb-3' },
  wx = { key: 0, class: 'invalid-feedback' },
  xx = { class: 'col-lg-6' },
  Sx = { class: 'mb-3' },
  Cx = { key: 0, class: 'invalid-feedback' },
  Tx = { class: 'row' },
  Ax = { class: 'col-lg-6' },
  Dx = { class: 'mb-3' },
  kx = ['value'],
  Ex = { key: 0, class: 'invalid-feedback' },
  Ox = { class: 'col-lg-6' },
  Px = { class: 'mb-3' },
  Rx = { key: 0, class: 'invalid-feedback' },
  Lx = { class: 'row' },
  Mx = { class: 'col-lg-6' },
  Ix = { class: 'mb-3' },
  Fx = { key: 0, class: 'invalid-feedback' },
  jx = { class: 'col-lg-6' },
  Nx = { class: 'mb-3' },
  Hx = { key: 0, class: 'invalid-feedback' },
  $x = { class: 'mb-3' },
  Bx = { key: 0, class: 'invalid-feedback' },
  qx = { class: 'mb-3' },
  Ux = { class: 'form-check' },
  Wx = { class: 'modal-footer' },
  Vx = ['disabled'],
  zx = { key: 0, class: 'spinner-border spinner-border-sm me-2', role: 'status' }
function Kx(e, t, r, n, i, s) {
  return (
    he(),
    pe('div', $w, [
      l('div', Bw, [
        l('div', qw, [
          l('div', Uw, [
            t[22] ||
              (t[22] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' Human Resources '),
                  l('h2', { class: 'page-title' }, ' Employee Management ')
                ],
                -1
              )),
            l('div', Ww, [
              l('div', Vw, [
                l('span', zw, [
                  l(
                    'button',
                    { onClick: t[0] || (t[0] = (...a) => n.exportEmployees && n.exportEmployees(...a)), class: 'btn' },
                    t[20] ||
                      (t[20] = [
                        Tr(
                          '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M9 14l2 2l4 -4"></path></svg> Export ',
                          2
                        )
                      ])
                  )
                ]),
                l(
                  'button',
                  {
                    onClick: t[1] || (t[1] = (...a) => n.showAddModal && n.showAddModal(...a)),
                    class: 'btn btn-primary d-none d-sm-inline-block'
                  },
                  t[21] ||
                    (t[21] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M12 5l0 14' }),
                          l('path', { d: 'M5 12l14 0' })
                        ],
                        -1
                      ),
                      Kt(' Add Employee ')
                    ])
                )
              ])
            ])
          ])
        ])
      ]),
      l('div', Kw, [
        l('div', Xw, [
          l('div', Gw, [
            l('div', Jw, [
              l('div', Yw, [
                l('div', Qw, [
                  t[25] || (t[25] = l('h3', { class: 'card-title' }, 'Employees', -1)),
                  l('div', Zw, [
                    l('div', ex, [
                      t[24] ||
                        (t[24] = l(
                          'button',
                          { class: 'btn dropdown-toggle', 'data-bs-toggle': 'dropdown' },
                          [
                            l(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                class: 'icon',
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24',
                                'stroke-width': '2',
                                stroke: 'currentColor',
                                fill: 'none',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                l('path', {
                                  d: 'M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5'
                                })
                              ]
                            ),
                            Kt(' Filter ')
                          ],
                          -1
                        )),
                      l('div', tx, [
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[2] || (t[2] = a => n.filterByType('all')) },
                          'All Employees'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[3] || (t[3] = a => n.filterByType('permanent_teacher'))
                          },
                          'Permanent Teachers'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[4] || (t[4] = a => n.filterByType('honorary_teacher'))
                          },
                          'Honorary Teachers'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[5] || (t[5] = a => n.filterByType('permanent_staff'))
                          },
                          'Permanent Staff'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[6] || (t[6] = a => n.filterByType('honorary_staff'))
                          },
                          'Honorary Staff'
                        ),
                        t[23] || (t[23] = l('div', { class: 'dropdown-divider' }, null, -1)),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[7] || (t[7] = a => n.filterByStatus('active'))
                          },
                          'Active Only'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[8] || (t[8] = a => n.filterByStatus('inactive'))
                          },
                          'Inactive Only'
                        )
                      ])
                    ])
                  ])
                ]),
                l('div', nx, [
                  l('div', rx, [
                    l(
                      'table',
                      ix,
                      t[26] ||
                        (t[26] = [
                          l(
                            'thead',
                            null,
                            [
                              l('tr', null, [
                                l('th', null, 'Photo'),
                                l('th', null, 'Employee #'),
                                l('th', null, 'Name'),
                                l('th', null, 'Type'),
                                l('th', null, 'Department'),
                                l('th', null, 'Position'),
                                l('th', null, 'Status'),
                                l('th', null, 'Actions')
                              ])
                            ],
                            -1
                          )
                        ]),
                      512
                    )
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      l('div', ox, [
        l('div', sx, [
          l('div', ax, [
            l('div', lx, [
              l('h5', cx, Q(n.editMode ? 'Edit Employee' : 'Add New Employee'), 1),
              t[27] ||
                (t[27] = l(
                  'button',
                  { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' },
                  null,
                  -1
                ))
            ]),
            l(
              'form',
              { onSubmit: t[19] || (t[19] = ta((...a) => n.saveEmployee && n.saveEmployee(...a), ['prevent'])) },
              [
                l('div', ux, [
                  l('div', dx, [
                    l('div', fx, [
                      l('div', hx, [
                        t[28] || (t[28] = l('label', { class: 'form-label' }, 'Employee Number', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.employee_number }]),
                              'onUpdate:modelValue': t[9] || (t[9] = a => (n.employeeForm.employee_number = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.employee_number]]
                        ),
                        n.errors.employee_number ? (he(), pe('div', px, Q(n.errors.employee_number[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', mx, [
                      l('div', vx, [
                        t[29] || (t[29] = l('label', { class: 'form-label' }, 'Full Name', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.name }]),
                              'onUpdate:modelValue': t[10] || (t[10] = a => (n.employeeForm.name = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.name]]
                        ),
                        n.errors.name ? (he(), pe('div', gx, Q(n.errors.name[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', bx, [
                    l('div', yx, [
                      l('div', _x, [
                        t[30] || (t[30] = l('label', { class: 'form-label' }, 'Email', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'email',
                              class: dt(['form-control', { 'is-invalid': n.errors.email }]),
                              'onUpdate:modelValue': t[11] || (t[11] = a => (n.employeeForm.email = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.email]]
                        ),
                        n.errors.email ? (he(), pe('div', wx, Q(n.errors.email[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', xx, [
                      l('div', Sx, [
                        t[31] || (t[31] = l('label', { class: 'form-label' }, 'Phone', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'tel',
                              class: dt(['form-control', { 'is-invalid': n.errors.phone }]),
                              'onUpdate:modelValue': t[12] || (t[12] = a => (n.employeeForm.phone = a))
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.phone]]
                        ),
                        n.errors.phone ? (he(), pe('div', Cx, Q(n.errors.phone[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', Tx, [
                    l('div', Ax, [
                      l('div', Dx, [
                        t[33] || (t[33] = l('label', { class: 'form-label' }, 'Employee Type', -1)),
                        Ct(
                          l(
                            'select',
                            {
                              class: dt(['form-select', { 'is-invalid': n.errors.employee_type_id }]),
                              'onUpdate:modelValue': t[13] || (t[13] = a => (n.employeeForm.employee_type_id = a)),
                              required: ''
                            },
                            [
                              t[32] || (t[32] = l('option', { value: '' }, 'Select Type', -1)),
                              (he(!0),
                              pe(
                                tn,
                                null,
                                or(
                                  n.employeeTypes,
                                  a => (he(), pe('option', { key: a.id, value: a.id }, Q(a.name), 9, kx))
                                ),
                                128
                              ))
                            ],
                            2
                          ),
                          [[Zs, n.employeeForm.employee_type_id]]
                        ),
                        n.errors.employee_type_id
                          ? (he(), pe('div', Ex, Q(n.errors.employee_type_id[0]), 1))
                          : Ye('', !0)
                      ])
                    ]),
                    l('div', Ox, [
                      l('div', Px, [
                        t[34] || (t[34] = l('label', { class: 'form-label' }, 'Position', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.position }]),
                              'onUpdate:modelValue': t[14] || (t[14] = a => (n.employeeForm.position = a))
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.position]]
                        ),
                        n.errors.position ? (he(), pe('div', Rx, Q(n.errors.position[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', Lx, [
                    l('div', Mx, [
                      l('div', Ix, [
                        t[35] || (t[35] = l('label', { class: 'form-label' }, 'Department', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.department }]),
                              'onUpdate:modelValue': t[15] || (t[15] = a => (n.employeeForm.department = a))
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.department]]
                        ),
                        n.errors.department ? (he(), pe('div', Fx, Q(n.errors.department[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', jx, [
                      l('div', Nx, [
                        t[36] || (t[36] = l('label', { class: 'form-label' }, 'Hire Date', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'date',
                              class: dt(['form-control', { 'is-invalid': n.errors.hire_date }]),
                              'onUpdate:modelValue': t[16] || (t[16] = a => (n.employeeForm.hire_date = a))
                            },
                            null,
                            2
                          ),
                          [[ln, n.employeeForm.hire_date]]
                        ),
                        n.errors.hire_date ? (he(), pe('div', Hx, Q(n.errors.hire_date[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', $x, [
                    t[37] || (t[37] = l('label', { class: 'form-label' }, 'Profile Photo', -1)),
                    l(
                      'input',
                      {
                        type: 'file',
                        class: dt(['form-control', { 'is-invalid': n.errors.photo }]),
                        onChange: t[17] || (t[17] = (...a) => n.handlePhotoUpload && n.handlePhotoUpload(...a)),
                        accept: 'image/*'
                      },
                      null,
                      34
                    ),
                    n.errors.photo ? (he(), pe('div', Bx, Q(n.errors.photo[0]), 1)) : Ye('', !0),
                    t[38] ||
                      (t[38] = l(
                        'small',
                        { class: 'form-hint' },
                        'Upload a clear photo for face recognition system.',
                        -1
                      ))
                  ]),
                  l('div', qx, [
                    l('label', Ux, [
                      Ct(
                        l(
                          'input',
                          {
                            type: 'checkbox',
                            class: 'form-check-input',
                            'onUpdate:modelValue': t[18] || (t[18] = a => (n.employeeForm.is_active = a))
                          },
                          null,
                          512
                        ),
                        [[Ii, n.employeeForm.is_active]]
                      ),
                      t[39] || (t[39] = l('span', { class: 'form-check-label' }, 'Active Employee', -1))
                    ])
                  ])
                ]),
                l('div', Wx, [
                  t[40] ||
                    (t[40] = l(
                      'button',
                      { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                      'Cancel',
                      -1
                    )),
                  l(
                    'button',
                    { type: 'submit', class: 'btn btn-primary', disabled: n.saving },
                    [
                      n.saving ? (he(), pe('span', zx)) : Ye('', !0),
                      Kt(' ' + Q(n.editMode ? 'Update Employee' : 'Create Employee'), 1)
                    ],
                    8,
                    Vx
                  )
                ])
              ],
              32
            )
          ])
        ])
      ])
    ])
  )
}
const Im = yo(Hw, [['render', Kx]]),
  Xx = {
    name: 'AttendanceForm',
    setup() {
      const e = qe(null),
        t = qe(null),
        r = qe(!0),
        n = qe(!1),
        i = nn({ status: 'Not Checked In', checkIn: null, checkOut: null, progress: 0 }),
        s = nn({ valid: !1, message: 'Location Unknown', distance: 0 }),
        a = nn({ today: 0, thisWeek: 0 }),
        d = () => {
          ;(t.value && t.value.destroy(),
            (t.value = gt(e.value).DataTable({
              processing: !0,
              serverSide: !0,
              ajax: {
                url: '/api/v1/attendance',
                type: 'GET',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') }
              },
              columns: [
                { data: 'date', name: 'date' },
                { data: 'check_in_time', name: 'check_in_time' },
                { data: 'check_out_time', name: 'check_out_time' },
                {
                  data: 'total_hours',
                  name: 'total_hours',
                  render: function (k) {
                    return k ? k + 'h' : '-'
                  }
                },
                {
                  data: 'status',
                  name: 'status',
                  render: function (k) {
                    return `<span class="badge bg-${{ present: 'success', late: 'warning', absent: 'danger', half_day: 'info' }[k] || 'secondary'}">${k}</span>`
                  }
                },
                { data: 'location_name', name: 'location_name' },
                {
                  data: 'id',
                  name: 'actions',
                  orderable: !1,
                  searchable: !1,
                  render: function (k, F, N) {
                    return `
                <div class="btn-group" role="group">
                  <button onclick="window.viewAttendanceDetails(${k})" class="btn btn-sm btn-outline-secondary">
                    View Details
                  </button>
                </div>
              `
                  }
                }
              ],
              order: [[0, 'desc']],
              pageLength: 15,
              responsive: !0
            })))
        },
        f = () =>
          new Promise((k, F) => {
            'geolocation' in navigator
              ? navigator.geolocation.getCurrentPosition(
                  async N => {
                    const { latitude: E, longitude: z } = N.coords
                    try {
                      const Y = await Fe.post('/api/v1/attendance/validate-location', { latitude: E, longitude: z })
                      ;((s.valid = Y.data.valid),
                        (s.message = Y.data.message),
                        (s.distance = Y.data.distance),
                        k({ latitude: E, longitude: z, valid: Y.data.valid }))
                    } catch (Y) {
                      F(Y)
                    }
                  },
                  N => {
                    ;((s.message = 'Location access denied'), F(N))
                  }
                )
              : F(new Error('Geolocation not supported'))
          }),
        g = async () => {
          try {
            const k = await f()
            if (!k.valid) {
              alert('You must be within the office location to check in.')
              return
            }
            const F = await Fe.post('/api/v1/attendance/check-in', { latitude: k.latitude, longitude: k.longitude })
            ;((i.status = 'Checked In'),
              (i.checkIn = new Date().toLocaleTimeString('en-US', { hour12: !1, hour: '2-digit', minute: '2-digit' })),
              (r.value = !1),
              (n.value = !0),
              t.value.ajax.reload(),
              alert('Successfully checked in!'))
          } catch (k) {
            ;(console.error('Check-in error:', k), alert('Failed to check in. Please try again.'))
          }
        },
        p = async () => {
          try {
            const k = await Fe.post('/api/v1/attendance/check-out')
            ;((i.status = 'Checked Out'),
              (i.checkOut = new Date().toLocaleTimeString('en-US', { hour12: !1, hour: '2-digit', minute: '2-digit' })),
              (n.value = !1),
              (r.value = !0),
              t.value.ajax.reload(),
              alert('Successfully checked out!'))
          } catch (k) {
            ;(console.error('Check-out error:', k), alert('Failed to check out. Please try again.'))
          }
        },
        y = k => {
          k === 'all' ? t.value.column(4).search('').draw() : t.value.column(4).search(k).draw()
        },
        _ = () => {
          window.open('/api/v1/attendance/export?format=csv', '_blank')
        },
        C = async () => {
          try {
            const k = await Fe.get('/api/v1/attendance/today')
            if (k.data.data) {
              const F = k.data.data
              ;((i.checkIn = F.check_in_time),
                (i.checkOut = F.check_out_time),
                (i.status = F.status),
                (r.value = !F.check_in_time),
                (n.value = F.check_in_time && !F.check_out_time))
            }
          } catch (k) {
            console.error('Error loading today status:', k)
          }
        },
        A = k => {
          console.log('View attendance details for ID:', k)
        }
      return (
        qi(async () => {
          ;(await C(), await f().catch(() => {}), await Bi(), d(), (window.viewAttendanceDetails = A))
        }),
        {
          attendanceTable: e,
          todayStatus: i,
          locationStatus: s,
          workingHours: a,
          canCheckIn: r,
          canCheckOut: n,
          checkIn: g,
          checkOut: p,
          filterByStatus: y,
          exportRecords: _
        }
      )
    }
  },
  Gx = { class: 'page' },
  Jx = { class: 'page-header d-print-none' },
  Yx = { class: 'container-xl' },
  Qx = { class: 'row g-2 align-items-center' },
  Zx = { class: 'col-auto ms-auto d-print-none' },
  eS = { class: 'btn-list' },
  tS = ['disabled'],
  nS = ['disabled'],
  rS = { class: 'page-body' },
  iS = { class: 'container-xl' },
  oS = { class: 'row row-deck row-cards mb-3' },
  sS = { class: 'col-md-6 col-lg-4' },
  aS = { class: 'card' },
  lS = { class: 'card-body' },
  cS = { class: 'h1 mb-3' },
  uS = { class: 'd-flex mb-2' },
  dS = { key: 0, class: 'd-flex mb-2' },
  fS = { class: 'progress progress-sm' },
  hS = { class: 'col-md-6 col-lg-4' },
  pS = { class: 'card' },
  mS = { class: 'card-body' },
  vS = { class: 'text-muted' },
  gS = { class: 'col-md-6 col-lg-4' },
  bS = { class: 'card' },
  yS = { class: 'card-body' },
  _S = { class: 'h1 mb-3' },
  wS = { class: 'text-muted' },
  xS = { class: 'row row-deck row-cards' },
  SS = { class: 'col-12' },
  CS = { class: 'card' },
  TS = { class: 'card-header' },
  AS = { class: 'card-actions' },
  DS = { class: 'dropdown' },
  kS = { class: 'dropdown-menu' },
  ES = { class: 'card-body' },
  OS = { class: 'table-responsive' },
  PS = { ref: 'attendanceTable', class: 'table table-vcenter card-table', style: { width: '100%' } }
function RS(e, t, r, n, i, s) {
  return (
    he(),
    pe('div', Gx, [
      l('div', Jx, [
        l('div', Yx, [
          l('div', Qx, [
            t[10] ||
              (t[10] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' Attendance Management '),
                  l('h2', { class: 'page-title' }, ' Attendance Records ')
                ],
                -1
              )),
            l('div', Zx, [
              l('div', eS, [
                l(
                  'button',
                  {
                    onClick: t[0] || (t[0] = (...a) => n.checkIn && n.checkIn(...a)),
                    class: 'btn btn-success',
                    disabled: !n.canCheckIn
                  },
                  t[7] ||
                    (t[7] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M9 11l3 3l8 -8' }),
                          l('path', { d: 'M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9' })
                        ],
                        -1
                      ),
                      Kt(' Check In ')
                    ]),
                  8,
                  tS
                ),
                l(
                  'button',
                  {
                    onClick: t[1] || (t[1] = (...a) => n.checkOut && n.checkOut(...a)),
                    class: 'btn btn-outline-danger',
                    disabled: !n.canCheckOut
                  },
                  t[8] ||
                    (t[8] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M9 11l3 3l8 -8' }),
                          l('path', { d: 'M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9' })
                        ],
                        -1
                      ),
                      Kt(' Check Out ')
                    ]),
                  8,
                  nS
                ),
                l(
                  'button',
                  { onClick: t[2] || (t[2] = (...a) => n.exportRecords && n.exportRecords(...a)), class: 'btn' },
                  t[9] ||
                    (t[9] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M14 3v4a1 1 0 0 0 1 1h4' }),
                          l('path', { d: 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z' })
                        ],
                        -1
                      ),
                      Kt(' Export ')
                    ])
                )
              ])
            ])
          ])
        ])
      ]),
      l('div', rS, [
        l('div', iS, [
          l('div', oS, [
            l('div', sS, [
              l('div', aS, [
                l('div', lS, [
                  t[11] ||
                    (t[11] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, "Today's Status")],
                      -1
                    )),
                  l('div', cS, Q(n.todayStatus.status), 1),
                  l('div', uS, [l('div', null, 'Check-in: ' + Q(n.todayStatus.checkIn || 'Not checked in'), 1)]),
                  n.todayStatus.checkOut
                    ? (he(), pe('div', dS, [l('div', null, 'Check-out: ' + Q(n.todayStatus.checkOut), 1)]))
                    : Ye('', !0),
                  l('div', fS, [
                    l(
                      'div',
                      {
                        class: 'progress-bar bg-primary',
                        style: Go(`width: ${n.todayStatus.progress}%`),
                        role: 'progressbar'
                      },
                      null,
                      4
                    )
                  ])
                ])
              ])
            ]),
            l('div', hS, [
              l('div', pS, [
                l('div', mS, [
                  t[12] ||
                    (t[12] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Location Status')],
                      -1
                    )),
                  l(
                    'div',
                    { class: dt(['h3 mb-3', n.locationStatus.valid ? 'text-success' : 'text-warning']) },
                    Q(n.locationStatus.message),
                    3
                  ),
                  l('div', vS, ' Distance: ' + Q(n.locationStatus.distance) + 'm from office ', 1)
                ])
              ])
            ]),
            l('div', gS, [
              l('div', bS, [
                l('div', yS, [
                  t[13] ||
                    (t[13] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Working Hours')],
                      -1
                    )),
                  l('div', _S, Q(n.workingHours.today) + 'h', 1),
                  l('div', wS, ' This week: ' + Q(n.workingHours.thisWeek) + 'h ', 1)
                ])
              ])
            ])
          ]),
          l('div', xS, [
            l('div', SS, [
              l('div', CS, [
                l('div', TS, [
                  t[15] || (t[15] = l('h3', { class: 'card-title' }, 'Attendance History', -1)),
                  l('div', AS, [
                    l('div', DS, [
                      t[14] ||
                        (t[14] = l(
                          'button',
                          { class: 'btn dropdown-toggle', 'data-bs-toggle': 'dropdown' },
                          [
                            l(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                class: 'icon',
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24',
                                'stroke-width': '2',
                                stroke: 'currentColor',
                                fill: 'none',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                l('path', {
                                  d: 'M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5'
                                })
                              ]
                            ),
                            Kt(' Filter ')
                          ],
                          -1
                        )),
                      l('div', kS, [
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[3] || (t[3] = a => n.filterByStatus('all')) },
                          'All Records'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[4] || (t[4] = a => n.filterByStatus('present'))
                          },
                          'Present'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[5] || (t[5] = a => n.filterByStatus('late'))
                          },
                          'Late'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[6] || (t[6] = a => n.filterByStatus('absent'))
                          },
                          'Absent'
                        )
                      ])
                    ])
                  ])
                ]),
                l('div', ES, [
                  l('div', OS, [
                    l(
                      'table',
                      PS,
                      t[16] ||
                        (t[16] = [
                          l(
                            'thead',
                            null,
                            [
                              l('tr', null, [
                                l('th', null, 'Date'),
                                l('th', null, 'Check In'),
                                l('th', null, 'Check Out'),
                                l('th', null, 'Total Hours'),
                                l('th', null, 'Status'),
                                l('th', null, 'Location'),
                                l('th', null, 'Actions')
                              ])
                            ],
                            -1
                          )
                        ]),
                      512
                    )
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  )
}
const Fm = yo(Xx, [
    ['render', RS],
    ['__scopeId', 'data-v-81b850a5']
  ]),
  LS = {
    name: 'FaceAttendance',
    setup() {
      const e = qe(null),
        t = qe(null),
        r = qe(!1),
        n = qe(!1),
        i = qe(!1),
        s = qe(!1),
        a = qe(0),
        d = qe(0),
        f = qe(null),
        g = qe('front'),
        p = nn({ status: 'idle', message: 'Ready to start' }),
        y = nn({ name: '', photo: '', time: '' }),
        _ = nn({ enabled: !0, current: null }),
        C = nn({ faceDetection: !1, camera: !1 }),
        A = qe(''),
        k = fe => {
          switch (fe) {
            case 'success':
              return 'text-success'
            case 'error':
              return 'text-danger'
            case 'processing':
              return 'text-warning'
            default:
              return 'text-muted'
          }
        },
        F = async () => {
          r.value ? E() : await N()
        },
        N = async () => {
          try {
            const fe = {
              video: {
                facingMode: g.value === 'front' ? 'user' : 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
              }
            }
            ;((f.value = await navigator.mediaDevices.getUserMedia(fe)),
              (e.value.srcObject = f.value),
              (r.value = !0),
              (C.camera = !0),
              (p.status = 'ready'),
              (p.message = 'Camera active - Ready to capture'),
              ue())
          } catch (fe) {
            ;(console.error('Error starting camera:', fe),
              (C.camera = !1),
              (p.status = 'error'),
              (p.message = 'Camera access denied'),
              alert('Unable to access camera. Please check permissions.'))
          }
        },
        E = () => {
          ;(f.value && (f.value.getTracks().forEach(fe => fe.stop()), (f.value = null)),
            (r.value = !1),
            (C.camera = !1),
            (p.status = 'idle'),
            (p.message = 'Camera stopped'),
            (s.value = !1),
            (a.value = 0))
        },
        z = async fe => {
          r.value ? ((g.value = fe), E(), await N()) : (g.value = fe)
        },
        Y = () => {
          i.value = !i.value
        },
        ue = () => {
          const fe = () => {
            if (!r.value) return
            const He = Math.random() > 0.3
            if (
              ((s.value = He),
              (a.value = He ? Math.floor(Math.random() * 2) + 1 : 0),
              (d.value = He ? Math.floor(Math.random() * 30) + 70 : 0),
              He)
            ) {
              const it = Math.random() * 200 + 100,
                Pe = Math.random() * 150 + 75,
                re = Math.random() * 100 + 150,
                Ee = Math.random() * 120 + 180
              A.value = `left: ${it}px; top: ${Pe}px; width: ${re}px; height: ${Ee}px;`
            }
            r.value && setTimeout(fe, 100)
          }
          fe()
        },
        ke = async () => {
          if (!(!r.value || n.value)) {
            ;((n.value = !0), (p.status = 'processing'), (p.message = 'Processing face recognition...'))
            try {
              const fe = t.value,
                He = e.value,
                it = fe.getContext('2d')
              ;((fe.width = He.videoWidth), (fe.height = He.videoHeight), it.drawImage(He, 0, 0))
              const Pe = await new Promise(Me => fe.toBlob(Me, 'image/jpeg', 0.8)),
                re = new FormData()
              ;(re.append('photo', Pe, 'capture.jpg'), re.append('latitude', 0), re.append('longitude', 0))
              const Ee = await Fe.post('/api/v1/attendance/face-recognition', re, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
              Ee.data.success
                ? ((p.status = 'success'),
                  (p.message = `Welcome, ${Ee.data.employee.name}!`),
                  (y.name = Ee.data.employee.name),
                  (y.photo = Ee.data.employee.photo),
                  (y.time = new Date().toLocaleTimeString()),
                  await m(Ee.data.employee.id))
                : ((p.status = 'error'), (p.message = Ee.data.message || 'Face not recognized'))
            } catch (fe) {
              ;(console.error('Face recognition error:', fe),
                (p.status = 'error'),
                (p.message = 'Recognition failed. Please try again.'))
            } finally {
              n.value = !1
            }
          }
        },
        m = async fe => {
          try {
            ;(await Fe.post('/api/v1/attendance/face-check-in', { employee_id: fe, recognition_confidence: d.value }),
              alert('Attendance recorded successfully!'))
          } catch (He) {
            ;(console.error('Error recording attendance:', He),
              alert('Face recognized but failed to record attendance.'))
          }
        },
        rt = async () => {
          try {
            const fe = await Fe.get('/api/v1/face-detection/health')
            ;((C.faceDetection = fe.data.status === 'healthy'),
              C.faceDetection
                ? alert('Face detection service is online and working!')
                : alert('Face detection service is offline.'))
          } catch {
            ;((C.faceDetection = !1), alert('Cannot connect to face detection service.'))
          }
        },
        Ne = () => {
          alert('Camera calibration feature coming soon!')
        }
      return (
        qi(async () => {
          await rt()
          try {
            const fe = await navigator.permissions.query({ name: 'camera' })
            C.camera = fe.state === 'granted'
          } catch {
            console.log('Permission API not supported')
          }
        }),
        Fu(() => {
          E()
        }),
        {
          videoElement: e,
          canvasElement: t,
          cameraActive: r,
          processing: n,
          debugMode: i,
          faceDetected: s,
          faceCount: a,
          confidence: d,
          currentCamera: g,
          recognitionStatus: p,
          lastRecognition: y,
          gestureDetection: _,
          serviceStatus: C,
          faceBoxStyle: A,
          getStatusColor: k,
          toggleCamera: F,
          switchCamera: z,
          toggleDebugMode: Y,
          capturePhoto: ke,
          testService: rt,
          calibrateCamera: Ne
        }
      )
    }
  },
  MS = { class: 'page' },
  IS = { class: 'page-header d-print-none' },
  FS = { class: 'container-xl' },
  jS = { class: 'row g-2 align-items-center' },
  NS = { class: 'col-auto ms-auto d-print-none' },
  HS = { class: 'btn-list' },
  $S = ['disabled'],
  BS = { class: 'page-body' },
  qS = { class: 'container-xl' },
  US = { class: 'row row-deck row-cards' },
  WS = { class: 'col-lg-8' },
  VS = { class: 'card' },
  zS = { class: 'card-header' },
  KS = { class: 'card-actions' },
  XS = { class: 'dropdown' },
  GS = { class: 'dropdown-menu' },
  JS = { class: 'card-body' },
  YS = { class: 'camera-container position-relative' },
  QS = {
    ref: 'videoElement',
    class: 'w-100 rounded',
    style: { 'max-height': '400px', background: '#000' },
    autoplay: '',
    muted: '',
    playsinline: ''
  },
  ZS = { ref: 'canvasElement', class: 'd-none', width: '640', height: '480' },
  eC = { key: 0, class: 'position-absolute top-0 start-0 w-100 h-100' },
  tC = { key: 1, class: 'position-absolute top-50 start-50 translate-middle text-center' },
  nC = { class: 'col-lg-4' },
  rC = { class: 'card' },
  iC = { class: 'card-body' },
  oC = { class: 'mb-3' },
  sC = { key: 0, class: 'mb-3' },
  aC = { class: 'd-flex justify-content-between' },
  lC = { class: 'd-flex justify-content-between mt-1' },
  cC = { key: 1, class: 'mb-3' },
  uC = { class: 'd-flex align-items-center' },
  dC = { class: 'strong' },
  fC = { class: 'text-muted small' },
  hC = { key: 2, class: 'mb-3' },
  pC = { class: 'd-flex justify-content-between' },
  mC = { class: 'badge bg-info' },
  vC = { class: 'mb-3' },
  gC = { class: 'd-flex justify-content-between' },
  bC = { class: 'd-flex justify-content-between mt-1' },
  yC = { class: 'btn-list w-100' },
  _C = ['disabled']
function wC(e, t, r, n, i, s) {
  return (
    he(),
    pe('div', MS, [
      l('div', IS, [
        l('div', FS, [
          l('div', jS, [
            t[9] ||
              (t[9] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' Face Recognition '),
                  l('h2', { class: 'page-title' }, ' Face Recognition Attendance ')
                ],
                -1
              )),
            l('div', NS, [
              l('div', HS, [
                l(
                  'button',
                  {
                    onClick: t[0] || (t[0] = (...a) => n.toggleCamera && n.toggleCamera(...a)),
                    class: dt(['btn', n.cameraActive ? 'btn-danger' : 'btn-success'])
                  },
                  [
                    t[7] ||
                      (t[7] = l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', {
                            d: 'M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z'
                          }),
                          l('rect', { x: '3', y: '6', width: '12', height: '12', rx: '2' })
                        ],
                        -1
                      )),
                    Kt(' ' + Q(n.cameraActive ? 'Stop Camera' : 'Start Camera'), 1)
                  ],
                  2
                ),
                l(
                  'button',
                  {
                    onClick: t[1] || (t[1] = (...a) => n.capturePhoto && n.capturePhoto(...a)),
                    class: 'btn btn-primary',
                    disabled: !n.cameraActive || n.processing
                  },
                  [
                    t[8] ||
                      (t[8] = l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', {
                            d: 'M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2'
                          }),
                          l('circle', { cx: '12', cy: '13', r: '3' })
                        ],
                        -1
                      )),
                    Kt(' ' + Q(n.processing ? 'Processing...' : 'Capture & Verify'), 1)
                  ],
                  8,
                  $S
                )
              ])
            ])
          ])
        ])
      ]),
      l('div', BS, [
        l('div', qS, [
          l('div', US, [
            l('div', WS, [
              l('div', VS, [
                l('div', zS, [
                  t[12] || (t[12] = l('h3', { class: 'card-title' }, 'Camera Feed', -1)),
                  l('div', KS, [
                    l('div', XS, [
                      t[11] ||
                        (t[11] = Tr(
                          '<button class="btn dropdown-toggle" data-bs-toggle="dropdown" data-v-1e01bb97><svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-1e01bb97><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-1e01bb97></path><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" data-v-1e01bb97></path><circle cx="12" cy="12" r="3" data-v-1e01bb97></circle></svg> Settings </button>',
                          1
                        )),
                      l('div', GS, [
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[2] || (t[2] = a => n.switchCamera('front')) },
                          'Front Camera'
                        ),
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[3] || (t[3] = a => n.switchCamera('back')) },
                          'Back Camera'
                        ),
                        t[10] || (t[10] = l('div', { class: 'dropdown-divider' }, null, -1)),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[4] || (t[4] = (...a) => n.toggleDebugMode && n.toggleDebugMode(...a))
                          },
                          Q(n.debugMode ? 'Hide' : 'Show') + ' Debug Info',
                          1
                        )
                      ])
                    ])
                  ])
                ]),
                l('div', JS, [
                  l('div', YS, [
                    l('video', QS, null, 512),
                    l('canvas', ZS, null, 512),
                    n.faceDetected && n.debugMode
                      ? (he(),
                        pe('div', eC, [
                          l(
                            'div',
                            { class: 'border border-success border-3 position-absolute', style: Go(n.faceBoxStyle) },
                            null,
                            4
                          )
                        ]))
                      : Ye('', !0),
                    n.cameraActive
                      ? Ye('', !0)
                      : (he(),
                        pe(
                          'div',
                          tC,
                          t[13] ||
                            (t[13] = [
                              Tr(
                                '<div class="text-muted" data-v-1e01bb97><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-lg mb-2" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-1e01bb97><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-1e01bb97></path><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" data-v-1e01bb97></path><rect x="3" y="6" width="12" height="12" rx="2" data-v-1e01bb97></rect></svg><div data-v-1e01bb97>Camera is off</div><small data-v-1e01bb97>Click &quot;Start Camera&quot; to begin</small></div>',
                                1
                              )
                            ])
                        ))
                  ]),
                  t[14] ||
                    (t[14] = Tr(
                      '<div class="mt-3" data-v-1e01bb97><div class="alert alert-info" data-v-1e01bb97><div class="d-flex" data-v-1e01bb97><div data-v-1e01bb97><svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-1e01bb97><circle cx="12" cy="12" r="9" data-v-1e01bb97></circle><path d="M12 8h.01" data-v-1e01bb97></path><path d="M11 12h1v4h1" data-v-1e01bb97></path></svg></div><div data-v-1e01bb97><h4 class="alert-title" data-v-1e01bb97>How to use Face Recognition</h4><div class="text-muted" data-v-1e01bb97> 1. Click &quot;Start Camera&quot; to activate your camera<br data-v-1e01bb97> 2. Position your face in the center of the frame<br data-v-1e01bb97> 3. Ensure good lighting for best results<br data-v-1e01bb97> 4. Click &quot;Capture &amp; Verify&quot; to take attendance </div></div></div></div></div>',
                      1
                    ))
                ])
              ])
            ]),
            l('div', nC, [
              l('div', rC, [
                t[26] ||
                  (t[26] = l(
                    'div',
                    { class: 'card-header' },
                    [l('h3', { class: 'card-title' }, 'Recognition Status')],
                    -1
                  )),
                l('div', iC, [
                  l('div', oC, [
                    t[15] || (t[15] = l('div', { class: 'subheader' }, 'Current Status', -1)),
                    l(
                      'div',
                      { class: dt(['h3', n.getStatusColor(n.recognitionStatus.status)]) },
                      Q(n.recognitionStatus.message),
                      3
                    )
                  ]),
                  n.debugMode
                    ? (he(),
                      pe('div', sC, [
                        t[18] || (t[18] = l('div', { class: 'subheader' }, 'Face Detection', -1)),
                        l('div', aC, [
                          t[16] || (t[16] = l('span', null, 'Faces Detected:', -1)),
                          l(
                            'span',
                            { class: dt(['badge', n.faceDetected ? 'bg-success' : 'bg-secondary']) },
                            Q(n.faceCount),
                            3
                          )
                        ]),
                        l('div', lC, [
                          t[17] || (t[17] = l('span', null, 'Confidence:', -1)),
                          l('span', null, Q(n.confidence) + '%', 1)
                        ])
                      ]))
                    : Ye('', !0),
                  n.lastRecognition.name
                    ? (he(),
                      pe('div', cC, [
                        t[19] || (t[19] = l('div', { class: 'subheader' }, 'Last Recognition', -1)),
                        l('div', uC, [
                          l(
                            'span',
                            {
                              class: 'avatar avatar-sm me-2',
                              style: Go(`background-image: url(${n.lastRecognition.photo})`)
                            },
                            null,
                            4
                          ),
                          l('div', null, [
                            l('div', dC, Q(n.lastRecognition.name), 1),
                            l('div', fC, Q(n.lastRecognition.time), 1)
                          ])
                        ])
                      ]))
                    : Ye('', !0),
                  n.gestureDetection.enabled
                    ? (he(),
                      pe('div', hC, [
                        t[21] || (t[21] = l('div', { class: 'subheader' }, 'Gesture Recognition', -1)),
                        l('div', pC, [
                          t[20] || (t[20] = l('span', null, 'Current Gesture:', -1)),
                          l('span', mC, Q(n.gestureDetection.current || 'None'), 1)
                        ]),
                        t[22] || (t[22] = l('small', { class: 'text-muted' }, 'Wave to confirm attendance', -1))
                      ]))
                    : Ye('', !0),
                  l('div', vC, [
                    t[25] || (t[25] = l('div', { class: 'subheader' }, 'Service Status', -1)),
                    l('div', gC, [
                      t[23] || (t[23] = l('span', null, 'Face Detection Service:', -1)),
                      l(
                        'span',
                        { class: dt(['badge', n.serviceStatus.faceDetection ? 'bg-success' : 'bg-danger']) },
                        Q(n.serviceStatus.faceDetection ? 'Online' : 'Offline'),
                        3
                      )
                    ]),
                    l('div', bC, [
                      t[24] || (t[24] = l('span', null, 'Camera Access:', -1)),
                      l(
                        'span',
                        { class: dt(['badge', n.serviceStatus.camera ? 'bg-success' : 'bg-warning']) },
                        Q(n.serviceStatus.camera ? 'Granted' : 'Denied'),
                        3
                      )
                    ])
                  ]),
                  l('div', yC, [
                    l(
                      'button',
                      {
                        onClick: t[5] || (t[5] = (...a) => n.testService && n.testService(...a)),
                        class: 'btn btn-outline-secondary w-100'
                      },
                      ' Test Service Connection '
                    ),
                    l(
                      'button',
                      {
                        onClick: t[6] || (t[6] = (...a) => n.calibrateCamera && n.calibrateCamera(...a)),
                        class: 'btn btn-outline-primary w-100',
                        disabled: !n.cameraActive
                      },
                      ' Calibrate Camera ',
                      8,
                      _C
                    )
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  )
}
const jm = yo(LS, [
    ['render', wC],
    ['__scopeId', 'data-v-1e01bb97']
  ]),
  xC = {
    name: 'ScheduleManager',
    setup() {
      const e = qe(null),
        t = qe(null),
        r = qe('calendar'),
        n = qe(!1),
        i = qe(!1),
        s = qe({}),
        a = qe([]),
        d = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        f = [
          '07:00-08:00',
          '08:00-09:00',
          '09:00-10:00',
          '10:00-11:00',
          '11:00-12:00',
          '12:00-13:00',
          '13:00-14:00',
          '14:00-15:00',
          '15:00-16:00',
          '16:00-17:00'
        ],
        g = nn({ totalClasses: 0, activeTeachers: 0, roomsUsed: 0, totalRooms: 0, conflicts: 0 }),
        p = nn({
          id: null,
          teacher_id: '',
          subject: '',
          day_of_week: '',
          start_time: '',
          end_time: '',
          room: '',
          class_name: '',
          notes: '',
          is_active: !0
        }),
        y = qe([]),
        _ = qe([]),
        C = () => {
          ;(t.value && t.value.destroy(),
            (t.value = gt(e.value).DataTable({
              processing: !0,
              serverSide: !0,
              ajax: {
                url: '/schedules/data',
                type: 'GET',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') }
              },
              columns: [
                { data: 'day_of_week', name: 'day_of_week' },
                {
                  data: null,
                  render: function (fe, He, it) {
                    return `${it.start_time} - ${it.end_time}`
                  }
                },
                { data: 'subject', name: 'subject' },
                { data: 'teacher.name', name: 'teacher.name' },
                { data: 'room', name: 'room' },
                { data: 'class_name', name: 'class_name' },
                {
                  data: 'is_active',
                  name: 'is_active',
                  render: function (fe) {
                    return fe
                      ? '<span class="badge bg-success">Active</span>'
                      : '<span class="badge bg-secondary">Inactive</span>'
                  }
                },
                {
                  data: 'id',
                  name: 'actions',
                  orderable: !1,
                  searchable: !1,
                  render: function (fe, He, it) {
                    return `
                <div class="btn-group" role="group">
                  <button onclick="window.editSchedule(${fe})" class="btn btn-sm btn-outline-secondary">
                    Edit
                  </button>
                  <button onclick="window.toggleScheduleStatus(${fe})" class="btn btn-sm btn-outline-${it.is_active ? 'danger' : 'success'}">
                    ${it.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              `
                  }
                }
              ],
              order: [
                [0, 'asc'],
                [1, 'asc']
              ],
              pageLength: 20,
              responsive: !0
            })))
        },
        A = async () => {
          try {
            const fe = await Fe.get('/schedules/calendar')
            y.value = fe.data.data || []
          } catch (fe) {
            ;(console.error('Error loading schedules:', fe), (y.value = []))
          }
        },
        k = async () => {
          try {
            const fe = await Fe.get('/employees/teachers')
            a.value = fe.data.data || []
          } catch (fe) {
            ;(console.error('Error loading teachers:', fe), (a.value = []))
          }
        },
        F = async () => {
          try {
            const fe = await Fe.get('/schedules/stats')
            Object.assign(g, fe.data)
          } catch (fe) {
            ;(console.error('Error loading stats:', fe),
              Object.assign(g, { totalClasses: 0, activeTeachers: 0, roomsUsed: 0, totalRooms: 0, conflicts: 0 }))
          }
        },
        N = async () => {
          try {
            const fe = await Fe.get('/schedules/conflicts')
            _.value = fe.data.data || []
          } catch (fe) {
            ;(console.error('Error loading conflicts:', fe), (_.value = []))
          }
        },
        E = (fe, He) => {
          const [it, Pe] = He.split('-')
          return y.value.filter(
            re => re.day_of_week.toLowerCase() === fe.toLowerCase() && re.start_time <= it && re.end_time >= Pe
          )
        },
        z = fe => ({
          'bg-primary': fe.employee_type === 'permanent_teacher',
          'bg-info': fe.employee_type === 'honorary_teacher',
          'text-white': !0,
          'p-1': !0,
          rounded: !0,
          'mb-1': !0,
          'cursor-pointer': !0
        }),
        Y = () => {
          ;((n.value = !1), rt(), gt('#scheduleModal').modal('show'))
        },
        ue = async fe => {
          try {
            const it = (await Fe.get(`/schedules/${fe}/edit`)).data
            ;((n.value = !0), Object.assign(p, it), gt('#scheduleModal').modal('show'))
          } catch (He) {
            ;(console.error('Error loading schedule:', He), alert('Failed to load schedule data'))
          }
        },
        ke = async () => {
          var fe
          ;((i.value = !0), (s.value = {}))
          try {
            let He
            ;(n.value ? (He = await Fe.put(`/schedules/${p.id}`, p)) : (He = await Fe.post('/schedules', p)),
              gt('#scheduleModal').modal('hide'),
              r.value === 'table' ? t.value.ajax.reload() : await A(),
              await F(),
              await N())
            const it = n.value ? 'Schedule updated successfully' : 'Schedule created successfully'
            alert(it)
          } catch (He) {
            ;((fe = He.response) == null ? void 0 : fe.status) === 422
              ? (s.value = He.response.data.errors)
              : (console.error('Error saving schedule:', He), alert('Failed to save schedule. Please try again.'))
          } finally {
            i.value = !1
          }
        },
        m = async fe => {
          if (confirm('Are you sure you want to change this schedule status?'))
            try {
              ;(await Fe.post(`/schedules/${fe}/toggle-status`),
                r.value === 'table' ? t.value.ajax.reload() : await A(),
                await F(),
                alert('Schedule status updated successfully'))
            } catch (He) {
              ;(console.error('Error toggling schedule status:', He), alert('Failed to update schedule status'))
            }
        },
        rt = () => {
          ;(Object.assign(p, {
            id: null,
            teacher_id: '',
            subject: '',
            day_of_week: '',
            start_time: '',
            end_time: '',
            room: '',
            class_name: '',
            notes: '',
            is_active: !0
          }),
            (s.value = {}))
        },
        Ne = () => {
          window.open('/schedules/export', '_blank')
        }
      return (
        qi(async () => {
          ;(await Promise.all([k(), A(), F(), N()]),
            await Bi(),
            r.value === 'table' && C(),
            (window.editSchedule = ue),
            (window.toggleScheduleStatus = m))
        }),
        {
          scheduleTable: e,
          viewMode: r,
          editMode: n,
          saving: i,
          errors: s,
          teachers: a,
          weekDays: d,
          timeSlots: f,
          scheduleStats: g,
          scheduleForm: p,
          schedules: y,
          conflicts: _,
          getScheduleForSlot: E,
          getScheduleItemClass: z,
          showAddModal: Y,
          editSchedule: ue,
          saveSchedule: ke,
          resetForm: rt,
          exportSchedule: Ne
        }
      )
    }
  },
  SC = { class: 'page' },
  CC = { class: 'page-header d-print-none' },
  TC = { class: 'container-xl' },
  AC = { class: 'row g-2 align-items-center' },
  DC = { class: 'col-auto ms-auto d-print-none' },
  kC = { class: 'btn-list' },
  EC = { class: 'page-body' },
  OC = { class: 'container-xl' },
  PC = { class: 'row row-deck row-cards mb-3' },
  RC = { class: 'col-sm-6 col-lg-3' },
  LC = { class: 'card' },
  MC = { class: 'card-body' },
  IC = { class: 'h1 mb-3' },
  FC = { class: 'col-sm-6 col-lg-3' },
  jC = { class: 'card' },
  NC = { class: 'card-body' },
  HC = { class: 'h1 mb-3' },
  $C = { class: 'col-sm-6 col-lg-3' },
  BC = { class: 'card' },
  qC = { class: 'card-body' },
  UC = { class: 'h1 mb-3' },
  WC = { class: 'text-muted' },
  VC = { class: 'col-sm-6 col-lg-3' },
  zC = { class: 'card' },
  KC = { class: 'card-body' },
  XC = { class: 'row row-deck row-cards' },
  GC = { class: 'col-12' },
  JC = { class: 'card' },
  YC = { class: 'card-header' },
  QC = { class: 'card-actions' },
  ZC = { class: 'btn-group' },
  eT = { class: 'card-body' },
  tT = { key: 0, class: 'schedule-calendar' },
  nT = { class: 'table-responsive' },
  rT = { class: 'table table-bordered' },
  iT = { class: 'fw-bold' },
  oT = ['onClick'],
  sT = { class: 'fw-bold' },
  aT = { class: 'small text-muted' },
  lT = { class: 'small' },
  cT = { key: 1, class: 'schedule-table' },
  uT = { class: 'table-responsive' },
  dT = { ref: 'scheduleTable', class: 'table table-vcenter card-table', style: { width: '100%' } },
  fT = { key: 2, class: 'mt-3' },
  hT = { class: 'alert alert-warning' },
  pT = { class: 'd-flex' },
  mT = { class: 'mb-0' },
  vT = { class: 'modal modal-blur fade', id: 'scheduleModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  gT = { class: 'modal-dialog modal-lg modal-dialog-centered', role: 'document' },
  bT = { class: 'modal-content' },
  yT = { class: 'modal-header' },
  _T = { class: 'modal-title' },
  wT = { class: 'modal-body' },
  xT = { class: 'row' },
  ST = { class: 'col-lg-6' },
  CT = { class: 'mb-3' },
  TT = ['value'],
  AT = { key: 0, class: 'invalid-feedback' },
  DT = { class: 'col-lg-6' },
  kT = { class: 'mb-3' },
  ET = { key: 0, class: 'invalid-feedback' },
  OT = { class: 'row' },
  PT = { class: 'col-lg-4' },
  RT = { class: 'mb-3' },
  LT = { key: 0, class: 'invalid-feedback' },
  MT = { class: 'col-lg-4' },
  IT = { class: 'mb-3' },
  FT = { key: 0, class: 'invalid-feedback' },
  jT = { class: 'col-lg-4' },
  NT = { class: 'mb-3' },
  HT = { key: 0, class: 'invalid-feedback' },
  $T = { class: 'row' },
  BT = { class: 'col-lg-6' },
  qT = { class: 'mb-3' },
  UT = { key: 0, class: 'invalid-feedback' },
  WT = { class: 'col-lg-6' },
  VT = { class: 'mb-3' },
  zT = { key: 0, class: 'invalid-feedback' },
  KT = { class: 'row' },
  XT = { class: 'col-12' },
  GT = { class: 'mb-3' },
  JT = { class: 'mb-3' },
  YT = { class: 'form-check' },
  QT = { class: 'modal-footer' },
  ZT = ['disabled'],
  e2 = { key: 0, class: 'spinner-border spinner-border-sm me-2', role: 'status' }
function t2(e, t, r, n, i, s) {
  return (
    he(),
    pe('div', SC, [
      l('div', CC, [
        l('div', TC, [
          l('div', AC, [
            t[16] ||
              (t[16] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' Academic Management '),
                  l('h2', { class: 'page-title' }, ' Schedule Management ')
                ],
                -1
              )),
            l('div', DC, [
              l('div', kC, [
                l(
                  'button',
                  { onClick: t[0] || (t[0] = (...a) => n.exportSchedule && n.exportSchedule(...a)), class: 'btn' },
                  t[14] ||
                    (t[14] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M14 3v4a1 1 0 0 0 1 1h4' }),
                          l('path', { d: 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z' })
                        ],
                        -1
                      ),
                      Kt(' Export Schedule ')
                    ])
                ),
                l(
                  'button',
                  {
                    onClick: t[1] || (t[1] = (...a) => n.showAddModal && n.showAddModal(...a)),
                    class: 'btn btn-primary d-none d-sm-inline-block'
                  },
                  t[15] ||
                    (t[15] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M12 5l0 14' }),
                          l('path', { d: 'M5 12l14 0' })
                        ],
                        -1
                      ),
                      Kt(' Add Schedule ')
                    ])
                )
              ])
            ])
          ])
        ])
      ]),
      l('div', EC, [
        l('div', OC, [
          l('div', PC, [
            l('div', RC, [
              l('div', LC, [
                l('div', MC, [
                  t[17] ||
                    (t[17] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Total Classes')],
                      -1
                    )),
                  l('div', IC, Q(n.scheduleStats.totalClasses), 1),
                  t[18] || (t[18] = l('div', { class: 'text-muted' }, 'This week', -1))
                ])
              ])
            ]),
            l('div', FC, [
              l('div', jC, [
                l('div', NC, [
                  t[19] ||
                    (t[19] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Active Teachers')],
                      -1
                    )),
                  l('div', HC, Q(n.scheduleStats.activeTeachers), 1),
                  t[20] || (t[20] = l('div', { class: 'text-muted' }, 'Currently assigned', -1))
                ])
              ])
            ]),
            l('div', $C, [
              l('div', BC, [
                l('div', qC, [
                  t[21] ||
                    (t[21] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Rooms Used')],
                      -1
                    )),
                  l('div', UC, Q(n.scheduleStats.roomsUsed), 1),
                  l('div', WC, 'Out of ' + Q(n.scheduleStats.totalRooms), 1)
                ])
              ])
            ]),
            l('div', VC, [
              l('div', zC, [
                l('div', KC, [
                  t[22] ||
                    (t[22] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Conflicts')],
                      -1
                    )),
                  l(
                    'div',
                    { class: dt(['h1 mb-3', n.scheduleStats.conflicts > 0 ? 'text-danger' : 'text-success']) },
                    Q(n.scheduleStats.conflicts),
                    3
                  ),
                  t[23] || (t[23] = l('div', { class: 'text-muted' }, 'Schedule conflicts', -1))
                ])
              ])
            ])
          ]),
          l('div', XC, [
            l('div', GC, [
              l('div', JC, [
                l('div', YC, [
                  t[24] || (t[24] = l('h3', { class: 'card-title' }, 'Weekly Schedule', -1)),
                  l('div', QC, [
                    l('div', ZC, [
                      l(
                        'button',
                        {
                          class: dt(['btn', n.viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary']),
                          onClick: t[2] || (t[2] = a => (n.viewMode = 'calendar'))
                        },
                        ' Calendar View ',
                        2
                      ),
                      l(
                        'button',
                        {
                          class: dt(['btn', n.viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary']),
                          onClick: t[3] || (t[3] = a => (n.viewMode = 'table'))
                        },
                        ' Table View ',
                        2
                      )
                    ])
                  ])
                ]),
                l('div', eT, [
                  n.viewMode === 'calendar'
                    ? (he(),
                      pe('div', tT, [
                        l('div', nT, [
                          l('table', rT, [
                            l('thead', null, [
                              l('tr', null, [
                                t[25] || (t[25] = l('th', { width: '100' }, 'Time', -1)),
                                (he(!0),
                                pe(
                                  tn,
                                  null,
                                  or(n.weekDays, a => (he(), pe('th', { key: a, class: 'text-center' }, Q(a), 1))),
                                  128
                                ))
                              ])
                            ]),
                            l('tbody', null, [
                              (he(!0),
                              pe(
                                tn,
                                null,
                                or(
                                  n.timeSlots,
                                  a => (
                                    he(),
                                    pe('tr', { key: a }, [
                                      l('td', iT, Q(a), 1),
                                      (he(!0),
                                      pe(
                                        tn,
                                        null,
                                        or(
                                          n.weekDays,
                                          d => (
                                            he(),
                                            pe('td', { key: d, class: 'schedule-cell' }, [
                                              (he(!0),
                                              pe(
                                                tn,
                                                null,
                                                or(
                                                  n.getScheduleForSlot(d, a),
                                                  f => (
                                                    he(),
                                                    pe(
                                                      'div',
                                                      {
                                                        key: f.id,
                                                        class: dt(['schedule-item', n.getScheduleItemClass(f)]),
                                                        onClick: g => n.editSchedule(f)
                                                      },
                                                      [
                                                        l('div', sT, Q(f.subject), 1),
                                                        l('div', aT, Q(f.teacher), 1),
                                                        l('div', lT, Q(f.room), 1)
                                                      ],
                                                      10,
                                                      oT
                                                    )
                                                  )
                                                ),
                                                128
                                              ))
                                            ])
                                          )
                                        ),
                                        128
                                      ))
                                    ])
                                  )
                                ),
                                128
                              ))
                            ])
                          ])
                        ])
                      ]))
                    : (he(),
                      pe('div', cT, [
                        l('div', uT, [
                          l(
                            'table',
                            dT,
                            t[26] ||
                              (t[26] = [
                                l(
                                  'thead',
                                  null,
                                  [
                                    l('tr', null, [
                                      l('th', null, 'Day'),
                                      l('th', null, 'Time'),
                                      l('th', null, 'Subject'),
                                      l('th', null, 'Teacher'),
                                      l('th', null, 'Room'),
                                      l('th', null, 'Class'),
                                      l('th', null, 'Status'),
                                      l('th', null, 'Actions')
                                    ])
                                  ],
                                  -1
                                )
                              ]),
                            512
                          )
                        ])
                      ])),
                  n.conflicts.length > 0
                    ? (he(),
                      pe('div', fT, [
                        l('div', hT, [
                          l('div', pT, [
                            t[28] ||
                              (t[28] = l(
                                'div',
                                null,
                                [
                                  l(
                                    'svg',
                                    {
                                      xmlns: 'http://www.w3.org/2000/svg',
                                      class: 'icon alert-icon',
                                      width: '24',
                                      height: '24',
                                      viewBox: '0 0 24 24',
                                      'stroke-width': '2',
                                      stroke: 'currentColor',
                                      fill: 'none',
                                      'stroke-linecap': 'round',
                                      'stroke-linejoin': 'round'
                                    },
                                    [
                                      l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                      l('path', { d: 'M12 9v2m0 4v.01' }),
                                      l('path', {
                                        d: 'M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75'
                                      })
                                    ]
                                  )
                                ],
                                -1
                              )),
                            l('div', null, [
                              t[27] || (t[27] = l('h4', { class: 'alert-title' }, 'Schedule Conflicts Detected', -1)),
                              l('ul', mT, [
                                (he(!0),
                                pe(
                                  tn,
                                  null,
                                  or(n.conflicts, a => (he(), pe('li', { key: a.id }, Q(a.message), 1))),
                                  128
                                ))
                              ])
                            ])
                          ])
                        ])
                      ]))
                    : Ye('', !0)
                ])
              ])
            ])
          ])
        ])
      ]),
      l('div', vT, [
        l('div', gT, [
          l('div', bT, [
            l('div', yT, [
              l('h5', _T, Q(n.editMode ? 'Edit Schedule' : 'Add New Schedule'), 1),
              t[29] ||
                (t[29] = l(
                  'button',
                  { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' },
                  null,
                  -1
                ))
            ]),
            l(
              'form',
              { onSubmit: t[13] || (t[13] = ta((...a) => n.saveSchedule && n.saveSchedule(...a), ['prevent'])) },
              [
                l('div', wT, [
                  l('div', xT, [
                    l('div', ST, [
                      l('div', CT, [
                        t[31] || (t[31] = l('label', { class: 'form-label' }, 'Teacher', -1)),
                        Ct(
                          l(
                            'select',
                            {
                              class: dt(['form-select', { 'is-invalid': n.errors.teacher_id }]),
                              'onUpdate:modelValue': t[4] || (t[4] = a => (n.scheduleForm.teacher_id = a)),
                              required: ''
                            },
                            [
                              t[30] || (t[30] = l('option', { value: '' }, 'Select Teacher', -1)),
                              (he(!0),
                              pe(
                                tn,
                                null,
                                or(
                                  n.teachers,
                                  a => (
                                    he(),
                                    pe(
                                      'option',
                                      { key: a.id, value: a.id },
                                      Q(a.name) + ' (' + Q(a.employee_number) + ') ',
                                      9,
                                      TT
                                    )
                                  )
                                ),
                                128
                              ))
                            ],
                            2
                          ),
                          [[Zs, n.scheduleForm.teacher_id]]
                        ),
                        n.errors.teacher_id ? (he(), pe('div', AT, Q(n.errors.teacher_id[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', DT, [
                      l('div', kT, [
                        t[32] || (t[32] = l('label', { class: 'form-label' }, 'Subject', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.subject }]),
                              'onUpdate:modelValue': t[5] || (t[5] = a => (n.scheduleForm.subject = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.scheduleForm.subject]]
                        ),
                        n.errors.subject ? (he(), pe('div', ET, Q(n.errors.subject[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', OT, [
                    l('div', PT, [
                      l('div', RT, [
                        t[34] || (t[34] = l('label', { class: 'form-label' }, 'Day of Week', -1)),
                        Ct(
                          l(
                            'select',
                            {
                              class: dt(['form-select', { 'is-invalid': n.errors.day_of_week }]),
                              'onUpdate:modelValue': t[6] || (t[6] = a => (n.scheduleForm.day_of_week = a)),
                              required: ''
                            },
                            t[33] ||
                              (t[33] = [
                                Tr(
                                  '<option value="" data-v-f2df3c0d>Select Day</option><option value="monday" data-v-f2df3c0d>Monday</option><option value="tuesday" data-v-f2df3c0d>Tuesday</option><option value="wednesday" data-v-f2df3c0d>Wednesday</option><option value="thursday" data-v-f2df3c0d>Thursday</option><option value="friday" data-v-f2df3c0d>Friday</option><option value="saturday" data-v-f2df3c0d>Saturday</option>',
                                  7
                                )
                              ]),
                            2
                          ),
                          [[Zs, n.scheduleForm.day_of_week]]
                        ),
                        n.errors.day_of_week ? (he(), pe('div', LT, Q(n.errors.day_of_week[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', MT, [
                      l('div', IT, [
                        t[35] || (t[35] = l('label', { class: 'form-label' }, 'Start Time', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'time',
                              class: dt(['form-control', { 'is-invalid': n.errors.start_time }]),
                              'onUpdate:modelValue': t[7] || (t[7] = a => (n.scheduleForm.start_time = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.scheduleForm.start_time]]
                        ),
                        n.errors.start_time ? (he(), pe('div', FT, Q(n.errors.start_time[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', jT, [
                      l('div', NT, [
                        t[36] || (t[36] = l('label', { class: 'form-label' }, 'End Time', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'time',
                              class: dt(['form-control', { 'is-invalid': n.errors.end_time }]),
                              'onUpdate:modelValue': t[8] || (t[8] = a => (n.scheduleForm.end_time = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.scheduleForm.end_time]]
                        ),
                        n.errors.end_time ? (he(), pe('div', HT, Q(n.errors.end_time[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', $T, [
                    l('div', BT, [
                      l('div', qT, [
                        t[37] || (t[37] = l('label', { class: 'form-label' }, 'Room', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.room }]),
                              'onUpdate:modelValue': t[9] || (t[9] = a => (n.scheduleForm.room = a)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.scheduleForm.room]]
                        ),
                        n.errors.room ? (he(), pe('div', UT, Q(n.errors.room[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', WT, [
                      l('div', VT, [
                        t[38] || (t[38] = l('label', { class: 'form-label' }, 'Class', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'text',
                              class: dt(['form-control', { 'is-invalid': n.errors.class_name }]),
                              'onUpdate:modelValue': t[10] || (t[10] = a => (n.scheduleForm.class_name = a)),
                              placeholder: 'e.g., Grade 10A, XII Science'
                            },
                            null,
                            2
                          ),
                          [[ln, n.scheduleForm.class_name]]
                        ),
                        n.errors.class_name ? (he(), pe('div', zT, Q(n.errors.class_name[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', KT, [
                    l('div', XT, [
                      l('div', GT, [
                        t[39] || (t[39] = l('label', { class: 'form-label' }, 'Notes (Optional)', -1)),
                        Ct(
                          l(
                            'textarea',
                            {
                              class: 'form-control',
                              'onUpdate:modelValue': t[11] || (t[11] = a => (n.scheduleForm.notes = a)),
                              rows: '3',
                              placeholder: 'Additional notes about this schedule...'
                            },
                            null,
                            512
                          ),
                          [[ln, n.scheduleForm.notes]]
                        )
                      ])
                    ])
                  ]),
                  l('div', JT, [
                    l('label', YT, [
                      Ct(
                        l(
                          'input',
                          {
                            type: 'checkbox',
                            class: 'form-check-input',
                            'onUpdate:modelValue': t[12] || (t[12] = a => (n.scheduleForm.is_active = a))
                          },
                          null,
                          512
                        ),
                        [[Ii, n.scheduleForm.is_active]]
                      ),
                      t[40] || (t[40] = l('span', { class: 'form-check-label' }, 'Active Schedule', -1))
                    ])
                  ])
                ]),
                l('div', QT, [
                  t[41] ||
                    (t[41] = l(
                      'button',
                      { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                      'Cancel',
                      -1
                    )),
                  l(
                    'button',
                    { type: 'submit', class: 'btn btn-primary', disabled: n.saving },
                    [
                      n.saving ? (he(), pe('span', e2)) : Ye('', !0),
                      Kt(' ' + Q(n.editMode ? 'Update Schedule' : 'Create Schedule'), 1)
                    ],
                    8,
                    ZT
                  )
                ])
              ],
              32
            )
          ])
        ])
      ])
    ])
  )
}
const Nm = yo(xC, [
    ['render', t2],
    ['__scopeId', 'data-v-f2df3c0d']
  ]),
  n2 = {
    name: 'PayrollManager',
    setup() {
      const e = qe(null),
        t = qe(null),
        r = qe(!1),
        n = qe('current'),
        i = qe(!1),
        s = qe([]),
        a = qe({}),
        d = qe([]),
        f = qe(null),
        g = nn({ totalAmount: 0, pendingApproval: 0, approved: 0, paid: 0 }),
        p = nn({ period_start: '', period_end: '', employee_ids: [], include_overtime: !0, auto_approve: !1 }),
        y = sr(() => s.value.length > 0),
        _ = () => {
          ;(t.value && t.value.destroy(),
            (t.value = gt(e.value).DataTable({
              processing: !0,
              serverSide: !0,
              ajax: {
                url: '/payroll/data',
                type: 'GET',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') }
              },
              columns: [
                {
                  data: 'id',
                  name: 'checkbox',
                  orderable: !1,
                  searchable: !1,
                  render: function (re) {
                    return `<input type="checkbox" class="payroll-checkbox" value="${re}">`
                  }
                },
                {
                  data: 'employee.name',
                  name: 'employee.name',
                  render: function (re, Ee, Me) {
                    return `
                <div class="d-flex align-items-center">
                  <span class="avatar avatar-sm me-2">${Me.employee.name.charAt(0)}</span>
                  <div>
                    <div class="fw-bold">${re}</div>
                    <div class="text-muted small">${Me.employee.employee_number}</div>
                  </div>
                </div>
              `
                  }
                },
                {
                  data: null,
                  render: function (re, Ee, Me) {
                    return `${Me.period_start} to ${Me.period_end}`
                  }
                },
                { data: 'regular_hours', name: 'regular_hours' },
                { data: 'overtime_hours', name: 'overtime_hours' },
                {
                  data: 'base_salary',
                  name: 'base_salary',
                  render: function (re) {
                    return `Rp ${new Intl.NumberFormat('id-ID').format(re)}`
                  }
                },
                {
                  data: 'total_amount',
                  name: 'total_amount',
                  render: function (re) {
                    return `Rp ${new Intl.NumberFormat('id-ID').format(re)}`
                  }
                },
                {
                  data: 'status',
                  name: 'status',
                  render: function (re) {
                    return `<span class="badge bg-${{ pending: 'warning', approved: 'success', paid: 'primary', rejected: 'danger' }[re] || 'secondary'}">${re}</span>`
                  }
                },
                {
                  data: 'id',
                  name: 'actions',
                  orderable: !1,
                  searchable: !1,
                  render: function (re, Ee, Me) {
                    return `
                <div class="btn-group" role="group">
                  <button onclick="window.viewPayrollDetails(${re})" class="btn btn-sm btn-outline-secondary">
                    View Details
                  </button>
                  ${Me.status === 'pending' ? `<button onclick="window.approvePayroll(${re})" class="btn btn-sm btn-success">Approve</button>` : ''}
                  ${Me.status === 'approved' ? `<button onclick="window.markAsPaid(${re})" class="btn btn-sm btn-primary">Mark Paid</button>` : ''}
                </div>
              `
                  }
                }
              ],
              order: [[2, 'desc']],
              pageLength: 15,
              responsive: !0,
              drawCallback: function () {
                gt('.payroll-checkbox')
                  .off('change')
                  .on('change', function () {
                    C()
                  })
              }
            })))
        },
        C = () => {
          ;((s.value = gt('.payroll-checkbox:checked')
            .map(function () {
              return parseInt(this.value)
            })
            .get()),
            (i.value =
              gt('.payroll-checkbox').length > 0 &&
              gt('.payroll-checkbox:checked').length === gt('.payroll-checkbox').length))
        },
        A = () => {
          ;(gt('.payroll-checkbox').prop('checked', i.value), C())
        },
        k = async () => {
          try {
            const re = await Fe.get('/payroll/summary-data')
            Object.assign(g, re.data)
          } catch (re) {
            ;(console.error('Error loading payroll stats:', re),
              Object.assign(g, { totalAmount: 0, pendingApproval: 0, approved: 0, paid: 0 }))
          }
        },
        F = async () => {
          try {
            const re = await Fe.get('/employees/data?active=1')
            d.value = re.data.data || []
          } catch (re) {
            ;(console.error('Error loading employees:', re), (d.value = []))
          }
        },
        N = re => {
          n.value = re
          const Ee = new Date(),
            Me = new Date(Ee.getFullYear(), Ee.getMonth(), 1),
            Be = new Date(Ee.getFullYear(), Ee.getMonth() + 1, 0)
          ;((p.period_start = Me.toISOString().split('T')[0]),
            (p.period_end = Be.toISOString().split('T')[0]),
            (p.employee_ids = []),
            gt('#generateModal').modal('show'))
        },
        E = async () => {
          var re
          ;((r.value = !0), (a.value = {}))
          try {
            const Ee = { ...p }
            n.value !== 'selected' && delete Ee.employee_ids
            const Me = await Fe.post('/payroll/generate-batch', Ee)
            ;(gt('#generateModal').modal('hide'),
              t.value.ajax.reload(),
              await k(),
              alert(`Successfully generated ${Me.data.count} payroll records!`))
          } catch (Ee) {
            ;((re = Ee.response) == null ? void 0 : re.status) === 422
              ? (a.value = Ee.response.data.errors)
              : (console.error('Error generating payroll:', Ee), alert('Failed to generate payroll. Please try again.'))
          } finally {
            r.value = !1
          }
        },
        z = async re => {
          try {
            const Ee = await Fe.get(`/payroll/${re}`)
            ;((f.value = Ee.data), gt('#detailsModal').modal('show'))
          } catch (Ee) {
            ;(console.error('Error loading payroll details:', Ee), alert('Failed to load payroll details'))
          }
        },
        Y = async re => {
          try {
            ;(await Fe.post(`/payroll/${re}/approve`),
              t.value.ajax.reload(),
              await k(),
              gt('#detailsModal').modal('hide'),
              alert('Payroll approved successfully!'))
          } catch (Ee) {
            ;(console.error('Error approving payroll:', Ee), alert('Failed to approve payroll'))
          }
        },
        ue = async re => {
          try {
            ;(await Fe.post(`/payroll/${re}/mark-as-paid`),
              t.value.ajax.reload(),
              await k(),
              gt('#detailsModal').modal('hide'),
              alert('Payroll marked as paid successfully!'))
          } catch (Ee) {
            ;(console.error('Error marking payroll as paid:', Ee), alert('Failed to mark payroll as paid'))
          }
        },
        ke = async () => {
          if (confirm(`Are you sure you want to approve ${s.value.length} payroll records?`))
            try {
              ;(await Fe.post('/payroll/bulk-approve', { payroll_ids: s.value }),
                t.value.ajax.reload(),
                await k(),
                (s.value = []),
                (i.value = !1),
                alert('Payroll records approved successfully!'))
            } catch (re) {
              ;(console.error('Error bulk approving payroll:', re), alert('Failed to approve payroll records'))
            }
        },
        m = async () => {
          if (confirm(`Are you sure you want to mark ${s.value.length} payroll records as paid?`))
            try {
              ;(await Fe.post('/payroll/bulk-mark-as-paid', { payroll_ids: s.value }),
                t.value.ajax.reload(),
                await k(),
                (s.value = []),
                (i.value = !1),
                alert('Payroll records marked as paid successfully!'))
            } catch (re) {
              ;(console.error('Error bulk marking payroll as paid:', re),
                alert('Failed to mark payroll records as paid'))
            }
        },
        rt = re => {
          re === 'all' ? t.value.column(7).search('').draw() : t.value.column(7).search(re).draw()
        },
        Ne = re => {
          t.value.column(1).search(re.replace('_', ' ')).draw()
        },
        fe = () => {
          window.open('/payroll/export', '_blank')
        },
        He = re => new Intl.NumberFormat('id-ID').format(re),
        it = re =>
          new Date(re).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
        Pe = re =>
          ({ pending: 'bg-warning', approved: 'bg-success', paid: 'bg-primary', rejected: 'bg-danger' })[re] ||
          'bg-secondary'
      return (
        qi(async () => {
          ;(await Promise.all([k(), F()]),
            await Bi(),
            _(),
            (window.viewPayrollDetails = z),
            (window.approvePayroll = Y),
            (window.markAsPaid = ue))
        }),
        {
          payrollTable: e,
          generating: r,
          generateType: n,
          allSelected: i,
          hasSelectedRecords: y,
          errors: a,
          employees: d,
          selectedPayroll: f,
          payrollStats: g,
          generateForm: p,
          showGenerateModal: N,
          generatePayroll: E,
          viewPayrollDetails: z,
          approvePayroll: Y,
          markAsPaid: ue,
          bulkApprove: ke,
          bulkMarkPaid: m,
          filterByStatus: rt,
          filterByType: Ne,
          exportPayroll: fe,
          formatCurrency: He,
          formatDate: it,
          getStatusBadgeClass: Pe,
          toggleAllSelection: A
        }
      )
    }
  },
  r2 = { class: 'page' },
  i2 = { class: 'page-header d-print-none' },
  o2 = { class: 'container-xl' },
  s2 = { class: 'row g-2 align-items-center' },
  a2 = { class: 'col-auto ms-auto d-print-none' },
  l2 = { class: 'btn-list' },
  c2 = { class: 'dropdown' },
  u2 = { class: 'dropdown-menu' },
  d2 = { class: 'page-body' },
  f2 = { class: 'container-xl' },
  h2 = { class: 'row row-deck row-cards mb-3' },
  p2 = { class: 'col-sm-6 col-lg-3' },
  m2 = { class: 'card' },
  v2 = { class: 'card-body' },
  g2 = { class: 'h1 mb-3' },
  b2 = { class: 'col-sm-6 col-lg-3' },
  y2 = { class: 'card' },
  _2 = { class: 'card-body' },
  w2 = { class: 'h1 mb-3 text-warning' },
  x2 = { class: 'col-sm-6 col-lg-3' },
  S2 = { class: 'card' },
  C2 = { class: 'card-body' },
  T2 = { class: 'h1 mb-3 text-success' },
  A2 = { class: 'col-sm-6 col-lg-3' },
  D2 = { class: 'card' },
  k2 = { class: 'card-body' },
  E2 = { class: 'h1 mb-3 text-primary' },
  O2 = { class: 'row row-deck row-cards' },
  P2 = { class: 'col-12' },
  R2 = { class: 'card' },
  L2 = { class: 'card-header' },
  M2 = { class: 'card-actions' },
  I2 = { class: 'dropdown' },
  F2 = { class: 'dropdown-menu' },
  j2 = { class: 'btn-group ms-2' },
  N2 = ['disabled'],
  H2 = ['disabled'],
  $2 = { class: 'card-body' },
  B2 = { class: 'table-responsive' },
  q2 = { ref: 'payrollTable', class: 'table table-vcenter card-table', style: { width: '100%' } },
  U2 = { width: '30' },
  W2 = { class: 'modal modal-blur fade', id: 'generateModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  V2 = { class: 'modal-dialog modal-lg modal-dialog-centered', role: 'document' },
  z2 = { class: 'modal-content' },
  K2 = { class: 'modal-body' },
  X2 = { class: 'row' },
  G2 = { class: 'col-lg-6' },
  J2 = { class: 'mb-3' },
  Y2 = { key: 0, class: 'invalid-feedback' },
  Q2 = { class: 'col-lg-6' },
  Z2 = { class: 'mb-3' },
  eA = { key: 0, class: 'invalid-feedback' },
  tA = { key: 0, class: 'mb-3' },
  nA = { class: 'form-selectgroup form-selectgroup-boxes' },
  rA = ['value'],
  iA = { class: 'form-selectgroup-label d-flex align-items-center p-3' },
  oA = { class: 'text-muted' },
  sA = { class: 'mb-3' },
  aA = { class: 'form-check' },
  lA = { class: 'mb-3' },
  cA = { class: 'form-check' },
  uA = { class: 'modal-footer' },
  dA = ['disabled'],
  fA = { key: 0, class: 'spinner-border spinner-border-sm me-2', role: 'status' },
  hA = { class: 'modal modal-blur fade', id: 'detailsModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  pA = { class: 'modal-dialog modal-xl modal-dialog-centered', role: 'document' },
  mA = { class: 'modal-content' },
  vA = { key: 0, class: 'modal-body' },
  gA = { class: 'row' },
  bA = { class: 'col-md-6' },
  yA = { class: 'table table-borderless' },
  _A = { class: 'badge bg-info' },
  wA = { class: 'col-md-6' },
  xA = { class: 'table table-borderless' },
  SA = { key: 0 },
  CA = { class: 'row' },
  TA = { class: 'col-md-6' },
  AA = { class: 'table' },
  DA = { class: 'text-end' },
  kA = { class: 'text-end' },
  EA = { class: 'text-end' },
  OA = { class: 'col-md-6' },
  PA = { class: 'table' },
  RA = { class: 'text-end' },
  LA = { class: 'text-end' },
  MA = { class: 'text-end text-danger' },
  IA = { class: 'table-active' },
  FA = { class: 'text-end' },
  jA = { class: 'modal-footer' }
function NA(e, t, r, n, i, s) {
  var a, d, f, g, p, y, _
  return (
    he(),
    pe('div', r2, [
      l('div', i2, [
        l('div', o2, [
          l('div', s2, [
            t[25] ||
              (t[25] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' Human Resources '),
                  l('h2', { class: 'page-title' }, ' Payroll Management ')
                ],
                -1
              )),
            l('div', a2, [
              l('div', l2, [
                l(
                  'button',
                  { onClick: t[0] || (t[0] = (...C) => n.exportPayroll && n.exportPayroll(...C)), class: 'btn' },
                  t[22] ||
                    (t[22] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M14 3v4a1 1 0 0 0 1 1h4' }),
                          l('path', { d: 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z' })
                        ],
                        -1
                      ),
                      Kt(' Export CSV ')
                    ])
                ),
                l('div', c2, [
                  t[24] ||
                    (t[24] = Tr(
                      '<button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" data-v-03d21f3c><svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-03d21f3c><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-03d21f3c></path><path d="M12 5l0 14" data-v-03d21f3c></path><path d="M5 12l14 0" data-v-03d21f3c></path></svg> Generate Payroll </button>',
                      1
                    )),
                  l('div', u2, [
                    l(
                      'a',
                      {
                        class: 'dropdown-item',
                        href: '#',
                        onClick: t[1] || (t[1] = C => n.showGenerateModal('current'))
                      },
                      'Current Period'
                    ),
                    l(
                      'a',
                      {
                        class: 'dropdown-item',
                        href: '#',
                        onClick: t[2] || (t[2] = C => n.showGenerateModal('custom'))
                      },
                      'Custom Period'
                    ),
                    t[23] || (t[23] = l('div', { class: 'dropdown-divider' }, null, -1)),
                    l(
                      'a',
                      {
                        class: 'dropdown-item',
                        href: '#',
                        onClick: t[3] || (t[3] = C => n.showGenerateModal('selected'))
                      },
                      'Selected Employees'
                    )
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      l('div', d2, [
        l('div', f2, [
          l('div', h2, [
            l('div', p2, [
              l('div', m2, [
                l('div', v2, [
                  t[26] ||
                    (t[26] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Total Payroll')],
                      -1
                    )),
                  l('div', g2, 'Rp ' + Q(n.formatCurrency(n.payrollStats.totalAmount)), 1),
                  t[27] || (t[27] = l('div', { class: 'text-muted' }, 'This period', -1))
                ])
              ])
            ]),
            l('div', b2, [
              l('div', y2, [
                l('div', _2, [
                  t[28] ||
                    (t[28] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Pending Approval')],
                      -1
                    )),
                  l('div', w2, Q(n.payrollStats.pendingApproval), 1),
                  t[29] || (t[29] = l('div', { class: 'text-muted' }, 'Records waiting', -1))
                ])
              ])
            ]),
            l('div', x2, [
              l('div', S2, [
                l('div', C2, [
                  t[30] ||
                    (t[30] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Approved')],
                      -1
                    )),
                  l('div', T2, Q(n.payrollStats.approved), 1),
                  t[31] || (t[31] = l('div', { class: 'text-muted' }, 'Ready for payment', -1))
                ])
              ])
            ]),
            l('div', A2, [
              l('div', D2, [
                l('div', k2, [
                  t[32] ||
                    (t[32] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Paid')],
                      -1
                    )),
                  l('div', E2, Q(n.payrollStats.paid), 1),
                  t[33] || (t[33] = l('div', { class: 'text-muted' }, 'Completed payments', -1))
                ])
              ])
            ])
          ]),
          l('div', O2, [
            l('div', P2, [
              l('div', R2, [
                l('div', L2, [
                  t[36] || (t[36] = l('h3', { class: 'card-title' }, 'Payroll Records', -1)),
                  l('div', M2, [
                    l('div', I2, [
                      t[35] ||
                        (t[35] = l(
                          'button',
                          { class: 'btn dropdown-toggle', 'data-bs-toggle': 'dropdown' },
                          [
                            l(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                class: 'icon',
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24',
                                'stroke-width': '2',
                                stroke: 'currentColor',
                                fill: 'none',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                l('path', {
                                  d: 'M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5'
                                })
                              ]
                            ),
                            Kt(' Filter ')
                          ],
                          -1
                        )),
                      l('div', F2, [
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[4] || (t[4] = C => n.filterByStatus('all')) },
                          'All Records'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[5] || (t[5] = C => n.filterByStatus('pending'))
                          },
                          'Pending'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[6] || (t[6] = C => n.filterByStatus('approved'))
                          },
                          'Approved'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[7] || (t[7] = C => n.filterByStatus('paid'))
                          },
                          'Paid'
                        ),
                        t[34] || (t[34] = l('div', { class: 'dropdown-divider' }, null, -1)),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[8] || (t[8] = C => n.filterByType('permanent_teacher'))
                          },
                          'Permanent Teachers'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[9] || (t[9] = C => n.filterByType('honorary_teacher'))
                          },
                          'Honorary Teachers'
                        )
                      ])
                    ]),
                    l('div', j2, [
                      l(
                        'button',
                        {
                          onClick: t[10] || (t[10] = (...C) => n.bulkApprove && n.bulkApprove(...C)),
                          class: 'btn btn-success',
                          disabled: !n.hasSelectedRecords
                        },
                        ' Bulk Approve ',
                        8,
                        N2
                      ),
                      l(
                        'button',
                        {
                          onClick: t[11] || (t[11] = (...C) => n.bulkMarkPaid && n.bulkMarkPaid(...C)),
                          class: 'btn btn-primary',
                          disabled: !n.hasSelectedRecords
                        },
                        ' Mark as Paid ',
                        8,
                        H2
                      )
                    ])
                  ])
                ]),
                l('div', $2, [
                  l('div', B2, [
                    l(
                      'table',
                      q2,
                      [
                        l('thead', null, [
                          l('tr', null, [
                            l('th', U2, [
                              Ct(
                                l(
                                  'input',
                                  {
                                    type: 'checkbox',
                                    onChange:
                                      t[12] || (t[12] = (...C) => n.toggleAllSelection && n.toggleAllSelection(...C)),
                                    'onUpdate:modelValue': t[13] || (t[13] = C => (n.allSelected = C))
                                  },
                                  null,
                                  544
                                ),
                                [[Ii, n.allSelected]]
                              )
                            ]),
                            t[37] || (t[37] = l('th', null, 'Employee', -1)),
                            t[38] || (t[38] = l('th', null, 'Period', -1)),
                            t[39] || (t[39] = l('th', null, 'Regular Hours', -1)),
                            t[40] || (t[40] = l('th', null, 'Overtime Hours', -1)),
                            t[41] || (t[41] = l('th', null, 'Base Salary', -1)),
                            t[42] || (t[42] = l('th', null, 'Total Amount', -1)),
                            t[43] || (t[43] = l('th', null, 'Status', -1)),
                            t[44] || (t[44] = l('th', null, 'Actions', -1))
                          ])
                        ])
                      ],
                      512
                    )
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      l('div', W2, [
        l('div', V2, [
          l('div', z2, [
            t[55] ||
              (t[55] = l(
                'div',
                { class: 'modal-header' },
                [
                  l('h5', { class: 'modal-title' }, 'Generate Payroll'),
                  l('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' })
                ],
                -1
              )),
            l(
              'form',
              { onSubmit: t[19] || (t[19] = ta((...C) => n.generatePayroll && n.generatePayroll(...C), ['prevent'])) },
              [
                l('div', K2, [
                  l('div', X2, [
                    l('div', G2, [
                      l('div', J2, [
                        t[45] || (t[45] = l('label', { class: 'form-label' }, 'Period Start', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'date',
                              class: dt(['form-control', { 'is-invalid': n.errors.period_start }]),
                              'onUpdate:modelValue': t[14] || (t[14] = C => (n.generateForm.period_start = C)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.generateForm.period_start]]
                        ),
                        n.errors.period_start ? (he(), pe('div', Y2, Q(n.errors.period_start[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', Q2, [
                      l('div', Z2, [
                        t[46] || (t[46] = l('label', { class: 'form-label' }, 'Period End', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'date',
                              class: dt(['form-control', { 'is-invalid': n.errors.period_end }]),
                              'onUpdate:modelValue': t[15] || (t[15] = C => (n.generateForm.period_end = C)),
                              required: ''
                            },
                            null,
                            2
                          ),
                          [[ln, n.generateForm.period_end]]
                        ),
                        n.errors.period_end ? (he(), pe('div', eA, Q(n.errors.period_end[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  n.generateType === 'selected'
                    ? (he(),
                      pe('div', tA, [
                        t[49] || (t[49] = l('label', { class: 'form-label' }, 'Select Employees', -1)),
                        l('div', nA, [
                          (he(!0),
                          pe(
                            tn,
                            null,
                            or(
                              n.employees,
                              C => (
                                he(),
                                pe('label', { key: C.id, class: 'form-selectgroup-item flex-fill' }, [
                                  Ct(
                                    l(
                                      'input',
                                      {
                                        type: 'checkbox',
                                        class: 'form-selectgroup-input',
                                        value: C.id,
                                        'onUpdate:modelValue': t[16] || (t[16] = A => (n.generateForm.employee_ids = A))
                                      },
                                      null,
                                      8,
                                      rA
                                    ),
                                    [[Ii, n.generateForm.employee_ids]]
                                  ),
                                  l('div', iA, [
                                    t[48] ||
                                      (t[48] = l(
                                        'div',
                                        { class: 'me-3' },
                                        [l('span', { class: 'form-selectgroup-check' })],
                                        -1
                                      )),
                                    l('div', null, [
                                      l('strong', null, Q(C.name), 1),
                                      t[47] || (t[47] = l('br', null, null, -1)),
                                      l('small', oA, Q(C.employee_number) + ' - ' + Q(C.employee_type.name), 1)
                                    ])
                                  ])
                                ])
                              )
                            ),
                            128
                          ))
                        ])
                      ]))
                    : Ye('', !0),
                  l('div', sA, [
                    l('label', aA, [
                      Ct(
                        l(
                          'input',
                          {
                            type: 'checkbox',
                            class: 'form-check-input',
                            'onUpdate:modelValue': t[17] || (t[17] = C => (n.generateForm.include_overtime = C))
                          },
                          null,
                          512
                        ),
                        [[Ii, n.generateForm.include_overtime]]
                      ),
                      t[50] || (t[50] = l('span', { class: 'form-check-label' }, 'Include Overtime Calculations', -1))
                    ])
                  ]),
                  l('div', lA, [
                    l('label', cA, [
                      Ct(
                        l(
                          'input',
                          {
                            type: 'checkbox',
                            class: 'form-check-input',
                            'onUpdate:modelValue': t[18] || (t[18] = C => (n.generateForm.auto_approve = C))
                          },
                          null,
                          512
                        ),
                        [[Ii, n.generateForm.auto_approve]]
                      ),
                      t[51] || (t[51] = l('span', { class: 'form-check-label' }, 'Auto-approve generated records', -1))
                    ])
                  ]),
                  t[52] ||
                    (t[52] = Tr(
                      '<div class="alert alert-info" data-v-03d21f3c><div class="d-flex" data-v-03d21f3c><div data-v-03d21f3c><svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-03d21f3c><circle cx="12" cy="12" r="9" data-v-03d21f3c></circle><path d="M12 8h.01" data-v-03d21f3c></path><path d="M11 12h1v4h1" data-v-03d21f3c></path></svg></div><div data-v-03d21f3c><h4 class="alert-title" data-v-03d21f3c>Honorary Teacher Calculation</h4><div class="text-muted" data-v-03d21f3c> Honorary teachers will only be paid for hours worked within their scheduled time slots. Hours worked outside of scheduled periods will not be counted for payroll. </div></div></div></div>',
                      1
                    ))
                ]),
                l('div', uA, [
                  t[54] ||
                    (t[54] = l(
                      'button',
                      { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                      'Cancel',
                      -1
                    )),
                  l(
                    'button',
                    { type: 'submit', class: 'btn btn-primary', disabled: n.generating },
                    [n.generating ? (he(), pe('span', fA)) : Ye('', !0), t[53] || (t[53] = Kt(' Generate Payroll '))],
                    8,
                    dA
                  )
                ])
              ],
              32
            )
          ])
        ])
      ]),
      l('div', hA, [
        l('div', pA, [
          l('div', mA, [
            t[77] ||
              (t[77] = l(
                'div',
                { class: 'modal-header' },
                [
                  l('h5', { class: 'modal-title' }, 'Payroll Details'),
                  l('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' })
                ],
                -1
              )),
            n.selectedPayroll
              ? (he(),
                pe('div', vA, [
                  l('div', gA, [
                    l('div', bA, [
                      t[60] || (t[60] = l('h6', null, 'Employee Information', -1)),
                      l('table', yA, [
                        l('tr', null, [
                          t[56] || (t[56] = l('td', { class: 'w-50' }, 'Name:', -1)),
                          l('td', null, [
                            l('strong', null, Q((a = n.selectedPayroll.employee) == null ? void 0 : a.name), 1)
                          ])
                        ]),
                        l('tr', null, [
                          t[57] || (t[57] = l('td', null, 'Employee Number:', -1)),
                          l('td', null, Q((d = n.selectedPayroll.employee) == null ? void 0 : d.employee_number), 1)
                        ]),
                        l('tr', null, [
                          t[58] || (t[58] = l('td', null, 'Type:', -1)),
                          l('td', null, [
                            l(
                              'span',
                              _A,
                              Q(
                                (g = (f = n.selectedPayroll.employee) == null ? void 0 : f.employee_type) == null
                                  ? void 0
                                  : g.name
                              ),
                              1
                            )
                          ])
                        ]),
                        l('tr', null, [
                          t[59] || (t[59] = l('td', null, 'Position:', -1)),
                          l('td', null, Q((p = n.selectedPayroll.employee) == null ? void 0 : p.position), 1)
                        ])
                      ])
                    ]),
                    l('div', wA, [
                      t[65] || (t[65] = l('h6', null, 'Payroll Summary', -1)),
                      l('table', xA, [
                        l('tr', null, [
                          t[61] || (t[61] = l('td', { class: 'w-50' }, 'Period:', -1)),
                          l('td', null, Q(n.selectedPayroll.period_start) + ' to ' + Q(n.selectedPayroll.period_end), 1)
                        ]),
                        l('tr', null, [
                          t[62] || (t[62] = l('td', null, 'Status:', -1)),
                          l('td', null, [
                            l(
                              'span',
                              { class: dt(['badge', n.getStatusBadgeClass(n.selectedPayroll.status)]) },
                              Q(n.selectedPayroll.status),
                              3
                            )
                          ])
                        ]),
                        l('tr', null, [
                          t[63] || (t[63] = l('td', null, 'Generated:', -1)),
                          l('td', null, Q(n.formatDate(n.selectedPayroll.created_at)), 1)
                        ]),
                        n.selectedPayroll.approved_at
                          ? (he(),
                            pe('tr', SA, [
                              t[64] || (t[64] = l('td', null, 'Approved:', -1)),
                              l('td', null, Q(n.formatDate(n.selectedPayroll.approved_at)), 1)
                            ]))
                          : Ye('', !0)
                      ])
                    ])
                  ]),
                  t[75] || (t[75] = l('hr', null, null, -1)),
                  l('div', CA, [
                    l('div', TA, [
                      t[69] || (t[69] = l('h6', null, 'Work Hours', -1)),
                      l('table', AA, [
                        l('tr', null, [
                          t[66] || (t[66] = l('td', null, 'Regular Hours:', -1)),
                          l('td', DA, Q(n.selectedPayroll.regular_hours) + 'h', 1)
                        ]),
                        l('tr', null, [
                          t[67] || (t[67] = l('td', null, 'Overtime Hours:', -1)),
                          l('td', kA, Q(n.selectedPayroll.overtime_hours) + 'h', 1)
                        ]),
                        l('tr', null, [
                          t[68] || (t[68] = l('td', null, 'Total Hours:', -1)),
                          l('td', EA, [l('strong', null, Q(n.selectedPayroll.total_hours) + 'h', 1)])
                        ])
                      ])
                    ]),
                    l('div', OA, [
                      t[74] || (t[74] = l('h6', null, 'Salary Calculation', -1)),
                      l('table', PA, [
                        l('tr', null, [
                          t[70] || (t[70] = l('td', null, 'Base Salary:', -1)),
                          l('td', RA, 'Rp ' + Q(n.formatCurrency(n.selectedPayroll.base_salary)), 1)
                        ]),
                        l('tr', null, [
                          t[71] || (t[71] = l('td', null, 'Overtime Pay:', -1)),
                          l('td', LA, 'Rp ' + Q(n.formatCurrency(n.selectedPayroll.overtime_pay)), 1)
                        ]),
                        l('tr', null, [
                          t[72] || (t[72] = l('td', null, 'Deductions:', -1)),
                          l('td', MA, '-Rp ' + Q(n.formatCurrency(n.selectedPayroll.deductions)), 1)
                        ]),
                        l('tr', IA, [
                          t[73] || (t[73] = l('td', null, [l('strong', null, 'Total Amount:')], -1)),
                          l('td', FA, [
                            l('strong', null, 'Rp ' + Q(n.formatCurrency(n.selectedPayroll.total_amount)), 1)
                          ])
                        ])
                      ])
                    ])
                  ])
                ]))
              : Ye('', !0),
            l('div', jA, [
              t[76] ||
                (t[76] = l(
                  'button',
                  { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                  'Close',
                  -1
                )),
              ((y = n.selectedPayroll) == null ? void 0 : y.status) === 'pending'
                ? (he(),
                  pe(
                    'button',
                    {
                      key: 0,
                      onClick: t[20] || (t[20] = C => n.approvePayroll(n.selectedPayroll.id)),
                      class: 'btn btn-success'
                    },
                    ' Approve '
                  ))
                : Ye('', !0),
              ((_ = n.selectedPayroll) == null ? void 0 : _.status) === 'approved'
                ? (he(),
                  pe(
                    'button',
                    {
                      key: 1,
                      onClick: t[21] || (t[21] = C => n.markAsPaid(n.selectedPayroll.id)),
                      class: 'btn btn-primary'
                    },
                    ' Mark as Paid '
                  ))
                : Ye('', !0)
            ])
          ])
        ])
      ])
    ])
  )
}
const Hm = yo(n2, [
    ['render', NA],
    ['__scopeId', 'data-v-03d21f3c']
  ]),
  HA = {
    name: 'LeaveManager',
    setup() {
      const e = qe(null),
        t = qe(null),
        r = qe(!1),
        n = qe(!1),
        i = qe(!1),
        s = qe(!1),
        a = qe([]),
        d = qe({}),
        f = qe([]),
        g = qe(null),
        p = qe([]),
        y = qe(!0),
        _ = qe(''),
        C = nn({ pending: 0, approved: 0, totalDays: 0, conflicts: 0 }),
        A = nn({
          id: null,
          employee_id: '',
          leave_type: '',
          start_date: '',
          end_date: '',
          total_days: 0,
          is_half_day: !1,
          reason: '',
          emergency_contact: '',
          attachments: []
        }),
        k = sr(() => a.value.length > 0),
        F = () => {
          ;(t.value && t.value.destroy(),
            (t.value = gt(e.value).DataTable({
              processing: !0,
              serverSide: !0,
              ajax: {
                url: '/api/v1/leaves',
                type: 'GET',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') }
              },
              columns: [
                {
                  data: 'id',
                  name: 'checkbox',
                  orderable: !1,
                  searchable: !1,
                  render: function (_e) {
                    return `<input type="checkbox" class="leave-checkbox" value="${_e}">`
                  }
                },
                {
                  data: 'employee.name',
                  name: 'employee.name',
                  render: function (_e, Ke, $e) {
                    return `
                <div class="d-flex align-items-center">
                  <span class="avatar avatar-sm me-2">${$e.employee.name.charAt(0)}</span>
                  <div>
                    <div class="fw-bold">${_e}</div>
                    <div class="text-muted small">${$e.employee.employee_number}</div>
                  </div>
                </div>
              `
                  }
                },
                {
                  data: 'leave_type',
                  name: 'leave_type',
                  render: function (_e) {
                    return `<span class="badge bg-${{ annual: 'primary', sick: 'warning', emergency: 'danger', maternity: 'info', paternity: 'info', unpaid: 'secondary' }[_e] || 'secondary'}">${_e}</span>`
                  }
                },
                { data: 'start_date', name: 'start_date' },
                { data: 'end_date', name: 'end_date' },
                {
                  data: 'total_days',
                  name: 'total_days',
                  render: function (_e, Ke, $e) {
                    return $e.is_half_day ? `${_e} (Half Day)` : _e
                  }
                },
                {
                  data: 'reason',
                  name: 'reason',
                  render: function (_e) {
                    return _e.length > 50 ? _e.substring(0, 50) + '...' : _e
                  }
                },
                {
                  data: 'status',
                  name: 'status',
                  render: function (_e) {
                    return `<span class="badge bg-${{ pending: 'warning', approved: 'success', rejected: 'danger' }[_e] || 'secondary'}">${_e}</span>`
                  }
                },
                {
                  data: 'id',
                  name: 'actions',
                  orderable: !1,
                  searchable: !1,
                  render: function (_e, Ke, $e) {
                    let K = `
                <div class="btn-group" role="group">
                  <button onclick="window.viewLeaveDetails(${_e})" class="btn btn-sm btn-outline-secondary">
                    View Details
                  </button>
              `
                    return (
                      $e.status === 'pending' &&
                        (K += `
                  <button onclick="window.approveLeave(${_e})" class="btn btn-sm btn-success">Approve</button>
                  <button onclick="window.rejectLeave(${_e})" class="btn btn-sm btn-danger">Reject</button>
                `),
                      (K += '</div>'),
                      K
                    )
                  }
                }
              ],
              order: [[3, 'desc']],
              pageLength: 15,
              responsive: !0,
              drawCallback: function () {
                gt('.leave-checkbox')
                  .off('change')
                  .on('change', function () {
                    N()
                  })
              }
            })))
        },
        N = () => {
          ;((a.value = gt('.leave-checkbox:checked')
            .map(function () {
              return parseInt(this.value)
            })
            .get()),
            (s.value =
              gt('.leave-checkbox').length > 0 &&
              gt('.leave-checkbox:checked').length === gt('.leave-checkbox').length))
        },
        E = () => {
          ;(gt('.leave-checkbox').prop('checked', s.value), N())
        },
        z = async () => {
          try {
            const _e = await Fe.get('/api/v1/leaves/stats')
            Object.assign(C, _e.data)
          } catch (_e) {
            console.error('Error loading leave stats:', _e)
          }
        },
        Y = async () => {
          try {
            const _e = await Fe.get('/api/v1/employees?active=1')
            f.value = _e.data.data
          } catch (_e) {
            console.error('Error loading employees:', _e)
          }
        },
        ue = () => {
          if (A.start_date && A.end_date) {
            const _e = new Date(A.start_date),
              $e = new Date(A.end_date).getTime() - _e.getTime()
            let K = Math.ceil($e / (1e3 * 3600 * 24)) + 1
            ;(A.is_half_day && K === 1 ? (A.total_days = 0.5) : (A.total_days = K), ke())
          }
        },
        ke = async () => {
          if (A.employee_id && A.start_date && A.end_date)
            try {
              const _e = await Fe.post('/api/v1/leaves/check-conflicts', {
                employee_id: A.employee_id,
                start_date: A.start_date,
                end_date: A.end_date,
                exclude_id: A.id
              })
              p.value = _e.data.conflicts
            } catch (_e) {
              console.error('Error checking conflicts:', _e)
            }
        },
        m = () => {
          ;((r.value = !1), At(), gt('#leaveModal').modal('show'))
        },
        rt = async _e => {
          try {
            const $e = (await Fe.get(`/api/v1/leaves/${_e}`)).data.data
            ;((r.value = !0), Object.assign(A, $e), gt('#leaveModal').modal('show'))
          } catch (Ke) {
            ;(console.error('Error loading leave:', Ke), alert('Failed to load leave data'))
          }
        },
        Ne = async () => {
          var _e
          ;((n.value = !0), (d.value = {}))
          try {
            const Ke = new FormData()
            ;(Object.keys(A).forEach(ve => {
              A[ve] !== null && A[ve] !== void 0 && ve !== 'attachments' && Ke.append(ve, A[ve])
            }),
              A.attachments.forEach((ve, Se) => {
                Ke.append(`attachments[${Se}]`, ve)
              }))
            let $e
            ;(r.value
              ? (Ke.append('_method', 'PUT'),
                ($e = await Fe.post(`/api/v1/leaves/${A.id}`, Ke, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                })))
              : ($e = await Fe.post('/api/v1/leaves', Ke, { headers: { 'Content-Type': 'multipart/form-data' } })),
              gt('#leaveModal').modal('hide'),
              t.value.ajax.reload(),
              await z())
            const K = r.value ? 'Leave request updated successfully' : 'Leave request submitted successfully'
            alert(K)
          } catch (Ke) {
            ;((_e = Ke.response) == null ? void 0 : _e.status) === 422
              ? (d.value = Ke.response.data.errors)
              : (console.error('Error saving leave:', Ke), alert('Failed to save leave request. Please try again.'))
          } finally {
            n.value = !1
          }
        },
        fe = async _e => {
          try {
            const Ke = await Fe.get(`/api/v1/leaves/${_e}`)
            ;((g.value = Ke.data.data), gt('#detailsModal').modal('show'))
          } catch (Ke) {
            ;(console.error('Error loading leave details:', Ke), alert('Failed to load leave details'))
          }
        },
        He = (_e = !0) => {
          ;((y.value = _e), (_.value = ''), gt('#detailsModal').modal('hide'), gt('#approvalModal').modal('show'))
        },
        it = async () => {
          i.value = !0
          try {
            const _e = y.value ? 'approve' : 'reject'
            ;(await Fe.post(`/api/v1/leaves/${g.value.id}/${_e}`, { approval_notes: _.value }),
              gt('#approvalModal').modal('hide'),
              t.value.ajax.reload(),
              await z())
            const Ke = y.value ? 'Leave request approved successfully' : 'Leave request rejected successfully'
            alert(Ke)
          } catch (_e) {
            ;(console.error('Error processing approval:', _e), alert('Failed to process leave request'))
          } finally {
            i.value = !1
          }
        },
        Pe = async _e => {
          try {
            const Ke = await Fe.get(`/api/v1/leaves/${_e}`)
            ;((g.value = Ke.data.data), He(!0))
          } catch (Ke) {
            console.error('Error loading leave:', Ke)
          }
        },
        re = async _e => {
          try {
            const Ke = await Fe.get(`/api/v1/leaves/${_e}`)
            ;((g.value = Ke.data.data), He(!1))
          } catch (Ke) {
            console.error('Error loading leave:', Ke)
          }
        },
        Ee = async () => {
          if (confirm(`Are you sure you want to approve ${a.value.length} leave requests?`))
            try {
              ;(await Fe.post('/api/v1/leaves/bulk-approve', { leave_ids: a.value }),
                t.value.ajax.reload(),
                await z(),
                (a.value = []),
                (s.value = !1),
                alert('Leave requests approved successfully!'))
            } catch (_e) {
              ;(console.error('Error bulk approving leaves:', _e), alert('Failed to approve leave requests'))
            }
        },
        Me = async () => {
          const _e = prompt('Please provide a reason for bulk rejection:')
          if (_e)
            try {
              ;(await Fe.post('/api/v1/leaves/bulk-reject', { leave_ids: a.value, approval_notes: _e }),
                t.value.ajax.reload(),
                await z(),
                (a.value = []),
                (s.value = !1),
                alert('Leave requests rejected successfully!'))
            } catch (Ke) {
              ;(console.error('Error bulk rejecting leaves:', Ke), alert('Failed to reject leave requests'))
            }
        },
        Be = _e => {
          _e === 'all' ? t.value.column(7).search('').draw() : t.value.column(7).search(_e).draw()
        },
        We = _e => {
          t.value.column(2).search(_e).draw()
        },
        ht = _e => {
          A.attachments = Array.from(_e.target.files)
        },
        At = () => {
          ;(Object.assign(A, {
            id: null,
            employee_id: '',
            leave_type: '',
            start_date: '',
            end_date: '',
            total_days: 0,
            is_half_day: !1,
            reason: '',
            emergency_contact: '',
            attachments: []
          }),
            (d.value = {}),
            (p.value = []))
        },
        Gt = () => {
          window.open('/api/v1/leaves/export?format=csv', '_blank')
        },
        Tt = _e =>
          new Date(_e).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
        rn = _e => ({ pending: 'bg-warning', approved: 'bg-success', rejected: 'bg-danger' })[_e] || 'bg-secondary'
      return (
        qi(async () => {
          ;(await Promise.all([z(), Y()]),
            await Bi(),
            F(),
            (window.viewLeaveDetails = fe),
            (window.approveLeave = Pe),
            (window.rejectLeave = re))
        }),
        {
          leaveTable: e,
          editMode: r,
          saving: n,
          processing: i,
          allSelected: s,
          hasSelectedRequests: k,
          errors: d,
          employees: f,
          selectedLeave: g,
          conflicts: p,
          approvalAction: y,
          approvalNotes: _,
          leaveStats: C,
          leaveForm: A,
          showAddModal: m,
          editLeave: rt,
          saveLeave: Ne,
          viewLeaveDetails: fe,
          showApprovalModal: He,
          processApproval: it,
          bulkApprove: Ee,
          bulkReject: Me,
          filterByStatus: Be,
          filterByType: We,
          handleFileUpload: ht,
          resetForm: At,
          exportLeaves: Gt,
          formatDate: Tt,
          getStatusBadgeClass: rn,
          toggleAllSelection: E,
          calculateLeaveDays: ue
        }
      )
    }
  },
  $A = { class: 'page' },
  BA = { class: 'page-header d-print-none' },
  qA = { class: 'container-xl' },
  UA = { class: 'row g-2 align-items-center' },
  WA = { class: 'col-auto ms-auto d-print-none' },
  VA = { class: 'btn-list' },
  zA = { class: 'page-body' },
  KA = { class: 'container-xl' },
  XA = { class: 'row row-deck row-cards mb-3' },
  GA = { class: 'col-sm-6 col-lg-3' },
  JA = { class: 'card' },
  YA = { class: 'card-body' },
  QA = { class: 'h1 mb-3 text-warning' },
  ZA = { class: 'col-sm-6 col-lg-3' },
  eD = { class: 'card' },
  tD = { class: 'card-body' },
  nD = { class: 'h1 mb-3 text-success' },
  rD = { class: 'col-sm-6 col-lg-3' },
  iD = { class: 'card' },
  oD = { class: 'card-body' },
  sD = { class: 'h1 mb-3' },
  aD = { class: 'col-sm-6 col-lg-3' },
  lD = { class: 'card' },
  cD = { class: 'card-body' },
  uD = { class: 'row row-deck row-cards' },
  dD = { class: 'col-12' },
  fD = { class: 'card' },
  hD = { class: 'card-header' },
  pD = { class: 'card-actions' },
  mD = { class: 'dropdown' },
  vD = { class: 'dropdown-menu' },
  gD = { class: 'btn-group ms-2' },
  bD = ['disabled'],
  yD = ['disabled'],
  _D = { class: 'card-body' },
  wD = { class: 'table-responsive' },
  xD = { ref: 'leaveTable', class: 'table table-vcenter card-table', style: { width: '100%' } },
  SD = { width: '30' },
  CD = { class: 'modal modal-blur fade', id: 'leaveModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  TD = { class: 'modal-dialog modal-lg modal-dialog-centered', role: 'document' },
  AD = { class: 'modal-content' },
  DD = { class: 'modal-header' },
  kD = { class: 'modal-title' },
  ED = { class: 'modal-body' },
  OD = { class: 'row' },
  PD = { class: 'col-lg-6' },
  RD = { class: 'mb-3' },
  LD = ['value'],
  MD = { key: 0, class: 'invalid-feedback' },
  ID = { class: 'col-lg-6' },
  FD = { class: 'mb-3' },
  jD = { key: 0, class: 'invalid-feedback' },
  ND = { class: 'row' },
  HD = { class: 'col-lg-6' },
  $D = { class: 'mb-3' },
  BD = { key: 0, class: 'invalid-feedback' },
  qD = { class: 'col-lg-6' },
  UD = { class: 'mb-3' },
  WD = { key: 0, class: 'invalid-feedback' },
  VD = { class: 'row' },
  zD = { class: 'col-lg-6' },
  KD = { class: 'mb-3' },
  XD = { class: 'col-lg-6' },
  GD = { class: 'mb-3' },
  JD = { class: 'form-check form-switch' },
  YD = { class: 'mb-3' },
  QD = { key: 0, class: 'invalid-feedback' },
  ZD = { class: 'mb-3' },
  ek = { class: 'mb-3' },
  tk = { key: 0, class: 'alert alert-warning' },
  nk = { class: 'd-flex' },
  rk = { class: 'mb-0' },
  ik = { class: 'modal-footer' },
  ok = ['disabled'],
  sk = { key: 0, class: 'spinner-border spinner-border-sm me-2', role: 'status' },
  ak = { class: 'modal modal-blur fade', id: 'detailsModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  lk = { class: 'modal-dialog modal-xl modal-dialog-centered', role: 'document' },
  ck = { class: 'modal-content' },
  uk = { key: 0, class: 'modal-body' },
  dk = { class: 'row' },
  fk = { class: 'col-md-6' },
  hk = { class: 'table table-borderless' },
  pk = { class: 'col-md-6' },
  mk = { class: 'table table-borderless' },
  vk = { class: 'badge bg-info' },
  gk = { class: 'row' },
  bk = { class: 'col-12' },
  yk = { class: 'text-muted' },
  _k = { key: 0, class: 'row' },
  wk = { class: 'col-12' },
  xk = { class: 'text-muted' },
  Sk = { key: 1, class: 'row' },
  Ck = { class: 'col-12' },
  Tk = { class: 'list-group' },
  Ak = ['href'],
  Dk = { class: 'd-flex align-items-center' },
  kk = { class: 'text-muted' },
  Ek = { key: 2, class: 'row mt-3' },
  Ok = { class: 'col-12' },
  Pk = { class: 'table table-borderless' },
  Rk = { key: 0 },
  Lk = { key: 1 },
  Mk = { key: 2 },
  Ik = { class: 'modal-footer' },
  Fk = { key: 0, class: 'btn-group' },
  jk = { class: 'modal modal-blur fade', id: 'approvalModal', tabindex: '-1', role: 'dialog', 'aria-hidden': 'true' },
  Nk = { class: 'modal-dialog modal-dialog-centered', role: 'document' },
  Hk = { class: 'modal-content' },
  $k = { class: 'modal-header' },
  Bk = { class: 'modal-title' },
  qk = { class: 'modal-body' },
  Uk = { class: 'mb-3' },
  Wk = { class: 'form-label' },
  Vk = ['placeholder'],
  zk = { class: 'modal-footer' },
  Kk = ['disabled'],
  Xk = { key: 0, class: 'spinner-border spinner-border-sm me-2', role: 'status' }
function Gk(e, t, r, n, i, s) {
  var a, d, f, g, p, y
  return (
    he(),
    pe('div', $A, [
      l('div', BA, [
        l('div', qA, [
          l('div', UA, [
            t[32] ||
              (t[32] = l(
                'div',
                { class: 'col' },
                [
                  l('div', { class: 'page-pretitle' }, ' Human Resources '),
                  l('h2', { class: 'page-title' }, ' Leave Management ')
                ],
                -1
              )),
            l('div', WA, [
              l('div', VA, [
                l(
                  'button',
                  { onClick: t[0] || (t[0] = (..._) => n.exportLeaves && n.exportLeaves(..._)), class: 'btn' },
                  t[30] ||
                    (t[30] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M14 3v4a1 1 0 0 0 1 1h4' }),
                          l('path', { d: 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z' })
                        ],
                        -1
                      ),
                      Kt(' Export ')
                    ])
                ),
                l(
                  'button',
                  {
                    onClick: t[1] || (t[1] = (..._) => n.showAddModal && n.showAddModal(..._)),
                    class: 'btn btn-primary d-none d-sm-inline-block'
                  },
                  t[31] ||
                    (t[31] = [
                      l(
                        'svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          class: 'icon me-2',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          'stroke-width': '2',
                          stroke: 'currentColor',
                          fill: 'none',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        [
                          l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                          l('path', { d: 'M12 5l0 14' }),
                          l('path', { d: 'M5 12l14 0' })
                        ],
                        -1
                      ),
                      Kt(' Request Leave ')
                    ])
                )
              ])
            ])
          ])
        ])
      ]),
      l('div', zA, [
        l('div', KA, [
          l('div', XA, [
            l('div', GA, [
              l('div', JA, [
                l('div', YA, [
                  t[33] ||
                    (t[33] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Pending Requests')],
                      -1
                    )),
                  l('div', QA, Q(n.leaveStats.pending), 1),
                  t[34] || (t[34] = l('div', { class: 'text-muted' }, 'Awaiting approval', -1))
                ])
              ])
            ]),
            l('div', ZA, [
              l('div', eD, [
                l('div', tD, [
                  t[35] ||
                    (t[35] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Approved')],
                      -1
                    )),
                  l('div', nD, Q(n.leaveStats.approved), 1),
                  t[36] || (t[36] = l('div', { class: 'text-muted' }, 'This month', -1))
                ])
              ])
            ]),
            l('div', rD, [
              l('div', iD, [
                l('div', oD, [
                  t[37] ||
                    (t[37] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Total Days')],
                      -1
                    )),
                  l('div', sD, Q(n.leaveStats.totalDays), 1),
                  t[38] || (t[38] = l('div', { class: 'text-muted' }, 'Leave days taken', -1))
                ])
              ])
            ]),
            l('div', aD, [
              l('div', lD, [
                l('div', cD, [
                  t[39] ||
                    (t[39] = l(
                      'div',
                      { class: 'd-flex align-items-center' },
                      [l('div', { class: 'subheader' }, 'Conflicts')],
                      -1
                    )),
                  l(
                    'div',
                    { class: dt(['h1 mb-3', n.leaveStats.conflicts > 0 ? 'text-danger' : 'text-success']) },
                    Q(n.leaveStats.conflicts),
                    3
                  ),
                  t[40] || (t[40] = l('div', { class: 'text-muted' }, 'Schedule conflicts', -1))
                ])
              ])
            ])
          ]),
          l('div', uD, [
            l('div', dD, [
              l('div', fD, [
                l('div', hD, [
                  t[43] || (t[43] = l('h3', { class: 'card-title' }, 'Leave Requests', -1)),
                  l('div', pD, [
                    l('div', mD, [
                      t[42] ||
                        (t[42] = l(
                          'button',
                          { class: 'btn dropdown-toggle', 'data-bs-toggle': 'dropdown' },
                          [
                            l(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                class: 'icon',
                                width: '24',
                                height: '24',
                                viewBox: '0 0 24 24',
                                'stroke-width': '2',
                                stroke: 'currentColor',
                                fill: 'none',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round'
                              },
                              [
                                l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                l('path', {
                                  d: 'M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5'
                                })
                              ]
                            ),
                            Kt(' Filter ')
                          ],
                          -1
                        )),
                      l('div', vD, [
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[2] || (t[2] = _ => n.filterByStatus('all')) },
                          'All Requests'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[3] || (t[3] = _ => n.filterByStatus('pending'))
                          },
                          'Pending'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[4] || (t[4] = _ => n.filterByStatus('approved'))
                          },
                          'Approved'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[5] || (t[5] = _ => n.filterByStatus('rejected'))
                          },
                          'Rejected'
                        ),
                        t[41] || (t[41] = l('div', { class: 'dropdown-divider' }, null, -1)),
                        l(
                          'a',
                          { class: 'dropdown-item', href: '#', onClick: t[6] || (t[6] = _ => n.filterByType('sick')) },
                          'Sick Leave'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[7] || (t[7] = _ => n.filterByType('annual'))
                          },
                          'Annual Leave'
                        ),
                        l(
                          'a',
                          {
                            class: 'dropdown-item',
                            href: '#',
                            onClick: t[8] || (t[8] = _ => n.filterByType('emergency'))
                          },
                          'Emergency Leave'
                        )
                      ])
                    ]),
                    l('div', gD, [
                      l(
                        'button',
                        {
                          onClick: t[9] || (t[9] = (..._) => n.bulkApprove && n.bulkApprove(..._)),
                          class: 'btn btn-success',
                          disabled: !n.hasSelectedRequests
                        },
                        ' Bulk Approve ',
                        8,
                        bD
                      ),
                      l(
                        'button',
                        {
                          onClick: t[10] || (t[10] = (..._) => n.bulkReject && n.bulkReject(..._)),
                          class: 'btn btn-danger',
                          disabled: !n.hasSelectedRequests
                        },
                        ' Bulk Reject ',
                        8,
                        yD
                      )
                    ])
                  ])
                ]),
                l('div', _D, [
                  l('div', wD, [
                    l(
                      'table',
                      xD,
                      [
                        l('thead', null, [
                          l('tr', null, [
                            l('th', SD, [
                              Ct(
                                l(
                                  'input',
                                  {
                                    type: 'checkbox',
                                    onChange:
                                      t[11] || (t[11] = (..._) => n.toggleAllSelection && n.toggleAllSelection(..._)),
                                    'onUpdate:modelValue': t[12] || (t[12] = _ => (n.allSelected = _))
                                  },
                                  null,
                                  544
                                ),
                                [[Ii, n.allSelected]]
                              )
                            ]),
                            t[44] || (t[44] = l('th', null, 'Employee', -1)),
                            t[45] || (t[45] = l('th', null, 'Type', -1)),
                            t[46] || (t[46] = l('th', null, 'Start Date', -1)),
                            t[47] || (t[47] = l('th', null, 'End Date', -1)),
                            t[48] || (t[48] = l('th', null, 'Days', -1)),
                            t[49] || (t[49] = l('th', null, 'Reason', -1)),
                            t[50] || (t[50] = l('th', null, 'Status', -1)),
                            t[51] || (t[51] = l('th', null, 'Actions', -1))
                          ])
                        ])
                      ],
                      512
                    )
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      l('div', CD, [
        l('div', TD, [
          l('div', AD, [
            l('div', DD, [
              l('h5', kD, Q(n.editMode ? 'Edit Leave Request' : 'New Leave Request'), 1),
              t[52] ||
                (t[52] = l(
                  'button',
                  { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' },
                  null,
                  -1
                ))
            ]),
            l(
              'form',
              { onSubmit: t[25] || (t[25] = ta((..._) => n.saveLeave && n.saveLeave(..._), ['prevent'])) },
              [
                l('div', ED, [
                  l('div', OD, [
                    l('div', PD, [
                      l('div', RD, [
                        t[54] || (t[54] = l('label', { class: 'form-label' }, 'Employee', -1)),
                        Ct(
                          l(
                            'select',
                            {
                              class: dt(['form-select', { 'is-invalid': n.errors.employee_id }]),
                              'onUpdate:modelValue': t[13] || (t[13] = _ => (n.leaveForm.employee_id = _)),
                              required: ''
                            },
                            [
                              t[53] || (t[53] = l('option', { value: '' }, 'Select Employee', -1)),
                              (he(!0),
                              pe(
                                tn,
                                null,
                                or(
                                  n.employees,
                                  _ => (
                                    he(),
                                    pe(
                                      'option',
                                      { key: _.id, value: _.id },
                                      Q(_.name) + ' (' + Q(_.employee_number) + ') ',
                                      9,
                                      LD
                                    )
                                  )
                                ),
                                128
                              ))
                            ],
                            2
                          ),
                          [[Zs, n.leaveForm.employee_id]]
                        ),
                        n.errors.employee_id ? (he(), pe('div', MD, Q(n.errors.employee_id[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', ID, [
                      l('div', FD, [
                        t[56] || (t[56] = l('label', { class: 'form-label' }, 'Leave Type', -1)),
                        Ct(
                          l(
                            'select',
                            {
                              class: dt(['form-select', { 'is-invalid': n.errors.leave_type }]),
                              'onUpdate:modelValue': t[14] || (t[14] = _ => (n.leaveForm.leave_type = _)),
                              required: ''
                            },
                            t[55] ||
                              (t[55] = [
                                Tr(
                                  '<option value="" data-v-ef5532c9>Select Type</option><option value="annual" data-v-ef5532c9>Annual Leave</option><option value="sick" data-v-ef5532c9>Sick Leave</option><option value="emergency" data-v-ef5532c9>Emergency Leave</option><option value="maternity" data-v-ef5532c9>Maternity Leave</option><option value="paternity" data-v-ef5532c9>Paternity Leave</option><option value="unpaid" data-v-ef5532c9>Unpaid Leave</option>',
                                  7
                                )
                              ]),
                            2
                          ),
                          [[Zs, n.leaveForm.leave_type]]
                        ),
                        n.errors.leave_type ? (he(), pe('div', jD, Q(n.errors.leave_type[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', ND, [
                    l('div', HD, [
                      l('div', $D, [
                        t[57] || (t[57] = l('label', { class: 'form-label' }, 'Start Date', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'date',
                              class: dt(['form-control', { 'is-invalid': n.errors.start_date }]),
                              'onUpdate:modelValue': t[15] || (t[15] = _ => (n.leaveForm.start_date = _)),
                              onChange: t[16] || (t[16] = (..._) => n.calculateLeaveDays && n.calculateLeaveDays(..._)),
                              required: ''
                            },
                            null,
                            34
                          ),
                          [[ln, n.leaveForm.start_date]]
                        ),
                        n.errors.start_date ? (he(), pe('div', BD, Q(n.errors.start_date[0]), 1)) : Ye('', !0)
                      ])
                    ]),
                    l('div', qD, [
                      l('div', UD, [
                        t[58] || (t[58] = l('label', { class: 'form-label' }, 'End Date', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'date',
                              class: dt(['form-control', { 'is-invalid': n.errors.end_date }]),
                              'onUpdate:modelValue': t[17] || (t[17] = _ => (n.leaveForm.end_date = _)),
                              onChange: t[18] || (t[18] = (..._) => n.calculateLeaveDays && n.calculateLeaveDays(..._)),
                              required: ''
                            },
                            null,
                            34
                          ),
                          [[ln, n.leaveForm.end_date]]
                        ),
                        n.errors.end_date ? (he(), pe('div', WD, Q(n.errors.end_date[0]), 1)) : Ye('', !0)
                      ])
                    ])
                  ]),
                  l('div', VD, [
                    l('div', zD, [
                      l('div', KD, [
                        t[59] || (t[59] = l('label', { class: 'form-label' }, 'Total Days', -1)),
                        Ct(
                          l(
                            'input',
                            {
                              type: 'number',
                              class: 'form-control',
                              'onUpdate:modelValue': t[19] || (t[19] = _ => (n.leaveForm.total_days = _)),
                              readonly: ''
                            },
                            null,
                            512
                          ),
                          [[ln, n.leaveForm.total_days]]
                        ),
                        t[60] ||
                          (t[60] = l('small', { class: 'form-hint' }, 'Automatically calculated based on dates', -1))
                      ])
                    ]),
                    l('div', XD, [
                      l('div', GD, [
                        t[62] || (t[62] = l('label', { class: 'form-label' }, 'Half Day', -1)),
                        l('div', JD, [
                          Ct(
                            l(
                              'input',
                              {
                                class: 'form-check-input',
                                type: 'checkbox',
                                'onUpdate:modelValue': t[20] || (t[20] = _ => (n.leaveForm.is_half_day = _)),
                                onChange:
                                  t[21] || (t[21] = (..._) => n.calculateLeaveDays && n.calculateLeaveDays(..._))
                              },
                              null,
                              544
                            ),
                            [[Ii, n.leaveForm.is_half_day]]
                          ),
                          t[61] || (t[61] = l('label', { class: 'form-check-label' }, ' This is a half-day leave ', -1))
                        ])
                      ])
                    ])
                  ]),
                  l('div', YD, [
                    t[63] || (t[63] = l('label', { class: 'form-label' }, 'Reason', -1)),
                    Ct(
                      l(
                        'textarea',
                        {
                          class: dt(['form-control', { 'is-invalid': n.errors.reason }]),
                          'onUpdate:modelValue': t[22] || (t[22] = _ => (n.leaveForm.reason = _)),
                          rows: '3',
                          placeholder: 'Explain the reason for leave...',
                          required: ''
                        },
                        null,
                        2
                      ),
                      [[ln, n.leaveForm.reason]]
                    ),
                    n.errors.reason ? (he(), pe('div', QD, Q(n.errors.reason[0]), 1)) : Ye('', !0)
                  ]),
                  l('div', ZD, [
                    t[64] || (t[64] = l('label', { class: 'form-label' }, 'Supporting Documents (Optional)', -1)),
                    l(
                      'input',
                      {
                        type: 'file',
                        class: 'form-control',
                        onChange: t[23] || (t[23] = (..._) => n.handleFileUpload && n.handleFileUpload(..._)),
                        accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
                        multiple: ''
                      },
                      null,
                      32
                    ),
                    t[65] ||
                      (t[65] = l(
                        'small',
                        { class: 'form-hint' },
                        'Upload medical certificates, supporting documents, etc. (PDF, DOC, Images)',
                        -1
                      ))
                  ]),
                  l('div', ek, [
                    t[66] ||
                      (t[66] = l('label', { class: 'form-label' }, 'Emergency Contact (For emergency leave)', -1)),
                    Ct(
                      l(
                        'input',
                        {
                          type: 'text',
                          class: 'form-control',
                          'onUpdate:modelValue': t[24] || (t[24] = _ => (n.leaveForm.emergency_contact = _)),
                          placeholder: 'Name and phone number'
                        },
                        null,
                        512
                      ),
                      [[ln, n.leaveForm.emergency_contact]]
                    )
                  ]),
                  n.conflicts.length > 0
                    ? (he(),
                      pe('div', tk, [
                        l('div', nk, [
                          t[68] ||
                            (t[68] = l(
                              'div',
                              null,
                              [
                                l(
                                  'svg',
                                  {
                                    xmlns: 'http://www.w3.org/2000/svg',
                                    class: 'icon alert-icon',
                                    width: '24',
                                    height: '24',
                                    viewBox: '0 0 24 24',
                                    'stroke-width': '2',
                                    stroke: 'currentColor',
                                    fill: 'none',
                                    'stroke-linecap': 'round',
                                    'stroke-linejoin': 'round'
                                  },
                                  [
                                    l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                    l('path', { d: 'M12 9v2m0 4v.01' }),
                                    l('path', {
                                      d: 'M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75'
                                    })
                                  ]
                                )
                              ],
                              -1
                            )),
                          l('div', null, [
                            t[67] || (t[67] = l('h4', { class: 'alert-title' }, 'Schedule Conflicts Detected', -1)),
                            l('ul', rk, [
                              (he(!0),
                              pe(
                                tn,
                                null,
                                or(n.conflicts, _ => (he(), pe('li', { key: _ }, Q(_), 1))),
                                128
                              ))
                            ])
                          ])
                        ])
                      ]))
                    : Ye('', !0)
                ]),
                l('div', ik, [
                  t[69] ||
                    (t[69] = l(
                      'button',
                      { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                      'Cancel',
                      -1
                    )),
                  l(
                    'button',
                    { type: 'submit', class: 'btn btn-primary', disabled: n.saving },
                    [
                      n.saving ? (he(), pe('span', sk)) : Ye('', !0),
                      Kt(' ' + Q(n.editMode ? 'Update Request' : 'Submit Request'), 1)
                    ],
                    8,
                    ok
                  )
                ])
              ],
              32
            )
          ])
        ])
      ]),
      l('div', ak, [
        l('div', lk, [
          l('div', ck, [
            t[90] ||
              (t[90] = l(
                'div',
                { class: 'modal-header' },
                [
                  l('h5', { class: 'modal-title' }, 'Leave Request Details'),
                  l('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' })
                ],
                -1
              )),
            n.selectedLeave
              ? (he(),
                pe('div', uk, [
                  l('div', dk, [
                    l('div', fk, [
                      t[74] || (t[74] = l('h6', null, 'Employee Information', -1)),
                      l('table', hk, [
                        l('tr', null, [
                          t[70] || (t[70] = l('td', { class: 'w-50' }, 'Name:', -1)),
                          l('td', null, [
                            l('strong', null, Q((a = n.selectedLeave.employee) == null ? void 0 : a.name), 1)
                          ])
                        ]),
                        l('tr', null, [
                          t[71] || (t[71] = l('td', null, 'Employee Number:', -1)),
                          l('td', null, Q((d = n.selectedLeave.employee) == null ? void 0 : d.employee_number), 1)
                        ]),
                        l('tr', null, [
                          t[72] || (t[72] = l('td', null, 'Department:', -1)),
                          l('td', null, Q((f = n.selectedLeave.employee) == null ? void 0 : f.department), 1)
                        ]),
                        l('tr', null, [
                          t[73] || (t[73] = l('td', null, 'Position:', -1)),
                          l('td', null, Q((g = n.selectedLeave.employee) == null ? void 0 : g.position), 1)
                        ])
                      ])
                    ]),
                    l('div', pk, [
                      t[79] || (t[79] = l('h6', null, 'Leave Details', -1)),
                      l('table', mk, [
                        l('tr', null, [
                          t[75] || (t[75] = l('td', { class: 'w-50' }, 'Type:', -1)),
                          l('td', null, [l('span', vk, Q(n.selectedLeave.leave_type), 1)])
                        ]),
                        l('tr', null, [
                          t[76] || (t[76] = l('td', null, 'Period:', -1)),
                          l('td', null, Q(n.selectedLeave.start_date) + ' to ' + Q(n.selectedLeave.end_date), 1)
                        ]),
                        l('tr', null, [
                          t[77] || (t[77] = l('td', null, 'Total Days:', -1)),
                          l(
                            'td',
                            null,
                            Q(n.selectedLeave.total_days) +
                              ' ' +
                              Q(n.selectedLeave.is_half_day ? '(Half Day)' : 'days'),
                            1
                          )
                        ]),
                        l('tr', null, [
                          t[78] || (t[78] = l('td', null, 'Status:', -1)),
                          l('td', null, [
                            l(
                              'span',
                              { class: dt(['badge', n.getStatusBadgeClass(n.selectedLeave.status)]) },
                              Q(n.selectedLeave.status),
                              3
                            )
                          ])
                        ])
                      ])
                    ])
                  ]),
                  t[88] || (t[88] = l('hr', null, null, -1)),
                  l('div', gk, [
                    l('div', bk, [
                      t[80] || (t[80] = l('h6', null, 'Reason', -1)),
                      l('p', yk, Q(n.selectedLeave.reason), 1)
                    ])
                  ]),
                  n.selectedLeave.emergency_contact
                    ? (he(),
                      pe('div', _k, [
                        l('div', wk, [
                          t[81] || (t[81] = l('h6', null, 'Emergency Contact', -1)),
                          l('p', xk, Q(n.selectedLeave.emergency_contact), 1)
                        ])
                      ]))
                    : Ye('', !0),
                  n.selectedLeave.attachments && n.selectedLeave.attachments.length > 0
                    ? (he(),
                      pe('div', Sk, [
                        l('div', Ck, [
                          t[83] || (t[83] = l('h6', null, 'Attachments', -1)),
                          l('div', Tk, [
                            (he(!0),
                            pe(
                              tn,
                              null,
                              or(
                                n.selectedLeave.attachments,
                                _ => (
                                  he(),
                                  pe(
                                    'a',
                                    {
                                      key: _.id,
                                      href: _.url,
                                      target: '_blank',
                                      class: 'list-group-item list-group-item-action'
                                    },
                                    [
                                      l('div', Dk, [
                                        t[82] ||
                                          (t[82] = l(
                                            'svg',
                                            {
                                              xmlns: 'http://www.w3.org/2000/svg',
                                              class: 'icon me-2',
                                              width: '24',
                                              height: '24',
                                              viewBox: '0 0 24 24',
                                              'stroke-width': '2',
                                              stroke: 'currentColor',
                                              fill: 'none',
                                              'stroke-linecap': 'round',
                                              'stroke-linejoin': 'round'
                                            },
                                            [
                                              l('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
                                              l('path', { d: 'M14 3v4a1 1 0 0 0 1 1h4' }),
                                              l('path', {
                                                d: 'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z'
                                              })
                                            ],
                                            -1
                                          )),
                                        l('div', null, [
                                          l('div', null, Q(_.original_name), 1),
                                          l('small', kk, Q(_.size), 1)
                                        ])
                                      ])
                                    ],
                                    8,
                                    Ak
                                  )
                                )
                              ),
                              128
                            ))
                          ])
                        ])
                      ]))
                    : Ye('', !0),
                  n.selectedLeave.approved_at || n.selectedLeave.rejected_at
                    ? (he(),
                      pe('div', Ek, [
                        l('div', Ok, [
                          t[87] || (t[87] = l('h6', null, 'Approval Information', -1)),
                          l('table', Pk, [
                            n.selectedLeave.approved_by
                              ? (he(),
                                pe('tr', Rk, [
                                  t[84] || (t[84] = l('td', { class: 'w-25' }, 'Approved By:', -1)),
                                  l('td', null, Q((p = n.selectedLeave.approved_by_user) == null ? void 0 : p.name), 1)
                                ]))
                              : Ye('', !0),
                            n.selectedLeave.approved_at
                              ? (he(),
                                pe('tr', Lk, [
                                  t[85] || (t[85] = l('td', null, 'Approved At:', -1)),
                                  l('td', null, Q(n.formatDate(n.selectedLeave.approved_at)), 1)
                                ]))
                              : Ye('', !0),
                            n.selectedLeave.approval_notes
                              ? (he(),
                                pe('tr', Mk, [
                                  t[86] || (t[86] = l('td', null, 'Notes:', -1)),
                                  l('td', null, Q(n.selectedLeave.approval_notes), 1)
                                ]))
                              : Ye('', !0)
                          ])
                        ])
                      ]))
                    : Ye('', !0)
                ]))
              : Ye('', !0),
            l('div', Ik, [
              t[89] ||
                (t[89] = l(
                  'button',
                  { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                  'Close',
                  -1
                )),
              ((y = n.selectedLeave) == null ? void 0 : y.status) === 'pending'
                ? (he(),
                  pe('div', Fk, [
                    l(
                      'button',
                      {
                        onClick: t[26] || (t[26] = (..._) => n.showApprovalModal && n.showApprovalModal(..._)),
                        class: 'btn btn-success'
                      },
                      ' Approve '
                    ),
                    l(
                      'button',
                      { onClick: t[27] || (t[27] = _ => n.showApprovalModal(!1)), class: 'btn btn-danger' },
                      ' Reject '
                    )
                  ]))
                : Ye('', !0)
            ])
          ])
        ])
      ]),
      l('div', jk, [
        l('div', Nk, [
          l('div', Hk, [
            l('div', $k, [
              l('h5', Bk, Q(n.approvalAction ? 'Approve' : 'Reject') + ' Leave Request', 1),
              t[91] ||
                (t[91] = l(
                  'button',
                  { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' },
                  null,
                  -1
                ))
            ]),
            l(
              'form',
              { onSubmit: t[29] || (t[29] = ta((..._) => n.processApproval && n.processApproval(..._), ['prevent'])) },
              [
                l('div', qk, [
                  l('div', Uk, [
                    l('label', Wk, Q(n.approvalAction ? 'Approval' : 'Rejection') + ' Notes', 1),
                    Ct(
                      l(
                        'textarea',
                        {
                          class: 'form-control',
                          'onUpdate:modelValue': t[28] || (t[28] = _ => (n.approvalNotes = _)),
                          rows: '3',
                          placeholder: `Add notes for this ${n.approvalAction ? 'approval' : 'rejection'}...`
                        },
                        null,
                        8,
                        Vk
                      ),
                      [[ln, n.approvalNotes]]
                    )
                  ])
                ]),
                l('div', zk, [
                  t[92] ||
                    (t[92] = l(
                      'button',
                      { type: 'button', class: 'btn me-auto', 'data-bs-dismiss': 'modal' },
                      'Cancel',
                      -1
                    )),
                  l(
                    'button',
                    {
                      type: 'submit',
                      class: dt(['btn', n.approvalAction ? 'btn-success' : 'btn-danger']),
                      disabled: n.processing
                    },
                    [
                      n.processing ? (he(), pe('span', Xk)) : Ye('', !0),
                      Kt(' ' + Q(n.approvalAction ? 'Approve' : 'Reject') + ' Request ', 1)
                    ],
                    10,
                    Kk
                  )
                ])
              ],
              32
            )
          ])
        ])
      ])
    ])
  )
}
const $m = yo(HA, [
  ['render', Gk],
  ['__scopeId', 'data-v-ef5532c9']
])
window.$ = window.jQuery = gt
const Jk = V_(),
  Yk = [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Vp },
    { path: '/employees', component: Im },
    { path: '/attendance', component: Fm },
    { path: '/face-attendance', component: jm },
    { path: '/schedules', component: Nm },
    { path: '/payroll', component: Hm },
    { path: '/leaves', component: $m }
  ],
  Qk = K0({ history: x0(), routes: Yk }),
  Vr = B_({})
Vr.component('dashboard-app', Vp)
Vr.component('employee-table', Im)
Vr.component('attendance-form', Fm)
Vr.component('face-attendance', jm)
Vr.component('schedule-manager', Nm)
Vr.component('payroll-manager', Hm)
Vr.component('leave-manager', $m)
Vr.use(Jk)
Vr.use(Qk)
const Zk = document.getElementById('app')
Zk && Vr.mount('#app')
