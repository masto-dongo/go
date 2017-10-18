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
  back: {
    defaultMessage: 'Back',
    id: 'menu.back',
  },
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
  hash,
  history,
  intl,
  start,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--MENUBAR', className);
  return (
    <nav
      className={computedClass}
      {...rest}
    >
      {children}
      {activeRoute && history && intl ? function () {
        switch (true) {
        case hash && hash !== '#':
          return (
            <CommonButton
              className='close'
              destination={'#'}
              history={history}
              icon='arrow-left'
              title={intl.formatMessage(messages.back)}
            />
          );
        case !start:
          return (
            <CommonButton
              className='close'
              destination={'/start'}
              history={history}
              icon='times'
              title={intl.formatMessage(messages.close)}
            />
          );
        default:
          return null;
        }
      }() : null}
    </nav>
  );
}

//  Props.
CommonMenubar.propTypes = {
  activeRoute: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  history: PropTypes.object,
  hash: PropTypes.string,
  intl: PropTypes.object,
  start: PropTypes.bool,
};
