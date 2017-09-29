/*

`<ComposerTextArea>`
==========================

>   For more information on the contents of this file, please contact:
>
>   - kibigo! [@kibi@glitch.social]

The `<ComposerTextArea>` component provides a semi-rich-text editor. We
store the plain-text value of the textbox in an instance variable and
then pass it up to its parent component through `onChange()`.
Similarly, the value property passed down contains HTML-formatted
content with which to update our box.

This component is based off of a very similar one I wrote for my
frontend "Labcoat", but rewritten and improved for use with Mastodon.

__Props:__

 -  __`onChange` (`PropTypes.func`) :__
    The function to call when the text area receives input.

 -  __`label` (`PropTypes.string`) :__
    The `aria-label` to assign to the text area.

 -  __`innerHTML` (`PropTypes.string`) :__
    The formatted contents of the text area.

*/

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Imports:
--------

*/

//  Package imports
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

//  Stylesheet imports
import './style';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Implementation:
---------------

*/

export default class ComposerTextArea extends React.PureComponent {

/*

###  Setting up our variables:

`innerHTML` defaults to `<br>` if it isn't provided. `input` will
hold a reference to the `<div>` element that serves as our text
area, `caret` stores the current caret position, and `value`
stores the (plain-text) value of the text area.

*/

  static propTypes = {
    disabled  : PropTypes.bool,
    innerHTML : PropTypes.string,
    label     : PropTypes.string,
    onChange  : PropTypes.func,
    onSubmit  : PropTypes.func,
  };
  static defaultProps = {
    innerHTML: '<br>',
  };
  input = null;
  caret = 0;

/*

###  Mounting our component

When our component mounts, we immediately set its `value` using
`getContents()`.

*/

  componentDidMount () {
    const { input, getContents } = this;
    const { onChange } = this.props;
    if (onChange) onChange(getContents());
  }

/*

###  Updating our component

We will only update our component if the `innerHTML` we receive is
different from that already used by our `input`. This prevents us from
having to run the complicated code to update the caret position when
it isn't necessary.

*/

  shouldComponentUpdate (nextProps) {
    if (!this.input) return true;
    else return nextProps.innerHTML !== this.input.innerHTML;
  }

/*

###  Retrieving text area contents

This is a little more complicated than it would otherwise be since we
have to account for `<br>`s. We walk the tree of our element and
collect the content of every text node, additionally inserting a `'\n'`
for each `<br>` we find. In essence, this is just a `<br>`-aware
`Element.textContent`.

*/

  getContents = () => {
    if (!this.input) return;
    let wkr = document.createTreeWalker(this.input)
    let nde = null;
    let out = '';
    while (wkr.nextNode()) {
      nde = wkr.currentNode;
      if (nde.nodeType === Node.TEXT_NODE) out += nde.textContent;
      else if (nde.nodeType === Node.ELEMENT_NODE) {
        switch (nde.tagName.toUpperCase()) {
        case 'BR':
          out += '\n';
          break;
        case 'IMG':
          out += nde.alt;
          break;
        }
      }
    }
    if (out.length && out.slice(-1) !== '\n') out += '\n';
  }

/*

###  Inserting content

When inserting content, we insert it directly into the DOM of our text
area, replacing any selection. But then we call `onChange()` to update
our text area with properly formatted contents.

*/

  insertContent = (content) => {
    const { getContents } = this;
    const { onChange } = this.props;
    const node = content instanceof Node ? content : document.createTextNode(content);
    const sel = window.getSelection();
    const rng = sel.getRangeAt(0);
    rng.deleteContents();
    rng.insertNode(node);
    rng.setEndAfter(node);
    rng.collapse(false);
    sel.removeAllRanges();
    sel.addRange(rng);
    if (onChange) onChange(getContents());
  }

/*

###  Event handling

For the most part, we just call `getContents()` to update our value
whenever something happens to our textbox. However, if the user types
"enter" then we need to ensure that the result is just a simple `<br>`
element and not some weird `<div>`-induced magic that browsers like
Chrome like to pull.

This is a somewhat complicated procedure which involves finding the
caret position, deleting any selected contents, inserting a `<br>`
element in their place, and then updating the caret to be positioned
just after the `<br>`.

*/

  handleEvent = e => {
    const { getContents, insertContent } = this;
    const { onChange, onSubmit } = this.props;
    if (e.type === 'keypress') {
      if (e.key === 'Enter' || e.keyCode === 0x0D) {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) onSubmit();
        else insertContent(document.createElement('br'));
      }
      return;
    }
    if (onChange) onChange(getContents());
  }

/*

###  Storing the caret position

This function gets our current caret position, so we can put it back
after we insert our formatted text.

*/

  storeCaretPos = () => {
    this.caret = 0;

/*

We store the current selection with `sel` and the current range of the
selection with `rng`.

*/

    const sel = window.getSelection();
    const rng = sel.getRangeAt(0);

/*

`pre` is a range consisting of everything leading up to the end of
`rng`. First we select our entire text area, and then we set the
endpoint of the range to be the endpoint of our current selection.

*/

    const pre = rng.cloneRange();
    pre.selectNodeContents(this.input);
    pre.setEnd(rng.endContainer, rng.endOffset);

/*

This next line tells us how many line breaks were in the selected
range. This is a somewhat expensive operation as it involves cloning
DOM nodes, but there isn't any faster way.

*/

    const brs = pre.cloneContents().querySelectorAll('br').length;

/*

We can now find the length of the selection by adding length of the
text content to the number of line breaks.

*/

    this.caret = pre.toString().length + brs;
  }

/*

###  Restoring the caret position

This function sets the caret position to what we have stored. We will
use a `TreeWalker` to walk the contents of our text area until we find
the correct position to stick our caret.

The `offset` argument can be used to adjust where to place the caret.

*/

  restoreCaretPos = (offset = 0) => {
    const { input, caret, value } = this;
    if (!input) return;
    const sel = window.getSelection();
    const rng = document.createRange();
    const wkr = document.createTreeWalker(input);
    const dst = caret + offset;
    let idx = 0;
    let nde = null;
    let success = false;

/*

If our `caret` is as long as our `value`, we can cut straight to the
chase and stick our caret at the end.

*/

    if (dst >= value.length - 1) success = true;

/*

This loop breaks when either we run out of nodes, or we find the text
node that our caret belongs in. It will also break if we wind up in=
between two `<br>`s, which is a possibility.

*/

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

/*

If we were successfull, we set the end of our range to the point we
found. If we weren't, we select the textbox's entire contents, save the
final `<br>`, if present. Either way, we `collapse()` the range to its
endpoint and move the caret there.

*/

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

/*

###  Mangaing caret position before and after updating

We use `componentWillUpdate()` to grab the caret position right before
updating, and `componentDidUpdate()` to set it right after.

*/

  componentWillUpdate () {
    this.storeCaretPos();
  }
  componentDidUpdate () {
    this.restoreCaretPos();
  }

/*

###  Storing a reference to the current node

`setRef()` stores a reference to our `<div>` in `this.input`.

*/

  setRef = c => {
    this.input = c;
  }

/*

###  Rendering

For all its complexity, `<ComposerTextArea>` is just a single `<div>`.
We set the `empty` class if it is empty *or* consists of only a line=
break, and set the contents to our passed `innerHTML`.

*/

  render () {
    const { handleEvent, setRef } = this;
    const { innerHTML, label, disabled } = this.props;

    const className = classNames('glitch', 'composer__text-area', {
      empty: (
        innerHTML.toLowerCase === '<br>' ||
        innerHTML === '\n' ||
        innerHTML === ''
      ),
    });

    return (
      <div
        className={className}
        contentEditable={!disabled}
        onKeyPress={handleEvent}
        onInput={handleEvent}
        onBlur={handleEvent}
        ref={setRef}
        aria-label={label}
        tabIndex='0'
        dangerouslySetHTML={{ __html: innerHTML }}
      />
    );
  }

}
