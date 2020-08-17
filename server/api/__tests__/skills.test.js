import Skill from "../../models/Skill";
import supertest from "supertest";
import app from "../../app";
import { deleteImage } from "../../utils/imageUpload";

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

jest.mock("../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => {
        next();
    };
});

jest.mock("../../utils/imageUpload", () => ({
    uploadImage: jest.fn(() => {
        return (req, _res, next) => {
            if(req.body.image) {
                req.file = {
                    filename: req.body.image
                };
            }

            next();
        };
    }),
    uploadImages: () => { return () => {} },
    deleteImage: jest.fn()
}));

describe("skills api", () => {
    beforeEach(async () => {
        await Skill.insertMany(SKILLS_MOCK); 
    });

    afterEach(() => {
        deleteImage.mockReset();
    });

    describe("GetAllSkills", () => {
        it("should get all the skills", async () => {
            const res = await request.get("/api/skills/");
            const { skills } = res.body.data;

            expect(skills.length).toBe(3);
        });
    });

    describe("Get Skills By Id", () => {
        it("should get a skill", async () => {
            const skill = await Skill.findOne({ name: "Node JS" });

            const res = await request.get(`/api/skills/${skill._id}`);

            const { data } = res.body;

            expect(data.skill.name).toBe("Node JS");
            expect(data.skill.color).toBe("green");
        });

        it("should get a 404 not found error", async () => {
            const res = await request.get(`/api/skills/abcefabcefabcefabcefabce`);

            const { errors } = res.body;

            expect(errors).toEqual([
                {
                    status: 404,
                    message: `The skill abcefabcefabcefabcefabce doesn't exist`
                }
            ]);
        });
    });

    describe("Create Skill", () => {
        it("should create a skill", async () => {
            const res = await request.post("/api/skills/").send(
                {
                    name: "Test",
                    color: "indigo",
                    image: "test.jpg"
                }
            );

            const { createdSkill } = res.body.data;

            expect(createdSkill.name).toBe("Test");
            expect(createdSkill.color).toBe("indigo");
            expect(createdSkill.image).toBe("test.jpg");
        });

        it("should get 'the field image is required' error", async () => {
            const res = await request.post("/api/skills/").send(
                {
                    name: "Test",
                    color: "indigo"
                }
            );

            const { errors } = res.body;

            expect(errors).toEqual([
                {
                    status: 200,
                    message: "The 'image' field is required"
                }
            ]);
        });

        it("should delete the image when an error appears", async () => {
            await request.post("/api/skills/").send(
                {
                    name: "",
                    image: "test.jpg",
                    color: "indigo"
                }
            );

            expect(deleteImage).toHaveBeenCalledWith("/skills/test.jpg");
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
                {
                    name: "Test",
                    image: "test.jpg",
                    color: "indigo"
                }
            );

            const { updatedSkill } = res.body.data;

            expect(updatedSkill.name).toBe("Test");
            expect(updatedSkill.image).toBe("test.jpg");
            expect(updatedSkill.color).toBe("indigo");

            expect(deleteImage).toHaveBeenCalledWith("/skills/react-js.jpg");
        });

        it("should update the skill without image", async () => {
            const res = await request.put(`/api/skills/${skillId}`).send(
                {
                    name: "Test",
                    color: "indigo"
                }
            );

            const { updatedSkill } = res.body.data;

            expect(updatedSkill.name).toBe("Test");
            expect(updatedSkill.image).toBe("react-js.jpg");
            expect(updatedSkill.color).toBe("indigo");
            
            expect(deleteImage).not.toHaveBeenCalled();
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

        it("should delete the image when an error appears", async () => {
            await request.put("/api/skills/abcefabcefabcefabcefabce").send(
                {
                    name: "Test",
                    image: "test.jpg",
                    color: "indigo"
                }
            );

            expect(deleteImage).toHaveBeenCalledWith("/skills/test.jpg");

            await request.put(`/api/skills/${skillId}`).send(
                {
                    name: "",
                    image: "test2.jpg",
                    color: "indigo"
                }
            );

            expect(deleteImage).toHaveBeenCalledWith("/skills/test2.jpg");
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

            expect(deleteImage).toHaveBeenCalledWith("/skills/graphql.jpg");
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