export const waiting = [];

export default function moduleOnReady (fn) {
  waiting.push(fn);
}
