import SubpageLayout from "./subpageLayout";
import {isValidElement, useEffect, useState} from "react";
import RichTextContent from "../common/richTextContent";
import styles from "./subpage.module.css";
import LoadingText from "../loadersAndPlaceholders/loadingText";
import TitleWithCover from "./titleWithCover";

export default function Subpage({data}) {

    return (
        <SubpageLayout
            data={data}
        >
            <section>
                <TitleWithCover
                    title ={data.title}
                    subtitle={data.subtitle}
                    cover={data.cover}
                />

                <RichTextContent>
                    {isValidElement(data.content)
                        ? (data.content || <LoadingText linesEstimate={20} textSizeInRem={1}/>)
                        : data.content
                            ?
                            <div dangerouslySetInnerHTML={{__html: data.content}} className={styles.richTextContainer}/>
                            : <LoadingText linesEstimate={20} textSizeInRem={1}/>
                    }
                </RichTextContent>
            </section>


        </SubpageLayout>
    );
}
