const express = require("express");
const app = express.Router();
const { Casts } = require("../db");
const bfs = require("../utils/DegreesOfSeparation");
const buildGraph = require("../utils/graphBuilder");
const getCommonMovie = require("./getCommonMovie");
const {
  findSharedReleasedMovies,
} = require("../services/tmdbCredits");
const searchCache = require("../utils/searchCache");

// GET for degrees of separation between two actors
app.get("/:castsId/:casts2Id", async (req, res, next) => {
  try {
    const { castsId, casts2Id } = req.params;

    // Fetch the casts (actors) by name
    const casts1 = await Casts.findOne({ where: { name: castsId } });
    const casts2 = await Casts.findOne({ where: { name: casts2Id } });

    if (!casts1 || !casts2) {
      return res.status(404).json({ error: "Actor Not Found" });
    }

    if (casts1.id === casts2.id) {
      return res.json({
        degreesOfSeparation: 0,
        path: [casts1.id],
        moviesPath: [],
        actor1: casts1.toJSON(),
        actor2: casts2.toJSON(),
        creditVerification: "same-person",
      });
    }

    const cachedResult = await searchCache.get(casts1.id, casts2.id);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const sendAndCache = async (result) => {
      const expiresAt = await searchCache.set(casts1.id, casts2.id, result);
      return res.json({
        ...result,
        cache: {
          hit: false,
          expiresAt: expiresAt ? expiresAt.toISOString() : null,
        },
      });
    };

    // The local graph is intentionally a cache/subset. Verify the endpoints
    // against TMDB's complete movie-credit lists before trusting a longer path.
    let directCreditCheckCompleted = false;
    try {
      const sharedMovies = await findSharedReleasedMovies(casts1.id, casts2.id);
      directCreditCheckCompleted = true;
      if (sharedMovies.length > 0) {
        return sendAndCache({
          degreesOfSeparation: 1,
          path: [casts1.id, casts2.id],
          moviesPath: [sharedMovies],
          actor1: casts1.toJSON(),
          actor2: casts2.toJSON(),
          creditVerification: "tmdb-full-movie-credits",
        });
      }
    } catch (verificationError) {
      // Availability of the external API should not take down searches that
      // can still be answered from the local graph.
      console.warn(
        "Complete-credit verification unavailable; using local graph:",
        verificationError.message
      );
    }

    const graph = await buildGraph();

    // Using the bfs function to find the path between the two actors
    const path = bfs(graph, casts1.id, casts2.id);

    // Calculate degrees of separation
    const degreesOfSeparation = path ? path.length - 1 : null;

    const moviesPath = [];
    if (path) {
      for (let i = 0; i < path.length - 1; i++) {
        const commonMovies = await getCommonMovie(path[i], path[i + 1]);
        moviesPath.push(commonMovies);
      }
    }

    // Fetch the profile_path for the actors
    const actor1 = await Casts.findByPk(casts1.id);
    const actor2 = await Casts.findByPk(casts2.id);

    // Sending the result as a JSON response with profile_path
    return sendAndCache({
      degreesOfSeparation,
      path,
      moviesPath,
      actor1: { ...actor1.toJSON(), profile_path: actor1.profile_path },
      actor2: { ...actor2.toJSON(), profile_path: actor2.profile_path },
      creditVerification: directCreditCheckCompleted
        ? "local-graph-direct-checked"
        : "local-graph-unverified",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = app;
