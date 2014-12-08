# acomb

Higher-order utilities for use with async functions.

Designed for use with [async](https://github.com/caolan/async).  Allows you to write async code in a more point-free style.

## API

* [constant](#constant)
* [asyncify](#asyncify)

### constant(value)

Returns a function that calls-back with the value provided.  Useful in waterfalls.

```
async.waterfall([
  acomb.constant(42),
  function (value, next) {
    // value === 42
  },
  //...
], callback)
```


### asyncify(func)

Take a sync function and make it async.  Useful for plugging sync functions into a waterfall or series.  Will catch errors and pass them to the callback.

```
async.waterfall([
  loadText,
  acomb.asyncify(JSON.parse),
  function (data, next) {
    // data is the result of parsing the text.
    // If there was a parsing error, it would have been caught.
  }
], callback)
```
