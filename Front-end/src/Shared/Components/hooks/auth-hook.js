import React, {useState, useCallback, useEffect} from "react";
// All Auth Logic is in this Hook.

/* Aux for Clearing Timer in UseEffect */
let logoutTimer;

const useAuth = () => {
    const [token, setToken] = useState(false)
    const [tokenExpiryDate, setTokenExpiryDate] = useState("")
    const [uid, setUserId] = useState("")
    /*
      For each route switch, (It will re-evaluate App.jsx)
      You do not want to re-initiate the function,
      It will reset the Global State
    */
    const logIn = useCallback((uid, token, expiryTime) => {
      setToken(token)
      setUserId(uid)
      /* 
        Current time in Milliseconds + 60 Minutes in Milliseconds
          new Date().getTime() + (1000 * 60 * 60)
          1729488165549
        After altering Date, Convert to Date Stamp
        Expiry Time is Aux for not re-registering during Auto Login (Page Reload).
      */
      const tokenExpiry = expiryTime || new Date(new Date().getTime() + (1000 * 60 * 1))
      setTokenExpiryDate(tokenExpiry)
      localStorage.setItem("userData", JSON.stringify({userId : uid, token : token, tokenExpiry : tokenExpiry.toISOString()}))
    }, [])
    
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("userData"))
      /* What if we do not have user data ? */
      if(userData && userData.token && userData.tokenExpiry > new Date()) {
        logIn(userData.userId, userData.token, userData.tokenExpiry)
      }
    }, [logIn])
  
    
    const logOut = useCallback(() => {
      setToken(null)
      setUserId(null)
      /* 
        Manually logging out will call useEffect, 
        Clear the Timer, Else we will have multiple timers
      */
      setTokenExpiryDate(null)
      localStorage.removeItem("userData")
    },[])
    
    /* 
      Login -> Token, Token Expiry
      LogOut -> Logout Function
    */
    useEffect(() => {
      // Login is completed 
      if(token && setTokenExpiryDate) {
        // Time left in milliseconds 
        const expiryTime = tokenExpiryDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logOut, expiryTime)
      } else {
        clearTimeout(logoutTimer)
      }
    }, [token, logOut, setTokenExpiryDate])

    return [token, logIn, logOut, uid];
};

export default useAuth;
