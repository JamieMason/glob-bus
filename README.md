# ScopedEvent

A hierarchical pub/sub event manager with namespace wildcard support.

## Usage

    var eventManager = scopedEvent();

    eventManager.bind('evtype:this.that.other', function(){
      console.log('Handler for evtype:this.that.other fires, is passed:', arguments);
    });

    eventManager.bind('evtype:this.that.*', function(){
      console.log('Handler for evtype:this.that.* fires, is passed:', arguments);
    });

    eventManager.bind('evtype:this.*', function(){
      console.log('Handler for evtype:this.* fires, is passed:', arguments);
    });

    eventManager.bind('evtype:*', function(){
      console.log('Handler for evtype:* fires, is passed:', arguments);
    });

    eventManager.bind('*', function(){
      console.log('Handler for * fires, is passed:', arguments);
    });

    eventManager.trigger('evtype:this.that.other', {
      someData: 'xxxx'
    });

## Run Tests

    $ testacular start
