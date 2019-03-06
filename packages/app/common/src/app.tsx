import "material-components-web/dist/material-components-web.css";
import "./app.scss";
import "./tooltip.scss";

import * as React from "react";
import { render } from "react-dom";
import { Main } from "./containers";
import { App, RegisteredServer } from "./server";

export * from "./server";

export const create = async (app: App): Promise<void> => {
	let servers = await app.getValue<RegisteredServer[]>("servers");
	if (!servers) {
		servers = [];
	}

	render(<Main app={app} />, app.domNode);
};
