//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import ProfilePanelCatalogue from './catalogue';
import ProfilePanelTimeline from './timeline';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ProfilePanel ({
  className,
  hash,
  id,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PROFILE--PANEL', className);

  switch (hash) {
  case '#followers':
  case '#follows':
    return (
      <ProfilePanelCatalogue
        className={computedClass}
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
      <ProfilePanelTimeline
        className={computedClass}
        hash={hash}
        id={id}
        {...rest}
      />
    );
  default:
    return null;
  }
}

//  Props.
ProfilePanel.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string,
  id: PropTypes.string.isRequired,
};
