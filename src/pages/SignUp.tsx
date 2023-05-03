import { useEffect, useState } from "react"
import { auth, createAccount, createAnonymousAccount, database } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import { DataSnapshot, equalTo, get, onValue, orderByChild, orderByKey, push, query, ref, set } from "firebase/database";
import { Location, User } from "../lib/types";
import "../index.css"
import { useSpring, animated, SpringValue } from '@react-spring/web'
import { getAuth, verifyBeforeUpdateEmail } from "firebase/auth";


export const SignUp = () => {
    const [data, setData] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [nameTaken, setNameTaken] = useState(false);
    const [createdUser, setCreatedUser] = useState(false);
    const [error, setError] = useState("");
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const [locationData, setLocationData] = useState<Location>();

    const [click, setClick] = useState(false);
    const [id, setId] = useState("");
    const [alreadyIn, setAlreadyIn] = useState(false);


    const [authenticated, setAuthenticated] = useState(false)
    const navigate = useNavigate();

    
    useEffect(() => {
        const roomRef = ref(database, 'rooms/');
        const roomQuery = query(roomRef, orderByChild('roomCode'), equalTo(password));
        
        const listener = onValue(roomQuery, (snapshot) => {
            setError("")
            if (snapshot.val()){
                const keys = Object.keys(snapshot.val())
                setRoomId(keys[0])
            }
            
            setData(snapshot.val());
        });
        
        return () => {
          listener(); // Clean up the listener when the component unmounts
        };
      }, [password]);


    useEffect(() => {
        const roomRef = ref(database, `rooms/${roomId}/users`);
        const roomQuery = query(roomRef, orderByChild('name'), equalTo(username));
        
        const listener = onValue(roomQuery, (snapshot) => {
            if(!snapshot.val()) {
                setNameTaken(false)
            }else {
                setNameTaken(true)
            }
        });
        
        return () => {
            listener(); // Clean up the listener when the component unmounts
        };
    }, [roomId, username]);


    const addUser = async () => { 
        if (!data) {
            setError("No Room Found!")
            return
        }
        if (nameTaken) {
            setError("Username Already In Use!")
            return
        }

        if (!username) {
            setError("Please Enter a Username!")
            return
        }

        if(data && locationData && roomId && !nameTaken) {
            console.log(locationData.city)
            setCreatedUser(true)
            set(ref(database, `/rooms/${roomId}/users/` + username), {
                name: username,
                id: auth.currentUser?.uid,
                location: `${locationData.city}, ${locationData.principalSubdivision} ${locationData.countryCode}`,
                response: "" 
            });
            
        }    
        return       
    };

    const loginUserAgain = () => {
        const userRef = ref(database, `/rooms/${roomId}/users`)
        const userQuery = query(userRef, orderByKey(), equalTo(username))
        
        onValue(userQuery, (snapshot) => {
            if(snapshot.val()){
                navigate('/game', {state: {roomId: roomId, user: username}})
            }else {
                setError("Not a valid room")
            }
        })
    }


    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            setAlreadyIn(true)
        }


        const watch = navigator.geolocation.watchPosition((location) => {
            setLat(location.coords.latitude);
            setLon(location.coords.longitude);
            setLocationLoaded(true);
        }, (err) => {
          console.log(err)
          const tempLocation: Location = {
            city: "Somewhere",
            principalSubdivision: "Planet Earth",
            countryCode: ":)"
          }
          setLocationData(tempLocation)
        }, {
          enableHighAccuracy: true,
        })


        const authObserver = auth.onAuthStateChanged((user) => {
          if (user) {
            setAuthenticated(true);
            setId(user.uid)
          } else {
            setAuthenticated(false);
            setId("")
          }
        });
      
        return () => {
          authObserver(); // unsubscribe the observer when the component unmounts
          navigator.geolocation.clearWatch(watch);
        };
      }, []);


    useEffect(() => {
        if(createdUser) {
            console.log(roomId)

            navigate('/game', {state: {roomId: roomId, user: username}})
        }
        return
    }, [createdUser])


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

    useEffect(() => {
        const watch = navigator.geolocation.watchPosition((location) => {
            setLat(location.coords.latitude);
            setLon(location.coords.longitude);
            setLocationLoaded(true);
        }, (err) => {
          console.log(err)
          const tempLocation: Location = {
            city: "Game",
            principalSubdivision: "Box",
            countryCode: "Location"
          }
          setLocationData(tempLocation)
        }, {
          enableHighAccuracy: true,
        })

        return () => navigator.geolocation.clearWatch(watch)
      }, []);

    const [springs, api] = useSpring(() => ({     
        from: { x: 700 },
    }))

    function isClicked() {
        if(click){
            return 1200;
        }else {
            return 100;   
        }
    }

    const handleClick = () => {
        setClick(!click);
        api.start({
            from: {
              x: springs.x,
            },
            to: {
              x: isClicked(),
            },
        })
    }
    
        return(
        <div>
            <h1>Join Room</h1>
            {!alreadyIn &&
                <>
                <p>This is the Sign Up Page</p>
                <form onSubmit={(e)=>{e.preventDefault(); addUser(); createAnonymousAccount();}}>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <input value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <button onClick={() => {}}type="submit">Join</button>
                    <p>{error}</p>
                </form>
                <div className="container">
                  <h2>Room Code</h2>
                  <h2>Username</h2>
                </div>
                </>
            }

            {alreadyIn &&
                <>
                <h2>Got kicked out? No worries! Just enter the room code & your username again below:</h2>
                 <form onSubmit={(e)=>{e.preventDefault(); loginUserAgain();}}>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <input value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <button onClick={() => {}}type="submit">Join</button>
                    <p>{error}</p>
                </form>
                <button onClick={() => {window.localStorage.setItem("token", ""); navigate('/')}}>Sign into a different room</button>
                <animated.button style={{...springs}} onClick={handleClick}>Click me</animated.button>
                </>
             
            }

        </div>
    )
}