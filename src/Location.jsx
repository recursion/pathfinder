import React from "react";
import { colors } from "./config";

const Location = ({ coords, type, settings, highlight, dispatch }) => {
  return (
    <rect
      x={coords.x * settings.tileSize}
      y={coords.y * settings.tileSize}
      width={settings.tileSize}
      height={settings.tileSize}
      fill={highlight ? "lightblue" : colors[type]}
      stroke="grey"
      onMouseDown={() => {
        dispatch({
          type: "START_PAINT",
          locationType: type,
          coords: coords
        });
      }}
      onMouseOver={() => {
        dispatch({
          type: "PAINT",
          locationType: type,
          coords: coords
        });
      }}
      onMouseUp={() => {
        dispatch({
          type: "STOP_PAINT",
          locationType: type,
          coords: coords
        });
      }}
    />
  );
};

export default Location;
