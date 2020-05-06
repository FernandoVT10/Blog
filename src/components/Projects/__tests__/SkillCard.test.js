import SkillCard from "../SkillCard/";
import { create } from "react-test-renderer";

const SKILL_MOCK = {
    _id: 18,
    name: "React JS",
    image: "skill-1.jpg",
    color: "blue"
};

test("Check if <SkillCard/> renders correctly", () => {
    const component = create(<SkillCard skill={SKILL_MOCK} openProjects={() => {}}/>);

    expect(component.toJSON()).toMatchSnapshot();
});