import { Actor } from 'apify';
import { PlaywrightCrawler, playwrightUtils, sleep } from 'crawlee';
import { firefox } from 'playwright';

const WAIT_FOR_SELECTOR = '.result-block'
const WAIT_FOR_SELECTOR_TIMEOUT = 10000;

await Actor.init({ token: 'apify_api_iSOpghDj1vdlKdoATdB2OQVCWm0fXy2J0xPq' });

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'US',
});
const crawler = new PlaywrightCrawler({
    sessionPoolOptions: {
        blockedStatusCodes: []
    },
    launchContext: {
        launcher: firefox,
        launchOptions: {
            headless: true
        }
    },
    maxRequestsPerCrawl: 50,
    proxyConfiguration,
    async requestHandler({ log, request, page, proxyInfo, id }) {
        console.log(proxyInfo)
        await sleep(10000)
        const url = new URL(request.url);
        await playwrightUtils.saveSnapshot(page, { key: `snap-${url.hostname}` })
        await page.waitForSelector(WAIT_FOR_SELECTOR, { timeout: WAIT_FOR_SELECTOR_TIMEOUT })
    },
});

await crawler.run([
    { url: 'https://nuwber.com/search?name=John%20Snow' }
]);

await Actor.exit();