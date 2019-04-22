import { WALL, DESTINATION } from "./config";
export const initialState = { path: [], found: false };

export const findPath = (path, grid) => {
  // if we have an existing path, start there
  let start, xDir, yDir;
  if (path.path.length === 0) {
    start = grid.source;
  } else {
    // otherwise start with current source location
    start = JSON.parse(path.path[0]);
  }
  // determine x direction
  if (start.x - grid.destination.x < 0) {
    xDir = 1;
  } else if (start.x - grid.destination.x > 0) {
    xDir = -1;
  } else {
    xDir = 0;
  }

  // determine y direction
  if (start.y - grid.destination.y < 0) {
    yDir = 1;
  } else if (start.y - grid.destination.y > 0) {
    yDir = -1;
  } else {
    yDir = 0;
  }

  const coords = { x: start.x + xDir, y: start.y + yDir };
  const nextCoords = JSON.stringify(coords);
  // if next location is blocked
  if (grid.grid[nextCoords] === WALL) {
    // look for another location
    console.log("BLOCKED");
    return path;
  } else if (grid.grid[nextCoords] === DESTINATION) {
    return { ...path, found: true };
  } else {
    // add to path
    const nextPath = [...path.path];
    nextPath.unshift(nextCoords);
    return { ...path, path: nextPath };
  }
};
