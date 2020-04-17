import Head from "next/head";

export default ({ children, title = "Fernando Vaca Tamayo Blog" }) => {
    return (
        <div>
            <Head>
                <title>{ title }</title>
                <link rel="shortcut icon" href="/static/favicon.ico"/>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet" />
            </Head>

            { children }

            <style jsx global>
                {`
                    * {
                        font-family: 'Poppins', sans-serif;
                    }

                    body {
                        background: #1f1f1f;
                    }
                `}
            </style>
        </div>
    );
}