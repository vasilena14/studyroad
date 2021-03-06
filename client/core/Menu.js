import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";
import logo from "./../assets/logo/logo.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const isSelected = (history, path) => {
  if (history.location.pathname == path)
    return { marginRight: 10, color: "#f4b318" };
  else return { marginRight: 10, color: "#ffffff" };
};

const isHighlighted = (history, path) => {
  if (history.location.pathname == path)
    return { color: "#fffde7", backgroundColor: "#f4b318", marginRight: 10 };
  else
    return {
      color: "#ffffff",
      marginRight: 10,
    };
};

// const classes = useStyles();

function Menu({ history }) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link to="/">
          {/* <Typography variant="h5" style={{ color: "#ffffff" }}>
          Studyroad
        </Typography> */}
          <img src={logo} alt={"logo"} style={{ maxWidth: "190px" }} />
        </Link>
        <div style={{ position: "absolute", right: 0 }}>
          <Link to="/">
            <Button style={isSelected(history, "/")}>
              {/* Home */}
              Начало
            </Button>
          </Link>
          {!auth.isAuthenticated() && (
            <span>
              <Link to="/signup">
                <Button style={isSelected(history, "/signup")}>
                  {/* Sign up */}
                  Регистрация
                </Button>
              </Link>
              <Link to="/signin">
                <Button style={isSelected(history, "/signin")}>
                  {/* Sign In */}
                  Вход
                </Button>
              </Link>
            </span>
          )}

          {auth.isAuthenticated() && (
            <span>
              {auth.isAuthenticated().user.tutor && (
                <Link to="/tutor/courses">
                  <Button style={isHighlighted(history, "/tutor/courses")}>
                    <LocalLibraryIcon style={{ marginRight: "5px" }} />
                    {/* Tutor Portal */}
                    Преподавател
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
                  {/* My Profile */}
                  Моят Профил
                </Button>
              </Link>
              <Button
                color="inherit"
                style={{ marginRight: 10 }}
                onClick={() => {
                  auth.clearJWT(
                    () => history.push("/"),
                    window.location.reload()
                  );
                }}
              >
                {/* Sign out */}
                Изход
              </Button>
            </span>
          )}

          <span style={{ verticalAlign: "middle" }}>
            <Link to="/more">
              <Button style={isSelected(history, "/more")}>
                <HelpOutlineIcon />
              </Button>
            </Link>
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Menu);
