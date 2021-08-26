require("dotenv").config();
const mongoose = require("mongoose");

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.ATLAS_CLUSTER}/`;
const DB = process.env.DB_NAME;

mongoose.connect(DB_URI + DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
});
const db = mongoose.connection;

db.once("open", () => console.log(`Connected to ${DB} database`));

module.exports = db;
