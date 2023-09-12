import styles from "./success.module.css"
import {useEffect, useRef, useState} from "react";
import LoadingSpinner from "../../loadersAndPlaceholders/loadingSpinner";
import SectionTitleMiddle from "../sectionTitleMiddle";
import ShowFull from "../../common/showFull";
import Wave from "../../common/wave";
import {limitToLast, onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import dayjs from "dayjs";
import SuccessItem from "./successItem";
import SectionTitle from "../sectionTitle";


export default function Success({data}) {
    let parseData = (data) => {
        data.items = Object.keys(data.items).map((key)=> {return data.items[key]});
        data.items = data.items.filter((item)=>{
            return typeof item === 'object'
        })

        return data;
    }

    const [successes, setSuccesses] = useState(parseData(data));
    let [logoLink, setLogoLink] = useState(data.logoLink);


    let getLogo = async () => {
        const quer = await query(
            ref(firebaseDb, `info/logo`)
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let data = snapshot.val();
            setLogoLink(data);
        })
    }

    useEffect(() => {
        getData();
        getLogo();
    }, [])

    let getData = async () => {
        const quer = await query(
            ref(firebaseDb, '/successes')
            , orderByChild('date')
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let items = [];
            let backgroundImage = "";
            snapshot.forEach((snap) => {
                if (snap.key === "backgroundImage") {
                    backgroundImage = snap.val();
                } else {
                    items.push(snap.val());
                }
            })

            setSuccesses({
                items: items,
                backgroundImage: backgroundImage
            });
        });
    }
    return (
        <section className={styles.successContainer} id="success">
            {successes.backgroundImage &&
            <div className={styles.storyLineBackground}
                 style={{backgroundImage: "url(" + successes.backgroundImage + ")"}}/>
            }
            <Wave upsideDown/>

            <SectionTitleMiddle
                title={data.sectionInfo.title}
                subtitle={data.sectionInfo.subtitle}
                path={"successes"}
            >
                <div className={styles.successTitleBackgroundBlur}/>
            </SectionTitleMiddle>


            <div className={styles.storyLineItemsContainer}>

                {successes.items.map((item, index) => {
                    let isLeft = index % 2;
                    return (
                        <SuccessItem
                            key={"item-" + item.title + index}
                            item={item}
                            isLeft={isLeft}
                            index={index}
                        />
                    );

                })}
            </div>


        </section>
    );

}


