import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDegreesOfSeparation } from "../store/degreesOfSeperation";

const DegreesOfSeparation = () => {
  const dispatch = useDispatch();
  const [casts1Id, setCasts1Id] = useState(null);
  const [casts2Id, setCasts2Id] = useState(null);
  const degreesOfSeparation = useSelector((state) => state.degreesOfSeparation);

  useEffect(() => {
    if (casts1Id && casts2Id) {
      dispatch(fetchDegreesOfSeparation(casts1Id, casts2Id));
    }
  }, [casts1Id, casts2Id, dispatch]);

  return (
    <div>
      <h1>Degrees of Separation</h1>
      <div>
        <label>Select Actor 1:</label>
        <select onChange={(e) => setCasts1Id(e.target.value)}>
          {/* Populate options with casts (actor) list */}
        </select>
      </div>
      <div>
        <label>Select Actor 2:</label>
        <select onChange={(e) => setCasts2Id(e.target.value)}>
          {/* Populate options with casts (actor) list */}
        </select>
      </div>
      <div>
        {degreesOfSeparation.map((degree, index) => (
          <div key={index}>
            <Link to={`/casts/${degree.casts.id}`}>
              <h2>{degree.actor.name}</h2>
            </Link>
            <p>Appeared in</p>
            <Link to={`/movies/${degree.movie.id}`}>
              <h3>{degree.movie.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DegreesOfSeparation;