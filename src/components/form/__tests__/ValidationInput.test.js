import ValidationInput from "../ValidationInput";
import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";

let container;

describe("<ValidationInput/> component", () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("Check if renders correctly", async () => {
        await act(async () => {
            render(
                <ValidationInput
                type="email"
                placeholder="Test input"
                onChange={() => {}}/>,
            container);
        });
    
        expect(container).toMatchSnapshot();
    });

    it("It should validate the email", async () => {
        const onChange = jest.fn();

        await act(async () => {
            render(
                <ValidationInput
                type="email"
                placeholder="Test input"
                onChange={onChange}/>,
            container);
        });

        const input = container.querySelector("input");
        const label = container.querySelector("label");

        act(() => {
            input.value = "test@ok.a";
            Simulate.change(input);
        });

        expect(label.textContent).toBe("The email is invalid");
        expect(onChange).toHaveBeenCalledWith({ value: "test@ok.a", valid: false });

        act(() => {
            input.value = "test@gmail.com";
            Simulate.change(input);
        });

        expect(label.textContent).toBe("");
        expect(onChange).toHaveBeenCalledWith({ value: "test@gmail.com", valid: true });
    });
});