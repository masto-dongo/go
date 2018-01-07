//  Package imports.
import axios from 'axios';

//  Utils.
import { token } from './token';

//  `readyToGo()` transforms the `fn` and `args` it is provided with
//  into a new function which is able to be dispatched.
export default function readyToGo (fn, ...withArgs) {

  //  If an object is provided instead of a function, we just clone
  //  the object.  Otherwise, we create a new function for dispatching.
  return typeof fn !== 'function' ? { ...fn } : function (dispatch, getState) {
    const go = fn.length > withArgs.length ?
      (fn, ...args) => dispatch(readyToGo(fn, ...args))
    : void 0;
    const current = fn.length > withArgs.length + 1 ? getState : void 0;
    const api = fn.length > withArgs.length + 2 ? axios.create({ headers: { Authorization: `Bearer ${token() || ''}` } }) : void 0;
    const result = fn.call(void 0, ...withArgs, go, current, api);
    if (result) {
      dispatch(result);
    }
  };
}
