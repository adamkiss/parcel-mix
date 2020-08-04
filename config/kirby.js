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
		outDir: 'public/assets/dist',
		publicUrl: '/assets/dist'
	},

	/**
	 * Manifest related options
	 *
	 * "originalName": {
	 * 	type: (css|js|jpg|…)
	 * }
	 */
	manifestPath: 'site/snippets/_bundler.php',
	manifestTemplate: files => (`<?php
		if (! function_exists('bundle')) {
			function bundle($key = '') {
				$manifest = [
					${Object.keys(files).map(k => `'${k}' => (object)[
						'name' => '${files[k].hash.name}',
						'path' => '${files[k].hash.relative}',
						'type' => '${files[k].type}',
						'url' => '${files[k].url}'
					]`).join(`,
					`)}
				];
				return array_key_exists($key, $manifest) ? $manifest[$key] : $key;
			}
		}
	`),

	/**
	 * BrowserSync
	 * See: https://www.browsersync.io/docs/options
	 */
	bs: {
		proxy: pkg.config.host,
		server: false,

		files: [
			'site/collections/**',
			'site/controllers/**',
			'site/models/**',
			'site/snippets/**',
			'site/templates/**'
		],
		watchOptions: {
			ignoreInitial: true
		},

		ghostMode: {
			clicks: true,
			scroll: true,
			location: true,
			forms: false
		}
	}
}
