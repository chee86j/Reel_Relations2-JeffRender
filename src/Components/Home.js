import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout, fetchSomeActors, clearSomeActors } from "../store";
import { SearchIcon, Star, ArrowRight } from "lucide-react";
import { fetchDegreesOfSeparation } from "../utils/api";
import Spinner from "./Spinner";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import Tilt from "react-parallax-tilt";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const { auth, someActors } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [casts1Id, setCasts1Id] = useState("");
  const [casts2Id, setCasts2Id] = useState("");
  const [degreesOfSeparation, setDegreesOfSeparation] = useState(null);
  const [path, setPath] = useState([]);
  const [moviesPath, setMoviesPath] = useState(null);
  const [flowchart, setFlowchart] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    for (let i = 0; i < path.length; i++) {
      dispatch(fetchSomeActors(path[i]));
    }
  }, [path]);

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < path.length; i++) {
      for (let j = 0; j < someActors.length; j++) {
        if (someActors[j].id === path[i]) {
          const actor = someActors[j];
          const profilePath = actor.profile_path;
          temp.push({
            ...actor,
            profile_path: `https://image.tmdb.org/t/p/original${profilePath}`,
          });
          if (moviesPath && moviesPath[i]) {
            temp.push(
              moviesPath[i][Math.floor(Math.random() * moviesPath[i].length)]
            );
          }
        }
      }
    }
    setFlowchart(temp);
  }, [someActors]);

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const findLink = async () => {
    try {
      setLoading(true);
      const response = await fetchDegreesOfSeparation(casts1Id, casts2Id);
      setDegreesOfSeparation(response.degreesOfSeparation);
      setPath(response.path);
      setMoviesPath(response.moviesPath);
      dispatch(clearSomeActors());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchSuggestions = async (value) => {
    try {
      const { data } = await axios.get("/api/actors");
      const actors = data.map((item) => item.name);
      const filteredActors = actors.filter(
        (actor) =>
          typeof actor === "string" &&
          actor.toLowerCase().startsWith(value.toLowerCase())
      );
      const limitedSuggestions = filteredActors.slice(0, 5);
      return limitedSuggestions;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const renderSuggestion = (suggestion) => {
    return (
      <div className="p-3 hover:bg-white/5 cursor-pointer text-white transition-colors duration-200">
        {suggestion}
      </div>
    );
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await fetchSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-teal-400" />
            <h1 className="text-4xl font-bold">
              Welcome {auth.username} to Reel Relations
            </h1>
            <Star className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-lg text-slate-300 mb-2">
            Discover the Enchanting World of Hollywood & Cinema From Across the
            Globe & Uncover Why It's All About Who You Know
          </p>
          <p className="text-xs text-slate-400 italic">
            The Larger the Degree of Separation, the Longer the Search. Results are
            not Precached Due to Server Constraints. Thank You for Your Patience.
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-3xl mx-auto backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* First Actor Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={(suggestion) => suggestion}
                  renderSuggestion={renderSuggestion}
                  inputProps={{
                    value: casts1Id,
                    onChange: (e, { newValue }) =>
                      setCasts1Id(capitalizeFirstLetter(newValue)),
                    placeholder: "First Actor",
                    className: "w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  }}
                  theme={{
                    container: "relative",
                    suggestionsContainer: "absolute z-10 w-full mt-1 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm border border-white/10",
                    suggestionsList: "py-1",
                  }}
                />
              </div>
            </div>

            {/* Second Actor Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={(suggestion) => suggestion}
                  renderSuggestion={renderSuggestion}
                  inputProps={{
                    value: casts2Id,
                    onChange: (e, { newValue }) =>
                      setCasts2Id(capitalizeFirstLetter(newValue)),
                    placeholder: "Second Actor",
                    className: "w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500/50 transition duration-200"
                  }}
                  theme={{
                    container: "relative",
                    suggestionsContainer: "absolute z-10 w-full mt-1 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm border border-white/10",
                    suggestionsList: "py-1",
                  }}
                />
              </div>
            </div>

            {/* Find Link Button */}
            <button
              className="px-6 py-3 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg text-white font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              disabled={casts1Id.trim() === "" || casts2Id.trim() === ""}
              onClick={findLink}
            >
              Find Link
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            degreesOfSeparation !== null && (
              <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-teal-400">
                    Degrees of Separation: {degreesOfSeparation}
                  </h2>
                </div>

                <div className="space-y-6">
                  {flowchart.map((node, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {node.name ? (
                        <div className="flex items-center gap-4 group">
                          <Tilt
                            className="parallax-effect-glare-scale"
                            perspective={500}
                            glareEnable={true}
                            glareMaxOpacity={0.45}
                            scale={1.02}
                          >
                            <div className="w-20 h-24 overflow-hidden rounded-lg border-2 border-white/20 group-hover:border-teal-500/50 transition duration-200">
                              <img
                                src={node.profile_path}
                                alt={node.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Tilt>
                          <Link
                            to={`/casts/${node.id}`}
                            className="text-xl font-medium hover:text-teal-400 transition duration-200"
                          >
                            {node.name}
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <p className="text-slate-400 italic">appeared in</p>
                          <Link
                            to={`/movie/${node.id}`}
                            className="text-lg font-medium hover:text-teal-400 transition duration-200"
                          >
                            "{node.title}"
                          </Link>
                          <p className="text-slate-400 italic">alongside</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
