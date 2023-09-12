import {useEffect, useState} from 'react';
import NewsItem from './news-item';
import styles from "./news.module.css"
import {
    query,
    ref,
    onValue,
    orderByChild,
    startAfter,
    limitToFirst,
    limitToLast,
    endBefore,
    get,
    child
} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import usePagination from "../../../hooks/usePagination";

const NewsPage = ({containerRef,initialData}) => {
    let itemsPerPage = 3;
    let newsRef = child(ref(firebaseDb), 'news');
    let getPlaceholderValues = async () => {
        //intialize data with itemsPerPage empty items
        let dataPlaceHolders = [];
        for (let i = 0; i < itemsPerPage; i++) dataPlaceHolders.push({});
       return dataPlaceHolders
    }

    let {data,getButtons} = usePagination(newsRef,itemsPerPage,"date",containerRef,initialData,getPlaceholderValues);



    return (
        <div className={styles.newsContainer}>
            <div className={styles.newsContainerBackground}/>

            {data?.map((item, index) => (
                <NewsItem item={item} primary={index === 0} key={"news-item"+index}/>
            ))}

            {getButtons()}
        </div>
    );
};

export default (NewsPage);


