import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout, fetchSomeActors, clearSomeActors } from "../store";
import { SearchIcon, Star } from "lucide-react";
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
      <div className="p-2 hover:bg-gray-100 cursor-pointer">{suggestion}</div>
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
    <div className="text-white">
      <div className="flex flex-wrap justify-center">
        <Star />
        <div className="ml-3 mr-3 mb-4 text-3xl font-bold">
          Welcome {auth.username} to Reel Relations!!
        </div>
        <Star />
      </div>

      <p className="my-6 mx-20 flex flex-wrap justify-center items-center">
        Discover the Enchanting World of Hollywood & Cinema From Across the
        Globe & Uncover Why It's All About Who You Know
      </p>

      <div className="flex flex-wrap justify-center sm:items-center flex-col lg:flex-row">
        <div className="flex justify-center relative">
          <div
            className="rounded-l-md btn btn-square join-item px-2 py-2 bg-slate-500"
            disabled
          >
            <SearchIcon
              size={24}
              className="text-black border-none rounded-md bg-transparent"
            />
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
              placeholder: "Enter 1st Actor",
              className:
                "join-item flex items-center border-2 border-lime-400 border-secondary text-2xl font-bold normal-case hover:bg-slate-600",
            }}
            theme={{
              container: "w-full",
              input:
                "p-2 pl-10 pr-4 rounded-l-md border border-lime-400 text-2xl font-bold normal-case hover:bg-slate-600 focus:outline-none",
              suggestionsContainer:
                "absolute z-10 mt-2 w-full max-w-md rounded-lg shadow-lg", // Set max-width here
              suggestionsList: "bg-black",
            }}
          />
        </div>

        <div className="flex justify-center">
          <div
            className="rounded-l-md btn btn-square join-item px-2 py-2 bg-slate-500"
            disabled
          >
            <SearchIcon
              size={24}
              className="text-black border-none rounded-md bg-transparent"
            />
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
              placeholder: "Enter 2nd Actor",
              className:
                "join-item flex items-center border-2 border-lime-400 border-secondary text-2xl font-bold normal-case hover:bg-slate-600",
            }}
            theme={{
              container: "w-full",
              input:
                "p-2 pl-10 pr-4 rounded-l-md border border-lime-400 text-2xl font-bold normal-case hover:bg-slate-600 focus:outline-none",
              suggestionsContainer:
                "absolute z-10 mt-2 w-full max-w-md rounded-lg shadow-lg", // Set max-width here
              suggestionsList: "bg-black",
            }}
          />
        </div>
        <button
          className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
          disabled={casts1Id.trim() === "" || casts2Id.trim() === ""}
          onClick={findLink}
        >
          Find Link
        </button>
      </div>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            {degreesOfSeparation !== null && (
              <div className="flex flex-wrap font-semibold decoration-solid justify-center text-3xl my-3">
                Degrees of Separation: {degreesOfSeparation}
              </div>
            )}
            <div className="">
              {flowchart.map((node, index) => (
                <div key={index} className="flex flex-wrap justify-center">
                  {node.name ? (
                    /* Actor Image Cards Found After Link is Found */
                    <div className="flex items-center">
                      {/* Link to Tilt guide https://mkosir.github.io/react-parallax-tilt/?path=/story/react-parallax-tilt--default */}
                      <Tilt
                        className="parallax-effect-glare-scale"
                        perspective={500}
                        glareEnable={true}
                        glareMaxOpacity={0.45}
                        scale={1.5}
                      >
                        <img
                          src={node.profile_path}
                          alt={node.name}
                          className="w-[65px] h-[78px] min-w-[65px] min-h-[78px] object-scale-down rounded mr-2 border-white border-2"
                        />
                      </Tilt>
                      <Link
                        to={`/casts/${node.id}`}
                        className="font-semibold text-2xl"
                      >
                        {node.name}
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <p className="flex flex-wrap justify-center my-3 text-md items-center font-normal italic">
                        who was in
                      </p>
                      <Link
                        to={`/movie/${node.id}`}
                        className="font-semibold text-xl"
                      >
                        '{node.title}'
                      </Link>
                      <p className="flex flex-wrap justify-center my-3 text-md items-center font-normal italic">
                        with
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
