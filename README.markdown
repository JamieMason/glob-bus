With ScopedEvent you can listen to broad types of events or drill down into very specific ones independently. ScopedEvent is targeted more at how classes that make up an application can work together, with a view to avoid the need for private contracts between many observers, each needing to know about each subject they observe. 

The hope is that other, more generic pieces of code should be able to observe these events without needing a reference to the objects or event types involved.

## .trigger( scope:String, data:Object )
This is used to notify any observers of an event which has happened on the page. All functions added with eventProxy.bind within this scope are called in turn, and passed the data object you provide.

## .bind( scope:String, handler:Function )
This is used to add a function which should be called when events of this type and scope occur.

### Basic example flow
This attempts to use a simple scenario to demonstrate the advantages of listening to generic forms of events. Demos to be added ASAP - but for the purpose of a broad example;

App Controller

	myApp.event = new ScopedEvent();

UI Controller

	// Bind UI/DOM events however you normally prefer
	$('form.login').submit(function (e) {
		
		// ...do stuff
		
		myApp.event.trigger('ui:login.submit', function (oData) {
			username: $(this).find('input.username').val(),
			password: $(this).find('input.password').val()
		});
		
		// ...do stuff
		
		e.preventDefault();
	});

myApp.customer

	// if some UI component (we don't care which) submits a login
	myApp.event.bind('ui:login.submit', function (oData) {
		self.login(oData.username, oData.password);
	});

myApp.usage

	// log all UI events to analyse user behaviour
	myApp.event.bind('ui:*', function (oData) {
		self.record(oData.scope, oData.log);
	});

UI Controller

	// When the app's login state changes
	myApp.event.bind('customer:auth', function (oData) {
		// toggle display of login forms for example
		(myApp.customer.isLoggedIn() ? $('form.login').hide() : $('form.login').show());
	});

myApp.customer

	this.login = function (username, password) {
		
		// ...do stuff
		
		myApp.event.trigger('customer:auth.login', function (oData) {
			username: 'GThreepwood',
			log: 'Customer GThreepwood is logged in'
		});
	};

## Event types and scopes (eventType:followed.by.scope.chain)
All bindings and triggers should include the name of the custom event type, followed by a chain defining how broad or specific the scope is.

### Event scopes
Event scopes work exactly like a tree structure, when an event is triggered - all observers deeply nested at or within that branch are notified of the event.

### Event types
Event types should be very generic, with the specificity handled by the scope chain. The job of the event types is to deal with general categories of events.

#### Examples of generic code which would only be concerned with event types at global scope;
1. A customer service observer could inspect error events to redraw parts of the UI with appropriate help content, or launch pro-active chat if necessary.
2. Get detailed usage data by adding an observer which tracks log, error and other events.
3. Loggers can be added during development to monitor activity in the application.
4. Multiple components could send and handle their own AJAX requests at specific scopes while another piece of code observes all ajax events of any kind, to display a spinner in the corner of the screen for example. Whenever some new AJAX component is added, the spinner component doesn't need to be updated.
