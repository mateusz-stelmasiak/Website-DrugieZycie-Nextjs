import {useEffect, useState} from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import useLoadMore from "../../../hooks/useLoadMore";
import {child, get, limitToLast, onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import ImageWithPlaceholder from "../../loadersAndPlaceholders/imageWithPlaceholder";
import {event} from "nextjs-google-analytics";

let parseImages = (data)=>{
    if(!data) return;
    return data.map((image)=>{
        return{
            height: 200,
            src: image.link,
            original: image.link,
            caption: image.desc,
            width:400,
            style:{
                maxWidth: 400,
                height: 212,
            }

        }
    })
}

export default function GallerySubpage({data}) {
    let [images,setImages] = useState(parseImages(data.images));
    let imagesPerLoad = 8;
    const galleryRef = child(ref(firebaseDb), data.path);
    const {currentlyShowing,getLoadMoreButtons} = useLoadMore(galleryRef, imagesPerLoad);

    const [index, setIndex] = useState(-1);
    const currentImage = images[index];
    const nextIndex = (index + 1) % images.length;
    const nextImage = images[nextIndex] || currentImage;
    const prevIndex = (index + images.length - 1) % images.length;
    const prevImage = images[prevIndex] || currentImage;

    const handleClick = (index, item) => setIndex(index);
    const handleClose = () => setIndex(-1);
    const handleMovePrev = () => setIndex(prevIndex);
    const handleMoveNext = () => setIndex(nextIndex);

    useEffect(()=>{
        getImages(currentlyShowing);
        //submit analytics event
        event("view_full_gallery", {
            category: "Gallery",
            value:data.path
        });
    },[currentlyShowing])


    let getImages = async (imageAmmount) => {
        let quer = query(
            galleryRef
            ,orderByChild('order')
            ,limitToLast(imageAmmount)
        );

        onValue(quer,(snap)=>{
            let images = [];
            snap.forEach((snap) => {
                let newImage = snap.val();
                images.unshift(newImage);
            });
            setImages(parseImages(images));
        })
    }

    return (
        <div>
            <Gallery
                images={images}
                onClick={handleClick}
                enableImageSelection={false}
                thumbnailImageComponent={ImageWithPlaceholder}
            />

            {getLoadMoreButtons()}

            {!!currentImage && (
                <Lightbox
                    mainSrc={currentImage.original}
                    imageTitle={currentImage.caption}
                    mainSrcThumbnail={currentImage.src}
                    nextSrc={nextImage.original}
                    nextSrcThumbnail={nextImage.src}
                    prevSrc={prevImage.original}
                    prevSrcThumbnail={prevImage.src}
                    onCloseRequest={handleClose}
                    onMovePrevRequest={handleMovePrev}
                    onMoveNextRequest={handleMoveNext}
                />
            )}
        </div>
    );
}