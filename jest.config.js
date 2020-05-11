module.exports = {
    projects: [
        {
            displayName: 'dom',
            testEnvironment: 'jsdom',
            moduleNameMapper: {
                "\\.(scss)$": "identity-obj-proxy"
            },
            setupFiles: ["./src/setupJest.js"],
            testMatch: ["**/src/**/__tests__/**/*.test.js?(x)"]
        },
        {
            displayName: 'node',
            testEnvironment: 'node',
            setupFiles: ["./server/setupJest.js"],
            testMatch: ['**/server/**/__tests__/**/*.test.js?(x)']
        }
    ]
};