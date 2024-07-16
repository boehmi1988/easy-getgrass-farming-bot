import axios from 'axios';
import WebSocket from 'ws';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Buffer } from 'node:buffer';

export class ProxyWebSocket {

    static index = 0;

    constructor(config) {
        this.proxyUrl = config.proxyUrl;
        this.websocketUrl = config.websocketUrl;
        this.grassUserId = config.grassUserId;
        this.userAgent = config.userAgent;
        this.extensionVersion = config.extensionVersion;
        this.loggingEnabled = config.loggingEnabled;
        this.pingInterval = config.pingInterval;
        this.httpRequestTimeout = config.httpRequestTimeout;
        this.extensionId = config.extensionId;
        
        this.browserId = this.getBrowserId();
        this.lastLiveConnectionTimestamp = Date.now();
        this.websocket = null;
        this.pingIntervalHandle = null;

        this.index = ProxyWebSocket.incrementIndex();
        this.initialize();
    }

    getBrowserId() {
        const md5hash = createHash('md5').update(this.proxyUrl).digest("hex");
        const uuidFile = `./uuid-${md5hash}.txt`;
        let uuid = '';

        if (existsSync(uuidFile)) {
            uuid = readFileSync(uuidFile, 'utf8');
        }

        if (!uuid) {
            uuid = this.generateUUID();
            writeFileSync(uuidFile, uuid);
        }

        return uuid;
    }

    generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (
                c ^
                (randomBytes(1)[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    getProxyType() {
        return this.proxyUrl.startsWith('socks5') ? 'SOCKS5' : 'HTTPS';
    }

    getProxyAgent() {
        return this.getProxyType() === 'SOCKS5' ? new SocksProxyAgent(this.proxyUrl) : new HttpsProxyAgent(this.proxyUrl);
    }

    initialize() {
        const agent = this.getProxyAgent();
        const headers = { 'User-Agent': this.userAgent };

        this.websocket = new WebSocket(this.websocketUrl, {
            agent,
            headers,
            rejectUnauthorized: false
        });

        this.websocket.on('open', this.onOpen.bind(this));
        this.websocket.on('message', this.onMessage.bind(this));
        this.websocket.on('close', this.onClose.bind(this));
        this.websocket.on('error', this.onError.bind(this));

        this.checkWebSocketAliveness();

        this.log('ProxyWebSocket initialized with proxy URL:', this.proxyUrl);
    }

    onOpen() {
        this.log('WebSocket connection established');
        this.lastLiveConnectionTimestamp = Date.now();
        this.sendPing();
    }

    async onMessage(data) {
        this.lastLiveConnectionTimestamp = Date.now();
        const message = JSON.parse(data);
        await this.handleWebSocketMessage(message);
    }

    onClose(event) {
        this.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        clearInterval(this.pingIntervalHandle);
        setTimeout(this.initialize.bind(this), 5000); // Retry connection after 5 seconds
    }

    onError(error) {
        this.logError('WebSocket error:', error);
        clearInterval(this.pingIntervalHandle);
        setTimeout(this.initialize.bind(this), 5000); // Retry connection after 5 seconds
    }
    
    getAuthentication() {
        return {
            user_id: this.grassUserId,
            browser_id: this.browserId,
            user_agent: this.userAgent,
            device_type: "extension",
            version: this.extensionVersion,
            timestamp: Math.floor(Date.now() / 1000),
            extension_id: this.extensionId,
        };
    }

    async handleWebSocketMessage(message) {
        this.log('Received message:', message);

        let result = {};

        if (message.action === 'AUTH') {
            result = this.getAuthentication();
        } else if (message.action === 'HTTP_REQUEST') {
            result = await this.performHttpRequest(message.data);
            this.logHttpRequestResult(result);
        } else if (message.action === 'PONG') {
            result = {};
        } else {
            this.logWarning('Unknown action:', message);
        }

        const response = {
            id: message.id,
            origin_action: message.action,
            result: result,
        };

        return this.sendMessage(response);
    }

    logHttpRequestResult(result) {
        const json = JSON.stringify(result);
        const hash = createHash('md5').update(json).digest("hex");
        const fileName = `./response-${hash}.json`;
        writeFileSync(fileName, json);
    }

    async performHttpRequest(params) {
        const requestOptions = {
            method: params.method,
            url: params.url,
            headers: {
                ...params.headers,
                'User-Agent': this.userAgent,
            },
            responseType: 'arraybuffer',
            timeout: this.httpRequestTimeout,
            httpAgent: this.getProxyAgent(),
            httpsAgent: this.getProxyAgent(),
        };

        if (params.body) {
            requestOptions.data = Buffer.from(params.body, 'base64');
        }

        try {
            const response = await axios(requestOptions);
            const responseHeaders = response.headers;

            return {
                url: response.request.url,
                status: response.status,
                status_text: response.statusText,
                headers: responseHeaders,
                body: Buffer.from(response.data, 'binary').toString('base64'),
            };
        } catch (error) {
            this.logError('HTTP request error:', error);
            return {
                url: params.url,
                status: 500,
                status_text: 'Internal Server Error',
                headers: {},
                body: '',
            };
        }
    }

    checkWebSocketAliveness() {
        this.pingIntervalHandle = setInterval(() => {
            const now = Date.now();
            if (now - this.lastLiveConnectionTimestamp > this.pingInterval * 3) {
                this.log('WebSocket connection seems lost. Reconnecting...');
                this.websocket.terminate();
            } else {
                this.sendPing();
            }
        }, this.pingInterval);
    }

    sendMessage(message) {
        this.log('Sending message:', message);
        if (this.websocket.readyState === WebSocket.OPEN) {
            try {
                this.websocket.send(JSON.stringify(message));
            } catch (error) {
                this.log('Error sending response:', error);
            }
        } else {
            this.logWarning('WebSocket is not open. Cannot send message.');
        }
    }

    sendPing() {
        return this.sendMessage({
            id: this.browserId,
            version: "1.0.0",
            action: "PING",
            data: {},
        });
    }

    logError(message, context) {
        this.log(message, context, 'error');
    }

    logWarning(message, context) {
        this.log(message, context, 'warn');
    }

    log(message, context = '', logLevel = null) {
        if (!this.loggingEnabled)
            return;

        const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
        const logString = `[${this.index}] ${now} - ${message}`;

        if (logLevel === 'error')
            console.error(logString, context);
        else if (logLevel === 'warn')
            console.warn(logString, context);
        else
            console.log(logString, context);
    }

    static incrementIndex() {
        return ++this.index;
    }
}