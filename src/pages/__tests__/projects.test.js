import { create } from "react-test-renderer";
import Projects from "../projects";


const SKILL_MOCKS = [
    {
        _id: 18,
        name: "React JS",
        image: "skill-1.jpg",
        color: "blue"
    },
    {
        _id: 19,
        name: "Node JS",
        image: "skill-2.jpg",
        color: "green"
    },
    {
        _id: 20,
        name: "GraphQl",
        image: "skill-3.jpg",
        color: "purple"
    }
];

describe("Project page", () => {
    it("It check if renders correctly", async () => {
        const component = create(<Projects skills={SKILL_MOCKS}/>);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it("It should display the message 'There is not skills available'", async () => {
        const component = create(<Projects skills={[]}/>);

        const div = component.root.findByProps({
            children: "There is not skills available"
        });

        expect(div.children).toEqual(["There is not skills available"]);
    });
});