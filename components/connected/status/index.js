//  <ConnectedStatus>
//  =================

//  This component renders statuses!  It's pretty weighty, but
//  thankfully some of the work is taken care of for us via
//  `<ConnectedParse>` and `<ConnectedMedia>`.

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

//  Component imports.
import {
  CommonObserveäble,
  ConnectedAccount,
} from 'themes/mastodon-go/components';
import ConnectedStatusActionBar from './action_bar';
import ConnectedStatusContent from './content';
import ConnectedStatusFooter from './footer';
import ConnectedStatusNav from './nav';
import ConnectedStatusPrepend from './prepend';

//  Request imports.
import {
  deleteStatus,
  favouriteStatus,
  fetchStatus,
  muteStatus,
  pinStatus,
  reblogStatus,
  unfavouriteStatus,
  unmuteStatus,
  unpinStatus,
  unreblogStatus,
} from 'themes/mastodon-go/redux';

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
    return null;
  }
  id = state.getIn(['status', id, 'reblog']) || id;
  return state.getIn(['card', id]);
};

//  * * * * * * * //

//  The component
//  -------------

class Status extends React.Component {  //  Impure

  //  Constructor.
  constructor (props) {
    super(props);
    const {
      detailed,
      id,
      '🏪': { spoiler },
      '💪': { fetch },
    } = this.props;

    //  State.
    this.state = { contentVisible: !spoiler };

    //  Binding functions.
    const {
      handleDetail,
      handleExpansion,
    } = Object.getPrototypeOf(this);
    this.handleDetail = handleDetail.bind(this);
    this.handleExpansion = handleExpansion.bind(this);

    //  Fetching the status.
    if (id) {
      fetch(id, detailed);
    }
  }

  //  If our `id` is about to change, we need to fetch the new status.
  //  We also update our status if it has just been made `detailed`.
  componentWillUpdate (nextProps) {
    const {
      detailed,
      id,
      '💪': { fetch },
    } = this.props;
    if (nextProps.id && (nextProps.id !== id || nextProps.detailed && !detailed)) {
      fetch(nextProps.id, nextProps.detailed);
    }
  }

  //  `handleDetail()` handles setting our detail.
  handleDetail (e) {
    const {
      detailed,
      id,
      onDetail,
    } = this.props;
    if (onDetail && !(e && (e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey))) {
      onDetail(detailed ? null : id);
      if (e) {
        e.preventDefault();
      }
    } else if (!detailed) {
      DOMEventNavigate(`/status/${id}`);
    }
  }

  //  `handleExpansion` handles expanding and collapsing spoilers.
  handleExpansion (value) {
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

  //  Puts our element on the screen.
  render () {
    const {
      handleDetail,
      handleExpansion,
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

    //  We try creäting regex from our `filterRegex` if possible.
    const regex = function (exp) {
      try {
        return exp && new RegExp(exp, 'i');
      } catch (e) {
        return null;
      }
    }(filterRegex);

    //  If we don't have an `id` or `content`, we don't render
    //  anything.  In the latter case, it is likely the status is
    //  still loading.
    if (!id || !content) {
      return null;
    }

    //  The replace function here simply removes the URLs from our
    //  deHTMLified links.
    const searchText = spoiler + '\n\n' + content.get('plain').replace(/\ufdd0([^]*)\ufdd1([^]*)\ufdd2/g, '$1');

    //  If our `type` matches our `hideIf` or our `regex` matches our
    //  `searchText`, we don't show the status.
    if (hideIf & type || regex && account !== me && regex.test(searchText)) {
      return null;
    }

    //  If our status is `small` then we only show the account and content.
    if (small) {
      return (
        <CommonObserveäble
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
            onDetail={handleDetail}
            onExpansion={handleExpansion}
            sensitive={sensitive}
            small
            spoiler={spoiler}
            tags={tags}
            ℳ={ℳ}
          />
        </CommonObserveäble>
      );
    }

    //  We can now render our status!
    return (
      <CommonObserveäble
        article
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
          id={id}
          media={media}
          mentions={mentions}
          onDetail={handleDetail}
          onExpansion={handleExpansion}
          sensitive={sensitive}
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
          onDetail={handleDetail}
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
      </CommonObserveäble>
    );

  }

}

//  Props.
Status.propTypes = {
  className: PropTypes.string,
  containerId: PropTypes.string,  //  The id to be used for intersection observing, if not the same as `id`.
  detailed: PropTypes.bool,  //  `true` if the status is detailed.
  filterRegex: PropTypes.string,  //  Regex which should hide the status if found
  hideIf: PropTypes.number,  //  `POST_TYPE`s which should hide the status if found
  id: PropTypes.string,  //  The id of the status
  observer: PropTypes.object,  //  An intersection observer for the status
  onDetail: PropTypes.func,  //  A function to call to set the detailed condition of the status
  small: PropTypes.bool,  //  `true` if the status should be rendered small
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    at: PropTypes.string,  //  The @ of the status's author
    account: PropTypes.string,  //  The account id of the status's author
    application: ImmutablePropTypes.map,  //  The application which posted the status
    card: ImmutablePropTypes.map,  //  The status's card
    comrade: PropTypes.string,  //  The id of the status's comrade
    content: ImmutablePropTypes.map,  //  The content of the status
    counts: ImmutablePropTypes.map,  //  Counts for the status
    datetime: PropTypes.instanceOf(Date),  //  The `Date` when the status was posted
    emoji: ImmutablePropTypes.list,  //  The custom emoji for the status
    href: PropTypes.string,  //  A link to the static page for the status
    inReplyTo: PropTypes.map,  //  The id of the status that this status is in reply to
    is: ImmutablePropTypes.map,  //  What the status is (and isn't)
    me: PropTypes.string,  //  The current user's id
    media: ImmutablePropTypes.list,  //  The media attached to the status
    mentions: ImmutablePropTypes.list,  //  A list of mentions contained in the status
    sensitive: PropTypes.bool,  //  `true` if the status media is sensitive
    spoiler: PropTypes.string,  //  The content of the status spoiler
    tags: ImmutablePropTypes.list,  //  A list of tags contained in the status
    type: PropTypes.number,  //  The `POST_TYPE` of the status
    visibility: PropTypes.number,  //  The `VISIBILITY` of the status
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
    clickToView: {
      defaultMessage: 'Click to view',
      description: 'Used as the instructions for the sensitive content and hidden media overlays',
      id: 'status.clickToView',
    },
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
    hidden: {
      defaultMessage: 'Media hidden',
      description: 'Used as the label for the hidden media overlay',
      id: 'status.hidden',
    },
    hideMedia: {
      defaultMessage: 'Hide media',
      description: 'Used as the label for the sensitive content button',
      id: 'status.hide_media',
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
    sensitive: {
      defaultMessage: 'Sensitive content',
      description: 'Used as the label for the sensitive content overlay',
      id: 'status.sensitive',
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

  //  Handlers.
  (go, store, { id }) => ({
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

//  Exporting.
export { ConnectedStatus as default };
