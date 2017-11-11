//  <ConnectedConversation>
//  =======================

//  Conversations are essentially just timelines where the expanded
//  status is fixed rather than user-selectable.  The API stuff works
//  differently, but that's a minor detail here.

//  * * * * * * * //

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

//  Request imports.
import { fetchConversation } from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Conversation extends React.Component {  //  Impure

  //  Constructor.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;

    //  We go ahead and prefetch the conversation.
    fetch();
  }

  //  If we receive new props, we need to fetch the new convo.
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

    //  We just render our statuses in a list, with the one that
    //  matches our `id` detailed.
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
  id: PropTypes.string.isRequired,  //  The `id` of the detailed status
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    account: PropTypes.string,  //  Account of the detailed status
    ancestors: ImmutablePropTypes.list,  //  Ancestors of the detailed status
    descendants: ImmutablePropTypes.list,  //  Descendants of the detailed status
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
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

//  Exporting.
export { ConnectedConversation as default };
