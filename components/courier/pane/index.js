import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import CourierPaneSettings from './settings';

const CourierPane = ({
  className,
  hash,
  intl,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--COURIER--PANE', className);

  switch (hash) {
  case '#settings':
    return (
      <CourierPaneSettings
        className={computedClass}
        intl={intl}
        {...rest}
      />
    );
  }
}

CourierPane.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
}

export default CourierPane;
