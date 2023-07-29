import { app, BrowserWindow } from 'electron';

function createWindow(params: string) {
	const window = new BrowserWindow({
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

	window.loadFile(`dist/index.html`, { search: `?addr=${params}`});

	window.webContents.on('did-attach-webview', (_, contents) => {
		contents.setWindowOpenHandler((details) => {
			createWindow(details.url);
			return { action: 'deny' };
		});
	});
}

app.whenReady().then(() => {
	createWindow('');
});
