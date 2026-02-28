import { Link } from "react-router-dom"
import { useUserContext } from "../contexts/UserContext"
import "../CSS/navbar.css"

const NavBar=()=>{
    const { logout } = useUserContext()

    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/" >Movie App</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="nav-logout-btn" onClick={logout}>Logout</button>
        </div>
    </nav>
}

export default NavBar;