import { WALL } from "./config";
export const initialState = { path: [], found: false };

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

const backTrack = path => {
  const result = [];
  let node = path[0];
  while (node) {
    result.push(JSON.stringify(node.position));
    if (!node.parent) break;
    node = node.parent;
  }
  return { path: result };
};

const distanceToEnd = (pos, destination) => {
  const hX = Math.abs(pos.x - destination.x);
  const hY = Math.abs(pos.y - destination.y);
  return hX + hY;
};

export const findPath = (
  source,
  destination,
  grid,
  open,
  closed,
  openHash,
  closedHash
) => {
  return new Promise((resolve, reject) => {
    open = open || [];
    closed = closed || [];
    openHash = openHash || {};
    closedHash = closedHash || {};
    const startTime = Date.now();

    if (open.length === 0) {
      const distance = distanceToEnd(source, destination);
      const start = {
        position: source,
        g: 0,
        h: distance,
        f: distance,
        parent: null
      };
      open.push(start);
    }

    while (open.length > 0) {
      // remove item from top of open list
      open.sort((a, b) => a.f > b.f);
      const current = open.shift();
      delete openHash[JSON.stringify(current.position)];
      closed.unshift(current);
      closedHash[JSON.stringify(current.position)] = current;

      if (
        current.position.x === destination.x &&
        current.position.y === destination.y
      ) {
        return resolve(backTrack(closed));
      }

      const children = getAvailableMoves(current.position, grid);

      for (let i = 0; i < children.length; i++) {
        if (closedHash[JSON.stringify(children[i])]) {
          continue;
        }

        let node = {};
        node.position = children[i];
        node.g = current.g + 1;
        node.h = distanceToEnd(node.position, destination) ** 2;
        node.f = node.g + node.h;
        node.parent = current;

        const openContains = openHash[JSON.stringify(node.position)];
        if (openContains && openContains.g < node.g) {
          continue;
        }
        open.push(node);
        openHash[JSON.stringify(node.position)] = node;
      }
      if (Date.now() - startTime > 15) {
        break;
      }
    }
    setTimeout(() => {
      resolve(
        findPath(source, destination, grid, open, closed, openHash, closedHash)
      );
    }, 0);
  });
};
