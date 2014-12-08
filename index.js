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
    var args = _slice.call(arguments, 1);
    args.push(cb);
    func.apply(this, args);
  };
};


function _last(arr) {
  return arr[arr.length - 1];
}

function _initial(arr) {
  return _slice.call(arr, 0, arr.length - 1);
}
