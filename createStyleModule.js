window.uses = function(moduleToUse, props) {
	var configToExtend = _.extend({}, moduleToUse.style, moduleToUse.node);
	return _.extend({}, configToExtend, props);
};

window.createStyleModule = function(setup) {
	
	/**
	 * Objects that can be more easily referenced.
	 */
	var getNamespacedModule = function(module) {
		var namespacedModule = {};
		
		namespacedModule.style = {};

		for(var prop in module) {
			if(prop === 'node') {
				namespacedModule.node = module[prop];
			} else if(prop !== 'child' && prop !== 'children') {
				namespacedModule.style[prop] = module[prop];
			}
		}

		var key;
		if('child' in module) key = 'child';
		else if('children' in module) key = 'children';

		for(var child in module[key]) {
			namespacedModule[child] = getNamespacedModule(module[key][child]);
		}

		return namespacedModule;
	};

	/**
	 * Take a module, ignore its children, and output a configuration object.
	 */
	var getConfigFromModule = function(module) {
		var config = {};
		for(var key in module) {
			if(key !== 'child' && key !== 'children') {
				config[key] = module[key];
			}
		}
		return config;
	};

	// Loop through the namespaced module and produce function calls.
	function loopModule(nsm) {
		var config;

		var module = function(props, children) {

			var text;

			if(typeof props === 'string') {
				text = props;
				props = {};
				children = children || [];
			}
			else if((props && '_owner' in props || props instanceof Array) && typeof children === 'undefined') {
				children = props;
				props = {};
			}
			else {
				props = props || {};
				children = children || [];
			}

			var moduleConfig = getConfigFromModule(nsm);
			var config = _.extend({}, moduleConfig, props);

			var node = props.node || config.node || 'div';
			var component = typeof node === 'string' ? React.DOM[node] : props.node;

			if(text) {
				config.children = text;
				return component.apply(null, [config]);
			}
			else if(component) {
				return component.apply(null, [config].concat(children))
			}
			else {
				throw new Error('You must provide a valid component.')
			}
		}

		module.style = nsm.style;
		module.node = nsm.node;

		for(var i in nsm) {
			if(i !== 'style' && i !== 'node') {
				module[i] = loopModule(nsm[i]);
			}
		}

		return module;
	}

	var namespacedModule = getNamespacedModule(setup);

	return loopModule(namespacedModule);

};