import React from 'react';

const ProductImage = ({
  productId,
  alt = 'Product image',
  className = '',
  width = 300,
  height = 300
}) => {
  // Use environment variable or fallback to production URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-lumina.onrender.com/api';
  const imageUrl = `${API_BASE_URL}/products/${productId}/image`;
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}?text=No+Image`;

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = placeholderUrl;
      }}
    />
  );
};

export default ProductImage;