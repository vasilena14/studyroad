import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { Link } from "react-router-dom";
import auth from "./../auth/auth-helper";
import Enroll from "./../enrollment/Enroll";

const useStyles = makeStyles((theme) => ({
  tile: {
    borderTop: "1px solid #cecece",
    borderLeft: "1px solid #cecece",
    borderRight: "1px solid #cecece",
    borderRadius: "4px",
  },
  rootTile: {
    padding: 0,
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
}));

export default function Courses(props) {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const findCommon = (course) => {
    return !props.common.find((enrolled) => {
      return enrolled.course._id == course._id;
    });
  };

  return (
    <GridList cellHeight={220} spacing={15} cols={2}>
      {props.courses.map((course, i) => {
        return (
          findCommon(course) && (
            <GridListTile
              classes={{ root: classes.rootTile, tile: classes.tile }}
              key={i}
            >
              <Link to={"/course/" + course._id}>
                <img
                  className={classes.image}
                  src={"/api/courses/cover/" + course._id}
                  alt={course.name}
                />
              </Link>
              <GridListTileBar
                className={classes.tileBar}
                title={
                  <Link
                    to={"/course/" + course._id}
                    className={classes.tileTitle}
                  >
                    {course.name}
                  </Link>
                }
                subtitle={
                  <span style={{ lineHeight: "1.5" }}>{course.category}</span>
                }
                actionIcon={
                  <div className={classes.action}>
                    {jwt ? (
                      <Enroll courseId={course._id} />
                    ) : (
                      <Link to="/signin" style={{ color: "#f4b318" }}>
                        Sign in to Enroll
                      </Link>
                    )}
                  </div>
                }
              />
            </GridListTile>
          )
        );
      })}
    </GridList>
  );
}

Courses.propTypes = {
  courses: PropTypes.array.isRequired,
};
