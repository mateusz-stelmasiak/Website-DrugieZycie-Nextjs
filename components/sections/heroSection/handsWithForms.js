import styles from "./heroSection.module.css"
import {useEffect, useRef} from "react";

export default function HandsWithForms() {
    let src = "https://firebasestorage.googleapis.com/v0/b/drugie-zycie.appspot.com/o/frontendAssets%2Fhand_with_form.png?alt=media&token=cc8e8132-5b9f-43d1-9f65-c551423c4b25";
    let bigHandRef = useRef();
    let smallHandRef = useRef();
    let lastOffset = useRef(0);

    let bigInitialTranslation = -100; //in pixels
    let bigFinalTranslation = -750;
    let bigTranslationChange = Math.abs(bigFinalTranslation - bigInitialTranslation);
    let bigConstantPartOfTransform = ",50px) rotate(-25deg)";

    let smallIntialRotation = -45; //in deg
    let smallFinalRotation = -2;
    let smallConstantPartOfTransform = "translate(80%,90px)";
    let smallRoationChange = Math.abs(smallFinalRotation - smallIntialRotation);

    let distanceToNextSection = 688; //in pixels
    let bigChangePerPixel = distanceToNextSection / bigTranslationChange;
    let smallChangePerPixel = smallRoationChange / distanceToNextSection;

    useEffect(() => {


        const handleScroll = () => {
            const offset = window.pageYOffset;
            if (offset >= distanceToNextSection){
                return;
            }

            let bigChange = bigInitialTranslation - (offset * bigChangePerPixel);
            let smallChange = smallIntialRotation + (offset * smallChangePerPixel);

            if (!bigHandRef.current || !smallHandRef.current) return;

            bigHandRef.current.style.transform = `translate(${"" + bigChange}px${bigConstantPartOfTransform}`;
            smallHandRef.current.style.transform = `rotate(${"" + smallChange}deg) ${smallConstantPartOfTransform}`;

            lastOffset = offset;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [])

    return (
        <div className={styles.handsContainer}>
            <img
                ref={bigHandRef}
                className={styles.bigHand}
                alt=""
                src={src}
            />
            <img
                ref={smallHandRef}
                className={styles.smallHand}
                alt=""
                src={src}
            />
        </div>
    )
}
