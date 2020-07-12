import Project from "../../models/Project";
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

setupTestDB("test_projects");

describe("projects api", () => {
    beforeEach(async () => {
        const skills = await Skill.insertMany(SKILLS_MOCK); 

        // we add cateogires to mock articles

        PROJECT_MOCKS[0].skills.push(skills[0], skills[1]);
        PROJECT_MOCKS[1].skills.push(skills[0], skills[2]);
        PROJECT_MOCKS[2].skills.push(skills[0]);

        await Project.insertMany(PROJECT_MOCKS);
    });

    describe("Get Projects", () => {
        it("it should get all projects", async () => {
            const res = await request.get("/api/projects/");
            const { projects } = res.body.data;
    
            expect(projects.length).toBe(3);
        });

        it("it should get the projects with skill", async () => {
            const res = await request
                .get("/api/projects/")
                .query({ skill: "GraphQL" });
            const project = res.body.data.projects[0];

            expect(project.title).toBe(PROJECT_MOCKS[1].title);
            expect(project.description).toBe(PROJECT_MOCKS[1].description);
            expect(project.images).toEqual(PROJECT_MOCKS[1].images);
        });
    });

    describe("Get Project By Id", () => {
        it("it should get the third project", async () => {
            const project = await Project.findOne({ title: "Application with Node JS" });
            const res = await request.get(`/api/projects/${project._id}`);

            const { title, description } = res.body.data.project;

            expect(title).toBe(project.title);
            expect(description).toBe(project.description);
        });

        it("it should get a 404 error", async () => {
            const res = await request.get(`/api/projects/abcefabcefabcefabcefabce`);

            expect(res.body).toEqual({
                errors: [
                    {
                        status: 404,
                        message: `The project abcefabcefabcefabcefabce doesn't exist`
                    }
                ]
            });
        });
    });
});