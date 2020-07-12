import Skill from "../../models/Skill";
import supertest from "supertest";
import app from "../../app";

const request = supertest(app);

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

setupTestDB("test_skills");

describe("skills api", () => {
    beforeEach(async () => {
        await Skill.insertMany(SKILLS_MOCK); 
    });

    describe("GetAllSkills", () => {
        it("it should get all the skills", async () => {
            const res = await request.get("/api/skills/");
            const { skills } = res.body.data;

            expect(skills.length).toBe(3);
        });
    });
});