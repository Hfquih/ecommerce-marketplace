const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth", () => {

  test("register", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        firstName: "Houssam",
        lastName: "Fquih",
        phone,
        email,
        password: "Houssam.123456",
        role: "user"
      });

    expect(res.status).toBe(201);
  });

  test("login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email:'houssemfquih@gmail.com',
        password: "Badr12345."
      });

    expect(res.status).toBe(200);
  });

});