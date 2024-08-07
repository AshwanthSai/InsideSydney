import {BrowserRouter, Route, Redirect,Switch} from 'react-router-dom'
import NewPlaces from './Places/Pages/NewPlaces';
import Users from './Users/Pages/Users';
import MainNavigation from './Shared/Components/Navigation/MainNavigation';
import UserPlaces from "./Places/Pages/UserPlaces"
import UpdatePlaces from './Places/Pages/UpdatePlaces';

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
      <Route path = "/places/new" exact> 
          <NewPlaces/>
      </Route>
      <Route path = "/places/:placeId" exact> 
          <UpdatePlaces/>
      </Route>
      <Redirect to = "/"/>  
    </Switch>
    </main>
    </BrowserRouter>
  );
}

export default App;
