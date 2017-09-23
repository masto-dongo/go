import axios from 'axios';
import { injectIntl } from 'react-intl';
import { connect as reduxConnect } from 'react-redux';
import { withRouter } from 'react-router';

const cachedStateFunction = getState => {
  let state = getState();

  const result = () => state = getState();

  result.get = (...args) => state.get(...args);
  result.getIn = (...args) => state.getIn(...args);

  Object.defineProperty(result, "value", { get: (
    () => state
  ) });

  return result;
}

const readyToGo = (fn, ...args) => typeof fn !== 'function' ? { ...fn } : (
  (dispatch, getState) => {
    const go = fn.length > args.length ?
          (fn, ...args) => dispatch(readyToGo(fn, ...args))
    : void 0;
    const state = fn.length > args.length + 1 ? cachedStateFunction(getState) : void 0;
    const api = fn.length > args.length + 2 ? axios.create({
      headers: {
        Authorization: `Bearer ${state.getIn(['meta', 'access_token'], '')}`,
      },
      transformResponse: [(data) => {
        response = {
          next: (link.match(
            /<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?next"?/
          ) || [])[1],
          prev: (link.match(
            /<\s*([^,]*)\s*>\s*;(?:[^,]*[;\s])?rel="?prev(?:ious)?"?/
          ) || [])[1],
          value: null,
        }
        try {
          response.value = JSON.parse(data);
        } catch (e) {
          response.value = data;
        }
      }],
    }) : void 0;
    fn(...args, go, state, api);
  }
);

const connect = (stater, dispatcher) => component => {
  wrappedDispatcher = dispatcher.length < 2 ? (
    dispatch => dispatcher(
      (fn, ...args) => dispatch(readyToGo(fn, ...args))
    )
  ) : (
    (dispatch, ownProps) => dispatcher(
      (fn, ...args) => dispatch(readyToGo(fn, ...args)),
      ownProps
    )
  );
  return injectIntl(
    reduxConnect(stater, wrappedDispatcher)(
      withRouter(component)
    )
  );
}

export default connect;
