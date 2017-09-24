import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Emojifier } from 'mastodon-go/util/emoji';

const Type = {
  ACCOUNT: new String('ACCOUNT'),
  EMOJI: new String('EMOJI'),
  STATUS: new String('STATUS'),
  TEXT: new String('TEXT'),
}

export default class Parser extends React.PureComponent {

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
    const computedClass = classNames('MASTODON_GO--PARSER', className);
    const Component = (
      () => {
        switch (type) {
        case Parser.Type.ACCOUNT:
          return ParserAccountBio;
        case Parser.Type.EMOJI:
          return ParserEmoji;
        case Parser.Type.STATUS:
          return ParserStatusContent;
        case Parser.Type.TEXT:
          return ParserTextContent;
        default:
          return null;
        }
      }
    )();
    if (!Component) return null;
    return (
      <Component
        className={computedClass}
        {...(type === Parser.Type.EMOJI ? { emojifier } : {})}
        html={html}
        text={text}
        {...rest}
      />
    );
  }

}
