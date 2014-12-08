var acomb = module.exports = {};
var _slice = [].slice;

acomb.constant = function constant(value) {
  return function (callback) {
    return callback(null, value);
  };
};


acomb.asyncify = function asyncify(func) {
  return function (/*args..., callback*/) {
    var callback = _last(arguments),
      args = _initial(arguments);
    try {
      var result = func.apply(this, args);
      callback(null, result);
    } catch (e) {
      callback(e);
    }
  };
};


acomb.flip = function flip(func) {
  return function (cb/*, args..*/ ) {
    var args = _rest(arguments);
    args.push(cb);
    func.apply(this, args);
  };
};


acomb.partialRight = function partialRight(func/*, boundArgs... */) {
  var boundArgs = _rest(arguments);
  return function (/*...args, callback*/) {
    var callback = _last(arguments);
    var newArgs = _initial(arguments).concat(boundArgs).concat([callback]);
    func.apply(this, newArgs);
  };
};

function _last(arr) {
  return arr[arr.length - 1];
}

function _initial(arr) {
  return _slice.call(arr, 0, arr.length - 1);
}

function _rest(arr) {
  return _slice.call(arr, 1);
}
