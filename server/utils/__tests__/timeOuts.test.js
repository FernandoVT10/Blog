import { resetDayViews, resetMonthViews } from "../articleViewsManager";
import { dayTimeOut } from "../timeOuts";

jest.mock("../articleViewsManager", () => ({
    resetDayViews: jest.fn(),
    resetMonthViews: jest.fn()
}));

jest.useFakeTimers();

describe("Time Outs", () => {
    afterEach(() => {
        setTimeout.mockReset();

        Date.prototype.getDate = () => 1;
        Date.prototype.getHours = () => 0;
        Date.prototype.getMinutes = () => 0;
        Date.prototype.getSeconds = () => 0;
    });

    it("should call setTimeout with the correclty time", () => {
        Date.prototype.getHours = () => 21;
        Date.prototype.getMinutes = () => 35;
        Date.prototype.getSeconds = () => 53;

        dayTimeOut();

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 8646000);
    });

    it("should call resetDayViews", () => {
        Date.prototype.getHours = () => 23;
        Date.prototype.getMinutes = () => 59;
        Date.prototype.getSeconds = () => 59;

        dayTimeOut();
        
        jest.runAllTimers();

        expect(resetDayViews).toHaveBeenCalled();
    });

    it("should call resetMonthViews", () => {
        Date.prototype.getDate = () => 1;
        Date.prototype.getHours = () => 23;
        Date.prototype.getMinutes = () => 59;
        Date.prototype.getSeconds = () => 59;

        dayTimeOut();
        
        jest.runAllTimers();

        expect(resetMonthViews).toHaveBeenCalled();
    });
});