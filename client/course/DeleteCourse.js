import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import auth from "./../auth/auth-helper";
import { remove } from "./api-course.js";

export default function DeleteCourse(props) {
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();

  const handleClick = () => {
    setOpen(true);
  };

  const deleteCourse = () => {
    remove(
      {
        courseId: props.course._id,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.course);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <span>
      <Tooltip title="Delete course" aria-label="Delete">
        <IconButton aria-label="Delete" onClick={handleClick} color="secondary">
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Delete " + props.course.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteCourse}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

DeleteCourse.propTypes = {
  course: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};
