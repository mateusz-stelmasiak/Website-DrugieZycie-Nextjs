import {Html, Head, Main, NextScript} from 'next/document'


// this exists for font optimisation purposes only
//https://nextjs.org/docs/basic-features/font-optimization
export default function Document() {

    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700&display=swap"
                    rel="stylesheet"/>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
                    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
                    crossOrigin="anonymous"
                />
                <link rel="shortcut icon" type="image/png" href="/favicon.ico"/>

            </Head>

            <body>
            <Main/>
            <NextScript/>
            </body>

        </Html>
    )
}
