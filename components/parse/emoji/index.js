import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { DOMParser } from 'themes/mastodon-go/util/polyfills';
import {
  Emoji,
  Emojifier,
} from 'themes/mastodon-go/util/emojify';

const ParseEmoji = ({
  className,
  emojifier,
  text,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--PARSE--EMOJI', className);
  const emoji = emojifier.emoji;
  const result = [];
  for (let i = 0; i < string.length; i++) {
    const matches = emoji.filter(
      emojo => {
        const emojiString = '' + emojo;
        return text.substr(i, emojiString.length) === emojiString;
      }
    );
    if (matches.length) {
      const emojo = matches.reduce(
        (longest, current) => ('' + longest).length > ('' + current).length ? longest : current,
      0);
      const {
        name,
        location,
        title,
      } = emojo;
      const selector = '';  //  TK: Selector support forthcoming
      result.push(string.substr(0, i));
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
      text = text.substr(i + ('' + emoji).length);
      i = 0;
    }
  }
  if (text) {
    result.push(text);
  }
  return (
    <span
      className={computedClass}
      {...rest}
    >{result}</span>
  );
}

ParseEmoji.propTypes = {
  className: PropTypes.string,
  emojifier: PropTypes.instanceOf(Emojifier),
  text: PropTypes.string.isRequired,
}

export default ParseEmoji;
