import styles from "./subpage.module.css"
import CookiesConsent from "../cookies/CookiesConsent";
import Header from "../header/header";
import Footer from "../footer/footer";
import Head from "next/head";


export default function SubpageLayout({children,data}) {

    return (
        <div className={styles.infoPage}>
            <CookiesConsent/>
            <Head>
                <title>Drugie
                    życie {data.title ? "- " + data.title : ""}</title>
                <meta name="description"
                      content={data.metaDesc ? data.metaDesc : ""}/>
            </Head>

            <Header data={data.logoUrl}/>


            <main className={styles.contentContainer}>
                {children}
            </main>

            <Footer
                data={{
                    infoPages:data.infoPages
                }}
            />
        </div>

    );
}