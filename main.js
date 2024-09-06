/*
 * @Description: 主进程
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-26 16:52:51
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-09-06 16:36:27
 * @FilePath: \electron-demo\main.js
 */
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('node:path')
const registerAppMenu = require('./menus.js');
const isMac = process.platform === 'darwin'
let tray = null
let WIN = null
let timer = null
let count = 0
let icon = nativeImage.createFromPath('./build/icons/24x24.png')

// autoUpdater.forceDevUpdateConfig = true//开启开发环境调试



const createWindow = () => {
	WIN = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})
	WIN.loadFile('index.html')
	WIN.webContents.openDevTools()
	// WIN.loadURL('https://www.baidu.com')
}

app.whenReady().then(() => {
	//每次启动检查更新
	createWindow()
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
	checkUpdate()
	ipcMain.handle('pingFun', () => 'pong')
	// 图标放入--系统托盘
	tray = new Tray(icon)
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'electron微信',
			role: 'redo',
			click: () => {
				if (WIN) {
					WIN.show()
					tray.setImage(icon)
					tray.setToolTip('打开这个窗口')
					clearInterval(timer)
					timer = null
					count = 0
				}
			}
		},
		{ label: '退出electron微信', role: 'quit' }
	])
	tray.setToolTip('my electron')
	tray.setContextMenu(contextMenu)

	// 渲染线程通知，有新的消息
	ipcMain.on('haveMessage', (event, arg) => {
		timer = setInterval(() => {
			count += 1
			if (count % 2 === 0) {
				tray.setImage(icon)
			} else {
				tray.setImage(nativeImage.createEmpty()) // 创建一个空的nativeImage实例
			}
			tray.setToolTip(`您有${count}条新消息`)
		}, 500)
	})
	tray.on('click', () => {
		if (WIN.isVisible()) {
			WIN.show()
			tray.setImage(icon)
			tray.setToolTip('点击打开这个窗口')
			clearInterval(timer)
			timer = null
			count = 0
		} else {
			WIN.show()
		}
	})

})

app.on('window-all-closed', () => {
	if (!isMac) app.quit()
})

try {
	require('electron-reloader')(module, {});
} catch (_) { }


registerAppMenu()


function checkUpdate () {
	if (isMac) {
		//我们使用koa-static将静态目录设置成了static文件夹，
		//所以访问http://127.0.0.1:9005/darwin，就相当于访问了static/darwin文件夹，win32同理
		autoUpdater.setFeedURL('http://127.0.0.1:9005/darwin')
	} else {
		console.log('去服务器上寻找更新文件！！！');
		autoUpdater.setFeedURL('http://127.0.0.1:9005/win32')
	}

	//检测更新
	autoUpdater.checkForUpdates()

	//监听'error'事件
	autoUpdater.on('error', (err) => {
		console.log(err)
	})

	//监听'update-available'事件，发现有新版本时触发
	autoUpdater.on('update-available', () => {
		console.log('发现有新版本')
	})

	//默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
	//监听'update-downloaded'事件，新版本下载完成时触发
	autoUpdater.on('update-downloaded', () => {
		dialog.showMessageBox({
			type: 'info',
			title: '应用更新',
			message: '发现新版本，是否更新？',
			buttons: ['是', '否']
		}).then((buttonIndex) => {
			if (buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
				autoUpdater.quitAndInstall()
				// app.quit()
			}
		})
	})
}

