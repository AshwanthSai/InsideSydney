import React from 'react';
import {BrowserRouter, Route, Redirect,Switch} from 'react-router-dom'
// import NewPlaces from './Places/Pages/NewPlaces';
import Users from './Users/Pages/Users';
import MainNavigation from './Shared/Components/Navigation/MainNavigation';
// import UserPlaces from "./Places/Pages/UserPlaces"
// import UpdatePlaces from './Places/Pages/UpdatePlaces';
// import Authenticate from './Users/Pages/Authenticate';
import AuthContext from './Shared/Context/AuthContext';
import useAuth from './Shared/Components/hooks/auth-hook';
import { Suspense } from 'react';
import LoadingSpinner from './Shared/Components/FormElements/LoadingSpinner';

const UserPlaces = React.lazy(() => import("./Places/Pages/UserPlaces"))
const NewPlaces = React.lazy(() => import('./Places/Pages/NewPlaces'))
const UpdatePlaces = React.lazy(() => import('./Places/Pages/UpdatePlaces'))
const Authenticate = React.lazy(() => import('./Users/Pages/Authenticate'))


function App() {
  const[token, logIn, logOut, userId] = useAuth();
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
    <AuthContext.Provider value = {{isLoggedIn : !!token, token : token, userId, logIn, logOut}}>
      <BrowserRouter>
      {/* Navigation bar is omnipresent throughout all routes. */}
      <MainNavigation/>
      <main>
        <Suspense fallback = {
          <div className='center'>
            <LoadingSpinner/>
          </div>
        }>
          {/* Protected routes, Segregated with Global Login/Logout Context */}
          {routes}
        </Suspense>
      </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
