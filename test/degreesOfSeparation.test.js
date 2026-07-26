const { expect } = require("chai");
const bfs = require("../server/utils/DegreesOfSeparation");

describe("degrees-of-separation BFS", () => {
  it("returns the direct connection before a longer path", () => {
    const graph = {
      1: [2, 4],
      2: [1, 3],
      3: [2, 4],
      4: [1, 3],
    };

    expect(bfs(graph, 1, 4)).to.deep.equal([1, 4]);
  });

  it("returns the shortest multi-actor path", () => {
    const graph = {
      1: [2, 5],
      2: [1, 3],
      3: [2, 4],
      4: [3, 5],
      5: [1, 4],
    };

    expect(bfs(graph, 1, 4)).to.deep.equal([1, 5, 4]);
  });

  it("handles identical and disconnected actors", () => {
    expect(bfs({}, 7, 7)).to.deep.equal([7]);
    expect(bfs({ 1: [2], 2: [1] }, 1, 3)).to.equal(null);
  });
});
