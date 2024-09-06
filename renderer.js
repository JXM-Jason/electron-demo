/*
 * @Description: 渲染进程
 * @Author: medicom.JiaXianMeng
 * @Date: 2024-08-27 10:45:01
 * @LastEditors: medicom.JiaXianMeng
 * @LastEditTime: 2024-09-06 10:52:00
 * @FilePath: \electron-demo\renderer.js
 */

let pingVal
const func = async () => {
	const response = await window.versions.ping()
	pingVal = response
	console.log('dddd----', pingVal) // 打印 'pong'
	const information = document.getElementById('info')
	information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}),
	Node.js (v${versions.node()}), 和
  Electron (v${versions.electron()})----pingVal----:${pingVal}`
}

// 调用该函数
document.getElementById('btn').addEventListener('click', () => {
	console.log('this---', this);
	let msg = window.versions.msg();
	console.log('msg---', msg);
})

func()



