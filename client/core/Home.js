import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography, Box } from "@material-ui/core";
import { getAllPublished } from "./../course/api-course";
import { getAllEnrolled } from "./../enrollment/api-enrollment";
import auth from "./../auth/auth-helper";
import Courses from "./../course/Courses";
import AllEnrollments from "../enrollment/AllEnrollments";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(12),
  },
  card: {
    maxWidth: 900,
    margin: "auto",
    marginBottom: theme.spacing(5),
    padding: `${theme.spacing(3.5)}px `,
  },
  title: {
    padding: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
  content: {
    color: "lightgrey",
    marginBottom: 12,
    marginLeft: 8,
    padding: `0px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
  },
}));

export default function Home() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAllEnrolled({ t: jwt.token }, signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setEnrolled(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAllPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCourses(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <>
      {jwt.user && (
        <Card className={classes.card} elevation={4}>
          <Typography variant="h5" component="h2" className={classes.title}>
            Courses you are enrolled in
          </Typography>
          {enrolled.length != 0 ? (
            <AllEnrollments enrollments={enrolled} />
          ) : (
            <Typography variant="body1" className={classes.content}>
              No courses yet.
            </Typography>
          )}
        </Card>
      )}

      <Card className={classes.card} elevation={4}>
        <Typography variant="h5" component="h2" className={classes.title}>
          All Courses
        </Typography>
        {courses.length != 0 && courses.length != enrolled.length ? (
          <Courses courses={courses} common={enrolled} />
        ) : (
          <Typography variant="body1" className={classes.content}>
            There aren't any new courses.
          </Typography>
        )}
      </Card>
    </>
  );
}
