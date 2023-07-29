import { app, BrowserWindow, Menu } from 'electron';
import Path from 'path';

// Create
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
			preload: Path.join(process.cwd(), 'src', 'preload.js'),
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

// Communication
function send(message: string) {
	BrowserWindow.getFocusedWindow()?.webContents.send('page', message);
}

// Menu
const menuTemplate = [
	{ role: 'appMenu' },
	{ role: 'fileMenu' },
	{ role: 'editMenu' },
	{
		label: 'View',
		submenu: [
			{ role: 'togglefullscreen' },
			{ type: 'separator' },
			{
				label: 'New window',
				click: () => createWindow(''),
				accelerator: 'CommandOrControl+N',
			},
		],
	},
	{
		label: 'Page',
		submenu: [
			{
				label: 'Reload',
				click: () => send('reload'),
				accelerator: 'CommandOrControl+R',
			},
			{
				label: 'Go back',
				click: () => send('goBack'),
				accelerator: 'CommandOrControl+Left',
			},
			{
				label: 'Go forward',
				click: () => send('goForward'),
				accelerator: 'CommandOrControl+Right',
			},
			{ type: 'separator' },
			{
				label: 'Inspect',
				click: () => send('openDevTools'),
				accelerator: 'CommandOrControl+Alt+I',
			},
		],
	},
];
const menu = Menu.buildFromTemplate(menuTemplate as any);
Menu.setApplicationMenu(menu);

// Startup
app.whenReady().then(() => {
	createWindow('');

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow('');
	});
});

app.on('window-all-closed', function () {
	if (process.platform != 'darwin') app.quit();
});
