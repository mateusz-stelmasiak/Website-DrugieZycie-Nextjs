import {child, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import useFirebaseData from "../../../hooks/useFirebaseData";
import SubpageLayout from "../subpageLayout";
import RichTextContent from "../../common/richTextContent";
import styles from "../subpage.module.css";
import LoadingText from "../../loadersAndPlaceholders/loadingText";
import dayjs from "dayjs";
import TitleWithCover from "../titleWithCover";
import {useEffect, useState} from "react";
import ImageGallery from "react-image-gallery";


//takes the src of first image tag found in content and uses it as a cover
export let findCover =(content)=>{
    const regex = /<img\s+[^>]*src\s*=\s*['"]([^'"]+)['"][^>]*>/i;

    const match = regex.exec(content);
    if (match) {
        console.log(match[1]);
        return match[1];
    }

    return null;
}


export default function NewsSubpage({data}){
    const newsRef = child(ref(firebaseDb), data.path);
    let news = useFirebaseData(newsRef,data.news);
    let [contentArray,setContentArray]=useState();

    useEffect(()=>{
        data.cover = findCover(news.content);
        replaceImagesWithSlider(news.content);
    },[])

    //detects if there are multiple (at least 3) images in a row in the content
    //with no text in between, and changes them to an image slider
    let replaceImagesWithSlider = async (newsContent)=>{
        let content = [];
        newsContent = newsContent.replaceAll("\n","");
        console.log(newsContent);
        //const findConsecutiveImg = /(?:(?:<figure>\s*<img\s+[^>]*src\s*=\s*['"]([^'"]+)['"][^>]*><\/figure>(?:<p>\s*<br>\s*<\/p>)*(?:<br>)*(?:<p>\s*<\/p>)*))/ig;
        const findConsecutiveImg = /(?:(?:<figure>)*(?:<p>)*\s*<img\s+[^>]*src\s*=\s*['"]([^'"]+)['"][^>]*>(?:<\/figure>)*(?:<\/p>)*(?:<p>\s*<br>\s*<\/p>)*(?:<br>)*(?:<p>\s*<\/p>)*){2,}/ig;
        let match = findConsecutiveImg.exec(newsContent);
        console.log(newsContent);

        if(!match){
            content.push(<div key={"article"} dangerouslySetInnerHTML={{__html: news.content}}/>);
            setContentArray(content);
            return;
        }

        let beforeSlider = newsContent.slice(0, match.index);
        content.push( <div key={"before-slider-article"} dangerouslySetInnerHTML={{__html: beforeSlider}}/>);

        let extractImagesFrom = match[0];
        const findImgSrc = /<img\s+[^>]*src\s*=\s*['"]([^'"]+)['"][^>]*>/ig;
        let sliderImages = [];
        let res;
        while((res = findImgSrc.exec(extractImagesFrom)) !== null) {
            sliderImages.push({"original":res[1]});
        }

        content.push(
            <div style={{marginBottom:'2rem'}} key={"image-slider"}>
                <ImageGallery
                    items={sliderImages}
                    showPlayButton={false}
                    showThumbnails={false}
                    autoPlay={false}
                    showFullscreenButton = {false}
                />
            </div>
        )

        let afterSlider = newsContent.slice(match.index+match[0].length);
        content.push(<div key={"after-slider-article"} dangerouslySetInnerHTML={{__html: afterSlider}}/>);

        setContentArray(content);
    }

    return(
        <SubpageLayout data={data}>

            <TitleWithCover
                title={news.title}
                cover={data.cover}
            />

            <RichTextContent>
                <i>
                    <div dangerouslySetInnerHTML={{__html: news.excerpt}} style={{marginBottom:"2rem"}}/>
                </i>
                {contentArray || <LoadingText linesEstimate={10} textSizeInRem={1}/>}
            </RichTextContent>

            <div className={styles.newsMetadata}>
                <span>{news?.author || <LoadingText charEstimate={10} textSizeInRem={0.9}/>}</span>
                <span>&nbsp;•&nbsp;</span>
                <span>{dayjs.unix(news.date).format("DD/MM/YYYY")}</span>
            </div>

        </SubpageLayout>
    );
}