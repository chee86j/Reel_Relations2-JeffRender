import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchActors, fetchMovies, logout } from "../store";
import { Clapperboard, Menu, X, User, Star, Film, Home, Info, Moon, Sun } from "lucide-react";
import user from "../store/user";
import EditAccount from "./EditAccount";

const Navbar = ({ theme, toggleTheme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, actors, movies } = useSelector((state) => state);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    if (profileOpen) setProfileOpen(false);
  };

  useEffect(() => {
    dispatch(fetchActors());
    dispatch(fetchMovies());
  }, [dispatch]);

  const renderAuthButtons = () => {
    const handleMenuOptionClick = () => {
      setProfileOpen(false);
      setMenuOpen(false);
    };

    if (auth.username) {
      return (
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
          >
            {auth.avatar ? (
              <img
                className="h-8 w-8 rounded-full border-2 border-transparent group-hover:border-teal-400/50 transition-all duration-200"
                src={auth.avatar}
                alt={auth.username}
              />
            ) : (
              <User className="h-5 w-5 text-slate-300 group-hover:text-teal-400" />
            )}
            <span className="text-slate-300 group-hover:text-teal-400">{auth.username}</span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden backdrop-blur-md bg-black/80 border border-white/20 shadow-xl">
              <div className="py-1">
                <Link
                  to="/favorites"
                  onClick={handleMenuOptionClick}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/10 transition-colors duration-200"
                >
                  <Star className="h-4 w-4" />
                  <span>My Favorites</span>
                </Link>
                <Link
                  to="/editAccount"
                  onClick={handleMenuOptionClick}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/10 transition-colors duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Edit Account</span>
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout());
                    handleMenuOptionClick();
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/10 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          to="/login"
          className="px-6 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg text-white font-medium transition duration-200"
        >
          Login
        </Link>
      );
    }
  };

  const getRandomActor = () => {
    if (!actors || actors.length === 0) return "";
    const filteredActors = actors.filter((actor) => actor.profile_path);
    if (filteredActors.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * filteredActors.length);
    return filteredActors[randomIndex].id;
  };

  const getRandomMovie = () => {
    if (!movies || movies.length === 0) return "";
    const filteredMovies = movies.filter((movie) => movie.poster_path);
    if (filteredMovies.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    return filteredMovies[randomIndex].id;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-8 border-r border-white/10">
            <Clapperboard className="h-6 w-6 text-teal-400" />
            <Link 
              to="/" 
              className="text-xl font-bold text-white hover:text-teal-400 transition duration-200"
            >
              Reel Relations
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1">
            <div className="flex items-center space-x-8 pl-8">
              <Link
                to="/"
                className="nav-link flex items-center gap-2 text-slate-300 hover:text-teal-400 transition duration-200"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="nav-link flex items-center gap-2 text-slate-300 hover:text-teal-400 transition duration-200"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link
                to={`/casts/${getRandomActor()}`}
                className="nav-link flex items-center gap-2 text-slate-300 hover:text-teal-400 transition duration-200"
              >
                <User className="h-4 w-4" />
                <span>Random Actor</span>
              </Link>
              <Link
                to={`/movie/${getRandomMovie()}`}
                className="nav-link flex items-center gap-2 text-slate-300 hover:text-teal-400 transition duration-200"
              >
                <Film className="h-4 w-4" />
                <span>Random Movie</span>
              </Link>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 text-slate-300 hover:text-teal-400"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Theme</span>
              </button>
              <div className="ml-8">{renderAuthButtons()}</div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-teal-400 hover:bg-white/10 transition duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-teal-400 hover:bg-white/10 transition duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10">
            <div className="pt-2 pb-3 space-y-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400 transition duration-200"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400 transition duration-200"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link
                to={`/casts/${getRandomActor()}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400 transition duration-200"
              >
                <User className="h-4 w-4" />
                <span>Random Actor</span>
              </Link>
              <Link
                to={`/movie/${getRandomMovie()}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-teal-400 transition duration-200"
              >
                <Film className="h-4 w-4" />
                <span>Random Movie</span>
              </Link>
              <div className="px-4 py-2">
                {renderAuthButtons()}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
