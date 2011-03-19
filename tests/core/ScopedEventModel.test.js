
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

		"test get returns null for an undefined scope" : 
		function()
		{
			assertNull(this.subject.get('evtype:not.yet.set'));
		},
		"test a value can be set with add and retrieved directly with get" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			assertNotNull(this.subject.get('evtype:this.that.other'));
		},
		"test a value can be set with add and retrieved from a broader scope with get" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			assertNotNull(this.subject.get('evtype:this.that.*'));
			assertNotNull(this.subject.get('evtype:this.*'));
			assertNotNull(this.subject.get('evtype:*'));
			assertNotNull(this.subject.get('*'));
		},
		"test getting a specific scope does not include broader scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this', fn);
			assertNull(this.subject.get('evtype:this.that.*'));
			assertNull(this.subject.get('evtype:this.that'));
		},
		"test getting a specific scope without a wildcard does not include nested scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			this.subject.add('evtype:this.that', fn);
			this.subject.add('evtype:this', fn);
			assertEquals(1, this.subject.get('evtype:this').length);
			assertSame(fn, this.subject.get('evtype:this')[0]);
		},
		"test getting a scope with a wildcard includes nested scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:this.that.other', fn);
			this.subject.add('evtype:this.that', fn);
			this.subject.add('evtype:this', fn);
			assertEquals(3, this.subject.get('evtype:this.*').length);
			assertEquals(3, this.subject.get('evtype:*').length);
			assertEquals(3, this.subject.get('*').length);
			assertSame(fn, this.subject.get('*')[0]);
			assertSame(fn, this.subject.get('*')[1]);
			assertSame(fn, this.subject.get('*')[2]);
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
		"test remove removes a defined scope" : 
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
