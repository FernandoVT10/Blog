import Category from "../../models/Category";
import request from "supertest";
import app from "../../app";

const CACEGORY_MOCKS = [
    { name: "Technology" },
    { name: "Landscapes" },
    { name: "Tutorials" }
];

setupTestDB();

describe("categories api", () => {
    beforeEach(async () => {
        await Category.insertMany(CACEGORY_MOCKS); 
    });

    afterEach(async () => {
        await Category.deleteMany(); 
    });

    describe("Get All Categories", () => {
        it("it should get the all categories", async () => {
            const res = await request(app).get("/api/categories/getAllCategories/");
            const skills = res.body;
    
            skills.forEach(({ name }, index) => {
                expect(name).toBe(CACEGORY_MOCKS[index].name);
            });
        });
    });
});