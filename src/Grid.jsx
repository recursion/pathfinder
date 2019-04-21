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
  setting: {
    type: "",
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
    setting: initialState.setting
  };
};

const trace = o => {
  console.log(o);
  return o;
};

const reducer = (state, action) => {
  const coords = JSON.stringify(action.coords);
  switch (action.type) {
    case "CHANGE_LOCATION":
      // we have already started a source or destination change
      if (state.setting.type !== "") {
        // dont allow replacing source with destination or vice-versa
        if (
          state.setting.type === DESTINATION &&
          state.grid[coords] === SOURCE
        ) {
          return state;
        }
        if (
          state.setting.type === SOURCE &&
          state.grid[coords] === DESTINATION
        ) {
          return state;
        }
        const nextGrid = {
          ...state.grid,
          [state.setting.position]: EMPTY,
          [coords]: state.setting.type
        };
        return {
          ...state,
          grid: nextGrid,
          setting: initialState.setting
        };
      } else {
        // no current action in progress
        switch (action.locationType) {
          case EMPTY:
            // change empty locations to walls
            return {
              ...state,
              grid: {
                ...state.grid,
                [coords]: WALL
              }
            };
          case WALL:
            // change walls to empty locations
            return {
              ...state,
              grid: {
                ...state.grid,
                [coords]: EMPTY
              }
            };

          default:
            // otherwise we are initiating a new source/destination change
            return {
              ...state,
              setting: {
                type: action.locationType,
                position: JSON.stringify(action.coords)
              }
            };
        }
      }
    default:
      console.error(`Unhandled action type: ${action.type}`);
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
          state.setting.locationType !== "" &&
          state.setting.position === key
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
