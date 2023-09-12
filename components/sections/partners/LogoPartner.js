import styles from "./Partners.module.css"
import PersonPartner from "./PersonPartner"
import ImageWithPlaceholder from "../../loadersAndPlaceholders/imageWithPlaceholder";

export default function LogoPartner({logo,link,name,desc,width}){
    function routeToPage(){
        if(!link) return;
        window.location.href = link;
    }

    return (
        <div className={styles.LogoPartner} onClick={routeToPage}>
            <div className={styles.imgContainer} style={width ? {width:width}:{}}>
                <ImageWithPlaceholder
                    imageProps={{
                        src:logo,
                        alt:"logo"+name,
                        width:192,
                        height:160
                    }}

                />
            </div>

            <PersonPartner
                name={name}
                desc={desc}
            />
        </div>
    );
}