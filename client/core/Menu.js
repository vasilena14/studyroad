import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";

const isSelected = (history, path) => {
  if (history.location.pathname == path) return { color: "#ff4081" };
  else return { color: "#ffffff" };
};

const isHighlighted = (history, path) => {
  if (history.location.pathname.includes(path))
    return { color: "#fffde7", backgroundColor: "#ff4081", marginRight: 10 };
  else
    return {
      color: "#3f4771",
      backgroundColor: "#fffde7",
      marginRight: 10,
    };
};

const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Studyroad
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isSelected(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link>
      <Link to="/users">
        <Button style={isSelected(history, "/users")}>Users</Button>
      </Link>
      {!auth.isAuthenticated() && (
        <span>
          <Link to="/signup">
            <Button style={isSelected(history, "/signup")}>Sign up</Button>
          </Link>
          <Link to="/signin">
            <Button style={isSelected(history, "/signin")}>Sign In</Button>
          </Link>
        </span>
      )}
      {auth.isAuthenticated() && (
        <span>
          {auth.isAuthenticated().user.tutor && (
            <Link to="/tutor/courses">
              <Button style={isHighlighted(history, "/tutor/")}>
                <LocalLibraryIcon /> Tutor Portal
              </Button>
            </Link>
          )}
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button
              style={isSelected(
                history,
                "/user/" + auth.isAuthenticated().user._id
              )}
            >
              My Profile
            </Button>
          </Link>
          <Button
            color="inherit"
            onClick={() => {
              auth.clearJWT(() => history.push("/"));
            }}
          >
            Sign out
          </Button>
        </span>
      )}
    </Toolbar>
  </AppBar>
));

export default Menu;
