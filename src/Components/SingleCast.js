import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink, Link } from "react-router-dom";
import {
  fetchActorById,
  fetchFavoriteCasts,
  addFavoriteCast,
  deleteFavoriteCast,
} from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import Carousel from "./Carousel";
import Spinner from "./Spinner";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tilt from "react-parallax-tilt";

const SingleCast = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { singleActor, favoriteCasts, auth, movies } = useSelector(
    (state) => state
  );
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;
  const [expanded, setExpanded] = useState(false);

  const isActorInFavorites = (actorId) => {
    if (favoriteCasts.length === 0) {
      return false;
    }
    return favoriteCasts.some((actor) => {
      return actor.actorId === actorId;
    });
  };

  const handleToggleFavorite = (actorId) => {
    if (isActorInFavorites(actorId)) {
      dispatch(deleteFavoriteCast(actorId));
      toast.success("Actor removed from favorites."); // Show success toast when actor is removed
    } else {
      dispatch(addFavoriteCast(actorId));
      toast.success("Actor added to favorites."); // Show success toast when actor is added
    }
  };

  useEffect(() => {
    dispatch(fetchActorById(id));
    dispatch(fetchFavoriteCasts());
    setCurrentPage(1);
    setExpanded(false);
  }, [dispatch, id]);

  // Calculate the current age
  const birthDate = new Date(singleActor.birthday);
  const ageDiffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs);
  const currentAge = Math.abs(ageDate.getUTCFullYear() - 1970);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const truncatedBiography = singleActor?.biography
    ?.split(" ")
    ?.slice(0, 100)
    ?.join(" ");
  const showReadMore = singleActor?.biography?.split(" ").length > 100;

  if (!singleActor || !singleActor.movie_credits) {
    return (
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
      //       You're Lost Buddy - Actor Page Not Found
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
    );
  }

  const filteredMovies = singleActor.movie_credits.cast.filter(
    (movie) => movie.popularity > 0
  );
  const sortedPopularity =
    filteredMovies.length < 10
      ? filteredMovies
      : filteredMovies.sort(
          (movie1, movie2) => movie2.popularity - movie1.popularity
        );

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedPopularity.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const popularMovies = sortedPopularity.slice(0, 10);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex p-8 text-white">
      <div className="mx-6">
        {auth.username && (
          <span>
            {isActorInFavorites(singleActor.id) ? (
              <FontAwesomeIcon
                icon={solidHeart}
                onClick={() => handleToggleFavorite(singleActor.id)}
              />
            ) : (
              <FontAwesomeIcon
                icon={regularHeart}
                onClick={() => handleToggleFavorite(singleActor.id)}
              />
            )}
          </span>
        )}
        <Tilt
          className="parallax-effect-glare-scale"
          perspective={500}
          glareEnable={true}
          glareMaxOpacity={0.45}
        >
          <img
            className="w-[300px] h-[450px] min-w-[300px] min-h-[450px] block rounded-lg my-4"
            src={`https://image.tmdb.org/t/p/original${singleActor.profile_path}`}
            alt="Actor Profile"
          />
        </Tilt>
        <h1>Current Age: {currentAge} years old</h1>
        <h1>Birthday: {singleActor.birthday} </h1>
        {singleActor.deathday && <h1>Died: {singleActor.deathday}</h1>}
        {singleActor.movie_credits.cast && (
          <h1>Known Credits: {singleActor.movie_credits.cast.length}</h1>
        )}
        {singleActor.place_of_birth && (
          <h1>Place of Birth: {singleActor.place_of_birth}</h1>
        )}
      </div>
      <div className="w-full pl-[30px] overflow-x-hidden">
        <h2 className="font-bold text-2xl">{singleActor.name}</h2>
        <section className="mt-[30px]">
          <h2 className="mb-[8px] font-bold text-lg">Biography </h2>
          {expanded ? (
            <p>{singleActor.biography}</p>
          ) : (
            <p>{truncatedBiography}</p>
          )}
          {showReadMore && (
            <button
              className="text-lg font-semibold text-blue-500 hover:underline"
              onClick={toggleExpand}
            >
              {expanded ? (
                <div className="flex items-center">
                  <ChevronsLeft size={20} />
                  <div>Read Less</div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div>Read More</div>
                  <ChevronsRight size={20} />
                </div>
              )}
            </button>
          )}
        </section>
        <section className="mt-[30px] overflow-x-hidden">
          <h3 className="text-lg font-bold">Known For: </h3>
          <div className="min-h-[221px] overflow-x-scroll">
            <ul className="flex">
              {popularMovies.map((movie) => {
                return (
                  <Tilt
                    className="parallax-effect-glare-scale"
                    perspective={500}
                    glareEnable={true}
                    glareMaxOpacity={0.45}
                  >
                    <li key={movie.id} className="w-[130px] mr-4 flex-shrink-0">
                      <Link to={`/movie/${movie.id}`}>
                        <img
                          className="w-[130px] h-[195px] object-cover"
                          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                        />
                        <p className="text-center">{movie.title}</p>
                      </Link>
                    </li>
                  </Tilt>
                );
              })}
            </ul>
          </div>
        </section>
        <section className="mt-[30px] w-full mb-2">
          <h3 className="text-lg font-bold">Acting: </h3>
          <ul className="border border-gray-300 shadow-lg rounded-lg p-2 mb-1">
            {currentMovies.map((movie) => (
              <li key={movie.id} className="my-4">
                <Link className="block" to={`/movie/${movie.id}`}>
                  <span className="mr-1">
                    {movie.release_date.split("-")[0]}
                  </span>{" "}
                  {movie.title}
                </Link>
                {movie.character && (
                  <div className="pl-2">
                    <span>as </span>
                    <span>{movie.character}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div>
            {singleActor.movie_credits.cast.length > moviesPerPage && (
              <ul className="flex space-x-2 ">
                {Array.from(
                  Array(
                    Math.ceil(
                      singleActor.movie_credits.cast.length / moviesPerPage
                    )
                  ),
                  (value, index) => (
                    <li key={index}>
                      <button
                        className={`px-2 py-1 rounded-md focus:outline-none ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500 hover:bg-blue-100"
                        }`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </section>
      </div>
      <ToastContainer position="bottom-right" />{" "}
    </div>
  );
};

export default SingleCast;
