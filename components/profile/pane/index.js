//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import CourierPaneCatalogue from './catalogue';
import CourierPaneTimeline from './timeline';

//  Common imports.
import { CommonPane } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ProfilePane ({
  className,
  hash,
  id,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PROFILE--PANE', className);

  return (
    <CommonPane
      className={computedClass}
      {...rest}
    >
      {
        //  We switch over our `hash` to determine the pane to render.
        function () {
          switch (hash) {
          case '#followers':
          case '#follows':
            return (
              <CourierPaneCatalogue
                hash={hash}
                id={id}
                {...rest}
              />
            );
          case '#all':
          case '#media':
          case '#pinned':
          case '#posts':
            return (
              <CourierPaneTimeline
                hash={hash}
                id={id}
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
ProfilePane.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
