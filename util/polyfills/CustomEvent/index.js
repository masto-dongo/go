//  Polyfill for CustomEvent().
export const CustomEvent = (
  CustomEvent => {
    if (typeof CustomEvent === 'function') return CustomEvent;
    CustomEvent = function CustomEvent (typeArg, customEventInit = {}) {
      const bubbles = !!customEventInit.bubbles;
      const cancelable = !!customEventInit.cancelable;
      const detail = customEventInit.detail;
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(typeArg, bubbles, cancelable, detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
  }
)(window.CustomEvent);
