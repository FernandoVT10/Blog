import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import FloatFilter from "../FloatFilter";

const CATEGORIES_MOCK = [
    {
        _id: 2,
        name: "Technology",
        active: false
    },
    {
        _id: 6,
        name: "Landscapes",
        active: true
    },
    {
        _id: 19,
        name: "Travels",
        active: false
    }
];

let container;

describe("<FloatFilter/> component", () => {
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("It should active and desactive category", async () => {
        const setCategoriesMock = jest.fn();

        await act(async () => {
            render(
                <FloatFilter
                search=""
                setSearch={jest.fn()}
                categories={CATEGORIES_MOCK}
                setCategories={setCategoriesMock}
                filterActive={true}/>,
            container);
        });

        let checkbox = container.querySelector("#category-Technology");

        act(() => {
            Simulate.change(checkbox);
        });

        expect(setCategoriesMock).toHaveBeenCalledWith([
            {
                _id: 2,
                name: "Technology",
                active: true
            },
            CATEGORIES_MOCK[1],
            CATEGORIES_MOCK[2]
        ]);

        checkbox = container.querySelector("#category-Landscapes");

        act(() => {
            Simulate.change(checkbox);
        });

        expect(setCategoriesMock).toHaveBeenCalledWith([
            CATEGORIES_MOCK[0],
            {
                _id: 6,
                name: "Landscapes",
                active: false
            },
            CATEGORIES_MOCK[2]
        ]);
    });

    it("It should call setSearch when we change the value of search input", async () => {
        const setSearchMock = jest.fn();

        await act(async () => {
            render(
                <FloatFilter
                search=""
                setSearch={setSearchMock}
                categories={CATEGORIES_MOCK}
                setCategories={jest.fn()}
                filterActive={true}/>,
            container);
        });

        const input = container.querySelector("input");

        act(() => {
            input.value = "Test";
            Simulate.change(input);
        });

        expect(setSearchMock).toHaveBeenCalledWith("Test");
    });
});