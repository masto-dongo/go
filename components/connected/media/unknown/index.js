//  <ConnectedMediaUnknown>
//  =======================

//  This renders a link for when the provided media isn't a recognized
//  type.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import {
  CommonButton,
  CommonIcon,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedAttachmentUnknown ({
  className,
  description,
  href,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--ATTACHMENT--UNKNOWN', className);

  //  Rendering.
  return (
    <CommonLink
      className={computedClass}
      href={href}
    >
      <CommonIcon name='link' />
      {description}
    </CommonLink>
  );
}

//  Props.
ConnectedAttachmentUnknown.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,  //  The label for the unknown media
  href: PropTypes.string,  //  The URL of the unknown media's original source
};
