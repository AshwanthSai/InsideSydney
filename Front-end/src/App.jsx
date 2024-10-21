import {BrowserRouter, Route, Redirect,Switch} from 'react-router-dom'
import NewPlaces from './Places/Pages/NewPlaces';
import Users from './Users/Pages/Users';
import MainNavigation from './Shared/Components/Navigation/MainNavigation';
import UserPlaces from "./Places/Pages/UserPlaces"
import UpdatePlaces from './Places/Pages/UpdatePlaces';
import Authenticate from './Users/Pages/Authenticate';
import AuthContext from './Shared/Context/AuthContext';
import { useCallback, useEffect, useState } from 'react';


function App() {
  const [token, setToken] = useState(false)
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
    const tokenExpiry = expiryTime || new Date(new Date().getTime() + (1000 * 60 * 60))
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
    localStorage.removeItem("userData")
  })
  
  let routes;
  /* 
    Protecting Routes in Front End
   */
  if (token) {
    routes = (
      <Switch>
      {/* Home Page */}
        <Route path="/" exact>
          <Users />
        </Route>
        {/* User ID Places */}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        {/* Add New Place */}
        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>
        {/* UpdatePlaces */}
        <Route path="/places/:placeId">
          <UpdatePlaces />
        </Route>
        {/* If unidentified Route, Move to Home */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
        {/* Home Page route */}
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
        {/* Places of a User  */}
          <UserPlaces />
        </Route>
        <Route path="/auth">
        {/* Authenticate Page */}
          <Authenticate />
        </Route>
        {/* If none, redirect to Auth Page */}
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    /* Binding our global state variables to context */
    /* 
      isLoggedIn is an Aux Property
      !! token, converts truthy/falsly values to Boolean 
    */
    <AuthContext.Provider value = {{isLoggedIn : !!token, token : token, userId : uid, logIn, logOut}}>
      <BrowserRouter>
      {/* Navigation bar is omnipresent throughout all routes. */}
      <MainNavigation/>
      <main>
        {/* Protected routes, Segregated with Global Login/Logout Context */}
        {routes}
      </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
