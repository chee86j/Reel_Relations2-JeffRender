import { searchActorsAndMovies } from './api';

// Simple test to verify the function is properly exported
console.log('API function searchActorsAndMovies exists:', typeof searchActorsAndMovies === 'function');

// Test the function with a sample query
const testSearch = async () => {
  try {
    console.log('Testing search with query: "Tom Hanks"');
    const results = await searchActorsAndMovies('Tom Hanks');
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search test failed:', error);
  }
};

// Run the test
testSearch(); 