# acomb  [![Build Status via Travis CI](https://travis-ci.org/aearly/acomb.svg)](https://travis-ci.org/aearly/acomb) [![NPM version](http://img.shields.io/npm/v/acomb.svg)](https://www.npmjs.org/package/acomb)

Higher-order utilities for use with async functions.

Designed for use with [async](https://github.com/caolan/async).  Allows you to write async code in a more point-free style.

## API

* [constant](#constant)
* [asyncify](#asyncify)
* [flip](#flip)
* [partialRight](#partialRight)

<a name="constant">
### constant(value)

Returns a function that calls-back with the value provided.  Useful in waterfalls.

```js
async.waterfall([
  acomb.constant(42),
  function (value, next) {
    // value === 42
  },
  //...
], callback)
```


<a name="asyncify">
### asyncify(func)

Take a sync function and make it async.  Useful for plugging sync functions into a waterfall or series.  Will catch errors and pass them to the callback.

```js
async.waterfall([
  loadText,
  acomb.asyncify(JSON.parse),
  function (data, next) {
    // data is the result of parsing the text.
    // If there was a parsing error, it would have been caught.
  }
], callback)
```


<a name="flip">
### flip(function)

Take a function and move the last argument to the front.  Useful for plugging "normal" async functions into `async.auto`.

```js
function getUrl(options, callback) {
  // ....
}

async.auto({
  url: acomb.constant("http://foo.com")
  data: ["url", acomb.flip(getUrl)],
  //...
}, callback)
```



<a name="partialRight">
### partialRight(func, args...)

Like `_.partialRight`, except it leaves space for a callback at the end.  Useful for getting args in the right order when passing functions to async functions.

```js
async.map(
  filenames,
  acomb.partialRight(fs.readFile, "utf8"),
  function (err, files) {
    // files is an array of strings, rather than buffers
  });
```


<a name="spreadOptions">
### spreadOptions(func, option1, option2, ...)

Takes a function of the form `function(object, callback) {}`  and converts it to the form `function(option1, option2, ... callback) {}` based on the strings passed.  Useful in `async.auto` in conjunction with `flip`.

```js
function doFoo(bar baz, callback) {
  // ....
}

async.auto({
  bar: getBar,
  baz: getBaz
  foo: ["bar", "baz", acomb.flip(acomb.spreadOptions(doFoo, "bar", "baz"))],
  //...
}, callback)
```


<a name="before">
### before(func, asyncFunc)

Run a synchronous function before an async function.  The synchronous function will be called with the aguments passed (without the callback), and the async function will be called with the return value of the sync function.

```js
function trim (str) { return str.trim(); }

async.waterfall([
  getMessyInput,
  acomb.before(trim, function parseData(str, next) {
    // `str` has its whitespace trimmed
    //...
  }),
  //...
], callback)

```

<a name="after">
### before(asyncFunc, func)

Run a synchronous function after an async function, with the results of the async function as arguments. The return value of the sync function will be passed to the original callback.

```js
var getTheDataIWant = acomb.after(getData, function (data) {
  return _.pick(data, ["foo", "bar", "baz"])
});
```

*note: If you want to run an async function before or after another,  just use `async.seq` or `async.compose`*



## License

MIT
