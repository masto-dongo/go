/*

`<ComposerTextArea>`
====================

The `<ComposerTextArea>` component provides a semi-rich-text editor. We
store the plain-text value of the textbox in an instance variable and
then pass it up to its parent component through `onChange()`.
Similarly, the value property passed down contains HTML-formatted
content with which to update our box.

This component is based off of a very similar one I wrote for my
frontend "Labcoat", but rewritten and improved for use with Mastodon.

*/

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

export default class ConnectedComposerTextArea extends React.PureComponent {

  constructor (props) {
    super(props);

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

    //  Variables.
    this.caret = 0;
    this.input = null;
  }

  componentWillMount () {
    const { handleInsert } = this;
    DOMListen(DOMEventInsert, handleInsert);
  }
  componentWillUnmount () {
    const { handleInsert } = this;
    DOMForget(DOMEventInsert, handleInsert);
  }

  //  We get the value of the component on mounting.
  componentDidMount () {
    const { getContents } = this;
    const { onChange } = this.props;
    if (onChange) onChange(getContents());
  }

  //  This gets the contents of the text area.  This is a little more
  //  complicated than it would otherwise be since we have to account
  //  for `<br>`s.  We walk the tree of our element and collect the
  //  content of every text node, additionally inserting a `'\n'` for
  //  each `<br>` we find.  In essence, this is just a `<br>`-aware
  //  `Element.textContent`.
  getContents () {
    const { input } = this;
    if (!input) {
      return '\n';
    }
    let wkr = document.createTreeWalker(input, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode (node) {
        const nodeName = node.nodeName.toUpperCase();
        switch (true) {
        case node.nodeType === Node.TEXT_NODE:
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
      input,
    } = this;
    const { onChange } = this.props;
    const node = content instanceof Node ? content : document.createTextNode(content);
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const rng = sel.getRangeAt(0);
      rng.deleteContents();
      rng.insertNode(node);
      rng.setEndAfter(node);
      rng.collapse(false);
      sel.removeAllRanges();
      sel.addRange(rng);
    } else {
      input.appendChild(node);
    }
    if (onChange) {
      onChange(getContents());
    }
  }

  //  For the most part, we just call `getContents()` to update our
  //  value whenever something happens to our textbox.  However, if the
  //  user types "enter" then we need to ensure that the result is just
  //  a simple `<br>` element and not some weird `<div>`-induced magic
  //  that browsers like Chrome (and now Firefox) like to pull.
  handleEvent (e) {
    const {
      getContents,
      insertContent,
    } = this;
    const { onChange } = this.props;
    if (e.type === 'keypress') {
      if (e.key === 'Enter' || e.keyCode === 0x0D) {
        e.preventDefault();
        insertContent(document.createElement('br'));
      }
      return;
    }
    if (onChange) {
      onChange(getContents());
    }
  }

  handleInsert ({ text }) {
    const { insertContent } = this;
    insertContent(text);
  }

  //  Storing our caret position.
  storeCaretPos () {

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
    pre.selectNodeContents(this.input);
    pre.setEnd(rng.endContainer, rng.endOffset);

    //  This next line tells us how many line breaks were in the
    //  selected range.  This is a somewhat expensive operation as it
    //  involves cloning DOM nodes, but there isn't any faster way.
    const brs = pre.cloneContents().querySelectorAll('br').length;

    //  We can now find the length of the selection by adding the
    //  length of the text content to the number of line breaks.
    this.caret = pre.toString().length + brs;
  }

  //  Restoring our caret position.  The `offset` argument can be used
  //  to adjust where to place the caret.
  restoreCaretPos (offset = 0) {
    const { input, caret } = this;
    const { value } = this.props;
    if (!input) return;
    const sel = window.getSelection();
    const rng = document.createRange();
    const wkr = document.createTreeWalker(input);
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
    while (wkr.nextNode()) {
      nde = wkr.currentNode;
      if (nde.nodeType === Node.TEXT_NODE) {
        if (idx <= caret && dst <= idx + nde.textContent.length) {
          success = true;
          break;
        } else idx += nde.textContent.length;
      } else if (
        nde.nodeType === Node.ELEMENT_NODE &&
        nde.tagName.toUpperCase() === 'BR'
      ) {
        if (idx++ === dst) {
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
      else rng.selectNodeContents(nde);
    } else if (
      input.lastChild &&
      input.lastChild.nodeName.toUpperCase() === 'BR'
    ) rng.setEnd(input, input.childNodes.length - 1);
    else rng.selectNodeContents(input);
    rng.collapse(false);
    sel.removeAllRanges();
    sel.addRange(rng);
  }

  //  We use `componentWillUpdate()` to grab the caret position before
  //  updating, and `componentDidUpdate()` to set it afterwards.
  componentWillUpdate (nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.storeCaretPos();
    }
  }
  componentDidUpdate (prevProps) {
    const { value } = this.props;
    if (prevProps.value !== value) {
      this.restoreCaretPos();
    }
  }

  //  Storing a reference to our input.
  handleRef (input) {
    this.input = input;
  }

  //  Rendering.
  render () {
    const {
      handleEvent,
      handleRef,
    } = this;
    const {
      className,
      disabled,
      emoji,
      value,
      ℳ,
    } = this.props;

    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--TEXT_AREA', {
      empty: (
        value === '\n' ||
        value === ''
      ),
    }, className);

    //  We store our result in an array.
    let text = value;
    const result = [];
    let i = 0;

    //  We loop over each character in the string and look for a
    //  parseäble substring.
    while (i < text.length) {

      //  If our character is a line-break, we push a `<br>`.
      if (text.charAt(i) === '\n') {
        if (i !== 0) {
          result.push(text.substr(0, i));
        }
        result.push('<br>');
        text = text.substr(i + 1);
        i = 0;
        continue;
      }

      //  Otherwise, we look for matches with emoji.  There may
      //  multiple.
      const matches = emoji.filter(
        emojo => {
          const emojiString = '' + emojo;
          return text.substr(i, emojiString.length) === emojiString;
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
        const selector = '';  //  TK: Selector support forthcoming

        //  If there was text prior to this emoji, we push it to our
        //  result.  Then we push the emoji image.
        if (i !== 0) {
          result.push(text.substr(0, i));
        }
        result.push(emojo.toImage(selector).outerHTML || emojo + selector);

        //  We now trim the processed text off of our `text` string and
        //  reset the index to `0`.
        text = text.substr(i + (emojo + selector).length);
        i = 0;
        continue;
      }

      //  Otherwise, we increment our index and move on.
      i++;
    }

    //  If our `text` didn't end in a parseäble entity, there will
    //  still be some leftover text to push.
    if (text) {
      result.push(text);
    }

    return (
      <div
        aria-label={ℳ.label}
        className={computedClass}
        contentEditable={!disabled}
        dangerouslySetInnerHTML={{ __html: result.join('') }}
        onKeyPress={handleEvent}
        onInput={handleEvent}
        onBlur={handleEvent}
        ref={handleRef}
        tabIndex='0'
      />
    );
  }

}

ConnectedComposerTextArea.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  ℳ: PropTypes.func.isRequired,
};
