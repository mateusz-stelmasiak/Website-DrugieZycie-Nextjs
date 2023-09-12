import {useState} from "react";
import HTML2React from 'html2react'
import styles from "./showFull.module.css"

export default function ShowFull({fullText, excerpt, textToShow, textToHide, containerRef, maxExcerptLines}) {
    const [showFull, setShowFull] = useState(false);

    let toggleShowFull = () => {
        setShowFull(!showFull);
        if (containerRef?.current) containerRef.current.scrollIntoView();
    }

    return (
        <div className={styles.contentContainer} onClick={toggleShowFull}>
            {showFull ?
                <div className={styles.fullText}>
                    {HTML2React(fullText)}
                </div>
                : (typeof excerpt === "string")
                    ? <p className={styles.excerptContainer}
                         style={{'WebkitLineClamp?': ""+maxExcerptLines}}
                         dangerouslySetInnerHTML={{__html: excerpt}}/>
                    :
                    <p className={styles.excerptContainer}
                       style={{'WebkitLineClamp?': ""+maxExcerptLines}}
                    >
                        {excerpt}
                    </p>
            }

            <button onClick={toggleShowFull}
                    disabled={!fullText}>{showFull ? "< " + textToHide : "> " + textToShow}</button>
        </div>

    );

}