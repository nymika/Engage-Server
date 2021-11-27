const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Assignment = new Schema({
    assignment_code: { type: String, unique: true },
    facultyId: { type: String, required: true },
    created_at: Date,
    deadline: Date,
    classCode: String,
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
});

module.exports = mongoose.model('Assignment', Assignment);