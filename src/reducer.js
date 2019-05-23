import {
  settings,
  WALL,
  EMPTY,
  SOURCE,
  DESTINATION,
  initialSource,
  initialDestination
} from "./config";
import { makeGrid } from "./Grid";

const actionState = {
  type: "",
  locationType: "",
  position: { x: 0, y: 0 }
};

export const initialState = {
  grid: {},
  source: {},
  destination: {},
  action: {}
};

export const init = () => {
  return {
    grid: makeGrid(settings, initialSource, initialDestination),
    source: initialSource,
    destination: initialDestination,
    action: actionState
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
    action: actionState,
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
          return { ...state, action: actionState };
        default:
          console.error(`Unhandled action ${action.type} ${state.action.type}`);
          return state;
      }

    default:
      console.error(`Unhandled action ${action.type}`);
      return state;
  }
};
