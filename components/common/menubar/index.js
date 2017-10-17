//  <CommonMenu>
//  ============

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

const messages = defineMessages({
  close: {
    defaultMessage: 'Close',
    id: 'menu.close',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

export default function CommonMenubar ({
  activeRoute,
  children,
  className,
  history,
  intl,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--MENUBAR', { active_route: activeRoute && history && intl }, className);
  return (
    <nav
      className={computedClass}
      {...rest}
    >
      {children}
      {
        activeRoute && history && intl ? (
          <CommonButton
            destination={'/start'}
            history={history}
            icon='times'
            title={intl.formatMessage(messages.close)}
          />
        ) : null
      }
    </nav>
  );
}

//  Props.
CommonMenubar.propTypes = {
  activeRoute: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  history: PropTypes.object,
  intl: PropTypes.object,
};
