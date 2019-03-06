import { Client } from "@coder/protocol/src/browser/client";
import { Event } from "@coder/events";
import { IDisposable as Disposable } from "@coder/disposable";

export interface Ide extends Disposable {
	readonly server: RegisteredServer;
	readonly client: Client;
}

export interface TcpServer {
	readonly onConnection: Event<TcpConnection>;
	close(): Promise<void>;
}

export interface TcpConnection {
	readonly onData: Event<ArrayBuffer>;
	send(data: ArrayBuffer): Promise<void>;
	close(): Promise<void>;
}

export interface ExternalWindow extends Disposable {
	readonly id: string;
	readonly contentWindow: Window;

	dispose(): void;
}

export interface ExternalWindowOptions {
	readonly id: string;
}

export interface App {
	readonly domNode: HTMLElement;

	setValue<T>(key: string, value: T): Promise<void>;
	getValue<T>(key: string): Promise<T | undefined>;

	handleIde(ide: Ide): IdeProvider;
}

export interface RegisteredServer {
	readonly host: "coder" | "self";
	readonly hostname: string;
	readonly name: string;
}

export interface IdeProvider {
	createWindow(url: string, options?: ExternalWindowOptions): Promise<ExternalWindow>;
	createMount(): Promise<Disposable>;

	listen(host: string, port: number): Promise<TcpServer>;
}