import styles from "./gallery.module.css";
import SectionTitle from "../sectionTitle";
import Wave from "../../common/wave";
import {useEffect, useRef, useState} from "react";
import SectionTitleMiddle from "../sectionTitleMiddle";
import ScrollableTrack from "./scrollableTrack";
import {child, get, limitToFirst, limitToLast, onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import ImageWithPlaceholder from "../../loadersAndPlaceholders/imageWithPlaceholder";
import useLoadMore from "../../../hooks/useLoadMore";

export const imagesPerTrack = 4;
export const tracksPerPage = 2;

export let formatImages = (categorizedImages)=>{
    if(!categorizedImages) return;

    let formatedImages = {};
    Object.keys(categorizedImages).forEach((catName)=>{
        const imagesInCategory = Object.values(categorizedImages[catName]);
        formatedImages[catName] = imagesInCategory.map((image)=>{
            return (<ImageWithPlaceholder
                key={image.link+Math.random()}
                imageProps={{
                    src:image.link,
                    alt:image.desc,
                    draggable:false,
                    width:"350",
                    height:"500"
                }}
                widthExtension={500}
                className={styles.scrollableItem}
            />)
        })
    })

    return formatedImages;
}

export let parseImages = async (snapshot)=>{
    if(!snapshot.exists()) return;

    let categorizedImages = {};
    let snapshotIter = [];
    snapshot.forEach((s) => {
        snapshotIter.unshift(s);
    })

    for (const snap of snapshotIter) {
        let categoryName = snap.key;
        let quer = query(
            ref(firebaseDb, `/gallery/${categoryName}`)
            ,orderByChild('order')
            ,limitToLast(imagesPerTrack)
        );
        let images = [];
        let sn = await get(quer);
        sn.forEach((s) => {
            let newImage =  s.val();
            images.unshift(newImage);
        });
        let imageCategory = decodeURI(categoryName);
        imageCategory = imageCategory.replaceAll( "-"," ");
        categorizedImages[imageCategory]=images;
    }
    return categorizedImages;
}



export default function Gallery({data}) {
    let [images,setImages] = useState(formatImages(data.prefetchedImages))
    const galleryRef = child(ref(firebaseDb), 'gallery');
    const { currentlyShowing, getLoadMoreButtons } = useLoadMore(galleryRef, tracksPerPage);

    useEffect(() => {
        getImages(currentlyShowing);
    }, [currentlyShowing]);


    let getImages = async (trackAmmount) => {
        let quer = query(
            ref(firebaseDb, 'gallery')
            ,orderByChild('order')
            ,limitToLast(trackAmmount)
        );

        onValue(quer, async (snapshot) => {
            if (!snapshot.exists()) return;
            let categorizedImages = await parseImages(snapshot);
            let formatedImages = await formatImages(categorizedImages);
            setImages(formatedImages);
        });

    }

    return (
        <section className={styles.gallery} id={"galeria"}>
            <Wave upsideDown={true}/>

            <SectionTitleMiddle
                title={data.sectionInfo?.title}
                subtitle={data.sectionInfo?.subtitle}
                path={"gallery"}
            />

            {images && Object.keys(images).map((imageCategory,index)=>{
                let items = images[imageCategory];
                if(items.length ===0) return;
                let showScrollPrompt = index===0;
                // let right = index%2 !== 0;
                let right = false;
                return (
                    <ScrollableTrack
                        showScrollPrompt={showScrollPrompt}
                        title={imageCategory}
                        key={Math.random()}
                        items={items}
                        rightToLeft={right}
                />)
            })}

            {getLoadMoreButtons()}


        </section>
    );
}

