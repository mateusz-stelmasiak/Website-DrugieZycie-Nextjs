//for uniformly styling content that has been enetered through rich style editor
import styles from "./richTextContent.module.css"

export default function RichTextContent({children,style}){


    return(
        <div className={styles.richTextContainer} style={style}>
            {children}
        </div>
    )
}