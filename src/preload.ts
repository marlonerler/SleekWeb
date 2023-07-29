import { contextBridge, ipcRenderer } from 'electron';

export const API = {
	onPageMessage: (callback: (message: string) => void) => ipcRenderer.on('page', (_, message) => callback(message)),
}
contextBridge.exposeInMainWorld('electron', API);
