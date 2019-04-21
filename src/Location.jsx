import React from "react";
import { colors } from "./config";

const Location = ({ coords, type, settings, dispatch }) => {
  return (
    <rect
      x={coords.x * settings.tileSize}
      y={coords.y * settings.tileSize}
      width={settings.tileSize}
      height={settings.tileSize}
      fill={colors[type]}
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
