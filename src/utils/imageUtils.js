import axios from 'axios';

// In-memory LRU cache implementation
const cache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Convert an image URL to base64 string with caching.
 * Uses a simple LRU cache to prevent repeated fetches of the same avatar.
 * 
 * @param {string} imageUrl - URL of the image to convert
 * @returns {Promise<string|null>} Base64 encoded image with data URI scheme or null if conversion fails
 */
export const urlToBase64 = async (imageUrl) => {
  // Check cache first
  if (cache.has(imageUrl)) {
    // Move this entry to "most recently used" position
    const value = cache.get(imageUrl);
    cache.delete(imageUrl);
    cache.set(imageUrl, value);
    return value;
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 5000
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    // Add to cache
    if (cache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry (first key) if cache is full
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(imageUrl, dataUri);

    return dataUri;
  } catch (error) {
    console.error(`Failed to convert ${imageUrl}:`, error.message);
    return null;
  }
};

/**
 * Validate and process an image before storing
 * @param {string} imageData - Base64 image data or URL
 * @returns {Promise<string|null>} Processed base64 image or null if invalid
 */
export const processImage = async (imageData) => {
  if (!imageData) return null;
  
  // If it's already a data URI, return as is
  if (imageData.startsWith('data:')) {
    return imageData;
  }
  
  // If it's a URL, convert to base64
  if (imageData.startsWith('http')) {
    return await urlToBase64(imageData);
  }
  
  return null;
}; 