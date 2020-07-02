import Article from "../../models/Article";
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
        dayViews: 100,
        monthViews: 1000,
        totalViews: 10000,
        createdAt: Date.now()
    },
    {
        title: "Test Article 2",
        description: "Test description 2",
        cover: "cover-2.jpg",
        content: "Test content 2",
        categories: [],
        dayViews: 200,
        monthViews: 2000,
        totalViews: 20000,
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
        views: 550,
        createdAt: Date.now()
    },
    {
        type: "day",
        name: "Tuesday",
        views: 500,
        createdAt: Date.now() + 1
    }
];

jest.mock("../../utils/jwtAuthentication", () => jest.fn((_res, _req, next) => next()));

setupTestDB();

describe("views api", () => {
    beforeEach(async () => {
        await PermanentViews.insertMany(PERMANENT_VIEWS_MOCKS);

        await Article.insertMany(ARTILCE_MOckS);
    });

    afterEach(async () => {
        await Article.deleteMany();
        await PermanentViews.deleteMany();
    });

    describe("Get Total Views", () => {
        it("it should get the total of views", async () => {
            const res = await request(app).get("/api/views/getTotalViews/");

            expect(res.body).toEqual({
                _id: null,
                day: 300,
                month: 3000,
                total: 30000
            });
        });
    });

    describe("Get Views History", () => {
        it("It should get one month views", async () => {
            const res = await request(app).get("/api/views/getViewsHistory/month/1");

            const monthView = res.body[0];

            expect(monthView.name).toBe("February");
            expect(monthView.views).toBe(5122);
        });

        it("It should get two day views", async () => {
            const res = await request(app).get("/api/views/getViewsHistory/day/2");

            const dayViews = res.body;

            expect(dayViews[0].name).toBe("Tuesday");
            expect(dayViews[0].views).toBe(500);

            expect(dayViews[1].name).toBe("Monday");
            expect(dayViews[1].views).toBe(550);
        });
    });

    describe("Get Most Viewed Articles", () => {
        it("It should get one day view", async () => {
            const res = await request(app).get("/api/views/getMostViewedArticles/day/1");

            const dayViews = res.body;

            expect(dayViews[0].title).toBe("Test Article 2");
            expect(dayViews[0].cover).toBe("cover-2.jpg");
            expect(dayViews[0].views).toBe(200);
        });

        it("It should get two day views", async () => {
            const res = await request(app).get("/api/views/getMostViewedArticles/day/2");

            const dayViews = res.body;

            expect(dayViews[0].title).toBe("Test Article 2");
            expect(dayViews[0].cover).toBe("cover-2.jpg");
            expect(dayViews[0].views).toBe(200);

            expect(dayViews[1].title).toBe("Test Article");
            expect(dayViews[1].cover).toBe("cover.jpg");
            expect(dayViews[1].views).toBe(100);
        });
    });
});