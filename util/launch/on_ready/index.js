export default function launchOnReady (launcher) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', launcher);
  }
}
