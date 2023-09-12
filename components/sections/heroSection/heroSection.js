import PolandMap from "./polandMap";
import Banner from "./banner";
import styles from "./heroSection.module.css"
import Wave from "../../common/wave";
import {useEffect, useRef} from "react";
import HandsWithForms from "./handsWithForms";
import useWindowSize from "../../../hooks/useWindowSize";

const HeroSection = ({data}) => {
    let parallaxEnabled = useRef(true);
    const bannerRef = useRef(undefined);
    const windowSize = useWindowSize();

    useEffect(() => {
        const handleScroll = () => {
            if(!parallaxEnabled.current) return;

            const offset = window.pageYOffset;
            let parralaxMultiplier = 0.8;

            if(!bannerRef.current) return;
            let translation = `translateY(-${offset * parralaxMultiplier}px)`;
            bannerRef.current.style.transform = translation;
            //mapRef.current.style.transform = `translateY(${offset * parralaxMultiplier}px)`;;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(()=>{
        if(parallaxEnabled.current && windowSize.width<=1250){
            parallaxEnabled.current = false;

            if(!bannerRef.current) return;
            bannerRef.current.style.transform = `translateY(0)`;
            return;
        }

        if(!parallaxEnabled.current && windowSize.width>1250){
            parallaxEnabled.current = true;
        }
    },[windowSize])

    return (
        <section className={styles.heroSectionContainer} id={"heroSection"}>
            {/*<PolandMap reference={mapRef} data={{campaignVoievoidships:data.campaignVoievoidships}}/>*/}
            <Banner reference={bannerRef}
                    data={{ funFacts:data.funFacts, info:data.info}}
                />
            <HandsWithForms/>
            <Wave/>
        </section>
    );

}

export default HeroSection;