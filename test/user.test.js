import supertest from "supertest";
import { web } from "../src/application/web";
import { prismaClient } from "../src/application/database";

describe("POST /api/users", function () {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "username",
      },
    });
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "username",
      password: "password",
      name: "Your Name",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("username");
    expect(result.body.data.name).toBe("Your Name");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "username",
      password: "password",
      name: "Your Name",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("username");
    expect(result.body.data.name).toBe("Your Name");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "username",
      password: "password",
      name: "Your Name",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
