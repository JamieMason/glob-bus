/*global ScopedEventModel*/

var ScopedEvent = (function()
{
	// Utils
	// ==================================================================

	function curry (fn /*, ... */)
	{
		var aCurryArgs = Array.prototype.slice.call(arguments, 1);

		return function ( /* ... */ )
		{
			var aCalleeArgs = Array.prototype.slice.call(arguments, 0),
				aMergedArgs = aCurryArgs.concat(aCalleeArgs);

			return fn.apply(this, aMergedArgs);
		};
	}
	
	// Internals
	// ==================================================================
	
	// return eg: "checkout:payment.complete", "ui:checkout.submit", "validator:signup.postcode.invalid"
	/* CURRENTLY UNUSED
	function eventDataToString (oEvent, oEventData)
	{
		return oEventData.scope ? oEvent.type + ':' + oEventData.scope : oEvent.type;
	}*/
	
	// convert "checkout:payment.complete" to { type: "checkout", scope: "payment.complete" };
	function stringToEventData (sEventScope)
	{
		var isGranular = sEventScope.indexOf(':') !== -1,
		    aEventScope = sEventScope.split(':');
		
		return isGranular ? {
			type : aEventScope[0],
			scope : aEventScope[1]
		} : {
			type : sEventScope,
			scope : ''
		};
	}

	// Validate the event scope pattern supplied
	function invalidRequestFilter (fMethod, oSelf, oObservers, sEventScope)
	{
		if (sEventScope !== '*' && sEventScope.search(/^[a-z]+:(\*|[a-z]+\.?)+$/i) === -1)
		{
			throw new TypeError('[ScopeEvent] "' + sEventScope + '" is an invalid binding');
		}
		
		// Access the arguments intended for fMethod
		var args = Array.prototype.slice.call(arguments, 0);
		
		// Take off our addition fMethod first argument
		args.splice(0, 1);
		
		// pass on the remaining arguments to fMethod
		return fMethod.apply(oSelf, args);
	}

	// Public Methods
	// ==================================================================

	function bind (oSelf, oObservers, sEventScope, fHandler)
	{
		// add the new handler to this scope
		oObservers.add(sEventScope, fHandler);
	}

	function unbind (oSelf, oObservers, sEventScope, fHandler)
	{
		var aScopeObservers = oObservers.get(sEventScope),
		    nObservers = aScopeObservers.length,
		    i;

		// quit if the model returned no matches
		if (aScopeObservers === null)
		{
			return;
		}

		// look if the fHandler s been bound at this scope
		for (i = 0; i < nObservers; i++)
		{
			if (fHandler === aScopeObservers[i])
			{
				// remove the fHandler from this scope
				aScopeObservers.slice(i, 1);
				
				// quit and report match to callee
				return;
			}
		}
	}

	function trigger (oSelf, oObservers, sEventScope, oEventData)
	{
		oEventData = oEventData || {};
		
		var aScopeObservers = oObservers.get(sEventScope),
		    nObservers,
		    oEventTypeAndScope = stringToEventData(sEventScope),
		    i;

		// quit if the model returned no matches
		if (aScopeObservers === null)
		{
			return;
		}
		
		nObservers = aScopeObservers.length;

		// Decorate the event data with the event type and scope
		oEventData.type = oEventTypeAndScope.data;
		oEventData.scope = oEventTypeAndScope.scope;

		//console.groupCollapsed(sEventScope);
		//console.info('[ScopedEvent].trigger transmits:', oEventData);

		// call all handlers at this scope
		for (i = 0; i < nObservers; i++)
		{
			aScopeObservers[i](oEventData);
		}
		
		//console.groupEnd();
	}

	// Exposed Constructor 
	// ==================================================================
	
	function ScopedEvent ()
	{
		var oObservers = new ScopedEventModel();
		
		this.bind = curry(invalidRequestFilter, bind, this, oObservers);
		this.unbind = curry(invalidRequestFilter, unbind, this, oObservers);
		this.trigger = curry(invalidRequestFilter, trigger, this, oObservers);
	}
	
	// return constructor to outer scope
	return ScopedEvent;
	
})();
