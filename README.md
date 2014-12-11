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


## License

MIT
