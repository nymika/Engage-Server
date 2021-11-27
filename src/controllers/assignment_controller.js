const Assignment = require('../models/assignment.model.js');

/**
 * Function to create a new Assignment - 
 * @async
 * @method
 * @params req, res
 * @returns the new assignment created.
 */
exports.createNewAssignment = async (req, res) => {

    let new_assignment = new Assignment({
        facultyId: req.user.email,
        created_at: new Date,
        assignment_code: req.body.assignment_code,
        classCode: req.body.classCode,
        deadline: req.body.deadline,
    });
    try {
        if (req.body.assignment_code.length !== 3) {
            let errors = {
                message: "Assignment Code length should be 3."
            };
            return res.status(400).json(errors);
        }

        var exists = await Assignment.findOne({
            assignment_code: new_assignment.assignment_code
        });
        if (exists) {
            let errors = {
                message: "Assignment with this code already exists."
            };
            return res.status(400).json(errors);
        }

        var assignment = await new_assignment.save();
        return res.status(201)
            .json({
                message: "Assignment Created Successfully",
                assignment
            });
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
};

/**
 * Function to display assignments of a class - 
 * @async
 * @method
 * @params req, res
 * @returns list of assignments
 */
exports.displayAssignments = async (req, res) => {
    try {
        let assignments = await Assignment.find({ classCode: req.body.classCode });
        return res.status(200).json({ assignments });
    }
    catch {
        return res.status(400).json({ error: "Error Occured!" });
    };
};

/**
 * Function to add a problem to an assignment - 
 * @async
 * @method
 * @params req, res
 * @returns the updated assignment with new problem.
 */
exports.addProblem = async (req, res) => {
    if (!req.body.hasOwnProperty('input')) {
        return res.status(400).send({ message: 'Empty testcase. If you intentionally left it blank, please put <space>' });
    }
    var new_problem = req.body;
    var input = JSON.parse(req.body.input);
    var output = JSON.parse(req.body.output);
    var testcases = [];
    for (var i = 0; i < input.length; i++) {
        testcases.push({
            input: input[i],
            output: output[i]
        });
    }
    new_problem.sampleTestcases = testcases;

    try {
        theAssignment = await Assignment.updateOne({
            assignment_code: req.body.assignmentCode
        }, {
            $push: { problems: new_problem }
        }, { new: true });

        if (!theAssignment)
            return res.status(400).send("error");
        return res.status(201).send({ assignment: theAssignment });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ message: e })
    };
}


/**
 * Function to display problems of an assignment - 
 * @async
 * @method
 * @params req, res
 * @returns list of problems
 * @throws
 *    400: Assignment does not exist
 */
exports.displayProblem = async (req, res) => {
    try {
        let assignments = await Assignment.findOne({ assignment_code: req.body.assignmentCode });
        if (!assignments)
            return res.status(400).send({
                message: "This assignment does not exist"
            });
        return res.status(200).json({ problems: assignments.problems });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ error: "Error Occured!" });
    };
};

/**
 * Function to give details of a problem - 
 * @async
 * @method
 * @params req, res
 * @returns details of the problem found
 * @throws
 *    400: Problem not found / Assignment Not Found
 */
exports.ProblemDetail = async (req, res) => {
    try {
        let assignments = await Assignment.findOne({ assignment_code: req.body.assignmentCode });
        if (!assignments)
            return res.status(400).send({ "message": "Assignment not found" });

        let problem = assignments.problems.filter((problem) => {
            return String(problem._id) === String(req.body.problemId);
        })

        if (!problem.length)
            return res.status(400).send({ "message": "Problem not found" });

        return res.status(200).send(problem[0]);
    }
    catch (e) {
        console.log(e)
        return res.status(400).json({ error: "Error Occured!" });
    };
};