
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
    });

    describe("bind & trigger methods", function ()
    {
        it("calls the listener when an event is triggered at the same scope", function ()
        {
            var flag = false;
            oInstance.bind('evtype:this.that.other', function () { flag = true; });
            oInstance.trigger('evtype:this.that.other');
            expect(flag).toBeTrue();
        });

        it("calls the listener when an event is triggered at an enclosing scope", function ()
        {
            var flag = false;
            oInstance.bind('evtype:this.that.*', function () { flag = true; });
            oInstance.trigger('evtype:this.that.other');
            expect(flag).toBeTrue();
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
    });

}());
