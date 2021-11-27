const request = require('supertest')
const app = require('../src/app')
const Class = require('../src/models/class.model')
const { AdminOne, StudentOne, StudentTwo,
    classOneCode, classTwoCode, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create Class by Faculty', async () => {
    const response = await request(app)
        .post('/api/class/create')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send({
            className: "Computer Graphics",
            subjectCode: "BCCS-3002"
        })
        .expect(201)

    //Assert that the database was changed correctly.
    const new_class = await Class.findById(response.body.details._id)
    expect(new_class).not.toBeNull()
})

test('Should not create Class by Student', async () => {
    await request(app)
        .post('/api/class/create')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            className: "Computer Graphics",
            subjectCode: "BCCS-3002"
        })
        .expect(400)
})

test('Give classes created by Faculty', async () => {
    const response = await request(app)
        .post('/api/class/faculty')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .expect(200)

    //measure size of created classes.
    expect(response.body.length).toEqual(2)
})

test('Should join Class', async () => {
    await request(app)
        .post('/api/class/join')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            classCode: classOneCode
        })
        .expect(200)

    //Assert that the database was changed correctly.
    const new_class = await Class.findOne({ classCode: 'tSeiiJv' })
    expect(new_class.students.length).toBe(2)
})

test('Should not join non-existent Class', async () => {
    await request(app)
        .post('/api/class/join')
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send({
            classCode: 'tSeiiJ'
        })
        .expect(404)
})

test('Give classes joined by Student', async () => {
    const response = await request(app)
        .post('/api/class/')
        .set('Authorization', `${StudentTwo.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1)
})

test('Give details of class', async () => {
    const response = await request(app)
        .post(`/api/class/${classOneCode}`)
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.details[0].students.length).toBe(1)
})

test('should not Give details of non-existent class', async () => {
    await request(app)
        .post(`/api/class/tSeiiJ`)
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Displaying Details of Students in the Class with Code', async () => {
    const response = await request(app)
        .post(`/api/class/${classTwoCode}/students`)
        .set('Authorization', `${StudentOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.students.length).toBe(0)
})