import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import requestPromise from 'request-promise-native';
import moment from 'moment';
const appLockPath = join(__dirname, '../.applicationlock');
const SIXTY_MINUTES = 1000 * 60 * 60 * 20;

try {
    readFileSync(appLockPath);
} catch {
    writeFileSync(appLockPath, moment.utc().valueOf() - SIXTY_MINUTES, 'utf8');
}

export async function getLatestApplications() {
    const appLock = Number(readFileSync(appLockPath, 'utf8'));

    console.log(`Getting all applications since [${appLock}]`);
    const applications = JSON.parse(await requestPromise.get('https://www.planit.org.uk/api/applics/json?pg_sz=50&compress&limit=50&recent=5'));

    const recentApplications = applications
        .records
        .filter((app: any) => {
            return moment(app.when_updated).utc().valueOf() > appLock;
        });

    if (recentApplications.length) {
        console.log(`Updating Application Lock`);
        writeFileSync(appLockPath, moment.utc().valueOf(), 'utf8');
    }
    return recentApplications;
}
