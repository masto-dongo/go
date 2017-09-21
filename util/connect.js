import axios from 'axios';
import { injectIntl } from 'react-intl';
import { connect as reduxConnect } from 'react-redux';
import { withRouter } from 'react-router';

const readyToGo = fn => (dispatch, getState) => {
  if (typeof fn !== 'function') return fn;
  const go = fn.length > 0 ? (fn) => dispatch(readyToGo(fn)) : void 0;
  const state = fn.length > 1 ? getState() : void 0;
  const api = fn.length > 2 ? axios.create({
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
  fn(go, state, api);
}

const connect = (stater, dispatcher) => component => {
  wrappedDispatcher = dispatcher.length < 2 ? (
    dispatch => dispatcher(fn => dispatch(readyToGo(fn)))
  ) : (
    (dispatch, ownProps) => dispatcher(fn => dispatch(readyToGo(fn)), ownProps)
  );
  return injectIntl(
    reduxConnect(stater, wrappedDispatcher)(
      withRouter(component)
    )
  );
}

export default connect;
