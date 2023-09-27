import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteCasts } from "../store";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";

const FavoriteCasts = () => {
  const { favoriteCasts } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFavoriteCasts());
  }, [dispatch]);

  if (!favoriteCasts) {
    return null;
  }

  return (
    <div>
      <ul className="flex flex-wrap">
        {favoriteCasts &&
          favoriteCasts.map((cast) => (
            <li key={cast.id} className="m-4">
              <Tilt
                className="parallax-effect-glare-scale"
                perspective={500}
                glareEnable={true}
                glareMaxOpacity={0.45}
              >
                <Link to={`/casts/${cast.actorId}`}>
                  <img
                    className="w-52 h-75 rounded-lg my-4"
                    src={`https://image.tmdb.org/t/p/original${cast.cast?.profile_path}`}
                    alt="Actor Profile"
                  />
                  <span className="truncate block max-w-xs text-center">
                    {" "}
                    {/* Add text-center class */}
                    {cast.cast?.name}
                  </span>
                </Link>
              </Tilt>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FavoriteCasts;
