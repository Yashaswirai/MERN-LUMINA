import React from 'react';
import API from '../services/api';

const ProductImage = ({ 
  productId, 
  alt = 'Product image', 
  className = '', 
  width = 300, 
  height = 300 
}) => {
  const imageUrl = `${API.defaults.baseURL}/products/${productId}/image`;
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