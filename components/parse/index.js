import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import ParseEmoji from './emoji';
import ParseStatusContent from './status_content';

import { Emojifier } from 'themes/mastodon-go/util/emojify';

const Type = {
  ACCOUNT: new String('ACCOUNT'),
  EMOJI: new String('EMOJI'),
  STATUS: new String('STATUS'),
  TEXT: new String('TEXT'),
}

export default class Parse extends React.PureComponent {

  static propTypes = {
    card: ImmutablePropTypes.map,
    className: PropTypes.string,
    emojifier: PropTypes.instanceOf(Emojifier),
    history: PropTypes.object,
    intl: PropTypes.object,
    location: PropTypes.object,  //  Not updated; don't use
    match: PropTypes.object,  //  Not updated; don't use
    mentions: ImmutablePropTypes.list,
    tags: ImmutablePropTypes.list,
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
      card,
      className,
      emojifier,
      history,
      intl,
      location,
      match,
      mentions,
      tags,
      text,
      type,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--PARSE', className);
    switch (type) {
    case Parse.Type.ACCOUNT:
      return (
        <ParseAccountBio
          className={computedClass}
          text={text}
        />
      );
    case Parse.Type.EMOJI:
      return (
        <ParseEmoji
          className={computedClass}
          emojifier={emojifier}
          text={text}
          {...rest}
        />
      );
    case Parse.Type.STATUS:
      return (
        <ParseStatusContent
          card={card}
          className={computedClass}
          history={history}
          intl={intl}
          mentions={mentions}
          tags={tags}
          text={text}
          {...rest}
        />
      );
    case Parse.Type.TEXT:
      return (
        <ParseTextContent
          className={computedClass}
          text={text}
          {...rest}
        />
      );
    default:
      return null;
    }
  }

}
