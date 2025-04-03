const router = require('express').Router();
const Cohort = require("../models/Cohort.model");

// GET /api/cohorts - Get all cohorts
router.get("/", (req, res, next) => {
    Cohort.find({})
      .then((cohorts) => {
        console.log("Retrieved cohorts -> ", cohorts);
        res.json(cohorts);
      })
      .catch((error) => {
        // console.error("Error while retrieving cohorts ->", error);
        // res.status(500).json({ error: "Failed to retrieve cohorts" });
        next(error);
      });
  });
  
  // GET /api/cohorts/:cohortId - Get a single cohorts
  router.get("/:cohortId", async (req, res, next) => {
    try {
      const { cohortId } = req.params;
      const oneCohort = await Cohort.findById(cohortId);
      res
        .status(200)
        // .json({message: "Getting cohort with success", cohort: oneCohort})
        .json(oneCohort);
    } catch (error) {
      // console.error("Error while retrieving the cohort ->", error);
      // res.status(500).json({ error: "Failed to retrieve cohort" });
      next(error);
    }
  });
  
  // POST /api/cohorts - Create a new cohort
  router.post("/", (req, res, next) => {
    Cohort.create(req.body)
      .then((cohort) => {
        res.status(201).json(cohort);
      })
      .catch((error) => {
        // res.status(500).json({ errorMessage: "trouble creating" });
        // console.log(error);
        next(error);
      });
  });
  
  // PUT /api/cohorts/:cohortId - Update a single cohort
  router.put("/:cohortId", async (req, res, next) => {
    try {
      const updateCohort = await Cohort.findOneAndReplace(
        { _id: req.params.cohortId },
        {
          // _id: req.params.cohortId,
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
    } catch(err) {
      // console.error("Error while retrieving students ->", err);
      // res.status(500).json({ errorMessage: "trouble deleting the cohort" });
      next(err);
    }
  });
  
  // DELETE /api/cohorts/:cohortId - Delete a single cohort
  router.delete("/:cohortsId", (req, res, next) => {
    Cohort.findByIdAndDelete(req.params.cohortsId)
      .then((cohort) => {
        console.log("here is the deleted student", cohort);
        res.status(204).send();
      })
      .catch((error) => {
        // res.status(500).json({ errorMessage: "trouble creating" });
        // console.log(error);
        next(error);
      });
  });

module.exports = router;