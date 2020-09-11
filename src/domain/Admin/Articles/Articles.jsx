import ArticlesTable from "./ArticlesTable"
import EditArticle from "./ArticleEditor/EditArticle";
import AddArticle from "./ArticleEditor/AddArticle";
import Categories from "./Categories";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default () => {
    const [articleId, setArticleId] = useState("");
    const [addArticle, setAddArticle] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const { editArticleId } = router.query;

        if(editArticleId) {
            setArticleId(editArticleId);
        } else {
            setArticleId();
        }
    }, [router.query]);

    if(articleId) {
        return <EditArticle articleId={articleId}/>;
    }

    if(addArticle) {
        return <AddArticle setAddArticle={setAddArticle}/>;
    }

    return (
        <div>
            <Categories/>
            <ArticlesTable setAddArticle={setAddArticle}/>
        </div>
    );
}