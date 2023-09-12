const { parser } = require('html-metadata-parser');

export default async function handler(req, res) {
    try {
        let url = req.query.url;
        url = url.indexOf('://') === -1 ? 'https://' + url : url;

        const isUrlValid =
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi.test(
                url.toLowerCase()
            );

        if (!url || !isUrlValid) {
            return res
                .setHeader('Access-Control-Allow-Origin', '*')
                .status(400)
                .json({ error: 'Invalid URL' });
        }

        if (url && isUrlValid) {
            const { hostname } = new URL(url);
            let output;

            const metadata = await getMetadata(url);
            if (!metadata) return sendResponse(res, null);

            const { images, og, meta } = metadata;
            let image = og.image
                ? og.image
                : images.length > 0
                    ? images[0].url
                    : "";
            let description = og.description
                ? og.description
                : meta.description
                    ? meta.description
                    : null;
            //truncate to max 60 chars
            description = description.length > 40 ? description.substring(0,36)+"..." :description;
            let title = (og.title ? og.title : meta.title) || '';
            //truncate to max 40 chars
            title = title.length > 45 ? title.substring(0,42)+"..." :title;
            const siteName = og.site_name || '';

            output = {
                title,
                description,
                image,
                siteName,
                hostname,
            };

            sendResponse(res, output);
        }
    } catch (error) {

        return res.setHeader('Access-Control-Allow-Origin', '*').status(500).json({
            error:
                'Internal server error. Please open a Github issue or contact me on Twitter @dhaiwat10 if the issue persists.',
        });
    }
}

export const getMetadata = async (url) => {
    try {
        const result = (await parser(url));
        return result;
    } catch (err) {
        return null;
    }
};

const sendResponse = (res, output) => {
    if (!output) {
        return res
            .setHeader('Access-Control-Allow-Origin', '*')
            .status(404)
            .json({ metadata: null });
    }

    return res
        .setHeader('Access-Control-Allow-Origin', '*')
        .status(200)
        .json({ metadata: output });
};