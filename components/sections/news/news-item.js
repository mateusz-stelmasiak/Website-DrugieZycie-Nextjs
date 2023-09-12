import dayjs from "dayjs"
import styles from "./news.module.css"
import ShowFull from "../../common/showFull";
import {useEffect, useRef} from "react";
import LoadingText from "../../loadersAndPlaceholders/loadingText";
import RichTextContent from "../../common/richTextContent";

const NewsItem = ({item, primary}) => {
    const ref = useRef();

    //takes date from item, or sets placeholders if no date given
    const formattedDate = item.date
        ? dayjs.unix(item.date).format("DD MMMM YYYY").split(" ")
        : [<LoadingText charEstimate={2} textSizeInRem={3}
                        key={`${item?.title}-day-placeholder` + Math.random()}/>,
            <LoadingText charEstimate={7} textSizeInRem={0.8}
                         key={`${item?.title}-month-placeholder` + Math.random()}/>,
            <LoadingText charEstimate={2} textSizeInRem={0.8}
                         key={`${item?.title}-year-placeholder` + Math.random()}/>
        ];
    const mobileDate = item.date && dayjs.unix(item.date).format("DD/MM/YYYY")

    let handleReadMore = ()=>{
        window.location.href = `/aktualnosci/${item.key}`;
    }

    return (
        <article className={styles.itemContainer} id={primary ? "primary" : ""} ref={ref}>

            <div className={styles.dateContainer}>
                <span>{formattedDate[0]}</span>
                <span>{formattedDate[1]}</span>
                <span>{formattedDate[2]}</span>
            </div>

            <div className={styles.contentContainer}>
                <span className={styles.newsTitle}>
                    {item.title || <LoadingText linesEstimate={1} textSizeInRem={2.5}/>}
                </span>

                <span className={styles.newsAuthor}>
                    <b>Autor:&nbsp;</b> {item.author || <LoadingText charEstimate={10} textSizeInRem={0.9}/>}
                </span>

                <div className={styles.newsContent}>
                    {item.excerpt || <LoadingText linesEstimate={2} textSizeInRem={1}/>}
                </div>

                <button onClick={handleReadMore}>
                    &gt; CZYTAJ DALEJ
                </button>

                <div className={styles.mobileNewsItemFooter}>
                    <span>{item.author || <LoadingText charEstimate={10} textSizeInRem={0.9}/>}</span>
                    <span>&nbsp;•&nbsp;</span>
                    <span>{mobileDate}</span>
                </div>

            </div>
        </article>
    )
}


export default NewsItem;