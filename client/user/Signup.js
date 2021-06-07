import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { makeStyles } from "@material-ui/core/styles";
import { create } from "./api-user.js";
import { Link } from "react-router-dom";
import auth from "./../auth/auth-helper";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
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
}));

export default function Signup(props) {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    jwt && props.history.push("/");
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", open: true });
      }
    });
  };

  return (
    <div>
      <Card className={classes.card} elevation={4}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Регистрация
            {/* Sign Up */}
          </Typography>
          <TextField
            id="name"
            label="Име"
            // label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
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
            onChange={handleChange("email")}
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
            onChange={handleChange("password")}
            margin="normal"
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
            Регистрирай се
            {/* Submit */}
          </Button>
        </CardActions>
      </Card>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>
          Нов Акаунт
          {/* New Account */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Новият акаунт беше успешно създаден.
            {/* New account was successfully created. */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Вход
              {/* Sign In */}
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
