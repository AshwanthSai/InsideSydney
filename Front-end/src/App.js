import {BrowserRouter, Route, Redirect,Switch} from 'react-router-dom'
import NewPlaces from './Places/Pages/NewPlaces';
import Users from './Users/Pages/Users';
import MainNavigation from './Shared/Components/Navigation/MainNavigation';
import UserPlaces from "./Places/Pages/UserPlaces"

function App() {
  return (
    <BrowserRouter>
     <MainNavigation/>
     <main>
    <Switch>
      <Route path = "/" exact> 
        <Users/>
      </Route>
      <Route path = "/:userId/places" exact> 
        <UserPlaces/>
      </Route>
    <Route path = "/newPlaces" exact> 
        <NewPlaces/>
      </Route>
      <Redirect to = "/"/>  
    </Switch>
    </main>
    </BrowserRouter>
  );
}

export default App;
