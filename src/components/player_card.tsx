import { Link, useNavigate } from "react-router-dom"
import '../index.css'

export const Navbar = () => {
    const navigate = useNavigate()

    const logOut = () => {
        window.localStorage.removeItem("token");
        navigate("/", {
            replace: true
        })
    }

    return (
        <div className="navbar">
            <button onClick={() => {navigate("/dashboard", {replace: true})}}> DASHBOARD </button>
            <button onClick={logOut}> LOGOUT </button>
        </div>
    )
}

//Ignore all this code. Just getting something in here