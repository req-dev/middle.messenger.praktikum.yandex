import App from "./App.tsx";

document.addEventListener('DOMContentLoaded', () => {
    const app = new App(document.getElementById('app')!);
    app.render();
});
