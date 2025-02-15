const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");

let userId;

beforeAll((done) => {
    mongodb.initDb((err) => {
        if (err) {
            console.error("Database initialization failed:", err);
        } else {
            console.log("Database initialized successfully");
        }
        done();
    });
});

describe("Users API", () => {
    test("GET /users should return all users", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test("POST /users should create a new user", async () => {
        const newUser = {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
        };

        await request(app).post("/users").send(newUser);

        // Fetch the latest user added
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        const users = res.body;
        expect(users.length).toBeGreaterThan(0);

        userId = users[users.length - 1]._id; // Assign the last inserted user's ID
        expect(userId).toBeDefined();
    });

    test("PUT /users/:id should update a user", async () => {
        expect(userId).toBeDefined();
        const updatedUser = { firstName: "Jane", lastName: "Doe", email: "janedoe@example.com" };
    
        const res = await request(app).put(`/users/${userId}`).send(updatedUser);
        expect([200, 204]).toContain(res.statusCode);  // Accept both 200 and 204
    });    

    test("DELETE /users/:id should delete a user", async () => {
        expect(userId).toBeDefined();
        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "User deleted successfully!");
    });

    test("GET /users/:id should return 404 for deleted user", async () => {
        const res = await request(app).get(`/users/${userId}`);
        expect(res.statusCode).toBe(404);
    });
});