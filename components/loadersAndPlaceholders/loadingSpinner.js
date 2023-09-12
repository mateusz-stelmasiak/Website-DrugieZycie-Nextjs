import styles from "./loaders.module.css"

export default function LoadingSpinner(){
    return(
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}/>
        </div>  
    );
}