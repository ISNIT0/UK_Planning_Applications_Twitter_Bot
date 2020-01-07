import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import requestPromise from 'request-promise-native';
const appLockPath = join(__dirname, '../.applicationlock');
const SIXTY_MINUTES = 1000 * 60 * 60;

try {
    readFileSync(appLockPath);
} catch {
    writeFileSync(appLockPath, Date.now() - SIXTY_MINUTES, 'utf8');
}

export async function getLatestApplications() {
    const appLock = Number(readFileSync(appLockPath, 'utf8'));

    console.log(`Getting all applications since [${appLock}]`);
    const applications = JSON.parse(await requestPromise.get('https://www.planit.org.uk/api/applics/json?pg_sz=50&compress&limit=50&recent=5'));

    const recentApplications = applications
        .records
        .filter((app: any) => {
            return (new Date(app.when_updated)).valueOf() > appLock;
        });

    writeFileSync(appLockPath, Date.now(), 'utf8');
    return recentApplications;
}
