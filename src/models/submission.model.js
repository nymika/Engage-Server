const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    assignment_code: String,
    problemId: String,
    problemName: String,
    UserId: { type: String, required: true },
    language: String,
    source_code: String,
    submit_time: Date,
    testCases_passed: Number,
    result: [{
        output: String,
        input: String,
        statusCode: Number,
        memory: String,
        cpuTime: String,
        status: String
    }]
});

module.exports = mongoose.model('Submission', SubmissionSchema);