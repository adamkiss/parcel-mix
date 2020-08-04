#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const Parcel = require('parcel-bundler')
const BrowserSync = require('browser-sync').create()
const del = require('del')
const {
	writeFile, renameFileOrOK, findProjectRoot
} = require('./utils.js')
const {
	generateManifest
} = require('./manifest.js')

/* Find bundler.config.js, or expect Kirby setup and set it up */
const configFile = path.join(findProjectRoot(), 'parcel.mix.js')
if (!fs.existsSync(configFile)) {
	fs.writeFileSync(configFile, fs.readFileSync(path.join(__dirname, 'default-kirby-config.js')))
}
const config = require(configFile)
config.root = findProjectRoot()

const args = require('minimist')(process.argv.slice(2), {
	default: {
		watch: true
	}
})

const opts = {
	production: process.env.NODE_ENV === 'production',
	watch: args.watch && process.env.NODE_ENV !== 'production',
	config
}
const parcelOpts = Object.assign({
	logLevel: opts.production ? 4 : 3,
	scopeHoist: opts.scopeHoist,
	contentHash: opts.production,
	sourceMaps: !opts.production
}, config.parcelOpts)
const info = message => {
	opts.production
	? console.info(`[${(new Date).toLocaleTimeString()}]:`, message)
	: console.info(`🗜 `, message)
}

/*
	THE MANIFEST WRITING
*/
const renameAndManifest = async (bundle, config) => {
	info(`Generating manifest and renaming files…`)
	const manifest = generateManifest(bundle, config)
	await Promise.all(
		Object.values(manifest).reduce((renames, asset) => {
			if (opts.production)
				info(`${asset.dist.name} => ${asset.hash.name}`)
			else
				renames.push(renameFileOrOK(`${asset.dist.full}.map`, `${asset.hash.full}.map`))
			renames.push(renameFileOrOK(asset.dist.full, asset.hash.full))
			return renames
		}, []),
		writeFile(config.manifestPath, config.manifestTemplate(manifest))
	).catch(err => console.error(err))

}

/*
	RUN
*/
;(async function () {
	if (opts.production)
		info(`Cleaning out ${parcelOpts.outDir}…`)
	del(`${parcelOpts.outDir}/**`)

	const bundler = new Parcel(config.files, parcelOpts)
	bundler.on('bundled', async bundle => await renameAndManifest(bundle, config))

	await bundler.bundle()

	if (!opts.watch) {
		await bundler.stop()
	} else {
		if (config.bs && config.bs.proxy) {
			BrowserSync.init(config.bs)
		}

		process.on('beforeExit', async code => {
			await bundler.stop()
			if (BrowserSync.active) {
				BrowserSync.exit()
			}
		})
	}
})()
