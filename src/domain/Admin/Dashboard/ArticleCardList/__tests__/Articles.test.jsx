import { render } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ArticleCardList from "../ArticleCardList";
import { useRouter } from "next/router";


const ARTICLES_ORDERED_BY_MONTH_vIEWS = [
    {
        id: 1,
        title: "Month #1",
        cover: "month-1.jpg",
        monthViews: 1500
    },
    {
        id: 2,
        title: "Month #2",
        cover: "month-2.jpg",
        monthViews: 1250
    },
    {
        id: 3,
        title: "Month #3",
        cover: "month-3.jpg",
        monthViews: 1000
    }
];

const ARTICLES_ORDERED_BY_DAY_vIEWS = [
    {
        id: 1,
        title: "Day #1",
        cover: "day-1.jpg",
        dayViews: 500
    },
    {
        id: 2,
        title: "Day #2",
        cover: "day-2.jpg",
        dayViews: 350
    },
    {
        id: 3,
        title: "Day #3",
        cover: "day-3.jpg",
        dayViews: 100
    }
];

let container;

describe("<ArticleCardList/> component", () => {
    beforeEach(() => {
        fetchMock.doMock();
        fetchMock
        .once(JSON.stringify({
            data: { articles: ARTICLES_ORDERED_BY_MONTH_vIEWS }
        }))
        .once(JSON.stringify({
            data: { articles: ARTICLES_ORDERED_BY_DAY_vIEWS }
        }));

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        fetchMock.mockReset();

        document.body.removeChild(container);
        container = null;
    });

    it("should call the api correctly", async () => {
        await act(async () => {
            render(<ArticleCardList />, container);
        });

        const fetchCalls = fetchMock.mock.calls;

        expect(fetchCalls[0][0]).toBe(WEBSITE_URL + "api/articles?sort=monthViews&paginate=false&limit=5");
        expect(fetchCalls[1][0]).toBe(WEBSITE_URL + "api/articles?sort=dayViews&paginate=false&limit=5");
    });

    it("should set the data", async () => {
        await act(async () => {
            render(<ArticleCardList />, container);
        });

        const mainArticlesViews = container.querySelectorAll(".dashboard-home-article-card__views");
        const mainArticlesTitles = container.querySelectorAll(".dashboard-home-article-card__title");

        expect(mainArticlesViews[0].textContent).toBe("1 500");
        expect(mainArticlesViews[1].textContent).toBe("500");

        expect(mainArticlesTitles[0].textContent).toBe("Month #1");
        expect(mainArticlesTitles[1].textContent).toBe("Day #1");
    });

    it("should add the sort parameter to url when we click on 'Show More Articles'", async () => {
        const routerPushMock = jest.fn();

        useRouter.mockImplementation(() => ({
            pathname: "/",
            push: routerPushMock
        }));

        const setShowArticlesTableMock = jest.fn();

        await act(async () => {
            render(<ArticleCardList setShowArticlesTable={setShowArticlesTableMock} />, container);
        });

        const showMoreArticles = container.querySelectorAll(".dashboard-home-article-card__footer-text");

        act(() => Simulate.click(showMoreArticles[0]));

        expect(routerPushMock).toHaveBeenCalledWith({
            pathname: "/",
            query: { sort: "monthViews" }
        });

        act(() => Simulate.click(showMoreArticles[1]));

        expect(routerPushMock).toHaveBeenCalledWith({
            pathname: "/",
            query: { sort: "dayViews" }
        });

        expect(setShowArticlesTableMock).toBeCalledTimes(2);
    });
});