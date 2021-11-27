const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

/* initialize the app */
const app = express();
require('dotenv').config()

/* middleswares */
app.use(cors()); //cors middlesware
app.use(express.json()); //json body middlesware

const connection_string = process.env.NODE_ENV=="test" ? process.env.ATLAS_URI_TEST : process.env.ATLAS_URI

mongoose.connect(connection_string, {useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.use(passport.initialize());

const user_Router=require('./routers/user');
const class_Router = require('./routers/class');
const assignment_Router = require('./routers/assignment');
const submission_Router=require('./routers/submission');

app.use('/api/user',user_Router);
app.use('/api/class', class_Router);
app.use('/api/assignment', assignment_Router);
app.use('/api/submission', submission_Router);

module.exports = app