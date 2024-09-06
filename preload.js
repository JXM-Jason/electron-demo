/*
 * @Description: 预加载脚本
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-09-01 10:52:09
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-09-06 10:52:57
 * @FilePath: \electron-demo\preload.js
 */
// 写法一
// window.addEventListener('DOMContentLoaded', () => {
// 	const replaceText = (selector, text) => {
// 		const element = document.getElementById(selector)
// 		if (element) element.innerText = text
// 	}

// 	for (const dependency of ['chrome', 'node', 'electron']) {
// 		replaceText(`${dependency}-version`, process.versions[dependency])
// 	}
// })

// 写法二
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	ping: () => ipcRenderer.invoke('pingFun'),
	// msg: () => ipcRenderer.invoke('haveMessage',)
	msg: () => ipcRenderer.send('haveMessage', 'hello！！！')
	// 除函数之外，我们也可以暴露变量

})