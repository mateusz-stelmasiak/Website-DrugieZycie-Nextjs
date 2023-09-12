import SubpageLayout from "../../components/subpages/subpageLayout";
import Head from "next/head";
import SectionTitle from "../../components/sections/sectionTitle";
import CookiesPage from "../../components/cookies/CookiesPage";
import Subpage from "../../components/subpages/subpage";
import {child, get, ref} from "firebase/database";
import {firebaseDb} from "../../firebase-config";

// This also gets called at build time
export async function getStaticProps({params}) {
    let data={};

    //logo
    const dbRef = ref(firebaseDb);
    let snapshot = await get(child(dbRef, `/info/logo`));
    if (!snapshot.exists()) return { notFound: true};
    data.logoUrl = await snapshot.val();

    //allinfo pages
    snapshot = await get(child(dbRef, `/infoPages`));
    if (!snapshot.exists()) return { notFound: true};
    data.infoPages = await snapshot.val();

    data.title = "Polityka Cookies";
    return {
        props: {data},
        revalidate: 3600
    }
}

export default function PolitykaCookies({data}) {
    data.content = <CookiesPage/>

    return (
        <Subpage
            data = {data}
        />
    );
}
