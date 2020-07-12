import mongoose from "mongoose";

global.setupTestDB = (databaseName) => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://localhost/${databaseName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    });

    afterAll(async () => {
        const collections = Object.keys(mongoose.connection.collections);

        for (const collectionName of collections) {
            const collection = mongoose.connection.collections[collectionName];

            try {
                await collection.drop();
            } catch (error) {
                if (error.message === "ns not found"
                || error.message.includes("a background operation is currently running")) {
                    continue
                }

                console.log(error.message);
            }
        }

        await mongoose.connection.close();
    });

    afterEach(async () => {
        const collections = Object.keys(mongoose.connection.collections);

        for (const collectionName of collections) {
            const collection = mongoose.connection.collections[collectionName];
            await collection.deleteMany();
        }
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