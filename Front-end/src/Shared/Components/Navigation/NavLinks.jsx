import React, { useContext } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import "./NavLinks.css"
import AuthContext from "../../Context/AuthContext";


const NavLinks = (props) => {
  const {isLoggedIn, logOut, userId} = useContext(AuthContext);

  return (
    <ul className = "nav-links">
        <li><NavLink to ="/" exact>ALL Users</NavLink></li>
        {isLoggedIn && <li><NavLink to ={`/${userId}/places`}>My Places</NavLink></li>}
        {/* /places is important, else it will add /places for each click to base URL*/}
        {isLoggedIn &&<li><NavLink to ="/places/new">Add Place</NavLink></li>}
        {!isLoggedIn && <li><NavLink to ="/auth">Authenticate</NavLink></li>}
        {isLoggedIn && <li onClick = {() => logOut()}><NavLink to ="/auth">Log Out</NavLink></li>}
    </ul>
  )
};

export default NavLinks;
