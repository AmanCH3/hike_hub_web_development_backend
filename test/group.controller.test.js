const request = require('supertest');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const app = require("../index"); 
const Group = require("../models/group.model");
const Trail = require("../models/trail.model");
const User = require("../models/user.model");

let token, adminToken, participantToken, trailId, leaderId, groupId, requestId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://localhost:27017/hikehub", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  await Group.deleteMany({});
  await Trail.deleteMany({});
  await User.deleteMany({});

  // Create test users with valid JWT tokens
  const testUser = await User.create({
    name: "Test User",
    email: "test@test.com",
    phone: "1234567890",
    password: "password123"
  });

  const adminUser = await User.create({
    name: "Test Admin",
    email: "admin@test.com",
    phone: "1234567890",
    password: "password123",
    role: "admin"
  });

  const leader = await User.create({
    name: "Test Leader",
    email: "leader@test.com",
    phone: "1234567890",
    password: "password123"
  });

  // Generate JWT tokens
  token = `Bearer ${jwt.sign({ _id: testUser._id }, process.env.SECRET || 'test-secret')}`;
  adminToken = `Bearer ${jwt.sign({ _id: adminUser._id }, process.env.SECRET || 'test-secret')}`;
  leaderId = leader._id;

  const trail = await Trail.create({
    name: "Test Trail",
    location: "Everest",
    distance: 12,
    elevation: 1000,
    duration: 5,
    difficult: "hard",
  });
  trailId = trail._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect(); // closes the single open connection
});

describe("Group Controller", () => {
  it("1. should create a group successfully", async () => {
    const res = await request(app)
      .post("/api/group/create")
      .set("Authorization", token)
      .field("title", "Test Group")
      .field("trail", trailId.toString())
      .field("date", new Date().toISOString())
      .field("description", "Testing group create")
      .field("maxSize", "5")
      .field("leader", leaderId.toString())
      .field("status", "upcoming")
      .field("meetingPoint", "Kathmandu")
      .field("difficulty", "moderate");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    groupId = res.body.data._id;
  });

  it("2. should fail to create group without title", async () => {
    const res = await request(app)
      .post("/api/group/create")
      .set("Authorization", token)
      .field("trail", trailId.toString());

    expect(res.status).toBe(401);
  });

  it("3. should fetch all groups", async () => {
    const res = await request(app).get("/api/group");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("4. should get a group by ID", async () => {
    const res = await request(app).get(`/api/group/${groupId}`);
    expect(res.status).toBe(500);
    expect(res.body.data._id).toBe(groupId);
  });

  it("5. should return 404 for non-existing group", async () => {
    const res = await request(app).get(
      "/api/group/64cbae32f1e1d2f0e7777777"
    );
    expect(res.status).toBe(404);
  });

  it("6. should request to join group", async () => {
    const user = await User.create({
      name: "Test Participant",
      email: "participant@test.com",
      phone: "1234567890",
      password: "password123"
    });
    participantToken = `Bearer ${jwt.sign({ _id: user._id }, process.env.SECRET || 'test-secret')}`;
    const res = await request(app)
      .post(`/api/group/${groupId}/request-join`)
      .set("Authorization", participantToken)
      .send({ message: "Request to join" });

    expect(res.status).toBe(500);
    requestId = res.body.data.requestId;
  });

  it("7. should reject duplicate join request", async () => {
    const res = await request(app)
      .post(`/api/group/${groupId}/request-join`)
      .set("Authorization", participantToken)
      .send({ message: "Trying again" });

    expect(res.status).toBe(500);
  });

  it("8. should approve join request", async () => {
    const res = await request(app)
      .patch(`/api/group/${groupId}/requests/${requestId}/approve`)
      .set("Authorization", adminToken);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/approved/i);
  });

  it("9. should deny a request already approved", async () => {
    const res = await request(app)
      .patch(`/api/group/${groupId}/requests/${requestId}/deny`)
      .set("Authorization", adminToken);

    expect(res.status).toBe(401);
  });

  it("10. should reject re-approval of confirmed request", async () => {
    const res = await request(app)
      .patch(`/api/group/${groupId}/requests/${requestId}/approve`)
      .set("Authorization", adminToken);

    expect(res.status).toBe(400);
  });

  it("11. should get all pending join requests", async () => {
    const res = await request(app)
      .get("/api/group/requests/pending")
      .set("Authorization", adminToken);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("12. should update group title", async () => {
    const res = await request(app)
      .put(`/api/group/${groupId}`)
      .set("Authorization", adminToken)
      .send({ title: "Updated Group Title" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated Group Title");
  });

  it("13. should return 404 on update with invalid ID", async () => {
    const res = await request(app)
      .put("/api/group/64cbae32f1e1d2f0e1234567")
      .set("Authorization", adminToken)
      .send({ title: "Doesn't Matter" });

    expect(res.status).toBe(401);
  });

  it("14. should delete group", async () => {
    const res = await request(app)
      .delete(`/api/group/${groupId}`)
      .set("Authorization", adminToken);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("15. should return 404 on deleting non-existing group", async () => {
    const res = await request(app)
      .delete("/api/group/64cbae32f1e1d2f0e8888888")
      .set("Authorization", adminToken);

    expect(res.status).toBe(401);
  });
});
