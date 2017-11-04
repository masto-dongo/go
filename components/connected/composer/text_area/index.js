//  <ConnectedComposerTextArea>
//  ===========================

//  This component provides a semi-rich-text editor. It uses diffs and
//  all sorts of magic to make `contentEditable` work well with React.

//  This component is based off of a very similar one I wrote for my
//  frontend "Labcoat", but rewritten and improved for use with
//  _Mastodon GO!_.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  DOM imports.
import {
  DOMListen,
  DOMForget,
  DOMEventInsert,
} from 'themes/mastodon-go/DOM';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { Emoji } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedComposerTextArea extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Variables.
    this.caret = 0;
    this.cache = [];
    this.composing = false;
    this.lastRenderedString = '';
    this.node = null;

    //  Function binding.
    const {
      getContents,
      handleEvent,
      handleInsert,
      handleRef,
      insertContent,
      restoreCaretPos,
      storeCaretPos,
    } = Object.getPrototypeOf(this);
    this.getContents = getContents.bind(this);
    this.handleEvent = handleEvent.bind(this);
    this.handleInsert = handleInsert.bind(this);
    this.handleRef = handleRef.bind(this);
    this.insertContent = insertContent.bind(this);
    this.restoreCaretPos = restoreCaretPos.bind(this);
    this.storeCaretPos = storeCaretPos.bind(this);
  }

  //  On mounting we listen for an insert event and get the value of
  //  the component.
  componentDidMount () {
    const {
      getContents,
      handleInsert,
    } = this;
    const { onChange } = this.props;
    DOMListen(DOMEventInsert, handleInsert);
    if (onChange) onChange(getContents());
  }

  //  We use `componentWillUpdate()` to grab the caret position before
  //  updating.
  componentWillUpdate (nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.storeCaretPos();
    }
  }

  //  On unmounting, we stop listening for the insert event.
  componentWillUnmount () {
    const { handleInsert } = this;
    DOMForget(DOMEventInsert, handleInsert);
  }

  //  If our component updates, then we need to restore the caret
  //  afterwards.
  componentDidUpdate (prevProps) {
    const { value } = this.props;
    if (prevProps.value !== value) {
      this.restoreCaretPos();
    }
  }

  //  This gets the contents of the text area.  This is a little more
  //  complicated than it would otherwise be since we have to account
  //  for `<br>`s and `<img>s`.  We walk the tree of our element and
  //  collect the content of every text node, additionally inserting
  //  a `'\n'` for each `<br>` we find, as well as replacing images
  //  with their alt-text.  In essence, this is just a `<br>`- and
  //  `<img>`-aware `Element.textContent`.
  getContents () {
    const { node } = this;
    if (!node) {
      return '\n';
    }
    let wkr = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode (nde) {
        const nodeName = nde.nodeName.toUpperCase();
        switch (true) {
        case nde.nodeType === Node.TEXT_NODE:
        case nodeName === 'BR':
        case nodeName === 'IMG':
          return NodeFilter.FILTER_ACCEPT;
        default:
          return NodeFilter.FILTER_SKIP;
        }
      },
    });
    let nde = null;
    let out = '';
    while (wkr.nextNode()) {
      nde = wkr.currentNode;
      if (nde.nodeType === Node.TEXT_NODE) {
        out += nde.textContent;
      } else {
        switch (nde.tagName.toUpperCase()) {
        case 'BR':
          out += '\n';
          break;
        case 'IMG':
          out += nde.alt;
          break;
        default:
          out += nde.textContent;
        }
      }
    }
    if (out.length && out.slice(-1) !== '\n') {
      out += '\n';
    }
    return out;
  }

  //  When inserting content, we insert it directly into the DOM of our
  //  text area, replacing any selection.  But then we call
  //  `onChange()` to update our text area with properly formatted
  //  contents.
  insertContent (content) {
    const {
      getContents,
      node,
    } = this;
    const { onChange } = this.props;
    const nde = content instanceof Node ? content : document.createTextNode(content);
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const rng = sel.getRangeAt(0);
      if (node.contains(rng.commonAncestorContainer)) {
        rng.deleteContents();
        rng.insertNode(nde);
        rng.setEndAfter(nde);
        rng.collapse(false);
        sel.removeAllRanges();
        sel.addRange(rng);
      } else {
        node.insertBefore(nde, node.lastChild);
      }
    } else {
      node.insertBefore(nde, node.lastChild);
    }
    if (onChange) {
      onChange(getContents());
    }
  }

  //  For the most part, we just call `getContents()` to update our
  //  value whenever something happens to our textbox.  However, if the
  //  user types "enter" then we need to ensure that the result is just
  //  a simple `<br>` element and not some weird `<div>`-induced magic
  //  that browsers like Chrome (and now Firefox) like to pull.  We
  //  also need to keep track of compositions so that we don't
  //  accidentially break them with a re-render.
  handleEvent (e) {
    const {
      composing,
      getContents,
      insertContent,
      node,
    } = this;
    const { onChange } = this.props;
    let img, nde, rng, sel;
    switch (e.type) {
    case 'compositionstart':
      this.composing = true;
      return;
    case 'compositionend':
      this.composing = false;
      return;
    case 'keydown':
      switch (e.key) {
      case 'Enter':
        e.preventDefault();
        insertContent(document.createElement('br'));
        return;
      case 'Backspace':
        if ((sel = window.getSelection()) && sel.rangeCount) {
          rng = sel.getRangeAt(0);
          if (rng.collapsed && node.contains(rng.startContainer)) {
            if (rng.startContainer !== node && rng.startOffset === 0) {
              img = rng.startContainer.previousSibling;
            } else if (rng.startContainer === node) {
              img = node.childNodes.item(rng.startOffset - 1);
            }
            if (img && img.nodeName.toUpperCase() === 'IMG') {
              e.preventDefault();
              rng.setStartBefore(img);
              nde = document.createTextNode(img.alt.substr(0, img.alt.length - 1));
              rng.deleteContents();
              rng.insertNode(nde);
              rng.setEndAfter(nde);
              rng.collapse(false);
              sel.removeAllRanges();
              sel.addRange(rng);
              break;
            }
          }
        }
        return;
      case 'Delete':
        if ((sel = window.getSelection()) && sel.rangeCount) {
          rng = sel.getRangeAt(0);
          if (rng.collapsed && node.contains(rng.endContainer)) {
            if (rng.endContainer !== node && rng.endOffset === (rng.endContainer.nodeType === Node.TEXT_NODE ? rng.endContainer.textContent : rng.endContainer.childNodes).length) {
              img = rng.endContainer.nextSibling;
            } else if (rng.endContainer === node) {
              img = node.childNodes.item(rng.endOffset);
            }
            if (img && img.nodeName.toUpperCase() === 'IMG') {
              e.preventDefault();
              rng.setEndAfter(img);
              nde = document.createTextNode(img.alt.substr(1, img.alt.length - 1));
              rng.deleteContents();
              rng.insertNode(nde);
              rng.setStartBefore(nde);
              rng.collapse(true);
              sel.removeAllRanges();
              sel.addRange(rng);
              break;
            }
          }
        }
        return;
      default:
        return;
      }
    }
    if (!composing && onChange) {
      onChange(getContents());
    }
  }

  //  When we get an insert event, we just `insertContent()`.
  handleInsert ({ detail: { text } }) {
    const { insertContent } = this;
    insertContent(text);
  }

  //  Storing a reference to our node.
  handleRef (node) {
    this.node = node;
  }

  //  Storing our caret position.
  storeCaretPos () {
    const { node } = this;

    //  We store the current selection with `sel` and the current range
    //  of the selection with `rng`.
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      return;
    }
    const rng = sel.getRangeAt(0);

    //  `pre` is a range consisting of everything leading up to the end
    //  of `rng`.  First we select our entire text area, and then we
    //  set the endpoint of the range to be the endpoint of our current
    //  selection.
    const pre = rng.cloneRange();
    pre.selectNodeContents(node);
    pre.setEnd(rng.endContainer, rng.endOffset);

    //  This next line tells us how many line breaks were in the
    //  selected range.  This is a somewhat expensive operation as it
    //  involves cloning DOM nodes, but there isn't any faster way.
    const cts = pre.cloneContents();
    const brs = cts.querySelectorAll('br').length;
    const alt = Array.prototype.slice.call(cts.querySelectorAll('img')).reduce(function (str, img) {
      return str + img.alt;
    }, '').length;

    //  We can now find the length of the selection by adding the
    //  length of the text content to the number of line breaks.
    this.caret = pre.toString().length + brs + alt;
  }

  //  Restoring our caret position.  The `offset` argument can be used
  //  to adjust where to place the caret.
  restoreCaretPos (offset = 0) {
    const {
      caret,
      node,
    } = this;
    const { value } = this.props;
    if (!node) return;
    const sel = window.getSelection();
    const rng = document.createRange();
    const wkr = document.createTreeWalker(node);
    const dst = caret + offset;
    let idx = 0;
    let nde = null;
    let success = false;

    //  If our `caret` is as long as our `value`, we already know it
    //  goes at the end.
    if (dst >= value.length - 1) success = true;

    //  This loop breaks if we run out of nodes, or find the node that
    //  our caret belongs in.  It properly handles the case where the
    //  caret belongs between two `<br>`s.
    while (!success && wkr.nextNode()) {
      nde = wkr.currentNode;
      if (nde.nodeType === Node.TEXT_NODE) {
        if (idx <= caret && dst <= idx + nde.textContent.length) {
          success = true;
          break;
        } else idx += nde.textContent.length;
      } else if (nde.tagName.toUpperCase() === 'BR') {
        if (idx++ === dst) {
          success = true;
          break;
        }
      } else if (nde.tagName.toUpperCase() === 'IMG') {
        if ((idx += nde.alt.length) >= dst) {
          success = true;
          break;
        }
      }
    }

    //  If we found the position of the caret, we set the end of our
    //  range to that spot.  If not, we select the entire text area.
    //  Then we `collapse()` the range to its endpoint and move the
    //  caret there.
    if (success && nde) {
      if (nde.nodeType === Node.TEXT_NODE) rng.setEnd(nde, dst - idx);
      else rng.selectNode(nde);
    } else if (
      node.lastChild &&
      node.lastChild.nodeName.toUpperCase() === 'BR'
    ) rng.setEnd(node, node.childNodes.length - 1);
    else rng.selectNodeContents(node);
    rng.collapse(false);
    sel.removeAllRanges();
    sel.addRange(rng);
  }

  //  Rendering.
  render () {
    const {
      cache,
      composing,
      handleEvent,
      handleRef,
      lastRenderedString,
    } = this;
    const {
      autoplay,
      className,
      disabled,
      emoji,
      value,
      ℳ,
    } = this.props;

    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--TEXT_AREA', {
      composing,
      disabled,
      empty: (
        value === '\n' ||
        value === ''
      ),
    }, className);

    //  This gets our first and last points of difference from our
    //  previous render.
    const diffStart = function () {
      let i;
      for (i = 0; i < lastRenderedString.length; i++) {
        if (lastRenderedString.charAt(i) !== value.charAt(i)) {
          return i;
        }
      }
      return i;
    }();
    let diffEnd = diffStart === lastRenderedString.length ? lastRenderedString.length : function () {
      let i;
      for (i = 0; i < lastRenderedString.length; i++) {
        if (lastRenderedString.charAt(lastRenderedString.length - i - 1) !== value.charAt(value.length - i - 1)) {
          return lastRenderedString.length - i;
        }
      }
      return lastRenderedString.length - i;
    }();

    //  Our last point of difference may wind up before our first one
    //  (this can happen when comparing eg "11" ➡️ "11a11" because our
    //  diffs are relative to the `lastRenderedString`).  We can't
    //  allow this because it will completely throw off our chunk
    //  processing and boundary detection.  This unfortunately means
    //  we can't reüse chunks—the duplicate string will have to be
    //  reprocessed.
    if (diffEnd < diffStart) {
      diffEnd = diffStart;
    }

    //  We store our result in an array.
    const result = [];
    let index = 0;
    let position = 0;
    let endPosition = 0;

    //  We use the cached result so long as our diff doesn't begin
    //  until a later index.
    while (cache[index + 1] && diffStart > cache[index + 1].position) {
      result.push(cache[index]);
      position += cache[index++].size;
    }

    //  We move our `index` to the first cached entry after `diffEnd`,
    //  if applicable.
    index = cache.length;
    while (cache[index - 1] && diffEnd < cache[index - 1].position) {
      endPosition += cache[--index].size;
    }

    //  Next, we process the text in-between our two diffs.
    let i = 0;
    let text = value.substring(position, value.length - endPosition);
    let inWord = false;

    //  We loop over each character in the string and look for a
    //  parseäble substring.
    while (i < text.length) {

      //  If our character is a line-break, we push a `<br>`.
      if (text.charAt(i) === '\n') {
        if (i !== 0) {
          result.push({
            position,
            size: i,
            value: text.substr(0, i),
          });
        }
        result.push({
          position: position += i,
          size: 1,
          value: '<br>',
        });
        position++;
        text = text.substr(i + 1);
        i = 0;
        inWord = false;
        continue;
      }

      //  Otherwise, we look for matches with emoji.  There may
      //  multiple.
      const matches = emoji.filter(
        emojo => {
          const emojiString = '' + emojo;
          const shortcodeString = emojo.name ? ':' + emojo.name + ':' : null;
          switch (true) {
          case emojiString && text.substr(i, emojiString.length) === emojiString && (emojiString.charAt(emojiString.length - 1) === '\ufe0f' || text.charAt(i + emojiString.length) !== '\ufe0e'):
            return true;
          case !inWord && shortcodeString && text.substr(i, shortcodeString.length) === shortcodeString && (!text.charAt(i + shortcodeString.length) || !/[\w:]/.test(text.charAt(i + shortcodeString.length))):
            return true;
          default:
            return false;
          }
        }
      );

      //  If we have a match, then we need to process it.
      if (matches.length) {

        //  From our list of matches, we select the longest one. This will
        //  be unique unless there are multiple emoji with the same string
        //  value, iin which case we will select the first one.
        const emojo = matches.reduce(
          (longest, current) => longest && ('' + longest).length > ('' + current).length ? longest : current
        );
        const emojiString = '' + emojo;
        let match = emojiString && text.substr(i, emojiString.length) === emojiString && (emojiString.charAt(emojiString.length - 1) === '\ufe0f' || text.charAt(i + emojiString.length) !== '\ufe0e') ? emojiString : ':' + emojo.name + ':';

        //  We gobble the following U+FE0F character if one exists and
        //  our match doesn't end with one.
        if (text.charAt(i + match.length) === '\ufe0f' && match.charAt(match.length - 1) !== '\ufe0f') {
          match += '\ufe0f';
        }

        //  If there was text prior to this emoji, we push it to our
        //  result.  Then we push the emoji image.
        if (i !== 0) {
          result.push({
            position,
            size: i,
            value: text.substr(0, i),
          });
        }
        result.push({
          position: position += i,
          size: match.length,
          value: emojo.toImage(!autoplay).outerHTML || match,
        });
        position += match.length;

        //  We now trim the processed text off of our `text` string and
        //  reset the index to `0`.
        text = text.substr(i + match.length);
        i = 0;
        inWord = false;
        continue;
      }

      //  If we've processed 0x16 or more characters, we go ahead and
      //  push them.  This helps to keep our diffs small.  Note that
      //  there is no guarantee that these chunks will stay this size.
      //  (So long as no boundary point changes, they can shrink
      //  without consequence.  If they try to grow, they will split in
      //  two.)
      if (i >= 0x15) {  //  Because our first character is 0
        result.push({
          position,
          size: i + 1,
          value: text.substr(0, i + 1),
        });
        position += i + 1;
        inWord = /[\w:]/.test(text.charAt(i));
        text = text.substr(i + 1);
        i = 0;
        continue;
      }

      //  Otherwise, we increment our index and move on.
      inWord = /[\w:]/.test(text.charAt(i));
      i++;
    }

    //  If our `text` didn't end in a parseäble entity, there will
    //  still be some leftover text to push.
    if (text) {
      result.push({
        position: position,
        size: text.length,
        value: text,
      });
      position += text.length;
    }

    //  Now we can use the cached result for any remaining entries.  We
    //  do need to update the `position`s, though.
    while (cache[index]) {
      result.push({
        position: position,
        size: cache[index].size,
        value: cache[index].value,
      });
      position += cache[index++].size;
    }

    //  We store our result and our current string for next time.
    this.cache = result;
    this.lastRenderedString = value;

    //  Finally we can insert our result into our `<div>` and render.
    return (
      <div
        aria-label={ℳ.label}
        className={computedClass}
        contentEditable={!disabled}
        dangerouslySetInnerHTML={{ __html: result.map(
          item => item.value
        ).join('') }}
        onCompositionStart={handleEvent}
        onCompositionEnd={handleEvent}
        onKeyDown={handleEvent}
        onInput={handleEvent}
        onBlur={handleEvent}
        ref={handleRef}
        tabIndex='0'
      />
    );
  }

}

//  Props.
ConnectedComposerTextArea.propTypes = {
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  ℳ: PropTypes.func.isRequired,
};
