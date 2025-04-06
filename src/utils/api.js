import axios from "axios";

// GET request to backend to fetch degrees of separation between two casts (actors)
export const fetchDegreesOfSeparation = async (casts1Id, casts2Id) => {
  try {
    const response = await axios.get(
      `/api/degreesOfSeparation/${casts1Id}/${casts2Id}`
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return { degreesOfSeparation: null, path: [], moviesPath: [] };
  }
};

// Search for actors and movies using TMDB multi-search API
export const searchActorsAndMovies = async (query) => {
  if (!query || query.trim() === '') return { results: [] };
  
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1&api_key=8ef1c18c56bc6d0d2ff280c6fd0b854d`
    );
    
    // Filter only person and movie media types
    const filteredResults = response.data.results.filter(
      item => item.media_type === 'person' || item.media_type === 'movie'
    );
    
    return { results: filteredResults };
  } catch (err) {
    console.error("Error searching actors and movies:", err);
    return { results: [] };
  }
};