import Article from "../../models/Article";
import ArticleViews from "../../models/ArticleViews";
import PermanentViews from "../../models/PermanentViews";
import request from "supertest";
import app from "../../app";

const ARTILCE_MOckS = [
    {
        title: "Test Article",
        description: "Test description",
        cover: "cover.jpg",
        content: "Test content",
        categories: [],
        createdAt: Date.now()
    },
    {
        title: "Test Article 2",
        description: "Test description 2",
        cover: "cover-2.jpg",
        content: "Test content 2",
        categories: [],
        createdAt: Date.now() + 1
    }
];

const PERMANENT_VIEWS_MOCKS = [
    {
        type: "month",
        name: "January",
        views: 5002,
        createdAt: Date.now()
    },
    {
        type: "month",
        name: "February",
        views: 5122,
        createdAt: Date.now() + 1
    },
    {
        type: "day",
        name: "Monday",
        views: 502,
        createdAt: Date.now()
    },
    {
        type: "day",
        name: "Tuesday",
        views: 512,
        createdAt: Date.now() + 1
    }
];

jest.mock("../../utils/jwtAuthentication", () => jest.fn((_res, _req, next) => next()));

setupTestDB();

describe("views api", () => {
    beforeEach(async () => {
        await PermanentViews.insertMany(PERMANENT_VIEWS_MOCKS);

        const articles = await Article.insertMany(ARTILCE_MOckS);

        const articleViews = [
            {
                type: "day",
                articleId: articles[0]._id,
                views: 1000
            },
            {
                type: "day",
                articleId: articles[1]._id,
                views: 900
            },
            {
                type: "month",
                articleId: articles[0]._id,
                views: 10000
            },
            {
                type: "month",
                articleId: articles[1]._id,
                views: 9000
            },
            {
                type: "total",
                articleId: articles[0]._id,
                views: 100000
            },
            {
                type: "total",
                articleId: articles[1]._id,
                views: 90000
            }
        ];

        await ArticleViews.insertMany(articleViews);
    });

    afterEach(async () => {
        await Article.deleteMany();
        await PermanentViews.deleteMany();
        await ArticleViews.deleteMany();
    });

    describe("Get Total Views", () => {
        it("it should get the total of views", async () => {
            const res = await request(app).get("/api/views/getTotalViews/");

            expect(res.body).toEqual({
                day: 1900,
                month: 19000,
                total: 190000
            });
        });
    });

    describe("Get Views History", () => {
        it("It should get the month views", async () => {
            const res = await request(app).get("/api/views/getViewsHistory/month/1");

            const monthView = res.body[0];

            expect(monthView.name).toBe("February");
            expect(monthView.views).toBe(5122);
        });
    });

    describe("Get Most Viewed Articles", () => {
        it("It should get the day views", async () => {
            const res = await request(app).get("/api/views/getMostViewedArticles/day/2");

            const dayViews = res.body;

            expect(dayViews[0].title).toBe("Test Article");
            expect(dayViews[0].cover).toBe("cover.jpg");
            expect(dayViews[0].views).toBe(1000);

            expect(dayViews[1].title).toBe("Test Article 2");
            expect(dayViews[1].cover).toBe("cover-2.jpg");
            expect(dayViews[1].views).toBe(900);
        });
    });
});