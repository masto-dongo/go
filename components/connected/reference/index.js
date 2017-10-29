//  <Reference>
//  ===========

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Requests.
import { fetchAccount } from 'themes/mastodon-go/redux';

//  Component imports.
import {
  CommonButton,
  CommonLink,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

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

    //  Function binding.
    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);

    //  Fetching our reference.
    fetch();
  }

  handleClick () {
    const {
      mention,
      tagName,
    } = this.props;
    if (mention) {
      DOMEventNavigate(`/profile/${mention}`);
    } else if (tagName) {
      DOMEventNavigate(`/tagged/${tagName}`);
    }
  }

  //  Rendering.
  render () {
    const { handleClick } = this;
    const {
      attachment,
      card,
      className,
      mention,
      showAt,
      showHash,
      tagName,
      ℳ,
      '🏪': {
        at,
        href,
        mediaType,
        title,
        username,
      },
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
        defaultTitle = ℳ.image;
        icon = 'picture-o';
        break;
      case MEDIA_TYPE.VIDEO:
        defaultTitle = ℳ.video;
        icon = 'video-camera';
        break;
      default:
        defaultTitle = ℳ.unknown;
        icon = 'question';
        break;
      }
      return (
        <CommonButton
          className={computedClass}
          href={href}
          icon={icon}
          title={title || defaultTitle}
        />
      );

    //  If we are given a `card`, we render a card button.
    case !!card:
      return (
        <CommonButton
          className={computedClass}
          href={href}
          icon={'id-card-o'}
          title={title || ℳ.card}
        />
      );

    //  If we are given a `mention`, we render a link to the
    //  account's profile.
    case !!mention:
      return (
        <CommonLink
          className={computedClass}
          href={href}
          onClick={handleClick}
          title={title || '@' + at}
        >
          <code>
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
          href={href}
          onClick={handleClick}
          title={ℳ.hashtag.withValues({ tagName })}
        >
          <b>
            {showHash ? <span className='hash'>#</span> : null}
            <span className='tagname'>{tagName}</span>
          </b>
        </CommonLink>
      );

    //  Otherwise, we don't return anything.
    default:
      return null;
    }
  }

}

Reference.propTypes = {
  attachment: PropTypes.string,
  card: PropTypes.string,
  className: PropTypes.string,
  mention: PropTypes.string,
  showAt: PropTypes.bool,
  showHash: PropTypes.bool,
  tagName: PropTypes.string,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    at: PropTypes.string,
    href: PropTypes.string,
    mediaType: PropTypes.number,
    title: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedReference = connect(

  //  Component.
  Reference,

  //  Store.
  createStructuredSelector({
    at: (state, { mention }) => mention ? state.getIn(['account', mention, 'at']) : null,
    href: (state, {
      attachment,
      card,
      href,
      mention,
    }) => {
      switch (true) {
      case !!attachment:
        return state.getIn(['attachment', attachment, 'href']);
      case !!card:
        return state.getIn(['card', card, 'href']);
      case !!mention:
        return state.getIn(['account', mention, 'href']);
      default:
        return href || null;
      }
    },
    mediaType: (state, { attachment }) => attachment ? state.getIn(['attachment', attachment, 'type']) : null,
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
        return null;
      }
    },
    username: (state, { mention }) => mention ? state.getIn(['account', mention, 'username']) : null,
  }),

  //  Messages.
  defineMessages({
    card: {
      defaultMessage: 'Card',
      description: 'Used to label card references',
      id: 'reference.card',
    },
    hashtag: {
      defaultMessage: 'Hashtag #{tagName}',
      description: 'Used to label hashtag references',
      id: 'reference.hashtag',
    },
    image: {
      defaultMessage: 'Image',
      description: 'Used to label image references',
      id: 'reference.image',
    },
    unknown: {
      defaultMessage: 'Unknown attachment',
      description: 'Used to label unknown references',
      id: 'reference.unknown',
    },
    video: {
      defaultMessage: 'Video',
      description: 'Used to label video references',
      id: 'reference.video',
    },
  }),

  //  Handler.
  (go, store, { mention }) => ({
    fetch () {
      switch (true) {
      case !!mention:
        go(fetchAccount, mention, false);
        break;
      }
    },
  })
);

export { ConnectedReference as default };

