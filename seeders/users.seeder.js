import { Seeder } from "mongoose-data-seed";
import User from "../server/models/User";

const data = {
    username: "admin",
    password: "$2b$10$yphxY1OmQ0Y2Wgdev83VsuNmMXo.KNQv2FKc.03QhhZNN6rD5nJsi"
};

class UsersSeeder extends Seeder {
    async shouldRun() {
        return User.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        return User.create(data);
    }
}

export default UsersSeeder;
