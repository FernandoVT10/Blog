import Comment from "../../models/Comment";
import Article from "../../models/Article";
import request from "supertest";
import app from "../../app";

const COMMENT_MOCKS = [
    {
        name: "Test name",
        comment: "Test comment",
        createdAt: Date.now() + 2
    },
    {
        name: "Test name 2",
        comment: "Test comment 2",
        createdAt: Date.now() + 1
    },
    {
        name: "Test name 3",
        comment: "Test comment 3",
        createdAt: Date.now()
    }
];

const ARTICLE_MOCK = {
    title: "Test Article",
    description: "Test description",
    cover: "cover.jpg",
    content: "Test content",
    categories: [],
    createdAt: Date.now() + 2
};

setupTestDB();
console.log = jest.fn();

let article;

describe("comments api", () => {
    beforeEach(async () => {
        article = await Article.create(ARTICLE_MOCK);

        for(const { name, comment, createdAt } of COMMENT_MOCKS) {
            await Comment.create({
                articleId: article._id,
                name,
                comment,
                createdAt
            });
        }
    });

    afterEach(async () => {
        await Comment.deleteMany();
        await Article.deleteMany();

        article = null;
    });

    describe("Get Comments", () => {
        it("it should get the all comments", async () => {
            const res = await request(app).get(`/api/comments/getComments/${article._id}/3/0`);
            const comments = res.body;

            comments.forEach(({ name, comment }, index) => {
                expect(name).toBe(COMMENT_MOCKS[index].name);
                expect(comment).toBe(COMMENT_MOCKS[index].comment);
            });
        });

        it("it should get the second comment", async () => {
            const res = await request(app).get(`/api/comments/getComments/${article._id}/1/1`);
            const comments = res.body;

            expect(comments[0].name).toBe("Test name 2");
            expect(comments[0].comment).toBe("Test comment 2");
        });

        it("it should get an empty array", async () => {
            const res = await request(app).get(`/api/comments/getComments/null/1/0`);
            const comments = res.body;

            expect(comments).toEqual([]);
        });
    });

    describe("Add Comment", () => {
        it("It should get an error", async () => {
            const res = await request(app)
                .post(`/api/comments/addComment/`)
                .send({
                    articleId: "6eb5a0f353621a20f8961bd3",
                    name: "Test name",
                    comment: "Test comment"
                });

            expect(res.body).toEqual({
                status: false,
                error: { message: "The article doesn't exists" }
            });
        });

        it("It should get a max character error in the name", async () => {
            const res = await request(app)
                .post(`/api/comments/addComment/`)
                .send({
                    articleId: article._id,
                    name: "Test name with more of 30 characters",
                    comment: "Test comment"
                });

            expect(res.body.status).toBeFalsy();
            expect(res.body.error).toMatchSnapshot();
        });

        it("It should get a max character error in the email", async () => {
            const comment = randomText(501);

            const res = await request(app)
                .post(`/api/comments/addComment/`)
                .send({
                    articleId: article._id,
                    name: "Test name",
                    comment
                });

            expect(res.body.status).toBeFalsy();

            expect(res.body.error.message)
            .toBe(`comments validation failed: comment: Path \`comment\` (\`${comment}\`) is longer than the maximum allowed length (500).`);
        });

        it("It should create a comment", async () => {
            const comment = randomText(250);

            const res = await request(app)
                .post(`/api/comments/addComment/`)
                .send({
                    articleId: article._id,
                    name: "Test name #21",
                    comment
                });

            const { createdComment } = res.body;

            expect(res.body.status).toBeTruthy();
            expect(createdComment.name).toBe("Test name #21");
            expect(createdComment.comment).toBe(comment);
        });
    });
});