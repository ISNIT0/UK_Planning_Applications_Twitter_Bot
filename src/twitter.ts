import Twit from 'twit';
import requestPromise from 'request-promise-native';

const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token: process.env.TWITTER_ACCESS_TOKEN as string,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

export async function tweetApplications(applications: any[]) {
    console.log(`Tweeting [${applications.length}] applications`);

    for (const application of applications) {
        let mediaId = null;
        if (application.lat) {
            const imageJSON = [
                {
                    "type": "Point",
                    "coordinates": [
                        application.lng,
                        application.lat,
                    ]
                }
            ];
            const imageUrl = `http://osm-static-maps.herokuapp.com/?geojson=${JSON.stringify(imageJSON)}&height=150&width=300&zoom=11`;
            const imageBody = await requestPromise.get({ encoding: null, url: imageUrl });
            const imageB64 = imageBody.toString('base64');
            const resp: any = await T.post('media/upload', { media_data: imageB64 });
            mediaId = resp.data.media_id_string;
        }

        try {
            await T.post('statuses/update', {
                status: `${application.authority_name}: ` + application.description.slice(0, 100) + '\n' + application.link,
                lat: application.lat,
                long: application.lng,
                media_ids: mediaId ? [mediaId] : [],
            });
            console.info(`Sent tweet successfully`);
        } catch (err) {
            console.error(`Failed to send tweet`, err);
        }
    }
}