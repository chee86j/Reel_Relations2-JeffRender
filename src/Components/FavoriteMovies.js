import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFavoriteMovies } from "../store";
import Tilt from "react-parallax-tilt";

const FavoriteMovies = () => {
  const { favoriteMovies } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFavoriteMovies());
  }, [dispatch]);

  // Conditional check: Display only if favoriteMovies are loaded
  if (!favoriteMovies || favoriteMovies.length === 0) {
    return null; // or show a loading indicator
  }

  return (
    <div className="w-full">
      <ul className="flex flex-wrap">
        {favoriteMovies.map((movie) => (
          <li key={movie.id} className="m-5 max-w-sm">
            <Tilt
              className="parallax-effect-glare-scale"
              perspective={500}
              glareEnable={true}
              glareMaxOpacity={0.45}
            >
              <Link to={`/movie/${movie.movie?.id}`}>
                <img
                  className="w-52 h-75 rounded-lg my-4"
                  src={`https://image.tmdb.org/t/p/original${movie.movie?.poster_path}`}
                  alt="Actor Profile"
                />
                <span className="truncate block max-w-xs text-center">
                  {movie.movie?.title}
                </span>
              </Link>
            </Tilt>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteMovies;
