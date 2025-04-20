const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword || '';
  const sortBy = req.query.sort || 'all';
  const available = req.query.available === 'true';
  const discountOnly = req.query.discount === 'true';

  let query = {
    name: { $regex: keyword, $options: 'i' },
  };

  // Filter: Availability
  if (available) {
    query.countInStock = { $gt: 0 };
  }

  // Filter: Discount
  if (discountOnly) {
    query.discount = { $gt: 0 };
  }

  // Sorting logic
  let sortOptions = {};
  switch (sortBy) {
    case 'popular':
      sortOptions.numOrders = -1;
      break;
    case 'newest':
      sortOptions.createdAt = -1;
      break;
    case 'newCollection':
      query.isNewCollection = true;
      sortOptions.createdAt = -1;
      break;
    case 'discounted':
      query.discount = { $gt: 0 };
      sortOptions.discount = -1;
      break;
    case 'all':
    default:
      sortOptions.createdAt = -1;
      break;
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOptions)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const productsWithImages = products.map((product) => {
    let imageBase64 = null;
    if (product.image && product.image.data) {
      imageBase64 = `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`;
    }

    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      countInStock: product.countInStock,
      discount: product.discount,
      isNewCollection: product.isNewCollection,
      image: imageBase64,
    };
  });

  res.json({
    products: productsWithImages,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
};


// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    // If image exists, convert Buffer to base64 string
    let imageBase64 = null;
    if (product.image && product.image.data) {
      imageBase64 = `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`;
    }

    res.json({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      countInStock: product.countInStock,
      image: imageBase64, // send base64 image string
    });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};


// @desc    Add a new product (admin only)
// @route   POST /api/products/add
// @access  Private/Admin


// Admin: Create a product with image uploaded as Buffer
const addProduct = async (req, res) => {
  const { name, price, description, countInStock } = req.body;
  const { buffer, mimetype } = req.file; // Get image buffer and MIME type

  const product = new Product({
    name,
    price,
    description,
    image: {
      data: buffer, // Store image as Buffer
      contentType: mimetype, // Store MIME type
    },
    countInStock,
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error while saving product' });
  }
};

// ✅ Admin: Update a product
const updateProduct = async (req, res) => {
  const { name, price, description, image, countInStock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// ✅ Admin: Delete a product
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};


module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
