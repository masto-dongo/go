import { waiting } from '../on_ready';

export default function moduleReady () {
  let fn;
  while (fn = waiting.pop()) {
    if (typeof fn === 'function') {
      fn();
    }
  }
}
