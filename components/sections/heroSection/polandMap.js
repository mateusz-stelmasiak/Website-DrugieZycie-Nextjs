import {Annotation, ComposableMap, Geographies, Geography, Graticule, Marker, ZoomableGroup} from "react-simple-maps";
import styles from "./heroSection.module.css"
import {child, get, onValue, query, ref} from "firebase/database";
import {firebaseDb} from "../../../firebase-config";
import {useEffect, useState} from "react";

const PolandMap = ({reference,data}) => {
    const geoUrl =
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/poland/poland-provinces.json";

    let initialAnimationDelay = 50; //in ms
    let animationDelayIncrement = 50; //how much to increment with each voievoidship (in ms)
    let translationMap = {
        "Wielkopolskie": "Greater Poland",
        "Łódzkie": "Łódź",
        "Małopolskie": "Lesser Poland",
        "Lubuskie": "Lubusz",
        "Lubelskie": "Lublin",
        "Mazowieckie": "Masovian",
        "Opolskie": "Opole",
        "Podlaskie": "Podlaskie",
        "Warmińsko-Mazurskie": "Warmian-Masurian",
        "Kujawsko-Pomorskie": "Kuyavian-Pomeranian",
        "Śląskie": "Silesian",
        "Dolnośląskie": "Lower Silesian",
        "Podkarpackie": "Subcarpathian",
        "Zachodniopomorskie": "West Pomeranian",
        "Świętokrzyskie": "Holy Cross",
        "Pomorskie": "Pomeranian"
    };

    let parseDbData = (dbData)=>{
        return Object.keys(dbData).map((key)=>{
            let item = dbData[key];
            return translationMap[item.name]
        } );
    }

    let [highlightRegions, setHighlightRegions] = useState(parseDbData(data.campaignVoievoidships));

    useEffect(() => {
        getHighlightRegions();
    }, [])


    let getHighlightRegions = async () => {
        const quer = await query(
            ref(firebaseDb, '/campaignVoievoidships')
        );

        onValue(quer, (snapshot) => {
            if (!snapshot.exists()) return;
            let data = [];
            snapshot.forEach((item) => {
                data.push(translationMap[item.val().name]);
            });
            setHighlightRegions(data);
        });
    }

    return (
        <div className={styles.mapContainer} ref={reference}>
            <ComposableMap
                width={150}
                height={150}
                projection="geoAzimuthalEqualArea"
                projectionConfig={{
                    rotate: [-19.0, -52.0, 0],
                    scale: 1000
                }}
            >
                {highlightRegions &&
                <Geographies geography={geoUrl}>
                    {({geographies}) =>
                        geographies.map((geo, index) => {
                                let shouldHighlight = highlightRegions.includes(geo.properties.NAME_1);
                                let animDelay = initialAnimationDelay + (animationDelayIncrement * index);
                                return (<Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    style={
                                        {
                                            default: {
                                                fill: shouldHighlight ? "var(--primary-color)" : "var(--primary-color-opaque)",
                                                stroke: "white",
                                                strokeWidth: 0.2,
                                                outline: "none",
                                                transition: "all 250ms",
                                                animation: shouldHighlight ? "zoomInLeft 800ms 1 " + animDelay + "ms" : "",
                                                animationFillMode: 'backwards'
                                            }
                                        }}
                                />);
                            }
                        )
                    }
                </Geographies>
                }
            </ComposableMap>
        </div>

    );
}

//in case you wanna come back to the markers
// {markers.map(({amount, coordinates, text, subText}) => (
//     markers[currInd].coordinates === coordinates &&
//     <>
//         <Marker key={amount + coordinates} coordinates={coordinates}>
//             <circle r={5} fill="var(--secondary-color)" stroke="white" strokeWidth={0.2}/>
//             <text
//                 textAnchor="middle"
//                 y="1.5"
//                 style={{fill: "white", fontSize: "0.3rem", fontWeight: 'bold'}}
//             >
//                 {amount}
//             </text>
//         </Marker>
//
//         <Annotation
//             subject={coordinates}
//             dx={-20}
//             dy={-0}
//             curve={0.7}
//             connectorProps={{
//                 stroke: "var(--secondary-color)",
//                 strokeWidth: 1,
//             }}
//         >
//             <text x="-8"
//                   textAnchor="end"
//                   alignmentBaseline="middle"
//                   fill="var(--secondary-color)"
//                   style={{fontSize: "0.3rem", fontWeight: 'bold'}}
//             >
//
//                 {text}
//             </text>
//             <text x="-8"
//                   y="5.5"
//                   textAnchor="end"
//                   alignmentBaseline="middle"
//                   fill="var(--secondary-color)"
//                   style={{fontSize: "0.3rem", fontWeight: 'bold'}}
//             >
//                 {subText}
//             </text>
//             <AnnBg/>
//         </Annotation>
//     </>
//
// ))}

//
//     const [currInd, setCurrInd] = useState(0);
//     const chooseInterval= 1500; //in ms
// const markers = [
//     {
//         amount: "17",
//         coordinates: [18.950739377647818, 50.2430497823538],
//         text: "Ostatnia",
//         subText: "HAHAH"
//     },
//     {
//         amount: "12",
//         coordinates: [15.950739377647818, 51.2430497823538],
//         text: "Przed ostatnia",
//         subText: "HAHAH"
//     },
//     {
//         amount: "12",
//         coordinates: [15.950739377647818, 52.2430497823538],
//         text: "DUPSKO",
//         subText: "HAHAH"
//     },
// ];
//
// let chooseRandom = () => {
//     let min = Math.ceil(0);
//     let max = Math.floor(markers.length);
//     let res = Math.floor(Math.random() * (max - min)) + min;
//     setCurrInd(res)
//     return 0;
// }
//
// useEffect(() => {
//     const interval = setInterval(() => {
//         chooseRandom()
//     }, chooseInterval);
//     return () => clearInterval(interval);
// }, [])


export default PolandMap;