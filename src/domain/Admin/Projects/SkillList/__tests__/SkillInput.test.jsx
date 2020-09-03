import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SkillInput from "../SkillInput";

let container;

describe("Domain Projects <SkillInput/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("should call setSkillName", () => {
        const setSkillNameMock = jest.fn();
        
        render(
            <SkillInput
            onSubmit={() => {}}
            skillName="test"
            setSkillName={setSkillNameMock}
            onBlur={() => {}}/>
        , container);
        
        const input = container.querySelector("input");
        act(() => Simulate.change(input));

        expect(setSkillNameMock).toHaveBeenCalledWith("test");
    });

    it("should call onBlur", () => {
        const onBlurMock = jest.fn();
        
        render(
            <SkillInput
            onSubmit={() => {}}
            skillName="test"
            setSkillName={() => {}}
            onBlur={onBlurMock}/>
        , container);
        
        const input = container.querySelector("input");
        act(() => Simulate.blur(input));

        expect(onBlurMock).toHaveBeenCalled();
    });

    it("should call onSubmit", () => {
        const onSubmitMock = jest.fn();
        
        render(
            <SkillInput
            onSubmit={onSubmitMock}
            skillName="test"
            setSkillName={() => {}}
            onBlur={() => {}}/>
        , container);
        
        const form = container.querySelector("form");
        act(() => Simulate.submit(form));

        expect(onSubmitMock).toHaveBeenCalled();
    });
});