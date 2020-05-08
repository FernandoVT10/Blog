import mongoose from "mongoose";

global.setupTestDB = () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    });

    afterAll(() => {
        mongoose.connection.close();
    });
}

global.randomText = length => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};