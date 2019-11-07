
//electron stuff
const electron = require('electron');
const ipc = require('electron').ipcMain;
const { app, BrowserWindow } = require('electron');


//create electron window
function createWindow() {

    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('src/index.html');
    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow)



