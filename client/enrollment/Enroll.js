import React, { useState } from "react";
import { Button, Box, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { create } from "./api-enrollment";
import auth from "./../auth/auth-helper";
import { Link, Redirect } from "react-router-dom";

export default function Enroll(props) {
  const jwt = auth.isAuthenticated();
  const [values, setValues] = useState({
    enrollmentId: "",
    error: "",
    redirect: false,
  });

  const handleEnroll = () => {
    create(
      {
        courseId: props.courseId,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, enrollmentId: data._id, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={"/learn/" + values.enrollmentId} />;
  }

  return (
    <div>
      {jwt ? (
        <Button variant="contained" color="secondary" onClick={handleEnroll}>
          {/* Enroll */}
          Започни
        </Button>
      ) : (
        <Link to="/signup">
          <Button variant="text" color="secondary" size="small">
            Регистрирай се,
            <br />
            за да се запишеш
            {/* Sign in to Enroll */}
          </Button>
        </Link>
      )}
    </div>
  );
}

Enroll.propTypes = {
  courseId: PropTypes.string.isRequired,
};
