# ScopedEvent
ScopedEvent isn't about DOM event handling and it isn't namespacing either, with ScopedEvent you can listen to broad types of events or drill down into very specific ones independently. ScopedEvent is targeted more at how classes that make up an application can work together, with a view to avoid the need for private contracts between many observers, each needing to know about each subject they observe. 

The hope is that other, more generic pieces of code should be able to observe these events without needing a reference to the objects or event types involved.

## scopedEventInstance.trigger( scope:String, data:Object )
This is used to notify any observers of an event which has happened on the page. All functions added with eventProxy.bind within this scope are called in turn, and passed the data object you provide.

## scopedEventInstance.bind( scope:String, handler:Function )
This is used to add a function which should be called when events of this type and scope occur.

### Redraw some display element in response to a click
This isn't the best example as DOM event binding isn't really what ScopedEvent is about, but this is to demonstrate I've tried to keep the syntax as close as possible to the equivalent in jQuery.

#### Binding with jQuery
	$('.betslip-login-open').bind('click', function(e, data) {
		$('form.betslip-login').show();
	});

#### Binding with ScopedEvent
	scopedEventInstance.bind('ui:betslip.login.open', function (e, data) {
		$('form.betslip-login').show();
	});

In the case of triggering in reponse to a user click, it's something of an additional step at the moment to then trigger our custom event it amounts to (although the same would be true with jQuery and a global subject), I'll look into if some helper function is possible to make this cleaner.

	$('.betslip-login-open').click(function() {
		eventProxy.trigger('ui:betslip.login.open', {
			msg : 'Opens Login form on Bet Slip',
			element : this
		});
	});

## Event types and scopes (eventType:followed.by.scope.chain)
All bindings and triggers should include the name of the custom event type, followed by a chain defining how broad or specific the scope is.

### Event scopes
Event scopes work exactly like a tree structure, when an event is triggered - all observers deeply nested at or within that branch are notified of the event.

### Event types
Event types should be very generic, with the specificity handled by the scope chain. The job of the event types is to deal with general categories of events.

#### Examples of generic code which would only be concerned with event types at global scope;
1. A customer service observer could inspect error events to redraw parts of the UI with appropriate help content, or launch pro-active chat if necessary.
2. We can get extremely detailed usage data by adding an observer which notifies Tealeaf of UI events, errors and other events.
3. Loggers can be added during development to monitor activity in the application.
4. Multiple components could send and handle their own AJAX requests at specific scopes while another piece of code observes all ajax events of any kind, to display a spinner in the corner of the screen for example. Whenever some new AJAX component is added, the spinner component doesn't need to be updated.
