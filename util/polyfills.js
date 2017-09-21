import 'intersection-observer';
import 'requestidlecallback';

//  Polyfill for CustomEvent().
if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = function CustomEvent (typeArg, customEventInit = {}) {
    const bubbles = !!customEventInit.bubbles;
    const cancelable = !!customEventInit.cancelable;
    const detail = customEventInit.detail;
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(typeArg, bubbles, cancelable, detail);
    return evt;
  }
  window.CustomEvent.prototype = window.Event.prototype;
}
