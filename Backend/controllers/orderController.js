const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate required fields
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // Check product stock before creating order
    for (const item of orderItems) {
      const productId = item.product;
      const quantity = item.qty;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      if (product.countInStock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.countInStock}, Requested: ${quantity}`
        });
      }
    }

    // Create order items with proper structure
    const formattedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        // If the item doesn't have all required fields, fetch the product
        if (!item.name || !item.price) {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product not found: ${item.product}`);
          }
          return {
            name: product.name,
            qty: item.qty,
            image: 'image', // Just store a placeholder, we'll use product ID to fetch the image
            price: product.price,
            product: product._id,
          };
        }
        // Handle image data - store only the product ID for image reference
        return {
          name: item.name,
          qty: item.qty,
          image: 'image', // Just store a placeholder, we'll use product ID to fetch the image
          price: item.price,
          product: item.product,
        };
      })
    );

    const order = new Order({
      user: req.user._id,
      orderItems: formattedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: itemsPrice || 0,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || 0,
    });

    const createdOrder = await order.save();

    // Return the created order with populated user data
    const populatedOrder = await Order.findById(createdOrder._id).populate(
      'user',
      'name email'
    );

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      res.json(order);
    } else {
      res.status(401).json({ message: "Not authorized to view this order" });
    }
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const markOrderAsDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only update stock if the order wasn't already paid
    if (!order.isPaid) {
      // Update product stock and increment numOrders for each item
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          // Decrease stock
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          // Increment number of orders (for popularity tracking)
          product.numOrders += 1;
          await product.save();
        }
      }
    }

    // Update order payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.paymentId, // Payment ID
      status: req.body.status, // Payment status
      update_time: req.body.update_time, // Update time
      email_address: req.body.email, // Email address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update order payment status' });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderAsDelivered,
  updateOrderToPaid,
};
