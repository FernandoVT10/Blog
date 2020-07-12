import Article from "../../../models/Article";
import PermanentViews from "../../../models/PermanentViews";
import supertest from "supertest";
import app from "../../../app";

const request = supertest(app);

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

setupTestDB("test_views");

describe("views api", () => {
    beforeEach(async () => {
        await PermanentViews.insertMany(PERMANENT_VIEWS_MOCKS);

        await Article.insertMany(ARTILCE_MOckS);
    });

    describe("Get Views", () => {
        it("It should get one month views", async () => {
            const res = await request
                .get("/api/articles/views/")
                .query({ type: "month" });

            const monthView = res.body.data.views[0];

            expect(monthView.name).toBe("February");
            expect(monthView.views).toBe(5122);
        });

        it("It should get two day views", async () => {
            const res = await request
                .get("/api/articles/views/")
                .query({ type: "day", limit: 2 });

            const dayViews = res.body.data.views;

            expect(dayViews[0].name).toBe("Tuesday");
            expect(dayViews[0].views).toBe(500);

            expect(dayViews[1].name).toBe("Monday");
            expect(dayViews[1].views).toBe(550);
        });
    });

    describe("Get Total Views", () => {
        it("it should get the total of views", async () => {
            const res = await request.get("/api/articles/views/getTotalViews/");

            expect(res.body.data).toEqual({
                views: {
                    _id: null,
                    day: 300,
                    month: 3000,
                    total: 30000
                }
            });
        });
    });
});