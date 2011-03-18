
function scopedEventModel(subject, that)
{
	that = that || {};
	subject = subject || that;
	
	function _proxy(namespaceString, callback, excludeCapturingScopes)
	{
		if (typeof namespaceString !== 'string')
		{
			return null;
		}

		var nsNames = namespaceString.split(':'),

			// store this to save looking it up on every pass of the loop
		    nsNamesLength = nsNames.length,

			eventType = '',

			scopeChain = '';

		if (nsNamesLength < 1 || nsNamesLength > 2)
		{
			return null;
		}

		// portion before the : is the event type
		eventType = nsNames[0];

		// if selector is not global
		if (eventType !== '*')
		{
			// and only an event type was sent, the scope is 'event:*'
			scopeChain = nsNamesLength === 2 ? nsNames[1] : '*';
		}

		return callback(eventType, scopeChain, excludeCapturingScopes);
	}

	function _set(eventType, scopeChain)
	{
		// if items should be global, ie applying to all types at all scopes
		if (eventType === '*')
		{
			// store items there
			subject[eventType] = subject[eventType] || [];
			
			// return reference to callee
			return subject[eventType];
		}
		
		// else items should be stored against a type

		// create event type if undefined
		subject[eventType] = subject[eventType] || {};

		// add scope chain on event type if undefined
		subject[eventType][scopeChain] = subject[eventType][scopeChain] || [];

		// return reference to callee
		return subject[eventType][scopeChain];
	}

	function _get(kind, scopeChain, excludeCapturingScopes)
	{
		var itemsStoredInThisScope = [],
		    scopesArray = subject[kind] || [],
			globalArray = subject['*'] || [],
		    scope;

		if (scopesArray.length === 0 && globalArray.length === 0)
		{
			return null;
		}
		
		// if we only want eg 'ui:betslip.login.open' and not eg 'ui:betslip.login' or 'ui:betslip' 
		if (excludeCapturingScopes)
		{
			return typeof scopesArray[scopeChain] !== 'undefined' ? scopesArray[scopeChain] : null;
		}

		// otherwise we want to include everything interested in our event (recommended)
		for (scope in scopesArray)
		{
			// if these items are related to all items of this kind
			// OR the scope for these items matches ours exactly (eg scope is 'betslip.login.open' and the items here are scoped to 'betslip.login.open' too)
			// OR our scope falls within the broader scope these items are related to (eg scope is 'betslip.login.open' and the items here are scoped to 'betslip')
			if (scopesArray.hasOwnProperty(scope) && (scopeChain.replace(scope, '') === '' || scopeChain.replace(scope, '').charAt(0) === '.'))
			{
				// add these handlers to our array
				itemsStoredInThisScope = itemsStoredInThisScope.concat(scopesArray[scope]);
			}
		}
		
		// add globals if set
		if (globalArray.length !== 0)
		{
			itemsStoredInThisScope = itemsStoredInThisScope.concat(globalArray);
		}

		// send back the handlers
		return itemsStoredInThisScope;
	}

	that.set = function (selector)
	{
		return _proxy(selector, _set);
	};

	that.get = function (selector, excludeCapturingScopes)
	{
		return _proxy(selector, _get, excludeCapturingScopes === true);
	};
	
	return that;
}

