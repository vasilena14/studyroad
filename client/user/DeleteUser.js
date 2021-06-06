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
import { remove } from "./api-user.js";
import { Redirect } from "react-router-dom";

export default function DeleteUser(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const jwt = auth.isAuthenticated();

  const handleClick = () => {
    setOpen(true);
  };

  const removeAccount = () => {
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log("deleted"));
        setRedirect(true);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <span>
      <Tooltip
        title="Изтрий акаунт"
        // title="Delete profile"
        aria-label="Delete"
      >
        <IconButton aria-label="Delete" onClick={handleClick} color="secondary">
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {"Изтрий акаунт"}
          {/* {"Delete Account"} */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Моля потвърдете, за да изтриете този акаунт.
            {/* Confirm to delete your account. */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Затвори
            {/* Cancel */}
          </Button>
          <Button
            onClick={removeAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Потвърди
            {/* Confirm */}
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired,
};
