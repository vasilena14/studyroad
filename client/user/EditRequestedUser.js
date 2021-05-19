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

export default function EditRequestedUser({ match }) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [isTutor, setIsTutor] = useState(false);
  const jwt = auth.isAuthenticated();
  const [values, setValues] = useState({
    tutor: false,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      // { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          tutor: data.tutor,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

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
    <Card className={classes.card} elevation={4}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <Typography variant="subtitle1">Make a Tutor</Typography>
        <FormControlLabel
          control={<Switch checked={isTutor} onChange={handleToggle} />}
          label={isTutor ? "Yes" : "No"}
        />
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
      </CardActions>
    </Card>
  );
}
