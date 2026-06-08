const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email:'houssemfquih@gmail.com',
      password: "Badr12345."
    });

  token = res.body.token;

  if (!token) {
    throw new Error("Login failed - no token returned");
  }

});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product", () => {

  test("create product", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Play Station 5",
        description: "new play station 5 for sell for interesting people",
        price: 500,
        stock: 10,
        image: "https://res.cloudinary.com/demo.jpg",
        category: "video_game",
      });

    expect(res.status).toBe(201);
  });

  test("should fail without token", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .send({
        name: "Play Station 5",
        description: "new play station 5 for sell for interesting people",
        price: 500,
        stock: 10,
        image: "https://res.cloudinary.com/demo.jpg",
        category: "video_game",
      });

    expect(res.status).toBe(401);
  });

});