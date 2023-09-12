import ContentLoader from "react-content-loader";

export default function LoadingText({text,linesEstimate, textSizeInRem,style,charEstimate}) {
    let interLineSpace = 5; //in pixels

    let estimatedHeight = () => {
        //assumed that textSize is given in rem
        let lineHeight = textSizeInRem * 16; //convert to pixels
        if(charEstimate) return lineHeight;
        return (linesEstimate * lineHeight) + ((linesEstimate-1) * interLineSpace);
    };

    let estimatedWidth = ()=>{
        if (charEstimate) return (textSizeInRem*12) * (charEstimate); //add spaces on either side
        return "100%";
    }


    let generateStripes = () =>{
        let res = [];
        let currentY = 0;
        let stripeHeight = textSizeInRem * 16;
        //handle char text
        if(charEstimate){
            return <rect x={0} y={currentY} rx="3" ry="3" width={"100%"} height={stripeHeight} />;
        }
        //handle line text
        let yIncrement =  stripeHeight+interLineSpace;
        for(let i=0;i<linesEstimate;i++){
         res.push(<rect key={i*Math.random()} x="0" y={currentY} rx="3" ry="3" width="100%" height={stripeHeight} />)
         currentY +=yIncrement;
        }
        return res
    }

    return (
        <>
        { text ||
            <ContentLoader
                speed={2}
                width={estimatedWidth()}
                height={estimatedHeight()}
                viewBox={`0 0 "${estimatedWidth()}" "${estimatedHeight()}"`}
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                style={style}
            >
                {generateStripes()}
            </ContentLoader>
        }
        </>
    )
}