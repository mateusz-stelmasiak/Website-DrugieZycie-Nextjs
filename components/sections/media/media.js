import {LinkPreview} from "@dhaiwat10/react-link-preview";
import SectionTitle from "../sectionTitle";
import styles from "./media.module.css"
import {Carousel} from "@trendyol-js/react-carousel";
import {useEffect, useState} from "react";
import {onValue, orderByChild, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import useWindowSize from "../../../hooks/useWindowSize";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Media({data}) {
    const windowSize = useWindowSize();
    let [itemSize, setItemsize] = useState(400);
    let [mediaLinks, setMediaLinks] = useState(data.mediaLinks);

    let sliderSettings = [
            {
                breakpoint: 1702,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 1270,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows:false
                }
            },
            {
                breakpoint: 1050,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows:false
                }
            }
    ];

    useEffect(() => {
        getMediaLinks();
        resizeItems();
    }, [])

    useEffect(() => {
        resizeItems();
    }, [windowSize])

    let resizeItems = () => {
        if (!windowSize.width) return;
        if ( windowSize.width > 1270){
            setItemsize(400);
            return;
        }
        if ( windowSize.width > 1050){
            setItemsize(500);
            return;
        }
        setItemsize(0.95 * windowSize.width);
    }

    let getMediaLinks = async () => {
        const quer = await query(
            ref(firebaseDb, '/media'),
            orderByChild('order')
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let data = [];
            snapshot.forEach((snap) => {
                data.unshift(snap.val());
            })
            setMediaLinks(data);
        });
    }

    const customFetcher = async (url) => {
        // get media link metadata from API
        const response = await fetch(`/api/getMetadata?url=${url}`);
        const json = await response.json();
        return json.metadata;
    };

    const linkFallback = <div
        style={{
            height: "400px",
            width: itemSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgb(235,235,235)"
        }}>Error: Błąd strony docelowej</div>;

    const calculateHowManyFit = () => {
        console.log("CALCULL");
        return (0.9 * windowSize.width) / (itemSize + 20);
    }

    return (
        <section className={styles.mediaContainer} id="media">

            <div className={styles.titleContainer}>
                <SectionTitle
                    title={data.sectionInfo.title}
                    subtitle={data.sectionInfo.subtitle}
                    path={"media"}
                />
            </div>

            <div className={styles.linksContainer}>
                {mediaLinks && windowSize.width
                    ? <Slider
                        arrows={true}
                        swipe={true}
                        dots={true}
                        infinite={true}
                        speed={500}
                        slidesToShow={4}
                        slidesToScroll={4}
                        initialSlide={0}
                        responsive={sliderSettings}
                    >
                        {Object.keys(mediaLinks).map((item, index) => {
                            return (
                                <LinkPreview
                                    width={itemSize}
                                    height={400}
                                    key={"link" + index}
                                    // showLoader={true}
                                    fallback={linkFallback}
                                    className={styles.carouselItem}
                                    url={mediaLinks[item].link}
                                    fetcher={customFetcher}
                                />
                            );

                        })}
                    </Slider>
                    : <div className={styles.carouselContainer}/>
                }
            </div>

        </section>

    );

}


