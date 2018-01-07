#  TOOTLEDGE  #

_Tootledge_ is a library for implementing the API/Redux side of Mastodon–client interactions, for use in GlitchSoc flavour creation.
It should be used with the `go()` function provided by the [`connect()`](https://github.com/masto-dongo/connect) library, like so:

```js
import { fetchAccount } from './tootledge';

function fetch (id, force = false) {
  go(fetchAccount, id, force);
}
```
