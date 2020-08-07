const pkg = require('./package.json')

module.exports = {
	/*
	 * Which files do actually get processed?
	 */
	files: [
		'main.css',
		'main.sass',
		'main.js'
	],
	/**
	 * Parcel/cleanup related options
	 */
	parcelOpts: {
		outDir: 'site/assets/dist',
		publicUrl: '/assets/dist'
	},
	/**
	 * Manifest related options
	 */
	manifestPath: 'data/assets.json',
	manifestTemplate: files => JSON.stringify(files, null, "\t"),
	/**
	 * BrowserSync is managed by 11ty
	 */
	bs: false
}
