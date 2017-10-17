import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import TimelinePanelSettings from './settings';

import { CommonPane } from 'themes/mastodon-go/components';

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
