import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import TimelinePaneSettings from './settings';

const TimelinePane = ({
  className,
  hash,
  intl,
  path,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--TIMELINE--PANE', className);

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

TimelinePane.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
}

export default TimelinePane;
