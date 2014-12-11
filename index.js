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

acomb.spreadOptions = function spreadOptions(func, option1/*, option2...*/) {
  var options;
  if (Array.isArray(option1)) {
    options = option1;
  } else {
    options = _rest(arguments);
  }
  return function (obj, callback) {
    var newArgs = options.reduce(function(acc, key) {
      acc.push(obj[key]);
      return acc;
    }, []);
    newArgs.push(callback);
    func.apply(this, newArgs);
  };
};

acomb.before = function before(func, asyncBody) {
  return function (/* args..., callback */) {
    var args = _initial(arguments);
    var callback = _last(arguments);
    var result;
    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    asyncBody.call(this, result, callback);
  };
};

acomb.after = function after(asyncBody, func) {
  return function (/* args..., callback */) {
    var args = _initial(arguments);
    var callback = _last(arguments);
    args.push(function newCb(err/*, results...*/) {
      if (err) { return callback(err); }
      var results = _rest(arguments);
      var result;
      try {
        result = func.apply(null, results);
      } catch (e) {
        return callback(e);
      }
      callback(null, result);
    });
    asyncBody.apply(this, args);
  };
};

acomb.provided = function provided(predicate, func) {
  return function (/*args..., callback*/) {
    var args = _initial(arguments);
    var callback = _last(arguments);
    var result;
    try {
      result = predicate.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    if (result) {
      return func.apply(this, arguments);
    } else {
      callback.apply(null, [null].concat(args));
    }
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
