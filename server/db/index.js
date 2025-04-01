require("dotenv").config();
const conn = require("./conn");
const User = require("./User");
const Movie = require("./Movie");
const Casts = require("./Casts");
const axios = require("axios");
const { FavoriteCasts, FavoriteMovies } = require("./Favorites");

// Define many-to-many relationship between Cast(Actor) and Movie
Casts.belongsToMany(Movie, { through: "movie_cast" });
Movie.belongsToMany(Casts, { through: "movie_cast" });

User.hasMany(FavoriteCasts);
User.hasMany(FavoriteMovies);

FavoriteMovies.belongsTo(User);
FavoriteCasts.belongsTo(User);

FavoriteMovies.belongsTo(Movie, { foreignKey: "movieId" });
Movie.hasMany(FavoriteMovies, { foreignKey: "movieId" });

FavoriteCasts.belongsTo(Casts, { foreignKey: "actorId" });
Casts.hasMany(FavoriteCasts, { foreignKey: "actorId" });

const apiKey = process.env.API_KEY;

const fetchPopularCastMembers = async (page) => {
  const url = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${page}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular cast members:", error);
    return [];
  }
};

const fetchMovieDetails = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&language=en-US&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching movie details for movie Id ${movieId}`,
      error
    );
    return null;
  }
};

const syncAndSeed = async () => {
  await conn.sync({ force: true });

  // Create admin users
  try {
    const adminUsers = [
      {
        email: 'hpotter@gmail.com',
        username: 'hpotter',
        password: 'Qwe123!!',
        isAdmin: true
      },
      {
        email: 'moe@gmail.com',
        username: 'moe234',
        password: 'Qwe123!!',
        isAdmin: true
      }
    ];

    for (const adminData of adminUsers) {
      const existingUser = await User.findOne({
        where: { email: adminData.email }
      });

      if (!existingUser) {
        await User.create(adminData);
        console.log(`Admin user ${adminData.username} created successfully`);
      }
    }
  } catch (error) {
    console.error('Error creating admin users:', error);
  }

  const totalPages = 10;

  try {
    for (let page = 1; page < totalPages; page++) {
      const popularCastMembers = await fetchPopularCastMembers(page);

      for (const castMember of popularCastMembers) {
        if (castMember.known_for_department === "Acting") {
          let existingCastMember = await Casts.findOne({
            where: { id: castMember.id },
          });

          if (!existingCastMember) {
            const newCastMember = await Casts.create({
              id: castMember.id,
              known_for_department: castMember.known_for_department,
              name: castMember.name,
              known_for: castMember.known_for,
              profile_path: castMember.profile_path,
            });

            for (const knownMovie of castMember.known_for) {
              let movie = await Movie.findOne({ where: { id: knownMovie.id } });

              if (!movie) {
                const movieDetails = await fetchMovieDetails(knownMovie.id);

                if (movieDetails) {
                  movie = await Movie.create({
                    id: movieDetails.id,
                    title: movieDetails.title,
                    backdrop_path: movieDetails.backdrop_path,
                    overview: movieDetails.overview,
                    popularity: movieDetails.popularity,
                    poster_path: movieDetails.poster_path,
                    runtime: movieDetails.runtime,
                    release_date: movieDetails.release_date,
                    vote_average: movieDetails.vote_average,
                    vote_count: movieDetails.vote_count,
                  });

                  for (const credit of movieDetails.credits.cast) {
                    if (credit.known_for_department === "Acting") {
                      const castMember = await Casts.findOne({
                        where: { id: credit.id },
                      });

                      if (castMember) {
                        await movie.addCast(castMember);
                      } else {
                        const newCreditCastMember = await Casts.create({
                          id: credit.id,
                          known_for_department: credit.known_for_department,
                          name: credit.name,
                          profile_path: credit.profile_path,
                        });
                        await movie.addCast(newCreditCastMember);
                      }
                    }
                  }
                }
                if (movie) {
                  await newCastMember.addMovie(movie);
                }
              }
            }
          }
        }
        }
      }
    } catch (error) {
      console.error("Error during seeding:", error);
    }
};

module.exports = {
  syncAndSeed,
  User,
  Movie,
  Casts,
};
