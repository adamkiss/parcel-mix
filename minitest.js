const args = require('minimist')(process.argv.slice(2), {
	default: {
		watch: true
	}
})
const [command, argument] = args._

console.log(command, argument, args)
