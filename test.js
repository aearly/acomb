var a = require("./"),
  assert = require("better-assert");

describe("acomb", function () {

  describe("constant", function () {
    it("should work", function (done) {
      var f = a.constant(42);
      f(function (err, value) {
        assert(!err);
        assert(value === 42);
        done();
      });
    });
  });

  describe("asyncify", function () {
    it("should asyncify a function", function (done) {
      var parse = a.asyncify(JSON.parse);
      parse("{\"a\":1}", function (err, result) {
        assert(!err);
        assert(result.a === 1);
        done();
      });
    });

    it("should pass variable numbers of arguments", function () {
      a.asyncify(function (x, y, z) {
        assert(arguments.length === 3);
        assert(x === 1);
        assert(y === 2);
        assert(z === 3);
      })(1, 2, 3, function () {});
    });

    it("should catch errors", function (done) {
      a.asyncify(function () { throw new Error("foo"); })(function (err) {
        assert(err);
        assert(err.message === "foo");
        done();
      });
    });
  });

});
