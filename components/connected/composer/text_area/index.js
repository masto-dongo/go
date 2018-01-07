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
import { GOInsert } from 'flavours/go/events'

//  Lib imports.
import {
  DOMListen,
  DOMForget,
} from 'flavours/go/lib/DOM';
import { Emoji } from 'flavours/go/lib/tootledge';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  This function produces a string from a node.
function stringify (node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    switch (node.tagName.toUpperCase()) {
    case 'BR':
      return '\n';
    case 'IMG':
      return node.alt;
    default:
      return node.textContent;
    }
  }
  return node.textContent;
}

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedComposerTextArea extends React.Component {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Variables.
    this.caret = 0;
    this.cache = [];
    this.composing = false;
    this.node = null;

    //  Function binding.
    const {
      fillContents,
      getContents,
      handleEvent,
      handleInsert,
      handleRef,
      insertContent,
      restoreCaretPos,
      storeCaretPos,
    } = Object.getPrototypeOf(this);
    this.fillContents = fillContents.bind(this);
    this.getContents = getContents.bind(this);
    this.handleEvent = handleEvent.bind(this);
    this.handleInsert = handleInsert.bind(this);
    this.handleRef = handleRef.bind(this);
    this.insertContent = insertContent.bind(this);
    this.restoreCaretPos = restoreCaretPos.bind(this);
    this.storeCaretPos = storeCaretPos.bind(this);
  }

  //  On mounting we listen for an insert event fill the component.
  componentDidMount () {
    const {
      fillContents,
      handleInsert,
    } = this;
    const { value } = this.props;
    DOMListen(GOInsert, handleInsert);
    fillContents(value);
  }

  //  If our component updates, then we need to restore its contents.
  componentDidUpdate () {
    const { fillContents } = this;
    const { value } = this.props;
    fillContents(value);
  }

  //  On unmounting, we stop listening for the insert event.
  componentWillUnmount () {
    const { handleInsert } = this;
    DOMForget(GOInsert, handleInsert);
  }

  //  If our component is about to update, we need to store our caret
  //  position first.
  componentWillUpdate () {
    const { storeCaretPos } = this;
    storeCaretPos();
  }

  //  This function fills our `<div>` with our contents.
  fillContents (value) {
    const {
      cache,
      node,
      restoreCaretPos,
    } = this;
    const {
      autoplay,
      emoji,
    } = this.props;

    //  We need a `node` in order to fill it.
    if (!node) {
      return;
    }

    //  We clear our node's contents to prepare for insertion.
    node.textContent = '';

    //  This sets up our iteration variables.
    let doc = document.createDocumentFragment();
    let idx = 0;
    let lmt = 0;
    let lst = null;
    let nde = null;
    let pos = 0;
    let res = [];
    let sfe = null;
    let txt = '';

    //  We insert nodes from our cache so long as the strings match
    //  up.
    let ini = function () {
      for (idx = 0; idx < cache.length; idx++) {
        nde = cache[idx];
        if (typeof nde === 'string') {
          txt = nde;
          nde = document.createTextNode(txt);
        } else {
          txt = stringify(nde);
        }
        if (txt !== value.substr(pos, txt.length)) {
          return pos;
        }
        pos += txt.length;

        //  This `switch` tests whether our node is safe for inclusion.
        switch (true) {

        //  If our node isn't a text node, it is safe.
        case nde.nodeType !== Node.TEXT_NODE:
          sfe = nde;
          break;

        //  Text nodes must have a non-word character after any colons.
        //  If the previous node wasn't safe, there must be a non-word
        //  character without any colons before.
        case !/:\w*$/.test(txt) && (lst === sfe || /^[^:]*\W/.test(txt)):
          sfe = nde;
          break;
        }

        //  Regardless, we append the node (for now).
        doc.appendChild(lst = nde);
      }
      return pos;
    }();

    //  The last-pushed item is inherently unsafe if there was a
    //  character change on the boundary.
    if (lst && lst === sfe && (idx >= cache.length || txt.charAt(0) !== value.charAt(ini))) {
      sfe = lst.previousSibling;
    }

    //  We add the inserted items to our result.
    if ((lmt = idx)) {
      res = cache.slice(0, lmt);
    }

    //  However, we need to remove any unsafe nodes.
    while (lst && lst !== sfe) {
      lst = (nde = lst).previousSibling;
      doc.removeChild(nde);
      res.pop();
      lmt--;
      ini -= stringify(nde).length;
    }

    //  Now we move our iteration variables to the end of our cache.
    lst = null;
    pos = value.length;

    //  We now do the same thing working from the end.
    let fin = ini >= value.length ? ini : function () {
      for (idx = cache.length - 1; idx > lmt; idx--) {  //  lmt will always be recalculated
        nde = cache[idx];
        if (typeof nde === 'string') {
          txt = nde;
          nde = document.createTextNode(txt);
        } else {
          txt = stringify(nde);
        }
        if (pos - txt.length <= ini || txt !== value.substr(pos - txt.length, txt.length)) {
          return pos;
        }
        pos -= txt.length;

        //  This `switch` tests whether our node is safe for inclusion.
        switch (true) {

        //  If our node isn't a text node, it is safe.
        case nde.nodeType !== Node.TEXT_NODE:
          sfe = nde;
          break;

        //  If our text node isn't full (8 characters), then it is NOT
        //  safe (this is to prevent excessive multiplication of text
        //  nodes).
        case txt.length < 8:
          break;

        //  Similarly, if this text node is bordering our limit, it
        //  isn't safe.
        case idx <= lmt + 1:
          break;

        //  Text nodes must have a non-word character before any
        //  colons.  If the previous node wasn't safe, there must be a
        //  non-word character without any colons after.
        case !/^\w*:/.test(txt) && (lst === sfe || /\W[^:]*$/.test(txt)):
          sfe = nde;
          break;
        }

        //  Regardless, we insert the node (for now).
        doc.insertBefore(nde, lst);
        lst = nde;
      }
      return pos;
    }();

    //  The last-pushed item is inherently unsafe if there was a
    //  character change on the boundary.
    if (lst && lst === sfe && (txt.charAt(txt.length) !== value.charAt(fin - 1))) {
      sfe = lst.nextSibling;
    }

    //  Again, we need to remove any unsafe nodes.  We can't add our
    //  cached items to our result just yet, though.
    while (lst && lst !== sfe) {
      lst = (nde = lst).nextSibling;
      doc.removeChild(nde);
      idx++;
      fin += stringify(nde).length;
    }

    //  Next, we process the text in-between our two diffs.
    pos = 0;
    txt = value.substring(ini, fin);
    sfe = true;

    //  We loop over each character in the string and look for a
    //  parseäble substring.
    while (pos < txt.length) {

      //  If our character is a line-break, we push a `<br>`.
      if (txt.charAt(pos) === '\n') {
        if (pos !== 0) {
          res.push(nde = txt.substr(0, pos));
          doc.insertBefore(document.createTextNode(nde), lst);
        }
        res.push(nde = document.createElement('BR'));
        doc.insertBefore(nde, lst);
        txt = txt.substr(pos + 1);
        pos = 0;
        sfe = true;
        continue;
      }

      //  Otherwise, we look for matches with emoji.  There may
      //  multiple.
      const matches = emoji.filter(function (emojo) {
        const emojiString = '' + emojo;
        const shortcodeString = emojo.name ? ':' + emojo.name + ':' : null;
        switch (true) {
        case emojiString && txt.substr(pos, emojiString.length) === emojiString && (emojiString.charAt(emojiString.length - 1) === '\ufe0f' || txt.charAt(pos + emojiString.length) !== '\ufe0e'):
          return true;
        case sfe && shortcodeString && txt.substr(pos, shortcodeString.length) === shortcodeString && (!txt.charAt(pos + shortcodeString.length) || !/[\w:]/.test(txt.charAt(pos + shortcodeString.length))):
          return true;
        default:
          return false;
        }
      });

      //  If we have a match, then we need to process it.
      if (matches.length) {

        //  From our list of matches, we select the longest one. This will
        //  be unique unless there are multiple emoji with the same string
        //  value, in which case we will select the first one.
        const emojo = matches.reduce(
          (longest, current) => longest && ('' + longest).length > ('' + current).length ? longest : current
        );
        const emojiString = '' + emojo;
        let match = emojiString && txt.substr(pos, emojiString.length) === emojiString && (emojiString.charAt(emojiString.length - 1) === '\ufe0f' || txt.charAt(pos + emojiString.length) !== '\ufe0e') ? emojiString : ':' + emojo.name + ':';

        //  We gobble the following U+FE0F character if one exists and
        //  our match doesn't end with one.
        if (txt.charAt(pos + match.length) === '\ufe0f' && match.charAt(match.length - 1) !== '\ufe0f') {
          match += '\ufe0f';
        }

        //  If there was text prior to this emoji, we push it to our
        //  result.  Then we push the emoji image.
        if (pos !== 0) {
          res.push(nde = txt.substr(0, pos));
          doc.insertBefore(document.createTextNode(nde), lst);
        }
        res.push(nde = emojo.toImage(!autoplay));
        doc.insertBefore(nde, lst);

        //  We now trim the processed text off of our `text` string and
        //  reset the index to `0`.
        txt = txt.substr(pos + match.length);
        pos = 0;
        sfe = true;
        continue;
      }

      //  If we've processed 8 or more characters, we go ahead and push
      //  them.  This helps to keep our diffs small.  Note that there
      //  is no guarantee that these chunks will stay this size.
      if (pos >= 7) {  //  Because our first character is 0
        res.push(nde = txt.substr(0, pos + 1));
        doc.insertBefore(document.createTextNode(nde), lst);
        sfe = !/[\w:]/.test(txt.charAt(pos));
        txt = txt.substr(pos + 1);
        pos = 0;
        continue;
      }

      //  Otherwise, we increment our index and move on.
      sfe = !/[\w:]/.test(txt.charAt(pos));
      pos++;
    }

    //  If our `txt` didn't end in a parseäble entity, there will still
    //  be some leftover text to push.
    if (txt) {
      res.push(txt);
      doc.insertBefore(document.createTextNode(txt), lst);
    }

    //  Now we can add the cached final entries to our result.
    res = res.concat(cache.slice(idx + 1));

    //  We store our result for next time and insert our contents.
    this.cache = res;
    node.appendChild(doc);

    //  If our node is empty, we set the `empty` class.
    if (value === '' || value === '\n') {
      node.classList.add('empty');
    } else {
      node.classList.remove('empty');
    }

    //  Finally, we restore our caret position.
    restoreCaretPos();
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
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }
    if (!node) {
      onChange('\n');
      return;
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
    let out = '';
    while (wkr.nextNode()) {
      out += stringify(wkr.currentNode);
    }
    if (out.length && out.slice(-1) !== '\n') {
      out += '\n';
    }
    onChange(out);
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
    if (!composing) {
      getContents();
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

  //  When inserting content, we insert it directly into the DOM of our
  //  text area, replacing any selection.  But then we call
  //  `onChange()` to update our text area with properly formatted
  //  contents.
  insertContent (content) {
    const {
      getContents,
      node,
    } = this;
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
    getContents();
  }

  //  Rendering.
  render () {
    const {
      composing,
      handleEvent,
      handleRef,
    } = this;
    const {
      className,
      disabled,
      value,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--TEXT_AREA', {
      composing,
      disabled,
      empty: value === '\n' || value === '',
    }, className);

    //  `fillContents()` fills our element with contents.  We don't let
    //  React manage this to recycle nodes.
    return (
      <div
        aria-label={ℳ.label}
        className={computedClass}
        contentEditable={!disabled}
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

  //  Restoring our caret position.  The `offset` argument can be used
  //  to adjust where to place the caret.
  restoreCaretPos () {
    const {
      caret,
      node,
    } = this;
    const { value } = this.props;
    if (!node) return;
    const sel = window.getSelection();
    const rng = document.createRange();
    const wkr = document.createTreeWalker(node);
    let idx = 0;
    let nde = null;
    let success = false;

    //  If our `caret` is as long as our `value`, we already know it
    //  goes at the end.
    if (caret >= value.length - 1) success = true;

    //  This loop breaks if we run out of nodes, or find the node that
    //  our caret belongs in.  It properly handles the case where the
    //  caret belongs between two `<br>`s.
    while (!success && wkr.nextNode()) {
      nde = wkr.currentNode;
      if (nde.nodeType === Node.TEXT_NODE) {
        if (idx <= caret && caret <= idx + nde.textContent.length) {
          success = true;
          break;
        } else idx += nde.textContent.length;
      } else if (nde.tagName.toUpperCase() === 'BR') {
        if (++idx === caret) {
          success = true;
          break;
        }
      } else if (nde.tagName.toUpperCase() === 'IMG') {
        if ((idx += nde.alt.length) >= caret) {
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
      if (nde.nodeType === Node.TEXT_NODE) rng.setEnd(nde, caret - idx);
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

  //  Our composer contents are not managed by React.  We only update
  //  the component if a prop related to some other aspect of the
  //  composer changes.
  shouldComponentUpdate (nextProps) {
    const {
      fillContents,
      storeCaretPos,
    } = this;
    const {
      autoplay,
      className,
      disabled,
      emoji,
      onChange,
      value,
      ℳ,
    } = this.props;

    //  This `switch` is just to improve readability.
    switch (true) {
    case autoplay !== nextProps.autoplay:
      this.cache = [];
      storeCaretPos();
      fillContents(nextProps.value);
      return false;
    case className !== nextProps.className:
    case disabled !== nextProps.disabled:
    case emoji !== nextProps.emoji:
    case onChange !== nextProps.onChange:
    case ℳ !== nextProps.ℳ:
      return true;
    case value !== nextProps.value:
      storeCaretPos();
      fillContents(nextProps.value);
      return false;
    default:
      return false;
    }
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
