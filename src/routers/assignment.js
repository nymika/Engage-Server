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

// router.put('/asgn/updateAsgn', admin_controller.put_update_assignment);

// router.post('/asgn/dropProb', admin_controller.post_drop_problem);
// router.put('/asgn/updateProb', admin_controller.put_update_problem);

// router.get('/announcement/:asg_code', admin_controller.get_announcement);
// router.post('/announcement', admin_controller.post_announcement);
// router.delete('/announcement', admin_controller.delete_announcement);

/* 
router.get('/submission/:sid', admin_controller.get_submission);
router.delete('/deleteallsub/:asg_code', admin_controller.delete_all_submission);
*/

module.exports = router;