import { app, BrowserWindow, Menu, systemPreferences } from 'electron';
import Path from 'path';

function isDev() {
	return process.argv[2] == '--dev';
}

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
			preload: Path.join(
				isDev() ? process.cwd() : process.resourcesPath,
				'src',
				'preload.js',
			),
		},
	});

	window.loadFile(`dist/index.html`, { search: `?addr=${params}` });

	window.on('focus', () => send(window, 'state', 'focus'));
	window.on('blur', () => send(window, 'state', 'blur'));

	window.webContents.on('did-attach-webview', (_, contents) => {
		contents.setWindowOpenHandler((details) => {
			createWindow(details.url);
			return { action: 'deny' };
		});

		if (window.isFocused() == true) send(window, 'state', 'focus');
		function updateAccent() {
			send(window, 'accent', systemPreferences.getAccentColor());
		}
		systemPreferences.on('accent-color-changed', () => updateAccent());
		updateAccent();
	});
}

// Communication
function send(
	window: BrowserWindow | null = BrowserWindow.getFocusedWindow(),
	channel: string,
	message: string,
) {
	window?.webContents.send(channel, message);
}

// Menu
const menuTemplate = [
	{
		role: 'appMenu',
		submenu: [
			{ role: 'about' },
			{ type: 'separator' },
			{ role: 'services' },
			{ type: 'separator' },
			{ role: 'hide' },
			{ role: 'hideOthers' },
			{ role: 'unhide' },
			{ type: 'separator' },
			{
				label: 'Settings...',
				accelerator: 'CommandOrControl+,',
				click: () => send(undefined, 'nav', 'settings'),
			},
			{ type: 'separator' },
			{ role: 'quit' },
		],
	},
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'New window',
				click: () => createWindow(''),
				accelerator: 'CommandOrControl+N',
			},
			{ type: 'separator' },
			{ role: 'close' },
		],
	},
	{ role: 'editMenu' },
	{
		label: 'View',
		submenu: [
			{ role: 'togglefullscreen' },
			{ type: 'separator' },
			{ role: 'toggleDevTools' },
		],
	},
	{
		label: 'Page',
		submenu: [
			{
				label: 'Reload',
				click: () => send(undefined, 'page', 'reload'),
				accelerator: 'CommandOrControl+R',
			},
			{
				label: 'Go back',
				click: () => send(undefined, 'page', 'goBack'),
				accelerator: 'CommandOrControl+Left',
			},
			{
				label: 'Go forward',
				click: () => send(undefined, 'page', 'goForward'),
				accelerator: 'CommandOrControl+Right',
			},
			{ type: 'separator' },
			{
				label: 'Inspect',
				click: () => send(undefined, 'page', 'openDevTools'),
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

	app.on('window-all-closed', function () {
		if (process.platform != 'darwin') app.quit();
	});
});
