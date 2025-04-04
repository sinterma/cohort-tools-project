require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");


// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohorts =require("./cohorts.json");
// const students=require("./students.json");
// ...

const cohortRoute = require("./routes/cohort.routes.js");
const studentRoute = require("./routes/student.routes.js");
const authRoute = require('./routes/auth.routes.js');
const userRoute = require('./routes/user.routes.js');



// Import the custom error handling middleware:
const { errorHandler, notFoundHandler } = require('./middleware/error-handling');
 


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// CONNECTION WITH MONGODB
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.use("/api/cohorts", cohortRoute);
app.use("/api/students", studentRoute);
app.use("/auth", authRoute);
app.use("/api/users", userRoute);

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
// ...




// Set up custom error handling middleware:
app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
