const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Assignment = new Schema({
    assignment_code: { type: String, unique: true }, //3 digit only.
    facultyId: { type: String, required: true },
    created_at: Date,
    deadline: Date,
    classCode: String,
    // name:String,
    // email:String,
    // solved:[String],
    problems: [
        {
            problemName: String,
            problemStatement: String,
            sampleTestcases: [{
                input: [String],
                output: [String],
            }],
            input: [String],
            output: [String],
            testCaseFile: {},
            solutionFile:{},
            explanation: String,
            time: String,
            memory: String,
            tags: [String],
        }
    ]
    // problems:[
    //     {
    //         problemId: { type: String, required: true },
    //         tags: [String],
    //         name: String,
    //         description: String,
    //         time_limit: Number,
    //         //memory_limit: Number,
    //         solved:[String],
    //         avail:Boolean,
    //         test_cases:[
    //             {
    //                 in:String,
    //                 out:String
    //             }
    //         ]
    //     }
    // ]
});

module.exports = mongoose.model('Assignment', Assignment);