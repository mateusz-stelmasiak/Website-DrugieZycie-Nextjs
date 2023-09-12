import ContentLoader from "react-content-loader";

export default function RectanglePlaceholder({width, height, style}) {

    return (
        <ContentLoader
            speed={2}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            backgroundColor="#d1d1d1"
            foregroundColor="#e3e3e3"
            style={style}
        >
            <rect x={0} y={0} width={"100%"} height={"100%"}/>
        </ContentLoader>
    )
}