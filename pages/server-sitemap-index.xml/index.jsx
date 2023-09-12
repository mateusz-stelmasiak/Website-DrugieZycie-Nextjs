// pages/server-sitemap-index.xml/index.tsx
import { getServerSideSitemapIndex } from 'next-sitemap'
import {getAsObject, getSnapshot} from "../../fetching/firebaseUtils";

//Dynamically generates sitemap
export const getServerSideProps = async (ctx) => {
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    let news =  await getAsObject('news');
    let newsUrls = Object.keys(news).map((newsId)=>{
        return `${siteUrl}/aktualnosci/${newsId}`
    })

    let gallery =  await getAsObject('gallery');
    let galleryUrls = Object.keys(gallery).map((galleryId)=>{
        return `${siteUrl}/galeria/${galleryId}`
    })

    let sitemaps = newsUrls.concat(galleryUrls)

    return getServerSideSitemapIndex(ctx, sitemaps)
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}