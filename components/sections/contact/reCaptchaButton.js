import Dots from "../../loadersAndPlaceholders/dots";
const {useState} = require("react");
import {useGoogleReCaptcha}  from "react-google-recaptcha-v3";
import {useCallback} from "react";


export default function RecaptchaButton({children,onClick}) {
    const [validating, setValidating] = useState(false)
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.debug('Execute recaptcha not yet available');
            return;
        }
        setValidating(true)

        const token = await executeRecaptcha();
        console.log(token);
        let response = await fetch(`/api/verifyCaptcha`, {
            method: "POST",
            body: {'recaptchaResponse': token}
        });
        console.log(response)
        setValidating(false)

        if (response.status !== 200) {
            return;
        }
        console.log("CAPTCHA PASSED!")
        await onClick()
    }, [executeRecaptcha]);

    return <span onClick={handleReCaptchaVerify}>{validating ? <>Sprawdzanie czy nie jesteś botem<Dots/></> : children}</span>
}