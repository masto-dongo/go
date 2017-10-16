//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Container imports.
import { TimelineContainer } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ProfilePaneTimeline ({
  className,
  hash,
  id,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PROFILE--PANE--TIMELINE', className);

  const path = function () {
    switch (hash) {
    case '#all':
      return `/api/v1/accounts/${id}/statuses`;
    case '#media':
      return `/api/v1/accounts/${id}/statuses?only_media=true`;
    case '#pinned':
      return `/api/v1/accounts/${id}/statuses?pinned=true`;
    default:
      return `/api/v1/accounts/${id}/statuses?exclude_replies=true`;
    }
  }();

  //  Rendering.
  return (
    <TimelineContainer
      class={computedClass}
      path={path}
      {...rest}
    />
  );
};

//  Props.
ProfilePaneTimeline.propTypes = {
  className: PropTypes.string,
  hash: PropTypes.string,
  id: PropTypes.string.isRequired,
};
