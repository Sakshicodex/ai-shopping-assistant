import { placeOrder, getProductById } from '../services/catalog.service.js';

export async function createOrder(req, res, next) {
  try {
    const { items, customerEmail, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required.' });
    }

    if (!customerEmail || !shippingAddress) {
      return res.status(400).json({ error: 'Customer email and shipping address are required.' });
    }

    // Validate all products exist and are in stock
    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found.` });
      }
      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json({ error: `${product.name} is out of stock.` });
      }
    }

    const order = placeOrder(
      items.map((i) => ({ productId: i.productId, quantity: i.quantity || 1 })),
      customerEmail,
      shippingAddress
    );

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}
