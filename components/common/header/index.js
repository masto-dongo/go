//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

const CommonHeader = ({
  backgroundImage,
  children,
  className,
  onClick,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--COMMON--HEADER', className);

  let conditionalProps = {};
  if (onClick) {
    conditionalProps.onClick = onClick;
    conditionalProps.role = 'button';
    conditionalProps.tabIndex = '0';
  }
  if (backgroundImage) {
    conditionalProps.style = { backgroundImage };
  }

  return (
    <header
      className={computedClass}
      {...conditionalProps}
      {...rest}
    >
      <h1>{children}</h1>
    </header>
  );
}

CommonHeader.propTypes = {
  backgroundImage: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CommonHeader;
