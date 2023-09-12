import {cloneElement, useEffect, useRef, useState} from "react";
import styles from "./gallery.module.css"
import SwipeRightPrompt from "./swipeRightPrompt";
import useWindowSize from "../../../hooks/useWindowSize";

export default function ScrollableTrack({items, title, showScrollPrompt,rightToLeft}) {
    let [hasBeenScrolled, setHasBeenScrolled] = useState(false);
    let [trackItems, setTrackItems] = useState();
    let windowSize = useWindowSize();

    let track = useRef();
    let mouseDownAt = useRef(0);
    let prevPercentage = useRef(0);
    let percentage = useRef(0)
    let isMouseOver = useRef(false);
    let titleRef = useRef();
    let showAllButtonRef = useRef();
    let directionMultiplier = rightToLeft ? 1:-1;

    let prepareItems = (items) => {
        if (!items) return;

        let itemsPrepared = items.map((item, index) => {
            let newItem = cloneElement(item,
                {
                    onClick: () => handleClick(index),
                    className: styles.scrollableItem,
                    draggable: false
                });
            return newItem;
        })
        setTrackItems(itemsPrepared);
    }

    useEffect(() => {
        prepareItems(items);
    }, [items])


    const handleOnDown = (e) => {
        if(!isMouseOver.current) return;
        mouseDownAt.current = e.clientX;
    }

    const handleOnUp = () => {
        mouseDownAt.current = 0;
        prevPercentage.current = percentage.current;
    }

    const handleClick = (index) => {

    }

    let scrollToIndex = (index) => {
        if (!track.current) return;

        let imageArray = track.current.getElementsByClassName(styles.scrollableItem);
        if (!imageArray) return;

        if(index!==0){
            let imageSize = imageArray[0].clientWidth; //in pixels
            let gutterSize = 30; //in pixels
            let imageSizeInPercent = (imageSize / window.innerWidth) * 100;
            let gutterSizeInPercent = (gutterSize / window.innerWidth) * 100;
            let titleOffset = 0;
            if(titleRef.current){
                titleOffset = (titleRef.current.offsetWidth/ window.innerWidth)* 100;
                titleOffset /= 4;
            }
            percentage.current = -1 *( (imageSizeInPercent*index) + (gutterSizeInPercent*index)+titleOffset);
        }
        else {
            percentage.current = 0;
        }


        track.current.animate({
            transform: `translate(${percentage.current}%, 0)`
        }, {duration: 10, fill: "forwards"});
    }

    const moveTrack = (delta, maxDelta) => {
        let imageArray = track.current.getElementsByClassName(styles.scrollableItem);
        if (!imageArray) return;
        if (!hasBeenScrolled) setHasBeenScrolled(true);

        let imageSize = imageArray[0].clientWidth || 300; //in pixels
        let imageSizeInPercent = (imageSize / window.innerWidth) * 100;
        let maxPercentage = directionMultiplier * (imageSizeInPercent) * (imageArray.length+1);

        maxPercentage /= 2;
        if (maxPercentage < directionMultiplier*100) maxPercentage *= 2;

        const percentageTemp = (delta / maxDelta) * maxPercentage,
            nextPercentageUnconstrained = prevPercentage.current + percentageTemp
        let nextPercentage = directionMultiplier<0
            ? Math.max(Math.min(nextPercentageUnconstrained, 0), maxPercentage)
            : Math.min(Math.max(nextPercentageUnconstrained, 0), maxPercentage)

        const fractionOfMax = -1 * (nextPercentage / maxPercentage) * 100;

        percentage.current = percentageTemp;

        if (!track.current) return;


        track.current.animate({
            transform: `translate(${nextPercentage}%, 0)`
        }, {duration: 1200, fill: "forwards"});

        for (const image of imageArray) {
            image.animate({
                objectPosition: `${100 + fractionOfMax}% center`
            }, {duration: 1200, fill: "forwards"});
        }

        if(nextPercentage + (directionMultiplier)*(imageSizeInPercent) <= maxPercentage){
            if(!showAllButtonRef.current) return;

            showAllButtonRef.current.animate(
                {transform: 'translate3d(0,0,0)',opacity:1},
                {duration: 2000, fill: "forwards"}
            )
        }
    }

    const handleOnMove = e => {
        let mouseDownAtVal = mouseDownAt.current;
        if (mouseDownAtVal === 0) return;

        const mouseDelta = (-1 * directionMultiplier) *(mouseDownAtVal - e.clientX);
        let maxDelta = window.innerWidth/2;
        moveTrack(mouseDelta, maxDelta);
    }

    //moving with two fingers across a touchpad
    let handleHorizontalScroll = (e) => {
        if(!isMouseOver.current) return;

        let mouseDelta = directionMultiplier*e.deltaX;
        if (mouseDelta === 0) return;

        moveTrack(mouseDelta, 1.5);
    }


    useEffect(() => {
        //set up listeners
        window.addEventListener("mousedown", handleOnDown);
        window.addEventListener("touchstart", (e)=>{handleOnDown(e.touches[0])} );
        window.addEventListener("mouseup", (e)=>{handleOnUp(e)} );
        window.addEventListener("touchend", (e)=>{handleOnUp(e.touches[0])});
        window.addEventListener("mousemove", (e)=>{handleOnMove(e)} );
        window.addEventListener("touchmove", (e)=>{handleOnMove(e.touches[0])});

        //allow scrolling with two fingers on touchpad
        window.addEventListener("wheel",handleHorizontalScroll);

        return () => {
            window.removeEventListener("mousedown", handleOnDown);
            window.removeEventListener("touchstart", handleOnDown);
            window.removeEventListener("mouseup", handleOnUp);
            window.removeEventListener("touchend", handleOnUp);
            window.removeEventListener("mousemove", handleOnMove);
            window.removeEventListener("touchmove", handleOnMove);
            window.removeEventListener("wheel", handleHorizontalScroll);
        }
    }, [])

    useEffect(()=>{
        if(!windowSize.width) return;

        scrollToIndex(0);
    },[windowSize])

    let rightToLeftStyle = {
        marginLeft:"unset",
        marginRight:'10%',
        flexDirection:"row-reverse"
    }

    let handleShowAllClick = ()=>{
        let encoded = title.replace(/\s/g, "-");
        encoded = encodeURIComponent(encoded);
        window.location.href = `/galeria/${encoded}`;
    }

    return (
        <>
            <div className={styles.imageTrack}
                 ref={track}
                 onMouseEnter={() => isMouseOver.current = true}
                 onMouseLeave={() => isMouseOver.current = false}
                 style={ rightToLeft? rightToLeftStyle :{}}
            >
                {(showScrollPrompt && !hasBeenScrolled) && <SwipeRightPrompt/>}
                <span ref={titleRef} className={styles.trackTitle}>{title}</span>

                {trackItems}

                <button onClick={handleShowAllClick} ref={showAllButtonRef}>
                    Zobacz wszystkie
                </button>
            </div>
        </>

    )
}