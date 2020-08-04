const path = require('path')

const getAssets = bundle => {
	/*
		if the bundler was given multiple files, the "top level bundle".type is empty
		I just convert it to new one element Set
		and now I'm like 99% sure 'bundleFiles' is set of real bundles
	*/
	return (bundle.type ? [bundle] : Array.from(bundle.childBundles)).map(bundle => Object.assign({
		distname: path.basename(bundle.name),
		distpath: bundle.name,
		fullpath: path.dirname(bundle.name)
	}, bundle.entryAsset))
}

const getHashName = asset => {
	const parts = asset.distname.split('.')
	const ext = parts.pop()
	return [...parts, asset.hash.slice(0, 10), ext].join('.')
}

const createManifestObjects = (assets, config) => assets.map(asset => {
	/*
		This function isn't the nicest, I know. whatever.
	*/
	hashname = getHashName(asset)
	return {
		type: asset.type,
		name: asset.relativeName,
		original: path.relative(config.root, asset.name),
		url: path.join(config.parcelOpts.publicUrl, hashname),
		hash: {
			name: hashname,
			relative: path.join(config.parcelOpts.outDir, hashname),
			full: path.join(asset.fullpath, hashname)
		},
		dist: {
			name: asset.distname,
			full: asset.distpath
		}
	}
})

const generateManifest = (bundle, config) => {
	const manifest = {}
	const assets = createManifestObjects(getAssets(bundle), config)

	assets.forEach(asset => { manifest[asset.name] = asset })

	return manifest
}

module.exports = {
	generateManifest
}
