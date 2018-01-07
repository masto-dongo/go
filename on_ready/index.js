//  The function.
export default function launchOnReady (launcher) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    launcher();
  } else {
    document.addEventListener('DOMContentLoaded', launcher);
  }
}
