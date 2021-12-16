var express = require("express");
var app = express();
require("dotenv").config();

var cors = require('cors')
app.use(cors())

// include database config file
const db = require("./src/config/sequelize.js");

// force: true will drop the table if it already exists
db.sequelize.sync();

app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get("",(req,res)=>{
  res.status(201).json("welcome")
})

// include application routes
require("./src/routes/userRouter.js")(app);


const port = process.env.PORT || 8000
// Create & Listen Server
app.listen(port,()=>{
  console.log(`server listening port no. ${port}`);
});
