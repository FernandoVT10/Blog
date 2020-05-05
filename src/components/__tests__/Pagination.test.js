import Pagination from "../Pagination/";
import { create } from "react-test-renderer";
import { useRouter } from "next/router";

const PAGIANATION_MOCK = {
    hasPrevPage: true,
    prevPage: 5,
    hasNextPage: true,
    nextPage: 7,
    pages: [
        { number: 2, active: false },
        { number: 3, active: false },
        { number: 4, active: false },
        { number: 5, active: false },
        { number: 6, active: true },
        { number: 7, active: false },
        { number: 8, active: false }
    ]
};

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ })),
}));

describe("<Pagination/> Component", () => {
    it("Check if renders correctly", () => {
        const component = create(<Pagination pagination={PAGIANATION_MOCK}/>);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("It should redirect to 2 page", () => {
        let routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPush,
            query: {}
        }));

        const component = create(<Pagination pagination={PAGIANATION_MOCK}/>);

        const numbersItem = component.root.findAllByProps({ className: "pagination__number " });

        numbersItem[0].props.onClick();

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: {
                offset: 2
            }
        });
    });

    it("It should redirect to previous page", () => {
        let routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPush,
            query: {}
        }));

        const component = create(<Pagination pagination={PAGIANATION_MOCK}/>);

        const numbersItem = component.root.findByProps({ className: "fas fa-chevron-left" });

        numbersItem.parent.props.onClick();

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: {
                offset: 5
            }
        });
    });

    it("It should redirect to next page", () => {
        let routerPush = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPush,
            query: {}
        }));

        const component = create(<Pagination pagination={PAGIANATION_MOCK}/>);

        const numbersItem = component.root.findByProps({ className: "fas fa-chevron-right" });

        numbersItem.parent.props.onClick();

        expect(routerPush).toHaveBeenCalledWith({
            pathname: "/",
            query: {
                offset: 7
            }
        });
    });
});

