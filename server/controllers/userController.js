import User from "../models/userModel";
import extend from "lodash/extend";
import errorHandler from "./../helpers/dbErrorHandler";

const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Signed up successfully!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Failed to fetch user",
    });
  }
};

const read = (req, res) => {
  req.profile.hashedPassword = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const getAll = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const getAllRequested = async (req, res) => {
  try {
    let requestedUsers = await User.find({ requested: true }).select(
      "name email requested tutor"
    );
    res.json(requestedUsers);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashedPassword = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// const makeTutor = async (req, res) => {
//   try {
//     let user = req.profile;
//     user = extend(user, req.body);
//     user.updated = Date.now();
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     return res.status(400).json({
//       error: errorHandler.getErrorMessage(err),
//     });
//   }
// };

const makeTutor = async (req, res) => {
  let updatedData = {};
  updatedData["tutor"] = req.body.tutor;
  updatedData.updated = Date.now();

  try {
    let userTutor = await User.updateOne(
      { "user._id": req.body.userId },
      { $set: updatedData }
    );
    res.json(userTutor);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashedPassword = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isAdmin = (req, res, next) => {
  const isAdmin = req.profile && req.profile.admin;
  if (!isAdmin) {
    return res.status("403").json({
      error: "User is not an admin",
    });
  }
  next();
};

const hasRequested = (req, res, next) => {
  const hasRequested = req.profile && req.profile.requested;
  if (!hasRequested) {
    return res.status("403").json({
      error: "User hasn't requested to be a tutor",
    });
  }
  next();
};

const isTutor = (req, res, next) => {
  const isTutor = req.profile && req.profile.tutor;
  if (!isTutor) {
    return res.status("403").json({
      error: "User is not a tutor",
    });
  }
  next();
};

export default {
  create,
  userByID,
  read,
  getAll,
  remove,
  update,
  isAdmin,
  hasRequested,
  isTutor,
  getAllRequested,
  makeTutor,
};
