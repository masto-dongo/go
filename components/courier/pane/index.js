/*********************************************************************\
|                                                                     |
|   <CourierPane>                                                     |
|   =============                                                     |
|                                                                     |
|   This component selects the appropriate pane for the courier (or   |
|   no pane) depending on the hash of the courier.                    |
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
import CourierPaneSettings from './settings';

//  Common imports.
import { CommonPane } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CourierPane ({
  className,
  hash,
  intl,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COURIER--PANE', className);

  return (
    <CommonPane
      class={computedClass}
      {...rest}
    >
      {
        //  We switch over our `hash` to determine the pane to render.
        function () {
          switch (hash) {
          case '#settings':
            return (
              <CourierPaneSettings
                intl={intl}
                {...rest}
              />
            );
          default:
            return null;
          }
        }()
      }
    </CommonPane>
  );
}

//  Props.
CourierPane.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
}
