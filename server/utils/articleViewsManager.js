import Article from "../models/Article";
import PermanentViews from "../models/PermanentViews";

export async function resetDayViews() {
    const date = new Date();
    const dayName = date.toLocaleDateString("en-MX", { weekday: "long" });

    const dayViews = await Article.aggregate([
        {
            $group: {
                _id: null,
                count: { $sum: "$dayViews" }
            }
        }
    ]);

    await PermanentViews.create({ type: "day", name: dayName, views: dayViews[0].count });

    await Article.updateMany({}, { dayViews: 0 });
}

export async function resetMonthViews() {
    const date = new Date();
    const monthName = date.toLocaleDateString("en-MX", { month: "long" });

    const monthViews = await Article.aggregate([
        {
            $group: {
                _id: null,
                count: { $sum: "$monthViews" }
            }
        }
    ]);

    await PermanentViews.create({
        type: "month",
        name: monthName,
        views: monthViews[0].count
    });

    await Article.updateMany({}, { monthViews: 0 });
}