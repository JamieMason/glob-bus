var ScopedEventModel = (function()
{
	// Model helpers
	// ==================================================================
	
	// Note - these functions apply to specific scopes
	// ie: getting "type:this.that.other" would not include anything stored
	// at "type:this.that" or "type:this"   

	// oModel.get
	function getShallow (oSelf, oModel, sScopeChain)
	{
		return (sScopeChain in oModel ? oModel[sScopeChain] : null);
	}

	function getDeep (oSelf, oModel, sScopeChain)
	{
		var sKey,
		    regexp = new RegExp('^' + sScopeChain + '.+'), 
		    aMatchingScopes = [];
		
		for (sKey in oModel)
		{
			
		}
	}

	// oModel.set
	function set (oSelf, oModel, sScopeChain)
	{
		return (oModel[sScopeChain] = sScopeChain in oModel ? oModel[sScopeChain] : []);
	}

	function isSet (oSelf, oModel, sScopeChain)
	{
		return sScopeChain in oModel && 'length' in oModel[sScopeChain];
	}
	
	function isEmpty (oSelf, oModel, sScopeChain)
	{
		return oSelf.isSet(sScopeChain) && oModel[sScopeChain].length === 0;
	}

	function containsItem (oSelf, oModel, sScopeChain, mItem)
	{
		if (oSelf.isSet(sScopeChain))
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

	// oModel.set
	function addItem (oSelf, oModel, sScopeChain, mItem)
	{
		if (oSelf.containsItem(sScopeChain, mItem))
		{
			return false;
		}
		
		if (!oSelf.isSet(sScopeChain))
		{
			oSelf.set(sScopeChain);
		}
		
		oModel[sScopeChain].push(mItem);
	}

	// oModel.removeIfEmpty
	function removeIfEmpty (oSelf, oModel, sScopeChain)
	{
		if (oSelf.isEmpty(sScopeChain))
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



	// Exposed Constructor 
	// ==================================================================
	
	function ScopedEventModel ()
	{
		var oModel = {};

		this.getShallow = curry(getShallow, this, oModel);
		this.getDeep = curry(getDeep, this, oModel);
		this.set = curry(set, this, oModel);
		this.isSet = curry(isSet, this, oModel);
		this.isEmpty = curry(isEmpty, this, oModel);
		this.containsItem = curry(containsItem, this, oModel);
		this.addItem = curry(addItem, this, oModel);
		this.removeIfEmpty = curry(removeIfEmpty, this, oModel);
	}
	
	// return constructor to outer scope
	return ScopedEventModel;
	
})();
