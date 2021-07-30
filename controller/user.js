const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const TOKEN_VALID_PERIOD = 10 * 60 * 1000;

exports.signup = asyncHandler(async (req, res, next) => {
  await User.create(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate username & password
  if (!username || !password)
    return next(new ErrorResponse("Please provide username and passward", 400));

  // Check for user
  const user = await User.findOne({ username }).select(
    "+password +refreshToken"
  );

  if (!user) return next(new ErrorResponse("Invalid Credentials", 401));

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse("Invalid Credentials", 401));
  sendLoginTokenResponse(user, 200, res);
});

exports.createTokenByRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return next(new ErrorResponse("Invalid refresh token", 401));

  let decoded;
  try {
    decoded = await verifyRefreshToken(refreshToken);
  } catch (error) {
    return next(new ErrorResponse("Invalid refresh token", 401));
  }

  // Check for user
  const user = await User.findById(decoded._id).select("+refreshToken");

  if (
    !user ||
    user.refreshToken !== refreshToken ||
    new Date(user.refreshTokenLastUse).getTime() + TOKEN_VALID_PERIOD <
      new Date().getTime()
  )
    return next(new ErrorResponse("Invalid refresh token", 401));

  sendRefreshTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  user.refreshToken = "";
  user.save();

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorResponse("User not found.", 404));

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    data: users,
  });
});

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      function (err, decoded) {
        if (err) reject(err);
        resolve(decoded);
      }
    );
  });
};

const sendLoginTokenResponse = async (user, statusCode, res) => {
  const token = await user.getSignedJwtToken();

  const refreshToken = await user.getRefreshToken();
  user.refreshToken = refreshToken;
  user.refreshTokenLastUse = new Date();
  user.save();

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    message: "Authenticated successfully",
  });
};

const sendRefreshTokenResponse = async (user, statusCode, res) => {
  const token = await user.getSignedJwtToken();

  user.refreshTokenLastUse = new Date();
  user.save();

  res.status(statusCode).json({
    success: true,
    token,
    message: "Authenticated successfully",
  });
};
