import { Client } from "@coder/protocol/src/browser/client";
import { Event } from "@coder/events";

export interface IdeInstance {
	connect(): Promise<Client>;

	dispose(): void;
}

export interface TcpHostProvider {
	create(ide: IdeInstance): TcpHost;
}

export interface TcpHost {
	listen(host: string, port: number): Promise<TcpServer>;
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

export interface Mount {
	dispose(): void;
}

export interface MountProvider {
	mount(ide: IdeInstance): Mount;
}

export interface StorageProvider {
	set<T>(key: string, value: T): Promise<void>;
	get<T>(key: string): Promise<T | undefined>;
}

export interface Window {

}

export interface CreateWindowOptions {
	readonly id: string;
}

export interface WindowProvider {
	create(url: string, ): Promise<Window>;
}