//  <CommonMenu>
//  ============

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

const CommonMenubar = ({
  children,
  className,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--COMMON--MENUBAR', className);
  return (
    <div
      className={computedClass}
      {...rest}
    >{children}</div>
  );
}

//  Props.
CommonMenubar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

//  Export.
export default CommonMenubar;
