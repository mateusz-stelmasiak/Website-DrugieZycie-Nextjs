import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPointer} from "@fortawesome/free-solid-svg-icons";
import styles from "./swipeRightPrompt.module.css";

export default function SwipeRightPrompt(){
    return(
        <div className={styles.container}>
            <FontAwesomeIcon icon={faHandPointer} className={styles.hand}/>
            <span>Kliknij i przeciągnij aby zobaczyć więcej</span>
        </div>
    )
}