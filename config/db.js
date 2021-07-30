const mongoose = require("mongoose");
const connectDB = async () => {
  const conn = await mongoose.connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  `MongoDB Connected : ${conn.connection.host}`;
};

module.exports = connectDB;
