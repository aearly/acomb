var a = require("./");
var assert = require("better-assert");
var noop = function () {};


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
    })(1, 2, 3, noop);
  });

  it("should catch errors", function (done) {
    a.asyncify(function () {
      throw new Error("foo");
    })(function (err) {
      assert(err);
      assert(err.message === "foo");
      done();
    });
  });
});


describe("flip", function () {
  it("should flip arguments", function (done) {
    a.flip(function(x, y, z, cb) {
      assert(x === 1);
      assert(y === 2);
      assert(z === 3);
      assert(typeof cb === "function");
      assert(arguments.length === 4);
      done();
    })(noop, 1, 2, 3);
  });
});

describe("partialRight", function () {
  it("should apply partially from the right", function (done) {
    a.partialRight(function (x, y, z, w, cb) {
      assert(x === 1);
      assert(y === 2);
      assert(z === 3);
      assert(w === 4);
      assert(typeof cb === "function");
      assert(arguments.length === 5);
      done();
    }, 3, 4)(1, 2, noop);
  });
});

describe("spreadOptions", function () {
  it("should spread options", function () {
    a.spreadOptions(function (x, y, cb) {
      assert(x === 1);
      assert(y === 2);
      assert(typeof cb === "function");
    }, "x", "y")({x: 1, y: 2}, noop);
  });

  it("should also work with an array arg", function () {
    a.spreadOptions(function (x, y, cb) {
      assert(x === 1);
      assert(y === 2);
      assert(typeof cb === "function");
    }, ["x", "y"])({x: 1, y: 2}, noop);
  });

  it("should work in conjunction with flip", function () {
    a.flip(a.spreadOptions(function (x, y, cb) {
      assert(x === 1);
      assert(y === 2);
      assert(typeof cb === "function");
    }, ["x", "y"]))(noop, {x: 1, y: 2});
  });
});

describe("before", function () {
  function add2(x) { return x + 2; }

  it("should run a function before another", function (done) {
    var f = a.before(add2, function (y, callback) {
      callback(null, y);
    });
    f(1, function (err, result) {
      assert(result === 3);
      done();
    });
  });

  it("should catch errors in the before function", function (done) {
    a.before(function () {
      throw new Error("foo");
    }, noop)("asdf", function (err) {
      assert(err.message === "foo");
      done();
    });
  });
});

describe("after", function () {

  function mul(x, y) { return x * y; }

  it("should run a function after", function (done) {
    var f = a.after(function(cb) { return cb(null, 4, 5); }, mul);
    f(function (err, result) {
      assert(result === 20);
      done();
    });
  });

  it("should catch errors in the after function", function (done) {
    a.after(
      function (arg, cb) { return cb(null, arg); },
      function () {
        throw new Error("foo");
      })("asdf", function (err) {
        assert(err.message === "foo");
        done();
      });
  });
  it("should catch errors in the async function", function (done) {
    a.after(
      function (arg, cb) { return cb(new Error("foo")); },
      noop)("asdf", function (err) {
        assert(err.message === "foo");
        done();
      });
  });
});
