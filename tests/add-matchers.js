/*global beforeEach*/

beforeEach(function ()
{
    this.addMatchers({
        toBeObject: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object Object]";
        }
        , toBeEqualObject: function (oExpected)
        {
            var sKey;

            if (Object.prototype.toString.call(this.actual) !== "[object Object]")
            {
                return false;
            }
            for (sKey in this.actual)
            {
                if (oExpected[sKey] !== this.actual[sKey])
                {
                    return false;
                }
            }
        }
        , toBeArray: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object Array]";
        }
        , toBeArrayOfSize: function (nExpected)
        {
            return Object.prototype.toString.call(this.actual) === "[object Array]" && this.actual.length === nExpected;
        }
        , toBeString: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object String]";
        }
        , toBeBoolean: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object Boolean]";
        }
        , toBeTrue: function ()
        {
            return this.actual === true;
        }
        , toBeFalse: function ()
        {
            return this.actual === false;
        }
        , toBeTruthyString: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object String]" && this.actual.length > 0;
        }
        , toBeNumber: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object Number]";
        }
        , toBeFunction: function ()
        {
            return Object.prototype.toString.call(this.actual) === "[object Function]";
        }
        , toThrowError: function ()
        {
            var threwError = false;
            try
            {
                this.actual();
            }
            catch (e)
            {
                threwError = true;
            }
            return threwError;
        }
        , toThrowErrorOfType: function (sErrorConstructor)
        {
            var threwErrorOfType = false;
            try
            {
                this.actual();
            }
            catch (e)
            {
                threwErrorOfType = (e.name === sErrorConstructor);
            }
            return threwErrorOfType;
        }
    });
});
