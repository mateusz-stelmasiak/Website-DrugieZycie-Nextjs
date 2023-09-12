import NewsItem from "./news-item";
import {useEffect, useRef, useState} from "react";
import 'dayjs/locale/pl';
import dayjs from "dayjs";
import SectionTitle from "../sectionTitle";
import styles from "./news.module.css"
import NewsPage from "./newsPage";
import {limitToLast, onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import Wave from "../../common/wave";

const News = ({data}) => {
    const [lastPostDate, setLastPostDate] = useState(data.lastPostDate);
    const containerRef = useRef(null);

    //download last item date on load
    useEffect(() => {
        dayjs.locale('pl')
        getLastPostDate();
    }, [])

    let getLastPostDate = async() =>{
        const quer = await query(
            ref(firebaseDb, '/news')
            ,orderByChild('date')
            ,limitToLast(1)
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let date;
            snapshot.forEach((snap)=>{
                date=snap.val().date;
            })
            let formatted =  dayjs.unix(date).format("DD/MM/YYYY")
            setLastPostDate(formatted);
        });
    }

    return (
        <section className={styles.sectionContainer} id="news" ref={containerRef}>

            <SectionTitle
                title={data.sectionInfo.title}
                subtitle={<span>ostatni wpis: <i>{lastPostDate}</i></span>}
                path={"news"}
            />

            <NewsPage
                containerRef={containerRef}
                initialData={data.firstNewsPage}
            />

        </section>
    );
};

export default News;




