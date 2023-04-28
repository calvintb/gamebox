import { Question } from "../components/Question"
// import { PlayerCard } from "../components/player_card"
import { Timer } from "../components/Timer";
import { Children, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase_setup/firebase";
import { get, getDatabase, onValue, orderByChild, query, ref } from "firebase/database";

type User = {
    id: string;
    name: string;
    location: string;
}

type gameUser = {
    username: string,
    id: string
}

export const Game = () => {
    const [data, setData] = useState();
    const [users, setUsers] = useState<gameUser[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");
    const [user, setMyUser] = useState<gameUser>()

    const navigate = useNavigate();

    const {state} = useLocation();
    const roomId = state.roomId;

    useEffect(() => {
        const userRef = ref(database, `/rooms/${roomId}/users`);
        
        onValue(userRef, (snapshot) => {
          const users = snapshot.val();
          const newUserList: gameUser[] = [];
    
          for (let id in users) {
            newUserList.push({ id, ...users[id] });
          };
          console.log(newUserList)
    
          setUsers(newUserList);
        });
      }, [database]);


    return (
        <>        
            <h1>
                This is the Game Page
            </h1>
            <Question prompt={"What food should you not bring to a potluck."}/>
            {/* {users.map(user => {
                <PlayerCard name={user.name} geolocation={user.location}/>
            })} */}
            <input type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
            <button>SUBMIT RESPONSE</button>
            <Timer timer={timer} update={setTimer}/>
            <button onClick={() => {}}>START GAME</button>
            <div>
                <h1>USERS</h1>
                {users.map((user, index) => {
                    return <p key={index}>{user.username}</p>;
                })}
            </div>
        </>
    
    )
}