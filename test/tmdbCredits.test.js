const { expect } = require("chai");
const {
  isReleasedMovie,
  normalizeMovies,
} = require("../server/services/tmdbCredits");

describe("complete movie-credit verification", () => {
  const today = new Date("2026-07-26T12:00:00Z");

  it("accepts released feature credits and rejects future or video credits", () => {
    expect(
      isReleasedMovie(
        { release_date: "2017-07-05", video: false },
        today
      )
    ).to.equal(true);
    expect(
      isReleasedMovie(
        { release_date: "2026-07-28", video: false },
        today
      )
    ).to.equal(false);
    expect(
      isReleasedMovie(
        { release_date: "2017-07-05", video: true },
        today
      )
    ).to.equal(false);
  });

  it("deduplicates credits and keeps the most relevant copy", () => {
    const movies = normalizeMovies(
      {
        cast: [
          {
            id: 315635,
            title: "Spider-Man: Homecoming",
            release_date: "2017-07-05",
            popularity: 10,
            vote_count: 100,
          },
          {
            id: 315635,
            title: "Spider-Man: Homecoming",
            release_date: "2017-07-05",
            popularity: 20,
            vote_count: 100,
          },
          {
            id: 969681,
            title: "Unreleased Movie",
            release_date: "2026-07-28",
          },
        ],
      },
      today
    );

    expect([...movies.keys()]).to.deep.equal([315635]);
    expect(movies.get(315635).popularity).to.equal(20);
  });
});
