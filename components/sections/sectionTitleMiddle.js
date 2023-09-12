import ScaleText from "react-scale-text";
import styles from "./sectionTitleMiddle.module.css";
import {useEffect, useState} from "react";
import {onValue, query, ref} from "firebase/database";
import {firebaseDb} from "../../firebase-config";

export default function SectionTitleMiddle({title, subtitle,path,children}) {
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
        <div className={styles.titleContainer}>

            <div className={styles.titleText}>

                <h2>{stateTitle}</h2>
                <div className={styles.subtitleContainer}>
                    {stateSubtitle}
                </div>

            </div>

            {children}
        </div>
    );

}


