const jwt = require("jsonwebtoken");
const secret = require("../../config/keys.json").secret;
const User = require("../models/user.model")

/**
 * Function to check Authentication of Instructor - 
 * @async
 * @method
 * @params req, res, next
 * @throws
 *    401: Access Denied. Token is not provided.
 *    400: You are not an instructor.
 *    401: Invalid Token. Please Authenticate! //(if using other's token)
 */

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access Denied!" });

    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    
    if (user.userType !== 'admin')
      return res.status(400).json({ message: "You are not an instructor." })

    req.user = user
    req.token = token
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token. Please Authenticate!" });
  }
};