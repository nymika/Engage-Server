const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const User = require('../../src/models/user.model')
const Class = require('../../src/models/class.model')
const Assignment = require('../../src/models/assignment.model')
const Submission = require('../../src/models/submission.model')

const AdminOneId = new mongoose.Types.ObjectId()
const AdminOne = {
    _id: AdminOneId,
    firstname: "AdminOne",
    lastname: "one",
    email: "adminOne@gmail.com",
    password: "adminOne",
    confirmPassword: "adminOne",
    userType: "admin",
    phoneNumber: "9876543210",
    tokens: [{
        token: jwt.sign({ _id: AdminOneId }, process.env.JWT_SECRET)
    }]
}

const StudentOneId = new mongoose.Types.ObjectId()
const StudentOne = {
    _id: StudentOneId,
    firstname: "StudentOne",
    lastname: "one",
    email: "bcs_1@iiitm.ac.in",
    password: "studentOne",
    confirmPassword: "studentOne",
    userType: "student",
    phoneNumber: "9876543210",
    tokens: [{
        token: jwt.sign({ _id: StudentOneId }, process.env.JWT_SECRET)
    }]
}

const StudentTwoId = new mongoose.Types.ObjectId()
const StudentTwo = {
    _id: StudentTwoId,
    firstname: "StudentTwo",
    lastname: "two",
    email: "imt_2@iiitm.ac.in",
    password: "studentTwo",
    confirmPassword: "studentTwo",
    userType: "student",
    phoneNumber: "9876543210",
    tokens: [{
        token: jwt.sign({ _id: StudentTwoId }, process.env.JWT_SECRET)
    }]
}

const classOneCode = 'tSeiiJv'
const ClassOne = {
    _id: new mongoose.Types.ObjectId(),
    facultyId: AdminOne.email,
    className: "Course One",
    subjectCode: "BCCS-1",
    classCode: classOneCode,
    students: [StudentTwoId],
}

const classTwoCode = '7OxDUDk'
const ClassTwo = {
    _id: new mongoose.Types.ObjectId(),
    facultyId: AdminOne.email,
    className: "Course Two",
    subjectCode: "BCCS-2",
    classCode: classTwoCode,
    students: [],
}

const AssignmentOneCode = '999';
const ProblemOneId = new mongoose.Types.ObjectId();
const ProblemOne = {
    _id: ProblemOneId,
    assignmentCode: AssignmentOneCode,
    problemStatement: '<p>Print Hello World</p>',
    problemName: 'Hello World',
    input: '[" "]',
    output: '["Hello World"]',
    explanation: 'Print Hello World',
    time: '1',
    memory: '10000',
    tags: ['Math']
}

const AssignmentOne = {
    _id: new mongoose.Types.ObjectId(),
    assignment_code: AssignmentOneCode,
    classCode: classOneCode,
    facultyId: AdminOne.email,
    created_at: new Date(),
    deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    problems: [ProblemOne]
}

const SubmissionOneId = new mongoose.Types.ObjectId()
const SubmissionOne = {
    _id: SubmissionOneId ,
    assignmentCode: AssignmentOneCode,
    problemId: ProblemOneId,
    problemName: 'Hello World',
    UserId: StudentTwoId,
    source_code: "print('Hello world')",
    language: 'python3',
    submit_time: new Date(),
    testCases_passed: 1,
    result: [{
        output: "Hello world",
        input: "",
        statusCode: 200,
        memory: "7648",
        cpuTime: "0.01",
        status: "MLE",
        _id: new mongoose.Types.ObjectId()
    }]
}

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(AdminOne).save();
    await new User(StudentOne).save();
    await new User(StudentTwo).save();

    await Class.deleteMany();
    await new Class(ClassOne).save();
    await new Class(ClassTwo).save();

    await Assignment.deleteMany();
    await new Assignment(AssignmentOne).save();

    await Submission.deleteMany();
    await new Submission(SubmissionOne).save();
}

module.exports = {
    AdminOneId,
    AdminOne,
    StudentOneId,
    StudentOne,
    StudentTwoId,
    StudentTwo,
    classOneCode,
    classTwoCode,
    AssignmentOneCode,
    ProblemOne,
    ProblemOneId,
    SubmissionOneId,
    setupDatabase
}