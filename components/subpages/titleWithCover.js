import styles from "./subpage.module.css";
import SectionTitle from "../sections/sectionTitle";
import {useEffect, useState} from "react";
import useWindowSize from "../../hooks/useWindowSize";
import ImageWithPlaceholder from "../loadersAndPlaceholders/imageWithPlaceholder";


export default function TitleWithCover({title, subtitle, cover}) {
    let [isMobile, setIsMobile] = useState(false);
    let windowSize = useWindowSize();

    useEffect(() => {
        if (!windowSize.width) return;

        if (!isMobile && windowSize.width < 500) setIsMobile(true);
        if (isMobile && windowSize.width >= 500) setIsMobile(false);
    }, [windowSize])


    return (
        <>
            {!isMobile && cover && windowSize.width &&
            <div className={styles.coverContainer}>
                <ImageWithPlaceholder
                    imageProps={{
                        src: cover,
                        alt: "okładka",
                        width: (0.9 * windowSize.width),
                        height: 640
                    }}
                />

                <div className={styles.titleContainer}>
                    {title &&
                    <SectionTitle
                        title={title || ""}
                        subtitle={subtitle || ""}
                        style={{padding: "unset"}}
                    />
                    }
                </div>
            </div>
            }

            {(!cover || isMobile) &&
            <SectionTitle
                title={title || ""}
                subtitle={subtitle || ""}
                style={{padding: "2rem 0"}}
            />
            }

        </>
    )
}