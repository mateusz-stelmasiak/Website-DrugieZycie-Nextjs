import SubPage from "../../components/subpages/subpage";
import {firebaseDb} from "../../firebase-config";
import {child, ref, get, query, orderByChild} from "firebase/database";
import FullGallery from "../../components/subpages/gallery/gallerySubpage";

export async function getStaticPaths() {
    const dbRef = ref(firebaseDb);
    let snapshot = await get(child(dbRef, `gallery`));
    if (!snapshot.exists()) return;
    let data = await snapshot.val();
    let paths = Object.keys(data).map((item) => {
            return {params: {category: item}};
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
    //logo
    const dbRef = ref(firebaseDb);
    let snapshot = await get(child(dbRef, `/info/logo`));
    if (!snapshot.exists()) return { notFound: true};
    data.logoUrl = await snapshot.val();

    //allinfo pages
    snapshot = await get(child(dbRef, `/infoPages`));
    if (!snapshot.exists()) return { notFound: true};
    data.infoPages = await snapshot.val();


    let categoryName =params.category;
    categoryName = encodeURI(categoryName);
    // categoryName = categoryName.replaceAll( "-"," ");
    let path =`/gallery/${categoryName}`;
    data.path =`/gallery/${categoryName}`;
    //get images for gallery page
    let quer = query(
        ref(firebaseDb, path)
        ,orderByChild('order')
    );
    let images = [];
    let snap = await get(quer);
    snap.forEach((snap) => {
        let newImage = snap.val();
        images.unshift(newImage);
    });
    data.images=images;

    let title = decodeURI(categoryName);
    title = title .replaceAll( "-"," ");
    data.title = title;
    data.subtitle = "galeria zdjęć";
    if(data.images.length>0) {
        data.cover=data.images[0].link;
        data.images.shift();
    }

    return {
        props: {data},
        revalidate: 10
    }
}

export default function GalleryPage({data}) {
    data.content = <FullGallery data={{images:data.images,path:data.path}}/>

    return (
        <SubPage data={data}/>
    );
}
