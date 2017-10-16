import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import TimelinePaneSettings from './settings';

import { CommonPane } from 'themes/mastodon-go/components';

export default function TimelinePane ({
  className,
  hash,
  intl,
  path,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--TIMELINE--PANE', className);

  return (
    <CommonPane
      class={computedClass}
      {...rest}
    >
      {
        function () {
          switch (hash) {
          case '#settings':
            return (
              <TimelinePaneSettings
                className={computedClass}
                intl={intl}
                path={path}
                {...rest}
              />
            );
          }
        }
      }
    </CommonPane>
  );
}

TimelinePane.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
}
