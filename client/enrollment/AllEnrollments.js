import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  container: {
    minWidth: "100%",
    paddingBottom: "14px",
  },
  gridList: {
    width: "100%",
    minHeight: 100,
    padding: "12px 10px 10px",
  },
  image: {
    width: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    textAlign: "left",
  },
  tileTitle: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "#fffde7",
    display: "block",
  },
  action: {
    margin: "0 10px",
  },
  progress: {
    color: "#b4f8b4",
  },
}));

export default function AllEnrollments(props) {
  const classes = useStyles();
  return (
    <div>
      <GridList cellHeight={120} className={classes.gridList} cols={4}>
        {props.enrollments.map((course, i) => (
          <GridListTile key={i}>
            <Link to={"/learn/" + course._id}>
              <img
                className={classes.image}
                src={"/api/courses/cover/" + course.course._id}
                alt={course.course.name}
              />
            </Link>
            <GridListTileBar
              className={classes.tileBar}
              title={
                <Link to={"/learn/" + course._id} className={classes.tileTitle}>
                  {course.course.name}
                </Link>
              }
              actionIcon={
                <div className={classes.action}>
                  {course.completed ? (
                    <CheckCircleIcon color="secondary" />
                  ) : (
                    <DonutLargeIcon className={classes.progress} />
                  )}
                </div>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
