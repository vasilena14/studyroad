import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Въведете име",
    // required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    // custom: "Email already exists",
    match: [/.+\@.+\..+/, "Моля въведете валиден имейл"],
    required: "Въведете имейл",
    // match: [/.+\@.+\..+/, "Please write a valid email address"],
    // required: "Email is required",
  },
  hashedPassword: {
    type: String,
    required: "Въведете парола",
    // required: "Password is required",
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  tutor: {
    type: Boolean,
    default: false,
  },
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.getSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashedPassword").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Паролата трябва да е поне 6 символа.");
    // this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Въведете парола.");
    // this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  getSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

export default mongoose.model("User", UserSchema);
