import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchActors, fetchMovies, logout } from "../store";
import { Clapperboard } from "lucide-react";
import user from "../store/user";
import EditAccount from "./EditAccount";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, actors, movies } = useSelector((state) => state);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    dispatch(fetchActors());
    dispatch(fetchMovies());
  }, [dispatch]);

  const renderAuthButtons = () => {
    const handleMenuOptionClick = () => {
      setProfileOpen(false);
    };

    if (auth.username) {
      return (
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex justify-center items-center mx-3 rounded-full text-white block border-2 border-slate-400 focus:outline-none focus:border-white hover:text-teal-200 hover:border-teal-200"
          >
            {auth.avatar && (
              <img
                className="mx-2 my-2 h-12 w-12 rounded-full"
                src={auth.avatar}
                alt={auth.username}
              />
            )}
            <span className="mx-1 my-1">{auth.username}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg py-2 shadow-md z-10 hover:text-white">
              <Link
                to="/favorites"
                onClick={() => handleMenuOptionClick()}
                className="block px-4 py-2 text-gray-800 bg-white hover:bg-indigo-500 hover:text-white"
              >
                My Favorites
              </Link>
              <div>
                <Link
                  to="/editAccount"
                  onClick={() => handleMenuOptionClick()}
                  className="block px-4 py-2 text-gray-800 bg-white hover:bg-indigo-500 hover:text-white"
                >
                  Edit Account
                </Link>
              </div>
              <button
                onClick={() => {
                  dispatch(logout());
                  handleMenuOptionClick();
                  navigate("/");
                }}
                className="block px-4 py-2 text-gray-800 bg-white hover:bg-indigo-500 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <Link
            to="/login"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
          >
            Login
          </Link>
        </div>
      );
    }
  };

  const getRandomActor = () => {
    if (!actors || actors.length === 0) {
      return "";
    }

    // Filter actors with a non-empty profile path
    const filteredActors = actors.filter((actor) => actor.profile_path);

    if (filteredActors.length === 0) {
      return "";
    }

    const randomIndex = Math.floor(Math.random() * filteredActors.length);
    const randomActor = filteredActors[randomIndex];
    return randomActor.id;
  };

  const getRandomMovie = () => {
    if (!movies || movies.length === 0) {
      return "";
    }

    // Filter actors with a non-empty profile path
    const filteredMovies = movies.filter((movie) => movie.poster_path);

    if (filteredMovies.length === 0) {
      return "";
    }

    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    const randomMovie = filteredMovies[randomIndex];
    return randomMovie.id;
  };

  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="flex font-semibold text-xl tracking-tight">
          <Clapperboard />
          <Link to="/">Reel Relations</Link>
        </span>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={toggleMenu}
          className="flex items-center px-1 py-1 border rounded text-white border-white-400 hover:text-white hover:border-teal-400"
        >
          <svg
            className="fill-current h-3 w-3 text-white"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } w-full lg:flex lg:items-center lg:w-auto`}
      >
        <div className="text-sm lg:flex-grow">
          <Link
            to="/"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            About
          </Link>
          <Link
            to={`/casts/${getRandomActor()}`}
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            Random Actor
          </Link>
          <Link
            to={`/movie/${getRandomMovie()}`}
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            Random Movie
          </Link>
        </div>
        <div className="lg:ml-auto">{renderAuthButtons()}</div>
      </div>
    </nav>
  );
};

export default Navbar;
