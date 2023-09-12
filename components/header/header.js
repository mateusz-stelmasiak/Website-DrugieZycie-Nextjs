import styles from "./header.module.css";
import Navigation from "./navigation";
import Logo from "../common/logo"


export default function Header({data}) {

    return (
        <header className={styles.container} >
            <div className={styles.contentContainer}>
                <Logo data={data}/>
                <Navigation/>
            </div>
        </header>

    );
}





