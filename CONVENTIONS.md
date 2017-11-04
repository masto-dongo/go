#  CONVENTIONS  #

This file describes the various styling conventions used with _Mastodon GO!_ code.
In general, we follow the styling conventions set forth by Mastodon proper, so this file will only describe those things which potentially might differ.

##  File Structure  ##

_Mastodon GO!_ has five main folders:

 -  __`util` :__ Helper functions and miscellaneous scripts.
 -  __`DOM` :__ Events and DOM access.
 -  __`redux` :__ Redux action creators and reducers.
 -  __`localization` :__ Localization info (planned).
 -  __`components` :__ React components.

 These folders follow a specific heirarchy regarding which files they can or cannot import.
 `util` files, at the top of this heirarchy, cannot import any other files, except for those in their specific subdirectory.
 `DOM` and `redux` files can import from the `util` directory, or within their specific folders.
 `components` files can import from `util`, `DOM` and `redux`.
 `localization` files shouldn't need to import anything.

##  Redux Actions and Reducers  ##

###  Naming:

Unlike upstream Mastodon, _Mastodon GO!_ actions and reducers are named in the singular—so it's `status` not `statuses`.

Action types take the form `KEY_ACTION_VERB`.
These are grouped together into a single `actionKey()` function, which is exported and made available from the root `redux` directory.

>   ###  Example:
>
>   Statuses are fetched using `fetchStatus()`, which calls the following (unexported) action creators:
>
>   - `request()`
>   - `success()`
>   - `failure()`
>
>   …which in turn create the following action types:
>
>   - `STATUS_FETCH_REQUEST`
>   - `STATUS_FETCH_SUCCESS`
>   - `STATUS_FETCH_FAILURE`

The values of action types are just the string representations of their names.

You should endeavour to make related action types be of equal string length for code cleanliness; `request`/`success`/`failure`, `singular`/`multiple`, and `connecting`/`disconnect` are some words which help to achieve this.
(If this isn't manageäble, that's okay 😛.)

###  Design:

The redux store should only be used for data storage related to Mastodon proper, and *not* the means by which that is rendered on the screen (ie, via React components).
React components should maintain aspects of their state which relate to their form and function internally, and only rely on Redux for their contents.

The action types and reducers used with Redux should each represent a fundamental data type relating to the current state of information on the Mastodon server.

##  React Components  ##

The `components` folder is broken up into five subfolders, each of which contains components of a different type:

 -  __`common` :__
    These are common components which are not connected to the Redux store.
    They should not import any non-`common` components and should function in a more-or-less standalone manner.

 -  __`connected` :__
    These are generalized components which have been connected to the Redux store.
    They may import other `connected` components (making them *impure*) or any `common` ones (which do not impact purity).

 -  __`raw` :__
    These are components which designed to be connected to the Redux store in a customized manner.
    The only component which fits this description right now is the `<RawPaneller>`.

 -  __`panelled` :__
    These are custom connections made between the Redux store, the `<RawPaneller>`, and various other (non-routed) components.
    These components are not created until every other module has run in order to ensure that `<RawPaneller>` is not `undefined`.

 -  __`routed` :__
    These are connected components which are intended to be used inside of a React-Router `<Route>` element.
    They may import any other component type.
    Right now the only component which fits this description is `<RoutedUI>`.

Conforming to this structure allows us to import all of our components directly from `themes/mastodon-go/components` without having to worry about circular dependencies breaking our code.
Only components whose parent folder rests directly in one of these folders are allowed to be imported from elsewhere in the frontend.
Subsubfolders, etc. define further components which are required by _Mastodon GO!_'s various features, but which are not `common`.
These components must be “simple,” which means that they do not have direct access to the store and must be passed information from their parents.

Components should always be packaged in a folder with a `style.scss`.
The stylesheet for the component can be blank if it does not need additional styling.

###  Component guidelines:

Every component should have a `className` prop which can be used to add additional class names to its root element.
For `common` components only, all unused props should be passed through to their root element.

Component names should reflect their path inside the `components` directory; for example, the component located at `components/connected/status/content/gallery` is named `<ConnectedStatusContentGallery>`.

###  Class structure

Unlike upstream Mastodon, _Mastodon GO!_ doesn't specify properties, like `state` and `propTypes`, directly inside the class body.
Furthermore, arrow functions are not used for class methods; rather, methods are explicitly bound to the object in the class `constructor()`.

###  Concerning children:

If a component takes in children, those children *must* appear as direct children of that component's root element, so that the CSS `>` combinator works as expected.
For example, if a `<CommonIcon>` is passed as a child to a `<CommonButton>`, the former can be selected in CSS using `.MASTODON_GO--COMMON--BUTTON > .MASTODON_GO--COMMON--ICON`.
If passed components cannot reliably be placed in this fashion, they should be provided not as children but via a prop.

##  Importing and Exporting  ##

###  Paths:

For _Mastodon GO!_ imports, relative paths should only be used for files which are contained by the current directory (ie, paths which start with `./` not `../`).
The exception to this is within `util` folders, where all paths should be relative.
Other paths should be absolute, of the form `themes/mastodon-go/[parent-folder]`.

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
For example, the component located at `components/connected/status/action_bar` is given the class name `MASTODON_GO--CONNECTED--STATUS--ACTION_BAR`.

Additional class names may be given to components to indicate certain features; these should be written in lowercase, as in `active` or `disabled`.
When used as selectors in CSS, these lowercase class names are preceded by an asterisk when they stand alone, as with `*.active`.

##  Styles  ##

Styles should strive to be as specific as possible to prevent unintended side-effects.
Most importantly, they should only ever select elements within their associated component.

Stylesheets should not have knowledge of the internal structure of child components, or attempt to style them at any level beyond their root element.
They may, however, have knowledge of what sorts of *class names* a child component might be expected to have (for example, a component's stylesheet might know that `.MASTODON_GO--COMMON--BUTTON`s are sometimes `.disabled`.)
Naturally, they may also have knowledge of any children that they explicitly pass to these components through the usual React method.
If it is important that the non-passed children of a certain component be styled in a particular way, this should be specified through React and that component's own stylesheet.

##  Functions  ##

Arrow functions are generally only used for functions which immediately return a value.
For IEFEs and more complicated function types, a `function ()` expression is usually better.
Inside of objects, the `[method] () {}` syntax is preferred.

_Mastodon GO!_ always places a space before and after the parenthesized argument list of a function expression.
Object destructuring should be used inside argument lists where applicable.

##  Objects and Arrays  ##

Objects should be written with each `key: value` pair on a single line, ending with a comma.
`import` statements, `export` statements, and object destructuring should also follow the one-per-line rule.
When the object contains only one such pair, this should instead be written as `{ key: value }`—but only if the value takes up only one line.

Arrays with three or fewer items should be written on a single line; those with more should follow the one-per-line syntax of objects.

##  Control Flow  ##

`if` statements should always be followed by a block, even when the statement can be fit onto a single line.
`switch` statements are preferred over `if…else` chains; `switch (true) {}` may be used with long chains of boolean comparisons.
