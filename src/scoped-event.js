var scopedEvent = (function() {

  var rWildcards = /[\.:]?\*/;
  var rRegExpCharacters = /([\.\]\[\-\}\{\?\+\*])/g;

  /* ==================================================================================== *\
   * Model used to store Event Listeners
  \* ==================================================================================== */

  function scopeContainsOther(sListenerScope, sScope) {
    return sListenerScope === '*' || sScope.search(new RegExp('^' + sListenerScope.replace(rWildcards, '').replace(rRegExpCharacters, '\\$1') + '(\\.|:|$)')) !== -1;
  }

  function isSet(oModel, sScope) {
    return oModel[sScope] !== void(0);
  }

  function each(arr, iterator) {
    arr = arr || [];

    var i;
    var nCount = arr.length;
    var returnValue;

    for(i = 0; i < nCount; i++) {
      returnValue = iterator(arr[i], i, arr, nCount);

      if(typeof returnValue === 'boolean') {
        return returnValue;
      }
    }
  }

  // API
  // ====================================================================================

  function ScopedModel() {
    this.data = {};
  }

  ScopedModel.prototype = {
    each: function(sScope, iterator) {
      return each(this.data[sScope], iterator);
    },
    add: function(sScope, handler) {
      var oSelf = this,
        oModel = oSelf.data;

      if(!oSelf.contains(sScope, handler)) {
        if(!isSet(oModel, sScope)) {
          oModel[sScope] = [];
        }

        oModel[sScope].push(handler);
      }
    },
    remove: function(sScope, handler) {
      var oSelf = this,
        oModel = oSelf.data;

      if(isSet(oModel, sScope)) {
        oModel[sScope].length === 1 ? delete oModel[sScope] : oSelf.each(sScope, function(el, ix, arr, count) {
          if(el === handler) {
            arr.splice(ix, 1);
            return false;
          }
        });
      }
    },
    get: function(sScope) {
      var oSelf = this,
        sListenerScope, oModel = oSelf.data,
        aMatchingScopeItems = [];

      for(sListenerScope in oModel) {
        if(sListenerScope === sScope || (sListenerScope.indexOf('*') !== -1 && scopeContainsOther(sListenerScope, sScope))) {
          aMatchingScopeItems = aMatchingScopeItems.concat(oModel[sListenerScope]);
        }
      }
      return aMatchingScopeItems.length > 0 ? aMatchingScopeItems : null;
    },
    contains: function(sScope, handler) {
      return isSet(this.data, sScope) && (this.each(sScope, function(el) {
        if(el === handler) {
          return true;
        }
      }) || false);
    }
  };

  // convert "checkout:payment.complete" to { type: "checkout", scope: "payment.complete" };
  function parseScope(sScope) {
    var isGranular = sScope.indexOf(':') !== -1,
      aEventScope = sScope.split(':');

    return isGranular ? {
      type: aEventScope[0],
      scope: aEventScope[1]
    } : {
      type: sScope,
      scope: ''
    };
  }

  function scopeIsValid(sScope) {
    if(sScope !== '*' && sScope.search(/^[a-z0-9\-\_]+:(\*|[a-z0-9\-\_]+\.?)+$/i) === -1) {
      throw new TypeError('[scopedEvent] "' + sScope + '" is an invalid binding');
    }
    return true;
  }

  // API
  // ==================================================================

  function ScopedEvent() {
    this.model = new ScopedModel();
  }

  ScopedEvent.prototype = {
    bind: function(sScope, handler, oThis) {
      if(scopeIsValid(sScope)) {
        this.model.add(sScope, oThis ?
        function(oData) {
          handler.apply(oThis, [oData]);
        } : handler);
      }
    },
    unbind: function(sScope, handler) {
      if(scopeIsValid(sScope)) {
        each(this.model.get(sScope), function(el, ix, list) {
          if(handler === el) {
            list.slice(ix, 1);
            return true;
          }
        });
      }
    },
    trigger: function(sScope, oData) {
      if(scopeIsValid(sScope)) {
        each(this.model.get(sScope), function(el) {
          el(oData || {}, parseScope(sScope));
        });
      }
    }
  };

  return function() {
    return new ScopedEvent();
  };

}());
