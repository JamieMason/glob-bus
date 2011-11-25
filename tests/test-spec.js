/*global beforeEach, afterEach, describe, it, expect, scopedEvent*/

/* ==================================================================================== *\
 * scopedEvent
\* ==================================================================================== */

(function()
{
    var oInstance = null;

    beforeEach(function ()
    {
        oInstance = scopedEvent();
    });

    afterEach(function ()
    {
        oInstance = null;
    });

    describe("scopedEvent", function ()
    {
        it("returns an Object", function ()
        {
            expect(oInstance).toBeObject();
        });

        it("has 3 methods: bind, unbind & trigger", function ()
        {
            expect(oInstance.bind).toBeFunction();
            expect(oInstance.unbind).toBeFunction();
            expect(oInstance.trigger).toBeFunction();
        });

        /* ==================================================================================== *\
         * bind
        \* ==================================================================================== */

        describe("bind", function ()
        {
            it("discourages having multiple similar event names with any relationships between them not being discernable to the app", function ()
            {
                expect(function ()
                {
                    oInstance.bind('userBalanceChange', function(){});
                }).toThrowError();
            });

            it("encourages structuring and conceptually grouping events", function ()
            {
                var aBindings = ['user:auth', 'user:auth.login', 'user:auth.fail', 'user:auth.logout', 'user:auth.expire']
                    , arrLength = aBindings.length
                    , i;

                for (i = 0; i < arrLength; i++)
                {
                    expect(function ()
                    {
                        oInstance.bind(aBindings[i], function(){});
                    }).not.toThrowError();
                }
            });

            it("allows you to bind listeners to respond to all events of a broader type", function ()
            {
                var aBindings = ['*', 'user:*', 'user:auth.*']
                    , arrLength = aBindings.length
                    , i;

                for (i = 0; i < arrLength; i++)
                {
                    expect(function ()
                    {
                        oInstance.bind(aBindings[i], function(){});
                    }).not.toThrowError();
                }
            });
        });

        /* ==================================================================================== *\
         * trigger
        \* ==================================================================================== */

        describe("trigger", function ()
        {
            it("calls all listeners bound to the same event type & scope", function ()
            {
                var callCount = 0;
                oInstance.bind('evtype:this.that.other', function () { callCount++; });
                oInstance.trigger('evtype:this.that.other');
                expect(callCount).toEqual(1);
            });

            it("calls all listeners when an event is triggered at an enclosing scope", function ()
            {
                var callCount = 0;
                oInstance.bind('evtype:this.that.*', function () { callCount++; });
                oInstance.bind('evtype:this.*', function () { callCount++; });
                oInstance.bind('evtype:*', function () { callCount++; });
                oInstance.bind('*', function () { callCount++; });
                oInstance.trigger('evtype:this.that.other');
                expect(callCount).toEqual(4);
            });

            it("ignores attempts to deeply trigger every listener bound below a higher level type (it doesn't make sense)", function ()
            {
                var callCount = 0;
                oInstance.bind('evtype:this', function () { callCount++; });
                oInstance.trigger('evtype:*');
                oInstance.trigger('*');
                expect(callCount).toEqual(0);
            });
        });
    });

}());

/* ==================================================================================== *\
 * scopedModel
\* ==================================================================================== */

(function ()
{
    var oInstance = null;

    beforeEach(function ()
    {
        oInstance = scopedEvent.model();
    });

    afterEach(function ()
    {
        oInstance = null;
    });

    describe("scopedModel", function ()
    {
        it("returns an Object", function ()
        {
            expect(oInstance).toBeObject();
        });

        it("has 4 methods: add, remove, get & contains", function ()
        {
            expect(oInstance.add).toBeFunction();
            expect(oInstance.remove).toBeFunction();
            expect(oInstance.get).toBeFunction();
            expect(oInstance.contains).toBeFunction();
        });

        /* ==================================================================================== *\
         * get
        \* ==================================================================================== */

        describe("get", function ()
        {
            it("returns null if no listeners are bound to the supplied scope", function ()
            {
                expect(oInstance.get('sometype:notset.*')).toBeNull();
                expect(oInstance.get('sometype:notset')).toBeNull();
                expect(oInstance.get('sometype:*')).toBeNull();
                expect(oInstance.get('*')).toBeNull();
            });

            it("returns an Array of all listeners bound to a single scope, when passing a single scope", function ()
            {
                function handler (){}
                oInstance.add('sometype:this.that.other', handler);
                var aResult = oInstance.get('sometype:this.that.other');
                expect(aResult).toBeArray();
                expect(aResult[0]).toBe(handler);
            });

            it("does not return listeners bound to broader scopes, when passing a single scope", function ()
            {
                function handler (){}
                function otherHandler (){}
                oInstance.add('sometype:this', otherHandler);
                oInstance.add('sometype:this.that', handler);
                var aResult = oInstance.get('sometype:this.that');
                expect(aResult).toBeArray();
                expect(aResult[0]).toBe(handler);
            });

            it("does not return listeners bound to narrower scopes, when passing a single scope", function ()
            {
                function handler (){}
                function otherHandler (){}
                oInstance.add('sometype:this', handler);
                oInstance.add('sometype:this.that', otherHandler);
                var aResult = oInstance.get('sometype:this');
                expect(aResult).toBeArray();
                expect(aResult[0]).toBe(handler);
            });

            it("returns an Array including listeners bound with wildcard capturing scopes that enclose the passed scope", function ()
            {
                function handler (){}
                oInstance.add('sometype:this.that.*', handler);
                oInstance.add('sometype:this.*', handler);
                oInstance.add('sometype:*', handler);
                oInstance.add('*', handler);

                expect(oInstance.get('sometype:this.that.other')).toBeArrayOfSize(4);
                expect(oInstance.get('sometype:this.that')).toBeArrayOfSize(4);
                expect(oInstance.get('sometype:this')).toBeArrayOfSize(3);
            });

            it("returns an Array not including listeners bound with wildcard capturing scopes beneath the passed scope", function ()
            {
                function handler (){}
                oInstance.add('sometype:this.that.other.*', handler);
                oInstance.add('sometype:this.that.*', handler);

                expect(oInstance.get('sometype:this.that.other')).toBeArrayOfSize(2);
                expect(oInstance.get('sometype:this.that')).toBeArrayOfSize(1);
                expect(oInstance.get('sometype:this')).toBeNull();
            });
        });

        /* ==================================================================================== *\
         * remove
        \* ==================================================================================== */

        describe("remove", function ()
        {
            it("ignores requests to remove listeners bound to a scope when there are none", function ()
            {
                expect(function ()
                {
                    oInstance.remove('sometype:not.yet.set');
                }).not.toThrowError();
            });

            it("removes listeners bound at a specific scope", function ()
            {
                function handler (){}
                oInstance.add('sometype:this.that.other', handler);
                oInstance.remove('sometype:this.that.other', handler);
                expect(oInstance.get('sometype:this.that.other')).toBeNull();
                expect(oInstance.get('sometype:this.that.*')).toBeNull();
                expect(oInstance.get('sometype:this.*')).toBeNull();
                expect(oInstance.get('sometype:*')).toBeNull();
                expect(oInstance.get('*')).toBeNull();
            });
        });

        /* ==================================================================================== *\
         * contains
        \* ==================================================================================== */

        describe("contains", function ()
        {
            it("returns false if the provided function is not bound at the supplied scope", function ()
            {
                expect(oInstance.contains('sometype:this.that.other', function (){})).toBeFalse();
            });

            it("returns true if the provided function is bound at the supplied scope", function ()
            {
                function handler (){}
                oInstance.add('sometype:this.that.other', handler);
                expect(oInstance.contains('sometype:this.that.other', handler)).toBeTrue();
            });
        });
    });
}());
