import {useRef} from "react";
import styles from "./success.module.css";
import ShowFull from "../../common/showFull";
import RichTextContent from "../../common/richTextContent";


export default function SuccessItem({item, isLeft}) {
    let containerRef = useRef();

    return (
        <article className={isLeft ? styles.storyLineItemLeft : styles.storyLineItemRight}
                 ref={containerRef}
        >

            <div className={styles.textContainer}>
                <h3>{item.title}</h3>
                <div className={styles.storyLineItemSubtitle}>{item.subtitle}</div>

                <RichTextContent>
                    <ShowFull
                        fullText={item?.content}
                        excerpt={item?.excerpt}
                        textToShow={"CZYTAJ DALEJ"}
                        textToHide={"UKRYJ"}
                        containerRef={containerRef}
                    />
                </RichTextContent>

            </div>
        </article>
    );
}