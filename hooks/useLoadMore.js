import { useState, useEffect } from 'react';
import {onValue} from "firebase/database";
import styles from "./hooks.module.css"

function useLoadMore(ref, itemsPerPage) {
    const [currentlyShowing, setCurrentlyShowing] = useState(itemsPerPage);
    const [maxItems, setMaxItems] = useState(null);

    useEffect(() => {
        let cancelCallback = countMaxItems();
        return ()=>{
            cancelCallback();
        }
    }, []);

    function countMaxItems() {
        return onValue(ref, (snapshot) => {
            if (!snapshot.exists()) return;
            setMaxItems(snapshot.size);
        });
    }

    function getMoreItems() {
        let newShowing = currentlyShowing + itemsPerPage;
        setCurrentlyShowing(newShowing);
    }

    function getLessItems() {
        let newShowing = currentlyShowing - itemsPerPage;
        if (newShowing < itemsPerPage) newShowing = itemsPerPage;
        setCurrentlyShowing(newShowing);
    }

    function getLoadMoreButtons() {
        return (
            <div className={styles.loadMoreButtonsContainer}>
                {currentlyShowing+1 < maxItems && (
                    <button onClick={getMoreItems}>Pokaż więcej</button>
                )}

                {currentlyShowing > itemsPerPage && (
                    <button onClick={getLessItems} className={styles.lessButton}>
                        Pokaż mniej
                    </button>
                )}
            </div>
        );
    }

    return {
        currentlyShowing,
        maxItems,
        getMoreItems,
        getLessItems,
        getLoadMoreButtons,
    };
}

export default useLoadMore;