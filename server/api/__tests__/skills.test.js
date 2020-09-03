import Skill from "../../models/Skill";
import supertest from "supertest";
import app from "../../app";

const request = supertest(app);

const SKILLS_MOCK = [
    { name: "Node JS" },
    { name: "React JS" },
    { name: "GraphQL" }
];

setupTestDB("test_skills");

jest.mock("../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => {
        next();
    };
});

describe("skills api", () => {
    beforeEach(async () => {
        await Skill.insertMany(SKILLS_MOCK); 
    });

    describe("GetAllSkills", () => {
        it("should get all the skills", async () => {
            const res = await request.get("/api/skills/");
            const { skills } = res.body.data;

            expect(skills.length).toBe(3);
        });
    });

    describe("Create Skill", () => {
        it("should create a skill", async () => {
            const res = await request.post("/api/skills/").send(
                { name: "Test" }
            );

            const { createdSkill } = res.body.data;

            expect(createdSkill.name).toBe("Test");
        });
    });

    describe("Update Skill", () => {
        let skillId;

        beforeEach(async () => {
            const skill = await Skill.findOne({ name: "React JS" });

            skillId = skill._id;
        });

        it("should update the skill with image", async () => {
            const res = await request.put(`/api/skills/${skillId}`).send(
                { name: "Test" }
            );

            const { updatedSkill } = res.body.data;

            expect(updatedSkill.name).toBe("Test");
        });

        it("should get a 404 not found error", async () => {
            const res = await request.put("/api/skills/abcefabcefabcefabcefabce").send(
                {
                    name: "Test",
                    color: "indigo"
                }
            );

            const { errors } = res.body;

            expect(errors).toEqual([
                {
                    status: 404,
                    message: `The skill abcefabcefabcefabcefabce doesn't exist`
                }
            ]);
        });
    });

    describe("Delete Skill", () => {
        let skillId;

        beforeEach(async () => {
            const skill = await Skill.findOne({ name: "GraphQL" });

            skillId = skill._id;
        });

        it("should delete the skill", async () => {
            const res = await request.delete(`/api/skills/${skillId}`);

            const { deletedSkill } = res.body.data;

            expect(deletedSkill.name).toBe("GraphQL");
        });

        it("should get a 404 not found error", async () => {
            const res = await request.delete("/api/skills/abcefabcefabcefabcefabce");

            const { errors } = res.body;

            expect(errors).toEqual([
                {
                    status: 404,
                    message: `The skill abcefabcefabcefabcefabce doesn't exist`
                }
            ]);
        });
    });
});