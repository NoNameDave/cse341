const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");

let bookId;

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

describe("Books API", () => {
    test("GET /books should return all books", async () => {
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test("POST /books should create a new book", async () => {
        const newBook = {
            title: "Test Book",
            author: "Test Author",
            genre: "Fiction",
            price: 9.99,
            ISBN: "1234567890123",
            stock: 10,
        };

        await request(app).post("/books").send(newBook);
        
        // Fetch the latest book added
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        const books = res.body;
        expect(books.length).toBeGreaterThan(0);

        bookId = books[books.length - 1]._id; // Assign the last inserted book's ID
        expect(bookId).toBeDefined();
    });

    test("PUT /books/:id should update a book", async () => {
        expect(bookId).toBeDefined(); // Ensure the ID is available

        const updatedBook = {
            title: "Updated Book Title",
            author: "Updated Author",
            genre: "Sci-Fi",
            price: 25.99,
            ISBN: "0987654321",
            stock: 5,
            description: "An updated test book",
            imageUrl: "https://example.com/updatedbook.jpg",
        };

        const res = await request(app).put(`/books/${bookId}`).send(updatedBook);
        expect([200, 204]).toContain(res.statusCode); // Accept both 200 and 204
    });     

    test("DELETE /books/:id should delete a book", async () => {
        expect(bookId).toBeDefined();
        const res = await request(app).delete(`/books/${bookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Book deleted successfully!");
    });

    test("GET /books/:id should return 404 for deleted book", async () => {
        const res = await request(app).get(`/books/${bookId}`);
        expect(res.statusCode).toBe(404);
    });
});