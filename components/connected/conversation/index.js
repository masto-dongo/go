/*********************************************************************\
|                                                                     |
|   <Conversation>                                                    |
|   ==============                                                    |
|                                                                     |
|   Conversations are essentially just timelines where the expanded   |
|   status is fixed rather than user-selectable.  And, I mean, they   |
|   don't update and represent something conceptually different and   |
|   whatnot, but that doesn't concern us here.                        |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonList,
  ConnectedStatus,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Request imports.
import { fetchConversation } from 'themes/mastodon-go/redux';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Conversation extends React.Component {  //  Impure

  //  Our constructor goes ahead and prefetches the conversation.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  //  If we receive new props, we need to fetch the new status.
  componentWillReceiveProps (nextProps) {
    const {
      id,
      '💪': { fetch },
    } = this.props;
    if (nextProps.id !== id) fetch(nextProps.id);
  }

  //  Rendering.
  render () {
    const {
      className,
      id,
      '🏪': {
        ancestors,
        descendants,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--CONVERSATION', className);

    return (
      <CommonList className={computedClass}>
        {ancestors && descendants ? ancestors.concat(id, descendants).reduce(function (items, item) {
          const statusId = ImmutableMap.isMap(item) ? item.get('id') : item;
          items.push(
            <ConnectedStatus
              detailed={id === statusId}
              id={statusId}
              key={statusId}
            />
          );
          return items;
        }, []) : null}
      </CommonList>
    );
  }

};

//  Props.
Conversation.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    ancestors: ImmutablePropTypes.list,
    descendants: ImmutablePropTypes.list,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedConversation = connect(

  //  Component.
  Conversation,

  //  Store.
  createStructuredSelector({
    ancestors: (state, { id }) => state.getIn(['conversation', id, 'ancestors']),
    descendants: (state, { id }) => state.getIn(['conversation', id, 'descendants']),
  }),

  //  Messages.
  null,

  //  Handler.
  (go, store, { id }) => ({
    fetch: (newId = id) => go(fetchConversation, newId),
  })
);

export { ConnectedConversation as default };
