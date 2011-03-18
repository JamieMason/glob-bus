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
	function eventDataToString (oEvent, oEventData)
	{
		return oEventData.scope ? oEvent.type + ':' + oEventData.scope : oEvent.type;
	}
	
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
	
	// This is the only handler ever bound to an event type, it's job is to figure out which Observers to notify
	/*function observerProxy (oSelf, oObservers, oSubscribedEventTypes, oEvent, oEventData)
	{
		var sEventScope = eventDataToString (oEvent, oEventData),
		    aScopeObservers = oObservers.get(sEventScope),
		    nObservers,
		    i;

		// if array and not empty
		if ('length' in aScopeObservers && (nObservers = aScopeObservers.length) > 0)
		{
			for (i = 0; i < nObservers; i++)
			{
				aScopeObservers[i].apply(oSelf, arguments);
			}
		}
	}*/

	// Public Methods
	// ==================================================================

	function bind (oSelf, oObservers, oSubscribedEventTypes, sEventScope, fHandler)
	{
		var aScopeObservers = oObservers.set(sEventScope),
		    nObservers,
		    sEventType = stringToEventData(sEventScope).type,
		    i;

		// if NOT array
		if (!('length' in aScopeObservers && typeof (nObservers = aScopeObservers.length) === 'number'))
		{
			return false;
		}

		// quit if this handler has been bound at this scope before
		for (i = 0; i < nObservers; i++)
		{
			if (fHandler === aScopeObservers[i])
			{
				return false;
			}
		}

		// add the new handler to this scope
		aScopeObservers.push(fHandler);

		// mark this event type as being observed
		oSubscribedEventTypes[sEventType] = true;
	}

	function unbind (oSelf, oObservers, oSubscribedEventTypes, sEventScope, fHandler)
	{
		var aScopeObservers = oObservers.get(sEventScope),
		    nObservers,
		    sEventType = stringToEventData(sEventScope).type,
		    i;

		// if NOT array OR empty
		if (!('length' in aScopeObservers && (nObservers = aScopeObservers.length) > 0))
		{
			return false;
		}

		// look if the fHandler s been bound at this scope
		for (i = 0; i < nObservers; i++)
		{
			if (fHandler === aScopeObservers[i])
			{
				// remove the fHandler from this scope
				aScopeObservers.slice(i, 1);
				
				// quit and report match to callee
				return true;
			}
		}
	}

	function trigger (oSelf, oObservers, oSubscribedEventTypes, sEventScope, oEventData)
	{
		oEventData = oEventData || {};
		
		var aScopeObservers = oObservers.get(sEventScope),
		    nObservers,
		    oEventTypeAndScope = stringToEventData(sEventScope),
		    i;

		// if NOT array OR empty
		if (!('length' in aScopeObservers && (nObservers = aScopeObservers.length) > 0))
		{
			return false;
		}

		// Decorate the event data with the event type and scope
		oEventData.type = oEventTypeAndScope.data;
		oEventData.scope = oEventTypeAndScope.scope;

		console.groupCollapsed(sEventScope);
		console.info('[ScopedEvent].trigger transmits:', oEventData);

		// call all handlers at this scope
		for (i = 0; i < nObservers; i++)
		{
			aScopeObservers[i](oEventData);
		}
		
		console.groupEnd();

		return true;
	}

	// Exposed Constructor 
	// ==================================================================
	
	function ScopedEvent ()
	{
		var oSubscribedEventTypes = {}, // @TODO - check, this may not actually be needed
		    oObservers = scopedEventModel();
		
		this.bind = curry(bind, this, oObservers, oSubscribedEventTypes);
		this.unbind = curry(unbind, this, oObservers, oSubscribedEventTypes);
		this.trigger = curry(trigger, this, oObservers, oSubscribedEventTypes);
	}
	
	// return constructor to outer scope
	return ScopedEvent;
	
})();
