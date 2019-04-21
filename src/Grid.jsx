import React, { useState } from "react";
import Location from "./Location";
import {
  settings,
  EMPTY,
  SOURCE,
  DESTINATION,
  initialSource,
  initialDestination
} from "./config";

const makeGrid = (settings, source, destination) => {
  let grid = {};
  for (let x = 0; x < settings.width / settings.tileSize; x++) {
    for (let y = 0; y < settings.height / settings.tileSize; y++) {
      let type = EMPTY;
      if (x === source.x && y === source.y) {
        type = SOURCE;
      } else if (x === destination.x && y === destination.y) {
        type = DESTINATION;
      }
      grid[JSON.stringify({ x, y })] = type;
    }
  }
  return grid;
};

const Grid = () => {
  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [grid, setGrid] = useState(() =>
    makeGrid(settings, source, destination)
  );

  return (
    <svg width={800} height={608} fill="black" className="mt-10">
      {Object.keys(grid).map(key => {
        const coords = JSON.parse(key);
        return (
          <Location
            key={key}
            coords={coords}
            type={grid[key]}
            settings={settings}
          />
        );
      })}
    </svg>
  );
};

export default Grid;
