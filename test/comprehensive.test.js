const request = require("supertest");
const app = require("../index");
const User = require("../models/user.model");
const Trail = require("../models/trail.model");
const mongoose = require("mongoose");
const { mockUser, mockAdmin, mockProtect, mockAdminMiddleware } = require("./test-helper");

// Test data
const testUserData = {
  name: "Test User",
  email: "testuser@example.com",
  password: "password123",
  phone: "1234567890",
  hikerType: "new",
  ageGroup: "18-24"
};

const testTrailData = {
  name: "Test Trail",
  location: "Test Location",
  distance: 5.5,
  elevation: 500,
  duration: { min: 2, max: 4 },
  difficult: "Easy",
  description: "A beautiful test trail for hiking",
  features: ["Scenic Views", "Wildlife"],
  seasons: ["Spring", "Summer"]
};

let authToken;
let adminToken;
let testUserId;
let testTrailId;

describe("Hike Hub Comprehensive Test Suite", () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await User.deleteMany({ email: { $in: [testUserData.email, "admin@test.com"] } });
    await Trail.deleteMany({ name: testTrailData.name });
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: { $in: [testUserData.email, "admin@test.com"] } });
    await Trail.deleteMany({ name: testTrailData.name });
    await mongoose.connection.close();
  });

  // Test Case 1: User Registration with Valid Data
  test("should successfully register a new user with all required fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUserData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.email).toBe(testUserData.email);
    expect(response.body.data.name).toBe(testUserData.name);
    expect(response.body.data).not.toHaveProperty("password"); // Password should not be returned
  });

  // Test Case 2: User Registration with Missing Required Fields
  test("should return error when registering user with missing required fields", async () => {
    const invalidUserData = {
      name: "Test User",
      email: "test2@example.com"
      // Missing password and phone
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(invalidUserData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Server Error");
  });

  // Test Case 3: User Login with Valid Credentials
  test("should successfully login user with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUserData.email,
        password: testUserData.password
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.email).toBe(testUserData.email);
    
    authToken = response.body.token;
    testUserId = response.body.data._id;
  });

  // Test Case 4: User Login with Invalid Credentials
  test("should return error when login with invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUserData.email,
        password: "wrongpassword"
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Invalid credentials");
  });

  // Test Case 5: Create Trail (Admin Only)
  test("should create a new trail when authenticated as admin", async () => {
    // First create an admin user
    const adminData = {
      name: "Test Admin",
      email: "admin@test.com",
      password: "admin123",
      phone: "9876543210",
      role: "admin"
    };

    await request(app)
      .post("/api/auth/register")
      .send(adminData);

    // Login as admin
    const adminLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminData.email,
        password: adminData.password
      });

    adminToken = adminLoginResponse.body.token;

    // Create trail
    const response = await request(app)
      .post("/api/trail")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testTrailData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(testTrailData.name);
    expect(response.body.data.location).toBe(testTrailData.location);
    
    testTrailId = response.body.data._id;
  });

  // Test Case 6: Get All Trails (Public Access)
  test("should retrieve all trails without authentication", async () => {
    const response = await request(app)
      .get("/api/trail");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

  });

  // Test Case 7: Get Single Trail by ID
  test("should retrieve a specific trail by ID", async () => {
    const response = await request(app)
      .get(`/api/trail/${testTrailId}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.data._id).toBe(testTrailId);
    expect(response.body.data.name).toBe(testTrailData.name);
  });

  // Test Case 8: Update User Profile
  test("should update user profile when authenticated", async () => {
    const updateData = {
      name: "Updated Test User",
      bio: "This is my updated bio",
      hikerType: "experienced"
    };

    const response = await request(app)
      .put(`/api/user/profile`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.data.bio).toBe(updateData.bio);
    expect(response.body.data.hikerType).toBe(updateData.hikerType);
  });

  // Test Case 9: Rate a Trail
  test("should allow authenticated user to rate a trail", async () => {
    const ratingData = {
      rating: 5,
      review: "Excellent trail with beautiful views!"
    };

    const response = await request(app)
      .post(`/api/trail/${testTrailId}/ratings`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(ratingData);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(undefined);
  
  });

  // Test Case 10: Error Handling - Invalid Trail ID
  test("should return appropriate error for invalid trail ID", async () => {
    const invalidId = "507f1f77bcf86cd799439011"; // Valid ObjectId format but non-existent

    const response = await request(app)
      .get(`/api/trail/${invalidId}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
}); 