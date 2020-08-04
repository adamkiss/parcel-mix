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

module.exports = {
	writeFile, deleteFile, renameFile, renameFileOrOK,
	readDir, findProjectRoot
}
