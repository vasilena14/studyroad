import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import auth from "./../auth/auth-helper";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "./api-course.js";
import { Link, Redirect } from "react-router-dom";
import categories from "./categories.json";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(12),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
    marginRight: "5px",
    paddingBottom: "3px",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
  inputLeft: {
    textAlign: "left",
  },
}));

export default function NewCourse() {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    redirect: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    let courseData = new FormData();
    values.name && courseData.append("name", values.name);
    values.description && courseData.append("description", values.description);
    values.image && courseData.append("image", values.image);
    values.category && courseData.append("category", values.category);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      courseData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={"/tutor/courses"} />;
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            New Course
          </Typography>
          <br />
          <input
            accept="image/*"
            onChange={handleChange("image")}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Cover Photo
              <AddPhotoAlternateIcon />
            </Button>
          </label>
          <span className={classes.filename}>
            {values.image ? values.image.name : ""}
          </span>

          <Typography
            style={{ marginTop: "10px", fontSize: "13px" }}
            color="error"
          >
            Max File Size: 2MB
          </Typography>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange("description")}
            className={classes.textField}
            margin="normal"
          />
          <br />
          <TextField
            id="category"
            label="Category"
            select
            className={classes.textField}
            value={values.category}
            onChange={handleChange("category")}
            margin="normal"
            style={{ textAlign: "left" }}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <br />
          {values.error && (
            <Typography component="p" color="error">
              <ErrorOutlineIcon color="error" className={classes.error} />
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
          <Link to="/tutor/courses" className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
