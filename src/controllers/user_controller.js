const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

/**
 * Function to check if student is using college ids. - 
 * @params input Email
 * @returns boolean.
 */
function isValidEmail(input) {
  const emails = [
    /^student_[0-9]+@iiitm.ac.in$/,
    /^bcs_[0-9]+@iiitm.ac.in$/,
    /^imt_[0-9]+@iiitm.ac.in$/,
    /^ipg_[0-9]+@iiitm.ac.in$/
  ];
  for (var i = 0; i < emails.length; i++) {
    if (emails[i].test(input)) return true;
  }
  return false;
}

/**
 * Function to user Signup - 
 * @async
 * @method
 * @params req, res
 * @returns SignedUp new user, token.
 */
exports.user_signup = async (req, res) => {
  let {
    firstname, lastname, email, password, confirmPassword, userType, phoneNumber,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password doesn't match" });
  }

  if (userType !== "admin") { //students should login through college ids only.
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Please enter your college id. Eg: bcs_3@iiitm.ac.in" });
  }

  try {
    var user = await User.findOne({
      $or: [{ email: email }, { firstname: firstname }]
    });
    if (user) {
      let errors = {};
      if (user.firstname === firstname) { errors.message = "First Name already exists"; }
      else { errors.message = "Email already registered"; }
      return res.status(400).json(errors);
    }

    var newUser = new User({ firstname, lastname, email, password, userType, phoneNumber });
    await newUser.save();

    const token = await newUser.generateAuthToken();
    return res.status(201).send({
      message: "User is registered!",
      user: newUser,
      token,
    })
  }
  catch (err) {
    res.status(400).json('Error: ' + err)
  }
};

/**
 * Function to Login User - 
 * @async
 * @method
 * @params req, res
 * @returns user, token.
 * @throws
 *    401: Access Denied. Token is not provided.
 *    401: Invalid Token. Please Authenticate! //(if using other's token)
 */
exports.user_login = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = await user.generateAuthToken();
    return res.status(200).send({
      user,
      token,
      msg: "You are logged in!"
    });
  } catch (e) {
    return res.status(404).send(e);
  }
}

/**
 * Function to display Profile - 
 * @params req, res
 * @returns user Data
 */
exports.user_profile = function (req, res) {
  res.send(req.user);
};

/**
 * Function to display profile by id - 
 * @async
 * @method
 * @params req, res
 */
 exports.user_profile_byId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId })
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send()
  }
}

/**
 * Function to Logout user - 
 * @async
 * @method
 * @params req, res
 */
exports.user_logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send()
  }
}

/**
 * Function to Logout user from all devices - 
 * @async
 * @method
 * @params req, res
 */
exports.user_logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(501).send(e)
  }
}