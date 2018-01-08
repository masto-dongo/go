//  CONNECT:READY_TO_GO
//  ===================

//  Package imports.
import axios from 'axios';

//  Utils.
import { token } from '../token';

//  `readyToGo()` transforms the `fn` and `args` it is provided with
//  into a new function which is able to be dispatched.
export default function readyToGo (fn, ...withArgs) {

  //  If an object is provided instead of a function, we just clone
  //  the object.  Otherwise, we create a new function for dispatching.
  return typeof fn !== 'function' ? { ...fn } : function (dispatch, getState) {
    const go = fn.length > withArgs.length ? function () {
      const go = (fn, ...args) => dispatch(readyToGo(fn, ...args));
      go.use = (fn, ...args) => go.bind(null, fn, ...args);
      return go;
    }() : void{};
    const current = fn.length > withArgs.length + 1 ? getState : void{};
    const api = fn.length > withArgs.length + 2 ? axios.create({ headers: { Authorization: `Bearer ${token() || ''}` } }) : void{};
    const result = fn.call(null, ...withArgs, go, current, api);
    if (result) {
      dispatch(result);
    }
  };
}
