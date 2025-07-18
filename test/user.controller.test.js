const request = require("supertest");
const app = require("../index");
const User = require("../models/user.model");
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close();
});

let authToken;

describe("User Authentication API", () => {
  beforeAll(async () => {
    await User.deleteOne({ email: "ram123@gmail.com" });
  });

  test("should return error if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "ram123@gmail.com", password: "password" });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Server Error");
    expect(res.body.success).toBe(false);
  });

  test("should create a user with all required fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Aman Chaudhary",
        email: "ram123@gmail.com",
        password: "password",
        phone: "1234567890",
      });

    expect(res.statusCode).toBe(201); 
    expect(res.body.success).toBe(true); 
  });

  test("should login a user with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ram123@gmail.com",
        password: "password",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });
});

describe("Authenticated Admin Routes (/api/user)", () => {
  beforeAll(async () => {
    // Promote the user to admin
    await User.updateOne(
      { email: "ram123@gmail.com" },
      { $set: { role: "admin" } }
    );
  });

  test("should fetch all users (GET /api/user)", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should fetch a single user by ID (GET /api/user/:id)", async () => {
    const user = await User.findOne({ email: "ram123@gmail.com" });
    const res = await request(app)
      .get(`/api/user/${user._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("ram123@gmail.com");
  });



 test("should NOT update user role if not authorized (PUT /api/user/role/:userToUpdateId)", async () => {
  const user = await User.findOne({ email: "ram123@gmail.com" });
  
  const res = await request(app)
    .put(`/api/user/role/${user._id}`)
    .set("Authorization", `Bearer ${authToken}`)
    .send({ newRoles: "guide" });

  expect(res.statusCode).toBe(403);
  expect(res.body).toHaveProperty("message", "Not authorized as an admin");
  expect(res.body).toHaveProperty("success", false);
});


  test("should delete user (DELETE /api/user/:id)", async () => {
    const user = await User.findOne({ email: "ram123@gmail.com" });
    const res = await request(app)
      .delete(`/api/user/${user._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });
});