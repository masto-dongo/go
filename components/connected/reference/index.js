//  <ConnectedReference>
//  ====================

//  This component creates a "smart" reference to one of the various
//  linkable types—attachment, card, mention, tag.  The props specify
//  the nature of the reference.

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

//  Component imports.
import {
  CommonButton,
  CommonLink,
} from 'themes/mastodon-go/components';

//  Request imports.
import { fetchAccount } from 'themes/mastodon-go/redux';

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

  //  Constructor.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = props;

    //  Function binding.
    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);

    //  Fetching our reference.
    fetch();
  }

  //  We navigate to profiles/tagged timelines when a mention/tag is
  //  clicked.
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
          title={title}
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
          title={title}
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

//  Props.
Reference.propTypes = {
  attachment: PropTypes.string,  //  The id of an attachment
  card: PropTypes.string,  //  The id of a status with a card
  className: PropTypes.string,
  mention: PropTypes.string,  //  The id of a mentioned account
  showAt: PropTypes.bool,  //  `true` if the mention should be prefixed with an @
  showHash: PropTypes.bool,  //  `true` if the tag should be prefixed with a #
  tagName: PropTypes.string,  //  A hashtag name
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    at: PropTypes.string,  //  The @ of a mentioned account
    href: PropTypes.string,  //  The external link that the reference points to
    mediaType: PropTypes.number,  //  The `MEDIA_TYPE` of the reference, if applicable
    title: PropTypes.string,  //  A label for the reference
    username: PropTypes.string,  //  The username of a mentioned account
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedReference = connect(

  //  Component.
  Reference,

  //  Store.
  createStructuredSelector({
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
        return '@' + state.getIn(['account', mention, 'at']);
      case !!tagName:
        return '#' + tagName;
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

//  Exporting.
export { ConnectedReference as default };
