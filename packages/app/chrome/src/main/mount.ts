import { Client } from "@coder/protocol/src";
import { Ide } from "@coder/app/common/src/app";

interface OpenFile {
	readonly fd: number;
	readonly size: number;
}

declare const __non_webpack_require__: typeof require;

export const mountedIdes: Map<string, Client> = new Map();

export const doMount = (ide: Ide): void => {
    const fsid = ide.server.hostname;
	const openedFiles: Map<number, OpenFile> = new Map();
	const client = ide.client;

    const onOpenFileRequested = (options: chrome.fileSystemProvider.OpenFileRequestedEventOptions, successCallback: Function, errorCallback: (error: string) => void) => {
        if (options.fileSystemId !== fsid) {
            return;
        }

        client.evaluate(async (_, filePath: string, mode: string): Promise<OpenFile> => {
            const fs = __non_webpack_require__("fs") as typeof import("fs");
            const util = __non_webpack_require__("util") as typeof import("util");
			const fd = await util.promisify(fs.open)(filePath, undefined!, mode);
			const stats = await util.promisify(fs.stat)(filePath);

            return {
				fd,
				size: stats.size,
			};
        }, options.filePath, options.mode).then((fileDesc) => {
            openedFiles.set(options.requestId, fileDesc);
            successCallback();
        }).catch((ex) => {
            errorCallback(ex.message);
        });
	};
	
	const onReadFileRequested = (options: chrome.fileSystemProvider.OpenedFileOffsetRequestedEventOptions, successCallback: (data: ArrayBuffer, hasMore: boolean) => void, errorCallback: (error: string) => void) => {
		if (options.fileSystemId !== fsid) {
			return;
		}

		const fid = openedFiles.get(options.openRequestId);
        if (!fid) {
            return errorCallback("No file found with open request id");
        }

		client.evaluate(async (_, fid: OpenFile) => {
			const fs = __non_webpack_require__("fs") as typeof import("fs");
			const util = __non_webpack_require__("util") as typeof import("util");
			
			const buffer = new global.Buffer(fid.size);
			const resp = await util.promisify(fs.read)(fid.fd, buffer, 0, buffer.length, null);

			return resp.buffer;
		}, fid).then((buffer) => {
			//
			const newBuf = new Buffer(fid.size);
			newBuf.set(buffer, 0);

			successCallback(newBuf.buffer, false);
		}).catch((ex) => {
			errorCallback(ex.message);
		});
	};

    const onCloseFileRequested = (options: chrome.fileSystemProvider.OpenedFileRequestedEventOptions, successCallback: Function, errorCallback: (error: string) => void) => {
        if (options.fileSystemId !== fsid) {
            return;
        }

        const fid = openedFiles.get(options.openRequestId);
        if (!fid) {
            return errorCallback("No file found with open request id");
        }

        client.evaluate((_, fid: number): Promise<void> => {
            const fs = __non_webpack_require__("fs") as typeof import("fs");
			const util = __non_webpack_require__("util") as typeof import("util");
			
			return util.promisify(fs.close)(fid);
        }, fid.fd).then(() => {
			openedFiles.delete(fid.fd);
			successCallback();
        }).catch((ex) => {
            errorCallback(ex.message);
        });
    };

    const onGetMetadataRequested = (options: chrome.fileSystemProvider.MetadataRequestedEventOptions, successCallback: (metadata: chrome.fileSystemProvider.EntryMetadata) => void, errorCallback: (error: string) => void) => {
        if (options.fileSystemId !== fsid) {
            return;
        }

        client.evaluate(async (_, pathName: string): Promise<chrome.fileSystemProvider.EntryMetadata> => {
            const fs = __non_webpack_require__("fs") as typeof import("fs");
            const path = __non_webpack_require__("path") as typeof import("path");
            const util = __non_webpack_require__("util") as typeof import("util");

            const stat = await util.promisify(fs.stat)(pathName);
            
            return {
                isDirectory: stat.isDirectory(),
                name: path.basename(pathName),
                size: stat.size,
                modificationTime: stat.mtime,
            };
        }, options.entryPath).then((entry) => {
            successCallback(entry);
        }).catch((ex) => {
            errorCallback(ex.message);
        });
    };

    const onReadDirectoryRequested = (options: chrome.fileSystemProvider.DirectoryPathRequestedEventOptions, successCallback: (entries: chrome.fileSystemProvider.EntryMetadata[], hasMore: boolean) => void, errorCallback: (error: string) => void) => {
        if (options.fileSystemId !== fsid) {
            return;
        }

        client.evaluate(async (_, pathName: string): Promise<chrome.fileSystemProvider.EntryMetadata[]> => {
            const fs = __non_webpack_require__("fs") as typeof import("fs");
            const path = __non_webpack_require__("path") as typeof import("path");
            const util = __non_webpack_require__("util") as typeof import("util");
            const paths = await util.promisify(fs.readdir)(pathName);
            const stats = await Promise.all(paths.map((subpath) => util.promisify(fs.stat)(path.join(pathName, subpath))));

            return paths.map((path, i) => {
                const stat = stats[i];

                return {
                    isDirectory: stat.isDirectory(),
                    name: path,
                    size: stat.size,
                    modificationTime: stat.mtime,
                };
            });
        }, options.directoryPath).then((entries) => {
            successCallback(entries, false);
        }).catch((ex) => {
            errorCallback(ex.message);
        });
    };

    chrome.fileSystemProvider.onGetMetadataRequested.addListener(onGetMetadataRequested);
    chrome.fileSystemProvider.onReadDirectoryRequested.addListener(onReadDirectoryRequested);
	chrome.fileSystemProvider.onOpenFileRequested.addListener(onOpenFileRequested);
	chrome.fileSystemProvider.onReadFileRequested.addListener(onReadFileRequested);
    chrome.fileSystemProvider.onCloseFileRequested.addListener(onCloseFileRequested);
};


