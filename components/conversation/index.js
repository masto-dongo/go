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
import { defineMessages, FormattedMessage } from 'react-intl';

//  Container imports.
import { StatusContainer } from 'themes/mastodon-go/components';

//  Component imports.
import ConversationMenu from './menu';

//  Common imports.
import {
  CommonList,
  CommonPaneller,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * * //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  conversation: {
    defaultMessage: 'Conversation',
    id: 'conversation.conversation',
  },
});

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
export default class Conversation extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    id: PropTypes.string.isRequired,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({ statuses: ImmutablePropTypes.list }).isRequired,
  };

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
      '🛄': { intl },
      '💪': handler,
      '🏪': { statuses },
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONVERSATION', className);

    return (
      <CommonPaneller
        className={computedClass}
        menu={
          <ConversationMenu
            activeRoute={activeRoute}
            history={history}
            id={id}
            intl={intl}
            statuses={statuses}
          />
        }
        title={<FormattedMessage {...messages.conversation} />}
        {...rest}
      >
        <CommonList>
          {statuses ? statuses.reduce(
            (items, statusId) => items.push(
              <StatusContainer
                detailed={id === statusId}
                id={id}
                key={id}
              />
            ),
            []
          ) : null}
        </CommonList>
      </CommonPaneller>
    );
  }

};
