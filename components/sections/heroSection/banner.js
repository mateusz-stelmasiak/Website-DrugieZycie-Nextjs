import {SocialIcon} from "react-social-icons";
import {useEffect, useState} from "react";
import styles from "./heroSection.module.css";
import {get, onValue, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import RandomFactPicker from "./randomFactPicker";
import LoadingText from "../../loadersAndPlaceholders/loadingText";
import CirclePlaceholder from "../../loadersAndPlaceholders/circlePlaceholder";


const Banner = ({reference,data}) => {
    let [funFacts, setFunFacts] = useState(data.funFacts);
    let [info, setInfo] = useState(data.info);


    let getFacts = async () => {
        const quer = await query(
            ref(firebaseDb, `funFacts`)
        );

        await onValue(quer, async (snapshot)=>{
            if (!snapshot.exists()) return;
            let data = await snapshot.val();
            await setFunFacts(data);
        })
    }

    let getInfo = async () => {
        const quer = await query(
            ref(firebaseDb, `info`)
        );

        await onValue(quer, (snapshot)=>{
            if (!snapshot.exists()) return;
            let data = snapshot.val();
            setInfo(data);
        })
    }


    useEffect(() => {
        getFacts();
        getInfo();
    }, [])


    const iconStyle = {
        'width': '55px',
        'height': '55px',
    }

    return (

        <div className={styles.bannerContainer} ref={reference}>
                <div className={styles.bannerInfoBackgroundBlur}/>

                <div className={styles.bannerTextContainer}>
                    <h1>DRUGIE ŻYCIE</h1>
                    <span>
                        trwa
                        <b>&nbsp;{info?.numberOfEditions||<LoadingText charEstimate={2} textSizeInRem={1.3}/>}.&nbsp;edycja kampanii</b>!
                    </span>
                    <p className={styles.siteDescription}>{info?.siteDescription || <LoadingText linesEstimate={4} textSizeInRem={1}/>}</p>
                </div>

                <div className={styles.bannerInfoContainer}>
                    <div className={styles.socialMediaTitleContainer}>
                        <hr/>
                        <h2>
                            Dołącz do nas
                        </h2>
                        <hr/>
                    </div>

                    <div className={styles.bannerInnerContainer}>
                        <div className={styles.socialMediaIcons}>
                            {info?.socialMedia

                                ? info.socialMedia?.map((socialMediaItem, index) => {
                                    if(!socialMediaItem) return;

                                    let link = socialMediaItem.link;
                                    return (
                                        <SocialIcon key={"social-media-link" + index} style={iconStyle} url={link}/>
                                    );
                                })
                                : <>
                                    <CirclePlaceholder width={iconStyle.width} height={iconStyle.height}/>
                                    <CirclePlaceholder width={iconStyle.width} height={iconStyle.height}/>
                                    <CirclePlaceholder width={iconStyle.width} height={iconStyle.height}/>
                                  </>
                            }
                        </div>


                        <div className={styles.funFactsContainer}>
                             <RandomFactPicker funFacts={funFacts}/>
                        </div>
                    </div>
                </div>
        </div>


    );
}


export default Banner