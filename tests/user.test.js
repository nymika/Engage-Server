const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user.model')
const { AdminOneId, AdminOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/api/user/signup').send({
        firstname: "Nymika",
        lastname: "Pasnoori",
        email: "p.nymika@gmail.com",
        password: "myPass",
        confirmPassword: "myPass",
        userType: "admin",
        phoneNumber: "9876543210"
    }).expect(201)

    //Assert that the database was changed correctly.
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response.
    expect(response.body).toMatchObject({
        user: {
            firstname: "Nymika",
            lastname: "Pasnoori",
            email: "p.nymika@gmail.com",
            userType: "admin",
            phoneNumber: "9876543210"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('myPass')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/api/user/login').send({
        email: AdminOne.email,
        password: AdminOne.password
    }).expect(200)

    //Validate new token is saved.
    const user = await User.findById(AdminOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Login should fail', async () => {
    await request(app).post('/api/user/login').send({
        email: AdminOne.email,
        password: 'invalid_Password'
    }).expect(400)
})

test('Should get profile', async () => {
    await request(app)
        .post('/api/user/profile')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get Profile for unauthenticated user', async () => {
    await request(app)
        .post('/api/user/profile')
        .send()
        .expect(401)
})

test('Should logout existing user', async () => {
    await request(app)
        .post('/api/user/logout')
        .set('Authorization', `${AdminOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Validate token is removed.
    const user = await User.findById(AdminOneId)
    expect(user.tokens).toHaveLength(0)
})
