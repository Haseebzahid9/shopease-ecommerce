// Shared storage utilities
const Storage = {
  getProducts() {
    return JSON.parse(localStorage.getItem('ec_products') || '[]');
  },
  setProducts(products) {
    localStorage.setItem('ec_products', JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
  },
  getCart() {
    return JSON.parse(localStorage.getItem('ec_cart') || '[]');
  },
  setCart(cart) {
    localStorage.setItem('ec_cart', JSON.stringify(cart));
  },
  clearCart() {
    localStorage.removeItem('ec_cart');
  },
  generateId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
};

// Seed with demo products if empty
if (Storage.getProducts().length === 0) {
  const demo = [
    { id: Storage.generateId(), name: 'Wireless Mechanical Keyboard', price: 189.99, category: 'Electronics', stock: 12, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80' },
    { id: Storage.generateId(), name: 'LED Desk Lamp', price: 64.50, category: 'Home Office', stock: 8, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80' },
    { id: Storage.generateId(), name: 'Premium Notebook', price: 34.00, category: 'Stationery', stock: 25, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80' },
    { id: Storage.generateId(), name: 'Noise Cancelling Headphones', price: 249.00, category: 'Electronics', stock: 5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
    { id: Storage.generateId(), name: 'Coffee Pour-Over Set', price: 58.00, category: 'Kitchen', stock: 15, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
    { id: Storage.generateId(), name: 'Classic Analog Watch', price: 320.00, category: 'Accessories', stock: 3, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
  ];
  Storage.setProducts(demo);
}
