import mongoose from "mongoose";
import Users from "./seeders/users.seeder";
import Categories from "./seeders/categories.seeder";
import Articles from "./seeders/articles.seeder";
import Skills from "./seeders/skills.seeder";
import Projects from "./seeders/projects.seeder";
import PermanentViews from "./seeders/permanent-views.seeder"

const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/fernandoblog";

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
    Users,
    Categories,
    Articles,
    Skills,
    Projects,
    PermanentViews
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
