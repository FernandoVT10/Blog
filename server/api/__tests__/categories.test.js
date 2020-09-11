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

jest.mock("../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => {
        next();
    };
});

describe("categories api", () => {
    beforeEach(async () => {
        await Category.insertMany(CACEGORY_MOCKS); 
    });

    describe("Get Categories", () => {
        it("should get the all categories", async () => {
            const res = await request.get("/api/categories/");
    
            expect(res.body.data.categories.length).toBe(3);
        });
    });

    describe("Create Category", () => {
        it("should create a category", async () => {
            const res = await request.post("/api/categories/").send({ name: "Test" });

            const { createdCategory } = res.body.data;
    
            expect(createdCategory.name).toBe("Test");
        });
    });

    describe("Update Category", () => {
        it("should update a category", async () => {
            const category = await Category.findOne({ name: "Technology" });

            const res = await request
                .put(`/api/categories/${category._id}`)
                .send({ name: "Updated" });

            const { updatedCategory } = res.body.data;
    
            expect(updatedCategory.name).toBe("Updated");
        });

        it("should get a 404 not found error", async () => {
            const res = await request.put(`/api/categories/abcefabcefabcefabcefabce`);

            const { errors } = res.body;
    
            expect(errors).toEqual([
                {
                    status: 404,
                    message: `The category abcefabcefabcefabcefabce doesn't exist`
                }
            ]);
        });
    });

    describe("Delete Category", () => {
        it("should delete a category", async () => {
            const category = await Category.findOne({ name: "Technology" });

            const res = await request.delete(`/api/categories/${category._id}`);

            const { deletedCategory } = res.body.data;
    
            expect(deletedCategory.name).toBe("Technology");
        });

        it("should get a 404 not found error", async () => {
            const res = await request.delete(`/api/categories/abcefabcefabcefabcefabce`);

            const { errors } = res.body;
    
            expect(errors).toEqual([
                {
                    status: 404,
                    message: `The category abcefabcefabcefabcefabce doesn't exist`
                }
            ]);
        });
    });
});