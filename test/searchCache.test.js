const { expect } = require("chai");
const {
  ALGORITHM_VERSION,
  actorPair,
  cacheKey,
  reverseResult,
} = require("../server/utils/searchCache");

describe("PostgreSQL actor-pair search cache", () => {
  it("uses the same versioned key in either search direction", () => {
    expect(actorPair(20, 3)).to.deep.equal({ low: 3, high: 20 });
    expect(cacheKey(20, 3)).to.equal(cacheKey(3, 20));
    expect(cacheKey(20, 3)).to.equal(`${ALGORITHM_VERSION}:3:20`);
  });

  it("reverses actor, path, and movie-edge order for reverse searches", () => {
    const reversed = reverseResult({
      degreesOfSeparation: 2,
      path: [1, 2, 3],
      moviesPath: [[{ id: 10 }], [{ id: 20 }]],
      actor1: { id: 1, name: "First" },
      actor2: { id: 3, name: "Third" },
    });

    expect(reversed.path).to.deep.equal([3, 2, 1]);
    expect(reversed.moviesPath).to.deep.equal([
      [{ id: 20 }],
      [{ id: 10 }],
    ]);
    expect(reversed.actor1.id).to.equal(3);
    expect(reversed.actor2.id).to.equal(1);
  });
});
