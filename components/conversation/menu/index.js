/*********************************************************************\
|                                                                     |
|   <ConversationMenu>                                                |
|   ==================                                                |
|                                                                     |
|   Our conversation menus don't provide settings or options.  They   |
|   provide quick navigation for moving between the statuses of the   |
|   conversation without having to scroll through the entire thing.   |
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
import { defineMessages } from 'react-intl';

//  Common imports.
import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * * //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  status: {
    defaultMessage: 'View status',
    id: 'conversation.view_status',
  },
});

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
export default function ConversationMenu ({
    className,
    history,
    id,
    intl,
    statuses,
    ...rest
}) {
  const computedClass = classNames('MASTODON_GO--CONVERSATION--MENU', className);

  //  Rendering.
  return (
    <CommonMenubar
      activeRoute={activeRoute}
      className={computedClass}
      history={history}
      intl={intl}
      {...rest}
    >
      {statuses ? statuses.reduce(
        (items, statusId, index) => items.push(
          <CommonButton
            active={id === statusId}
            destination={`/status/${id}`}
            history={history}
            icon={!index ? 'comment' : 'comments'}
            title={intl.formatMessage(messages.status)}
          />
        ),
        []
      ) : null}
    </CommonMenubar>
  );
}

//  Props.
ConversationMenu.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object,
  id: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  statuses: ImmutablePropTypes.list,
};
