import AdminLayout from "../../components/Admin/AdminLayout";
import Views from "../../components/Admin/Statistics/Views/";
import Articles from "../../components/Admin/Statistics/Articles/";
import ArticlesTable from "../../components/Admin/Statistics/ArticlesTable/";

import { useState } from "react";

function Index() {
    const [showArticlesTable, setShowArticlesTable] = useState(false);

    const getPage = () => {
        if(showArticlesTable) {
            return (
                <div className="row">
                    <div className="col-12">
                        <ArticlesTable setShowArticlesTable={setShowArticlesTable}/>
                    </div>
                </div>
            );
        }

        return (
            <div className="row">
                <div className="col-12">
                    <Views/>
                </div>
                <div className="col-12 mt-5">
                    <Articles setShowArticlesTable={setShowArticlesTable} />
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            { getPage() }
        </AdminLayout>
    );
};

export default Index;