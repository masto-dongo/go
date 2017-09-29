import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import ParseEmoji from './emoji'

import { Emojifier } from 'themes/mastodon-go/util/emojify';

const Type = {
  ACCOUNT: new String('ACCOUNT'),
  EMOJI: new String('EMOJI'),
  STATUS: new String('STATUS'),
  TEXT: new String('TEXT'),
}

export default class Parse extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    emojifier: PropTypes.instanceOf(Emojifier),
    html: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.oneOf([
      Type.ACCOUNT,
      Type.EMOJI,
      Type.STATUS,
      Type.TEXT,
    ]),
  }

  static Type = Type

  render () {
    const {
      className,
      emojifier,
      html,
      text,
      type,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--PARSE', className);
    const Component = (
      () => {
        switch (type) {
        case Parse.Type.ACCOUNT:
          return ParseAccountBio;
        case Parse.Type.EMOJI:
          return ParseEmoji;
        case Parse.Type.STATUS:
          return ParseStatusContent;
        case Parse.Type.TEXT:
          return ParseTextContent;
        default:
          return null;
        }
      }
    )();
    if (!Component) return null;
    return (
      <Component
        className={computedClass}
        emojifier={emojifier}
        text={text}
        {...rest}
      />
    );
  }

}
