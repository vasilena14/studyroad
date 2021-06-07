import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import Course from "./course/Course";
import NewCourse from "./course/NewCourse";
import MyCourses from "./course/MyCourses";
import EditCourse from "./course/EditCourse";
import Enrollment from "./enrollment/Enrollment";
import More from "./core/More";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(10),
  },
}));

const MainRouter = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/user/:userId" component={Profile} />
        <Route path="/course/:courseId" component={Course} />
        <PrivateRoute path="/tutor/courses" component={MyCourses} />

        <PrivateRoute path="/tutor/course/new" component={NewCourse} />
        <PrivateRoute
          path="/tutor/course/edit/:courseId"
          component={EditCourse}
        />
        <PrivateRoute path="/tutor/course/:courseId" component={Course} />
        <PrivateRoute path="/learn/:enrollmentId" component={Enrollment} />
        <Route path="/more" component={More} />
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
};

export default MainRouter;
