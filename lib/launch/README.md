#  LAUNCH  #

This is a flavour-agnostic function for starting up your Mastodon flavour on page load or w/e.
It looks like this:

```js
import { launch } from './launch';

launch(elementID, RootComponent, Store, props, callback);
```

`elementID` is the `id` of the element to render into, and `RootComponent` is the React component to render.
`Store` is, naturally, your store object, which will be passed through to the `RootComponent` as the `store` prop; this can be `null` if you don't need a store.
The `props` argument gives props to pass to your `RootComponent` when rendering, and the `callback` should be a function to call right *before* the render.

The JSON-parsed value of `data-props` on the element with `elementID`, if present and applicable, will be passed through to the `RootComponent` via the `data` prop.
