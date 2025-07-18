const request = require("supertest");
const app = require("../index"); 

describe("Checklist Generator Controller", () => {
  it("should generate checklist with valid parameters", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?experience=beginner&duration=day&weather=sunny"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(typeof res.body.data).toBe("object");
  });

  it("should return 400 if missing experience", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?duration=day&weather=sunny"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Missing required/i);
  });

  it("should return 400 if missing duration", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?experience=beginner&weather=sunny"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Missing required/i);
  });

  it("should return 400 if missing weather", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?experience=beginner&duration=day"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Missing required/i);
  });

  it("should handle unknown experience gracefully", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?experience=alien&duration=day&weather=sunny"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // returns base checklist because no matching addons
    expect(res.body.data).toBeDefined();
  });

  it("should handle unknown duration gracefully", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?experience=beginner&duration=century&weather=sunny"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it("should handle unknown weather gracefully", async () => {
    const res = await request(app).get(
      "/api/checklist/generate?experience=beginner&duration=day&weather=volcanic"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});
