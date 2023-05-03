import { useState, useEffect } from "react"
import { Question } from "../components/Question"
import { PlayerCard } from "../components/PlayerCard"
import { Timer } from "../components/Timer";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase_setup/firebase";
import { equalTo, get, getDatabase, onValue, orderByChild, orderByKey, query, ref, remove } from "firebase/database";
import {User, Room, Questions} from "../lib/types"
import { useSpring, animated } from '@react-spring/web'

export const Game = () => {
    const [data, setData] = useState();
    const [room, setRoom] = useState<Room>();
    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("05");
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    // const [roomId, setRoomId] = useState("");

    const navigate = useNavigate();

    const location = useLocation();


    //react spring stuff
    const [reverse, setReverse] = useState(false);
    const [springs, api] = useSpring(() => ({     
        from: { x: 250, rotate: 0},
        to: { x: 1050, rotate: 1000},
        loop: true,
        config: {duration: 10000},
      }))
    

    const [springs2, api2] = useSpring(() => ({     
        from: { x: 250, rotate: 1000},
        to: { x: 1050, rotate: 0},
        loop: true,
        config: {duration: 10000},
    }))

    const [springs3, api3] = useSpring(() => ({     
        from: { x: 250, },
        to: { x: 1050, },
        loop: true,
        config: {duration: 10000},
    }))
    //end spring stuff

    useEffect(() => {
        if(!location.state){
          navigate('/')
        }
        const roomId = location.state.roomId;

        const userRef = ref(database, `/rooms/${roomId}/users`);

        onValue(userRef, (snapshot) => {
          const users = snapshot.val();
          const newUserList: User[] = [];
    
          for (let id in users) {
            newUserList.push({ id, ...users[id] });
          };
    
          setUsers(newUserList);
        });
    }, [database]);

    useEffect(() => {
      if(!location.state){
        navigate('/')
      }
      const roomId = location.state.roomId;

      const roomRef = ref(database, `/rooms/${roomId}`)
      onValue(roomRef, (snapshot) => {
        const newRoom: Room = snapshot.val()
        setRoom(newRoom)
      })

    }, [])

    function randNum(min: number, max: number) { // min and max included 
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    useEffect(() => {
      const quest = ref(database, `/questions/${room?.question}`)
      onValue(quest, (snapshot) => {
        if (snapshot.val()) {
          const newQuestion = snapshot.val()
          setQuestion(newQuestion.text);
        }
      })
    }, [room])

    const leaveGame = () => {
      window.localStorage.setItem("token", "");
      
      const leavingUser = ref(database, `/rooms/${location.state.roomId}/users/${location.state.user}`)
      remove(leavingUser)
      navigate('/')
      //Also remove user from game room list in RTDB
    }

    return(
      <main>
        <>
        {room &&
          <>
            <h2 className="center">ROOM CODE: {room.roomCode}</h2>
            <h2 className="center">HOST: {room.host}</h2> 
          </>
        }       
        <Question prompt={question}/>
        <div></div>
        <div>

        <animated.div
        //onClick={handleClick}
        style={{
          width: 100,
          height: 100,
          background: 'red',
          borderRadius: 8,
          ...springs2,
        }}
      >
        </animated.div>
        <animated.div
        //onClick={handleClick}
        style={{
          width: 80,
          height: 80,
          background: 'yellow',
          borderRadius: 8,
          ...springs,
        }}>
        </animated.div>
      <animated.div
        //onClick={handleClick}
        style={{
          width: 50,
          height: 50,
          background: '#66FF99',
          borderRadius: 8,
          ...springs2,
        }}>
      </animated.div>
        </div>
        <br></br>
        
        <input className="margin-center" type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
        <button className="left-center">SUBMIT RESPONSE</button>
        <Timer timer={timer} update={setTimer}/>

        <button className="margin-center">START GAME</button> 
        <br></br>
        <br></br>
        <button className="right-center" onClick={() => {leaveGame()}}>Leave</button>
        </>

        <div className=".player-card-label">
          {users.map((user, index) => {
          return <PlayerCard key={index + user.name} name={user.name} geolocation={user.location}/>
          })}
        </div>


      </main>

    )
}
