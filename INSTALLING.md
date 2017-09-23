#  INSTALLING  #

_Mastodon GO!_ currently only runs on a Mastodon server running [`glitch-soc`](https://github.com/glitch-soc/mastodon).
Support for vanilla Mastodon or "unhosted" installs may be added at some point in the future.

To install, simply add the `mastodon-go` folder into `app/javascript`—you may want to use git submodules to make staying updated easier.
To do this, run the following code from your Mastodon root directory:

```
git submodule add https://github.com/marrus-sh/mastodon-go app/javascript/mastodon-go
```

You can then update the frontend by running:

```
git submodule update app/javascript/mastodon-go
```

Finally, in order for Mastodon to recognize the frontend as an available option, you will need to add a `mastodon-go.js` file inside `app/javascript/packs/frontends` with the following contents:

```js
import 'mastodon-go';
```
