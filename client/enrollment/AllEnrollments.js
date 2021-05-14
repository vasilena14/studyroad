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
  image: {
    width: "100%",
  },
  rootTile: {
    padding: 0,
  },
  tile: {
    borderTop: "1px solid #cecece",
    borderLeft: "1px solid #cecece",
    borderRight: "1px solid #cecece",
    borderRadius: "4px",
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
    color: theme.palette.inProgress,
  },
  finishedCourse: {
    color: theme.palette.successful,
  },
}));

export default function AllEnrollments(props) {
  const classes = useStyles();
  return (
    <GridList cellHeight={120} spacing={6} cols={4}>
      {props.enrollments.map((course, i) => (
        <GridListTile
          classes={{ root: classes.rootTile, tile: classes.tile }}
          key={i}
        >
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
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {course.course.name}
                </p>
              </Link>
            }
            actionIcon={
              <div className={classes.action}>
                {course.completed ? (
                  <CheckCircleIcon className={classes.finishedCourse} />
                ) : (
                  <DonutLargeIcon className={classes.progress} />
                )}
              </div>
            }
          />
        </GridListTile>
      ))}
    </GridList>
  );
}
