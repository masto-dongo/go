/*********************************************************************\
|                                                                     |
|   <ReferenceContainer>                                              |
|   ====================                                              |
|                                                                     |
|   The store selector used by `<ReferenceContainer>` conditionally   |
|   selects its properties based on the arguments passed through in   |
|   the component's props.  This isn't a problem because we want to   |
|   update on prop change regardless.                                 |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Requests.
import {
  ensureTimeline,
  fetchAccount,
} from 'themes/mastodon-go/redux';

//  Component imports.
import Reference from '.';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store and handlers.
export default connect(
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
        return state.getIn(['tag', `/api/v1/timelines/tag/${ownProps.tagName}`, 'rainbow']);
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
      }
    },
    username: (state, { mention }) => mention ? state.getIn(['account', mention, 'username']) : null,
  }),
  (go, store, {
    mention,
    tagName,
  }) => ({
    fetch () {
      switch (true) {
      case !!mention:
        go(fetchAccount, mention, false);
      case !!tagName:
        go(ensureTimeline, `/api/v1/timelines/tag/${tagName}`);
      }
    },
  }),
)(Reference);
