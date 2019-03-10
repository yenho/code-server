import { RegisteredServer } from "./server";

export const runInServerWindow = (window: Window, server: RegisteredServer) => {
    window.document.body.style.height = "100vh";
    window.document.body.style.width = "100vw";
    window.document.body.style.padding = "0px";
    window.document.body.style.margin = "0px";

    const webview = window.document.createElement("webview");
    webview.style.width = "100%";
    webview.style.height = "100%";
    webview.addEventListener("close", () => {
        window.close();
    });
    webview.addEventListener("loadstop", (event) => {
        (webview as any).executeScript({
            code: `(${runWithIdeWindow.toString()})()`,
        });
        const contentWindow = (event.target as any).contentWindow as Window;
        contentWindow.postMessage("ping", "*");
    });
    webview.src = server.connection.hostname;
    window.document.body.appendChild(webview);
};

export const runWithIdeWindow = () => {
    let postHost: (message: any) => void;

    window.addEventListener("message", (event) => {
        if (event.data === "ping") {
            console.log("Pinger", event.source, event.origin);
            const source = event.source;
            const origin = event.origin;
            postHost = (message: any): void => {
                (source as any).postMessage(message, origin);
            };
        } 
    });
    window.addEventListener("ide-ready", () => {
        const minIcon = document.querySelector(".window-icon.window-minimize");
        if (minIcon) {
            minIcon.addEventListener("click", () => {
                postHost("minimize");
            });
        }
        const maxIcon = document.querySelector(".window-icon.window-maximize");
        if (maxIcon) {
            maxIcon.addEventListener("click", () => {
                postHost("maximize");
            });
        }
        const closeIcon = document.querySelector(".window-icon.window-close");
        if (closeIcon) {
            closeIcon.addEventListener("click", () => {
                window.close();
            });
        }
    });
};
