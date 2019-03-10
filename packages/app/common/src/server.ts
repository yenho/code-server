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
	
	createWindow(url: string, options?: ExternalWindowOptions): Promise<ExternalWindow>;
	handleIde(ide: Ide): IdeProvider;
}

export interface RegisteredServerSshConnection {
	readonly type: "ssh";

	readonly hostname: string;
	readonly sshPort: number;
	readonly codeServerPort?: number;
	readonly password?: string;
	readonly identity?: string;
}

export interface RegisteredServerWebConnection {
	readonly type: "web";

	readonly hostname: string;
}

export interface ServerWindowMessage {
	readonly type: "server";
	readonly server: RegisteredServer;
}

export interface ServerIdeMessage {
	readonly type: "ide";
}

export type ServerMessage = ServerWindowMessage | ServerIdeMessage;

export type RegisteredServerConnection = RegisteredServerSshConnection | RegisteredServerWebConnection;

export interface RegisteredServer {
	readonly host: "coder" | "self";
	readonly name: string;

	readonly connection: RegisteredServerConnection;
}

export interface IdeProvider {
	createMount(): Promise<Disposable>;
	listen(host: string, port: number): Promise<TcpServer>;
}
