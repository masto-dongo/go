//  <Status>
//  ========

//  For more information, please contact:
//  @kibi@glitch.social

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

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Request imports.
import {
  deleteStatus,
  favouriteStatus,
  fetchCard,
  fetchStatus,
  muteStatus,
  pinStatus,
  reblogStatus,
  unfavouriteStatus,
  unmuteStatus,
  unpinStatus,
  unreblogStatus,
} from 'themes/mastodon-go/redux';

//  Component imports.
import {
  CommonObservable,
  ConnectedAccount,
} from 'themes/mastodon-go/components';
import ConnectedStatusActionBar from './action_bar';
import ConnectedStatusContent from './content';
import ConnectedStatusFooter from './footer';
import ConnectedStatusNav from './nav';
import ConnectedStatusPrepend from './prepend';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import {
  POST_TYPE,
  VISIBILITY,
} from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  Initial Setup
//  -------------

//  These functions are used in our connector, below.
const getInAccount = (state, id, key) => {
  if (!id) {
    return void 0;
  }
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['account', state.getIn(['status', id, 'account']), key]);
};
const getInStatus = (state, id, key) => {
  if (!id) {
    return void 0;
  }
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['status', id, key]);
};
const getCard = (state, id) => {
  if (!id) {
    return void 0;
  }
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['card', id]);
};

//  * * * * * * * //

//  The component
//  -------------

class Status extends React.Component {  //  Impure

  //  Prior to mounting, we fetch the status's card if this is a
  //  detailed status and we don't already have it.
  constructor (props) {
    super(props);
    const {
      detailed,
      id,
      '🏪': {
        card,
        spoiler,
      },
      '💪': {
        fetch,
        card: handleCard,
      },
    } = this.props;

    //  State.
    this.state = { contentVisible: !spoiler };

    //  Binding functions.
    const {
      handleClick,
      setExpansion,
    } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
    this.setExpansion = setExpansion.bind(this);

    //  Fetching the status/card.
    if (id) {
      fetch(id, detailed);
    }
    if (id && !card && detailed) {
      handleCard();
    }
  }

  //  If our component is about to become detailed, we request its card
  //  if we don't have it.
  componentWillUpdate (nextProps) {
    const {
      detailed,
      id,
      '💪': {
        fetch,
        card: handleCard,
      },
    } = this.props;
    if (nextProps.id && (nextProps.id !== id || nextProps.detailed && !detailed)) {
      fetch(nextProps.id, nextProps.detailed);
      if (!nextProps['🏪'].card) {
        handleCard(nextProps.id);
      }
    }
  }

  //  `setExpansion` handles expanding and collapsing spoilers.
  setExpansion (value) {
    const { contentVisible } = this.state;
    switch (true) {

    //  A value of `null` or `undefined` flips the state.
    case value === undefined || value === null:
      this.setState({ contentVisible: !contentVisible });
      break;

    //  A value of `false` means that the status should be collapsed.
    case !value:
      this.setState({ contentVisible: false });
      break;

    //  A value of `true` means that the status should be expanded.
    case !!value:
      this.setState({ contentVisible: true });
      break;
    }
  }

  //  `handleClick()` handles all clicking stuff. We route links and
  //  make our status detailed if it isn't already.
  handleClick (e) {
    const {
      detailed,
      id,
      setDetail,
    } = this.props;
    if (setDetail && !(e && (e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey))) {
      setDetail(detailed ? null : id);
      if (e) {
        e.preventDefault();
      }
    } else if (!detailed) {
      DOMEventNavigate(`/status/${id}`);
    }
  }

  //  Puts our element on the screen.
  render () {
    const {
      handleClick,
      setExpansion,
    } = this;
    const {
      className,
      containerId,
      detailed,
      filterRegex,
      hideIf,
      id,
      observer,
      small,
      ℳ,
      '🏪': {
        account,
        at,
        application,
        card,
        comrade,
        content,
        counts,
        datetime,
        emoji,
        href,
        inReplyTo,
        is,
        me,
        media,
        mentions,
        sensitive,
        spoiler,
        tags,
        type,
        visibility,
      },
      '💪': {
        favourite,
        reblog,
        unfavourite,
        unreblog,
      },
    } = this.props;
    const { contentVisible } = this.state;

    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS', {
      detailed,
      direct: !(visibility & ~VISIBILITY.DIRECT),
      small,
    }, className);

    const regex = function (exp) {
      try {
        return exp && new RegExp(exp, 'i');
      } catch (e) {
        return null;
      }
    }(filterRegex);

    if (!id || !content) {
      return null;
    }

    const searchText = spoiler + '\n\n' + content.get('plain').replace(/\ufdd0([^]*)\ufdd1([^]*)\ufdd2/g, '$1');

    if (hideIf & type || regex && account !== me && regex.test(searchText)) {
      return null;
    }

    if (small) {
      return (
        <CommonObservable
          className={computedClass}
          id={containerId || id}
          observer={observer}
          searchText={searchText}
        >
          <ConnectedAccount
            comrade={comrade}
            id={account}
            small
          />
          <ConnectedStatusContent
            card={card}
            content={content.get('plain')}
            contentVisible={contentVisible}
            emoji={emoji}
            media={media}
            mentions={mentions}
            onClick={handleClick}
            sensitive={sensitive}
            setExpansion={setExpansion}
            small
            spoiler={spoiler}
            tags={tags}
            ℳ={ℳ}
          />
        </CommonObservable>
      );
    }

    //  We can now render our status!
    return (
      <CommonObservable
        className={computedClass}
        id={containerId || id}
        observer={observer}
        searchText={searchText}
      >
        <ConnectedStatusPrepend
          comrade={comrade || inReplyTo && inReplyTo.get('account')}
          type={POST_TYPE}
        />
        <ConnectedAccount
          comrade={comrade}
          id={account}
          small
        />
        <ConnectedStatusContent
          card={card}
          content={content.get('plain')}
          contentVisible={contentVisible}
          detailed={detailed}
          emoji={emoji}
          media={media}
          mentions={mentions}
          onClick={handleClick}
          sensitive={sensitive}
          setExpansion={setExpansion}
          spoiler={spoiler}
          tags={tags}
          ℳ={ℳ}
        />
        <ConnectedStatusFooter
          application={application}
          datetime={datetime}
          detailed={detailed}
          href={href}
          visibility={visibility}
          ℳ={ℳ}
        />
        <ConnectedStatusActionBar
          at={at}
          detailed={detailed}
          id={id}
          is={is}
          onDetail={handleClick}
          onFavourite={favourite}
          onReblog={reblog}
          onUnfavourite={unfavourite}
          onUnreblog={unreblog}
          spoiler={spoiler}
          visibility={visibility}
          ℳ={ℳ}
        />
        {detailed ? (
          <ConnectedStatusNav
            favouritesCount={counts.get('favourites')}
            id={id}
            reblogsCount={counts.get('reblogs')}
            ℳ={ℳ}
          />
        ) : null}
      </CommonObservable>
    );

  }

}

//  Props.
Status.propTypes = {
  className: PropTypes.string,
  containerId: PropTypes.string,
  detailed: PropTypes.bool,
  filterRegex: PropTypes.string,
  hideIf: PropTypes.number,
  id: PropTypes.string,
  observer: PropTypes.object,
  setDetail: PropTypes.func,
  small: PropTypes.bool,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    at: PropTypes.string,
    account: PropTypes.string,
    application: ImmutablePropTypes.map,
    card: ImmutablePropTypes.map,
    comrade: PropTypes.string,
    content: ImmutablePropTypes.map,
    counts: ImmutablePropTypes.map,
    datetime: PropTypes.instanceOf(Date),
    emoji: ImmutablePropTypes.list,
    href: PropTypes.string,
    inReplyTo: PropTypes.map,
    is: ImmutablePropTypes.map,
    me: PropTypes.string,
    media: ImmutablePropTypes.list,
    mentions: ImmutablePropTypes.list,
    sensitive: PropTypes.bool,
    spoiler: PropTypes.string,
    tags: ImmutablePropTypes.list,
    type: PropTypes.number,
    visibility: PropTypes.number,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedStatus = connect(

  //  Components.
  Status,

  //  Store.
  createStructuredSelector({
    account: (state, { id }) => getInStatus(state, id, 'account'),
    at: (state, { id }) => getInAccount(state, id, 'at'),
    application: (state, { id }) => getInStatus(state, id, 'application'),
    card: (state, { id }) => getCard(state, id),
    comrade: (state, {
      comrade,
      id,
    }) => {
      if (!comrade && id && state.getIn(['status', id, 'reblog'])) {
        comrade = state.getIn(['status', id, 'account']);
      }
      return comrade || null;
    },
    content: (state, { id }) => getInStatus(state, id, 'content'),
    counts: (state, { id }) => getInStatus(state, id, 'counts'),
    datetime: (state, { id }) => getInStatus(state, id, 'datetime'),
    emoji: (state, { id }) => getInStatus(state, id, 'emoji'),
    href: (state, { id }) => getInStatus(state, id, 'href'),
    inReplyTo: (state, { id }) => getInStatus(state, id, 'inReplyTo'),
    is: (state, { id }) => getInStatus(state, id, 'is'),
    media: (state, { id }) => getInStatus(state, id, 'media'),
    mentions: (state, { id }) => getInStatus(state, id, 'mentions'),
    sensitive: (state, { id }) => getInStatus(state, id, 'sensitive'),
    spoiler: (state, { id }) => getInStatus(state, id, 'spoiler'),
    tags: (state, { id }) => getInStatus(state, id, 'tags'),
    type: (state, {
      id,
      type,
    }) => type | POST_TYPE.STATUS | (id && state.getIn(['status', id, 'reblog']) && POST_TYPE.IS_REBLOG) | (getInStatus(state, id, 'inReplyTo') && POST_TYPE.IS_MENTION),
    visibility: (state, { id }) => getInStatus(state, id, 'visibility'),
  }),

  //  Messages.
  defineMessages({
    direct: {
      defaultMessage: 'Direct',
      description: 'Used as the label for a direct status',
      id: 'status.direct',
    },
    expand: {
      defaultMessage: 'Expand',
      description: 'Used as the label for the expand button',
      id: 'status.expand',
    },
    favourite: {
      defaultMessage: 'Favourite',
      description: 'Used as the label for the favourite button',
      id: 'status.favourite',
    },
    noReblog: {
      defaultMessage: 'This post cannot be boosted',
      description: 'Used as the label for a disabled reblog button',
      id: 'status.no_reblog',
    },
    numFavourites: {
      defaultMessage: '{n} favourites',
      description: 'Used as the label for a favourites link',
      id: 'status.num_favourites',
    },
    numReblogs: {
      defaultMessage: '{n} reblogs',
      description: 'Used as the label for a reblogs link',
      id: 'status.num_reblogs',
    },
    private: {
      defaultMessage: 'Followers-only',
      description: 'Used as the label for a followers-only status',
      id: 'status.private',
    },
    public: {
      defaultMessage: 'Public',
      description: 'Used as the label for a public status',
      id: 'status.public',
    },
    permalink: {
      defaultMessage: 'Permalink',
      description: 'Used as the label for a status permalink',
      id: 'status.permalink',
    },
    reblog: {
      defaultMessage: 'Boost',
      description: 'Used as the label for the reblog button',
      id: 'status.reblog',
    },
    reply: {
      defaultMessage: 'Reply',
      description: 'Used as the label for the reply button',
      id: 'status.reply',
    },
    replyAll: {
      defaultMessage: 'Reply to thread',
      description: 'Used as the label for the reply button when a status is part of a conversation',
      id: 'status.reply_all',
    },
    showMore: {
      defaultMessage: 'Show more',
      description: 'Used as the label for the "Show more" button',
      id: 'status.show_more',
    },
    showLess: {
      defaultMessage: 'Show less',
      description: 'Used as the label for the "Show less" button',
      id: 'status.show_less',
    },
    unknown: {
      defaultMessage: 'Unknown',
      description: 'Used as the label for a status with unknown visibility',
      id: 'status.unknown',
    },
    unlisted: {
      defaultMessage: 'Unlisted',
      description: 'Used as the label for an unlisted status',
      id: 'status.unlisted',
    },
    viewConversation: {
      defaultMessage: 'View conversation',
      description: 'Used as the label for a conversation link',
      id : 'status.view_conversation',
    },
  }),

  //  Handler.
  (go, store, { id }) => ({
    card: (newId = id) => go(fetchCard, newId),
    delete: (newId = id) => go(deleteStatus, newId),
    favourite: (newId = id) => go(favouriteStatus, newId),
    fetch: (newId = id, force = false) => go(fetchStatus, newId, force),
    mute: (newId = id) => go(muteStatus, newId),
    pin: (newId = id) => go(pinStatus, newId),
    reblog: (newId = id) => go(reblogStatus, newId),
    unfavourite: (newId = id) => go(unfavouriteStatus, newId),
    unmute: (newId = id) => go(unmuteStatus, newId),
    unpin: (newId = id) => go(unpinStatus, newId),
    unreblog: (newId = id) => go(unreblogStatus, newId),
  })
);

export { ConnectedStatus as default };
