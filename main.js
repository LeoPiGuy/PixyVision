const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const url = require('url')

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('COM6')
const parser = new Readline()

let win

function createWindow () {
  win = new BrowserWindow({width: 350, height: 550})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', () => {
    win = null
  })
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('loaded')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {if (process.platform !== 'darwin') {app.quit()}})

app.on('activate', () => {if (win === null) {createWindow()}})

ipcMain.on('done', (event, X) => {
  console.log(X)
})

ipcMain.on('confirmed-load', (event) => {
  console.log("App Loaded!")
  port.pipe(parser);
  parser.on('data', (data) => {
   // console.log(data)
    args = data.split(";")
    //console.log(args)
    if(args[0].charAt(0) == "S") return
    let [x,y,w,h] = args
    event.sender.send('newData', x, y, w, h)
    console.log(`CenterX:${x} -=- CenterY:${y} -=- Width:${w} -=- Height:${h}`)
    // if(data.charAt(0) == "X") {
    //   let X = data.split("X")[1]
    //   event.sender.send('newX', X)
    // } else if(data.charAt(0) == "Y") {
    //   let Y = data.split("Y")[1]
    //   event.sender.send('newY', Y)
    //}
  });
})