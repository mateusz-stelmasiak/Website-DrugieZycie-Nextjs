import {useState} from "react";
import styles from "./showOnClick.module.css"

export default function ShowOnClick({toShow,text}){
    const [show,setShow]=useState(false);


    return (
        <div className={styles.ShowOnClick}>
            <button onClick={()=>setShow(!show)}>
                {text}
            </button>
            {show && toShow}
        </div>
    );
}