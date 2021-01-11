const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
let mainWindow;

const iconPath = path.join(__dirname, 'build', 'icon.ico');


function createWindow() {
  mainWindow = new BrowserWindow({ width: 1920, height: 1080,  icon: __dirname + '/icon.png' });
  mainWindow.loadURL(
    // isDev
    //   ? 'http://localhost:3333'
    'https://dashboard.portadoor.com'
  );

 

  mainWindow.webContents.session.cookies.get({}, (error, cookies) => {
    if(error) throw error;

    this.cookies = cookies;
  });

  //mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});