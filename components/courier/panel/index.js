/*********************************************************************\
|                                                                     |
|   <CourierPanel>                                                    |
|   ==============                                                    |
|                                                                     |
|   This component selects an appropriate panel (or not) to display   |
|   depending on the hash of the courier.                             |
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

//  Component imports.
import CourierPanelSettings from './settings';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CourierPanel ({
  className,
  hash,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COURIER--PANEL', className);

  switch (hash) {
  case '#settings':
    return (
      <CourierPanelSettings
        className={computedClass}
        {...rest}
      />
    );
  default:
    return null;
  }
}

//  Props.
CourierPanel.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string,
};
