import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase_setup/firebase";
import { getDatabase, onValue, ref } from "firebase/database";

type gameUser = {
    username: string,
    id: string
  }

export const Game = () => {
    const [userList, setUserList] = useState<gameUser[]>([])
    const [user, setMyUser] = useState<gameUser>()

    const navigate = useNavigate();
    
    useEffect(() => {
        const userRef = ref(database, "/users");
        
        onValue(userRef, (snapshot) => {
          const users = snapshot.val();
          const newUserList: gameUser[] = [];
    
          for (let id in users) {
            newUserList.push({ id, ...users[id] });
          };
    
          setUserList(newUserList);
          console.log(newUserList)
        });
      }, [database]);

    return (
    <div>
        <h1>USERS</h1>
        {userList.map((user, index) => {
        return <p key={index}>{user.username}</p>;
        })}
    </div>
    )
}