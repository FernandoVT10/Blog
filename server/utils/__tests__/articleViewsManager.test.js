import Article from "../../models/Article";

import { resetDayViews, resetMonthViews } from "../articleViewsManager";
import PermanentViews from "../../models/PermanentViews";

const ARTICLES_MOCK = [
    {
        title: "Test Article",
        description: "Test description",
        cover: "cover.jpg",
        content: "Test content",
        categories: [],
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
        dayViews: 1500,
        monthViews: 50000,
        totalViews: 300000
    }
];

setupTestDB("test_article_views_manager");

describe("Article Views Manager", () => {
    beforeEach(async () => {
        await Article.insertMany(ARTICLES_MOCK);
    });

    afterEach(() => {
        Date.prototype.toLocaleDateString = () => "unknown";
    });

    describe("Reset Day Views", () => {
        it("should reset all the day views", async () => {
            await resetDayViews();

            const dayViews = await Article.aggregate([
                {
                    $group: {
                        _id: null,
                        count: { $sum: "$dayViews" }
                    }
                }
            ]);

            expect(dayViews[0].count).toBe(0);
        });

        it("should create a permanent view", async () => {
            Date.prototype.toLocaleDateString = () => "Test Day";

            await resetDayViews();

            const permanentView = await PermanentViews.findOne();

            expect(permanentView.type).toBe("day");
            expect(permanentView.name).toBe("Test Day");
            expect(permanentView.views).toBe(6000);
        });
    });

    describe("Reset Month Views", () => {
        it("should reset all month views", async () => {
            await resetMonthViews();

            const monthViews = await Article.aggregate([
                {
                    $group: {
                        _id: null,
                        count: { $sum: "$monthViews" }
                    }
                }
            ]);

            expect(monthViews[0].count).toBe(0);
        });

        it("should create a permanent view", async () => {
            Date.prototype.toLocaleDateString = () => "Test Month";

            await resetMonthViews();

            const permanentView = await PermanentViews.findOne();

            expect(permanentView.type).toBe("month");
            expect(permanentView.name).toBe("Test Month");
            expect(permanentView.views).toBe(230000);
        });
    });
});