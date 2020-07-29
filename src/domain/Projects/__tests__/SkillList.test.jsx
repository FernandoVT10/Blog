import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import SkillList from "../SkillList";

let container;

describe("<SkillList/> component", () => {
    beforeEach(() => {
        fetch.doMock();
        fetchMock.mockOnce(JSON.stringify({
            data: {
                skills: []
            }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
        
        fetchMock.mockReset();
    });

    it("It should call the api correctly", async () => {
        await act(async () => {
            render(<SkillList/>, container);
        });

        const fetchCall = fetchMock.mock.calls[0];

        expect(fetchCall[0]).toBe(WEBSITE_URL + "api/skills");
    });
});