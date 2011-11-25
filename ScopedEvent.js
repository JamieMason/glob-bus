/*global Array, RegExp, TypeError*/

var scopedEvent = (function()
{
    function curry (fn /*, ... */)
    {
        var aCurryArgs = Array.prototype.slice.call(arguments, 1);

        return function (/* ... */)
        {
            var aCalleeArgs = Array.prototype.slice.call(arguments, 0)
                , aMergedArgs = aCurryArgs.concat(aCalleeArgs);

            return fn.apply(this, aMergedArgs);
        };
    }

    /* ==================================================================================== *\
     * Model used to store Event Listeners
    \* ==================================================================================== */

    // Private

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
        return (oModel[sScopeChain] = oModel.hasOwnProperty(sScopeChain) ? oModel[sScopeChain] : []);
    }

    function isSet (oModel, sScopeChain)
    {
        return oModel.hasOwnProperty(sScopeChain) && oModel[sScopeChain].hasOwnProperty('length');
    }

    function isEmpty (oSelf, oModel, sScopeChain)
    {
        return isSet(oModel, sScopeChain) && oModel[sScopeChain].length === 0;
    }

    function cleanOutEmptyScope (oSelf, oModel, sScopeChain)
    {
        if (isEmpty(oSelf, oModel, sScopeChain))
        {
            delete oModel[sScopeChain];
        }
    }

    // Public
    // ====================================================================================

    function getObserversOf (oSelf, oModel, sTriggeringScope)
    {
        var sBindingScope
            , aMatchingScopeItems = [];

        for (sBindingScope in oModel)
        {
            if (sBindingScope === sTriggeringScope || (containsWildcards(sBindingScope) && scopeContainsOther(sBindingScope, sTriggeringScope)))
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
            var i
                , aItemsAtScope = oModel[sScopeChain]
                , aItemsAtScopeCount = aItemsAtScope.length;

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
        var i;

        if (isSet(oModel, sScopeChain))
        {
            for (i = 0; i < oModel[sScopeChain].length; i++)
            {
                if (oModel[sScopeChain][i] === mItem)
                {
                    return true;
                }
            }
        }

        return false;
    }

    // API
    // ====================================================================================

    function scopedModel ()
    {
        var oModel = {}
            , oApi = {};

        oApi.get = curry(getObserversOf, oApi, oModel);
        oApi.contains = curry(containsItem, oApi, oModel);
        oApi.add = curry(addObserverOf, oApi, oModel);
        oApi.remove = curry(removeItem, oApi, oModel);
        return oApi;
    }

    /* ==================================================================================== *\
     *
    \* ==================================================================================== */

    // convert "checkout:payment.complete" to { type: "checkout", scope: "payment.complete" };
    function stringToEventData (sEventScope)
    {
        var isGranular = sEventScope.indexOf(':') !== -1
            , aEventScope = sEventScope.split(':');

        return isGranular ? {
            type: aEventScope[0]
            , scope: aEventScope[1]
        } : {
            type: sEventScope
            , scope: ''
        };
    }

    // Validate the event scope pattern supplied
    function filterInvalidRequests (fMethod, oSelf, oObservers, sEventScope)
    {
        if (sEventScope !== '*' && sEventScope.search(/^[a-z0-9\-\_]+:(\*|[a-z0-9\-\_]+\.?)+$/i) === -1)
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

    /* ==================================================================================== *\
     * Public Methods
    \* ==================================================================================== */

    function bind (oSelf, oObservers, sEventScope, fHandler)
    {
        // add the new handler to this scope
        oObservers.add(sEventScope, fHandler);
    }

    function unbind (oSelf, oObservers, sEventScope, fHandler)
    {
        var aScopeObservers = oObservers.get(sEventScope)
            , nObservers = aScopeObservers.length
            , i;

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

        var aScopeObservers = oObservers.get(sEventScope)
            , nObservers
            , oEventTypeAndScope = stringToEventData(sEventScope)
            , i;

        // quit if the model returned no matches
        if (aScopeObservers === null)
        {
            return;
        }

        nObservers = aScopeObservers.length;

        // Decorate the event data with the event type and scope
        oEventData.type = oEventTypeAndScope.type;
        oEventData.scope = oEventTypeAndScope.scope;

        // call all handlers at this scope
        for (i = 0; i < nObservers; i++)
        {
            aScopeObservers[i](oEventData);
        }
    }

    // API
    // ==================================================================

    function scopedEvent ()
    {
        var oObservers = scopedModel()
            , oApi = {};

        oApi.bind = curry(filterInvalidRequests, bind, oApi, oObservers);
        oApi.unbind = curry(filterInvalidRequests, unbind, oApi, oObservers);
        oApi.trigger = curry(filterInvalidRequests, trigger, oApi, oObservers);
        return oApi;
    };

    scopedEvent.model = scopedModel;
    return scopedEvent;

}());
