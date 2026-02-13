const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backend;
function createWindow() {
  const win = new BrowserWindow({ width: 1400, height: 900, webPreferences: { preload: path.join(__dirname, 'preload.js') } });
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  backend = spawn('node', ['../backend/src/server.js'], { cwd: __dirname, stdio: 'inherit' });
  setTimeout(createWindow, 3000);
});

app.on('window-all-closed', () => {
  if (backend) backend.kill();
  if (process.platform !== 'darwin') app.quit();
});
