import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { ProtectedRoute } from "./services/protected.route";



///////// Explore 
import ExplorePage from "./pages/explorePage/explorePage";
import CreateExplorePage from './pages/explorePage/createExplorePage'
///////// Proflie
import ProfilePage from "./pages/profilePage/profilePage";
import ChangePasswordPage from "./pages/profilePage/changePasswordPage";
///////// Login
import LoginPage from "./pages/loginPage";


const useStyles = makeStyles({
  container: {
    display: "flex"
  }
});

export default function App() {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
/*   let isLoggedIn =false; */

  
  useEffect(() => {
/*   localStorage.setItem("token", "")  */
 /*  const token = localStorage.getItem("token")
  if(!auth.isAuthenticated()){
    setIsLoggedIn(false);
    console.log(isLoggedIn)
  }
  else{
    setIsLoggedIn(true);
    console.log(isLoggedIn)
  }
    */
}, [])


    return (
      <div className={classes.container}>
    
        <Switch>
          <Route exact from="/login" render={props => <LoginPage {...props} />} />
          <ProtectedRoute exact path="/"  component={ExplorePage}  />
          <ProtectedRoute exact path="/explore" component={ExplorePage} />
          <ProtectedRoute exact path="/explore/create" component={CreateExplorePage} />
          <ProtectedRoute exact path="/profile" component={ProfilePage} />
          <ProtectedRoute exact path="/change-password" component={ChangePasswordPage} />
          
     
        </Switch>
      </div>
    );

 

}
