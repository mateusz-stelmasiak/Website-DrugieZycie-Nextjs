import Subpage from "../../components/subpages/subpage";
import {firebaseDb} from "../../firebase-config";
import {child,ref,get} from "firebase/database";
import {useEffect} from "react";
import {event} from "nextjs-google-analytics";

export async function getStaticPaths() {
    const dbRef = ref(firebaseDb);
    let snapshot = await get(child(dbRef, `infoPages`));
    if (!snapshot.exists()) return;
    let data = await snapshot.val();
    let paths = Object.keys(data).map((item) => {
            return {params: {name: item}};
        }
    );

    console.log(paths)

    return {
        paths: paths,
        fallback: 'blocking'
    }
}

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

    //current infopage
    let url = encodeURI(params.name)
    snapshot = await get(child(dbRef, `infoPages/${url}`));
    if (!snapshot.exists()) return { notFound: true};
    let res = await snapshot.val();
    data.title = res.title|| null;
    data.subtitle = res.subtitle || null;
    data.content = res.content|| null;
    data.link = url || null;
    data.cover=res.cover || null;
    data.metaDesc=res.metaDesc || null;

    return {
        props: {data},
        revalidate: 10
    }
}

export default function Info({data}) {

    return (
        <Subpage data={data}/>
    );
}
