import Project from "../../models/Project";
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

jest.mock("../../utils/jwtAuthentication", () => {
    return (_req, _res, next) => {
        next();
    };
});

jest.mock("../../utils/imageUpload", () => ({
    uploadImages: jest.fn(() => {
        return (req, _res, next) => {
            if(req.body.images) {
                req.files = req.body.images.map(image => ({
                    filename: image
                }));
            } else if(req.body.newImages) {
                req.files = req.body.newImages.map(image => ({
                    filename: image
                }));
            } else {
                req.files = [];
            }

            next();
        };
    }),
    uploadImage: () => { return () => {} },
    deleteImage: jest.fn()
}));

setupTestDB("test_projects");

describe("projects api", () => {
    beforeEach(async () => {
        const skills = await Skill.insertMany(SKILLS_MOCK); 

        // we add categpries to mock articles

        PROJECT_MOCKS[0].skills.push(skills[0], skills[1]);
        PROJECT_MOCKS[1].skills.push(skills[0], skills[2]);
        PROJECT_MOCKS[2].skills.push(skills[0]);

        await Project.insertMany(PROJECT_MOCKS);
    });

    afterEach(() => {
        deleteImage.mockReset();
    });

    describe("Get Projects", () => {
        it("should get all projects", async () => {
            const res = await request.get("/api/projects/");
            const { projects } = res.body.data;
    
            expect(projects.length).toBe(3);
        });

        it("should get the projects with skill", async () => {
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
        it("should get the third project", async () => {
            const project = await Project.findOne({ title: "Application with Node JS" });
            const res = await request.get(`/api/projects/${project._id}`);

            const { title, description } = res.body.data.project;

            expect(title).toBe(project.title);
            expect(description).toBe(project.description);
        });

        it("should get a 404 error", async () => {
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

    describe("Create Project", () => {
        it("should create a project with images", async () => {
            const res = await request.post("/api/projects/").send({
                title: "Test",
                description: "description",
                images: ["test-1.jpg", "test-2.jpg"],
                skills: ["React JS", "Node JS"]
            });

            const { createdProject } = res.body.data;

            expect(createdProject.title).toBe("Test");
            expect(createdProject.description).toBe("description");
            expect(createdProject.images).toEqual(["test-1.jpg", "test-2.jpg"]);
            expect(createdProject.skills.length).toBe(2);
        });

        it("should create a project without images", async () => {
            const res = await request.post("/api/projects/").send({
                title: "Test",
                description: "description",
                skills: ["React JS", "Node JS"]
            });

            const { createdProject } = res.body.data;

            expect(createdProject.title).toBe("Test");
            expect(createdProject.description).toBe("description");
            expect(createdProject.images).toEqual([]);
            expect(createdProject.skills.length).toBe(2);
        });

        it("should remove the images when an error appears", async () => {
            await request.post("/api/projects/").send({
                title: "",
                description: "description",
                images: ["test-1.jpg", "test-2.jpg"],
                skills: ["React JS", "Node JS"]
            });

            expect(deleteImage).toBeCalledWith("/projects/test-1.jpg");
            expect(deleteImage).toBeCalledWith("/projects/test-2.jpg");
            expect(deleteImage).toBeCalledTimes(2);
        });
    });

    describe("Update project", () => {
        let projectId = "";

        beforeEach(async () => {
            const project = await Project.findOne({
                title: "Application with Node JS and GraphQL"
            });

            projectId = project._id;
        });

        it("should update a project with newImages and remove oldImages", async () => {
            const res = await request.put(`/api/projects/${projectId}`).send({
                title: "Test",
                description: "description",
                currentImages: ["test2-1.jpg", "test2-2.jpg"],
                newImages: ["test-1.jpg", "test-2.jpg"],
                skills: ["React JS"]
            });

            const { updatedProject } = res.body.data;

            expect(updatedProject.title).toBe("Test");
            expect(updatedProject.description).toBe("description");
            expect(updatedProject.images).toEqual([
                "test2-1.jpg", "test2-2.jpg", "test-1.jpg", "test-2.jpg"
            ]);
            expect(updatedProject.skills[0].name).toBe("React JS");

            expect(deleteImage).toBeCalledWith("/projects/test2-3.jpg");
            expect(deleteImage).toBeCalledTimes(1);
        });

        it("should update a project without newImages and remove oldImages", async () => {
            const res = await request.put(`/api/projects/${projectId}`).send({
                title: "Test",
                description: "description",
                currentImages: ["test2-1.jpg"],
                skills: ["Node JS"]
            });

            const { updatedProject } = res.body.data;

            expect(updatedProject.title).toBe("Test");
            expect(updatedProject.description).toBe("description");
            expect(updatedProject.images).toEqual(["test2-1.jpg"]);
            expect(updatedProject.skills[0].name).toBe("Node JS");

            expect(deleteImage).toBeCalledWith("/projects/test2-2.jpg");
            expect(deleteImage).toBeCalledWith("/projects/test2-3.jpg");
            expect(deleteImage).toBeCalledTimes(2);
        });

        it("should get a 404 not found error and remove the newImages", async () => {
            const res = await request.put("/api/projects/abcefabcefabcefabcefabce").send({
                title: "Test",
                description: "description",
                newImages: ["test-1.jpg", "test-2.jpg"],
                currentImages: ["test2-1.jpg"],
                skills: ["Node JS"]
            });

            const { errors } = res.body;

            expect(errors).toEqual([
                {
                    status: 404,
                    message: `The project abcefabcefabcefabcefabce doesn't exist`
                }
            ]);
            expect(deleteImage).toHaveBeenCalledWith("/projects/test-1.jpg");
            expect(deleteImage).toHaveBeenCalledWith("/projects/test-2.jpg");
            expect(deleteImage).toHaveBeenCalledTimes(2);
        });
    });

    describe("Delete Project", () => {
        it("should delete a project and remove its images", async () => {
            const project = await Project.findOne({
                title: "Application with Node JS"
            });

            const res = await request.delete(`/api/projects/${project._id}`);

            const { deletedProject } = res.body.data;

            expect(deletedProject.title).toBe("Application with Node JS");


            expect(deleteImage).toHaveBeenCalledWith("/projects/test3-1.jpg");
            expect(deleteImage).toHaveBeenCalledWith("/projects/test3-2.jpg");
            expect(deleteImage).toHaveBeenCalledWith("/projects/test3-3.jpg");
            expect(deleteImage).toBeCalledTimes(3);
        });

        it("should get a 404 not found error", async () => {
            const res = await request.delete("/api/projects/abcefabcefabcefabcefabce");

            const { errors } = res.body;

            expect(errors).toEqual([
                {
                    status: 404,
                    message: "The project abcefabcefabcefabcefabce doesn't exist"
                }
            ]);
        });
    });
});