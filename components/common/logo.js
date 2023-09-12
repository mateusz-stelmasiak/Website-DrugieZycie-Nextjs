import Link from "next/link";
import styles from "./logo.module.css";
import {useEffect, useState} from "react";
import {onValue, query, ref} from "firebase/database";
import {firebaseDb} from "../../firebase-config";


const Logo = ({data,style}) => {
    let [logoLink,setLogoLink] = useState(data);

    useEffect(()=>{
        setUpOnValueListener();
    })

    let setUpOnValueListener = async()=>{
        const quer = await query(
            ref(firebaseDb, `info/logo`)
        );

        onValue(quer, (snapshot)=>{
            if (!snapshot.exists()) return;
            let data = snapshot.val();
            setLogoLink(data);
        })
    }

    return (
        <Link href="/" className={styles.container} style={style}>
            <div className={styles.imgContainer}>
                {logoLink && <img src={logoLink} alt={"logo"}/>}
            </div>

            <div className={styles.desc}>
                <div className={styles.firstLine}>DRUGIE ŻYCIE</div>
                <div className={styles.secondLine}>FRESENIUS MEDICAL CARE</div>
            </div>
        </Link>
    );
};
export default Logo;







