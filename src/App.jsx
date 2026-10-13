import { useEffect, useMemo, useReducer, useState } from 'react'
import { CATEGORIES, CURRENCIES, FREE_SHIP_USD, PRODUCTS } from './data.js'

/* ---------- cart state ---------- */
const CART_KEY = 'lumen-cart-v1'

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = `${action.id}|${action.option || ''}`
      const found = state.find((i) => i.key === key)
      if (found) {
        return state.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + action.qty, 10) } : i))
      }
      return [...state, { key, id: action.id, option: action.option, qty: action.qty }]
    }
    case 'qty':
      return state
        .map((i) => (i.key === action.key ? { ...i, qty: i.qty + action.delta } : i))
        .filter((i) => i.qty > 0)
        .map((i) => ({ ...i, qty: Math.min(i.qty, 10) }))
    case 'remove':
      return state.filter((i) => i.key !== action.key)
    case 'clear':
      return []
    default:
      return state
  }
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((i) => PRODUCTS.some((p) => p.id === i.id)) : []
  } catch {
    return []
  }
}

/* ---------- helpers ---------- */
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

function useMoney(currency) {
  const c = CURRENCIES[currency]
  return useMemo(() => {
    const fmt = new Intl.NumberFormat(c.locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    })
    return (usd) => fmt.format(usd * c.rate)
  }, [currency, c])
}

function Stars({ rating, reviews }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">★</span> {rating.toFixed(1)}
      {reviews != null && <span className="muted"> ({reviews.toLocaleString()})</span>}
    </span>
  )
}

function Tile({ p, large }) {
  return (
    <div
      className={`tile ${large ? 'tile-lg' : ''}`}
      style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
      role="img"
      aria-label={p.name}
    >
      <span className="tile-emoji">{p.emoji}</span>
      {p.badge && <span className="badge">{p.badge}</span>}
    </div>
  )
}

/* ---------- main ---------- */
export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [currency, setCurrency] = useState(() => localStorage.getItem('lumen-cur') || 'USD')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(300)
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [ordered, setOrdered] = useState(false)

  const money = useMoney(currency)

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch {}
  }, [cart])
  useEffect(() => {
    try { localStorage.setItem('lumen-cur', currency) } catch {}
  }, [currency])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])
  useEffect(() => {
    const open = selected || cartOpen
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => {
      if (e.key === 'Escape') { setSelected(null); setCartOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, cartOpen])

  const products = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        p.price <= maxPrice &&
        (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
    )
    const sorters = {
      featured: null,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      popular: (a, b) => b.reviews - a.reviews,
    }
    if (sorters[sort]) list = [...list].sort(sorters[sort])
    return list
  }, [category, query, sort, maxPrice])

  const lines = cart.map((i) => ({ ...i, product: byId[i.id] }))
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const freeShip = subtotal >= FREE_SHIP_USD
  const shipping = count === 0 ? 0 : freeShip ? 0 : CURRENCIES[currency].ship / CURRENCIES[currency].rate
  const total = subtotal + shipping
  const remaining = Math.max(FREE_SHIP_USD - subtotal, 0)

  const addToCart = (p, option, qty = 1) => {
    dispatch({ type: 'add', id: p.id, option, qty })
    setToast(`Added “${p.name}” to cart`)
  }

  const resetFilters = () => {
    setCategory('All'); setQuery(''); setMaxPrice(300); setSort('featured')
  }

  return (
    <div className="app">
      <div className="promo">Free international shipping over {money(FREE_SHIP_USD)} · Duties estimated at checkout</div>

      <header className="header">
        <a className="logo" href="#top" onClick={(e) => { e.preventDefault(); resetFilters() }}>
          <span className="logo-mark">◐</span> Lumen
        </a>
        <label className="search">
          <span className="sr">Search products</span>
          <input
            type="search"
            placeholder="Search products, e.g. “tent”, “serum”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="header-actions">
          <label className="select-wrap" title="Currency">
            <span className="sr">Currency</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {Object.entries(CURRENCIES).map(([code, c]) => (
                <option key={code} value={code}>{code} · {c.label}</option>
              ))}
            </select>
          </label>
          <button className="cart-btn" onClick={() => { setOrdered(false); setCartOpen(true) }} aria-label={`Open cart, ${count} items`}>
            <span aria-hidden="true">🛒</span>
            <span className="cart-text">Cart</span>
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>Good things, delivered worldwide.</h1>
        <p>Curated essentials for home, wardrobe and adventure. Prices in your currency, shipped to 90+ countries.</p>
      </section>

      <nav className="cats" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <button key={c} className={`chip ${c === category ? 'on' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </nav>

      <div className="toolbar">
        <span className="muted">{products.length} product{products.length === 1 ? '' : 's'}</span>
        <label className="range">
          <span>Up to {money(maxPrice)}</span>
          <input type="range" min="20" max="300" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </label>
        <label className="select-wrap">
          <span className="sr">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="popular">Most reviewed</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <main>
        {products.length === 0 ? (
          <div className="empty">
            <div className="empty-emoji">🔍</div>
            <h2>No products match</h2>
            <p className="muted">Try a different search or widen the price range.</p>
            <button className="btn" onClick={resetFilters}>Clear filters</button>
          </div>
        ) : (
          <ul className="grid">
            {products.map((p) => (
              <li key={p.id} className="card">
                <button className="card-hit" onClick={() => setSelected(p)} aria-label={`View ${p.name}`}>
                  <Tile p={p} />
                  <div className="card-body">
                    <span className="cat-label">{p.category}</span>
                    <h3>{p.name}</h3>
                    <Stars rating={p.rating} reviews={p.reviews} />
                    <div className="price">{money(p.price)}</div>
                  </div>
                </button>
                <button
                  className="btn btn-block"
                  onClick={() => (p.options ? setSelected(p) : addToCart(p, null))}
                >
                  {p.options ? 'Choose options' : 'Add to cart'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="footer">
        <span>© Lumen demo store</span>
        <span>30-day returns · Tracked delivery · Secure checkout (demo)</span>
      </footer>

      {selected && (
        <ProductModal
          p={selected}
          money={money}
          onClose={() => setSelected(null)}
          onAdd={(opt, qty) => { addToCart(selected, opt, qty); setSelected(null) }}
        />
      )}

      {cartOpen && (
        <CartDrawer
          lines={lines}
          money={money}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          remaining={remaining}
          freeShip={freeShip}
          ordered={ordered}
          dispatch={dispatch}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { dispatch({ type: 'clear' }); setOrdered(true) }}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

/* ---------- product modal ---------- */
function ProductModal({ p, money, onClose, onAdd }) {
  const [option, setOption] = useState(p.options ? null : '')
  const [qty, setQty] = useState(1)
  const [showErr, setShowErr] = useState(false)

  const submit = () => {
    if (p.options && !option) { setShowErr(true); return }
    onAdd(option || null, qty)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={p.name} onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <Tile p={p} large />
        <div className="modal-body">
          <span className="cat-label">{p.category}</span>
          <h2>{p.name}</h2>
          <Stars rating={p.rating} reviews={p.reviews} />
          <div className="price price-lg">{money(p.price)}</div>
          <p className="desc">{p.desc}</p>

          {p.options && (
            <fieldset className="opts">
              <legend>Select option {showErr && !option && <span className="err">— please choose one</span>}</legend>
              <div className="opt-row">
                {p.options.map((o) => (
                  <button key={o} className={`opt ${option === o ? 'on' : ''}`} onClick={() => setOption(o)} aria-pressed={option === o}>
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-lg" onClick={submit}>Add to cart · {money(p.price * qty)}</button>
          </div>
          <ul className="perks">
            <li>🚚 Ships worldwide in 5–10 business days</li>
            <li>↩️ Free 30-day returns</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ---------- cart drawer ---------- */
function CartDrawer({ lines, money, subtotal, shipping, total, remaining, freeShip, ordered, dispatch, onClose, onCheckout }) {
  const pct = Math.min((subtotal / FREE_SHIP_USD) * 100, 100)
  return (
    <div className="overlay overlay-right" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button className="close static" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {ordered ? (
          <div className="empty drawer-empty">
            <div className="empty-emoji">🎉</div>
            <h2>Order placed (demo)</h2>
            <p className="muted">Thanks! No real payment was taken.</p>
            <button className="btn" onClick={onClose}>Keep shopping</button>
          </div>
        ) : lines.length === 0 ? (
          <div className="empty drawer-empty">
            <div className="empty-emoji">🛒</div>
            <h2>Your cart is empty</h2>
            <p className="muted">Add something you love.</p>
            <button className="btn" onClick={onClose}>Browse products</button>
          </div>
        ) : (
          <>
            <div className="ship-bar">
              <p>
                {freeShip
                  ? '🎉 You’ve unlocked free international shipping'
                  : `Add ${money(remaining)} more for free shipping`}
              </p>
              <div className="bar"><div style={{ width: `${pct}%` }} /></div>
            </div>

            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key} className="line">
                  <div className="mini" style={{ background: `linear-gradient(135deg, ${l.product.c1}, ${l.product.c2})` }}>{l.product.emoji}</div>
                  <div className="line-info">
                    <strong>{l.product.name}</strong>
                    {l.option && <span className="muted">{l.option}</span>}
                    <div className="qty qty-sm">
                      <button onClick={() => dispatch({ type: 'qty', key: l.key, delta: -1 })} aria-label="Decrease quantity">−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => dispatch({ type: 'qty', key: l.key, delta: 1 })} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="line-right">
                    <span>{money(l.product.price * l.qty)}</span>
                    <button className="link" onClick={() => dispatch({ type: 'remove', key: l.key })}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary">
              <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div><span>Est. shipping</span><span>{freeShip ? 'Free' : money(shipping)}</span></div>
              <div className="muted small"><span>Import duties &amp; taxes</span><span>Calculated at checkout</span></div>
              <div className="total"><span>Total</span><span>{money(total)}</span></div>
              <button className="btn btn-lg btn-block" onClick={onCheckout}>Checkout</button>
              <button className="link center" onClick={() => dispatch({ type: 'clear' })}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
