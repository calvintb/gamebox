import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    function createGame(){

    }

    return(
        <div>
            <button onClick={() => createGame()}>Host Game</button>
            <button onClick={() => navigate('/signUp')}>Join Game</button>
        </div>
    )
}