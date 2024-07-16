import { GRASS_USER_ID, PROXY_TYPE, SOCKS5_PROXY_URLS, HTTPS_PROXY_URLS, WEBSOCKET_URL, RAMPUP_TIME, PING_INTERVAL, HTTP_REQUEST_TIMEOUT, USER_AGENT, EXTENSION_VERSION, LOGGING_ENABLED, EXTENSION_ID } from './config.js';
import { ProxyWebSocket } from './proxy-web-socket.js';
import { sleep } from './utils.js';

const proxyUrls = PROXY_TYPE === 'SOCKS5' ? SOCKS5_PROXY_URLS : HTTPS_PROXY_URLS;

for (const proxyUrl of proxyUrls) {
    new ProxyWebSocket({
        proxyUrl: proxyUrl,
        websocketUrl: WEBSOCKET_URL,
        grassUserId: GRASS_USER_ID,
        userAgent: USER_AGENT,
        extensionVersion: EXTENSION_VERSION,
        loggingEnabled: LOGGING_ENABLED,
        pingInterval: PING_INTERVAL,
        httpRequestTimeout: HTTP_REQUEST_TIMEOUT,
        extensionId: EXTENSION_ID,
    });

    await sleep(RAMPUP_TIME)
}

