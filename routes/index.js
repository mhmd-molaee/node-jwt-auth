const auth = require("./user");

module.exports = function (app) {
  app.use("/api/v1/auth", auth);
};
