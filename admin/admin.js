// ===== VAULT ADMIN JS =====

let editingId = null;
let deleteTargetId = null;

// ===== DOM REFS =====
const tableBody = document.getElementById('product-table-body');
const emptyState = document.getElementById('empty-state');
const filterSearch = document.getElementById('filter-search');
const filterCategory = document.getElementById('filter-category');
const filterCountEl = document.getElementById('filter-count');
const notification = document.getElementById('notification');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const productForm = document.getElementById('product-form');
const btnAddProduct = document.getElementById('btn-add-product');
const btnCancel = document.getElementById('btn-cancel');
const btnSubmit = document.getElementById('btn-submit');
const modalClose = document.getElementById('modal-close');

const deleteOverlay = document.getElementById('delete-overlay');
const deleteProductName = document.getElementById('delete-product-name');
const deleteConfirmBtn = document.getElementById('delete-confirm');
const deleteCancelBtn = document.getElementById('delete-cancel');
const deleteCancelX = document.getElementById('delete-cancel-x');

const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');
const imagePreviewWrap = document.getElementById('image-preview-wrap');

// Stats
const statTotal = document.getElementById('stat-total');
const statLow = document.getElementById('stat-low');
const statOut = document.getElementById('stat-out');

// ===== UTILS =====
function showNotification(msg, type = 'success') {
  notification.textContent = msg;
  notification.className = `notification show ${type}`;
  setTimeout(() => {
    notification.className = 'notification';
  }, 3000);
}

function formatPrice(p) {
  return '$' + parseFloat(p).toFixed(2);
}

function getStatusInfo(stock) {
  if (stock <= 0) return { label: 'OUT OF STOCK', cls: 'status-out' };
  if (stock <= 5) return { label: 'LOW STOCK', cls: 'status-low' };
  return { label: 'IN STOCK', cls: 'status-in' };
}

// ===== RENDER =====
function getFilteredProducts() {
  const products = Storage.getProducts();
  const query = filterSearch.value.toLowerCase().trim();
  const cat = filterCategory.value;
  return products.filter(p => {
    const matchName = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const matchCat = !cat || p.category === cat;
    return matchName && matchCat;
  });
}

function renderTable() {
  const products = getFilteredProducts();
  filterCountEl.textContent = products.length;

  if (products.length === 0) {
    tableBody.innerHTML = '';
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    tableBody.innerHTML = products.map(p => {
      const status = getStatusInfo(p.stock);
      const imgHtml = p.image
        ? `<img class="product-thumb" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        : '';
      return `
        <tr data-id="${p.id}">
          <td>
            <div class="product-cell">
              ${imgHtml}
              <div class="product-thumb-fallback" style="${p.image ? 'display:none' : ''}">◫</div>
              <span class="product-name-cell">${escapeHtml(p.name)}</span>
            </div>
          </td>
          <td><span class="category-badge">${escapeHtml(p.category)}</span></td>
          <td><span class="price-cell">${formatPrice(p.price)}</span></td>
          <td class="stock-cell" style="color:${p.stock <= 0 ? 'var(--danger)' : p.stock <= 5 ? 'var(--warning)' : 'var(--text)'}">${p.stock}</td>
          <td><span class="status-badge ${status.cls}">${status.label}</span></td>
          <td>
            <div class="actions-cell">
              <button class="btn-edit" onclick="openEdit('${p.id}')">EDIT</button>
              <button class="btn-delete" onclick="openDelete('${p.id}')">DELETE</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  updateStats();
  updateCategoryFilter();
}

function updateStats() {
  const products = Storage.getProducts();
  statTotal.textContent = products.length;
  statLow.textContent = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  statOut.textContent = products.filter(p => p.stock <= 0).length;
}

function updateCategoryFilter() {
  const products = Storage.getProducts();
  const cats = [...new Set(products.map(p => p.category))].sort();
  const current = filterCategory.value;
  filterCategory.innerHTML = '<option value="">All Categories</option>' +
    cats.map(c => `<option value="${escapeHtml(c)}" ${c === current ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

// ===== MODAL =====
function openModal(mode = 'add', product = null) {
  productForm.reset();
  clearErrors();
  imagePreviewWrap.classList.remove('show');

  if (mode === 'edit' && product) {
    editingId = product.id;
    modalTitle.textContent = 'Edit Product';
    btnSubmit.textContent = 'Save Changes';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image || '';
    if (product.image) {
      imagePreview.src = product.image;
      imagePreviewWrap.classList.add('show');
    }
  } else {
    editingId = null;
    modalTitle.textContent = 'Add New Product';
    btnSubmit.textContent = 'Save Product';
  }

  modalOverlay.classList.add('open');
  document.getElementById('product-name').focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  editingId = null;
  productForm.reset();
  clearErrors();
  imagePreviewWrap.classList.remove('show');
}

function openEdit(id) {
  const products = Storage.getProducts();
  const p = products.find(p => p.id === id);
  if (p) openModal('edit', p);
}

function openDelete(id) {
  const products = Storage.getProducts();
  const p = products.find(p => p.id === id);
  if (!p) return;
  deleteTargetId = id;
  deleteProductName.textContent = p.name;
  deleteOverlay.classList.add('open');
}

function closeDelete() {
  deleteOverlay.classList.remove('open');
  deleteTargetId = null;
}

// ===== VALIDATION =====
function clearErrors() {
  ['name','category','price','stock','image'].forEach(f => {
    document.getElementById(`error-${f}`).textContent = '';
    document.getElementById(`product-${f}`).classList.remove('invalid');
  });
}

function setError(field, msg) {
  document.getElementById(`error-${field}`).textContent = msg;
  document.getElementById(`product-${field}`).classList.add('invalid');
}

function validateForm() {
  clearErrors();
  let valid = true;
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value);
  const image = document.getElementById('product-image').value.trim();

  if (!name) { setError('name', 'Product name is required'); valid = false; }
  else if (name.length < 2) { setError('name', 'Name must be at least 2 characters'); valid = false; }

  if (!category) { setError('category', 'Category is required'); valid = false; }

  if (!document.getElementById('product-price').value) { setError('price', 'Price is required'); valid = false; }
  else if (isNaN(price) || price <= 0) { setError('price', 'Price must be greater than $0.00'); valid = false; }

  if (!document.getElementById('product-stock').value) { setError('stock', 'Stock quantity is required'); valid = false; }
  else if (isNaN(stock) || stock <= 0) { setError('stock', 'Stock must be at least 1'); valid = false; }

  if (image && !isValidUrl(image)) { setError('image', 'Please enter a valid URL'); valid = false; }

  return valid;
}

function isValidUrl(s) {
  try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

// ===== FORM SUBMIT =====
productForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const products = Storage.getProducts();
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const stock = parseInt(document.getElementById('product-stock').value);
  const image = document.getElementById('product-image').value.trim();

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, stock, image };
      Storage.setProducts(products);
      closeModal();
      renderTable();
      showNotification(`✓ "${name}" updated successfully`);
    }
  } else {
    const newProduct = { id: Storage.generateId(), name, category, price, stock, image };
    products.push(newProduct);
    Storage.setProducts(products);
    closeModal();
    renderTable();
    showNotification(`✓ "${name}" added to inventory`);
  }
});

// ===== DELETE =====
deleteConfirmBtn.addEventListener('click', () => {
  if (!deleteTargetId) return;
  const products = Storage.getProducts().filter(p => p.id !== deleteTargetId);
  Storage.setProducts(products);
  closeDelete();
  renderTable();
  showNotification('Product removed from inventory', 'error');
});

// ===== IMAGE PREVIEW =====
imageInput.addEventListener('input', () => {
  const url = imageInput.value.trim();
  if (url && isValidUrl(url)) {
    imagePreview.src = url;
    imagePreviewWrap.classList.add('show');
    imagePreview.onerror = () => imagePreviewWrap.classList.remove('show');
  } else {
    imagePreviewWrap.classList.remove('show');
  }
});

// ===== EVENT LISTENERS =====
btnAddProduct.addEventListener('click', () => openModal('add'));
btnCancel.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
deleteCancelBtn.addEventListener('click', closeDelete);
deleteCancelX.addEventListener('click', closeDelete);

modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
deleteOverlay.addEventListener('click', (e) => { if (e.target === deleteOverlay) closeDelete(); });

filterSearch.addEventListener('input', renderTable);
filterCategory.addEventListener('change', renderTable);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeDelete(); }
});

// ===== INIT =====
renderTable();
