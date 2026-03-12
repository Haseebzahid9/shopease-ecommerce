// ===== VAULT STORE JS =====

// ===== STATE =====
let activeCat = '';
let searchQuery = '';
let sortMode = 'default';

// ===== DOM REFS =====
const productGrid = document.getElementById('product-grid');
const emptyStore = document.getElementById('empty-store');
const resultsCount = document.getElementById('results-count');
const filterPills = document.getElementById('filter-pills');
const headerSearch = document.getElementById('header-search');
const sortSelect = document.getElementById('sort-select');

const cartBtn = document.getElementById('cart-btn');
const cartBadge = document.getElementById('cart-badge');
const cartSidebar = document.getElementById('cart-sidebar');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartSubtitleEl = document.getElementById('cart-subtitle');
const btnCheckout = document.getElementById('btn-checkout');
const btnClearCart = document.getElementById('btn-clear-cart');
const checkoutToast = document.getElementById('checkout-toast');

// ===== UTILS =====
function fmt(price) { return '$' + parseFloat(price).toFixed(2); }

function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

function getStockBadge(stock) {
  if (stock <= 0) return { label: 'OUT OF STOCK', cls: 'badge-out' };
  if (stock <= 5) return { label: `ONLY ${stock} LEFT`, cls: 'badge-low' };
  return { label: 'IN STOCK', cls: 'badge-in' };
}

function showToast(msg) {
  checkoutToast.classList.add('show');
  setTimeout(() => checkoutToast.classList.remove('show'), 3500);
}

// ===== PRODUCTS =====
function getDisplayProducts() {
  let products = Storage.getProducts();

  if (activeCat) products = products.filter(p => p.category === activeCat);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  switch (sortMode) {
    case 'price-asc': products.sort((a, b) => a.price - b.price); break;
    case 'price-desc': products.sort((a, b) => b.price - a.price); break;
    case 'name': products.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'stock': products.sort((a, b) => b.stock - a.stock); break;
  }

  return products;
}

function renderCategoryPills() {
  const products = Storage.getProducts();
  const cats = [...new Set(products.map(p => p.category))].sort();

  filterPills.innerHTML = `<button class="pill ${activeCat === '' ? 'active' : ''}" data-cat="">ALL</button>` +
    cats.map(c =>
      `<button class="pill ${activeCat === c ? 'active' : ''}" data-cat="${escHtml(c)}">${escHtml(c)}</button>`
    ).join('');

  filterPills.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      renderAll();
    });
  });
}

function renderProducts() {
  const products = getDisplayProducts();
  resultsCount.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

  if (products.length === 0) {
    productGrid.innerHTML = '';
    emptyStore.classList.add('visible');
    return;
  }

  emptyStore.classList.remove('visible');

  productGrid.innerHTML = products.map((p, i) => {
    const badge = getStockBadge(p.stock);
    const isOut = p.stock <= 0;
    const imgHtml = p.image
      ? `<img class="card-image" src="${escHtml(p.image)}" alt="${escHtml(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';

    return `
      <div class="product-card ${isOut ? 'out-of-stock' : ''}" style="animation-delay:${i * 0.05}s">
        <div class="card-image-wrap">
          ${imgHtml}
          <div class="card-image-placeholder" style="${p.image ? 'display:none' : ''}">◫</div>
          <span class="card-stock-badge ${badge.cls}">${badge.label}</span>
        </div>
        <div class="card-body">
          <p class="card-category">${escHtml(p.category)}</p>
          <h3 class="card-name">${escHtml(p.name)}</h3>
          <div class="card-meta">
            <span class="card-price">${fmt(p.price)}</span>
            <span class="card-stock-text ${p.stock <= 5 && p.stock > 0 ? 'low' : ''}">${isOut ? 'Sold out' : `${p.stock} in stock`}</span>
          </div>
          <button
            class="btn-add-cart"
            data-id="${p.id}"
            ${isOut ? 'disabled' : ''}
          >${isOut ? 'Out of Stock' : 'Add to Cart'}</button>
        </div>
      </div>
    `;
  }).join('');

  // Bind add-to-cart buttons
  productGrid.querySelectorAll('.btn-add-cart:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id, btn));
  });
}

function renderAll() {
  renderCategoryPills();
  renderProducts();
}

// ===== CART =====
function getCart() { return Storage.getCart(); }
function saveCart(cart) { Storage.setCart(cart); }

function addToCart(productId, btn) {
  const products = Storage.getProducts();
  const product = products.find(p => p.id === productId);
  if (!product || product.stock <= 0) return;

  // Decrease stock in localStorage
  const idx = products.findIndex(p => p.id === productId);
  products[idx].stock -= 1;
  Storage.setProducts(products);

  // Update cart
  const cart = getCart();
  const cartIdx = cart.findIndex(c => c.id === productId);
  if (cartIdx > -1) {
    cart[cartIdx].qty += 1;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, image: product.image || '', qty: 1 });
  }
  saveCart(cart);

  // Flash button feedback
  btn.classList.add('adding');
  setTimeout(() => btn.classList.remove('adding'), 300);

  // Re-render product to reflect stock change
  renderProducts();
  renderCartUI();
  updateCartBadge();
}

function removeFromCart(productId) {
  const cart = getCart();
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  // Restore stock
  const products = Storage.getProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx > -1) {
    products[idx].stock += item.qty;
    Storage.setProducts(products);
  }

  const newCart = cart.filter(c => c.id !== productId);
  saveCart(newCart);
  renderCartUI();
  updateCartBadge();
  renderProducts();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const cartIdx = cart.findIndex(c => c.id === productId);
  if (cartIdx === -1) return;

  const products = Storage.getProducts();
  const prodIdx = products.findIndex(p => p.id === productId);

  if (delta > 0) {
    // Increasing qty — check stock
    if (prodIdx === -1 || products[prodIdx].stock <= 0) return;
    products[prodIdx].stock -= 1;
    cart[cartIdx].qty += 1;
  } else {
    // Decreasing qty
    if (cart[cartIdx].qty <= 1) {
      removeFromCart(productId);
      return;
    }
    if (prodIdx > -1) products[prodIdx].stock += 1;
    cart[cartIdx].qty -= 1;
  }

  Storage.setProducts(products);
  saveCart(cart);
  renderCartUI();
  updateCartBadge();
  renderProducts();
}

function renderCartUI() {
  const cart = getCart();
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  cartSubtitleEl.textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;

  if (cart.length === 0) {
    cartEmpty.style.display = 'flex';
    cartItems.innerHTML = '';
    cartSubtotal.textContent = '$0.00';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartEmpty.style.display = 'none';
  cartItems.innerHTML = cart.map(item => {
    const imgHtml = item.image
      ? `<img class="cart-item-img" src="${escHtml(item.image)}" alt="${escHtml(item.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';

    return `
      <div class="cart-item">
        ${imgHtml}
        <div class="cart-item-img-placeholder" style="${item.image ? 'display:none' : ''}">◫</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escHtml(item.name)}</div>
          <div class="cart-item-price">${fmt(item.price)} each</div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', +1)">+</button>
            <span style="font-size:12px;color:var(--text-muted);margin-left:6px">${fmt(item.price * item.qty)}</span>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
      </div>
    `;
  }).join('');

  cartSubtotal.textContent = fmt(subtotal);
  cartTotal.textContent = fmt(subtotal);
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = total;
  cartBadge.style.display = total > 0 ? 'flex' : 'none';
}

// ===== CHECKOUT =====
function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  // Clear cart (stock is already updated per-item)
  Storage.clearCart();

  closeCart();
  renderCartUI();
  updateCartBadge();
  renderProducts();
  showToast('Order placed!');
}

function clearCartAndRestore() {
  const cart = getCart();
  const products = Storage.getProducts();

  // Restore all stock
  cart.forEach(item => {
    const idx = products.findIndex(p => p.id === item.id);
    if (idx > -1) products[idx].stock += item.qty;
  });

  Storage.setProducts(products);
  Storage.clearCart();
  renderCartUI();
  updateCartBadge();
  renderProducts();
}

// ===== CART OPEN/CLOSE =====
function openCart() {
  cartSidebar.classList.add('open');
  cartBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== EVENTS =====
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

btnCheckout.addEventListener('click', checkout);
btnClearCart.addEventListener('click', clearCartAndRestore);

headerSearch.addEventListener('input', () => {
  searchQuery = headerSearch.value;
  renderProducts();
});

sortSelect.addEventListener('change', () => {
  sortMode = sortSelect.value;
  renderProducts();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCart();
});

// Sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'ec_products') {
    renderAll();
    renderCartUI();
    updateCartBadge();
  }
});

// ===== INIT =====
renderAll();
renderCartUI();
updateCartBadge();
