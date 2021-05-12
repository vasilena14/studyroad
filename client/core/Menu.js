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
  if (history.location.pathname == path)
    return { marginRight: 10, color: "#f4b318" };
  else return { marginRight: 10, color: "#ffffff" };
};

const isHighlighted = (history, path) => {
  if (history.location.pathname.includes(path))
    return { color: "#fffde7", backgroundColor: "#f4b318", marginRight: 10 };
  else
    return {
      color: "#29516B",
      backgroundColor: "#fffde7",
      marginRight: 10,
    };
};

const Menu = withRouter(({ history }) => (
  <AppBar position="static">
    <Toolbar>
      <Link to="/">
        <Typography variant="h5" style={{ color: "#ffffff" }}>
          Studyroad
        </Typography>
      </Link>

      {/* <Link to="/">
        <IconButton aria-label="Home" style={isSelected(history, "/")}>
          <HomeIcon />
        </IconButton>
      </Link> */}
      {/*<Link to="/users">
        <Button style={isSelected(history, "/users")}>Users</Button>
      </Link> */}

      <div style={{ position: "absolute", right: 0 }}>
        {/* <span style={{ float: "right" }}> */}
        <span>
          <Link to="/">
            <Button style={isSelected(history, "/")}>Home</Button>
          </Link>
        </span>
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
              style={{ marginRight: 10 }}
              onClick={() => {
                auth.clearJWT(() => history.push("/"));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
        {/* </span> */}
      </div>
    </Toolbar>
  </AppBar>
));

export default Menu;
