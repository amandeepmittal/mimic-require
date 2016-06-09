var fs = require('fs');

// save the original require() of Node.js
var originalRequire = require;

// a function that loads the content of a module, wraps it into a private scope and evaluates it
function loadModule(filename, module,require){
	var privateWrapper = '(function(module,exports,require) {' +
						fs.readFileSync(filename, 'utf8') +
						'}) (module,module.exports, require);';
	eval (privateWrapper);
}

// simulate behaviour of original require() of Node.js by making a custom require
var require = function (moduleName) {
	console.log('Require called for module: ' + moduleName);

	// resolve the path of the module, call it id
	// require.resolve() implements resolving algorithm
	var id = require.resolve(moduleName);

	// if the module is already loaded in the past, return it immediately from the cache
	if(require.cache[id]) {
		return require.cache[id].exports;
	}

	// if the module is being loaded for the first time, create it
	var module = {
		exports: {},
		id: id
	};

	// cache the module object
	require.cache[id] = module;

	// load the module from its source code
	loadModule(id, module, require);

	// return exported variables
	return module.exports;
};

require.cache = {};
require.resolve = function(moduleName) {
	// reuse the original resolving algorithm for simplicity
	return originalRequire.resolve( moduleName);
};

//  Load the entry point using homemade 'require'
require(process.argv[2]);
