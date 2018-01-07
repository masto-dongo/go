//  <CommonSeparator>
//  =================

//  This is an extremely simple component for rendering a separator
//  which is recognizable via ARIA.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CommonSeparator ({
  className,
  visible,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--SEPARATOR', className);

  //  The result.  We only render the separator if it is `visible`.
  return visible ? (
    <span
      className={computedClass}
      {...rest}
      role='separator'
    />  //  Contents provided via CSS.
  ) : null;
}

//  Props.
CommonSeparator.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,  //  Whether the separator should be rendered.
};
