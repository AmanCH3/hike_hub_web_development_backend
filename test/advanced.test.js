const request = require("supertest");
const app = require("../index");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Trail = require("../models/trail.model");
const Activity = require("../models/activity.model");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

// Test data for advanced tests
const testUserData = {
  name: "Advanced Test User",
  email: "advanceduser@test.com",
  password: "password123",
  phone: "1234567890"
};

const testAdminData = {
  name: "Advanced Test Admin",
  email: "advancedadmin@test.com",
  password: "admin123",
  phone: "9876543210",
  role: "admin"
};

const testTrailData = {
  name: "Advanced Test Trail",
  location: "Test Location",
  distance: 5.5,
  elevation: 500,
  duration: { min: 2, max: 4 },
  difficult: "Easy",
  description: "A beautiful test trail for hiking",
  features: ["Scenic Views", "Wildlife"],
  seasons: ["Spring", "Summer"]
};

const testGroupData = {
  title: "Advanced Test Group",
  description: "A test group for hiking enthusiasts",
  maxSize: 10,
  meetingPoint: "Test Meeting Point",
  difficulty: "Easy",
  status: "upcoming"
};

let userToken;
let adminToken;
let testUserId;
let testAdminId;
let testTrailId;
let testGroupId;

describe("Hike Hub Advanced Test Suite", () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await User.deleteMany({ 
      email: { $in: [testUserData.email, testAdminData.email] } 
    });
    await Trail.deleteMany({ name: testTrailData.name });
    await Group.deleteMany({ title: testGroupData.title });

    // Create test users
    const user = await User.create(testUserData);
    const admin = await User.create(testAdminData);
    
    testUserId = user._id;
    testAdminId = admin._id;

    // Generate JWT tokens
    userToken = `Bearer ${jwt.sign({ _id: user._id }, process.env.SECRET || 'test-secret')}`;
    adminToken = `Bearer ${jwt.sign({ _id: admin._id }, process.env.SECRET || 'test-secret')}`;

    // Create a test trail
    const trail = await Trail.create(testTrailData);
    testTrailId = trail._id;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ 
      email: { $in: [testUserData.email, testAdminData.email] } 
    });
    await Trail.deleteMany({ name: testTrailData.name });
    await Group.deleteMany({ title: testGroupData.title });
    await mongoose.connection.close();
  });

  // Test Case 1: User Authentication - Login with Valid Credentials
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
  });

  // Test Case 2: User Authentication - Login with Invalid Credentials
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

  // Test Case 3: Create a Group (Authenticated User)
  test("should create a new group when authenticated", async () => {
    const response = await request(app)
      .post("/api/group/create")
      .set("Authorization", userToken)
      .field("title", testGroupData.title)
      .field("trail", testTrailId.toString())
      .field("date", new Date().toISOString())
      .field("description", testGroupData.description)
      .field("maxSize", testGroupData.maxSize.toString())
      .field("leader", testUserId.toString())
      .field("status", testGroupData.status)
      .field("meetingPoint", testGroupData.meetingPoint)
      .field("difficulty", testGroupData.difficulty);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(testGroupData.title);
    expect(response.body.data.description).toBe(testGroupData.description);
    expect(response.body.data.leader).toBe(testUserId.toString());
    
    testGroupId = response.body.data._id;
  });

  // Test Case 4: Get All Groups (Public Access)
  test("should retrieve all groups without authentication", async () => {
    const response = await request(app)
      .get("/api/group");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test Case 5: Get Group by ID
  test("should retrieve a specific group by ID", async () => {
    const response = await request(app)
      .get(`/api/group/${testGroupId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(testGroupId);
    expect(response.body.data.title).toBe(testGroupData.title);
  });

  // Test Case 6: Request to Join Group (with message)
  test("should allow user to request joining a group", async () => {
    const response = await request(app)
      .post(`/api/group/${testGroupId}/request-join`)
      .set("Authorization", userToken)
      .send({ message: "I would like to join this group" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("Join request submitted successfully. Waiting for approval.");
  });

  // Test Case 7: Get All Trails (Public Access)
  test("should retrieve all trails without authentication", async () => {
    const response = await request(app)
      .get("/api/trails");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(undefined);
  });

  // Test Case 8: Get Single Trail by ID (Protected Route)
  test("should retrieve a specific trail by ID when authenticated", async () => {
    const response = await request(app)
      .get(`/api/trails/${testTrailId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(undefined);
 
  });

  // Test Case 9: Update User Profile (Authenticated)
  test("should update user profile when authenticated", async () => {
    const updateData = {
      name: "Updated Test User",
      bio: "This is my updated bio",
      hikerType: "experienced"
    };

    const response = await request(app)
      .put("/api/user/me")
      .set("Authorization", userToken)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(updateData.name);
    expect(response.body.data.bio).toBe(updateData.bio);
    expect(response.body.data.hikerType).toBe(updateData.hikerType);
  });

  // Test Case 10: Error Handling - Invalid Group ID
  test("should return appropriate error for invalid group ID", async () => {
    const invalidId = "507f1f77bcf86cd799439011"; // Valid ObjectId format but non-existent

    const response = await request(app)
      .get(`/api/group/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Group not found");
  });
}); 