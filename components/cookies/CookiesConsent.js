import React, {useEffect, useState} from "react";
import Link from "next/link";
import {connect} from "react-redux";
import {getCookie} from "../../redux/cookieReducer";
import {acceptAllCookies, setPreferencesOpen, updateBehaviour} from "../../redux/cookieActions";
import CookiesPreferences from "./CookiesPreferences";
import styles from "./cookies.module.css"


function CookiesConsent({dispatch}) {
    const [showBar, setShowBar] = useState(false);

    let infoText = <span>Ta witryna przechowuje dane, w tym m.in.
        pliki cookie, aby zapewnić dostęp do podstawowych funkcjonalności
        witryny, a także na potrzeby marketingu i&nbsp;analiz. <Link href={'/pliki-cookies'}>Dowiedz się więcej</Link>
    </span>;


    //show popup if no cookie_consent cookie is set
    useEffect(() => {
        let consentCookie = getCookie('cookie_consent');
        if (!consentCookie) setShowBar(true);
    }, [])


    let acceptAll = () => {
        dispatch(acceptAllCookies());
        dispatch(updateBehaviour());
        setShowBar(false);
    }
    let openPreferences = ()=>{
        setShowBar(false);
        dispatch(setPreferencesOpen(true));
    }


    return (
        <>
            <CookiesPreferences/>

            {showBar &&
            <div className={styles.CookiesConsent}>
                <div className={styles.CookiesConsentHeader}>
                    <a onClick={acceptAll}>🗙</a>
                </div>

                <div className={styles.CookiesConsentContent}>
                    {infoText}

                    <div className={styles.buttonsContainer}>
                        <button className={styles.acceptAll} onClick={acceptAll}>
                            ✓ Zaakceptuj
                        </button>

                        <button className={styles.preferences} onClick={openPreferences}>
                            ⚙ Zarządzaj
                        </button>
                    </div>
                </div>
            </div>
            }
        </>
    );
}
export default connect()(CookiesConsent);
