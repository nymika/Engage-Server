var request = require('request');
const Assignment = require('../models/assignment.model');
const Submission = require('../models/submission.model');

/**
 * Function to send data about the code to the JDoodle Compiler API - 
 * @params req, TestCaseOutput, probem
 * @returns the compiler output
 */
const runCompiler = (req, TestCaseOutput, problem) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.jdoodle.com/v1/execute',
            method: "POST",
            json: req
        },
            function (error, response, body) {
                if (error) {
                    // console.log('error:', error);
                    return reject(error);
                }
                else {
                    // console.log('statusCode:', response && response.statusCode);
                    // console.log('body:', body);

                    if (body.memory == null || body.cpuTime == null) {
                        body = {};
                        body.status = 'Error';
                        return resolve(body);
                    }

                    if (parseInt(problem.time) < parseInt(body.cpuTime)) {
                        body.status = 'TLE';
                        return resolve(body);
                    }

                    if (parseInt(problem.memory)*1000 < parseInt(body.memory)) {
                        body.status = 'MLE';
                        return resolve(body);
                    }

                    if (TestCaseOutput !== body.output.trim()) {
                        body.status = 'WA';
                        return resolve(body);
                    }

                    body.status = 'AC';
                    return resolve(body);
                }
            });
    })
}

/**
 * Function to return problem details - 
 * @async
 * @method
 * @params req, res
 * @returns the found problem
 */
const ProblemDetail = async (req, res) => {
    try {
        let assignments = await Assignment.findOne({ assignment_code: req.body.assignmentCode });
        if (!assignments)
            return res.status(400).send({ "message": "Assignment not found" });

        let problem = assignments.problems.filter((problem) => {
            return String(problem._id) === String(req.body.problemId);
        })
        if (!problem.length)
            return res.status(400).send({ "message": "Problem not found" });

        return problem[0];
    }
    catch (e) {
        return res.status(400).json({ error: "Error Occured!" });
    };
};

/**
 * Function to run the compiler function for every input/output of the problem - 
 * @async
 * @method
 * @params req, res
 * @returns the list of results of each testcase
 */
var callProblemDetails = async (req, res) => {
    const problem = await ProblemDetail(req, res);
    var data = {
        script: req.body.source_code,
        language: req.body.language,
        time_limit: problem.time,
        versionIndex: req.body.versionIndex,
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
    }
    var InputArray = JSON.parse(problem.input);
    var OutputArray = JSON.parse(problem.output);
    var ResultArray = [];
    var testCasesPassed = 0;

    for (let i = 0; i < InputArray.length; i++) {
        data.stdin = InputArray[i];
        var result = await runCompiler(data, OutputArray[i], problem);
        result.input = InputArray[i];
        ResultArray.push(result);
        if (result.status === 'AC')
            testCasesPassed += 1;
    }
    return ([testCasesPassed, ResultArray]);
};

/**
 * Function to create a new Submission - 
 * @async
 * @method
 * @params req, res
 * @returns the new submission created.
 */
exports.createNewSubmission = async function (req, res) {
    callProblemDetails(req)
        .then(async (result) => {
            const new_submission = new Submission({
                assignment_code: req.body.assignmentCode,
                problemId: req.body.problemId,
                problemName: req.body.problemName,
                UserId: req.body.UserId,
                language: req.body.language,
                source_code: req.body.source_code,
                submit_time: new Date,
                testCases_passed: result[0],
                result: result[1],
            });
            try {
                if (req.body.operation !== "runcode") {
                    await new_submission.save();
                }
                return res.status(200).send(new_submission);
            }
            catch (e) {
                res.status(401).send(e);
            }
        })
        .catch((err) => {
            return res.status(401).send(err.message)
        });
}

/**
 * Function to display list of submissions given id of a submission - 
 * @async
 * @method
 * @params req, res
 * @returns the found submission.
 */
exports.get_submission_details_id = async (req, res) => {
    try {
        var submission = await Submission.findOne({ _id: req.params.id });
        if (!submission)
            return res.status(400).send({ message: "submission not found" });
        return res.status(200).send(submission);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

/**
 * Function to display list of submissions given id of user - 
 * @async
 * @method
 * @params req, res
 * @returns the found list of submissions.
 */
exports.get_submission_details_userId = async (req, res) => {
    try {
        var submission = await Submission.find({ UserId: req.user._id });
        if (!submission)
            return res.status(400).send({ message: "submission not found" });
        return res.status(200).send(submission);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

/**
 * Function to display list of submissions given Assignment Code - 
 * @async
 * @method
 * @params req, res
 * @returns the found list of submissions.
 */
exports.get_submission_details_assignmentCode = async (req, res) => {
    try {
        var submission = await Submission.find({ assignment_code: req.params.assignmentCode });
        if (!submission)
            return res.status(400).send({ message: "submission not found" });
        return res.status(200).send(submission);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

/**
 * Function to display list of submissions given id of the problem - 
 * @async
 * @method
 * @params req, res
 * @returns the found list of submissions.
 */
exports.get_submission_details_problemId = async (req, res) => {
    try {
        var submissions = await Submission.find({
            assignment_code: req.params.assignment_code,
            problemId: req.params.problemId
        });

        if (!submissions)
            return res.status(400).send({ message: "submission not found" });
        return res.status(200).send(submissions);
    }
    catch (e) {
        res.status(400).send(e);
    }
}