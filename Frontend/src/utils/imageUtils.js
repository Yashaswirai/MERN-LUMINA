import API from '../services/api';

/**
 * Get the full URL for a product image
 * @param {string} productId - The product ID
 * @returns {string} The full image URL
 */
export const getProductImageUrl = (productId) => {
  return `${API.defaults.baseURL}/products/${productId}/image`;
};

/**
 * Get a placeholder image URL
 * @param {number} width - Width of placeholder
 * @param {number} height - Height of placeholder
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 300) => {
  return `https://via.placeholder.com/${width}x${height}?text=No+Image`;
};