const config = require("./config.js")

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "user_database",
  "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);
sequelize
  .authenticate()
  .then(() => console.log("Database connect successfully"))
  .catch((err) => console.log(err));


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models
db.user = require("../models/user.js")(sequelize, Sequelize);

module.exports = db;