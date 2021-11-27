const router = require("express").Router();
const checkAuth = require("../middleware/checkAuth");
const checkFaculty = require("../middleware/checkFaculty");

const {
  create_Class,
  Facultyclasses,
  Studentclasses,
  singleClass,
  joinClass,
  displayStudents,
  // announcement,
  // posts,
} = require("../controllers/class_controller.js");

router.post("/create", checkFaculty, create_Class);
router.post("/join", checkAuth, joinClass);
router.post("/faculty", checkFaculty, Facultyclasses); //gives classes created by faculty.
router.post("/", checkAuth, Studentclasses); //gives classes joined by user;
router.post("/:classCode", checkAuth, singleClass);
router.post("/:classCode/students", checkAuth, displayStudents);

// router.post("/:classCode/assignment", checkAuth, createAssignment);
// router.get("/:classCode/posts", checkAuth, posts);

module.exports = router;
