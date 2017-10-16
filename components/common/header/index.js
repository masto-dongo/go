//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default function CommonHeader ({
  className,
  onClick,
  title,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--HEADER', className);

  let conditionalProps = {};
  if (onClick) {
    conditionalProps.onClick = onClick;
    conditionalProps.role = 'button';
    conditionalProps.tabIndex = '0';
  }

  return (
    <header
      className={computedClass}
      {...conditionalProps}
      {...rest}
    ><h1>{title}</h1></header>
  );
}

CommonHeader.propTypes = {
  backgroundImage: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.node,
};
