
(function()
{
	function setUp ()
	{
		this.subject = new ScopedEvent();
	}

	function tearDown ()
	{
		this.subject = null;
	}

	TestCase('ScopedEvent Constructor', {

		"test Constructor returns Object" : 
		function()
		{
			assertObject(new ScopedEvent());
		}
	});

	TestCase('ScopedEvent API', {

		setUp : setUp,
		tearDown : tearDown,

		"test instances contain method: bind" : 
		function()
		{
			assertFunction(this.subject.bind);
		},
		"test instances contain method: unbind" : 
		function()
		{
			assertFunction(this.subject.unbind);
		},
		"test instances contain method: trigger" : 
		function()
		{
			assertFunction(this.subject.trigger);
		}
	});

	TestCase('ScopedEvent API', {

		setUp : setUp,
		tearDown : tearDown,

		"test instances contain method: bind" : 
		function()
		{
			assertFunction(this.subject.bind);
		},
		"test instances contain method: unbind" : 
		function()
		{
			assertFunction(this.subject.unbind);
		},
		"test instances contain method: trigger" : 
		function()
		{
			assertFunction(this.subject.trigger);
		}
	});

	TestCase('ScopedEvent bind and trigger', {

		setUp : setUp,
		tearDown : tearDown,

		"test functions can be bound and triggered" : 
		function()
		{
			var bFnWasCalled = false;
			
			this.subject.bind('evtype:this.that.other', 
				function ()
				{
					bFnWasCalled = true;
				});
			
			this.subject.trigger('evtype:this.that.other');
			
			assertTrue(bFnWasCalled);
		}
	});

})();
