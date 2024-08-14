import {BrowserRouter, Route, Redirect,Switch} from 'react-router-dom'
import NewPlaces from './Places/Pages/NewPlaces';
import Users from './Users/Pages/Users';
import MainNavigation from './Shared/Components/Navigation/MainNavigation';
import UserPlaces from "./Places/Pages/UserPlaces"
import UpdatePlaces from './Places/Pages/UpdatePlaces';
import Authenticate from './Users/Pages/Authenticate';
import AuthContext from './Shared/Context/AuthContext';
import { useCallback, useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  /*
    For each route switch, you do not want to re-initiate the function,
    It will reset the Global State
  */
  const logIn = useCallback(()=> {
    console.log("Logged In")
    setIsLoggedIn(true)
  }, [])
  
  const logOut = useCallback(() => {
    console.log("Logged Out")
    setIsLoggedIn(false)
  },[])
  
  let routes;

  if (isLoggedIn) {
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
    /* Binding our global states to context */
    <AuthContext.Provider value = {{isLoggedIn, logIn, logOut}}>
      <BrowserRouter>
      <MainNavigation/>
      <main>
        {routes}
      </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
