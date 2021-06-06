import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { makeStyles } from "@material-ui/core/styles";
import auth from "./../auth/auth-helper";
import { read, update } from "./api-user.js";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: "middle",
    marginRight: "5px",
    paddingBottom: "3px",
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
}));

export default function EditProfile({ match }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
    redirectToProfile: false,
    tutor: false,
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
          tutor: data.tutor,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const handleSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      tutor: values.tutor,
    };
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.updateUser(data, () => {
          setValues({ ...values, userId: data._id, redirectToProfile: true });
        });
      }
    });
  };

  const handleUpdate = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleToggle = (event, checked) => {
    setValues({ ...values, tutor: checked });
  };

  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.userId} />;
  }

  return (
    <Card className={classes.card} elevation={4}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Редактирай Профил
          {/* Edit Profile */}
        </Typography>
        <TextField
          id="name"
          label="Име"
          // label="Name"
          className={classes.textField}
          value={values.name}
          onChange={handleUpdate("name")}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Имейл"
          // label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleUpdate("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Парола"
          // label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleUpdate("password")}
          margin="normal"
        />
        <br />
        <br />
        <Typography variant="subtitle1">
          Аз съм преподавател
          {/* I am a Tutor */}
        </Typography>
        <FormControlLabel
          control={<Switch checked={values.tutor} onChange={handleToggle} />}
          label={values.tutor ? "Да" : "Не"}
          label={values.tutor ? "Yes" : "No"}
        />
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
          Запиши
          {/* Submit */}
        </Button>
      </CardActions>
    </Card>
  );
}
