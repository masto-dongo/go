import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import TimelinePanelSettings from './settings';

export default function TimelinePanel ({
  className,
  hash,
  intl,
  path,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--TIMELINE--PANEL', className);

  switch (hash) {
  case '#settings':
    return (
      <TimelinePanelSettings
        className={computedClass}
        intl={intl}
        path={path}
        {...rest}
      />
    );
  default:
    return null;
  }
}

TimelinePanel.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string,
  intl: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};
