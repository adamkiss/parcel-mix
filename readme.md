# Parcel Mix

> Wrapped version of Parcel JS v1, configured as a replacement for my usage of [Laravel Mix](https://github.com/JeffreyWay/laravel-mix). It's  a simple wrapper around Parcel to generate specific manifests, pre-set with my paths and such. If there's any interest for it, I might consider generalizing stuff a bit.

## Install

``` bash
npm i -D parcel-mix
```

## Usage

Create a config files:

``` bash
$ npx mix setup [name ?| kirby]
```

And then `package.json` scripts:

``` json
{
	"scripts": {
		"dev:assets": "npx mix [watch] [--no-hoist]"
 	}
}
```

"Experimental hoisting" is on by default, but can be turned off if it breaks stuff.

## Gotchas

### Running from a root directory

You __must__ run the Parcel Mix from a root directory, where the `parcel.mix.js` is located, because I decided against included any piece of code doing "in this folder or up" search and any complicated cwd/root/folder/whatever logic.

2020 [Adam](https://adamkiss.com).
