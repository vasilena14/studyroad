import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import NewCourse from "./course/NewCourse";
import MyCourses from "./course/MyCourses";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/user/:userId" component={Profile} />
        <Route path="/course/:courseId" component={Course} />
        <PrivateRoute path="/teach/courses" component={MyCourses} />

        <PrivateRoute path="/teach/course/new" component={NewCourse} />
      </Switch>
    </div>
  );
};

export default MainRouter;
