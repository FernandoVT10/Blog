import { Seeder } from "mongoose-data-seed";
import PermanentViews from "../server/models/PermanentViews";

const data = [
    {
        type: "day",
        name: "Monday",
        views: 1243
    },
    {
        type: "day",
        name: "Tuesday",
        views: 934
    },
    {
        type: "day",
        name: "Wednesday",
        views: 1032
    },
    {
        type: "day",
        name: "Thursday",
        views: 1243
    },
    {
        type: "day",
        name: "Friday",
        views: 1732
    },
    {
        type: "month",
        name: "January",
        views: 9323
    },
    {
        type: "month",
        name: "February",
        views: 8322
    },
    {
        type: "month",
        name: "March",
        views: 10232
    },
    {
        type: "month",
        name: "April",
        views: 8234
    },
    {
        type: "month",
        name: "May",
        views: 12863
    }
];

class PermanentViewsSeeder extends Seeder {
    async shouldRun() {
        return PermanentViews.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        return PermanentViews.create(data);
    }
}

export default PermanentViewsSeeder;
