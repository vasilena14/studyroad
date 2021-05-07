import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListSubheader,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { read } from "./api-enrollment.js";
import auth from "./../auth/auth-helper";
import { CheckCircle, Info, RadioButtonUnchecked } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    marginTop: theme.spacing(12),
    marginLeft: 250,
  }),
  heading: {
    marginBottom: theme.spacing(3),
    fontWeight: 200,
  },
  card: {
    padding: "24px 40px 20px",
  },
  avatar: {
    color: "#9b9b9b",
    border: "1px solid #bdbdbd",
    background: "none",
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: "#616161",
  },
  toolbar: theme.mixins.toolbar,
  selectedDrawer: {
    backgroundColor: "#e9e3df",
  },
  unselected: {
    backgroundColor: "#ffffff",
  },
  check: {
    color: "#38cc38",
  },
  subhead: {
    fontSize: "1.2em",
  },
}));

export default function Enrollment({ match }) {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [enrollment, setEnrollment] = useState({
    course: { instructor: [] },
    lessonStatus: [],
  });
  const [values, setValues] = useState({
    error: "",
    drawer: -1,
  });
  const [totalComplete, setTotalComplete] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      { enrollmentId: match.params.enrollmentId },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setEnrollment(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.enrollmentId]);

  const selectDrawer = (index) => () => {
    setValues({ ...values, drawer: index });
  };

  const totalCompleted = (lessons) => {
    let count = lessons.reduce((total, lessonStatus) => {
      return total + (lessonStatus.complete ? 1 : 0);
    }, 0);
    setTotalComplete(count);
    return count;
  };

  const markComplete = () => {
    if (!enrollment.lessonStatus[values.drawer].complete) {
      const lessonStatus = enrollment.lessonStatus;
      lessonStatus[values.drawer].complete = true;

      let count = totalCompleted(lessonStatus);

      let updatedData = {};
      updatedData.lessonStatusId = lessonStatus[values.drawer]._id;
      updatedData.complete = true;

      if (count == lessonStatus.length) {
        updatedData.courseCompleted = Date.now();
      }

      complete(
        {
          enrollmentId: match.params.enrollmentId,
        },
        {
          t: jwt.token,
        },
        updatedData
      ).then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setEnrollment({ ...enrollment, lessonStatus: lessonStatus });
        }
      });
    }
  };

  const imageUrl = enrollment.course._id
    ? `/api/courses/photo/${enrollment.course._id}?${new Date().getTime()}`
    : "/api/courses/defaultphoto";

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem
            button
            onClick={selectDrawer(-1)}
            className={
              values.drawer == -1 ? classes.selectedDrawer : classes.unselected
            }
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Course Overview"} />
          </ListItem>
        </List>
        <Divider />
        <List className={classes.unselected}>
          <ListSubheader component="div" className={classes.subhead}>
            Lessons
          </ListSubheader>
          {enrollment.lessonStatus.map((lesson, index) => (
            <ListItem
              button
              key={index}
              onClick={selectDrawer(index)}
              className={
                values.drawer == index
                  ? classes.selectedDrawer
                  : classes.unselected
              }
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>{index + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={enrollment.course.lessons[index].title} />
              <ListItemSecondaryAction>
                {lesson.complete ? (
                  <CheckCircle className={classes.check} />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      {values.drawer != -1 && (
        <>
          <Typography variant="h5" className={classes.heading}>
            {enrollment.course.name}
          </Typography>
          <Card className={classes.card}>
            <CardHeader
              title={enrollment.course.lessons[values.drawer].title}
              action={
                <Button
                  onClick={markComplete}
                  variant={
                    enrollment.lessonStatus[values.drawer].complete
                      ? "contained"
                      : "outlined"
                  }
                  color="secondary"
                >
                  {enrollment.lessonStatus[values.drawer].complete
                    ? "Completed"
                    : "Mark as complete"}
                </Button>
              }
            />
            <CardContent>
              <Typography variant="body1" className={classes.para}>
                {enrollment.course.lessons[values.drawer].content}
              </Typography>
            </CardContent>
            <CardActions>
              <a href={enrollment.course.lessons[values.drawer].resource_url}>
                <Button variant="contained" color="primary">
                  Resource Link
                </Button>
              </a>
            </CardActions>
          </Card>
        </>
      )}
    </div>
  );
}
