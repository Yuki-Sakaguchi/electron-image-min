/**
 * @fileoverview メインプロセス
 */
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  const screen = electron.screen.getPrimaryDisplay()
  const width = 350
  const height = 300
  const x = parseInt(screen.workAreaSize.width * 0.5 - width * 0.5)
  const y = parseInt(screen.workAreaSize.height * 0.5 - height * 0.5)
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    backgroundColor: '#297082',
    width,
    height,
    x,
    y,
    icon: `file://${__dirname}/assets/icons/mac/icon.icns`
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})