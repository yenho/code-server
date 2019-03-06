/// <reference path="../node_modules/@types/chrome/index.d.ts" />

// tslint:disable-next-line:no-any
const chromeApp = (<any>chrome).app;

console.log("asd");

// chromeApp.runtime.onLaunched.addListener(() => {
	console.log("Testing");
	
	chromeApp.window.create("src/main/index.html", {
		outerBounds: {
			width: 400,
			height: 500,
		},
	});
// });
