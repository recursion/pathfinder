import React from "react";
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

export const initialState = {
  grid: {},
  source: {},
  destination: {},
  action: {
    type: "",
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

export const init = () => {
  return {
    grid: makeGrid(settings, initialSource, initialDestination),
    source: initialSource,
    destination: initialDestination,
    action: initialState.action
  };
};

const movePiece = (state, action) => {
  const coords = JSON.stringify(action.coords);
  // dont allow replacing source with destination or vice-versa
  if (
    (state.action.locationType === DESTINATION &&
      state.grid[coords] === SOURCE) ||
    (state.action.locationType === SOURCE && state.grid[coords] === DESTINATION)
  ) {
    return state;
  }
  const nextGrid = {
    ...state.grid,
    [state.action.position]: EMPTY,
    [coords]: state.action.locationType
  };
  return {
    ...state,
    grid: nextGrid,
    action: initialState.action,
    source: state.action.locationType === SOURCE ? action.coords : state.source,
    destination:
      state.action.locationType === DESTINATION
        ? action.coords
        : state.destination
  };
};

const paint = (state, action) => {
  const coords = JSON.stringify(action.coords);
  const paintType = action.locationType === WALL ? EMPTY : WALL;
  return {
    ...state,
    grid: {
      ...state.grid,
      [coords]: paintType
    },
    action: {
      type:
        action.locationType === SOURCE || action.locationType === DESTINATION
          ? "MOVE"
          : `PAINT_${paintType}`,
      locationType: action.locationType,
      position: coords
    }
  };
};

export const reducer = (state, action) => {
  const coords = JSON.stringify(action.coords || "");
  switch (action.type) {
    case "RESET":
      return init();

    case "ADD_PATH":
      const nextPath = [...state.path];
      nextPath.push(action.coords);
      return { ...state, path: nextPath };

    case "START_PAINT":
      switch (state.action.type) {
        case "MOVE":
          return movePiece(state, action);
        case "":
          return paint(state, action);
        default:
          console.error(`Unhandled action ${action.type} ${state.action.type}`);
          return state;
      }

    case "PAINT":
      if (!state.action.type.includes("PAINT")) return state;
      const paintType = state.action.type.includes("WALL") ? "WALL" : "EMPTY";
      switch (action.locationType) {
        case DESTINATION:
        case SOURCE:
          return state;
        case WALL:
        case EMPTY:
          return { ...state, grid: { ...state.grid, [coords]: paintType } };
        default:
          console.error(
            `Unhandled action ${action.type} ${state.action.locationType}`
          );
          return state;
      }

    case "STOP_PAINT":
      switch (state.action.type) {
        case "MOVE":
        case "":
          return state;
        case "PAINT_WALL":
        case "PAINT_EMPTY":
          // stop painting
          return { ...state, action: initialState.action };
        default:
          console.error(`Unhandled action ${action.type} ${state.action.type}`);
          return state;
      }

    default:
      console.error(`Unhandled action ${action.type}`);
      return state;
  }
};

const Grid = ({ grid, dispatch, path }) => {
  return (
    <svg
      width={settings.width}
      height={settings.height}
      fill="black"
      className="mt-10"
    >
      {Object.keys(grid.grid).map(key => {
        const coords = JSON.parse(key);
        let highlight = false;
        let markPath = false;
        if (
          (grid.action.locationType === SOURCE ||
            grid.action.locationType === DESTINATION) &&
          grid.action.position === key
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
            type={grid.grid[key]}
            settings={settings}
            dispatch={dispatch}
            highlight={highlight}
            markPath={markPath}
          />
        );
      })}
    </svg>
  );
};

export default Grid;
