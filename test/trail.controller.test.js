const request = require('supertest');
const app = require("../index");
const Trail = require('../models/trail.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Trail Controller Tests', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;
  let trailId;
  let testTrail;

  beforeAll(async () => {
    await User.deleteMany({});
    await Trail.deleteMany({});

    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$hashedpassword',
      phone: '1234567890',
      role: 'admin'
    });

    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: '$2b$10$hashedpassword',
      phone: '9876543210',
      role: 'user'
    });

    adminToken = jwt.sign(
      {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      },
      process.env.SECRET || 'test-secret',
      { expiresIn: '7d' }
    );

    userToken = jwt.sign(
      {
        _id: regularUser._id,
        name: regularUser.name,
        email: regularUser.email,
        role: regularUser.role
      },
      process.env.SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    await Trail.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Trail.deleteMany({});
  });

  describe('POST /api/trail/create', () => {
    it('should create a new trail with admin authentication', async () => {
      const trailData = {
        name: 'Test Trail',
        location: 'Test Location',
        distance: 5.5,
        elevation: 1200,
        duration: { min: 120, max: 180 },
        difficult: 'Moderate',
        description: 'A beautiful test trail',
        features: ['scenic views', 'wildlife'],
        seasons: ['spring', 'summer'],
        ratings: [],
        averageRatings: 0,
        numRatings: 0
      };

      const response = await request(app)
        .post('/api/trail/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(trailData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(trailData.name);
    });

    it('should fail to create trail without admin authentication', async () => {
      const trailData = {
        name: 'Test Trail',
        location: 'Test Location',
        distance: 5.5,
        elevation: 1200,
        difficult: 'Moderate',
        description: 'A beautiful test trail'
      };

      const response = await request(app)
        .post('/api/trail/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send(trailData);

      expect(response.status).toBe(403);
    });

    it('should fail to create trail without authentication', async () => {
      const trailData = {
        name: 'Test Trail',
        location: 'Test Location'
      };

      const response = await request(app)
        .post('/api/trail/create')
        .send(trailData);

      expect(response.status).toBe(401);
    });

    it('should create trail with image upload', async () => {
      const response = await request(app)
        .post('/api/trail/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('images', Buffer.from('fake image data'), 'test1.jpg')
        .attach('images', Buffer.from('fake image data 2'), 'test2.jpg')
        .field('name', 'Trail with Images')
        .field('location', 'Image Location')
        .field('distance', 3.0)
        .field('elevation', 800)
        .field('difficult', 'Easy')
        .field('description', 'Trail with image uploads');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.images.length).toBe(2);
    });
  });

//   describe('GET /api/trail', () => {
//     beforeEach(async () => {
//       await Trail.create([
//         {
//           name: 'Easy Trail',
//           location: 'Location 1',
//           distance: 2.0,
//           elevation: 500,
//           duration: { min: 60, max: 90 },
//           difficult: 'Easy',
//           description: 'An easy trail'
//         },
//         {
//           name: 'Hard Trail',
//           location: 'Location 2',
//           distance: 10.0,
//           elevation: 2000,
//           duration: { min: 300, max: 420 },
//           difficult: 'Hard',
//           description: 'A challenging trail'
//         },
//         {
//           name: 'Mountain Trail',
//           location: 'Mountain Location',
//           distance: 7.5,
//           elevation: 1500,
//           duration: { min: 180, max: 240 },
//           difficult: 'Moderate',
//           description: 'A mountain trail'
//         }
//       ]);
//     });

//     it('should get all trails with default pagination', async () => {
//       const response = await request(app).get('/api/trail');

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.length).toBe(3);
//     });

//     it('should get trails with custom pagination', async () => {
//       const response = await request(app).get('/api/trail?page=1&limit=2');
//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.length).toBe(2);
//     });

//     it('should filter trails by name search', async () => {
//       const response = await request(app).get('/api/trail?search=Mountain');
//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.length).toBe(1);
//       expect(response.body.data[0].name).toBe('Mountain Trail');
//     });

//     it('should filter trails by difficulty', async () => {
//       const response = await request(app).get('/api/trail?difficulty=Easy');
//       expect(response.status).toBe(200);
//       expect(response.body.data.length).toBe(1);
//     });
//   });

//   describe('GET /api/trail/:id', () => {
//     beforeEach(async () => {
//       testTrail = await Trail.create({
//         name: 'Test Trail',
//         location: 'Test Location',
//         distance: 5.0,
//         elevation: 1000,
//         difficult: 'Moderate',
//         description: 'A test trail',
//         participants: [regularUser._id]
//       });
//       trailId = testTrail._id;
//     });

//     it('should get a specific trail by ID with admin authentication', async () => {
//       const response = await request(app)
//         .get(`/api/trail/${trailId}`)
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.name).toBe('Test Trail');
//     });

//     it('should fail without admin authentication', async () => {
//       const response = await request(app)
//         .get(`/api/trail/${trailId}`)
//         .set('Authorization', `Bearer ${userToken}`);

//       expect(response.status).toBe(403);
//     });

//     it('should return 404 for non-existent trail', async () => {
//       const fakeId = new mongoose.Types.ObjectId();
//       const response = await request(app)
//         .get(`/api/trail/${fakeId}`)
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(response.status).toBe(404);
//     });
//   });

  describe('PUT /api/trail/:id', () => {
    beforeEach(async () => {
      testTrail = await Trail.create({
        name: 'Original Trail',
        location: 'Original Location',
        distance: 3.0,
        elevation: 800,
        difficult: 'Easy',
        description: 'Original description'
      });
      trailId = testTrail._id;
    });

    it('should update trail with admin authentication', async () => {
      const response = await request(app)
        .put(`/api/trail/${trailId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Trail',
          location: 'Updated Location'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Trail');
    });
  });

  describe('DELETE /api/trail/:id', () => {
    beforeEach(async () => {
      testTrail = await Trail.create({
        name: 'Trail to Delete',
        location: 'Delete Location',
        distance: 2.0,
        elevation: 600,
        difficult: 'Easy',
        description: 'Trail to be deleted'
      });
      trailId = testTrail._id;
    });

    it('should delete trail with admin authentication', async () => {
      const response = await request(app)
        .delete(`/api/trail/${trailId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedTrail = await Trail.findById(trailId);
      expect(deletedTrail).toBeNull();
    });
  });

  describe('POST /api/trail/:trailId/join-trail', () => {
    beforeEach(async () => {
      testTrail = await Trail.create({
        name: 'Join Trail',
        location: 'Join Location',
        distance: 4.0,
        elevation: 900,
        difficult: 'Moderate',
        description: 'Trail to join',
        participants: []
      });
      trailId = testTrail._id;
    });

    it('should allow user to join trail', async () => {
      const response = await request(app)
        .post(`/api/trail/${trailId}/join-trail`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.participants.length).toBe(1);
    });
  });

//   describe('POST /api/trail/:trailId/leave-trail', () => {
//     beforeEach(async () => {
//       testTrail = await Trail.create({
//         name: 'Leave Trail',
//         location: 'Leave Location',
//         distance: 4.0,
//         elevation: 900,
//         difficult: 'Moderate',
//         description: 'Trail to leave',
//         participants: [regularUser._id]
//       });
//       trailId = testTrail._id;
//     });

//     it('should allow user to leave trail', async () => {
//       const response = await request(app)
//         .post(`/api/trail/${trailId}/leave-trail`)
//         .set('Authorization', `Bearer ${userToken}`);

//       expect(response.status).toBe(200);
//       expect(response.body.success).toBe(true);
//       expect(response.body.data.participants.length).toBe(0);
//     });
//   });
});
