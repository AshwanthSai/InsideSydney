import React, { useState } from "react";
import "./MainNavigation.css"
import MainHeader from "./MainHeader";
import { Link } from 'react-router-dom'
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "./Backdrop";



const MainNavigation = () => {
  const[HamBurger, setHamburger] = useState(false)
  
  function openDrawerHandler(){
    setHamburger(true);
  }

  function closeDrawerHandler(){
    setHamburger(false);
  }

  return (
    <React.Fragment>
    {HamBurger &&
     <Backdrop onClick = {closeDrawerHandler}/>}
    {HamBurger &&
     (<SideDrawer show = {HamBurger} onClick = {closeDrawerHandler}>
      <nav className="main-navigation__drawer-nav" >
        <NavLinks/>
      </nav>
    </SideDrawer>)}
    <MainHeader>
        {/* HamBurger Button */}
        <button className="main-navigation__menu-btn" onClick = {openDrawerHandler}>
          <span/>
          <span/>
          <span/>
        </button>
        {/* Banner to Move to Home Page */}
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks/>
        </nav>
    </MainHeader>
    </React.Fragment>
  )
};

export default MainNavigation;
