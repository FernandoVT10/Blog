import { Seeder } from "mongoose-data-seed";
import Category from "../server/models/Category";

const data = [
    { name: "Documental" },
    { name: "Animals" },
    { name: "Landscapes" },
    { name: "Wallpapers" },
    { name: "Code" },
    { name: "Tutorials" }
];

class CategoriesSeeder extends Seeder {
    async shouldRun() {
        return Category.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        return Category.create(data);
    }
}

export default CategoriesSeeder;
