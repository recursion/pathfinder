import React, { useReducer } from "react";
import Location from "./Location";
import {
  settings,
  WALL,
  EMPTY,
  SOURCE,
  DESTINATION,
  initialSource,
  initialDestination
} from "./config";

const initialState = {
  grid: {},
  action: {
    type: "NONE",
    locationType: "",
    position: { x: 0, y: 0 }
  }
};

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

const init = () => {
  return {
    grid: makeGrid(settings, initialSource, initialDestination),
    action: initialState.action
  };
};

const reducer = (state, action) => {
  const coords = JSON.stringify(action.coords);
  switch (action.type) {
    case "START_PAINT":
      switch (state.action.type) {
        case "MOVE":
          // dont allow replacing source with destination or vice-versa
          if (
            state.action.locationType === DESTINATION &&
            state.grid[coords] === SOURCE
          ) {
            return state;
          }
          if (
            state.action.locationType === SOURCE &&
            state.grid[coords] === DESTINATION
          ) {
            return state;
          }
          const nextGrid = {
            ...state.grid,
            [state.action.position]: EMPTY,
            [coords]: state.action.locationType
          };
          return { ...state, grid: nextGrid, action: initialState.action };
        case "NONE":
          return {
            ...state,
            grid: {
              ...state.grid,
              [coords]: action.locationType === WALL ? EMPTY : WALL
            },
            action: {
              type:
                action.locationType === SOURCE ||
                action.locationType === DESTINATION
                  ? "MOVE"
                  : "PAINT",
              locationType: action.locationType,
              position: coords
            }
          };
        default:
          return state;
      }

    case "PAINT":
      if (state.action.type !== "PAINT") return state;
      switch (action.locationType) {
        case DESTINATION:
        case SOURCE:
          return state;
        case WALL:
          return { ...state, grid: { ...state.grid, [coords]: EMPTY } };
        case EMPTY:
          return { ...state, grid: { ...state.grid, [coords]: WALL } };
        default:
          return state;
      }

    case "STOP_PAINT":
      switch (state.action.type) {
        case "MOVE":
          return state;
        case "PAINT":
          // stop painting
          return { ...state, action: initialState.action };
        default:
          return state;
      }

    default:
      return state;
  }
};

const Grid = () => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  return (
    <svg
      width={settings.width}
      height={settings.height}
      fill="black"
      className="mt-10"
    >
      {Object.keys(state.grid).map(key => {
        const coords = JSON.parse(key);
        let highlight = false;
        if (
          (state.action.locationType === SOURCE ||
            state.action.locationType === DESTINATION) &&
          state.action.position === key
        ) {
          highlight = true;
        }
        return (
          <Location
            key={key}
            coords={coords}
            type={state.grid[key]}
            settings={settings}
            dispatch={dispatch}
            highlight={highlight}
          />
        );
      })}
    </svg>
  );
};

export default Grid;
