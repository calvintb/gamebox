import { useEffect, useState } from "react"
import { auth, createAccount, database } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import { equalTo, get, onValue, orderByChild, orderByKey, push, query, ref } from "firebase/database";

type gameUser = {
    username: string,
    id: string
  }


export const SignUp = () => {
    const [data, setData] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
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
    

    //   where we would include geolocation as well
    function addUser () { 
        if(data) {
            const keys = Object.keys(data)
            const userRef = ref(database, `/rooms/${keys[0]}/users`);
            const user = {
                username,
                id: auth.currentUser?.uid
            };
            push(userRef, user); 
            navigate('/game')      
        }    
               
    };
       

    useEffect(()=>{
        if (authenticated) {
            console.log("Authenticated")
            addUser()
        }
    }, [authenticated]);

    useEffect(()=>{
        const authObserver = auth.onAuthStateChanged((user) => {
            if (user && !authenticated && username) {
                setAuthenticated(true)
            }
        })
    }, []);

        return(
        <div>
            This is the Sign Up Page
            <form onSubmit={(e)=>{e.preventDefault(); createAccount(email, password, username);}}>
                <input value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}