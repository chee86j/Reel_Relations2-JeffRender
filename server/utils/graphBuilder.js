const { Casts, Movie } = require("../db");

const GRAPH_CACHE_TTL_MS = 5 * 60 * 1000;
let cachedGraph = null;
let graphBuiltAt = 0;
let graphBuildPromise = null;

const buildGraph = async () => {
  if (cachedGraph && Date.now() - graphBuiltAt < GRAPH_CACHE_TTL_MS) {
    return cachedGraph;
  }

  if (graphBuildPromise) {
    return graphBuildPromise;
  }

  graphBuildPromise = buildGraphFromDatabase();

  try {
    cachedGraph = await graphBuildPromise;
    graphBuiltAt = Date.now();
    return cachedGraph;
  } finally {
    graphBuildPromise = null;
  }
};

const buildGraphFromDatabase = async () => {
  const graph = {};

  try {
    const movies = await Movie.findAll({
      attributes: ["id"],
      include: [
        {
          model: Casts,
          as: "casts",
          attributes: ["id"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!movies || movies.length === 0) {
      throw new Error("No movies found in the database.");
    }

    // Build the graph
    for (const movie of movies) {
      const movieCasts = movie.get("casts") || [];

      for (const cast of movieCasts) {
        const castId = cast.id;

        if (!graph[castId]) {
          graph[castId] = new Set();
        }

        for (const coCast of movieCasts) {
          if (coCast.id !== castId) {
            graph[castId].add(coCast.id);
          }
        }
      }
    }
  } catch (error) {
    throw new Error(`Error building the graph: ${error.message}`);
  }

  return Object.fromEntries(
    Object.entries(graph).map(([castId, neighbors]) => [
      castId,
      [...neighbors],
    ])
  );
};

module.exports = buildGraph;
