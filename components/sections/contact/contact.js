import React, {useCallback, useEffect, useState} from "react";
import {
    GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
import Form from "react-bootstrap/Form";
import styles from "./contact.module.css"
import Wave from "../../common/wave";
import Dots from "../../loadersAndPlaceholders/dots"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage} from "@fortawesome/free-solid-svg-icons";
import RecaptchaButton from "./reCaptchaButton";
import {event} from "nextjs-google-analytics";


function Contact() {
    const [feedback, setFeedback] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading,setLoading] = useState(false);

    function inputEmail(mail) {
        if (mail.length > 256) return;
        setFeedback("");
        setEmail(mail);
    }

    function inputName(name) {
        if (name.length > 50) return;
        setFeedback("");
        setName(name);
    }

    function inputMsg(msg) {
        if (msg.length > 500) {
            setFeedback("Wiadomość zbyt długa!");
            return;
        }
        setFeedback("");
        setMsg(msg);
    }

    function emptyAllFields() {
        setName("");
        setMsg("");
        setEmail("");
    }


    async function sendMsg(formEvent) {
        formEvent.preventDefault();


        // valide name and surname filled
        if (name === "") {
            setFeedback("Brak imienia i nazwiska!");
            return
        }
        if (msg === "") {
            setFeedback("Brak treści!");
            return
        }
        await setLoading(true);
        //replace all newlines with <br/> to keep format
        let message = msg.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        console.log("HERE")
        setFeedback(<span>Wysłanie wiadomości<Dots/></span>)
        let emailData = {name, email, message}
        let response = await fetch(`/api/sendContactMessage`, {
            method: "POST",
            body: JSON.stringify(emailData)
        });
        await setLoading(false);
        // if fails
        if (response.status !== 200) {
            const data = await response.json();
            if (data.error === "invalid_mail") {
                setFeedback("Podano nieprawidłowy adres email!");
                return
            }
            setFeedback("Błąd wysyłania wiadomości. Spróbuj ponownie!");
            return;
        }

        setFeedback("Twoja wiadomość została wysłana!");
        //submit analytics event
        event("sent_contact_msg", {
            category: "Contact",
        });
        emptyAllFields();
    }




    return (
        <section className={styles.contactSectionContainer} id="contact">

            <div className={styles.contactContainer}>
                <Form onSubmit={sendMsg}>
                    <Form.Group>
                        <Form.Label>Imię i nazwisko</Form.Label>
                        <Form.Control
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => inputName(e.target.value)}
                            placeholder="Twoje imię i nazwisko"
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Adres email</Form.Label>
                        <Form.Control
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => inputEmail(e.target.value)}
                            placeholder="Twój adres email"
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Wiadomość</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            id="msg"
                            value={msg}
                            onChange={(e) => inputMsg(e.target.value)}
                            placeholder="Twoja wiadomość"
                            required
                        />
                    </Form.Group>

                    {feedback !== "" &&
                    <div className="feedback">
                        <b>
                        {feedback}
                        </b>
                    </div>}

                    <button type={"submit"} disabled={loading}>
                        Wyślij
                    </button>
                    {/*<GoogleReCaptchaProvider*/}
                    {/*    reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY}*/}
                    {/*>*/}
                    {/*    <RecaptchaButton*/}
                    {/*        onClick={sendMsg}*/}
                    {/*    >*/}
                    {/*     */}
                    {/*    </RecaptchaButton>*/}
                    {/*</GoogleReCaptchaProvider>*/}
                    
                </Form>
            </div>

            <div className={styles.textContainer}>

                <h2 className={styles.titleText}>
                    KONTAKT
                </h2>
                <FontAwesomeIcon icon={faMessage} size="lg" className={styles.icon}/>
                <div className={styles.titleBackgroundBlur}/>
            </div>
            <Wave/>
        </section>
    );
}

export default Contact;