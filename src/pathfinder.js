import { WALL } from "./config";
export const initialState = { path: [], found: false, unreachable: false, working: false };

export const find = ({ source, destination, grid }, setPath, pathfinder) => {
  const startTime = Date.now();
  let pause = false;
  let closed = {};

  pathfinder =
    pathfinder ||
    findPath(source, destination, grid);

  while (!closed.done) {
    closed = pathfinder.next();
    if (!closed.value) return;
    setPath(closed.value);
    if (Date.now() - startTime > 15) {
      pause = true;
      break;
    }
  }

  if (pause) {
    setTimeout(() => {
      find({ source, destination, grid }, setPath, pathfinder);
    }, 0);
  } else {
    setPath(closed.value);
  }
};
/**
 * Given a position, check the 4 squares (up, down, left, right)
 * to see if they are valid moves
 * @param {Coordinate} currentPos
 * @param {Grid} grid
 * return an array of open moves
 */
const getAvailableMoves = (currentPos, grid) => {
  const available = [];

  // check left square
  const prevX = { ...currentPos, x: currentPos.x - 1 };
  if (currentPos.x - 1 >= 0 && grid[JSON.stringify(prevX)] !== WALL) {
    available.unshift(prevX);
  }

  // check top square
  const prevY = { ...currentPos, y: currentPos.y - 1 };
  if (currentPos.y - 1 >= 0 && grid[JSON.stringify(prevY)] !== WALL) {
    available.unshift(prevY);
  }

  // check right square
  const nextX = { ...currentPos, x: currentPos.x + 1 };
  if (currentPos.x + 1 < 800 / 16 && grid[JSON.stringify(nextX)] !== WALL) {
    available.unshift(nextX);
  }

  // check bottom square
  const nextY = { ...currentPos, y: currentPos.y + 1 };
  if (currentPos.y + 1 < 608 / 16 && grid[JSON.stringify(nextY)] !== WALL) {
    available.unshift(nextY);
  }

  return available;
};

const backTrack = (path, found, unreachable) => {
  const result = [];
  let node = path[0];
  while (node.parent) {
    result.push(JSON.stringify(node.position));
    node = node.parent;
  }
  return { path: result, found, unreachable };
};

const distanceToEnd = (pos, destination) => {
  const hX = Math.abs(pos.x - destination.x);
  const hY = Math.abs(pos.y - destination.y);
  return hX + hY;
};

function* findPath(source, destination, grid) {
  let open = [];
  const closed = [];
  const openHash = {};
  const closedHash = {};

  if (open.length === 0) {
    const distance = distanceToEnd(source, destination);
    const start = {
      position: source,
      g: 0,
      h: distance,
      f: 0,
      parent: null
    };
    open.push(start);
  }

  while (open.length > 0) {
    // sort the open list by f score
    open.sort((a, b) => a.f - b.f);

    // remove item from top of open list
    const current = open.shift();
    delete openHash[JSON.stringify(current.position)];

    // add to closed list
    closed.unshift(current);
    closedHash[JSON.stringify(current.position)] = current;

    // destination check
    if (
      current.position.x === destination.x &&
      current.position.y === destination.y
    ) {
      return backTrack(closed, true);
    }

    const neighbors = getAvailableMoves(current.position, grid);

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (closedHash[JSON.stringify(neighbor)]) {
        continue;
      }

      let node = Node(neighbor, current, destination);

      const existsInOpenList = openHash[JSON.stringify(node.position)];
      if (!existsInOpenList) {
        open.push(node);
        openHash[JSON.stringify(node.position)] = node;
      } else if (existsInOpenList.g > node.g) {
        // update existing item with current node data
        openHash[JSON.stringify(node.position)] = node;
        open = open.map(loc => {
          if (
            loc.position.x === node.position.x &&
            loc.position.y === node.position.y
          ) {
            return node;
          }
          return loc;
        });
      }
    }
    yield backTrack(closed);
  }
  return { path: [], found: false, unreachable: true };
}

const Node = (position, parent, destination) => {
  const node = {};
  node.position = position;
  node.g = parent.g + 1;
  node.h = distanceToEnd(position, destination) ** 2;
  node.f = node.g + node.h;
  node.parent = parent;
  return node;
};
