import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App(document.getElementById('app')!);
  app.render();
});
