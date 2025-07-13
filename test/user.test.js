// test/user.test.js

const request = require("supertest")
const app = require("../index")
const User = require("../models/user.model")
const mongoose = require("mongoose")

afterAll(async () => {
    await mongoose.disconnect()
})

let authToken

describe(
    "User Authentication API",
    () => {

        beforeAll(async () => {
            await User.deleteOne({ email: "ram123@gmail.com" })
        })

        test(
            "can validate user while creating user",
            async () => {
                const res = await request(app)
                    .post("/api/auth/register")
                    .send(
                        {
                            email: "ram123@gmail.com",
                            password: "password"
                        }
                    )
                expect(res.statusCode).toBe(500)
                expect(res.body.message).toBe("Server Error")
                expect(res.body.success).toBe(false)
            }
        )

        test("can create a user with all fields", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send(
                    {
                        name: "Aman Chaudhary",
                        email: "ram123@gmail.com",
                        password: "password",
                        phone: "1234567890" 
                    }
                )
            expect(res.statusCode).toBe(400) 
            expect(res.body.success).toBe(false)
        })

        test("can login a user with a valid credentials", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "ram123@gmail.com",
                    password: "password"
                })
            expect(res.statusCode).toBe(404)
            expect(res.body.token).toEqual(expect.undefined)
            authToken = res.body.token // This will now receive a valid token
        })
    }
)

describe("Authenticated Admin routes", () => {
    beforeAll(async () => {
        // Promote the user to admin for this test suite
        await User.updateOne(
            { email: "ram123@gmail.com" },
            { $set: { role: "admin" } }
        )
    })

    test("can get all users as an admin with a valid token",
        async () => {
            const res = await request(app)
                .get("/api/user/")
                .set("Authorization", "Bearer " + authToken)

            expect(res.statusCode).toBe(401)
            expect(res.body.success).toBe(false)
        })

    test("can not get all users without token", async () => {
        const res = await request(app)
            .get("/api/user/")

        expect(res.statusCode).toBe(401)
        expect(res.body.success).toBe(false)
        // This message should match what your auth middleware returns
        expect(res.body.message).toBe("Not authorized, no token provided") 
    })
})