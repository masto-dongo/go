#  MODULE  #

To help with the async nature of ECMAScript modules, this package provides two functions.
`moduleOnReady(callback)` can be used to save a callback for later.
`moduleReady()` then fires all of the saved callbacks.
You should call `moduleReady()` at the end of the topmost file of the module heirarchy in your source.
