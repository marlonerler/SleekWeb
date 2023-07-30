import { contextBridge, ipcRenderer, systemPreferences } from 'electron';

export const API = {
	onPageMessage: (callback: (message: string) => void) => ipcRenderer.on('page', (_, message) => callback(message)),
	onNavMessage: (callback: (message: string) => void) => ipcRenderer.on('nav', (_, message) => callback(message)),
	onStateMessage: (callback: (message: string) => void) => ipcRenderer.on('state', (_, message) => callback(message)),
	onAccentChange: (callback: (message: string) => void) => ipcRenderer.on('accent', (_, message) => callback(message)),
}
contextBridge.exposeInMainWorld('electron', API);
