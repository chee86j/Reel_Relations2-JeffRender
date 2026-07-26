const { Op } = require("sequelize");
const { SearchResultCache } = require("../db");

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ALGORITHM_VERSION = "degrees-v2-complete-direct-credits";

const actorPair = (firstActorId, secondActorId) => {
  const first = Number(firstActorId);
  const second = Number(secondActorId);
  return {
    low: Math.min(first, second),
    high: Math.max(first, second),
  };
};

const cacheKey = (firstActorId, secondActorId) => {
  const { low, high } = actorPair(firstActorId, secondActorId);
  return `${ALGORITHM_VERSION}:${low}:${high}`;
};

const reverseResult = (result) => ({
  ...result,
  path: Array.isArray(result.path) ? [...result.path].reverse() : result.path,
  moviesPath: Array.isArray(result.moviesPath)
    ? [...result.moviesPath].reverse()
    : result.moviesPath,
  actor1: result.actor2,
  actor2: result.actor1,
});

const withoutCacheMetadata = (result) => {
  const copy = JSON.parse(JSON.stringify(result));
  delete copy.cache;
  return copy;
};

const initialize = async () => {
  try {
    // This creates only the cache table and does not alter existing app tables.
    await SearchResultCache.sync();
    await SearchResultCache.destroy({
      where: { expiresAt: { [Op.lte]: new Date() } },
    });
  } catch (error) {
    console.warn("PostgreSQL search cache unavailable:", error.message);
  }
};

const get = async (firstActorId, secondActorId) => {
  try {
    const row = await SearchResultCache.findByPk(
      cacheKey(firstActorId, secondActorId)
    );

    if (!row) {
      return null;
    }

    if (row.expiresAt <= new Date()) {
      await row.destroy();
      return null;
    }

    await row.update({ lastAccessedAt: new Date() });

    const storedResult = withoutCacheMetadata(row.response);
    const requestedFirstId = Number(firstActorId);
    const storedFirstId = Number(storedResult.actor1?.id);
    const result =
      requestedFirstId === storedFirstId
        ? storedResult
        : reverseResult(storedResult);

    return {
      ...result,
      cache: {
        hit: true,
        expiresAt: row.expiresAt.toISOString(),
      },
    };
  } catch (error) {
    console.warn("PostgreSQL search cache read failed:", error.message);
    return null;
  }
};

const set = async (firstActorId, secondActorId, result) => {
  try {
    const { low, high } = actorPair(firstActorId, secondActorId);
    const cleanResult = withoutCacheMetadata(result);
    const canonicalResult =
      Number(cleanResult.actor1?.id) === low
        ? cleanResult
        : reverseResult(cleanResult);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

    await SearchResultCache.upsert({
      key: cacheKey(low, high),
      actorLowId: low,
      actorHighId: high,
      algorithmVersion: ALGORITHM_VERSION,
      response: canonicalResult,
      expiresAt,
      lastAccessedAt: now,
    });

    return expiresAt;
  } catch (error) {
    console.warn("PostgreSQL search cache write failed:", error.message);
    return null;
  }
};

module.exports = {
  ALGORITHM_VERSION,
  CACHE_TTL_MS,
  actorPair,
  cacheKey,
  get,
  initialize,
  reverseResult,
  set,
};
