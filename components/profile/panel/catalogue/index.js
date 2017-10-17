//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Container imports.
import { CatalogueContainer } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ProfilePanelCatalogue ({
  className,
  hash,
  id,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PROFILE--PANEL--TIMELINE', className);

  const path = function () {
    switch (hash) {
    case '#followers':
      return `/api/v1/accounts/${id}/followers`;
    default:
      return `/api/v1/accounts/${id}/following`;
    }
  }();

  //  Rendering.
  return (
    <CatalogueContainer
      className={computedClass}
      path={path}
      {...rest}
    />
  );
};

//  Props.
ProfilePanelCatalogue.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string,
  id: PropTypes.string.isRequired,
};
