const { app, Menu } = require('electron')
const isMac = process.platform === 'darwin'

module.exports = () => {
	const MENUS = [
		...(isMac
			? [{
				label: app.name,
				submenu: [
					{ role: 'about' },
					{ type: 'separator' },
					{ role: 'services' },
					{ type: 'separator' },
					{ role: 'hide' },
					{ role: 'hideOthers' },
					{ role: 'unhide' },
					{ type: 'separator' },
					{ role: 'quit' }
				]
			}]
			: []),
		{
			label: '文件(F)',
			submenu: [
				isMac ? { role: 'close' } : { role: 'quit' }
			]
		},
		{
			label: '编辑(E)',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				...(isMac
					? [
						{ role: 'pasteAndMatchStyle' },
						{ role: 'delete' },
						{ role: 'selectAll' },
						{ type: 'separator' },
						{
							label: 'Speech',
							submenu: [
								{ role: 'startSpeaking' },
								{ role: 'stopSpeaking' }
							]
						}
					]
					: [
						{ role: 'delete' },
						{ type: 'separator' },
						{ role: 'selectAll' }
					])
			]
		},
		{
			label: '视图(V)',
			submenu: [
				{ role: 'reload' },
				{ role: 'forceReload' },
				{ role: 'toggleDevTools' },
				{ type: 'separator' },
				{ role: 'resetZoom' },
				{ role: 'zoomIn' },
				{ role: 'zoomOut' },
				{ type: 'separator' },
				{ role: 'togglefullscreen' }
			]
		},
		{
			label: '窗口(W)',
			submenu: [
				{ role: 'minimize' },
				{ role: 'zoom' },
				...(isMac
					? [
						{ type: 'separator' },
						{ role: 'front' },
						{ type: 'separator' },
						{ role: 'window' }
					]
					: [
						{ role: 'close' }
					])
			]
		},
		{
			label: '帮助(H)',
			submenu: [
				{
					label: '更多',
					click: async () => {
						const { shell } = require('electron')
						await shell.openExternal('https://electronjs.org')
					}
				}
			]
		}
	]

	const menu = Menu.buildFromTemplate(MENUS)
	Menu.setApplicationMenu(menu)

}
