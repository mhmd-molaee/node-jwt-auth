const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add a username"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must have at least 6 characters"],
    select: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  refreshTokenLastUse: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(new ErrorResponse("Internal error", 500));
  }
});

// Creating a web token
UserSchema.methods.getSignedJwtToken = function () {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
      function (err, token) {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

// Creating a refresh token
UserSchema.methods.getRefreshToken = function () {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: this._id,
      },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      function (err, token) {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

// Checking password
UserSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
