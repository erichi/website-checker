import { Actor } from 'apify';
import { PlaywrightCrawler, playwrightUtils, sleep } from 'crawlee';
import { firefox } from 'playwright';

const WAIT_FOR_SELECTOR = 'h1'
const WAIT_FOR_SELECTOR_TIMEOUT = 10000;

await Actor.init({ token: process.env.APIFY_API_KEY });

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
        await sleep(20000)
        const url = new URL(request.url);
        await playwrightUtils.saveSnapshot(page, { key: `snap-${url.hostname}` })
        await page.waitForSelector(WAIT_FOR_SELECTOR, { timeout: WAIT_FOR_SELECTOR_TIMEOUT })
    },
});

await crawler.run([
    { url: 'https://www.familytreenow.com/search/genealogy/results?first=John&last=Smith&citystatezip=Odessa,%20TX#google_vignette' }
]);

await Actor.exit();