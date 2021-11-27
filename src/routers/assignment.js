const router = require('express').Router();
const checkAuth = require("../middleware/checkAuth");
const checkFaculty = require("../middleware/checkFaculty");
const {
    createNewAssignment,
    displayAssignments,
    addProblem,
    displayProblem,
    ProblemDetail
} = require("../controllers/assignment_controller.js");

router.post('/createNew', checkFaculty, createNewAssignment);
router.post('/display', checkAuth, displayAssignments);

router.post('/addProblem', checkFaculty, addProblem);
router.post('/displayProblem', checkAuth, displayProblem); 
router.post('/ProblemDetail', checkAuth, ProblemDetail);

module.exports = router;