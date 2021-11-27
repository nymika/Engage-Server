/* const lang = require('../lang'); */
// const User = require("../models/user.model.js");
const Assignment = require('../models/assignment.model.js');
// const Announcement=require('../models/announcement.model.js');
/* const Submission = require('../models/submission');*/


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

        //adding assignments to Students list.
        //     User.updateOne({ email: req.body.email }, { $push: { assignment: assignment._id } }, (err, result) => {
        //         if (err)
        //             return res.send(err.message);
        //         else {
        //             console.log(assignment);
        //             return res.status(200).send({ assignment: assignment });
        //         }
        //     });
        // }
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

//update Assignment
// exports.put_update_assignment = async (req, res) => {

//     Assignment.updateOne({ asg_code: req.body.asg_code }, { $set: { name: req.body.name, course: req.body.course, deadline: req.body.deadline } }, { new: true }, (err, asgn) => {

//         if (err)
//             return res.send(err.message);
//         else
//             return res.status(200).send({ assignment: asgn });
//     })
// }

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

// //drop problem.
// exports.post_drop_problem = async (req, res) => {
//     Assignment.updateOne({ asg_code: req.body.asg_code }, { $pull: { "problems": { pid: req.body.pid } } }, { new: true }, (err, asgn) => {
//         if (err)
//             return res.send(err.message);
//         else
//             return res.status(200).send({ assignment: asgn });
//     });
// }

// //Update Problem
// exports.put_update_problem = async (req, res) => {

//     if (!req.body.hasOwnProperty('test-input')) {
//         return res.status(400).send({ message: 'Empty testcase' });
//     }
//     var testcases = [];

//     for (var i = 0; i < req.body['test-input'].length; i++) {
//         testcases.push({ in: req.body['test-input'][i], out: req.body['test-output'][i] })
//     }

//     Assignment.updateOne({ "asg_code": req.body.asg_code, "problems.pid": req.body.pid }, { $set: { "problems.$.name": req.body.name, "problems.$.desc": req.body.desc, "problems.$.time_limit": req.body.time_limit, "problems.$.test_cases": testcases } }, { new: true }, (err, asgn) => {

//         if (err)
//             return res.send(err.message);
//         else
//             return res.status(200).send({ assignment: asgn });
//     })
// }

// //Get Announcement.
// exports.get_announcement = async (req, res) => {

//     Announcement.find({ asg_code: req.params.asg_code }, (err, announcements) => {
//         if (err)
//             return res.send(err.message);
//         else
//             return res.status(200).send(announcements);
//     });
// }

// //Post Announcement
// exports.post_announcement = async (req, res) => {

//     var new_announcement = new Announcement({
//         date: new Date,
//         asg_code: req.body.asg_code,
//         desc: req.body.desc
//     });

//     new_announcement.save((err, announcement) => {
//         if (err)
//             return res.send(err.message);
//         else
//             return res.status(200).send(announcement);
//     });
// }

// //Delete Annoucement
// exports.delete_announcement = async (req, res) => {
//     Announcement.deleteOne({ _id: req.body.id }, (err, announcement) => {
//         if (err)
//             return res.send(err.message);
//         else
//             return res.status(200).send(announcement);
//     });
// }