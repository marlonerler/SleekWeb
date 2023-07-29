"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function createWindow(params) {
    const window = new electron_1.BrowserWindow({
        width: 1200,
        minWidth: 500,
        height: 800,
        minHeight: 400,
        transparent: true,
        hasShadow: false,
        titleBarStyle: 'customButtonsOnHover',
        webPreferences: {
            webviewTag: true,
        },
    });
    window.loadFile(`dist/index.html`, { search: `?addr=${params}` });
    window.webContents.on('did-attach-webview', (_, contents) => {
        contents.setWindowOpenHandler((details) => {
            createWindow(details.url);
            return { action: 'deny' };
        });
    });
}
electron_1.app.whenReady().then(() => {
    createWindow('');
});
