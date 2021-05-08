import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Typography,
  Button,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import auth from "./../auth/auth-helper";
import { getAllByTutor } from "./api-course.js";
import { Link, Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  addButton: {
    float: "right",
  },
  leftIcon: {
    marginRight: "8px",
  },
  avatar: {
    borderRadius: 0,
    width: 65,
    height: 40,
  },
  listText: {
    marginLeft: 16,
  },
}));

export default function MyCourses() {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [courses, setCourses] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAllByTutor(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        setCourses(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your Courses
          <span className={classes.addButton}>
            <Link to="/tutor/course/new">
              <Button color="primary" variant="contained">
                <AddBoxIcon className={classes.leftIcon} /> New Course
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {courses.map((course, i) => {
            return (
              <Link to={"/tutor/course/" + course._id} key={i}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        "/api/courses/cover/" +
                        course._id +
                        "?" +
                        new Date().getTime()
                      }
                      className={classes.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={course.name}
                    secondary={course.description}
                    className={classes.listText}
                  />
                </ListItem>
                <Divider />
              </Link>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
