/*global Array, RegExp, TypeError*/

var scopedEvent = (function()
{
    var rWildcards = /[\.:]?\*/
        , rRegExpCharacters = /([\.\]\[\-\}\{\?\+\*])/g;

    /* ==================================================================================== *\
     * Model used to store Event Listeners
    \* ==================================================================================== */

    function scopeContainsOther (sBindingScope, sTriggeringScope)
    {
        return sBindingScope === '*' || sTriggeringScope.search(new RegExp('^' + sBindingScope.replace(rWildcards, '').replace(rRegExpCharacters, '\\$1') + '(\\.|:|$)')) !== -1;
    }

    function isSet (oModel, sScope)
    {
        return oModel[sScope] !== void(0);
    }

    function scopeEach (oScopes, sScope, iterator)
    {
        var i
            , aHandlers = oScopes[sScope]
            , nCount = aHandlers.length

        for (i = 0; i < nCount; i++)
        {
            iterator(aHandlers[i], i, aHandlers);
        }
    }

    function scopeModelEach (sScope, iterator)
    {
        return scopeEach(this.data, sScope, iterator);
    }

    function scopeEventEach (sScope, iterator)
    {
        return scopeEach(this.model, sScope, iterator);
    }

    // API
    // ====================================================================================

    function ScopedModel ()
    {
        this.data = {};
    }

    ScopedModel.prototype = {
        add: function (sScope, handler)
        {
            if (!this.contains(sScope, handler))
            {
                var oModel = this.data;

                if (!isSet(oModel, sScope))
                {
                    oModel[sScope] = [];
                }

                oModel[sScope].push(handler);
            }
        }
        , remove: function (sScope, handler)
        {
            var i
                , oModel = this.data
                , aListeners = oModel[sScope]
                , nCount;

            if (isSet(oModel, sScope))
            {
                nCount = aListeners.length;

                if (nCount === 1)
                {
                    delete oModel[sScope];
                }
                else
                {
                    for (i = 0; i < nCount; i++)
                    {
                        if (aListeners[i] === handler)
                        {
                            aListeners.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        }
        , get: function (sTriggeringScope)
        {
            var sBindingScope
                , oModel = this.data
                , aMatchingScopeItems = [];

            for (sBindingScope in oModel)
            {
                if (sBindingScope === sTriggeringScope || (sBindingScope.indexOf('*') !== -1 && scopeContainsOther(sBindingScope, sTriggeringScope)))
                {
                    aMatchingScopeItems = aMatchingScopeItems.concat(oModel[sBindingScope]);
                }
            }
            return (aMatchingScopeItems.length > 0 ? aMatchingScopeItems : null);
        }
        , contains: function (sScope, handler)
        {
            var i
                , oModel = this.data;

            if (isSet(oModel, sScope))
            {
                for (i = 0; i < oModel[sScope].length; i++)
                {
                    if (oModel[sScope][i] === handler)
                    {
                        return true;
                    }
                }
            }

            return false;
        }
    };

    /* ==================================================================================== *\
     *
    \* ==================================================================================== */

    // convert "checkout:payment.complete" to { type: "checkout", scope: "payment.complete" };
    function parseScope (sEventScope)
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
    function scopeIsValid (sEventScope)
    {
        if (sEventScope !== '*' && sEventScope.search(/^[a-z0-9\-\_]+:(\*|[a-z0-9\-\_]+\.?)+$/i) === -1)
        {
            throw new TypeError('[scopedEvent] "' + sEventScope + '" is an invalid binding');
        }
        return true;
    }

    // API
    // ==================================================================

    function ScopedEvent ()
    {
        this.model = new ScopedModel();
    }

    ScopedEvent.prototype = {
        bind: function (sEventScope, handler)
        {
            if (scopeIsValid(sEventScope))
            {
                this.model.add(sEventScope, handler);
            }
        }
        , unbind: function (sEventScope, handler)
        {
            if (scopeIsValid(sEventScope))
            {
                var aScopeObservers = this.model.get(sEventScope)
                    , nObservers
                    , i;

                if (aScopeObservers && (nObservers = aScopeObservers.length))
                {
                    for (i = 0; i < nObservers; i++)
                    {
                        if (handler === aScopeObservers[i])
                        {
                            aScopeObservers.slice(i, 1);
                            return;
                        }
                    }
                }
            }
        }
        , trigger: function (sEventScope, oData)
        {
            var aScopeObservers
                , nObservers
                , oBinding
                , i;

            if (scopeIsValid(sEventScope) && (aScopeObservers = this.model.get(sEventScope)))
            {
                oData = oData || {};
                oBinding = parseScope(sEventScope);
                oData.type = oBinding.type;
                oData.scope = oBinding.scope;
                nObservers = aScopeObservers.length;

                for (i = 0; i < nObservers; i++)
                {
                    aScopeObservers[i](oData);
                }
            }
        }
    };

    return function ()
    {
        return new ScopedEvent();
    };

}());
