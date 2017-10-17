//  <CommonPaneller>
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

export default function CommonPaneller ({
  children,
  className,
  menu,
  panel,
  title,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--PANELLER', {
    navigable: menu,
    open: panel,
    titled: title,
  }, className);
  return (
    <div
      className={computedClass}
      {...rest}
    >
      {menu}
      {
        title ? (
          <header aria-hidden={!!panel}>
            <h1>{title}</h1>
          </header>
        ) : null
      }
      <aside aria-hidden={!panel}>{panel}</aside>
      {
        React.Children.map(
          children,
          child => React.cloneElement(child, { 'aria-hidden': !!panel })
        )
      }
    </div>
  );
}

//  Props.
CommonPaneller.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  menu: PropTypes.node,
  panel: PropTypes.node,
  title: PropTypes.node,
};
