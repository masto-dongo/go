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
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Conversation extends React.PureComponent {

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
      activeRoute,
      className,
      history,
      icon,
      id,
      ℳ,
      '🏪': { statuses },
      '💪': handler,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--CONVERSATION', className);

    return (
      <CommonList
        className={computedClass}
        {...rest}
      >
        {statuses ? statuses.reduce(
          (items, statusId) => items.push(
            <ConnectedStatus
              detailed={id === statusId}
              id={id}
              key={id}
            />
          ),
          []
        ) : null}
      </CommonList>
    );
  }

};

//  Props.
Conversation.propTypes = {
  activeRoute: PropTypes.bool,
  className: PropTypes.string,
  history: PropTypes.object,
  icon: PropTypes.string,
  id: PropTypes.string.isRequired,
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({ statuses: ImmutablePropTypes.list }).isRequired,
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
    statuses: (state, { id }) => state.getIn(['conversation', id, 'statuses']),
  }),

  //  Messages.
  null,

  //  Handler.
  (go, store, { id }) => ({
    fetch: (newId = id) => go(fetchConversation, newId),
  })
);

export { ConnectedConversation as default };
