import { Seeder } from "mongoose-data-seed";
import Project from "../server/models/Project";
import Skill from "../server/models/Skill";

const data = [
    {
        images: [
            "1600096753867.jpg","1600096753912.jpg","1600096753928.jpg","1600096753934.jpg"
        ],
        skills: ["ReactJS", "MongoDB", "NodeJS"],
        title:"My personal blog",
        description:"This is the design of this blog.",
    },
    {
        images: [
            "1600097058243.jpg","1600097058262.jpg","1600097058379.jpg","1600097058393.jpg"
        ],
        skills:["PHP"],
        title: "A blog created with PHP",
        description: "This is a blog created with PHP.\n\nIt has a user sytem and an article system.",
    }
];

class ProjectsSeeder extends Seeder {
    async shouldRun() {
        return Project.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        for(const i in data) {
            data[i].skills = await Skill.find({ name: data[i].skills });
        }

        return Project.create(data);
    }
}

export default ProjectsSeeder;
