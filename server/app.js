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
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

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
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
// ...

// GET /api/cohorts - Get all cohorts
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts -> ", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

// GET /api/cohorts/:cohortId - Get a single cohorts
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const { cohortId } = req.params;
    const oneCohort = await Cohort.findById(cohortId);
    res
      .status(200)
      // .json({message: "Getting cohort with success", cohort: oneCohort})
      .json(oneCohort);
  } catch (error) {
    console.error("Error while retrieving the cohort ->", error);
    res.status(500).json({ error: "Failed to retrieve cohort" });
  }
});

// POST /api/cohorts - Create a new cohort
app.post("/api/cohorts", (req, res) => {
  Cohort.create(req.body)
    .then((cohort) => {
      res.status(201).json(cohort);
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: "trouble creating" });
      console.log(error);
    });
});

// PUT /api/cohorts/:cohortId - Update a single cohort
app.put("/api/cohorts/:cohortId", async (res, req) => {
  try {
    const updateCohort = await Cohort.findOneAndReplace(
      { _id: req.params.cohortId },
      {
        cohortSlug: req.body.cohortSlug,
        cohortName: req.body.cohortName,
        program: req.body.program,
        format: req.body.format,
        campus: req.body.campus,
        startDate: req.body.startDate,
        endDate: req.body.endDate, // endDate: { type: Date },
        inProgress: req.body.inProgress,
        programManager: req.body.programManager,
        leadTeacher: req.body.leadTeacher,
        totalHours: req.body.totalHours,
      }
    );
    res.status(200).json(updateCohort);
  } catch (err) {
    res.status(500).json({ errorMessage: "trouble deleting the cohort" });
  }
});

// DELETE /api/cohorts/:cohortId - Delete a single cohort
app.delete("/api/cohorts/:cohortsId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortsId)
    .then((cohort) => {
      console.log("here is the deleted student", cohort);
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ errorMessage: "trouble creating" });
      console.log(error);
    });
});

// GET /api/students - Get all students
app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students -> ", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve  students" });
    });
});

// GET /api/students/:studentId - Get a single student
app.get("/api/students/:studentId", (req, res) => {
  Student.findById(req.params.studentId)
    .populate("cohort")
    .then((oneStudent) => {
      res.status(200).json(oneStudent);
    })
    .catch(() => {
      res.status(500).json({ errMessage: "trouble finding the student" });
    });
});

// GET /api/students/cohort/:cohortId - Get all single students by a single cohort
app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const { cohortId } = req.params;
    const cohortStudents = await Student.find({ cohort: cohortId }).populate(
      "cohort"
    );
    res.status(200).json(cohortStudents);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "Error while getting the students by cohort3" });
    console.log(error);
  }
});

// POST /api/students - Create a new student
app.post("/api/students", async (req, res) => {
  try {
    const createdStudent = await Student.create(req.body);
    console.log("we created a student:", createdStudent);
    res.status(201).json(createdStudent);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "server Error" });
  }
});

// DELETE /api/students/:studentId - Delete a single student
app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.par)
    .then((deletedStudent) => {
      console.log("here is the deletede student", deletedStudent);
      res.status(204).send();
    })
    .catch((error) =>
      res.status(500).json({ errorMessage: "trouble deleting student" })
    );
});

// PUT /api/students/:studentId - Update a single student
app.put("/api/students/:studentId", (req, res) => {
  Student.findOneAndReplace(
    { _id: req.params.studentId },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      linkedinUrl: req.body.linkedinUrl,
      languages: req.body.languages,
      program: req.body.program,
      background: req.body.background,
      image: req.body.image,
      cohort: req.body.cohort,
      projects: req.body.projects,
    }
  )
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((error) => {
      res.status(500).json({ message: "Server Error" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
