import Article from "../../models/Article";
import Category from "../../models/Category";
import request from "supertest";
import app from "../../app";

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
        createdAt: Date.now() + 2
    },
    {
        title: "Test Article 2",
        description: "Test description 2",
        cover: "cover-2.jpg",
        content: "Test content 2",
        categories: [],
        createdAt: Date.now()
    },
    {
        title: "Test Article 3",
        description: "Test description 3",
        cover: "cover-3.jpg",
        content: "Test content 3",
        categories: [],
        createdAt: Date.now() + 1
    }
];

setupTestDB();
console.log = jest.fn();

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
        await Category.deleteMany();
        await Article.deleteMany();
    });

    describe("Get Recent", () => {
        it("It should get 2 articles", async () => {
            const res = await request(app).get("/api/articles/getRecent/2");
            const articles = res.body;

            expect(articles.length).toBe(2);
    
            expect(articles[0].title).toBe(ARTICLE_MOCKS[0].title);
            expect(articles[1].title).toBe(ARTICLE_MOCKS[2].title);
        });
    });

    describe("Get Article By Id", () => {
        it("It should get the third article", async () => {
            const article = await Article.findOne({ title: "Test Article 3" }).populate("categories");

            const res = await request(app).get(`/api/articles/getArticleById/${article._id}`);

            expect(res.body.title).toBe(article.title);
            res.body.categories.forEach((category, index) => {
                expect(category.name).toEqual(article.categories[index].name);
            });
        });

        it("It should get a null object", async () => {
            const res = await request(app).get(`/api/articles/getArticleById/null`);

            expect(res.body).toEqual({});
        });
    });

    describe("Get Filtered Articles", () => {
        it("It should get 2 articles", async () => {
            const res = await request(app)
                            .get(`/api/articles/getFilteredArticles/`)
                            .query({ limit: 2 });

            const { articles, pagination } = res.body;

            expect(articles[0].title).toBe(ARTICLE_MOCKS[0].title);
            expect(articles[1].title).toBe(ARTICLE_MOCKS[2].title);

            expect(pagination.pages.length).toBe(2);
        });

        it("It should get an article with limit and offset", async () => {
            const res = await request(app)
                            .get(`/api/articles/getFilteredArticles/`)
                            .query({ limit: 2, offset: 2 });

            const { articles, pagination } = res.body;

            expect(articles[0].title).toBe(ARTICLE_MOCKS[1].title);

            expect(pagination.pages.length).toBe(2);
        });

        it("It should get the second article with search", async () => {
            const res = await request(app)
                            .get(`/api/articles/getFilteredArticles/`)
                            .query({ search: "Test Article 2" });

            const { articles, pagination } = res.body;

            expect(articles[0].title).toBe("Test Article 2");

            expect(pagination.pages.length).toBe(1);
        });

        it("It should get the third article with categories", async () => {
            const categories = ["Technology", "Landscapes", "Tutorial"];

            const res = await request(app)
                            .get(`/api/articles/getFilteredArticles/`)
                            .query({ categories });

            const { articles, pagination } = res.body;

            expect(articles[0].title).toBe("Test Article 3");

            expect(pagination.pages.length).toBe(1);
        });

        it("It should get the second article with all filters", async () => {
            const categories = ["Technology", "Landscapes"];
            const search = "Test Article";

            const res = await request(app)
                            .get(`/api/articles/getFilteredArticles/`)
                            .query({ categories, search, limit: 1, offset: 2 });

            const { articles, pagination } = res.body;

            expect(articles[0].title).toBe("Test Article 2");

            expect(pagination.pages.length).toBe(2);
        });
    });
});