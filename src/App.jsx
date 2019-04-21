import React, { Component } from "react";
import Grid from "./Grid";

class App extends Component {
  render() {
    return (
      <div className="container">
        <header className="m-auto bg-blue-dark text-center">
          <h1 className="text-white tracking-wide font-mono text-5x1 font-bold">
            Pathfinder
          </h1>
        </header>
        <article className="flex flex-col justify-center items-center">
          <Grid />
        </article>
      </div>
    );
  }
}

export default App;
