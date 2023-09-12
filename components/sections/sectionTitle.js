import styles from "./sectionTitle.module.css";
import {useEffect, useState} from "react";
import {onValue, query, ref} from "firebase/database";
import {firebaseDb} from "../../firebase-config";

export default function SectionTitle({title, subtitle, style, path}) {
    const [stateTitle, setTitle] = useState(title);
    const [stateSubtitle, setSubtitle] = useState(subtitle);

    useEffect(() => {
        if (!path) return;
        fetchTitlesFromDb();
    })

    useEffect(() => {
        setTitle(title);
        setSubtitle(subtitle);
    }, [title, subtitle])

    let fetchTitlesFromDb = async () => {
        if (!path) return;

        const quer = await query(
            ref(firebaseDb, `sections/${path}`)
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let data = snapshot.val();
            setTitle(data.title || title);
            setSubtitle(data.subtitle || subtitle);
        })
    }

    return (
        <div className={styles.titleContainer} style={style}>
            <span className={styles.divider}/>

            <div className={styles.titleText}>

                <h2>
                    {stateTitle}
                </h2>


                <div className={styles.subtitleContainer}>
                    {stateSubtitle}
                </div>

                <hr className={styles.horizontalLine}/>

            </div>
        </div>
    );

}


