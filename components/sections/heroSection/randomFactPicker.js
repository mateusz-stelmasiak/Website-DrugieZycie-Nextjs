import CountUp from "react-countup";
import {useEffect, useState} from "react";
import LoadingText from "../../loadersAndPlaceholders/loadingText";


export default function RandomFactPicker({funFacts}){
    const [currFactIdx, setCurrFactIdx] = useState(0);
    const newFactInterval = 5000; //in ms

    let chooseRandom = (funFacts) => {
        // Check that funFacts is an array and that it has at least one element
        if (!Array.isArray(funFacts) || funFacts.length === 0) {
            return;
        }

        let min = Math.ceil(0);
        let max = Math.floor(funFacts.length);
        let res = Math.floor(Math.random() * (max - min)) + min;
        setCurrFactIdx(res);
        return 0;
    }

    useEffect(()=>{
        if(!funFacts) return;
        //wait 1000 ms before starting to pick (avoid too many things happening at once on the website)
        setTimeout(
            setInterval(()=>{chooseRandom(funFacts)},newFactInterval),
            1000
        )

    },[funFacts])
    return(
        <>
            {funFacts
                ? <>
                    <CountUp
                        prefix={funFacts[currFactIdx].prefix}
                        end={funFacts[currFactIdx].number}
                        separator="'"
                        duration={0.5 * newFactInterval / 1000}
                    />
                    <p>{funFacts[currFactIdx].text}</p>
                </>
                :
                <>
                    <span><LoadingText textSizeInRem={2.5} linesEstimate={1}/></span>
                    <p><LoadingText textSizeInRem={1} linesEstimate={1}/></p>
                </>
            }
        </>
    )
}