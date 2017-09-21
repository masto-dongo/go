export default function ready (fn) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}
