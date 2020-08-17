import Article from "../../../models/Article";
import Category from "../../../models/Category";
import { deleteImage } from "../../../utils/imageUpload";
import supertest from "supertest";
import app from "../../../app";

const request = supertest(app);

const CACEGORY_MOCKS = [
    { name: "Technology" },
    { name: "Landscapes" },
    { name: "Tutorials" }
];

const ARTICLE_MOCKS = [
    {
        title: "Test Article",
        description: "Test description",
        cover: "cover.jpg",
        content: "Test content",
        categories: [],
        createdAt: Date.now() + 2000,
        dayViews: 2500,
        monthViews: 80000,
        totalViews: 250000
    },
    {
        title: "Test Article 2",
        description: "Test description 2",
        cover: "cover-2.jpg",
        content: "Test content 2",
        categories: [],
        createdAt: Date.now(),
        dayViews: 2000,
        monthViews: 100000,
        totalViews: 150000
    },
    {
        title: "Test Article 3",
        description: "Test description 3",
        cover: "cover-3.jpg",
        content: "Test content 3",
        categories: [],
        createdAt: Date.now() + 1000,
        dayViews: 1500,
        monthViews: 50000,
        totalViews: 300000
    }
];

setupTestDB("test_articles");

jest.mock("../../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => {
        next();
    };
});

jest.mock("../../../utils/imageUpload", () => ({
    uploadImage: jest.fn(() => {
        return (req, _res, next) => {
            if(req.body.cover) {
                req.file = {
                    filename: req.body.cover
                };
            }

            next();
        };
    }),
    uploadImages: () => { return () => {} },
    deleteImage: jest.fn()
}));

describe("articles api", () => {
    beforeEach(async () => {
        await Category.insertMany(CACEGORY_MOCKS);
        const categories = await Category.find();

        // we add cateogires to mock articles

        ARTICLE_MOCKS[0].categories.push(categories[0]);
        ARTICLE_MOCKS[1].categories.push(categories[0], categories[1]);
        ARTICLE_MOCKS[2].categories.push(...categories);

        await Article.insertMany(ARTICLE_MOCKS);
    });

    afterEach(async () => {
        deleteImage.mockReset();

        ARTICLE_MOCKS[0].categories = [];
        ARTICLE_MOCKS[1].categories = [];
        ARTICLE_MOCKS[2].categories = [];
    });

    describe("Get Articles", () => {
        it("It should get 2 articles", async () => {
            const res = await request.get("/api/articles/").query({
                limit: 2
            });
            const { articles, pagination } = res.body.data;

            expect(articles.length).toBe(2);
    
            expect(articles[0].title).toBe(ARTICLE_MOCKS[0].title);
            expect(articles[1].title).toBe(ARTICLE_MOCKS[2].title);

            expect(pagination.pages.length).toBe(2);
        });

        it("It should get the articles without pagination", async () => {
            const res = await request.get(`/api/articles/`).query({
                paginate: false
            });

            const { articles, pagination } = res.body.data;

            expect(articles.length).toBe(3);

            expect(pagination).toBeUndefined();
        });

        it("It should get an article with limit and page", async () => {
            const res = await request
                .get(`/api/articles/`)
                .query({ limit: 2, page: 2 });

            const { articles, pagination } = res.body.data;

            expect(articles[0].title).toBe(ARTICLE_MOCKS[1].title);

            expect(pagination.pages.length).toBe(2);
        });

        it("It should get the second article with search", async () => {
            const res = await request
                .get(`/api/articles/`)
                .query({ search: "Test Article 2" });

            const { articles, pagination } = res.body.data;

            expect(articles[0].title).toBe("Test Article 2");

            expect(pagination.pages.length).toBe(1);
        });

        it("It should get the third article with categories", async () => {
            const categories = ["Technology", "Landscapes", "Tutorial"];

            const res = await request
                .get(`/api/articles/`)
                .query({ categories });

            const { articles, pagination } = res.body.data;

            expect(articles[0].title).toBe("Test Article 3");

            expect(pagination.pages.length).toBe(1);
        });

        it("It should get the second article with all filters", async () => {
            const categories = ["Technology", "Landscapes"];
            const search = "Test Article";

            const res = await request
                .get(`/api/articles/`)
                .query({ categories, search, limit: 1, page: 2 });

            const { articles, pagination } = res.body.data;

            expect(articles[0].title).toBe("Test Article 2");

            expect(pagination.pages.length).toBe(2);
        });

        it("It should get the articles ordered by dayViews", async () => {
            const res = await request
                .get(`/api/articles/`)
                .query({ sort: "dayViews" });

            const { articles, pagination } = res.body.data;

            expect(articles[0].title).toBe("Test Article");
            expect(pagination.pages.length).toBe(1);
        });
    });

    describe("Get Article By Id", () => {
        it("It should get the third article", async () => {
            const article = await Article
                .findOne({ title: "Test Article 3" })
                .populate("categories");

            const res = await request.get(`/api/articles/${article._id}`);

            const { data } = res.body;

            expect(data.article.title).toBe(article.title);
            data.article.categories.forEach((category, index) => {
                expect(category.name).toEqual(article.categories[index].name);
            });
        });

        it("It should get a 404 error", async () => {
            const res = await request.get(`/api/articles/abcefabcefabcefabcefabce`);

            expect(res.body).toEqual({
                errors: [
                    {
                        message: "The article abcefabcefabcefabcefabce doesn't exist",
                        status: 404
                    }
                ]
            });
        });
    });

    describe("Create Article", () => {
        it("It should create an article", async () => {
            const res = await request
                .post(`/api/articles/`)
                .send({
                    cover: "create.jpg",
                    title: "create title",
                    content: "create content",
                    description: "create description",
                    categories: ["Technology", "Tutorials"]
                });

            const { createdArticle } = res.body.data;
            
            expect(createdArticle.cover).toBe("create.jpg");
            expect(createdArticle.title).toBe("create title");
            expect(createdArticle.content).toBe("create content");
            expect(createdArticle.description).toBe("create description");

            expect(createdArticle.categories.length).toBe(2);
        });

        it("It should throw an error when we don't send the cover", async () => {
            const res = await request
                .post(`/api/articles/`)
                .send({
                    title: "create title",
                    content: "create content",
                    description: "create description",
                    categories: ["Technology", "Tutorials"]
                });

            const { errors } = res.body;
            
            expect(errors).toEqual([
                {
                    message: "The 'cover' field is required",
                    status: 200
                }
            ]);
        });

        it("It should delete the image when there has a mongoose error", async () => {
            const res = await request
                .post(`/api/articles/`)
                .send({
                    cover: "create.jpg",
                    title: "",
                    content: "create content",
                    description: "create description",
                    categories: ["Technology", "Tutorials"]
                });
            expect(res.body.errors.length).toBe(1);
            expect(deleteImage).toHaveBeenCalledWith("/articles/create.jpg");
        });
    });

    describe("Update Article", () => {
        it("It should update the article without cover", async () => {
            const article = await Article.findOne({ title: "Test Article 2" });

            const res = await request
                .put(`/api/articles/${article._id}`)
                .send({
                    title: "update title",
                    content: "update content",
                    description: "update description",
                    categories: ["Technology"]
                });

            const { updatedArticle } = res.body.data;
            
            expect(updatedArticle.title).toBe("update title");
            expect(updatedArticle.content).toBe("update content");
            expect(updatedArticle.description).toBe("update description");

            expect(updatedArticle.categories.length).toBe(1);
            expect(updatedArticle.categories[0].name).toBe("Technology");

            expect(deleteImage).not.toHaveBeenCalled();
        });

        it("It should update the article with cover", async () => {
            const article = await Article.findOne({ title: "Test Article 3" });

            const res = await request
                .put(`/api/articles/${article._id}`)
                .send({
                    cover: "update.jpg",
                    title: "update title",
                    content: "update content",
                    description: "update description",
                    categories: []
                });

            const { updatedArticle } = res.body.data;
            
            expect(updatedArticle.cover).toBe("update.jpg");
            expect(updatedArticle.title).toBe("update title");
            expect(updatedArticle.content).toBe("update content");
            expect(updatedArticle.description).toBe("update description");

            expect(updatedArticle.categories.length).toBe(0);

            expect(deleteImage).toHaveBeenCalledWith("/articles/cover-3.jpg");
        });

        it("It should get a 404 error", async () => {
            const res = await request.put(`/api/articles/abcefabcefabcefabcefabce`)

            expect(res.body).toEqual({
                errors: [
                    {
                        message: "The article abcefabcefabcefabcefabce doesn't exist",
                        status: 404
                    }
                ]
            });
        });
    });

    describe("Delete Article", () => {
        it("It should delete an article and delete the cover image and comments", async () => {
            const article = await Article.findOne({ title: "Test Article 3" });

            const res = await request.delete(`/api/articles/${article._id}`);

            const { deletedArticle } = res.body.data;

            expect(deletedArticle.title).toBe(article.title);
            expect(deletedArticle.cover).toBe(article.cover);

            expect(deleteImage).toHaveBeenCalledWith("/articles/cover-3.jpg");
        });

        it("It should get a 404 error", async () => {
            const res = await request.delete(`/api/articles/abcefabcefabcefabcefabce`);
            
            expect(res.body).toEqual({
                errors: [
                    {
                        message: "The article abcefabcefabcefabcefabce doesn't exist",
                        status: 404
                    }
                ]
            });
        });
    });
});