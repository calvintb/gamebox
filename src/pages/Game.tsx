import { useState, useEffect } from "react"
import { Question } from "../components/Question"
import { PlayerCard } from "../components/PlayerCard"
import { Timer } from "../components/Timer";
import { auth, createAccount, database } from "../firebase_setup/firebase";
import { equalTo, get, onValue, orderByChild, orderByKey, push, query, ref, remove, update, serverTimestamp } from "firebase/database";
import { ResponseCard } from "../components/ResponseCard";
import { useLocation, useNavigate } from "react-router-dom";
import {User, Room, Questions} from "../lib/types"
import { useSpring, animated } from '@react-spring/web'

export const Game = () => {
    const [data, setData] = useState();
    const [room, setRoom] = useState<Room>();
    const [users, setUsers] = useState<User[]>([]);
    const [timer, setTimer] = useState("00");
    const [response, setResponse] = useState("");
    const [question, setQuestion] = useState("");
    const [responses, setResponses] = useState<string[]>([]);
    const [voted, setVoted] = useState(false)
    let interval:NodeJS.Timer;
    
    const navigate = useNavigate();
    const location = useLocation();
    let hasStarted = false;
    let showResponses = false;
    const hasStartRef = ref(database, `/rooms/${location.state.roomId}`);
    onValue(hasStartRef, (snapshot)=>{
        hasStarted = snapshot.val().hasStarted
        showResponses = snapshot.val().showResponses
    })
    const setHasStarted = (val:boolean) =>{
        update(hasStartRef, {
            hasStarted: val,
            });
    }
    const setShowResponses = (val:boolean) =>{
        update(hasStartRef, {
            showResponses: val,
            });
    }
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
    
    const nextQuestion = () => {
        const roomId = location.state.roomId;
        const refe = ref(database, `/rooms/${roomId}`);
        let question_index = 0      
        onValue(refe, (snapshot)=>{
            question_index = snapshot.val().question;

        })
        question_index = question_index % 21;
        update(refe, {
            seconds:30,
            question: question_index+1,
            startAt: serverTimestamp()
        })
        setShowResponses(false);
        const quest = ref(database, `/questions/${room?.question}`)
      onValue(quest, (snapshot) => {
        if (snapshot.val()) {
          const newQuestion = snapshot.val()
          setQuestion(newQuestion.text);
        }
      })
        startTimer()

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

    useEffect(()=>{
        const roomId = location.state.roomId;
        const refe = ref(database, `/rooms/${roomId}`);
        let timerHasStarted:boolean = false;
        onValue(refe, (snapshot) => {
            console.log(snapshot)
            timerHasStarted = snapshot.val().seconds != 0
            startTimer();
                    
          })
    }, []);

    
    const startTimer = ()=>{
        const serverTimeOffset = serverTimestamp();
        const roomId = location.state.roomId;
        const timeRef = ref(database, `/rooms/${roomId}`)
        
        onValue(timeRef, (snapshot) => {
        const seconds = snapshot.val().seconds;
        const startAt = snapshot.val().startAt;
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => {
            const timeLeft = (seconds * 1000) - (Date.now() - startAt);
            if (timeLeft < 0) {
                clearInterval(interval);
                console.log("0.0 left") ;
            if (hasStarted){
                setShowResponses(true);
            }
            else if (!hasStarted){
                setHasStarted(true);
            }
            }
            else {
                setTimer(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`);
                console.log(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`);
            }
        }, 71);
        });
    }
    

    const leaveGame = () => {
      window.localStorage.setItem("token", "");
      
      const leavingUser = ref(database, `/rooms/${location.state.roomId}/users/${location.state.user}`)
      remove(leavingUser)
      navigate('/')
    }

    const givePlayerPoint = (player:User) => {
      console.log(player.name + " got a point!")
      
      const userRef = ref(database, `/rooms/${location.state.roomId}/users/${player.name}`)
      update(userRef, {
        points: player.points + 1
      })

      setVoted(true)

    }

    const checkWinner = () => {
      const winner = users.reduce((prev, current) => (prev.points > current.points) ? prev : current)    
      console.log(winner)
    }

    function postResponse () { 
        if(response) {
            const userRef = ref(database, `/rooms/${location.state.roomId}/users/${location.state.user}`);
            const user = {
                response: response
            };
            update(userRef, user); 
            
        }  
        setVoted(false)           
    };

    if (!hasStarted && !showResponses){
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
        
        <input className="margin-center" type="text" value={response} onChange={(e)=> {setVoted(false); setResponse(e.target.value)}}/>
        <button className="left-center">SUBMIT RESPONSE</button>
        <button className="margin-center" onClick={()=>setHasStarted(true)}>START GAME</button> 
        <br></br>
        <br></br>
        <button className="right-center" onClick={() => {leaveGame()}}>Leave</button>
        </>
        <h1>{timer}</h1>


        <div className=".player-card-label">
          {users.map((user, index) => {
          return <PlayerCard key={index + user.name} name={user.name} geolocation={user.location} points={user.points}/>
          })}
        </div>


            </main>

    )}
    else if (!showResponses){
        return (
            <main>
                <>
                {room &&
                <>
                    <h1>ROOM CODE: {room.roomCode}</h1>
                    <h2>HOST: {room.host}</h2> 
                </>
                }       
                <Question prompt={question}/>
                
                <input type="text" value={response} onChange={(e)=>setResponse(e.target.value)}/>
                <button onClick={()=>{postResponse(); setResponse("")}}>SUBMIT RESPONSE</button>
                <h1>{timer}</h1>
                <button onClick={() => {leaveGame()}}>Leave</button>
                </>
                
        
                <div className=".player-card-label">
                
                </div>
            </main>
                )
    }
    else{
        return(
            <main>
                <>
                {room &&
                <>
                    <h1>ROOM CODE: {room.roomCode}</h1>
                    <h2>HOST: {room.host}</h2> 
                </>
                }       
                <Question prompt={question}/>
                
                <button onClick={()=> {nextQuestion(); }}>Next Question</button> <button onClick={() => {leaveGame()}}>Leave</button>
                </>
                
                <div>
                  {users.map((user, index) => {
                    return (
                      <div key={index + user.id}>
                        {user.response && 
                          <div>
                            <p>{user.response}</p>
                            {!voted &&
                              <button onClick={(e) => {givePlayerPoint(user)}}>Vote</button>
                            }
                            
                          </div>
                        }
                    
                      </div>
                    )
                  })}
                  {/* <button onClick={() => {checkWinner()}}>Check Winner</button> */}

                  <div className=".player-card-label">
                  {users.map((user, index) => {
                    return <PlayerCard key={index + user.name} name={user.name} geolocation={user.location} points={user.points}/>
                  })}
                </div>
              </div>
                      

            </main>
        );
    }
}



