import { Seeder } from "mongoose-data-seed";
import Skill from "../server/models/Skill";

const data = [
    { name: "ReactJS" },
    { name: "NodeJS" },
    { name: "MongoDB" },
    { name: "PHP" }
];

class SkillsSeeder extends Seeder {
    async shouldRun() {
        return Skill.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        return Skill.create(data);
    }
}

export default SkillsSeeder;
