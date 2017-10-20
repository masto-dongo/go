//  <Reference>
//  ===========

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Requests.
import {
  ensureTimeline,
  fetchAccount,
} from 'themes/mastodon-go/redux';

//  Component imports.
import {
  CommonButton,
  CommonLink,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Reference extends React.PureComponent {

  constructor (props) {
    super(props);
    const { '💪': { fetch } } = props;
    fetch();
  }

  //  Rendering.
  render () {
    const {
      attachment,
      card,
      className,
      history,
      mention,
      showAt,
      showHash,
      tagName,
      ℳ,
      '🏪': {
        at,
        href,
        mediaType,
        rainbow,
        title,
        username,
      },
      '💪': handler,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--REFERENCE', {
      attachment,
      card,
      mention,
      tagName,
    }, className);
    let defaultTitle = '';
    let icon = '';

    //  What we render depends on the props we are given.
    switch (true) {

    //  If we are given an `attachment`, we render a button with
    //  the appropriate `icon` and `title`.
    case !!attachment:
      switch (mediaType) {
      case MEDIA_TYPE.GIFV:
      case MEDIA_TYPE.IMAGE:
        defaultTitle = intl.formatMessage(messages.image);
        icon = 'picture-o';
        break;
      case MEDIA_TYPE.VIDEO:
        defaultTitle = intl.formatMessage(messages.video);
        icon = 'video-camera';
        break;
      default:
        defaultTitle = intl.formatMessage(messages.unknown);
        icon = 'question';
        break;
      }
      return (
        <CommonButton
          className={computedClass}
          href={href}
          icon={icon}
          style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : {}}
          title={title || defaultTitle}
          {...rest}
        />
      );

    //  If we are given a `card`, we render a card button.
    case !!card:
      return (
        <CommonButton
          className={computedClass}
          href={href}
          icon={'id-card-o'}
          style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : {}}
          title={title || intl.formatMessage(messages.card)}
          {...rest}
        />
      );

    //  If we are given a `mention`, we render a link to the
    //  account's profile.
    case !!mention:
      return (
        <CommonLink
          className={computedClass}
          destination={`/profile/${mention}`}
          history={history}
          href={href}
          title={title || '@' + at}
          {...rest}
        >
          <code style={rainbow ? { color: rainbow.get('1') } : {}}>
            {showAt && username ? <span className='at'>@</span> : null}
            <span className='username'>{username || mention}</span>
          </code>
        </CommonLink>
      );

    //  If we are given a `tagName`, we render a link to the
    //  appropriate hashtag timeline.
    case !!tagName:
      return (
        <CommonLink
          className={computedClass}
          destination={`/tagged/${tagName}`}
          history={history}
          href={href}
          title={intl.formatMessage(messages.hashtag, { tagName })}
          {...rest}
        >
          <b style={rainbow ? { color: rainbow.get('1') } : {}}>
            {showHash ? <span className='hash'>#</span> : null}
            <span className='tagname'>{tagName}</span>
          </b>
        </CommonLink>
      );
    default:
      return null;
    }
  }

}

Reference.propTypes = {
  attachment: PropTypes.string,
  card: PropTypes.string,
  className: PropTypes.string,
  history: PropTypes.object,
  mention: PropTypes.string,
  showAt: PropTypes.bool,
  showHash: PropTypes.bool,
  tagName: PropTypes.string,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    at: PropTypes.string,
    href: PropTypes.string,
    mediaType: PropTypes.number,
    rainbow: ImmutablePropTypes.map,
    title: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(

  //  Component.
  Reference,

  //  Store.
  createStructuredSelector({
    at: (state, { mention }) => mention ? state.getIn(['account', mention, 'at']) : null,
    href: (state, {
      attachment,
      card,
      mention,
      tagName,
    }) => {
      switch (true) {
      case !!attachment:
        return state.getIn(['attachment', attachment, 'href']);
      case !!card:
        return state.getIn(['card', card, 'href']);
      case !!mention:
        return state.getIn(['account', mention, 'href']);
      case !!tagName:
        return state.getIn(['tag', tagName, 'href']);
      default:
        return void 0;
      }
    },
    mediaType: (state, { attachment }) => attachment ? state.getIn(['attachment', attachment, 'type']) : null,
    rainbow: (state, {
      attachment,
      card,
      mention,
      tagName,
    }) => {
      switch (true) {
      case !!attachment:
        return state.getIn(['attachment', attachment, 'rainbow']);
      case !!card:
        return state.getIn(['card', card, 'rainbow']);
      case !!mention:
        return state.getIn(['account', mention, 'rainbow']);
      case !!tagName:
        return state.getIn(['tag', `/api/v1/timelines/tag/${tagName}`, 'rainbow']);
      default:
        return void 0;
      }
    },
    title: (state, {
      attachment,
      card,
      mention,
      tagName,
    }) => {
      switch (true) {
      case !!attachment:
        return state.getIn(['attachment', attachment, 'description']);
      case !!card:
        return state.getIn(['card', card, 'title']);
      case !!mention:
        return state.getIn(['account', mention, 'at']);
      case !!tagName:
        return tagName;
      default:
        return void 0;
      }
    },
    username: (state, { mention }) => mention ? state.getIn(['account', mention, 'username']) : null,
  }),

  //  Messages.
  defineMessages({
    card: {
      defaultMessage: 'Card',
      id: 'reference.card',
    },
    hashtag: {
      defaultMessage: 'Hashtag #{tagName}',
      id: 'reference.hashtag',
    },
    image: {
      defaultMessage: 'Image',
      id: 'reference.image',
    },
    unknown: {
      defaultMessage: 'Unknown attachment',
      id: 'reference.unknown',
    },
    video: {
      defaultMessage: 'Video',
      id: 'reference.video',
    },
  }),

  //  Handler.
  (go, store, {
    mention,
    tagName,
  }) => ({
    fetch () {
      switch (true) {
      case !!mention:
        go(fetchAccount, mention, false);
        break;
      case !!tagName:
        go(ensureTimeline, `/api/v1/timelines/tag/${tagName}`);
        break;
      }
    },
  }),
);
