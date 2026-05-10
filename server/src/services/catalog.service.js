import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = resolve(__dirname, '../data');

const productsPath = resolve(dataDir, 'products.json');
const ordersPath = resolve(dataDir, 'orders.json');

const products = JSON.parse(readFileSync(productsPath, 'utf-8'));
const orders = JSON.parse(readFileSync(ordersPath, 'utf-8'));
const sales = JSON.parse(readFileSync(resolve(dataDir, 'sales.json'), 'utf-8'));

function saveOrders() {
  writeFileSync(ordersPath, JSON.stringify(orders, null, 2), 'utf-8');
}

function saveProducts() {
  writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
}

export function getAllProducts() {
  return products;
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getOrderStatus(orderId) {
  return orders.find((o) => o.orderId === orderId) || null;
}

export function getAllOrders() {
  return orders;
}

export function getOrdersByEmail(email) {
  return orders.filter((o) => o.customerEmail === email);
}

export function getActiveSales() {
  const now = new Date();
  return sales.filter((s) => {
    const from = new Date(s.validFrom);
    const until = new Date(s.validUntil);
    return now >= from && now <= until;
  });
}

export function getAllSales() {
  return sales;
}

// Auto-increment based on existing orders
let orderCounter = orders.reduce((max, o) => {
  const num = parseInt(o.orderId.replace('ORD-', ''), 10);
  return num > max ? num : max;
}, 10000) + 1;

export function placeOrder(items, customerEmail, shippingAddress) {
  const orderItems = items.map((item) => {
    const product = getProductById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stock < item.quantity) throw new Error(`${product.name} is out of stock`);
    return {
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = {
    orderId: `ORD-${orderCounter++}`,
    customerEmail,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    status: 'processing',
    trackingNumber: null,
    orderDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    shippingAddress,
  };

  // Reduce stock
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    product.stock -= item.quantity;
  }

  orders.push(order);
  saveOrders();
  saveProducts();
  return order;
}

export function getCatalogSummary() {
  return {
    products,
    sales: getActiveSales(),
    orders,
  };
}
