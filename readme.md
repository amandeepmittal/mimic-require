# MIMIC REQUIRE

`require()` function of Node.js is synchronous in nature. It returns module content using direct style.

This is a demonstration through a custom module system.

To run

`node loader ./index.js`

run the custom loader and provide it with a module name, as if required using `require()` function in Node.js

loader.js uses custom version of `require()` rather than the one provided by Node.js.

---

# GLOSSARY

## Revealing Module Pattern

Modules are the building blocks of an application or a package in Node.js. To avoid polluting the global scope of JS, modules are used. Everything inside a module is private unless it is assigned to `module.exports` variable. The technique here used is known as _revealing module pattern_.

```javascript
var module = (function(){
  var privateVar1 = ...;
  var privateVar2 = function(){...};

  var export = {
    publicVar: function(){...};
  }
  return export;
});
```

## Resolving Algorithm
NODEJS solves the problem of **dependency hell**(_a scenario that arises when the dependencies of an application depend on a shared dependency but require different incompatible versions_) by loading a different version of a module depending on where the module is loaded from.

This is due to _Resolving Algorithm_ applied in the `require()` function. It is divided into:
- File Modules: if moduleName starts with “/“, then its an absolute path to the module. If it starts with “./“ then moduleName is relative path(_which is calculated from the requiring module_).
- Core Modules: if moduleName is not prefixed with “./“ or “/“, resolving algo will search within the Node.js Modules
- Package Modules: if resolving algo cannot find matching moduleName in core modules then it searches inside node_modules directory. The resolving algo will continue to search until it reaches the root of the filesystem.

According to Resolving Algorithm, each package in node_modules will have their own private dependencies:
```
myAPP-root
|— app.js
|__ node_modules
	|— depA
	|	|— index.js
	|— depB
	|	|— index.js
	|	|__ node_moudles
	|	|__ depA
	|		|— index.js
	|__depC
		|—index.js
		|__node_modules
			|__depA
				|— index.js
```

The resolving algorithm is applied transparently when `require()` is invoked. However, if needed, it can still be used directly by any module by simply invoking `require.resolve()`. 

## Module Caching

Each module is loaded and evaluated only the first time it is required.

Any following call of `require()` to that module will simply return the cached version.

Caching is crucial:
- for performance
- makes possible to have cycles(_circular dependencies_) within module dependencies

module cache is exposed in the `require.cache` variable.
