'use strict'

import { app, BrowserWindow, globalShortcut } from 'electron'
import windowStateKeeper from 'electron-window-state'
import createMenu from './createMenu'
import registerGlobalShortcuts from './registerGlobalShortcuts'
import listenToEvents from './listenToEvents'

const MIN_WINDOW_WIDTH = 1280
const MIN_WINDOW_HEIGHT = 640

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const createWindow = () => {
  const mainWindowState = windowStateKeeper({
    defaultWith: MIN_WINDOW_WIDTH,
    defaultHeight: MIN_WINDOW_HEIGHT
  })
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width < MIN_WINDOW_WIDTH ? MIN_WINDOW_WIDTH : mainWindowState.width,
    height: mainWindowState.height < MIN_WINDOW_HEIGHT ? MIN_WINDOW_HEIGHT : mainWindowState.height,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    minHeight: MIN_WINDOW_HEIGHT,
    minWidth: MIN_WINDOW_WIDTH,
    autoHideMenuBar: true,
    darkTheme: true,
    show: false,
    backgroundColor: '#181818',
    frame: false
  })

  // const test = nativeImage.createFromPath("/test.png")
  // //imgs/bars--img.gif
  // console.log(test.isEmpty())
  // console.log(test.getSize())
  // console.log(test.toDataURL())
  // const test = nativeImage.createFromPath('/test.png')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  if (mainWindowState.isMaximized) {
    mainWindow.maximize()
  }

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(winURL)

  // mainWindow.setThumbarButtons([{
  //   tooltip: 'Example',
  //   icon: nativeImage.createFromPath('/test.png'),
  //   // icon: nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wcbCAYYIhmhagAAAXFJREFUWMPF1zFIlVEYxvH3XFHppinS0FKI4BRIEDS25SK4tbnVFm05B0Iuji5ONecS0dQQTdHUJDQIDkGIkCQNZVj6c/FDucjnd6/f+e5/OOv7H95znudEnIDH2MYH3I8mQcKeU47wGreaEhg4GdrJbzxHO7fAkHK+4SFSLoErqvERd3IItFXnH9ZwvU6Bq7rnJ55isA6BEb2zgQf9FCh4g6leBUbVwz6WMdKtwDX18h0LaPVLoOAT7vVTAA7xCjfKBMbk5xeeYeg8gXHN8RV3i9mpEIiIvQYDeCcibqaU/reiPwxHRCuKo2G2ImIupXRwViA1MHg/IpYiYial9LlzCScyLt0R1jFZdg1zCXyp1C8zCOzgEQaqPsV1CfzFCsa6DaM6BN5iutc4vsxLuIHZyxaSXgR28aSuStaNwAFWMVFnKa0ax+9xO0ctv6iSbWI+58+oXZLhixjO/TVr4U9Hi3lZ2mIySLzAD7w7Wxhycwz23/4IZqBmOAAAAABJRU5ErkJggg=='),
  //   flags: ['enabled', 'dismissonclick'],
  //   click: function () {
  //     console.log('Example button clicked')
  //   }
  // }, {
  //   tooltip: 'Example 2',
  //   icon: nativeImage.createFromPath('/test.png'),
  //   // icon: nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wcbCAYYIhmhagAAAXFJREFUWMPF1zFIlVEYxvH3XFHppinS0FKI4BRIEDS25SK4tbnVFm05B0Iuji5ONecS0dQQTdHUJDQIDkGIkCQNZVj6c/FDucjnd6/f+e5/OOv7H95znudEnIDH2MYH3I8mQcKeU47wGreaEhg4GdrJbzxHO7fAkHK+4SFSLoErqvERd3IItFXnH9ZwvU6Bq7rnJ55isA6BEb2zgQf9FCh4g6leBUbVwz6WMdKtwDX18h0LaPVLoOAT7vVTAA7xCjfKBMbk5xeeYeg8gXHN8RV3i9mpEIiIvQYDeCcibqaU/reiPwxHRCuKo2G2ImIupXRwViA1MHg/IpYiYial9LlzCScyLt0R1jFZdg1zCXyp1C8zCOzgEQaqPsV1CfzFCsa6DaM6BN5iutc4vsxLuIHZyxaSXgR28aSuStaNwAFWMVFnKa0ax+9xO0ctv6iSbWI+58+oXZLhixjO/TVr4U9Hi3lZ2mIySLzAD7w7Wxhycwz23/4IZqBmOAAAAABJRU5ErkJggg=='),
  //   flags: ['enabled', 'dismissonclick'],
  //   click: function () {
  //     console.log('Example button clicked')
  //   }
  // }, {
  //   tooltip: 'Example 3',
  //   icon: nativeImage.createFromPath('/test.png'),
  //   // icon: nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wcbCAYYIhmhagAAAXFJREFUWMPF1zFIlVEYxvH3XFHppinS0FKI4BRIEDS25SK4tbnVFm05B0Iuji5ONecS0dQQTdHUJDQIDkGIkCQNZVj6c/FDucjnd6/f+e5/OOv7H95znudEnIDH2MYH3I8mQcKeU47wGreaEhg4GdrJbzxHO7fAkHK+4SFSLoErqvERd3IItFXnH9ZwvU6Bq7rnJ55isA6BEb2zgQf9FCh4g6leBUbVwz6WMdKtwDX18h0LaPVLoOAT7vVTAA7xCjfKBMbk5xeeYeg8gXHN8RV3i9mpEIiIvQYDeCcibqaU/reiPwxHRCuKo2G2ImIupXRwViA1MHg/IpYiYial9LlzCScyLt0R1jFZdg1zCXyp1C8zCOzgEQaqPsV1CfzFCsa6DaM6BN5iutc4vsxLuIHZyxaSXgR28aSuStaNwAFWMVFnKa0ax+9xO0ctv6iSbWI+58+oXZLhixjO/TVr4U9Hi3lZ2mIySLzAD7w7Wxhycwz23/4IZqBmOAAAAABJRU5ErkJggg=='),
  //   flags: ['enabled', 'dismissonclick'],
  //   click: function () {
  //     console.log('Example button clicked')
  //   }
  // }])
  // mainWindow.setOverlayIcon(test, 'TEst asdf')
  // mainWindow.setProgressBar(0.5)

  // This is done this way because I don't want to change the renderer folder
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      const path = require('path')
      const { remote } = require('electron')
      const win = remote.getCurrentWindow()
      const ElectronTitlebarWindows = require('electron-titlebar-windows')
      const titleBar = new ElectronTitlebarWindows({
        backgroundColor: '#181818',
        draggable: true,
      })
      // Set the thumbnail region (windows)
      win.setThumbnailClip({
        x: 256, y: window.innerHeight - 63, width: 64, height: 63
      })
      window.addEventListener('resize', function(e) {
        win.setThumbnailClip({
          x: 256, y: window.innerHeight - 63, width: 64, height: 63
        })
      })
      
      titleBar.on('minimize', function(e) {
        win.minimize();
      })
      titleBar.on('maximize', function(e) {
        win.isMaximized() ? win.unmaximize() : win.maximize();
      })
      titleBar.on('fullscreen', function(e) {
        win.isMaximized() ? win.unmaximize() : win.maximize();
      })
      titleBar.on('close', function(e) {
          win.close();
      })
      
      // Put the title bar in the correct position
      titleBar.appendTo(document.body)
      var titleBarElem = document.getElementsByClassName('titlebar')[0]
      document.body.insertBefore(titleBarElem, document.body.childNodes[0])
  `)
    mainWindow.webContents.insertCSS(`
      #main, .login-wrapper {
        height: calc(100vh - 32px) !important;
      }
    `)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  createMenu(mainWindow)
  registerGlobalShortcuts(mainWindow)
  listenToEvents()
})

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

app.on('will-quit', () => globalShortcut.unregisterAll())

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
