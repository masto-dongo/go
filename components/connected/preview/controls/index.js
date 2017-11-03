//  <ConnectedPreviewControls>
//  ==========================

//  This component just renders the submit button for statuses.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default function ConnectedPreviewControls ({
  className,
  disabled,
  local,
  onSubmit,
  spoiler,
  text,
  ℳ,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--CONTROLS', { disabled }, className);

  //  This calculates the length of the status.
  const size = ((local ? text + ' 👁' : text) + (spoiler || '')).trim().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;

  //  Rendering the button.
  return (
    <div className={computedClass}>
      <CommonButton
        disabled={disabled || !(text.trim() && size <= 500)}
        icon={'paper-plane'}
        onClick={onSubmit}
        title={ℳ.publish}
        showTitle
      />
    </div>
  );
}

//  Props.
ConnectedPreviewControls.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is disabled
  local: PropTypes.bool,  //  `true` if this is a local-only status
  onSubmit: PropTypes.func,  //  A function to call when submitting the status
  spoiler: PropTypes.string,  //  The contents of the status's spoiler
  text: PropTypes.string.isRequired,  //  The text contents of the status
  ℳ: PropTypes.func.isRequired,
};

