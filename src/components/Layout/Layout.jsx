import Head from "next/head";
import "../../styles/global.scss";
import { useEffect } from "react";

export default ({ children, title = "Fernando Vaca Tamayo Blog" }) => {
    return (
        <div>
            <Head>
                <title>{ title }</title>
                <link rel="shortcut icon" href="/favicon.ico"/>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"></link>
            </Head>

            { children }

            <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
            <script src="https://kit.fontawesome.com/63ef8f1397.js"></script>
        </div>
    );
}