const request = require('supertest')
const app = require('../src/app')
const { StudentTwo, StudentTwoId,
    AssignmentOneCode,
    ProblemOne, ProblemOneId,
    SubmissionOneId,
    setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create new submission', async () => {
    const SubmissionTwo = {
        assignmentCode: AssignmentOneCode,
        problemId: ProblemOneId,
        problemName: ProblemOne.problemName,
        UserId: StudentTwoId,
        source_code: "print('Hello World')",
        language: 'python3',
        versionIndex: '3',
        stdin: ['[""]'],
        clientId: 'fa3079e7af9200ea0bb5d0dcb3e88225',
        clientSecret: '80c439bc7c89587e9f60a125e1b1b6101be9d86f174f65df071840822e7d2544',
        operation: 'submit'
    }

    const response = await request(app)
        .post('/api/submission/new')
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .send(SubmissionTwo)
        .expect(200)

    expect(response.body.result[0].status).toBe('AC');
})

test('Submission gives error without API Client Id', async () => {
    const SubmissionTwo = {
        assignmentCode: AssignmentOneCode,
        problemId: ProblemOneId,
        UserId: StudentTwoId,
        source_code: "print('Hello World')",
        language: 'python3',
        versionIndex: '3',
        stdin: ['[""]'],
        clientId: '',
        clientSecret: '80c439bc7c89587e9f60a125e1b1b6101be9d86f174f65df071840822e7d2544',
        operation: 'submit'
    }

    const response = await request(app)
        .post('/api/submission/new')
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .send(SubmissionTwo)
        .expect(200)

    expect(response.body.result[0].status).toBe('Error');
})

test('Display submission, given id of that submission', async () => {
    await request(app)
        .post(`/api/submission/getByID/${SubmissionOneId}`)
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .expect(200)
})

test('should not display submission, given wrong id of that submission', async () => {
    await request(app)
        .post(`/api/submission/getByID/${SubmissionOneId + 1}`)
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .expect(400)
})

test('Display submissions of a user, given id of a user', async () => {
    const response = await request(app)
        .post(`/api/submission/getByUserId`)
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .expect(200)
    expect(response.body.length).toBe(1);
})

test('Display submissions of a problem, given problem id', async () => {
    const response = await request(app)
        .post(`/api/submission/getByProblemId/${AssignmentOneCode}/${ProblemOneId}`)
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .expect(200)
    expect(response.body).not.toBe(null);
})