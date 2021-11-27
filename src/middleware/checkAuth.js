const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

/**
 * Function to check Authentication - 
 * @async
 * @method
 * @params req, res, next
 * @throws
 *    401: Access Denied. Token is not provided.
 *    401: Invalid Token. Please Authenticate! //(if using other's token)
 */
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access Denied!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error()
    }
    
    req.user = user
    req.token = token
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token. Please Authenticate!" });
  }
};