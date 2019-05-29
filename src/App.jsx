import React, { useReducer, useState } from "react";
import Grid from "./Grid";
import { reducer, initialState, init } from "./reducer";
import * as PathFinder from "./pathfinder";
import Controls from './Controls';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const [path, setPath] = useState(PathFinder.initialState);
  return (
    <div className="container">
      <header className="m-auto bg-blue-dark text-center">
        <h1 className="text-white tracking-wide font-mono text-5x1 font-bold">
          Pathfinder
        </h1>
      </header>
      <article className="flex flex-row justify-center items-center">
        <Grid state={state} dispatch={dispatch} path={path} />
        <Controls
          reset={() => {
            setPath(PathFinder.initialState);
            dispatch({ type: "RESET" });
          }}
          start={() => PathFinder.find(state, setPath)} />
      </article>
    </div>
  );
};

export default App;
