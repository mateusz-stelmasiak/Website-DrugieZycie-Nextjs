import {connect} from "react-redux";
import Logo from "../common/logo";
import Link from "next/link";
import {setPreferencesOpen} from "../../redux/cookieActions";
import styles from "./footer.module.css";
import {useEffect, useState} from "react";
import {onValue, query, ref} from "firebase/database";
import {firebaseDb} from "../../firebase-config";

function Footer({dispatch,data}) {
    let parseData = (data) =>{
        if(!data) return;
        return Object.keys(data.infoPages);
    }
    let [links,setLinks] = useState(parseData(data));


    useEffect(()=>{
        getLinks();
    },[])

    let getLinks = async()=>{
        const quer = await query(
            ref(firebaseDb, '/infoPages')
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let data = snapshot.val()
            setLinks(data);
        });
    }

    return (
        <footer className={styles.Footer}>
            <div className={styles.moreinfoContainer}>
                <Logo style={{color: 'white'}}/>
            </div>
            <div className={styles.hyperlinksContainer}>
                {links && Object.keys(links).map((link,index) => {
                    return(
                        <Link key={"footer-link"+index} href={`/info/${link}`}> {links[link].title} </Link>
                    )
                })}

                <Link href={'/info/polityka-cookies'}> Polityka cookies </Link>
                <a onClick={()=>dispatch(setPreferencesOpen(true))}> Ustawienia plików cookie </a>
            </div>
        </footer>
    );
}

export default connect()(Footer);