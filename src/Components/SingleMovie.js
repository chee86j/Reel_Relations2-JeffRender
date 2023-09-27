import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import {
  addFavoriteMovie,
  deleteFavoriteMovie,
  fetchFavoriteMovies,
  fetchMovieById,
  fetchMovies,
} from "../store";
import { useParams, NavLink, Link } from "react-router-dom";
import Spinner from "./Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tilt from "react-parallax-tilt";

// Star Rating component
const StarRating = ({ rating }) => {
  const filledStars = Math.round(rating / 2);
  const emptyStars = 5 - filledStars;

  return (
    <div className="star-rating">
      {[...Array(filledStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={filledStar} />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={emptyStar} />
      ))}
    </div>
  );
};

const SingleMovie = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { singleMovie, favoriteMovies, auth, movies } = useSelector(
    (state) => state
  );
  const [currentPage, setCurrentPage] = useState(1);
  const actorsPerPage = 15;

  const isMovieInFavorites = (movieId) => {
    console.log("favoriteMovies:", favoriteMovies);
    console.log("movieId:", movieId);

    if (!favoriteMovies || favoriteMovies.length === 0) {
      return false;
    }

    const isFavorite = favoriteMovies.some((movie) => {
      console.log(movie);
      console.log(movie.movieId === movieId);
      return movie.movieId === movieId;
    });

    console.log("isFavorite:", isFavorite);
    return isFavorite;
  };

  const isSingleInDb = (movieId) => {
    return movies.some((movie) => movie.id === movieId);
  };

  const handleToggleFavorite = (movieId) => {
    if (isMovieInFavorites(movieId)) {
      dispatch(deleteFavoriteMovie(movieId));
      toast.success("Movie removed from favorites."); // Show success toast when movie is removed
    } else {
      dispatch(addFavoriteMovie(movieId));
      toast.success("Movie added to favorites."); // Show success toast when movie is added
    }
    dispatch(fetchFavoriteMovies());
  };

  useEffect(() => {
    dispatch(fetchMovieById(id));
    dispatch(fetchFavoriteMovies());
    dispatch(fetchMovies());
  }, [dispatch, id]);

  const releaseYear = new Date(singleMovie?.release_date).getFullYear();
  const formattedDate = new Date(
    singleMovie?.release_date
  ).toLocaleDateString();

  const runtimeHours = Math.floor(singleMovie.runtime / 60);
  const runtimeMinutes = singleMovie.runtime % 60;

  const filteredCast = singleMovie.credits?.cast.filter(
    (cast) => cast.popularity > 0
  );
  const sortedPopularity =
    filteredCast?.length < 10
      ? filteredCast
      : filteredCast?.sort(
          (actor1, actor2) => actor2.popularity - actor1.popularity
        );

  const indexOfLastActor = currentPage * actorsPerPage;
  const indexOfFirstActor = indexOfLastActor - actorsPerPage;
  const currentActors = sortedPopularity?.slice(
    indexOfFirstActor,
    indexOfLastActor
  );
  const popularActors = sortedPopularity?.slice(0, 10);
  console.log(popularActors);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return !singleMovie?.title ? (
    // <div className="flex flex-col items-center justify-start h-screen">
    //   <h1 className="flex flex-col items-center justify-start">
    //     <div className="text-white text-2xl font-bold my-2 text-center">
    //       <div className="flex justify-center">
    //         <img
    //           src="https://cdn.dribbble.com/users/8805637/screenshots/16312153/media/d1dbc1c5e61313fc5c81b65f8540c8e3.gif"
    //           alt="Animated GIF"
    //           className="w-3/5"
    //         />
    //       </div>
    //     </div>
    //     <div className="text-white text-2xl font-bold my-2 text-center">
    //       You're Lost Buddy - Movie Page Not Found
    //     </div>
    //   </h1>
    //   <div className="flex items-center justify-center">
    //     <NavLink
    //       className="w-96 flex items-center justify-center text-md px-4 py-2 border rounded text-white border-white hover:border-teal-500 hover:text-teal-500 mt-4"
    //       to={"/"}
    //     >
    //       Return Back Home
    //     </NavLink>
    //   </div>
    // </div>
    <Spinner />
  ) : (
    <div className="flex p-8 text-white">
      <div className="mx-6 w-[300px]">
        {/* {auth.username && (
          <span>
            {isMovieInFavorites(singleMovie.id) ? (
              <FontAwesomeIcon
                icon={solidHeart}
                onClick={() => handleToggleFavorite(singleMovie.id)}
              />
            ) : (
              <FontAwesomeIcon
                icon={regularHeart}
                onClick={() => handleToggleFavorite(singleMovie.id)}
              />
            )}
          </span>
        )} */}
        <Tilt
          className="parallax-effect-glare-scale"
          perspective={500}
          glareEnable={true}
          glareMaxOpacity={0.45}
        >
          <img
            className="w-full h-[450px] min-w-[300px] min-h-[450px] block rounded-lg my-4"
            src={`https://image.tmdb.org/t/p/original${singleMovie.poster_path}`}
            alt="Movie Poster"
          />
        </Tilt>
      </div>
      <div className="flex-1 pl-[30px] overflow-x-hidden text-white">
        <h1 className="mb-[8px] font-bold text-lg">
          {singleMovie.title} ({releaseYear}){" "}
          {auth.username && isSingleInDb(singleMovie.id) && (
            <span>
              {isMovieInFavorites(singleMovie.id) ? (
                <FontAwesomeIcon
                  icon={solidHeart}
                  onClick={() => handleToggleFavorite(singleMovie.id)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={regularHeart}
                  onClick={() => handleToggleFavorite(singleMovie.id)}
                />
              )}
            </span>
          )}
        </h1>
        <p className="text-xs">
          Released: {formattedDate} - Runtime: {runtimeHours}h {runtimeMinutes}m
        </p>
        <p className="flex flex-wrap font-bold text-sm">
          User Score <StarRating rating={singleMovie.vote_average} />
        </p>
        <section className="mt-[30px]">
          <h2 className="mb-[8px] font-bold text-lg">Overview</h2>
          <p>{singleMovie.overview}</p>
        </section>
        <section className="mt-[30px] overflow-x-hidden flex-1">
          <h3 className="text-lg font-bold">Top Billed Cast: </h3>
          <div className="min-h-[221px] overflow-x-scroll">
            <ul className="flex">
              {popularActors.map((actor) => {
                return (
                  <Tilt
                    className="parallax-effect-glare-scale"
                    perspective={500}
                    glareEnable={true}
                    glareMaxOpacity={0.45}
                  >
                    <li key={actor.id} className="w-[130px] mr-4 flex-shrink-0">
                      <Link to={`/casts/${actor.id}`}>
                        <img
                          className="w-[130px] h-[195px] object-cover"
                          src={`https://image.tmdb.org/t/p/original/${actor.profile_path}`}
                        />
                        <div className="text-center">{actor.name}</div>
                      </Link>
                      <div className="text-center">as </div>
                      <div className="text-center">{actor.character}</div>
                    </li>
                  </Tilt>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
      <ToastContainer position="bottom-right" />{" "}
    </div>
  );
};

export default SingleMovie;
