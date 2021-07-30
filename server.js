const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();
const app = express();

app.set("trust proxy", true);

// Body parser
app.use(express.json());

require("./routes")(app);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
