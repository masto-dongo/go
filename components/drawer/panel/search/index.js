import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

const messages = defineMessages({
});

export default function DrawerPanelSearch ({
  className,
  intl,
  results,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--DRAWER--PANEL--SEARCH', className);

  return (
    <div
      className={computedClass}
      {...rest}
    >
    </div>
  );
};

DrawerPanelSearch.propTypes = {
  className: PropTypes.string,
  intl: PropTypes.object.isRequired,
  results: ImmutablePropTypes.map,
};
