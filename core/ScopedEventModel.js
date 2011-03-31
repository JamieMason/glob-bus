var ScopedEventModel = (function()
{
	// Model helpers
	// ==================================================================
	
	// Note - these functions apply to specific scopes
	// ie: getting "type:this.that.other" would not include anything stored
	// at "type:this.that" or "type:this"   

	// if scope is deep getter: '*', 'type:*', 'type:scope.*' or 'type:scope.scope.*' etc
	function containsWildcards (sScopeChain)
	{
		return sScopeChain.indexOf('*') !== -1;
	}

	function removeWildcards (sScopeWithWildcards)
	{
		return sScopeWithWildcards.replace(/[\.:]?\*/, '');
	}
	
	function escapeRegExpChars (sSubject)
	{
		return sSubject.replace(/([\.\]\[\-\}\{\?\+\*])/g, '\\$1');
	}

	function scopeContainsOther (sBindingScope, sTriggeringScope)
	{
		var rSeekMatchFromStartToPeriodOrEnd;

		if (sBindingScope === '*')
		{
			return true;
		}

		rSeekMatchFromStartToPeriodOrEnd = new RegExp('^' + escapeRegExpChars(removeWildcards(sBindingScope)) + '(\\.|:|$)');

		return sTriggeringScope.search(rSeekMatchFromStartToPeriodOrEnd) !== -1;
	}

	function defineScope (oModel, sScopeChain)
	{
		return (oModel[sScopeChain] = sScopeChain in oModel ? oModel[sScopeChain] : []);
	}

	function isSet (oModel, sScopeChain)
	{
		return sScopeChain in oModel && 'length' in oModel[sScopeChain];
	}
	
	function isEmpty (oSelf, oModel, sScopeChain)
	{
		return isSet(oModel, sScopeChain) && oModel[sScopeChain].length === 0;
	}

	// oModel.cleanOutEmptyScope
	function cleanOutEmptyScope (oSelf, oModel, sScopeChain)
	{
		if (isEmpty(oSelf, oModel, sScopeChain))
		{
			delete oModel[sScopeChain];
		}
	}
	
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

	// Public
	// ==================================================================

	function getObserversOf (oSelf, oModel, sTriggeringScope)
	{
		var sBindingScope, 
		    aMatchingScopeItems = [];

		for (sBindingScope in oModel)
		{
			if (sBindingScope === sTriggeringScope || containsWildcards(sBindingScope) && scopeContainsOther(sBindingScope, sTriggeringScope))
			{
				aMatchingScopeItems = aMatchingScopeItems.concat(oModel[sBindingScope]);
			}
		}
		return (aMatchingScopeItems.length > 0 ? aMatchingScopeItems : null);
	}

	function addObserverOf (oSelf, oModel, sScopeChain, mItem)
	{
		// don't add duplicate
		if (oSelf.contains(sScopeChain, mItem))
		{
			return false;
		}
		
		// make sure scope is defined
		if (!isSet(oModel, sScopeChain))
		{
			defineScope(oModel, sScopeChain);
		}
		
		// add item
		oModel[sScopeChain].push(mItem);
	}

	function removeItem (oSelf, oModel, sScopeChain, mItem)
	{
		if (isSet(oModel, sScopeChain))
		{
			var i,
			    aItemsAtScope = oModel[sScopeChain],
				aItemsAtScopeCount = aItemsAtScope.length;
			
			for (i = 0; i < aItemsAtScopeCount; i++)
			{
				if (aItemsAtScope[i] === mItem)
				{
					aItemsAtScope.splice(i, 1);
					return;
				}
			}
		}
		
		cleanOutEmptyScope(oSelf, oModel, sScopeChain);
	}

	function containsItem (oSelf, oModel, sScopeChain, mItem)
	{
		if (isSet(oModel, sScopeChain))
		{
			for (var i = 0; i < oModel[sScopeChain].length; i++)
			{
				if (oModel[sScopeChain][i] === mItem)
				{
					return true;
				}
			}
		}
				
		return false;
	}

	// Exposed Constructor 
	// ==================================================================
	
	function ScopedEventModel ()
	{
		var oModel = {};

		this.get = curry(getObserversOf, this, oModel);
		this.contains = curry(containsItem, this, oModel);
		this.add = curry(addObserverOf, this, oModel);
		this.remove = curry(removeItem, this, oModel);
	}
	
	// return constructor to outer scope
	return ScopedEventModel;
	
})();
