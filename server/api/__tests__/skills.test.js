import Skill from "../../models/Skill";
import request from "supertest";
import app from "../../app";

const SKILLS_MOCK = [
    {
        name: "Node JS",
        image: "node-js.jpg",
        color: "green"
    },
    {
        name: "React JS",
        image: "react-js.jpg",
        color: "blue"
    },
    {
        name: "GraphQL",
        image: "graphql.jpg",
        color: "purple"
    }
];

setupTestDB();

describe("skills api", () => {
    beforeEach(async () => {
        await Skill.insertMany(SKILLS_MOCK); 
    });

    afterEach(async () => {
        await Skill.deleteMany(); 
    });

    describe("GetAllSkills", () => {
        it("it should get the all skills", async () => {
            const res = await request(app).get("/api/skills/getAllSkills/");
            const skills = res.body;
    
            skills.forEach(({ name, image, color }, index) => {
                expect({ name, image, color }).toEqual(SKILLS_MOCK[index]);
            });
        });
    });
});