import Project from "../../models/Project";
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

const PROJECT_MOCKS = [
    {
        title: "Application Node JS and ReactJS",
        description: randomText(250),
        images: ["test1-1.jpg", "test1-2.jpg", "test1-3.jpg"],
        skills: []
    },
    {
        title: "Application with Node JS and GraphQL",
        description: randomText(250),
        images: ["test2-1.jpg", "test2-2.jpg", "test2-3.jpg"],
        skills: []
    },
    {
        title: "Application with Node JS",
        description: randomText(250),
        images: ["test3-1.jpg", "test3-2.jpg", "test3-3.jpg"],
        skills: []
    }
];

setupTestDB();
console.log = jest.fn();

describe("projects api", () => {
    beforeEach(async () => {
        const skills = await Skill.insertMany(SKILLS_MOCK); 

        // we add cateogires to mock articles

        PROJECT_MOCKS[0].skills.push(skills[0], skills[1]);
        PROJECT_MOCKS[1].skills.push(skills[0], skills[2]);
        PROJECT_MOCKS[2].skills.push(skills[0]);

        await Project.insertMany(PROJECT_MOCKS);
    });

    afterEach(async () => {
        await Project.deleteMany();
        await Skill.deleteMany();
    });

    describe("Get Projects By Skill Name", () => {
        it("it should get all projects", async () => {
            const res = await request(app).get("/api/projects/getProjectsBySkillName/Node JS");
            const projects = res.body;
    
            projects.forEach(({ title, description, images }, index) => {
                expect(title).toBe(PROJECT_MOCKS[index].title);
                expect(description).toBe(PROJECT_MOCKS[index].description);
                expect(images).toEqual(PROJECT_MOCKS[index].images);
            });
        });

        it("it should get the second projects", async () => {
            const res = await request(app).get("/api/projects/getProjectsBySkillName/GraphQL");
            const projects = res.body;

            expect(projects[0].title).toBe(PROJECT_MOCKS[1].title);
            expect(projects[0].description).toBe(PROJECT_MOCKS[1].description);
            expect(projects[0].images).toEqual(PROJECT_MOCKS[1].images);
        });
    });

    describe("Get Project By Id", () => {
        it("it should get the third project", async () => {
            const project = await Project.findOne({ title: "Application with Node JS" });

            const res = await request(app).get(`/api/projects/getProjectById/${project._id}`);

            expect(project.title).toBe(res.body.title);
            expect(project.description).toBe(res.body.description);
        });

        it("it should get an empty object", async () => {
            const res = await request(app).get(`/api/projects/getProjectById/null`);

            expect(res.body).toEqual({});
        });
    });
});