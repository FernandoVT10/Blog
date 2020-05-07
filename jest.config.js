module.exports = {
    moduleNameMapper: {
        "\\.(scss)$": "identity-obj-proxy"
    },
    setupFiles: [
        "./src/setupJest.js",
        "./server/setupJest.js"
    ],
    testEnvironment: "node"
};