import { WALL } from "./config";
export const initialState = { path: [], found: false };

const coordToString = coords => JSON.stringify(coords);
const stringToCoord = str => JSON.parse(str);

export const findPath = (source, destination, grid, open, closed) => {
  open = open || [];
  closed = closed || [];
  let done = false;

  if (closed.length === 0) {
    // put the starting position on the closed list
    closed.push(coordToString(source));
  }

  // find the available movements from the current position (head of closed)
  const availableMoves = getAvailableMoves(stringToCoord(closed[0]), grid);
  availableMoves.forEach(pos => {
    // if pos is the destination
    // add it to the closed list and be done
    if (pos.x === destination.x && pos.y === destination.y) {
      closed.unshift(coordToString(pos));
      done = true;
    } else if (!closed.includes(coordToString(pos))) {
      // if pos is in the closed list
      // ignore it
      // if pos is not in the open list
      // add it and compute its score
      if (!open.includes(coordToString(pos))) {
        open.push(coordToString(pos));
      }
    }
    // if pos is already in the open list
    // check the f score based on current movement
    // if it is lower than previous score, update its score, and parent? (WTF?)
  });

  if (!done) {
    // score the list of available moves
    const scoredOpenList = score(open, source, destination);
    // find the lowest score
    const lowestF = findLowestF(scoredOpenList);

    // remove the lowest score from the open list
    const lowest = open[lowestF];
    open.splice(lowestF, 1);

    // add it to the head of the closed list
    closed.unshift(lowest);

    // console.log(`Open: ${JSON.stringify(open)}`);
    // console.log(`Closed: ${JSON.stringify(closed)}`);
    return findPath(source, destination, grid, open, closed);
  } else {
    return { path: closed.reverse(), found: true };
  }
};

/**
 * Find the lowest F score in a scored list of positions.
 * @param {*} list
 * return the index of the lowestF scored item in the list
 */
const findLowestF = list => {
  let lowest = 1000;
  let lowestIndex;
  list.forEach((pos, i) => {
    if (pos.g + pos.h < lowest) {
      lowest = pos.g + pos.h;
      lowestIndex = i;
    }
  });
  return lowestIndex;
};

/**
 * Score a list of positions based on A* G+H=F score system
 * see https://www.raywenderlich.com/3016-introduction-to-a-pathfinding for more scoring info.
 * @param {array} list
 * @param {Coordinate} sourcePos
 * @param {Coordinate} destination
 * returns an array of Scored position objects.
 * {position: Coordinate, g: Gscore, h: Hscore}
 */
const score = (list, sourcePos, destination) => {
  return list.map(pos => {
    pos = stringToCoord(pos);
    // calculate (G) - movement cost from start to this tile.
    const gX = Math.abs(pos.x - sourcePos.x);
    const gY = Math.abs(pos.y - sourcePos.y);
    const G = gX + gY;

    // calculate (H) - current square to destination;
    const hX = Math.abs(pos.x - destination.x);
    const hY = Math.abs(pos.y - destination.y);
    const H = hX + hY;

    return { position: pos, g: G, h: H };
  });
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
  if (currentPos.x - 1 >= 0 && grid[coordToString(prevX)] !== WALL) {
    available.push(prevX);
  }

  // check top square
  const prevY = { ...currentPos, y: currentPos.y - 1 };
  if (currentPos.y - 1 >= 0 && grid[coordToString(prevY)] !== WALL) {
    available.push(prevY);
  }

  // check right square
  const nextX = { ...currentPos, x: currentPos.x + 1 };
  if (currentPos.x + 1 < 800 / 16 && grid[coordToString(nextX)] !== WALL) {
    available.push(nextX);
  }

  // check bottom square
  const nextY = { ...currentPos, y: currentPos.y + 1 };
  if (currentPos.y + 1 < 608 / 16 && grid[coordToString(nextY)] !== WALL) {
    available.push(nextY);
  }

  return available;
};
