import Category from "../../models/Category";
import supertest from "supertest";
import app from "../../app";

const request = supertest(app);

const CACEGORY_MOCKS = [
    { name: "Technology" },
    { name: "Landscapes" },
    { name: "Tutorials" }
];

setupTestDB("test_categories");

describe("categories api", () => {
    beforeEach(async () => {
        await Category.insertMany(CACEGORY_MOCKS); 
    });

    describe("Get Categories", () => {
        it("it should get the all categories", async () => {
            const res = await request.get("/api/categories/");
    
            expect(res.body.data.categories.length).toBe(3);
        });
    });
});