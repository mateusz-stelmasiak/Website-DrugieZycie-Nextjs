
export const imageKitLoader = ({ src, width, quality,widthExtension }) => {
    if(!src) return;
    let urlEndpoint = src.replace("https://firebasestorage.googleapis.com","https://ik.imagekit.io/t5pyvfpkl/");
    return urlEndpoint;
    //delete untis from width
    //width = width.replace(/\D+/g, '');
    // width = parseInt(width)
    // if(widthExtension){
    //     width+= parseInt(widthExtension);
    // }
    //
    // //if(src[0] === "/") src = src.slice(1);
    // const params = [`w-${width}`];
    // if (quality) {
    //     params.push(`q-${quality}`);
    // }
    // const paramsString = params.join(",");
    // if(urlEndpoint[urlEndpoint.length-1] === "/") urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
    // return `${urlEndpoint}&tr=${paramsString}`
}

//example useage
//import Image from "next/image";
// <Image
//     loader={imageKitLoader}
//     src="default-image.jpg"
//     alt="Sample image"
//     width={400}
//     height={400}
// />