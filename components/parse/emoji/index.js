/*********************************************************************\
|                                                                     |
|   <ParseEmoji>                                                      |
|   ============                                                      |
|                                                                     |
|   <ParseEmoji> parses a string to insert emoji images.  The emoji   |
|   are specified via the `emojifier` prop, which is passed through   |
|   from the parent <Parse> component.                                |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import escape from 'escape-html';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style';

//  Other imports.
import { DOMParser } from 'themes/mastodon-go/util/polyfills';
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseEmoji ({
  className,
  emojifier,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--EMOJI', className);

  //  We grab all of our emoji from the emojifier. This is a shallow
  //  clone operation so it's a little expensive, but it is unlikely
  //  that this component will ever need to re-render.
  const emoji = emojifier.emoji;

  //  We store our result in an array.
  const result = [];

  //  We don't allow HTML contents in `<ParseEmoji>`.
  escapedText = escape(text);

  //  We loop over each character in the string and look for a match
  //  with any one of the emoji.  We may have multiple matches if there
  //  are multiple emoji with the same starting character.
  for (let i = 0; i < text.length; i++) {
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
      const {
        name,
        location,
        title,
      } = emojo;
      const selector = '';  //  TK: Selector support forthcoming

      //  If there was text prior to this emoji, we push it to our
      //  result.  Then we push the emoji image.
      if (i !== 0) {
        result.push(string.substr(0, i));
      }
      result.push(
        <img
          alt={emojo + selector}
          className='emoji'
          draggable='false'
          key={result.length}
          src={(location[location.length - 1] === '/' ? location : location + '/') + emojo.toFilename()}
          title={title || name}
        />
      );

      //  We now trim the processed text off of our `text` string and
      //  reset the index to `0`.
      text = text.substr(i + ('' + emoji).length);
      i = 0;
    }
  }

  //  If our `text` didn't end in an emoji, there will still be some
  //  leftover text to push.
  if (text) {
    result.push(text);
  }

  //  We can now put our `result` in a `<span>` and return the result.
  return (
    <span
      className={computedClass}
      {...rest}
    >{result}</span>
  );
}

//  Props.
ParseEmoji.propTypes = {
  className: PropTypes.string,
  emojifier: PropTypes.instanceOf(Emojifier),
  text: PropTypes.string.isRequired,
}
