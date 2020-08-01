import Views from "./Views";
import ArticleCardList from "./ArticleCardList";
import ArticlesTable from "./ArticlesTable";

import { useState } from "react";

export default () => {
    const [showArticlesTable, setShowArticlesTable] = useState(false);

    if(showArticlesTable) {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <ArticlesTable setShowArticlesTable={setShowArticlesTable}/>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <Views/>
                </div>
                <div className="col-12 mt-5">
                    <ArticleCardList setShowArticlesTable={setShowArticlesTable} />
                </div>
            </div>
        </div>
    );
}