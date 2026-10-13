// Mock catalog. Prices are stored in USD and converted for display.
export const CATEGORIES = ['All', 'Home', 'Fashion', 'Tech', 'Beauty', 'Outdoor']

export const CURRENCIES = {
  USD: { rate: 1, label: 'US $', locale: 'en-US', ship: 8 },
  EUR: { rate: 0.92, label: 'Euro €', locale: 'de-DE', ship: 9 },
  GBP: { rate: 0.79, label: 'UK £', locale: 'en-GB', ship: 8 },
  JPY: { rate: 150, label: 'Japan ¥', locale: 'ja-JP', ship: 10 },
  AUD: { rate: 1.52, label: 'Australia A$', locale: 'en-AU', ship: 12 },
  CAD: { rate: 1.37, label: 'Canada C$', locale: 'en-CA', ship: 11 },
}

// Free shipping threshold in USD
export const FREE_SHIP_USD = 75

const p = (id, name, category, price, emoji, c1, c2, rating, reviews, desc, options, badge) => ({
  id, name, category, price, emoji, c1, c2, rating, reviews, desc, options, badge,
})

export const PRODUCTS = [
  p(1, 'Ceramic Pour-Over Set', 'Home', 42, '☕', '#f6e7d8', '#e9c9a8', 4.8, 1204, 'Hand-glazed dripper, carafe and two cups. Brews a clean, bright cup in under four minutes.', ['Cream', 'Slate', 'Terracotta'], 'Best seller'),
  p(2, 'Linen Duvet Cover', 'Home', 129, '🛏️', '#e8eef5', '#c9d8ea', 4.7, 856, 'Stonewashed European flax linen that softens with every wash. OEKO-TEX certified.', ['Queen', 'King', 'Super King']),
  p(3, 'Soy Wax Candle Trio', 'Home', 36, '🕯️', '#fbeee6', '#f4cdb5', 4.6, 642, 'Three 180g candles in fig, cedar and sea salt. Roughly 40 hours burn time each.', ['Fig', 'Cedar', 'Sea salt'], 'New'),
  p(4, 'Acacia Serving Board', 'Home', 54, '🪵', '#f3e9d9', '#dcc29b', 4.5, 311, 'Sustainably sourced acacia with a juice groove and leather hanging loop.', null),
  p(5, 'Merino Crew Sweater', 'Fashion', 98, '🧶', '#efe6f4', '#d5c0e6', 4.7, 978, 'Fine-gauge extra-fine merino. Temperature regulating and machine washable.', ['XS', 'S', 'M', 'L', 'XL']),
  p(6, 'Waxed Canvas Tote', 'Fashion', 68, '👜', '#e6efe3', '#bcd6b4', 4.6, 523, 'Water-resistant tote with an inner zip pocket, sized for a 15" laptop.', ['Olive', 'Sand', 'Black']),
  p(7, 'Everyday Leather Sneaker', 'Fashion', 135, '👟', '#f4f1ec', '#d9d2c5', 4.8, 2310, 'Full-grain Italian leather with a cushioned recycled-rubber sole.', ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], 'Best seller'),
  p(8, 'Polarized Aviators', 'Fashion', 79, '🕶️', '#fdf3d8', '#f2d98c', 4.4, 402, 'Lightweight titanium frame with UV400 polarized lenses.', ['Gold', 'Silver', 'Black']),
  p(9, 'Wireless Earbuds Pro', 'Tech', 149, '🎧', '#e3eefb', '#b7d1f3', 4.6, 3120, 'Adaptive noise cancelling, 30h battery with case, IPX4 sweat resistance.', ['Black', 'White'], 'Best seller'),
  p(10, '65W GaN Travel Charger', 'Tech', 45, '🔌', '#ecebf7', '#c8c5ea', 4.8, 1876, 'Folding plug with interchangeable US/EU/UK/AU adapters. Charges laptop + phone together.', null, 'Travel pick'),
  p(11, 'Mechanical Keyboard 75%', 'Tech', 119, '⌨️', '#e9eef2', '#bcc9d6', 4.5, 734, 'Hot-swappable switches, gasket mount, Bluetooth + USB-C.', ['Linear', 'Tactile', 'Clicky']),
  p(12, 'Smart Desk Lamp', 'Tech', 62, '💡', '#fff3d6', '#f7d98b', 4.3, 289, 'Tunable white light, wireless charging base and 5 brightness steps.', null),
  p(13, 'Vitamin C Brightening Serum', 'Beauty', 34, '🧴', '#fff0e0', '#ffd3a1', 4.5, 2104, '15% stabilised vitamin C with ferulic acid. 30ml, fragrance free.', null, 'New'),
  p(14, 'Mineral SPF 50 Sunscreen', 'Beauty', 28, '🧴', '#e6f4f1', '#b3ddd4', 4.7, 1432, 'Reef-safe, non-greasy mineral formula with no white cast.', null),
  p(15, 'Rose Clay Face Mask', 'Beauty', 26, '🌸', '#fbe7ee', '#f3bfd1', 4.4, 612, 'Kaolin and rose clay mask to gently detox and soften skin.', null),
  p(16, 'Bamboo Hair Brush', 'Beauty', 18, '💆', '#eef3e2', '#cfdfa8', 4.3, 220, 'Vegan bristles that detangle without breakage. Plastic-free packaging.', null),
  p(17, 'Insulated Steel Bottle 750ml', 'Outdoor', 32, '🧊', '#e1f1fb', '#a9d6f0', 4.8, 3402, 'Keeps drinks cold for 24h or hot for 12h. Leak-proof lid.', ['Ocean', 'Forest', 'Sand', 'Black'], 'Best seller'),
  p(18, 'Packable Rain Shell', 'Outdoor', 112, '🧥', '#e6ecf0', '#b9c9d3', 4.6, 861, 'Waterproof 2.5-layer shell that packs into its own pocket. 210g.', ['S', 'M', 'L', 'XL']),
  p(19, 'Ultralight 2P Tent', 'Outdoor', 249, '⛺', '#e5f2e0', '#b3d9a5', 4.7, 508, 'Freestanding double-wall tent, 1.6 kg. Two doors, two vestibules.', null),
  p(20, 'Trail Running Backpack 12L', 'Outdoor', 89, '🎒', '#fbeadf', '#f2c5a3', 4.5, 377, 'Vest-style fit with two soft flasks and quick-access pockets.', ['S/M', 'M/L']),
  p(21, 'Cast Iron Skillet 10"', 'Home', 48, '🍳', '#ececec', '#c4c4c4', 4.9, 2650, 'Pre-seasoned, oven safe to 260°C and built to be handed down.', null),
  p(22, 'Knit Beanie', 'Fashion', 24, '🧢', '#f6e4e4', '#e8b9b9', 4.4, 298, 'Soft lambswool blend in a classic ribbed cuff.', ['Charcoal', 'Oat', 'Rust']),
  p(23, 'Portable Bluetooth Speaker', 'Tech', 69, '🔊', '#eae4f5', '#c9b8e6', 4.5, 1190, '360° sound, IP67 waterproof, 20 hour playtime.', ['Black', 'Blue', 'Sand']),
  p(24, 'Hammock with Straps', 'Outdoor', 39, '🌴', '#e3f4ea', '#abdcc0', 4.6, 944, 'Parachute nylon double hammock, set up in two minutes. Holds 200 kg.', ['Teal', 'Orange']),
]
