#  CONVENTIONS  #

This file describes the various styling conventions used with _Mastodon GO!_ code.
In general, we follow the styling conventions set forth by Mastodon proper, so this file will only describe those things which potentially might differ.

##  File Structure  ##

_Mastodon GO!_ has five main folders:

 -  __`actions` :__ Redux action creators.
 -  __`components` :__ React components.
 -  __`locales` :__ Localization info.
 -  __`reducers` :__ Redux reducers.
 -  __`util` :__ Helper functions and miscellaneous scripts.

##  Redux Actions and Reducers  ##

###  Naming:

Unlike upstream Mastodon, Glitch actions and reducers are named in the singular—so it's `status` not `statuses`.

Action types take the form `KEY_ACTION_VERB`, and their creators flip the order of the words, like `verbActionKey()`.
Oftentimes you will have an `actionKey()` as well which handles the API request and groups a number of related actions together.

>   ###  Example:
>
>   Statuses are fetched using `fetchStatus()`, which calls the following action creators:
>
>   - `requestFetchStatus()`
>   - `successFetchStatus()`
>   - `failureFetchStatus()`
>
>   …which in turn create the following action types (note the reversed word-order!):
>
>   - `STATUS_FETCH_REQUEST`
>   - `STATUS_FETCH_SUCCESS`
>   - `STATUS_FETCH_FAILURE`
>

The values of action types are just the string representations of their names.

You should endeavour to make related action types be of equal string length for code cleanliness; `request`/`success`/`failure`, `singular`/`multiple`, and `connecting`/`disconnect` are some words which help to achieve this.
(If this isn't manageäble, that's okay 😛.)

###  Design:

The redux store should only be used for data storage related to Mastodon proper, and *not* the means by which that is rendered on the screen (ie, via React components).
React components should maintain aspects of their state which relate to their form and function internally, and only rely on Redux for their contents.

The action types and reducers used with Redux should each represent a fundamental data type relating to the current state of information on the Mastodon server.

##  React Components  ##

Each subfolder inside the `components` folder (with the exception of `common`) describes a _feature_ of the frontend.
Features are “smart,” which means they are connected to the Redux store via their _feature container_ (`container.js`).
Features should **always** be loaded through their container, **never** independently.

>   __Example :__
>   The `<Status>` component should always be loaded via the `<StatusContainer>` located at `components/status/container.js`.

Subsubfolders, etc. define further components which are used by _Mastodon GO!_'s various features, and the `common` folder contains those components which are feature-independent.
These components are “simple,” which means that they do not have direct access to the store and must be passed information from their parents.

Components should always be packaged in a folder with a `style.scss`.
The stylesheet for the component can be blank if it does not need additional styling.

###  Component guidelines:

Every component should have a `className` prop which can be used to add additional class names to its root element, and all unused props should be passed through.

Component names should reflect their path inside the `components` directory; for example, the component located at `components/status/content/gallery/item` is named `StatusContentGalleryItem`.

###  Container guidelines:

Containers should be constructed using [selectors](https://github.com/reactjs/reselect) to prevent needless re-renders.

The dispatch selector should return an object with a single property, named `handler`, which contains all of the handler functions for the feature.
This helps to reduce the total number of props being passed through.

##  Importing and Exporting  ##

###  Paths:

For _Mastodon GO!_ imports, relative paths should only be used for files which are contained by the current directory (ie, paths which start with `./` not `../`).
Other paths should be absolute, using `mastodon-go/` as the root directory.

###  `classNames`:

_Mastodon GO!_ always imports the function provided by the `classnames` package as `classNames`, not `classnames`, to match the [package](https://github.com/JedWatson/classnames) [documentation](https://github.com/andyyou/classnames-rails).
The result of this function is usually stored in a variable named `computedClass`.

##  Comments  ##

JavaScript block comments (`/* */`) aren't used; instead use line comments (`//`).
These come in two forms:

 -  __Standalone line comments__ should be used for longer explanations and documentation.
    These should be written on their own lines and indented to match the surrounding code.
    A newline should appear before (but usually not after) them, and they should always end with a period (`.`).
    Furthermore, they should be wrapped such that the length of the line (including indentation) is no longer than 71 characters + LF.

 -  __Inline comments__ should be used for short notes which are no longer than one sentence.
    They are appended to the end of a line of code and should *not* end in a period.

In both cases, two spaces should come between the `//` slash characters and the comment text, and (in the case of inline comments) between the `//` slash characters and any preceding code.

##  Classes  ##

The primary class names for components match their path inside the `components` directory, in all-caps, with `--` separating directories and `_` separating words.
This string is always prepended with the prefix `MASTODON_GO--` so that _Mastodon GO!_ components are clearly identified.
For example, the component located at `components/status/action_bar` is given the class name `MASTODON_GO--STATUS--ACTION_BAR`.

Additional class names may be given to components to indicate certain features; these should be written in lowercase and prepended with an underscore, as in `_active` or `_disabled`.
Class names with an underscore should never be given to anything but the root element of a component.

##  Styles  ##

Styles should strive to be as specific as possible to prevent unintended side-effects.
Most importantly, they should only ever select elements within their associated component.

Stylesheets should not have knowledge of the internal structure of child components, or attempt to style them at any level beyond their root element.
If it is important that the children of a certain component be styled in a particular way, this should be specified through React and that component's own stylesheet.

##  Functions  ##

It is **very important** that arrow functions be used for non–React-specified instance methods, as this is required to appropriately bind their `this` value.
Unlike upstream Mastodon, we also use arrow functions with action creators for convenience.

In other situations, whether to use an arrow function or a `function` declaration/expression is left to your best judgement.
