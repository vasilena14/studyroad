import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Divider,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import DeleteIcon from "@material-ui/icons/Delete";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { makeStyles } from "@material-ui/core/styles";
import { read, update } from "./api-course.js";
import { Link, Redirect } from "react-router-dom";
import auth from "./../auth/auth-helper";
import categories from "./categories.json";

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
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 280,
    display: "inline-block",
    width: "50%",
    marginLeft: "16px",
  },
  textfield: {
    width: 350,
  },
  action: {
    margin: "8px 24px",
    display: "inline-block",
  },
  input: {
    display: "none",
  },
  arrowUp: {
    border: "2px solid #f4b318",
    marginTop: 15,
    padding: 5,
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  list: {
    backgroundColor: "#f3f3f3",
  },
  errorIcon: {
    verticalAlign: "middle",
    marginRight: "5px",
    paddingBottom: "3px",
  },
  uploadButton: {
    margin: "0 8px 8px 0",
  },
  maxSize: {
    margin: "8px 0 8px 0",
    fontSize: "13px",
  },
}));

export default function EditCourse({ match }) {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [course, setCourse] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    tutor: {},
    lessons: [],
  });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: match.params.courseId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        data.image = "";
        setCourse(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  const handleUpdate = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setCourse({ ...course, [name]: value }),
      setValues({ ...values, [name]: value });
  };

  const handleLessonUpdate = (name, index) => (event) => {
    const lessons = course.lessons;
    lessons[index][name] = event.target.value;
    setCourse({ ...course, lessons: lessons });
  };

  const deleteLesson = (index) => (event) => {
    const lessons = course.lessons;
    lessons.splice(index, 1);
    setCourse({ ...course, lessons: lessons });
  };

  const moveUp = (index) => (event) => {
    const lessons = course.lessons;
    const moveUp = lessons[index];
    lessons[index] = lessons[index - 1];
    lessons[index - 1] = moveUp;
    setCourse({ ...course, lessons: lessons });
  };

  const handleSubmit = () => {
    let courseData = new FormData();
    course.name && courseData.append("name", course.name);
    course.description && courseData.append("description", course.description);
    course.image && courseData.append("image", course.image);
    course.category && courseData.append("category", course.category);
    courseData.append("lessons", JSON.stringify(course.lessons));
    update(
      {
        courseId: match.params.courseId,
      },
      {
        t: jwt.token,
      },
      courseData
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={"/tutor/course/" + course._id} />;
  }

  const imageUrl = course._id
    ? `/api/courses/cover/${course._id}?${new Date().getTime()}`
    : "/api/courses/defaultcover";

  return (
    <div className={classes.root}>
      <Card className={classes.card} elevation={4}>
        <CardHeader
          title={
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={course.name}
              onChange={handleUpdate("name")}
            />
          }
          subheader={
            <div>
              <Link to={"/user/" + course.tutor._id} className={classes.sub}>
                By {course.tutor.name}
              </Link>
              {
                <TextField
                  margin="dense"
                  label="Category"
                  select
                  value={course.category}
                  onChange={handleUpdate("category")}
                  style={{ textAlign: "left" }}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              }
            </div>
          }
          action={
            jwt.user &&
            jwt.user._id == course.tutor._id && (
              <span className={classes.action}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </span>
            )
          }
        />

        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={course.name}
          />
          <div className={classes.details}>
            <TextField
              margin="dense"
              multiline
              rows="5"
              label="Description"
              type="text"
              className={classes.textfield}
              value={course.description}
              onChange={handleUpdate("description")}
            />
            <br />
            <br />
            <input
              accept="image/*"
              onChange={handleUpdate("image")}
              className={classes.input}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <Button
                variant="outlined"
                color="secondary"
                component="span"
                className={classes.uploadButton}
              >
                Change Cover Photo
                <AddPhotoAlternateIcon />
              </Button>
            </label>
            <span>{course.image ? course.image.name : ""}</span>
            <Typography className={classes.maxSize} color="error">
              Max File Size: 204.8 KB
            </Typography>
            {values.error && (
              <Typography color="error">
                <ErrorOutlineIcon color="error" className={classes.errorIcon} />
                {values.error}
              </Typography>
            )}
          </div>
        </div>
        <div>
          <CardHeader
            title={
              <Typography variant="h6" className={classes.subheading}>
                Lessons - Edit and Rearrange
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={classes.subheading}>
                {course.lessons && course.lessons.length} lessons
              </Typography>
            }
          />
          <List>
            {course.lessons &&
              course.lessons.map((lesson, index) => {
                return (
                  <span key={index}>
                    <ListItem className={classes.list}>
                      <ListItemAvatar>
                        <>
                          <Avatar>{index + 1}</Avatar>
                          {index != 0 && (
                            <Tooltip title="Move up" aria-label="up">
                              <IconButton
                                aria-label="up"
                                color="primary"
                                onClick={moveUp(index)}
                                className={classes.arrowUp}
                              >
                                <ArrowUpwardIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <TextField
                              margin="dense"
                              label="Title"
                              type="text"
                              fullWidth
                              value={lesson.title}
                              onChange={handleLessonUpdate("title", index)}
                            />
                            <br />
                            <TextField
                              margin="dense"
                              multiline
                              rows="5"
                              label="Content"
                              type="text"
                              fullWidth
                              value={lesson.content}
                              onChange={handleLessonUpdate("content", index)}
                            />
                            <br />
                            <TextField
                              margin="dense"
                              label="Resource link"
                              type="text"
                              fullWidth
                              value={lesson.resource_url}
                              onChange={handleLessonUpdate(
                                "resource_url",
                                index
                              )}
                            />
                            <br />
                          </>
                        }
                      />

                      {/* {!course.published && ( */}
                      <ListItemSecondaryAction>
                        <Tooltip title="Delete lesson" aria-label="delete">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            color="primary"
                            onClick={deleteLesson(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                      {/* )} */}
                    </ListItem>
                    <Divider
                      style={{ backgroundColor: "rgb(106, 106, 106)" }}
                      component="li"
                    />
                  </span>
                );
              })}
          </List>
        </div>
      </Card>
    </div>
  );
}
