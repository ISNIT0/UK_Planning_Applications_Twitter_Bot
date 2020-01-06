import Twit from 'twit';

const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token: process.env.TWITTER_ACCESS_TOKEN as string,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

export async function tweetApplications(applications: any[]) {
    console.log(`Tweeting [${applications.length}] applications`);

    for (const application of applications) {
        T.post('statuses/update', {
            status: application.description + '\n' + application.url,
            lat: application.lat,
            long: application.lng,
        }, (err) => {
            console.error(`Failed to send tweet`, err);
        });
    }
}