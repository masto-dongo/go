//  <ConnectedParseEmoji>
//  =====================

//  <ConnectedParseEmoji> parses a string to insert emoji images.  The
//  emoji are specified via the `emojifier` prop, which is passed
//  through from the parent <ConnectedParse> component.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonImage } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { Emoji } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedParseEmoji ({
  autoplay,
  className,
  emoji,
  text: string,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE--EMOJI', className);

  //  We store our result in an array.
  const result = [];
  let text = '' + string;
  let i = 0;
  let inWord = false;

  //  We loop over each character in the string and look for a match
  //  with any one of the emoji.  We may have multiple matches if there
  //  are multiple emoji with the same starting character.
  while (i < text.length) {
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
      const {
        href,
        name,
        title,
        staticHref,
        str,
      } = emojo;
      const match = str && text.substr(i, str.length) === str && (str.charAt(str.length - 1) === '\ufe0f' || text.charAt(i + str.length) !== '\ufe0e') ? str : ':' + emojo.name + ':';

      //  If there was text prior to this emoji, we push it to our
      //  result.  Then we push the emoji image.
      if (i !== 0) {
        result.push(text.substr(0, i));
      }
      result.push(
        <CommonImage
          animatedSrc={href}
          alt={str || (name ? ':' + name + ':' : title)}
          autoplay={autoplay}
          className='emoji'
          description={title || name}
          key={result.length}
          staticSrc={staticHref}
        />
      );

      if (text.charAt(i + match.length) === '\ufe0f' && match.charAt(match.length - 1) !== '\ufe0f') {
        i++;
      }

      //  We now trim the processed text off of our `text` string and
      //  reset the index to `0`.
      text = text.substr(i + match.length);
      i = 0;
      inWord = false;
      continue;
    }

    //  Otherwise, we increment our index and move on.
    inWord = /[\w:]/.test(text.charAt(i));
    i++;
  }

  //  If our `text` didn't end in an emoji, there will still be some
  //  leftover text to push.
  if (text) {
    result.push(text);
  }

  //  We can now put our `result` in a `<span>` and return the result.
  return <span className={computedClass}>{result}</span>;
}

//  Props.
ConnectedParseEmoji.propTypes = {
  autoplay: PropTypes.bool,  //  `true` if animated emoji should be autoplayed
  className: PropTypes.string,
  emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)).isRequired,  //  An array of emoji
  text: PropTypes.string.isRequired,  //  The text to process
};
