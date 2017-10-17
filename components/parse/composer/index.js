

//  Imports
//  -------

//  Package imports.
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseComposer ({
  emojifier,
  text,
}) {

  //  We grab all of our emoji from the emojifier. This is a shallow
  //  clone operation so it's a little expensive, but it is unlikely
  //  that this component will ever need to re-render.
  const emoji = emojifier.emoji;

  //  We store our result in an array.
  const result = [];

  //  We loop over each character in the string and look for a
  //  parseäble substring.
  for (let i = 0; i < text.length; i++) {

    //  If our character is a line-break, we push a `<br>`.
    if (text.charAt(i) === '\n') {
      result.push(text.substr(0, i));
      result.push(<br />);
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
    }
  }

  //  If our `text` didn't end in an emoji, there will still be some
  //  leftover text to push.
  if (text) {
    result.push(text);
  }

  //  We can now return our `result` as a React fragment.  This eases
  //  processing but note that it also makes these contents practically
  //  inaccessible via `<Parse>` stylesheets.
  return result;
}

//  Props.
ParseComposer.propTypes = {
  emojifier: PropTypes.instanceOf(Emojifier),
  text: PropTypes.string.isRequired,
};
