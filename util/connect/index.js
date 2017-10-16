/*********************************************************************\
|                                                                     |
|   CONNECT                                                           |
|   =======                                                           |
|                                                                     |
|   `connect()` is a replacement function for the one with the same   |
|   name in React-Redux.  It takes in a selector factory (making it   |
|   actually more similar to `connectAdvanced()`) and calls it with   |
|   a function named `go()`.                                          |
|                                                                     |
|   `go()` is essentially a wrapper for `dispatch` which makes code   |
|   like the following:                                               |
|                                                                     |
|       go(fn, ...args);                                              |
|                                                                     |
|   be evaluated as though it were instead code like the following:   |
|                                                                     |
|       dispatch(fn(...args, go, current, api));                      |
|                                                                     |
|   (Note that `current` is just another name for `getState`.)        |
|                                                                     |
|   This means that action creators which would normally be written   |
|   as follows:                                                       |
|                                                                     |
|       const myAction = (arg1, arg2) => (dispatch, getState) => {    |
|         const api = apiGeneratorFunction(getState);                 |
|         //  Function code                                           |
|       }                                                             |
|                                                                     |
|   can instead be written more simply as:                            |
|                                                                     |
|       const myGoAction = (arg1, arg2, go, current, api) => {        |
|         //  Function code                                           |
|       }                                                             |
|                                                                     |
|   Note also the ease at which one can dispatch the `go()`-enabled   |
|   action creator, compared to the traditional one:                  |
|                                                                     |
|       dispatch(myAction(var1, var2));  //  Messy                    |
|       go(myGoAction, var1, var2);      //  Clean                    |
|                                                                     |
|   Using our `connect()` function allows us to write cleaner, more   |
|   straightforward action creators, and minimize the level of code   |
|   duplication we have with regard to API calls in particular.  It   |
|   is a tiny bit magic and a tiny bit hack so be careful where you   |
|   swing it around.                                                  |
|                                                                     |
|   One especially important thing to note is that `go()` will only   |
|   (and always) provide `go`, `current`, and `api` to the function   |
|   it is called with if the provided `...args` fail to exhaust the   |
|   function's `length`.  This helps to keep us from creating `api`   |
|   objects that we won't use, but it does mean that every argument   |
|   to a function must be specified explicitly.  If a function were   |
|   to be specified with too few arguments, then `go` etc. would be   |
|   provided to the wrong argument slot, and if too many, then they   |
|   may not be provided at all.                                       |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import axios from 'axios';
import { injectIntl } from 'react-intl';
import { connectAdvanced as reduxConnect } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { createSelector } from 'reselect';

//  * * * * * * *  //

//  The code
//  --------

//  `readyToGo()` transforms the `fn` and `args` it is provided with
//  into a new function which is able to be dispatched. If an object
//  is provided instead of a function, it simply clones the object.
//  (Note that objects are inherently dispatchable.)
function readyToGo (fn, ...args) {
  return typeof fn !== 'function' ? { ...fn } : function (dispatch, getState) {
    const go = fn.length > args.length ?
      (fn, ...args) => dispatch(readyToGo(fn, ...args))
    : void 0;
    const current = fn.length > args.length + 1 ? getState : void 0;
    const api = fn.length > args.length + 2 ? axios.create({
      headers: {
        Authorization: `Bearer ${getState().getIn(['meta', 'accessToken'], '')}`,
      },
    }) : void 0;
    const result = fn.call(void 0, ...args, go, current, api);
    if (result) {
      dispatch(result);
    }
  };
}

//  `connect()` takes in a selector factory and hands it our `go()`
//  function—which is just `dispatch()` composed with `readyToGo()`.
export default function connect (stater, dispatcher, ...args) {
  return function (component) {

    //  `selectorFactory()` takes `dispatch()` and uses it to construct a
    //  `go()` function, which is then handed to our `factory`.
    const selectorFactory = dispatch => {

      const go = dispatcher.length > args.length ?
        (fn, ...args) => dispatch(readyToGo(fn, ...args))
      : void 0;

      const selector = createSelector(
        [
          stater ? stater : () => null,
          (state, ownProps) => ownProps,
        ],
        (store, {
          intl,
          ...props
        }) => {
          const context = { intl };
          return {
            ...props,
            '🛄': context,
            '💪': dispatcher ? dispatcher(go, store, props, context) : null,
            '🏪': store,
          };
        }
      );

      let props = null;

      return function (store, ownProps) {
        let shouldUpdate = false;
        if (typeof component.shouldComponentUpdate === 'function') {
          shouldUpdate = component.shouldComponentUpdate(ownProps, component.state);
        } else shouldUpdate = !shallowEqual(props, ownProps);
        if (!props || shouldUpdate) {
          props = ownProps;
        }
        return selector(store, props);
      };
    };

    //  All connected functions are passed through `injectIntl`.
    return injectIntl(reduxConnect(selectorFactory)(component));
  };
}
