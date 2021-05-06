import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import testImage from "./../assets/images/testImage.jpg";
import { listPublished } from "./../course/api-course";
import Courses from "./../course/Courses";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  credit: {
    padding: 10,
    textAlign: "right",
    backgroundColor: "#ededed",
    borderBottom: "1px solid #d0d0d0",
    "& a": {
      color: "#3f4771",
    },
  },
  noTitle: {
    color: "lightgrey",
    marginBottom: 12,
    marginLeft: 8,
    padding: `0px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
  },
}));

export default function Home() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listPublished(signal).then((data) => {
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
    <div>
      <Card className={classes.card}>
        <Typography variant="h6" className={classes.title}>
          Home Page
        </Typography>
        <CardMedia
          className={classes.media}
          image={testImage}
          title="Test Image"
        />
        <CardContent>
          <Typography variant="body2" component="p">
            StudyRoad home page.
          </Typography>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <Typography variant="h5" component="h2" className={classes.title}>
          All Courses
        </Typography>
        {courses.length != 0 && courses.length != enrolled.length ? (
          <Courses courses={courses} />
        ) : (
          <Typography variant="body1" className={classes.noTitle}>
            No new courses.
          </Typography>
        )}
      </Card>
    </div>
  );
}
