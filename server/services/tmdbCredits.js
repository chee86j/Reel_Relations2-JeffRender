const axios = require("axios");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const creditsCache = new Map();

const isReleasedMovie = (movie, today = new Date()) => {
  if (movie.video || !movie.release_date) {
    return false;
  }

  const releaseDate = new Date(`${movie.release_date}T00:00:00Z`);
  return !Number.isNaN(releaseDate.getTime()) && releaseDate <= today;
};

const movieRank = (movie) =>
  (Number(movie.vote_count) || 0) + (Number(movie.popularity) || 0) * 10;

const normalizeMovies = (credits, today) => {
  const moviesById = new Map();

  for (const movie of credits.cast || []) {
    if (!isReleasedMovie(movie, today)) {
      continue;
    }

    const existing = moviesById.get(movie.id);
    if (!existing || movieRank(movie) > movieRank(existing)) {
      moviesById.set(movie.id, {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdrop_path: movie.backdrop_path,
        popularity: movie.popularity,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
      });
    }
  }

  return moviesById;
};

const trimCache = () => {
  while (creditsCache.size > MAX_CACHE_ENTRIES) {
    creditsCache.delete(creditsCache.keys().next().value);
  }
};

const fetchMovieCredits = async (personId) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is required to verify complete actor credits");
  }

  const cached = creditsCache.get(personId);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return cached.promise;
  }

  const promise = axios
    .get(`https://api.themoviedb.org/3/person/${personId}/movie_credits`, {
      params: { api_key: apiKey, language: "en-US" },
      timeout: 10000,
    })
    .then((response) => response.data)
    .catch((error) => {
      creditsCache.delete(personId);
      throw error;
    });

  creditsCache.set(personId, { createdAt: Date.now(), promise });
  trimCache();
  return promise;
};

const findSharedReleasedMovies = async (
  firstPersonId,
  secondPersonId,
  today = new Date()
) => {
  const [firstCredits, secondCredits] = await Promise.all([
    fetchMovieCredits(firstPersonId),
    fetchMovieCredits(secondPersonId),
  ]);
  const firstMovies = normalizeMovies(firstCredits, today);
  const secondMovies = normalizeMovies(secondCredits, today);

  return [...firstMovies.values()]
    .filter((movie) => secondMovies.has(movie.id))
    .sort((left, right) => movieRank(right) - movieRank(left));
};

module.exports = {
  findSharedReleasedMovies,
  isReleasedMovie,
  normalizeMovies,
};
