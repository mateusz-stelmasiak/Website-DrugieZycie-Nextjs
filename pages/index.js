import Header from "../components/header/header";
import HeroSection from "../components/sections/heroSection/heroSection";
import News from "../components/sections/news/news";
import Head from 'next/head'
import Success from "../components/sections/success/success";
import Media from "../components/sections/media/media";
import Download from "../components/sections/download/download";
import Contact from "../components/sections/contact/contact";
import CookiesConsent from "../components/cookies/CookiesConsent";
import Footer from "../components/footer/footer";
import PartnersSection from "../components/sections/partners/PartnersSection";
import {get, limitToFirst, limitToLast, orderByChild, orderByKey, query, ref} from "firebase/database";
import {firebaseDb} from "../firebase-config";
import dayjs from "dayjs";
import Gallery, {parseImages, tracksPerPage} from "../components/sections/gallery/gallery";
import styles from "../components/sections/success/success.module.css";
import {getAsObject} from "../fetching/firebaseUtils";


//get data for all the components!
//then pass em down bby
//dummy
export async function getStaticProps() {
    let data = {};
    let paths = [
        {name:"campaignVoievoidships"},
        {name:"download"},
        {name:"funFacts"},
        {name:"galeria"},
        {name:"info"},
        {name:"infoPages"},
        {name:"media",orderBy:"order"},
        // {name:"news"},
        {name:"partners"},
        {name:"sections"},
        {name:"successes"}
    ]

    let quer;
    await Promise.all(paths.map(async (path) => {
        quer = query(
            ref(firebaseDb, path.name)
            ,(path.orderBy ? orderByChild(path.orderBy) : orderByKey())
        );
        let snapShot = await get(quer);

        //has to be looped through in order to keep orderBy order lol
        if(path.orderBy){
            let dataTemp = [];
            snapShot.forEach((snap)=>{
                dataTemp.unshift(snap.val());
            })
            data[path.name] = dataTemp;
        }
        else{
            data[path.name] = snapShot.val();
        }
    }));

    //get last post date
    quer = await query(
        ref(firebaseDb, '/news')
        , orderByChild('date')
        , limitToLast(1)
    );
    let snapshot = await get(quer);
    if (!snapshot.exists()) return {props: {data}, revalidate: 3600};
    let date;
    snapshot.forEach((snap)=>{
        date=snap.val().date;
    })
    let lastPostDate = dayjs.unix(date).format("DD/MM/YYYY")
    data.lastPostDate = lastPostDate;

    //prefetch first page of news as well
    quer = query(
        ref(firebaseDb, 'news')
        , orderByChild('date')
        , limitToLast(3)
    );
    snapshot = await get(quer);
    let firstNewsPage = [];
    await snapshot.forEach((snap) => {
        let newItem = snap.val();
        newItem.key = snap.key;
        firstNewsPage.unshift(newItem);
    });

    let firstKey = firstNewsPage[0].date;
    let lastKey = firstNewsPage[firstNewsPage.length - 1].date;
    data.firstNewsPage = {
        items:firstNewsPage,
        firstKey:firstKey,
        lastKey:lastKey
    }

    //prefetch first page of gallery images
    quer = query(
        ref(firebaseDb, 'gallery')
        ,orderByChild('order')
        ,limitToFirst(tracksPerPage)
    );
    snapshot = await get(quer);
    data.galleryImages =  await parseImages(snapshot);
    return {props: {data}, revalidate: 3600};
}


export default function Home({data}) {


    return (
        <>
            <Head>
                <title>Kampania drugie życie</title>
                <meta name="description"
                      content="Pierwsza edycja kampanii wystartowała w roku szkolnym 2008/2009 w Wielkopolsce.
                      Od tamtej pory do akcji promującej rozmowę o oświadczeniach woli i świadomym dawstwie
                      narządów przystąpiło 8 kolejnych województw."/>
            </Head>

            <CookiesConsent/>

            <Header data={data.info.logo}/>

            <HeroSection
                data={{
                    campaignVoievoidships: data.campaignVoievoidships,
                    info:data.info,
                    funFacts: data.funFacts
                }}
            />

            <main>

                <News data={{
                    lastPostDate:data.lastPostDate,
                    firstNewsPage:data.firstNewsPage,
                    sectionInfo:data.sections.news
                }}/>
                <Gallery
                    data={{
                        prefetchedImages: data.galleryImages,
                        sectionInfo:data.sections.gallery
                    }}
                />
                <Media
                    data={{
                        mediaLinks :data.media,
                        sectionInfo:data.sections.media
                    }}
                />

                <div style={{position:"relative"}}>
                    <div className={styles.storyLineDottedLine}/>
                    <Success
                        data={{
                            logoLink:data.info.logo,
                            backgroundImage:data.successes.backgroundImage,
                            items:data.successes,
                            sectionInfo:data.sections.successes
                        }}
                    />

                    <Contact/>
                </div>


                <Download
                    data={{
                        categories :data.download,
                        sectionInfo:data.sections.download
                    }}
                />
                <PartnersSection
                    data={{
                        partners :data.partners,
                    }}
                />
            </main>

            <Footer
                data={{
                    infoPages:data.infoPages
                }}
            />
        </>
    )
}
