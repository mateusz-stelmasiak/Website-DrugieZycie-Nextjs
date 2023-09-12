import ContentLoader from "react-content-loader";

export default function CirclePlaceholder({width, height, style}) {

    return (
        <ContentLoader
            speed={2}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={style}
        >
            <circle cy={"50%"} cx={"50%"} r="50%"/>
        </ContentLoader>
    )
}