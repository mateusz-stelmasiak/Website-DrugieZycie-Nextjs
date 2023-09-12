import {useState} from "react";
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import styles from "./navigation.module.css"

function Navigation() {
    const [expanded, setExpanded] = useState(false);


    let links = [
        {
            name: "AKTUALNOŚCI",
            sectionId: "news"
        },
        {
            name: "FMC",
            sectionId: "/info/FMC-Polska"
        },
        {
            name: "GALERIA",
            sectionId: "galeria"
        },
        {
            name: "MEDIA",
            sectionId: "media"
        },
        {
            name: "NASZE SUKCESY",
            sectionId: "success"
        },
        {
            name: "KONTAKT",
            sectionId: "contact"
        },
        {
            name: "DO POBRANIA",
            sectionId: "download"
        },
        {
            name: "PATRONI",
            sectionId: "patrons"
        }
    ];

    let toggleExpanded = () => {
        setExpanded(!expanded);
    }

    let scrollToSection = (sectionId)=>{
        let section = document.getElementById(sectionId);
        if(!section){
            //is not a section but url
            if(sectionId.includes("/")){
                window.location.href = `${sectionId}`
                return;
            }
            window.location.href = `/#${sectionId}`
            return;
        }
        section.scrollIntoView({behavior:"smooth",block:"start"})
    }

    let handleClick = async (sectionId) => {
        await setExpanded(false);

        //this is a workaround
        //it
        if(expanded){
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 350);
            return;
        }

        scrollToSection(sectionId);
    }

    let handleClose = ()=>{
        setExpanded(false);
    }

    return (
        <Navbar expand='lg' className={styles.overall} expanded={expanded} >

            <Navbar.Offcanvas
                id='offcanvasNavigation'
                aria-labelledby='offcanvasLabel'
                placement="end"
                onHide={handleClose}
            >
                <Offcanvas.Header closeButton>
                    {/*is here because the positioning of the button is better that way*/}
                    <Offcanvas.Title
                        id="offcanvasLabel"
                    />
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <Nav className={"justify-content-end flex-grow-1 " + styles.linkContainer} style={{rowGap: "1rem"}}>
                        {links.map(({sectionId, name}) => {
                            return (
                                <Nav.Link className={styles.navItem}
                                          key={name}
                                          onClick={()=>{handleClick(sectionId)}}
                                >
                                    {name}
                                </Nav.Link>
                            );
                        })}
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

            <Navbar.Toggle onClick={toggleExpanded}
                           aria-controls='offcanvasNavigation'
                           className={styles.closeButton}
            />
        </Navbar>
    );

}

export default Navigation;


