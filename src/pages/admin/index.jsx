import AdminLayout from "../../components/Admin/AdminLayout";
import Views from "../../components/Admin/Statistics/Views/";
import FullScreenLoader from "../../components/FullScreenLoader/";
import AdminLogin from "../../components/Admin/AdminLogin/";
import Articles from "../../components/Admin/Statistics/Articles/";
import ArticlesTable from "../../components/Admin/Statistics/ArticlesTable/";
import Api from "../../ApiController";

import { useEffect, useState } from "react";

function Index() {
    const [authenticationStatus, setAuthenticationStatus] = useState(false);
    const [showArticlesTable, setShowArticlesTable] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        Api.get("users/verifyToken/", true)
        .then(data => {
            if(data.verifyToken) {
                setAuthenticationStatus(true);
            }
            
            setLoading(false);
        });
    }, []);

    if(loading) {
        return <FullScreenLoader loading={loading}/>;
    }

    if(!authenticationStatus) {
        return (
            <AdminLogin/>
        );
    }

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