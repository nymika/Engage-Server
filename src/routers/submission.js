const router = require('express').Router();
const checkAuth = require("../middleware/checkAuth");
const checkFaculty = require("../middleware/checkFaculty");

const {
    createNewSubmission,
    get_submission_details_id,
    get_submission_details_userId,
    get_submission_details_assignmentCode,
    get_submission_details_problemId,
} = require('../controllers/submission_controller');


router.post('/new', checkAuth, createNewSubmission);
router.post('/getByID/:id', checkAuth, get_submission_details_id);
router.post('/getByUserId', checkAuth, get_submission_details_userId);
router.post('/getByAssignment/:assignment_code', checkAuth, get_submission_details_assignmentCode);
router.post('/getByProblemId/:assignment_code/:problemId', checkAuth, get_submission_details_problemId);

module.exports = router;