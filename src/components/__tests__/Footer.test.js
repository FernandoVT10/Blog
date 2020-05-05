import Footer from "../Footer/";
import { act, Simulate } from "react-dom/test-utils";
import { render } from "react-dom";
import { useRouter } from "next/router";
import { useState } from "react";

window.$ = () => ({ on: jest.fn(), modal: jest.fn() })

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: {} })),
}));

let container;

function T() {
    const [name, setName] = useState("");

    const onClick = () => {
        fetch("https://asdasdas.com")
        .then(res => res.json())
        .then(data => setName("Hola"));
    };

    return <button onClick={onClick}><span>{name}</span></button>;
}

describe('<ArticleFilter/> Component', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('Check if renders correctly', () => {
        act(() => {
            render(<Footer/>, container);
        });

        expect(container).toMatchSnapshot();
    });

    it('It should display a success message on the suscribe form', async () => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            { status: true, message: "Test success message" }
        ));

        render(<Footer/>, container);

        const form = container.querySelector("form");
        const input = container.querySelector("input");

        act(() => {
            input.value = "test@gmail.com";
            Simulate.change(input);
        });

        await act(async () => {
            Simulate.submit(form);
        });
        
        const p = container.querySelector(".main-footer__text.m-0");

        expect(p.textContent).toBe("Test success message");
    });

    it("It should show a success message on a modal", async () => {
        fetchMock.doMock();

        fetchMock.mockOnce(JSON.stringify(
            { status: true, message: "Test success message" }
        ));

        useRouter.mockImplementation(() => ({
            query: { subscriptionId: "a12af43f2a2b345c2a2fe" }
        }));

        await act(async () => {
            render(<Footer/>, container); 
        });

        const p = container.querySelector(".modal__body p");

        expect(p.textContent).toBe("Test success message");
    });
});