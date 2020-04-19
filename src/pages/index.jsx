import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import MainCarousel from "../components/MainCarousel";
import ArticleCard from "../components/ArticleCard";
import Footer from "../components/Footer";

const mockArticles = [
    {
        id: 10,
        cover: "cover-1.jpg",
        title: "This is a test title",
        description: `Lorem   ipsum   dolor   sit   amet,   consectetur   adipiscing   elit,   sed   do  eiusmod  tempor  
        incididunt    ut    labore    et    dolore    magna    aliqua.    A    condimentum    vitae    sapien    pellentesque.
        `
    },
    {
        id: 12,
        cover: "cover-2.jpg",
        title: "This is a test title",
        description: `Lorem   ipsum   dolor   sit   amet,   consectetur   adipiscing   elit,   sed   do  eiusmod  tempor  
        incididunt    ut    labore    et    dolore    magna    aliqua.    A    condimentum    vitae    sapien    pellentesque.
        `
    }
];

export default () => {
    return (
        <Layout>
            <Navbar />

            <MainCarousel />

            <div className="container-fluid">
                <h2 className="title mt-4">Recent Articles</h2>

                <div className="row">
                    {mockArticles.map(article => {
                        return (
                            <div className="col-12 col-lg-6 mt-4" key={article.id}>
                                <ArticleCard article={article}/>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </Layout>
    );
}