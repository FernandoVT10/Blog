const path = require("path");

module.exports = {
    projects: [
        {
            displayName: "dom",
            testEnvironment: "jsdom",
            moduleNameMapper: {
                "\\.(scss)$": "identity-obj-proxy",
                "^@/(.*)$": path.join(__dirname, "src/$1"),
            },
            setupFiles: ["./src/setupJest.js"],
            testMatch: ["**/src/**/__tests__/**/*.test.js?(x)"],
            moduleDirectories: [
                "node_modules"
            ]
        },
        {
            displayName: "node",
            testEnvironment: "node",
            setupFiles: ["./server/setupJest.js"],
            testMatch: ['**/server/**/__tests__/**/*.test.js?(x)']
        }
    ]
};