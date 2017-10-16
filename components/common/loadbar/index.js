//  <CommonLoadbar>
//  ===============

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default function CommonLoadbar ({
  className,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--LOADBAR', className);
  return (
    <div
      className={computedClass}
      {...rest}
    />
  );
}

//  Props.
CommonLoadbar.propTypes = { className: PropTypes.string };
