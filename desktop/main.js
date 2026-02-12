const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backend;
function createWindow() {
  const win = new BrowserWindow({ width: 1400, height: 900, webPreferences: { nodeIntegration: false, contextIsolation: true } });
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  backend = spawn('node', ['src/server.js'], { cwd: path.join(__dirname, '..', 'backend') });
  backend.stdout.on('data', d => console.log(`backend: ${d}`));
  setTimeout(createWindow, 2500);
});

app.on('window-all-closed', () => {
  if (backend) backend.kill();
  if (process.platform !== 'darwin') app.quit();
});
