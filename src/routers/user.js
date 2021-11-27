const router = require('express').Router();;
const checkAuth = require("../middleware/checkAuth");

const {
    user_signup,
    user_login,
    user_logout,
    user_logoutAll,
    user_profile,
    user_profile_byId
} = require("../controllers/user_controller.js");

router.post('/signup', user_signup);
router.post('/login', user_login);

router.post('/logout', checkAuth, user_logout);
router.post('/logoutAll', checkAuth, user_logoutAll);

router.post('/profile', checkAuth, user_profile);
router.post('/profilebyId', checkAuth, user_profile_byId);

module.exports = router;