import renderer from "react-test-renderer";
import ArticleCard from "../ArticleCard/";

const ARTICLE_MOCK = {
    _id: 95,
    title: "Test title",
    cover: "test-image.jpg",
    description: "Test description"
};

test('Check if <ArticleCard/> renders correctly', () => {
    const component = renderer.create(
        <ArticleCard article={ARTICLE_MOCK}/>
    );

    expect(component.toJSON()).toMatchSnapshot();
});