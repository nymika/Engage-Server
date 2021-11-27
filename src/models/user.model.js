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
    // assignment:{ type:[mongoose.Schema.Types.ObjectId]}
});

// UserSchema.statics.findByCredentials=async (email,password)=>{
//     const user=await User.findOne({email}) //how to use this.
//     if(!user){
//         throw new Error("User does not exist.");
//     }
//     console.log(user);
//     console.log(1);
//     const isMatch=await bcrypt.compare(password,user.password)
//     if(!isMatch){
//         throw new Error("Password Mismatch");
//     }
//     return user;
// }

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

// const validator = require('validator')
// const jwt = require('jsonwebtoken')
// const secret = require("../config/keys.json").secret;

// const UserSchema = new Schema({
//     name: { 
//         firstName: String,
//         lastName: String
//     },
//     email: {
//         type: String, 
//         required: true,
//         unique: true,
//         trim: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Invalid Email!')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 3,
//         trim: true
//     },
//     userType: {
//         type: String,
//         enum: ['admin', 'student'],
//         default: 'student'
//     },
//     phoneNumber: {
//         type: String,
//         trim: true,
//         validate(value) {
//             if (!validator.isMobilePhone(value, 'en-IN')) {
//                 throw new Error('Invalid Mobile Number')
//             }
//         }
//     },
//     tokens: [{}]
//     // assignment:{ type:[mongoose.Schema.Types.ObjectId]}
// });

// // userSchema.virtual('class', {
// //     ref: 'Class',
// //     localField: '_id',
// //     foreignField: 'admin'
// // })

// // userSchema.virtual('submission', {
// //     ref: 'Submission',
// //     localField: '_id',
// //     foreignField: 'submissions.submitedBy'
// // })