// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import NextCors from 'nextjs-cors';
const admin = require('firebase-admin');
// Initialize Firebase Admin
let serviceAccountKey = {
    "type": "service_account",
    "project_id": "drugie-zycie",
    "private_key_id": "c658eab368a3c756515e937e3b66c32df39f870c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiEEcIrrS8VQFj\nL4N9RBi067myANFZgbKaCBLZo+Pf1wvtXZczyJc8zZTxAzJzqQ8oRxjltwOg3+lq\n9lOhq1jvliGa9xq5qvChGAhBZnIvZPov4fQUhkjAAZvqK6pD3j067/mXmj2Nu/d/\nLurruzbnypDwFCPHJRLpFsEhLZUXEXqNRlino7r+bg5RcGF8gm9M1LXGAECWhISE\n39ybVs/lgKDF0ij3vHqTQqDQpjQ/K4/XAiggBQAlOZofFOuoLslVa5IPBIaaU1qV\ngo94GsWr8ks/wtUeL5gOhOqGNu37pLTgh5Li0WKJcKHhGviyWIQCvxASpccB8I3Q\n9Vpfd4wzAgMBAAECggEACG+UqjcUX4LJW0STb47Yk5SVIjAnOWPYBykN99LGo7yI\nOwKNeRoFkStKx5BxYLq9g6jdJC70LIJIJfzgAHelPF7Dc99Zi/XCppnmLpD+g25A\nawQ18ertt0LxtbqNAmm+Q/8rttCQQ3dXZ20xlW8v2VThzu1LEhj8Et6nTlZyt22W\nY4RFnJHBndXeYXTIysrtTJC9ILd0k+4AevUuSrk4Onq8hK6eGe3YFmRbYvAqpajF\nP6mW+1/CR1sappZgMuXuRvHkVsL1irJtRIGQlzg5nxaUIm5pqYKqhCjRPSgleCjW\nWQZPFd2OA9JDSHHRxodlOb7QLk3IxUJlUsAhYI+XAQKBgQD2aQS/DEGinLh6rlmk\nYuD3+xb9zrZoGho1ucpmG0oCYJb4u1P7g31nOrhoFZ9KG/4mUBK0XFW/1SmAfixY\nhq1zZFUikzZmjgu9e67FFsLD5ssWqrXFX1lcQUm21SGkaTgAq6k0bcPSnPWHDsoG\nJbEhtO7BYYYOYHDid8O0/2l5YQKBgQDq3IutcxXph10J3jbpXDw2TgK2Y9dReWG5\nIRSpgly4B2hhLBSJ2SlXvRFc5bLWxPHRfVfE+ipDVh100HNLkL5CwcFtqBg0jxag\n0EGhGNJEKnXWRDlvYxrQ0Xz17z4L0mnYcIIS0dspclsKoIqqKODF6+o7u6MgPIJU\neLJCvP3KEwKBgQDBS2yPububJjmI81Aapf44SV2lyAxK6X75+j6NjoamCsMjZz/g\nIyuyWNvjumJ0LjVWNKYXmf8iNsMRquh6oVtbE6+9KaIZHQCUqXtV3B74sglKRKvG\nop9kwUpkBBkZ8fgefoqDOD/O7ZWlVrKf0915xYctZ6VTjc+/t5dsWpeQwQKBgQC4\nAnHBRMDvReokOCFHtsdKONaxNgpWQEbLeFqq8INagBtMvu+cjTNyFaUL5r+2u3lH\nC/B/WQ1R0p+jjUo380DOJuY41xGX5F/zQReac0sSsz290Zg6aChzYR6JxZcURhg9\nxvBydE9E6t7ftabO6NYq28qaYEnPkPj/28y2s0IYVwKBgARFunigCupQI95sq8Q2\nvUW1SxAc/pJh5ZiVCqNcc+RwDdr5eobIJdeZMIu54Wd1vI+AddC5S/SGxgcCjEBd\nYYpW1FDiN/Sk8Yc23i943xvHrQc/NRbi3uA4cs9wT3+Eh7WrSFQrQdnNvFj9mXFv\nls8D6PFx4/g23DfCgvPcunSh\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-3jeyt@drugie-zycie.iam.gserviceaccount.com",
    "client_id": "103497445404379580215",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3jeyt%40drugie-zycie.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: "https://drugie-zycie-default-rtdb.europe-west1.firebasedatabase.app",
});

export default async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: '*',
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const idToken = req.headers.authorization;
    if (!idToken) {
        return res
            .status(400)
            .json({message: 'Missing tokenId in auth header'});
    }

    // Verify the ID Token
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            return res
                .status(200)
                .json({message: 'Authenticated'});
        })
        .catch(error => {
            return res
                .status(401)
                .json({error: 'Unauthorized'});
        });
}