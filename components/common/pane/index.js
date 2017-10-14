//  <CommonPane>
//  =============

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

export default function CommonPane ({
  children,
  className,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--PANE', className);
  return (
    <aside
      className={computedClass}
      {...rest}
    >{children}</aside>
  );
}

//  Props.
CommonPane.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
