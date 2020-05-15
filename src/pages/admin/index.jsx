import AdminLayout from "../../components/Admin/AdminLayout";
import Views from "../../components/Admin/Statistics/Views/";
import FullScreenLoader from "../../components/FullScreenLoader/";
import AdminLogin from "../../components/Admin/AdminLogin/";
import Api from "../../ApiController";

import { useEffect, useState } from "react";

function Index() {
    const [authenticationStatus, setAuthenticationStatus] = useState(false);
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

    return (
        <AdminLayout>
            <div className="row">
                <div className="col-12">
                    <Views/>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;