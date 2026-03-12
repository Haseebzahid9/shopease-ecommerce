# 🛍️ ShopEase — Vanilla JS E-Commerce Engine

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![localStorage](https://img.shields.io/badge/localStorage-Database-green?style=for-the-badge)

> A fully functional e-commerce engine built with **pure HTML, CSS, and Vanilla JavaScript** — no frameworks, no libraries, no dependencies. Uses `localStorage` as a persistent database.

---

## 🌐 Live Demo

> Open `index.html` in your browser — no server required!

| Module | File |
|--------|------|
| 🏠 Launcher | `index.html` |
| 🛒 Storefront | `store/index.html` |
| ⚙️ Admin Dashboard | `admin/index.html` |

---

## 📸 Screenshots

### 🛒 Storefront
- Category filter pills, search bar, product grid
- Real-time stock badges (IN STOCK / LOW STOCK / OUT OF STOCK)
- Sliding cart sidebar with quantity controls

### ⚙️ Admin Dashboard
- Industrial dark theme with live stats
- Inventory table with thumbnail previews
- Product form with full validation

---

## ✨ Features

### 🛒 Customer Storefront
- ✅ Dynamic product grid rendered from `localStorage`
- ✅ Category filter pills (auto-generated)
- ✅ Search bar (filters by name & category)
- ✅ Sort products (price, name, stock)
- ✅ Real-time stock badges on every card
- ✅ **Add to Cart** — stock decreases instantly
- ✅ **Out of Stock** button auto-disables at 0 stock
- ✅ Cart sidebar with quantity `+` / `−` controls
- ✅ Remove individual items (restores stock)
- ✅ **Checkout** — clears cart, keeps updated stock
- ✅ **Clear Cart** — restores all stock to `localStorage`
- ✅ Cross-tab sync via `storage` event listener

### ⚙️ Admin Dashboard
- ✅ Add new products with a modal form
- ✅ Form validation (empty fields, negative price, zero stock)
- ✅ Image URL preview before saving
- ✅ Edit existing products
- ✅ Delete with confirmation dialog
- ✅ Live sidebar stats (Total / Low Stock / Out of Stock)
- ✅ Search & category filter on inventory table
- ✅ Demo products auto-seeded on first load

---

## 📁 Project Structure

```
shopease-ecommerce/
│
├── index.html              ← Launcher page
│
├── admin/
│   ├── index.html          ← Admin dashboard UI
│   ├── admin.css           ← Dark industrial styling
│   └── admin.js            ← Product CRUD logic
│
├── store/
│   ├── index.html          ← Customer storefront
│   ├── store.css           ← Product grid & cart styles
│   └── store.js            ← Rendering, cart & checkout
│
├── shared/
│   └── storage.js          ← localStorage utilities + demo seeder
│
└── assets/                 ← (Optional) images/icons
```

---

## 🚀 Getting Started

### Option 1 — Open Directly (Easiest)
1. Download or clone this repository
2. Open `index.html` in any modern browser
3. Click **"Open Storefront"** or **"Admin Panel"**

### Option 2 — Clone via Git
```bash
git clone https://github.com/YOUR-USERNAME/shopease-ecommerce.git
cd shopease-ecommerce
# Open index.html in your browser
```

> ⚠️ No `npm install`, no build step, no server needed. Just open and run!

---

## 🗄️ How Data Works

All data is stored in the browser's `localStorage` under two keys:

| Key | Contents |
|-----|----------|
| `ec_products` | Array of all products (id, name, price, category, stock, image) |
| `ec_cart` | Array of cart items (id, name, price, image, qty) |

On first load, **6 demo products are auto-seeded** if no products exist yet.

> 💡 To reset all data: open DevTools → Application → Local Storage → clear `ec_products` and `ec_cart`

---

## 🔄 Real-Time Stock Sync

```
Customer clicks "Add to Cart"
        ↓
Stock in localStorage decreases by 1
        ↓
Product card re-renders with new stock count
        ↓
If stock = 0 → button becomes "Out of Stock" (disabled)
```

Changes persist across page refreshes and sync across browser tabs automatically.

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Semantic structure, modal dialogs |
| CSS3 | Flexbox/Grid layouts, animations, CSS variables |
| Vanilla JavaScript | DOM manipulation, event handling, logic |
| localStorage API | Persistent data storage (no backend needed) |
| Google Fonts | Syne (display) + Space Mono (body) |

---

## 📋 Form Validation Rules

| Field | Rule |
|-------|------|
| Product Name | Required, min 2 characters |
| Category | Required |
| Price | Required, must be > $0.00 |
| Stock | Required, must be ≥ 1 |
| Image URL | Optional, must be valid `http/https` URL if provided |

---

## 🧩 Demo Products (Auto-Seeded)

| Product | Category | Price |
|---------|----------|-------|
| Wireless Mechanical Keyboard | Electronics | $189.99 |
| LED Desk Lamp | Home Office | $64.50 |
| Premium Notebook | Stationery | $34.00 |
| Noise Cancelling Headphones | Electronics | $249.00 |
| Coffee Pour-Over Set | Kitchen | $58.00 |
| Classic Analog Watch | Accessories | $320.00 |

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

Built with ❤️ using pure Vanilla JavaScript.

> ⭐ If you found this project helpful, please give it a star on GitHub!
