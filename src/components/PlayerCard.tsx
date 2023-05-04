interface PlayerCardProps {
  name: string;
  geolocation: string;
  points: number;
}

const name = 'name goes here'

export const PlayerCard = ({name, geolocation, points}: PlayerCardProps) => {
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
      <div className="player-card-main">
        Points: {points}
      </div>
    </div>
  );
}









