import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DrawerPanelSearch from './search';

export default function DrawerPanel ({
  className,
  hash,
  intl,
  results,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--DRAWER--PANEL', className);

  switch (hash) {
  case '#settings':
    return (
      <DrawerPanelSearch
        className={computedClass}
        intl={intl}
        results={results}
        {...rest}
      />
    );
  default:
    return null;
  }
}

DrawerPanel.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string,
  intl: PropTypes.object.isRequired,
  results: ImmutablePropTypes.map,
};
