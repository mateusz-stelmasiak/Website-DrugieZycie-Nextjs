import ContentLoader from "react-content-loader";


export default function LoadingImage({image,shape}){

    //assumes the use of next/Image, so image width
    //and height are set
    let getImageWidth = ()=>{

    }
    let getImageHeight = ()=>{

    }


    return (
        <>
            { image ||
            <ContentLoader
                speed={2}
                width={getImageWidth()}
                height={getImageHeight()}
                viewBox={`0 0 ${getImageWidth()} ${getImageHeight()}`}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                style={style}
            >
                <rect x="0" y={0} rx="3" ry="3" width="100%" height={"100%"} />
            </ContentLoader>
            }
        </>

    )
}