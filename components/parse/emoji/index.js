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
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style';

//  Other imports.
import { Emoji } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseEmoji ({
  className,
  emoji,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--EMOJI', className);

  //  We store our result in an array.
  const result = [];
  let i = 0;

  //  We loop over each character in the string and look for a match
  //  with any one of the emoji.  We may have multiple matches if there
  //  are multiple emoji with the same starting character.
  while (i < text.length) {
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
        title,
      } = emojo;
      const selector = '';  //  TK: Selector support forthcoming

      //  If there was text prior to this emoji, we push it to our
      //  result.  Then we push the emoji image.
      if (i !== 0) {
        result.push(text.substr(0, i));
      }
      result.push(
        <img
          alt={emojo + selector}
          className='emoji'
          draggable='false'
          key={result.length}
          src={emojo.toLocation()}
          title={title || name}
        />
      );

      //  We now trim the processed text off of our `text` string and
      //  reset the index to `0`.
      text = text.substr(i + ('' + emoji).length);
      i = 0;
      continue;
    }

    //  Otherwise, we increment our index and move on.
    i++;
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
  emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)).isRequired,
  text: PropTypes.string.isRequired,
};
