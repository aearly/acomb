

var acomb = module.exports = {};

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

function _last(arr) {
  return arr[arr.length - 1];
}

function _initial(arr) {
  return [].slice.call(arr, 0, arr.length - 1);
}
