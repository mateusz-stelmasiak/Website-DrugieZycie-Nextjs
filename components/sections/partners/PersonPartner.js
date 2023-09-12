import styles from "./Partners.module.css"

export default function PersonPartner({name,desc,link}){
    function routeToPage(){
        if(!link) return;
        window.location.href = link;
    }

    return (
      <div className={styles.PersonPartner} onClick={routeToPage}>
          <div className={styles.name}>{name}</div>
          <div className={styles.desc}>{desc}</div>
      </div>
    );
}