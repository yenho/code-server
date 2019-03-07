let closeTimeout: NodeJS.Timer | undefined; 

window.addEventListener("message", (event) => {
    if (closeTimeout) {
        clearTimeout(closeTimeout);
    }
    
});