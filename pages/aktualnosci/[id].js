import Subpage from "../../components/subpages/subpage";
import {firebaseDb} from "../../firebase-config";
import {child, ref, get, query, orderByChild, limitToFirst, onValue, limitToLast} from "firebase/database";
import GallerySubpage from "../../components/subpages/gallery/gallerySubpage";
import NewsSubpage, {findCover} from "../../components/subpages/news/newsSubpage";
import {useEffect} from "react";
import {event} from "nextjs-google-analytics";

export async function getStaticPaths() {
    const dbRef = ref(firebaseDb);
    let snapshot = await get(child(dbRef, `news`));
    if (!snapshot.exists()) return;
    let data = await snapshot.val();
    let paths = Object.keys(data).map((key) => {
            return {params: {id:key}};
        }
    );

    return {
        paths: paths,
        fallback: 'blocking'
    }
}

// This also gets called at build time
export async function getStaticProps({params}) {
    let data={};

    //get the news
    data.path  =`/news/${params.id}`;
    let quer = query(
        ref(firebaseDb, data.path )
    );
    let snapshot = await get(quer);
    if(!snapshot.exists())  return { notFound: true};
    data.news = snapshot.val();
    data.title = data.news.title || "";
    data.subtitle = data.news.subtitle || "";
    data.metaDesc= data.news.excerpt || "";

    //try to find a cover for the article
    data.cover = findCover(data.news.content);

    //logo
    const dbRef = ref(firebaseDb);
    snapshot = await get(child(dbRef, `/info/logo`));
    if (!snapshot.exists()) return { notFound: true};
    data.logoUrl = await snapshot.val();

    //allinfo pages
    snapshot = await get(child(dbRef, `/infoPages`));
    if (!snapshot.exists()) return { notFound: true};
    data.infoPages = await snapshot.val();

    return {
        props: {data},
        revalidate: 100
    }
}

export default function GalleryPage({data}) {
    useEffect(()=>{
        event("view_news", {
            category: "News",
            value:data.title
        });
    },[])

    return (
        <NewsSubpage data={data}/>
    );
}
