import { create, App, Ide, IdeProvider, ExternalWindowOptions, ExternalWindow, TcpServer } from "@coder/app/common/src/app";
import { tcpHost } from "./tcp";
import { IDisposable } from "@coder/disposable/src";

const app: App = {
	domNode: document.getElementById("main") as HTMLDivElement,
	createWindow: (url: string, options?: ExternalWindowOptions): Promise<ExternalWindow> => {
		const chromeWindow = (<any>chrome).app.window;

		return new Promise<ExternalWindow>((resolve, reject) => {
			try {
				chromeWindow.create(url, options, (externalWindow: ExternalWindow): void => {
					resolve(externalWindow);
				});
			} catch (ex) {
				reject(ex);
			}
		});
	},
	handleIde: (ide: Ide): IdeProvider => {
		return {
			createMount: (): Promise<IDisposable> => {
				return new Promise<IDisposable>((resolve, reject) => {
					const fsid = ide.server.hostname;
					chrome.fileSystemProvider.mount({
						fileSystemId: fsid,
						displayName: ide.server.name,
					}, () => {
						if (chrome.runtime.lastError) {
							return reject(chrome.runtime.lastError.message);
						}
						resolve({
							dispose: () => {
								chrome.fileSystemProvider.unmount({
									fileSystemId: fsid,
								});
							},
						});
					});
				});
			},
			listen: (host: string, port: number): Promise<TcpServer> => {
				return tcpHost.listen(host, port);
			},
		};
	},
	getValue: <T>(key: string): Promise<T | undefined> => {
		return new Promise<T | undefined>((resolve, reject): void => {
			try {
				chrome.storage.sync.get(key, (items) => {
					resolve(items[key]);
				});
			} catch (ex) {
				reject(ex);
			}
		});
	},
	setValue: <T>(key: string, value: T): Promise<void> => {
		return new Promise<void>((resolve, reject): void => {
			try {
				chrome.storage.sync.set({
					[key]: value,
				}, () => {
					resolve();
				});
			} catch (ex) {
				reject(ex);
			}
		});
	},
};

create(app);
