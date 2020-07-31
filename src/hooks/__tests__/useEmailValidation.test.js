import { renderHook, act } from "@testing-library/react-hooks";
import { useEmailValidation } from "../useEmailValidation";

describe("Use Email Validation Hook", () => {
    it("should get an email validation error", () => {
        const { result } = renderHook(() => useEmailValidation());

        act(() => {
            result.current[1]("test@gmail.t");
        });

        expect(result.current[0].value).toBe("test@gmail.t");
        expect(result.current[0].error).toBe("The email is invalid");
    });

    it("shouldn't get an email validation error", () => {
        const { result } = renderHook(() => useEmailValidation());

        act(() => {
            result.current[1]("test@gmail.com");
        });

        expect(result.current[0].value).toBe("test@gmail.com");
        expect(result.current[0].error).toBeNull;
    });
});