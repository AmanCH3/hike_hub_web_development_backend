const StepController = require("../controllers/step.controller");
const Step = require("../models/step.models");

jest.mock("../models/step.models");

// Helper to create a mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Step Controller – saveSteps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if userId is missing", async () => {
    const req = {
      body: { trailId: "trail123", steps: 100 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it("should return 400 if trailId is missing", async () => {
    const req = {
      body: { userId: "user123", steps: 100 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if steps is missing", async () => {
    const req = {
      body: { userId: "user123", trailId: "trail123" },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should save steps and return 200 for valid data", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    Step.mockImplementation(() => ({ save: mockSave }));

    const req = {
      body: { userId: "user123", trailId: "trail123", steps: 500 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("should handle database errors gracefully", async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error("DB Error"));
    Step.mockImplementation(() => ({ save: mockSave }));

    const req = {
      body: { userId: "user123", trailId: "trail123", steps: 500 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it("should allow 0 steps and still save", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    Step.mockImplementation(() => ({ save: mockSave }));

    const req = {
      body: { userId: "user123", trailId: "trail123", steps: 0 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should accept negative steps (no validation in controller)", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    Step.mockImplementation(() => ({ save: mockSave }));

    const req = {
      body: { userId: "user123", trailId: "trail123", steps: -10 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should accept steps as string value (no validation in controller)", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    Step.mockImplementation(() => ({ save: mockSave }));

    const req = {
      body: { userId: "user123", trailId: "trail123", steps: "100" },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should create Step instance with correct payload", async () => {
    const mockSave = jest.fn().mockResolvedValue({});

    // Capture constructor args
    let capturedPayload;
    Step.mockImplementation((payload) => {
      capturedPayload = payload;
      return { save: mockSave };
    });

    const req = {
      body: { userId: "userA", trailId: "trailB", steps: 42 },
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(capturedPayload).toEqual({ userId: "userA", trailId: "trailB", steps: 42 });
  });

  it("should not attempt to save when validation fails", async () => {
    const mockSave = jest.fn();
    Step.mockImplementation(() => ({ save: mockSave }));

    const req = {
      body: { trailId: "trail123", steps: 100 }, // missing userId
    };
    const res = mockResponse();

    await StepController.saveSteps(req, res);

    expect(mockSave).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});