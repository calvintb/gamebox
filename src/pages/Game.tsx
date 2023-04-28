import { useState, useEffect } from "react"
import { Question } from "../components/Question"
import { PlayerCard } from "../components/PlayerCard"
import { Timer } from "../components/Timer";

type User = {
    id: string;
    name: string;
    location: string;
}

export const Game = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");

    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [locationData, setLocationData] = useState(null);

    useEffect(() => {
        const watch = navigator.geolocation.watchPosition((location) => {
          setLat(location.coords.latitude);
          setLon(location.coords.longitude);
          setLocationLoaded(true);
        }, (err) => {
          console.log(err)
        }, {
          enableHighAccuracy: true,
        })
        const fetchAPI = async () => {
            const url = 'https://api-bdc.net/data/reverse-geocode';
            const latitude = lat;
            const longitude = lon;
            const localityLanguage = 'en';
            const apiKey = 'bdc_df38e981116f4f8781389060be80ad53';
      
            const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localityLanguage}&key=${apiKey}`);
      
            if (response.ok) {
              const jsonData = await response.json();
              setLocationData(jsonData);
              console.log(locationData)
            } else {
              console.error(`HTTP error! status: ${response.status}`);
            }
          };
          fetchAPI();

        return () => navigator.geolocation.clearWatch(watch)
      }, []);


    return(
        <main>
            <>        
            <Question prompt={"What food should you not bring to a potluck."}/>
            {users.map(user => {
                <PlayerCard name={user.name} geolocation={user.location}/>
            })}
            <input type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
            <button>SUBMIT RESPONSE</button>
            <Timer timer={timer} update={setTimer}/>
            <button>START GAME</button>
            </>
            
            <div className='player-card-label'>
                <PlayerCard name='namegoeshere' geolocation={String(locationLoaded)}/>
                {/* <PlayerCard name='namegoeshere' geolocation={String(locationData.city)}/>  null error */}
                <PlayerCard name="John Doe" geolocation="New York" />
                My location is: {locationLoaded ? (`Lat: ${lat}, Lon: ${lon}`) : 'Loading...'}
            </div>
            
            <div>
                {locationData && (
                    <div>
                    <p>{locationData.city}, {locationData.principalSubdivision}, {locationData.countryCode}</p> 
                    {/* I need to put a check on the above line of code if a state isnt present  */}
                    {/* And also it is loading null sometimes. I think i need a wait on my fetch or something...? */}
                    </div>
                )}
            </div>

        </main>

    )
}
