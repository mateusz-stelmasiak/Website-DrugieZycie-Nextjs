import RectanglePlaceholder from "./rectaglePlaceholder";
import styles from "./loaders.module.css"
import Image from "next/image";
import {useState} from "react";
import {imageKitLoader} from "../../fetching/fetchFromImageKit";


const ImageWithPlaceholder = (props) => {
    const [loaded, setLoaded] = useState(false);
    if (!props?.imageProps?.src) return <></>
    if (!props.imageProps?.width) props.imageProps.width = props.item?.width;
    if (!props.imageProps?.height) props.imageProps.height = props.item?.height;
    if (props.imageProps?.widthExtension) props.imageProps.width += props.imageProps.widthExtension;
    props.imageProps.src = imageKitLoader({src: props.imageProps.src, width: props.imageProps.width});

    return (
        <>
            {!loaded &&
            <RectanglePlaceholder
                width={props.imageProps.width}
                height={props.imageProps.height}
            />
            }

            <Image
                {...props.imageProps}
                onLoad={() => setLoaded(true)}
                className={loaded ? props.className : `${props.className} ${styles.hidden}`}
                unoptimized={true}
            />
        </>
    );
};

export default ImageWithPlaceholder;