import React, { useReducer, useState } from "react";
import Grid, { reducer, initialState, init } from "./Grid";
import * as PathFinder from "./pathfinder";

const App = () => {
  const [grid, dispatch] = useReducer(reducer, initialState, init);
  const [path, setPath] = useState(PathFinder.initialState);
  return (
    <div className="container">
      <header className="m-auto bg-blue-dark text-center">
        <h1 className="text-white tracking-wide font-mono text-5x1 font-bold">
          Pathfinder
        </h1>
      </header>
      <article className="flex flex-row justify-center items-center">
        <Grid grid={grid} dispatch={dispatch} path={path} />
        <div className="border rounded p-5 flex flex-col justify-around items-start ml-5">
          <button
            className="btn btn-blue"
            onClick={() => {
              setPath(prevState => {
                return PathFinder.findPath(
                  grid.source,
                  grid.destination,
                  grid.grid
                );
              });
            }}
          >
            Find Path
          </button>
          <button
            className="btn btn-blue mt-3"
            onClick={() => {
              setPath(PathFinder.initialState);
              dispatch({ type: "RESET" });
            }}
          >
            Reset
          </button>
        </div>
      </article>
    </div>
  );
};

export default App;
