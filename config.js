export const GRASS_USER_ID = 'xxxxxxxxx'; // Your Grass User ID
export const EMULATE_COMMUNITY_NODE = true; // Set to true to emulate the community node (1.25x points), false to emulate the lite node (1.0x points)

/** proxy settings */
export const PROXY_TYPE = 'SOCKS5'; // SOCKS5 or HTTPS

export const SOCKS5_PROXY_URLS = [
    'socks5h://user1:pass1@host:port',
    'socks5h://user2:pass2@host:port',
    // More proxies...
];

export const HTTPS_PROXY_URLS = [
    'https://user1:pass2@host:port',
    'https://user2:pass2@host:port',
    // More proxies...
];

/** connection settings */
export const WEBSOCKET_URL = 'wss://proxy.wynd.network:443';
export const RAMPUP_TIME = 5 * 1000; // 5 seconds
export const PING_INTERVAL = 2 * 60 * 1000; // 2 minutes
export const HTTP_REQUEST_TIMEOUT = 10 * 1000; // 10 seconds

/** emulation settings */
export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'; // The user agent of the browser
export const EXTENSION_VERSION = EMULATE_COMMUNITY_NODE ? '4.20.2' : '4.0.3'; // The version of grass extension
export const EXTENSION_ID = EMULATE_COMMUNITY_NODE ? 'lkbnfiajjmbhnfledhphioinpickokdi' : 'ilehaonighjijnmpnagapkhpcdbhclfg'; // The ID of grass extension

/** logging */
export const LOGGING_ENABLED = true;