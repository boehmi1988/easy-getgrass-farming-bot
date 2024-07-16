# 🌱 Easy GetGrass Farming Bot (Community Node)

The GetGrass Proxy Bot allows you to farm Grass Points for the [GetGrass.io](https://app.getgrass.io/register/?referralCode=pSOs2i8ktlTlqwG) project by using multiple residential proxies. This script is specifically designed to maximize point collection by leveraging proxies to maintain multiple active connections simultaneously.

## 🌟 Purpose

The script connects to the GetGrass network via multiple proxies, emulating different nodes (Community Node or Lite Node) to collect Grass Points. Each proxy is represented by its own WebSocket connection that regularly pings and performs HTTP requests to stay active and generate points.

## 🚀 Usage

### 📋 Prerequisites

- [Node.js](https://nodejs.org/en/download/package-manager) installed
- Access to residential proxies (e.g., through [smartproxy.com](dashboard.smartproxy.com/register?referral_code=f203d27fbb1ab4be390d19cef23667fff17575f5))
- [GetGrass.io](https://app.getgrass.io/register/?referralCode=pSOs2i8ktlTlqwG) account
    - To register, you need a referal code. You can use [this referral link](https://app.getgrass.io/register/?referralCode=pSOs2i8ktlTlqwG) if you want to support me.
    - Or use my referal code: ***pSOs2i8ktlTlqwG***

### ⚙️ Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/boehmi1988/easy-getgrass-farming-bot
    cd getgrass-proxy-bot
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### 🛠️ Configuration

Customize the config.js file according to your needs.

1. Add your Grass User ID to `GRASS_USER_ID`. To obtain your Grass User ID:

    ```javascript
    export const GRASS_USER_ID = 'xxxxxxxx'; // your grass user ID
    ```
    
    How to get Grass User ID
    - Open the GetGrass dashboard: [GetGrass Dashboard](https://app.getgrass.io/dashboard)
    - Open Chrome Developer Tools:
        - Windows/Linux: `Ctrl + Shift + I`
        - Mac: `Cmd + Option + I`
    - In Developer Tools, go to `Application` -> `Local Storage` -> `https://app.getgrass.io` and copy the `userId` value.
    - See [this screenshot](https://pasteimg.com/images/2024/07/16/Bildschirmfoto-2024-07-16-um-08.24.41.png)

2. Set your proxy type (SOCKS5 or HTTPS) in `PROXY_TYPE`:

    ```javascript
    export const PROXY_TYPE = 'SOCKS5'; // SOCKS5 or HTTPS
    ```

3. Add your residential proxy URLs to the appropriate array depending on your proxy type:

    ```javascript
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
    ```

4. the rest of the configuration can stay untouched

### ▶️ Running the script

After customizing the config.js file, you can run the script with the following command:

```bash
node app.js
```

The script will now establish connections to GetGrass through the specified proxies and regularly collect points.

## ❤️ Referal

If you don't have a GetGrass account yet and want to support me, you can register using [this referral link](https://app.getgrass.io/register/?referralCode=pSOs2i8ktlTlqwG) to get started.

Or feel free to use my referal code: ***pSOs2i8ktlTlqwG***

## 📝 Notes

- Ensure that you have the appropriate permissions and access to the proxies you are using.
- Regularly check the logs to ensure all connections are working correctly and points are being collected.
- Be aware of the terms of service of both GetGrass and the proxy providers to ensure your actions are compliant.
