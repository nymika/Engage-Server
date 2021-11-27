const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    userType: {
        type: String,
        enum: ['admin', 'student'],
        default: ''
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    tokens:[{}]
});

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    //Generate token
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
}

UserSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next();
})

module.exports = mongoose.model('User', UserSchema);