import { useEffect, useState } from "react"
import { auth, createAccount, database } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import { equalTo, get, onValue, orderByChild, orderByKey, push, query, ref } from "firebase/database";
import { Location, User } from "../lib/types";

export const SignUp = () => {
    const [data, setData] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);

    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate();

    
    useEffect(() => {
        const roomRef = ref(database, 'rooms/');
        const roomQuery = query(roomRef, orderByChild('roomCode'), equalTo(password));
        
        const listener = onValue(roomQuery, (snapshot) => {
          setData(snapshot.val());
        });
        
        return () => {
          listener(); // Clean up the listener when the component unmounts
        };
      }, [password]);
    

    //  where we would include geolocation as well
    const addUser = async () => { 
        if(data && locationData) {
            console.log(locationData.city)
            const keys = Object.keys(data)
            setRoomId(keys[0])
            const userRef = ref(database, `/rooms/${keys[0]}/users`);
            const user: User = {
                name: username,
                id: auth.currentUser?.uid ? auth.currentUser?.uid : "null",
                location: `${locationData.city}, ${locationData.principalSubdivision} ${locationData.countryCode}`,
                response: ""
            };
            const blah = await push(userRef, user); 
        }    
        return       
    };

    // useEffect(()=>{
    //     const authObserver = auth.onAuthStateChanged((user) => {
    //         if (user && !authenticated && username) {
    //             setAuthenticated(true)
    //         }
    //     })
    //     return () => {
    //         authObserver();
    //     }
        
    // }, []);

    useEffect(() => {
        if(roomId) {
            navigate('/game', {state: {roomId: roomId}})
        }
        return
    }, [roomId])


    useEffect(() => {
        const fetchAPI = async () => {
            const url = 'https://api-bdc.net/data/reverse-geocode';
            const latitude = lat;
            const longitude = lon;
            const localityLanguage = 'en';
            const apiKey = 'bdc_df38e981116f4f8781389060be80ad53';
      
            const response = await fetch(`${url}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localityLanguage}&key=${apiKey}`);
      
            if (response.ok) {
              const jsonData = await response.json();
              setLocationData(jsonData as Location);
              console.log(jsonData)
            } else {
              console.error(`HTTP error! status: ${response.status}`);
            }
          };

          if( lat && lon) {
            fetchAPI();
          }

        return
    }, [lat, lon])



    const [locationLoaded, setLocationLoaded] = useState(false);
    const [locationData, setLocationData] = useState<Location>();

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

        return () => navigator.geolocation.clearWatch(watch)
      }, []);

      

        return(
        <div>
            This is the Sign Up Page
            <form onSubmit={(e)=>{e.preventDefault(); addUser(); createAccount(email, password, username);}}>
                <input value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <button onClick={() => {}}type="submit">Sign Up</button>
            </form>
            
        </div>
    )
}