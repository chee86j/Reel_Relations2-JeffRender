/**
 * searchCache.js
 * Implements an LRU (Least Recently Used) cache for storing search results
 * between actors. Uses a Map for O(1) access and maintains a size limit
 * to prevent memory issues.
 */

class SearchCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  // Generate a unique key for the actor pair (order-independent)
  _generateKey(actor1, actor2) {
    // Sort IDs to ensure same key regardless of order
    const [id1, id2] = [actor1, actor2].sort();
    return `${id1}-${id2}`;
  }

  // Get cached result for actor pair
  get(actor1, actor2) {
    const key = this._generateKey(actor1, actor2);
    const result = this.cache.get(key);
    
    if (result) {
      // Update access time for LRU tracking
      result.lastAccessed = Date.now();
      return result.data;
    }
    
    return null;
  }

  // Store result for actor pair
  set(actor1, actor2, data) {
    const key = this._generateKey(actor1, actor2);
    
    // If cache is full, remove least recently used entry
    if (this.cache.size >= this.maxSize) {
      let oldestKey = null;
      let oldestTime = Infinity;
      
      for (const [k, v] of this.cache.entries()) {
        if (v.lastAccessed < oldestTime) {
          oldestTime = v.lastAccessed;
          oldestKey = k;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    // Store new data with timestamp
    this.cache.set(key, {
      data,
      lastAccessed: Date.now()
    });
  }

  // Clear the entire cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  size() {
    return this.cache.size;
  }
}

// Create singleton instance
const searchCache = new SearchCache();

module.exports = searchCache; 