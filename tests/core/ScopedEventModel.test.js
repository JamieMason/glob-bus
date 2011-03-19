
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
			this.subject.add('evtype:set.using.add', fn);
			assertNotNull(this.subject.get('evtype:set.using.add'));
		},
		"test a value can be set with add and retrieved from a broader scope with get" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:set.using.add', fn);
			assertNotNull(this.subject.get('evtype:set.using.*'));
			assertNotNull(this.subject.get('evtype:set.*'));
			assertNotNull(this.subject.get('evtype:*'));
			assertNotNull(this.subject.get('*'));
		},
		"test getting a specific scope does not include broader scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:set', fn);
			assertNull(this.subject.get('evtype:set.using.*'));
			assertNull(this.subject.get('evtype:set.using'));
		},
		"test getting a specific scope without a wildcard does not include nested scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:set.using.add', fn);
			this.subject.add('evtype:set.using', fn);
			this.subject.add('evtype:set', fn);
			assertEquals(1, this.subject.get('evtype:set').length);
		},
		"test getting a scope with a wildcard includes nested scopes" : 
		function()
		{
			var fn = function(){};
			this.subject.add('evtype:set.using.add', fn);
			this.subject.add('evtype:set.using', fn);
			this.subject.add('evtype:set', fn);
			assertEquals(3, this.subject.get('evtype:set.*').length);
			assertEquals(3, this.subject.get('evtype:*').length);
			assertEquals(3, this.subject.get('*').length);
		}
	});

})();
