
(function()
{

	function setUp ()
	{
		this.subject = new ScopedEventModel();
	}

	function tearDown ()
	{
		this.subject = null;
	}

	TestCase('ScopedEventModel Constructor', {

		"test Constructor returns Object" : 
		function()
		{
			assertObject(new ScopedEventModel());
		}
	});

	TestCase('ScopedEventModel API', {

		setUp : setUp,
		tearDown : tearDown,

		"test instances contain method: get" : 
		function()
		{
			assertFunction(this.subject.get);
		},
		"test instances contain method: contains" : 
		function()
		{
			assertFunction(this.subject.contains);
		},
		"test instances contain method: add" : 
		function()
		{
			assertFunction(this.subject.add);
		},
		"test instances contain method: remove" : 
		function()
		{
			assertFunction(this.subject.remove);
		}
	});


	TestCase('ScopedEventModel add & get', {

		setUp : setUp,
		tearDown : tearDown,

		"test get returns null for an event scope with no bindings" : 
		function()
		{
			assertNull(this.subject.get('evtype:not.yet.set'));
		},
		"test get returns a binding added at the exact same scope" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			assertArray(this.subject.get('evtype:this.that.other'));
		},
		"test bindings to specific broader scopes getting a specific scope does not include broader scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this', fn);
			assertNull(this.subject.get('evtype:this.that.*'));
			assertNull(this.subject.get('evtype:this.that'));
		},
		"test more generic bindings without wildcard scopes are not included when getting an event's observers" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this', fn);
			assertNull(this.subject.get('evtype:this.that'));
		},
		"test more specific bindings without wildcard scopes are not included when getting an event's observers" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that', fn);
			assertNull(this.subject.get('evtype:this'));
		},
		"test more generic bindings with wildcard scopes are included when getting an event's observers" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.*', fn);
			this.subject.add('evtype:this.*', fn);
			this.subject.add('evtype:*', fn);
			this.subject.add('*', fn);
			
			assertEquals(4, this.subject.get('evtype:this.that.other').length);
			assertEquals(4, this.subject.get('evtype:this.that').length);
			assertEquals(3, this.subject.get('evtype:this').length);
		},
		"test more specific bindings with wildcard scopes are not included when getting an event's observers" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other.*', fn);
			this.subject.add('evtype:this.that.*', fn);
			
			assertEquals(2, this.subject.get('evtype:this.that.other').length);
			assertEquals(1, this.subject.get('evtype:this.that').length);
			assertNull(this.subject.get('evtype:this'));
		}
	});


	TestCase('ScopedEventModel remove, add & get', {

		setUp : setUp,
		tearDown : tearDown,

		"test remove does not throw exception when removing an undefined scope" : 
		function()
		{
			var self = this,
			    fn = function(){};
			
			assertNoException(function(){
				self.subject.remove('evtype:not.yet.set', fn);
			});
		},
		"test remove removes a binding found at a specific event scope" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			assertEquals(1, this.subject.get('evtype:this.that.other').length);
			assertSame(fn, this.subject.get('evtype:this.that.other')[0]);
			this.subject.remove('evtype:this.that.other', fn);
			assertNull(this.subject.get('evtype:this.that.other'));
			assertNull(this.subject.get('evtype:this.that.*'));
			assertNull(this.subject.get('evtype:this.*'));
			assertNull(this.subject.get('evtype:*'));
			assertNull(this.subject.get('*'));
		}
	});
	
	TestCase('ScopedEventModel contains', {

		setUp : setUp,
		tearDown : tearDown,

		"test contains returns false for an undefined item" : 
		function()
		{
			var fn = function(){};
			assertFalse(this.subject.contains('evtype:this.that.other', fn));
		},
		"test contains returns true for a defined item" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			assertTrue(this.subject.contains('evtype:this.that.other', fn));
		}
	});

})();
