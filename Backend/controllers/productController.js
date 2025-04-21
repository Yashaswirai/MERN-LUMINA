const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { search, sort, filter } = req.query;

  // Build query filter for MongoDB
  let filterQuery = {};

  if (filter === 'available') {
    filterQuery.countInStock = { $gt: 0 }; // Available products
  }

  if (filter === 'discounted') {
    filterQuery.discounted = true; // Assuming you have a 'discounted' field
  }

  // Handle search query
  if (search) {
    filterQuery.name = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  // Sorting options
  let sortQuery = {};
  switch (sort) {
    case 'newest':
      sortQuery.createdAt = -1;
      break;
    case 'popular':
      sortQuery.popularity = -1; // Assuming you have a 'popularity' field
      break;
    case 'newCollection':
      sortQuery.createdAt = -1; // Or based on a custom field for new collections
      break;
    case 'discounted':
      sortQuery.price = 1; // Assuming discounted products are sorted by price (low to high)
      break;
    default:
      sortQuery = {}; // No sorting by default
  }

  try {
    const products = await Product.find(filterQuery).sort(sortQuery);
    res.json({ products, page: 1, pages: 1, totalProducts: products.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
