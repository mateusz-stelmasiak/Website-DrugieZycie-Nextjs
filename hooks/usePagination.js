import { useState, useEffect } from 'react';
import {
    endBefore,
    limitToFirst,
    limitToLast,
    onValue,
    orderByChild,
    orderByKey,
    query,
    startAfter
} from "firebase/database";
import styles from "./hooks.module.css"

function usePagination(ref, itemsPerPage,orderBy,containerRef,prefetchedData,getPlaceholderValues) {
    const [firstKey, setFirstKey] = useState(prefetchedData.firstKey);
    const [lastKey, setLastKey] = useState(prefetchedData.lastKey);
    const [currPage, setCurrPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [data,setData] = useState(prefetchedData.items);

    useEffect(() => {
        calculateMaxPage();
        fetchFirstPage();
    }, []);

    function calculateMaxPage() {
        onValue(ref,(snapshot)=>{
            if (!snapshot.exists()) return;
            setMaxPage(Math.ceil(snapshot.size / itemsPerPage));
        })
    }

    function fetchFirstPage() {
        calculateMaxPage();
        const quer = query(
            ref,
            (orderBy ? orderByChild(orderBy):orderByKey()),
            limitToLast(itemsPerPage)
        );
        setCurrPage(1);
        assignValueFromQuery(quer);
    }

    function fetchNextPage() {
        if (currPage >= maxPage) return;
        setData(getPlaceholderValues());

        const quer = query(
            ref,
            (orderBy ? orderByChild(orderBy):orderByKey()),
            endBefore(parseInt(lastKey)),
            limitToLast(itemsPerPage)
        );
        setCurrPage(currPage + 1);
        assignValueFromQuery(quer);
        if(containerRef.current) containerRef.current.scrollIntoView();
    }

    function fetchPreviousPage() {
        if (currPage <= 1) return;
        setData(getPlaceholderValues());

        const quer = query(
            ref,
            (orderBy ? orderByChild(orderBy):orderByKey()),
            startAfter(parseInt(firstKey)),
            limitToFirst(itemsPerPage)
        );
        setCurrPage(currPage - 1);
        assignValueFromQuery(quer);
        if(containerRef.current) containerRef.current.scrollIntoView();
    }

    function getButtons() {
        return (
            <div className={styles.paginationButtonsContainer}>
                <button disabled={currPage <= 1} onClick={fetchPreviousPage}>
                    &lt;
                </button>
                <button className={styles.currentPage}>{currPage}</button>
                <button disabled={currPage >= maxPage} onClick={fetchNextPage}>
                    &gt;
                </button>
            </div>
        );
    }

    let assignValueFromQuery = async (quer) => {
        onValue(quer,  (snapshot) => {
            if (!snapshot.exists()) return;

            let currItems = [];
            snapshot.forEach((snap) => {
                if(!snap.exists()) return;
                let newItem = snap.val();
                newItem.key = snap.key;
                currItems.unshift(newItem);
            });
            setFirstKey(currItems[0][orderBy]);
            setLastKey(currItems[currItems.length - 1][orderBy]);
            setData(currItems);

        },(error)=>{
            console.log(error);
        });
    }

    return {
        currPage,
        data,
        setData,
        getButtons,
    };
}

export default usePagination;