import React from "react";
import Location from "./Location";
import { settings, EMPTY, SOURCE, DESTINATION } from "./config";

export const makeGrid = (settings, source, destination) => {
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

const Grid = ({ state, dispatch, path }) => {
  return (
    <>
      <svg
        width={settings.width}
        height={settings.height}
        fill="black"
        className="mt-10"
      >
        {Object.keys(state.grid).map(key => {
          const coords = JSON.parse(key);
          let highlight = false;
          let markPath = false;
          if (
            (state.action.locationType === SOURCE ||
              state.action.locationType === DESTINATION) &&
            state.action.position === key
          ) {
            highlight = true;
          }
          if (path.path.includes(key)) {
            markPath = true;
          }
          return (
            <Location
              key={key}
              coords={coords}
              type={state.grid[key]}
              settings={settings}
              dispatch={dispatch}
              highlight={highlight}
              markPath={markPath}
            />
          );
        })}
      </svg>
      {path.unreachable &&
        <div className="shifted sans tracking-wide fixed text-lg bg-grey-transparent rounded p-8 mr-40 border border-black">
          Unreachable
      </div>
      }
    </>
  );
};

export default Grid;
