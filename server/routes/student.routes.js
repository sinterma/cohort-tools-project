const router = require('express').Router();
const Student = require("../models/Student.model");

// GET /api/students - Get all students
router.get("/", (req, res, next) => {
    Student.find({})
      .populate("cohort")
      .then((students) => {
        console.log("Retrieved students -> ", students);
        res.json(students);
      })
      .catch((error) => {
        // console.error("Error while retrieving students ->", error);
        // res.status(500).json({ error: "Failed to retrieve  students" });
        next(error);
      });
  });
  
  // GET /api/students/:studentId - Get a single student
  router.get("/:studentId", (req, res, next) => {
    Student.findById(req.params.studentId)
      .populate("cohort")
      .then((oneStudent) => {
        res.status(200).json(oneStudent);
      })
      .catch((err) => {
        // res.status(500).json({ errMessage: "trouble finding the student" });
        next(err);
      });
  });
  
  // GET /api/students/cohort/:cohortId - Get all single students by a single cohort
  router.get("/cohort/:cohortId", async (req, res, next) => {
    try {
      const { cohortId } = req.params;
      const cohortStudents = await Student.find({ cohort: cohortId }).populate(
        "cohort"
      );
      res.status(200).json(cohortStudents);
    } catch (error) {
      // res
      //   .status(500)
      //   .json({ errorMessage: "Error while getting the students by cohort3" });
      // console.log(error);
      next(error);
    }
  });
  
  // POST /api/students - Create a new student
  router.post("/", async (req, res, next) => {
    try {
      const createdStudent = await Student.create(req.body);
      console.log("we created a student:", createdStudent);
      res.status(201).json(createdStudent);
    } catch (err) {
      console.log(err);
      // res.status(500).json({ errorMessage: "server Error" });
      next(err)
    }
  });
  
  // DELETE /api/students/:studentId - Delete a single student
  router.delete("/:studentId", (req, res, next) => {
    Student.findByIdAndDelete(req.par)
      .then((deletedStudent) => {
        console.log("here is the deletede student", deletedStudent);
        res.status(204).send();
      })
      .catch((error) =>{
        // res.status(500).json({ errorMessage: "trouble deleting student" })
      next(error);
      });
  });
  
  // PUT /api/students/:studentId - Update a single student
  router.put("/:studentId", (req, res, next) => {
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
      }, {new : true}
    )
      .then((updatedStudent) => {
        res.status(200).json(updatedStudent);
      })
      .catch((error) => {
        // res.status(500).json({ message: "Server Error" });
        next(error);
      });
  });




module.exports = router;