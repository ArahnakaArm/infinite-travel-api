import React from "react";
import ExplorePage from "./pages/explorePage";
import HelloComponent from "./components/HelloComponent";
import { Route, Switch } from "react-router-dom";
import Drawer from "./components/Drawer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    display: "flex"
  }
});

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Drawer />
      <Switch>
        <Route exact from="/" render={props => <HelloComponent {...props} />} />
        <Route exact from="/explore" render={props => <ExplorePage {...props} />} />
      </Switch>
    </div>
  );
}
