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
  Avatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import { read, update } from "./api-course.js";
import { Link, Redirect } from "react-router-dom";
import auth from "./../auth/auth-helper";
import NewLesson from "./NewLesson";
import DeleteCourse from "./DeleteCourse";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 190,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
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
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
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

  const addNewLesson = (course) => {
    setCourse(course);
  };

  const removeCourse = (course) => {
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
      <Card className={classes.card}>
        <CardHeader
          title={course.name}
          subheader={
            <div>
              <Link to={"/user/" + course.tutor._id} className={classes.sub}>
                By {course.tutor.name}
              </Link>
              <span className={classes.category}>{course.category}</span>
            </div>
          }
          action={
            <>
              {jwt.user && jwt.user._id == course.tutor._id && (
                <span className={classes.action}>
                  <Link to={"/tutor/course/edit/" + course._id}>
                    <IconButton aria-label="Edit" color="secondary">
                      <EditIcon />
                    </IconButton>
                  </Link>

                  {!course.published ? (
                    <>
                      <Button
                        color="secondary"
                        variant="outlined"
                        onClick={handlePublish}
                      >
                        {course.lessons.length == 0
                          ? "Add at least 1 lesson to publish"
                          : "Publish"}
                      </Button>
                      <DeleteCourse course={course} onRemove={removeCourse} />
                    </>
                  ) : (
                    <Button color="primary" variant="outlined">
                      Published
                    </Button>
                  )}
                </span>
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
          </div>
        </div>

        <Divider />
        <div>
          <CardHeader
            title={
              <Typography variant="h6" className={classes.subheading}>
                Lessons
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={classes.subheading}>
                {course.lessons && course.lessons.length} lessons
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
        <DialogTitle id="form-dialog-title">Publish Course</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Publishing this course will make it visible to students and they'll
            be able to enroll.
          </Typography>
          <Typography variant="body1">
            Make sure all lessons are ready for publishing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={confirmPublish}
            color="secondary"
            variant="contained"
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
