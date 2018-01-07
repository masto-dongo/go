#  CONNECT  #

`connect()` is a replacement function for the one with the same
name in React-Redux.  It generates a selector factory and calls
it with a function named `go()`.

##  The `connect()` Function

The form of the `connect()` function is as follows:

```js
    connect(component, stater, messager, dispatcher, config);
```

The `stater` and `dispatcher` need to be selectors of the forms
`function (state, props)` and `function (go, store, props, ℳ)`,
respectively, where `props` gives the provided component props,
`store` is the result of the `stater` function, and `ℳ` gives a
messages object constructed from the `messager`.

The wrapped component is then provided with the following emoji
props:

- `ℳ`: (Not technically an emoji.) The messages object.
- `🎛`: The `config` object, as provided.
- `🏪`: The result of the `stater`.
- `💪`: The result of the `dispatcher`.

`reselect`'s `createStructuredSelector()` is a good tool to use
when building `stater`s, and `dispatcher`s are typically normal
functions.

##  API Authentication

Because `connect()` handles API stuff for you, you need to give
it an access token for use with authorization requests. You can
do this using `connect.setAccessToken()`, which will return the
same token it is provided after setting it.

##  About `go()`

`go()` is essentially a wrapper for `dispatch` which makes code
like the following:

```js
go(fn, ...args);
```

be evaluated as though it were instead code like the following:

```js
dispatch(fn(...args, go, current, api));
```

(Note that `current` is just another name for `getState`.)

This means that action creators which would normally be written
as follows:

```js
const myAction = (arg1, arg2) => (dispatch, getState) => {
  const api = apiGeneratorFunction(getState);
  //  Function code
}
```

can instead be written more simply as:

```js
const myGoAction = (arg1, arg2, go, current, api) => {
  //  Function code
}
```

Note also the ease at which one can dispatch the `go()`-enabled
action creator, compared to the traditional one:

```js
dispatch(myAction(var1, var2));  //  Messy
go(myGoAction, var1, var2);      //  Clean
```

Using our `connect()` function allows us to write cleaner, more
straightforward action creators, and minimize the level of code
duplication we have with regard to API calls in particular.  It
is a tiny bit magic and a tiny bit hack so be careful where you
swing it around.

One especially important thing to note is that `go()` will only
(and always) provide `go`, `current`, and `api` to the function
it is called with if the provided `...args` fail to exhaust the
function's `length`.  This helps to keep us from creating `api`
objects that we won't use, but it does mean that every argument
to a function must be specified explicitly.  If a function were
to be specified with too few arguments, then `go` etc. would be
provided to the wrong argument slot, and if too many, then they
may not be provided at all.
