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
      onClick={() => {
        dispatch({
          type: "CHANGE_LOCATION",
          locationType: type,
          coords: coords
        });
      }}
    />
  );
};

export default Location;
