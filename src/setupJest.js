import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

fetchMock.dontMock();

window.$ = () => ({ on: jest.fn(), modal: jest.fn() });

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: {} })),
}));

global.fetchMock = fetchMock;
global.WEBSITE_URL = "http://localhost:3000/";