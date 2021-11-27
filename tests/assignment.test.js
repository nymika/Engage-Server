const request = require('supertest')
const app = require('../src/app')
const Assignment = require('../src/models/assignment.model');
const { AdminOne,
    StudentOne,
    classOneCode,
    AssignmentOneCode,
    ProblemOneId,
    setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create new assignment', async () => {
    const response = await request(app)
        .post('/api/assignment/createNew')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send({
            assignment_code: "001",
            classCode: classOneCode,
            deadline: new Date()
        })
        .expect(201)

    //Assert that the database was changed correctly.
    const new_assignment = await Assignment.findById(response.body.assignment._id)
    expect(new_assignment).not.toBeNull()
})

test('should not create assignment with incorrect assignment Code', async () => {
    await request(app)
        .post('/api/assignment/createNew')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send({
            assignment_code: "0",
            classCode: classOneCode,
            deadline: new Date()
        })
        .expect(400)
})

test('should not create assignment by student', async () => {
    await request(app)
        .post('/api/assignment/createNew')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            assignment_code: "0",
            classCode: classOneCode,
            deadline: new Date()
        })
        .expect(400)
})

test('Displaying assignments of a class', async () => {
    const response = await request(app)
        .post('/api/assignment/display')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            classCode: classOneCode,
        })
        .expect(200)

    //Assert that the response has no assignment
    expect(response.body.assignments.length).toBe(1)
})

const ProblemTwo = {
    assignmentCode: AssignmentOneCode,
    problemStatement: '<p>Print Hello World in C</p>',
    problemName: 'Hello World',
    input: '[" "]',
    output: '["Hello World"]',
    explanation: 'Print Hello World',
    time: '1',
    memory: '1000',
    tags: ['Math']
}

test('Create Problems in an assignment', async () => {
    await request(app)
        .post('/api/assignment/addProblem')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send(ProblemTwo)
        .expect(201)
})

test('Students cannot Create Problems in an assignment', async () => {
    await request(app)
        .post('/api/assignment/addProblem')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send(ProblemTwo)
        .expect(400)
})

test('Display Problems of that assignment', async () => {
    const response = await request(app)
        .post('/api/assignment/displayProblem')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send({
            assignmentCode: '999',
        })
        .expect(200)
})

test('Display details of a problem', async () => {
    await request(app)
        .post('/api/assignment/ProblemDetail')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            assignmentCode: '999',
            problemId: ProblemOneId
        })
        .expect(200)
})

test('cannot Display details of a problem with wrong problemId', async () => {
    await request(app)
        .post('/api/assignment/ProblemDetail')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            assignmentCode: '999',
            problemId: ProblemOneId + '1'
        })
        .expect(400)
})