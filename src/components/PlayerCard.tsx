
// ALL THIS BELOW IS FROM 'FirstReactApp' FormInput component

import { ReactNode } from "react";

interface PlayerCardProps {
  name: string;
  geolocation: string;
}

const name = 'name goes here'

export const PlayerCard = ({name, geolocation}: PlayerCardProps) => {
  return (
    <div>
      <div className="player-card-title">
        <label className="player-card-label">
          PLAYER CARD
        </label>
      </div>
      <div className="player-card-main">
        Name: {name}
      </div>
      <div className="player-card-main"> 
        Location: {geolocation}
      </div>
    </div>
  );
}









