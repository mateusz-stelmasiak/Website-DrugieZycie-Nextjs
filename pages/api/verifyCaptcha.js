import NextCors from "nextjs-cors";

export default async function handler(req, res) {
    await NextCors(req, res, {
        methods: '*',
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    // Get the user's reCAPTCHA response from the request body
    const { recaptchaResponse } = req.body;

    // Make a request to the Google reCAPTCHA API to verify the response
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(verificationUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: process.env.CAPTCHA_SECRET_KEY,
            response: recaptchaResponse,
        }),
    });

    // If the reCAPTCHA response is invalid, send a failure response.
    if (!response.data.success) return res.status(400).json({ success: false });

    return res.status(200).json({ success: true });
}


