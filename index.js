//  Package imports.
import { injectIntl } from 'react-intl';
import { connectAdvanced } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { createSelector } from 'reselect';

//  Utils.
import makeMessages from 'util/makeMessages';
import readyToGo from 'util/readyToGo';
import token from 'util/token';

//  `connect()` creates a selector factory with access to our `go()`
//  function—which is just `dispatch()` composed with `readyToGo()`.
export default function connect (component, stater, messager, dispatcher, config) {

  //  If we don't have a `component`, we can't connect.
  if (!component) {
    throw new TypeError('connect: Cannot connect; no component was provided');
  }

  //  If we don't have a `stater` or a `dispatcher`, we can take a
  //  shortcut with our connecting.
  if (!stater && !dispatcher) {
    return injectIntl(function ({
      intl,
      ...props
    }) {
      return React.createElement(component, {
        ...props,
        ℳ: makeMessages(intl, messager),
        '🎛': config || null,
        '🏪': null,
        '💪': null,
      });
    });
  }

  //  `selectorFactory()` takes `dispatch()` and uses it to construct a
  //  `go()` function, which is then handed to our `dispatcher`.
  const selectorFactory = dispatch => {

    //  Generates our `go()` function.
    const go = (fn, ...args) => dispatch(readyToGo(fn, ...args));

    //  This will hold our messages function.  We need `intl` to
    //  define it, so it starts out `null`.
    let messages = null;

    //  This is the selector we will use.
    const selector = createSelector(
      [
        (state, {
          intl,
          ...props
        }) => stater ? stater(state, props) : null,
        (state, ownProps) => ownProps,
      ],
      (store, {
        intl,
        ...props
      }) => {

        //  Makes our messages.
        if (!messages) {
          messages = makeMessages(intl, messager);
        }

        //  The returned object.
        return {

          //  Our props (not including `intl`).
          ...props,

          //  Our messages, handlers, and store.
          ℳ: messages,
          '🎛': config || null,
          '🏪': store,
          '💪': dispatcher ? dispatcher(go, store, props, messages) : null,
        };
      }
    );

    //  This stores our last received props for this component.
    let props = null;

    //  We use `shallowEqual()` from `react-redux` to mimic the
    //  behaviour of their `connect()`.
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
  return injectIntl(connectAdvanced(selectorFactory)(component));
}

//  The `setAccessToken()` method on `connect()` lets you set the
//  access token for use with API requests.
connect.setAccessToken = function setAccessToken (value) {
  return token(value, true);
}
