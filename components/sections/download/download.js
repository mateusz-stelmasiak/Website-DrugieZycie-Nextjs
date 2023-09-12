import DownloadItem from "./downloadItem";
import Faq from 'react-faq-component';
import {useEffect, useState} from "react";
import LoadingSpinner from "../../loadersAndPlaceholders/loadingSpinner";
import styles from "./download.module.css"
import SectionTitleMiddle from "../sectionTitleMiddle";
import useWindowSize from "../../../hooks/useWindowSize";
import {onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";


export default function Download({data}) {

    let parseData = (data)=>{
        let categoryArray = [];
        Object.keys(data.categories).forEach((categoryName) => {
            categoryArray.push(
                {
                    title: categoryName,
                    content:
                        <DownloadItem
                            links={data.categories[categoryName]}
                        />
                }
            );
        })
        return {rows: categoryArray};
    }

    let [downloadCategories, setDownloadCategories] = useState(parseData(data));
    const [rows, setRowsOption] = useState(null);
    const windowSize = useWindowSize();


    useEffect(() => {
        fetchData();
    }, []);

    //close all rows on screen resize, so that responsive tables don't bug out
    useEffect(() => {
        if (!rows) return;

        rows.forEach((row) => {
            row.close();
        })
    }, [windowSize])

    let fetchData = async () => {
        const quer = await query(ref(firebaseDb, '/download'));

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let data = [];
            snapshot.forEach((snap) => {
                data.push(
                    {
                        title: snap.key,
                        content:
                            <DownloadItem
                                links={snap.val()}
                            />
                    }
                );
            })
            setDownloadCategories({rows: data})
        })
    }

    return (
        <section className={styles.downloadContainer} id="download">
            <SectionTitleMiddle
                title={data.sectionInfo.title}
                subtitle={data.sectionInfo.subtitle}
                path={"download"}
            />

            <div className={styles.downloadItemsContainer}>
                {downloadCategories === null
                    ? <LoadingSpinner/>
                    : <Faq data={downloadCategories} getRowOptions={setRowsOption}/>
                }
            </div>

        </section>
    );
}


