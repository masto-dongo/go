//  <CommonSeparator>
//  ========

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/common/separator

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
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

const CommonSeparator = ({
  className,
  visible,
  ...rest
}) => visible ? (
  <span
    className={classNames('MASTODON_GO--COMMON--SEPARATOR', className)}
    {...rest}
    role='separator'
  />  //  Contents provided via CSS.
) : null;

//  Props.
CommonSeparator.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
};

//  Export.
export default CommonSeparator;
