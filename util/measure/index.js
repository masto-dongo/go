// Get the bounding client rect from an IntersectionObserver entry.
// This is to work around a bug in Chrome: https://crbug.com/737228

let borked = null;  //  Trinary value

export default function measure (entry) {
  if (typeof borked !== 'boolean') {
    borked = function (boundingRect, observerRect) {
      switch (true) {
      case boundingRect.height !== observerRect.height:
      case boundingRect.top !== observerRect.top:
      case boundingRect.width !== observerRect.width:
      case boundingRect.bottom !== observerRect.bottom:
      case boundingRect.left !== observerRect.left:
      case boundingRect.right !== observerRect.right:
        return true;
      default:
        return false;
      }
    }(entry.target.getBoundingClientRect(), entry.boundingClientRect);
  }
  return borked ? entry.target.getBoundingClientRect() : entry.boundingClientRect;
}
