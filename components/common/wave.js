
import styles from "./wave.module.css"

export default function Wave({upsideDown}){
    let classes = styles.wave;
    classes += upsideDown ?" "+styles.upsideDown:"";
    return (
        <svg  className={classes}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 100 1440 120"
        >
            <path fill="var(--off-white-color)" fillOpacity="1"
                  d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,218.7C840,213,960,171,1080,149.3C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
    );
}