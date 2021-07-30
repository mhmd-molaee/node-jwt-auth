const experss = require("express");
const router = experss.Router();

const {
  signup,
  login,
  createTokenByRefreshToken,
  getUser,
  getUsers,
  logout,
} = require("../controller/user");

const { protect, authorize } = require("../middleware/auth");

router.post("/singup", signup);
router.post("/login", login);
router.post("/get-token", createTokenByRefreshToken);

router.get("/get-users", protect, authorize("admin"), getUsers);
router.get("/get-user", protect, getUser);
router.get("/logout", protect, logout);

module.exports = router;
