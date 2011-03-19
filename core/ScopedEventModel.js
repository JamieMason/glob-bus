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

	function scopeContainsOther (sOuter, sInner)
	{
		var rGenericScopePattern;

		if (sOuter === '*')
		{
			return true;
		}
		
		sOuter = removeWildcards(sOuter);
		sOuter = escapeRegExpChars(sOuter);
		rSeekMatchFromStartToPeriodOrEnd = new RegExp('^' + sOuter + '(\.|$)');

		console.log(sInner, '>>>', sOuter, rSeekMatchFromStartToPeriodOrEnd);

		// if scope forms the start of the search
		return sInner.search(rSeekMatchFromStartToPeriodOrEnd) !== -1;
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

	function getItem (oSelf, oModel, sScopeChain)
	{
		var sPossibleMatch, 
		    aMatchingScopeItems = [];
		
		for (sPossibleMatch in oModel)
		{
			if (sPossibleMatch === sScopeChain || containsWildcards(sScopeChain) && scopeContainsOther(sScopeChain, sPossibleMatch))
			{
				aMatchingScopeItems = aMatchingScopeItems.concat(oModel[sPossibleMatch]);
			}
		}
		
		return aMatchingScopeItems.length > 0 ? aMatchingScopeItems : null;
	}

	function addItem (oSelf, oModel, sScopeChain, mItem)
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

		this.get = curry(getItem, this, oModel);
		this.contains = curry(containsItem, this, oModel);
		this.add = curry(addItem, this, oModel);
		this.remove = curry(removeItem, this, oModel);
	}
	
	// return constructor to outer scope
	return ScopedEventModel;
	
})();
