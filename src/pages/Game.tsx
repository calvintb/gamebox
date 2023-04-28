import { Question } from "../components/Question"
// import { PlayerCard } from "../components/player_card"
import { Timer } from "../components/Timer";
import { Children, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");
    const [user, setMyUser] = useState<gameUser>()

    const navigate = useNavigate();

    useEffect(() => {
        const todoRef = ref(database, `/rooms/-NTy9iXrTbiAlnOMgmp1/users`);
        
        onValue(todoRef, (snapshot) => {
          const todos = snapshot.val();
          const newTodoList: Todo[] = [];
    
          for (let id in todos) {
            newTodoList.push({ id, ...todos[id] });
          };
    
          setTodoList(newTodoList);
        });
      }, [db]);
    
    

    useEffect(() => {
        const userRef = ref(database, `/rooms/-NTy9iXrTbiAlnOMgmp1/users`);
        const userQuery = query(userRef, orderByChild('username'));
        console.log(userRef)
        const listener = onValue(userQuery, (snapshot) => {
            setData(snapshot.val())
        });
        
        return () => {
          listener(); // Clean up the listener when the component unmounts
        };
      }, []);

    
    function connect () {
        if(data) {
            const keys = Object.keys(data)
            for (var k in keys) {
                console.log(k)
            }
        }    
    }

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
            <button onClick={() => connect()}>START GAME</button>
            <div>
                <h1>USERS</h1>
                {users.map((user, index) => {
                    return <p key={index}>HI</p>;
                })}
            </div>
        </>
    
    )
}