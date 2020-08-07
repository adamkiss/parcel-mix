const path = require('path')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)
const renameFile = util.promisify(fs.rename)
const renameFileOrOK = (oldFile, newFile) => renameFile(oldFile, newFile).catch(err => null)
const readDir = util.promisify(fs.readdir)

/*
@note This is for now. I usually run assets from project root
      If it later bites me in the ass, I'll have this prepared
*/
const findProjectRoot = () => process.cwd()

/*
	Setup
*/
const allowedConfigs = ['11ty', 'kirby']
const setup = (option, configFile) => {
	if (!allowedConfigs.includes(option)) {
		console.error('⚠️ Wrong setup config name, select from: ' + allowedConfigs.join(','))
		process.exit(1)
	}

	fs.writeFileSync(configFile, fs.readFileSync(path.join(__dirname, '..', 'config', `${option}.js`)))
	console.log('✅ Done')
	return
}

module.exports = {
	writeFile, deleteFile, renameFile, renameFileOrOK,
	readDir, findProjectRoot,
	setupList: allowedConfigs, setup
}
