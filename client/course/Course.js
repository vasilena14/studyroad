import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import PeopleIcon from "@material-ui/icons/People";
import { makeStyles } from "@material-ui/core/styles";
import { read, update } from "./api-course.js";
import { enrollmentState } from "./../enrollment/api-enrollment";
import { Link, Redirect } from "react-router-dom";
import auth from "./../auth/auth-helper";
import NewLesson from "./NewLesson";
import DeleteCourse from "./DeleteCourse";
import Enroll from "./../enrollment/Enroll";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  flex: {
    textAlign: "center",
  },
  details: {
    margin: "16px",
    maxWidth: "100%",
    textAlign: "justify",
    // display: "flex",
    // justifyContent: "space-between",
    // alignItems: "center",
  },
  media: {
    height: 180,
    display: "inline-block",
    width: "95%",
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "10px 10px 10px 0",
    display: "flex",
    justifyContent: "flex-end",
  },
  state: {
    margin: "7px 10px 0 0",
    alignItems: "center",
    color: "#8c8c8c",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#8c8c8c",
    },
  },
  enroll: {
    // float: "right",
    textAlign: "right",
  },
  cardHeader: {
    flex: "1 1 auto",
  },
}));

export default function Course({ match }) {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [course, setCourse] = useState({ tutor: {} });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: match.params.courseId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    enrollmentState(
      { courseId: match.params.courseId },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setState(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  const addNewLesson = (course) => {
    setCourse(course);
  };

  const removeCourse = () => {
    setValues({ ...values, redirect: true });
  };

  const handlePublish = () => {
    if (course.lessons.length > 0) {
      setOpen(true);
    }
  };

  const confirmPublish = () => {
    let courseData = new FormData();
    courseData.append("published", true);
    update(
      {
        courseId: match.params.courseId,
      },
      {
        t: jwt.token,
      },
      courseData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse({ ...course, published: true });
        setOpen(false);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (values.redirect) {
    return <Redirect to={"/tutor/courses"} />;
  }

  const imageUrl = course._id
    ? `/api/courses/cover/${course._id}?${new Date().getTime()}`
    : "/api/courses/defaultcover";

  return (
    <div className={classes.root}>
      <Card className={classes.card} elevation={4}>
        <CardHeader
          title={course.name}
          classes={{ action: classes.cardHeader }}
          subheader={
            <div>
              <Link to={"/user/" + course.tutor._id} className={classes.sub}>
                От {course.tutor.name}
              </Link>
              <span className={classes.category}>{course.category}</span>
            </div>
          }
          action={
            <>
              {jwt.user && jwt.user._id == course.tutor._id && (
                <span className={classes.action}>
                  <Tooltip
                    title="Редактирай курс"
                    // title="Edit course"
                    aria-label="Edit"
                  >
                    <Link to={"/tutor/course/edit/" + course._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <EditIcon />
                      </IconButton>
                    </Link>
                  </Tooltip>

                  {!course.published ? (
                    <>
                      <Button
                        color="secondary"
                        variant="outlined"
                        onClick={handlePublish}
                      >
                        {course.lessons.length == 0
                          ? // ? "Add at least 1 lesson to publish"
                            // : "Publish"}
                            "Добави поне един урок, за да публикуваш"
                          : "Публикувай"}
                      </Button>
                      <DeleteCourse course={course} onRemove={removeCourse} />
                    </>
                  ) : (
                    <>
                      <Button color="primary" variant="outlined">
                        {/* Published */}
                        Публикуван
                      </Button>
                      {/* <DeleteCourse course={course} onRemove={removeCourse} /> */}
                    </>
                  )}
                </span>
              )}

              {course.published && (
                <div style={{ textAlign: "end" }}>
                  <span className={classes.state}>
                    <PeopleIcon /> {state.totalEnrolled}
                    {/* enrolled */}
                    {state.totalEnrolled == 1 ? " записан" : " записани"}
                  </span>
                  <span className={classes.state}>
                    <BeenhereIcon /> {state.totalCompleted}
                    {/* completed */}
                    {state.totalCompleted == 1 ? " завършил" : " завършили"}
                  </span>
                </div>
              )}
            </>
          }
        />

        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={course.name}
          />
          <div className={classes.details}>
            <Typography variant="body1" className={classes.subheading}>
              {course.description}
              <br />
            </Typography>

            {course.published && (
              <div className={classes.enroll}>
                <Enroll courseId={course._id} />
              </div>
            )}
          </div>
        </div>

        <Divider />
        <div>
          <CardHeader
            title={
              <Typography variant="h6" className={classes.subheading}>
                {/* Lessons */}
                Уроци
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={classes.subheading}>
                {course.lessons && course.lessons.length}
                {course.lessons && course.lessons.length == 1
                  ? " урок"
                  : " урока"}
                {/* lessons */}
              </Typography>
            }
            action={
              jwt.user &&
              jwt.user._id == course.tutor._id &&
              !course.published && (
                <span className={classes.action}>
                  <NewLesson
                    courseId={course._id}
                    addNewLesson={addNewLesson}
                  />
                </span>
              )
            }
          />
          <List>
            {course.lessons &&
              course.lessons.map((lesson, index) => {
                return (
                  <span key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={lesson.title} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </span>
                );
              })}
          </List>
        </div>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {/* Publish Course */}
          Публикувай курс
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Публикуването на този курс ще го направи видим за потребителите и те
            ще могат да се записват. Уверете се, че всички уроци са готови.
          </Typography>
          {/* <Typography variant="body1">
            Publishing this course will make it visible to students for
            enrollment. Make sure all lessons are ready.
          </Typography> */}
          <br />
          <Typography variant="body1">
            Веднъж публикуван, няма да може да добавяте нови уроци или да
            изтривате курса. Но ще може да редактирате съществуващите вече
            елементи.
          </Typography>
          {/* <Typography variant="body1">
            Once published you won't be able to add new lessons or delete the
            course. But you will be able to edit the existing components.
          </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            {/* Cancel */}
            Затвори
          </Button>
          <Button
            onClick={confirmPublish}
            color="secondary"
            variant="contained"
          >
            {/* Publish */}
            Публикувай
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
