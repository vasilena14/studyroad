import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  Button,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link } from "react-router-dom";
import auth from "./../auth/auth-helper";
import { makeTutor, getAllRequested } from "./api-user.js";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function Users({ match }) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAllRequested(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
        console.log(users);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleToggle = () => {
    setIsTutor((prev) => !prev);
  };

  const handleSubmit = () => {
    const user = {
      tutor: isTutor,
    };

    // makeTutor(user).then((data) => {
    //   if (data && data.error) {
    //     console.log(data.error);
    //   } else {
    //     setIsTutor({ isTutor });
    //   }
    // });

    makeTutor(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      user
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setIsTutor({ isTutor });
      }
    });
  };

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        All users that have requested to become Tutors
      </Typography>
      <List dense>
        {users &&
          users.map((item, i) => {
            return (
              <Link to={"/user/" + item._id} key={i}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      {users.name && users.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    {/* <IconButton>
                    <ArrowForwardIcon />
                  </IconButton> */}
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
            );
          })}
      </List>
    </Paper>
  );
}
