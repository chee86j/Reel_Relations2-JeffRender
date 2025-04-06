import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { SearchIcon, User, Film, ArrowLeft, Loader, X } from "lucide-react";
import { searchActorsAndMovies } from "../utils/api";
import Spinner from "./Spinner";
import Tilt from "react-parallax-tilt";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, actors, movies
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const { query } = useParams();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
    
    // If there's a query parameter, search for it immediately
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  // Add a search to recent searches
  const addToRecentSearches = (query) => {
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const { results } = await searchActorsAndMovies(query);
      
      // Filter results based on selectedFilter
      let filteredResults = results || [];
      if (selectedFilter === "actors") {
        filteredResults = filteredResults.filter(item => item.media_type === "person");
      } else if (selectedFilter === "movies") {
        filteredResults = filteredResults.filter(item => item.media_type === "movie");
      }
      
      setSearchResults(filteredResults);
      addToRecentSearches(query);
      setLoading(false);
    } catch (err) {
      console.error("Search error:", err);
      setLoading(false);
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
    // Update URL without full page reload
    navigate(`/search/${encodeURIComponent(searchQuery)}`, { replace: true });
  };

  const handleResultClick = (result) => {
    if (result.media_type === 'person') {
      navigate(`/casts/${result.id}`);
    } else if (result.media_type === 'movie') {
      navigate(`/movie/${result.id}`);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    performSearch(query);
    navigate(`/search/${encodeURIComponent(query)}`, { replace: true });
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link to="/" className="mr-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </Link>
          <h1 className="text-3xl font-bold">Search</h1>
        </div>
        
        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for actors or movies..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="h-5 w-5 text-slate-400 hover:text-white" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-xl text-white font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!searchQuery.trim() || loading}
              >
                {loading ? 
                  <span className="flex items-center"><Loader className="h-4 w-4 animate-spin mr-2" /> Searching</span> : 
                  'Search'
                }
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === "all" 
                    ? "bg-teal-500/30 border border-teal-500/50" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                All Results
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("actors")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedFilter === "actors" 
                    ? "bg-teal-500/30 border border-teal-500/50" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4" /> Actors
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("movies")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedFilter === "movies" 
                    ? "bg-teal-500/30 border border-teal-500/50" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <Film className="h-4 w-4" /> Movies
              </button>
            </div>
          </form>
        </div>
        
        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchResults.length && !loading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Recent Searches</h2>
              <button 
                onClick={clearRecentSearches}
                className="text-sm text-slate-400 hover:text-white"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(query)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner />
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            <h2 className="text-xl font-medium mb-6">
              {searchResults.length} results for "{searchQuery}"
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((result) => (
                <Tilt
                  key={`${result.media_type}-${result.id}`}
                  className="parallax-effect-glare-scale"
                  perspective={500}
                  glareEnable={true}
                  glareMaxOpacity={0.45}
                  scale={1.02}
                >
                  <div 
                    onClick={() => handleResultClick(result)}
                    className="cursor-pointer group bg-black/40 rounded-xl border border-white/10 overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:bg-white/5"
                  >
                    {result.profile_path || result.poster_path ? (
                      <div className="w-full aspect-[2/3] overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w300${result.profile_path || result.poster_path}`}
                          alt={result.name || result.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-800">
                        {result.media_type === 'person' ? (
                          <User className="h-12 w-12 text-gray-400" />
                        ) : (
                          <Film className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-white group-hover:text-teal-400 transition-colors duration-300 mb-1">
                        {result.name || result.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {result.media_type === 'person' ? 'Actor' : 'Movie'}
                        </span>
                        {result.media_type === 'movie' && result.release_date && (
                          <span className="text-xs text-slate-400">
                            {new Date(result.release_date).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        ) : searchQuery && !loading ? (
          <div className="text-center py-16">
            <Film className="h-16 w-16 mx-auto text-slate-500 mb-4" />
            <h2 className="text-2xl font-medium mb-2">No results found</h2>
            <p className="text-slate-400">
              We couldn't find any matches for "{searchQuery}". 
              <br />Please try another search term or check your spelling.
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 mx-auto text-slate-500 mb-4" />
            <h2 className="text-2xl font-medium mb-2">Discover actors and movies</h2>
            <p className="text-slate-400">
              Search for your favorite actors or movies using the search box above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;