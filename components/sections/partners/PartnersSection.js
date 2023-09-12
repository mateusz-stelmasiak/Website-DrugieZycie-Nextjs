import styles from "./Partners.module.css"
import {get, limitToLast, onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import PersonPartner from "./PersonPartner";
import LogoPartner from "./LogoPartner";

function PartnersSection({data}) {
    let parseData = async() => {
        if (!data?.partners) return {general: []};
        //TODO parse data toto
        return null;
    }


    let [partners, setPartners] = useState(parseData(data));

    useEffect(() => {
        getPartners();
    }, [])

    let getPartners = async () => {
        let quer = await query(
            ref(firebaseDb, '/partners')
            , orderByChild('/order')
        );

        onValue(quer, async (snapshot) => {
            if (!snapshot.exists()) return;
            setPartners({general: []});

            let categorizedPartners = {};
            let snapshotIter = [];
            snapshot.forEach((s) => {
                snapshotIter.unshift(s);
            })
            await Promise.all(
                snapshotIter.map(async (snap) => {
                    let partnerType = snap.key;
                    quer = query(
                        ref(firebaseDb, `/partners/${partnerType}`)
                        , orderByChild('order')
                    );

                    let values = [];
                    let childSnap = await get(quer);
                    if (!childSnap.exists()) return;
                    childSnap.forEach((childSnapSnap) => {
                        values.unshift(childSnapSnap.val())
                    })

                    if (partnerType.toUpperCase() === "OGÓLNI" || partnerType.toUpperCase() === "OGÓLNE") partnerType = "general";
                    categorizedPartners[partnerType] = values;
                }))

            setPartners(categorizedPartners);
        });

    }

    let createJSXObjectFromPartnerList = (partnerList) => {
        if (!Array.isArray(partnerList)) return;
        if (partnerList.length === 0) return;

        let content = [];

        partnerList.forEach((partner, index) => {
            let hasNameOrDescOrLogo = (partner.hasOwnProperty('name'))
                || (partner.hasOwnProperty('desc'))
                || (partner.hasOwnProperty('logo'));
            if (!hasNameOrDescOrLogo) return;

            if (!(partner.hasOwnProperty('logo')) || partner.logo === "") {
                content.push(
                    <PersonPartner
                        key={partner.name + "-" + index}
                        name={partner.name}
                        desc={partner.desc}
                        link={partner.link}/>
                )
                return;
            }
            content.push(
                <LogoPartner
                    key={partner.name + "-" + index}
                    name={partner.name}
                    desc={partner.desc}
                    logo={partner.logo}
                    link={partner.link}/>
            )
        })

        return <div key={"logo-partner" + Math.random()}
                    className={styles.partnersContainer}>
            {content}
        </div>
    }


    return (
        <section id="patrons" className={styles.Partners}>
            <h2>Organizator projektu</h2>
            <div className={styles.partnersTypeContainer}>
            <LogoPartner
                name={""}
                desc={""}
                width={304}
                logo={"https://firebasestorage.googleapis.com/v0/b/drugie-zycie.appspot.com/o/frontendAssets%2F2560px-Fresenius_Medical_Care_logo.svg.png?alt=media&token=9b166bc2-fa48-4b80-8714-4bfcd58b01cd"}
                link={"https://www.freseniusmedicalcare.pl/"}
            />
            </div>


            <h2>Partnerzy projektu</h2>

            {partners?.general &&
            <div className={styles.partnersTypeContainer}>
                {createJSXObjectFromPartnerList(partners.general)}
            </div>
            }

            {/*display all other types*/}
            {partners && Object.keys(partners).map((partnerType, index) => {
                if (partnerType === "general") {
                    return;
                }

                if (partners[partnerType].length === 0) return;
                return (
                    <div className={styles.partnersTypeContainer} key={`partner-type-${partnerType}-${index}`}>
                        <h2>Patronaty {partnerType}</h2>
                        {createJSXObjectFromPartnerList(partners[partnerType])}
                    </div>
                );
            })}
        </section>
    );
}

export default PartnersSection;