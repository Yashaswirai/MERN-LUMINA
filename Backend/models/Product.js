// models/Product.js
const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer, // Store image as a Buffer
      contentType: String, // Store image MIME type (jpeg, png, etc.)
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    iisNewCollection: { 
      type: Boolean, 
      default: false 
    },
    discount: { 
      type: Number, 
      default: 0 
    },
    numOrders: { 
      type: Number, 
      default: 0 
    }, // For popularity
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
