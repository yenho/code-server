//@ts-ignore
import { MDCTextField } from "@material/textfield";
import { TcpHost } from "./connection";
import { StorageProvider } from "./storage";
import "material-components-web/dist/material-components-web.css";
import "./app.scss";
import "./tooltip.scss";

import * as React from "react";
import { render } from "react-dom";
import { Main } from "./containers";
import { TcpHostProvider, MountProvider } from "./server";

export * from "./server";

export interface App {
	readonly tcp: TcpHostProvider;
	readonly mount: MountProvider;
	readonly storage: StorageProvider;
	readonly node: HTMLElement;
}

export interface RegisteredServer {
	readonly host: "coder" | "self";
	readonly hostname: string;
	readonly name: string;
}

export const create = async (app: App): Promise<void> => {
	let servers = await app.storage.get<RegisteredServer[]>("servers");
	if (!servers) {
		servers = [];
	}

	render(<Main />, app.node);
};
