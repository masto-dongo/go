//  <CommonBlockButton>
//  ==================

//  This renders a button as a squareïsh block.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Component imports.
import {
  CommonButton,
  CommonIcon,
} from 'flavours/go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CommonBlockButton ({
  active,
  children,
  className,
  data,
  disabled,
  href,
  icon,
  onClick,
  passive,
  role,
  title,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--BLOCK_BUTTON', className);

  return (
    <CommonButton
      active={active}
      className={computedClass}
      disabled={disabled}
      href={href}
      onClick={onClick}
      passive={passive}
      role={role}
      title={title}
      {...rest}
    >
      <CommonIcon icon={icon} />
      {children}
    </CommonButton>
  );
}

//  Props.
CommonBlockButton.propTypes = {
  active: PropTypes.bool,  //  `true` if the button is active
  children: PropTypes.node,
  className: PropTypes.string,
  data: PropTypes.any,  //  For non-link buttons, this will be passed to `onClick`
  disabled: PropTypes.bool,  //  Whether the button is disabled
  href: PropTypes.string,  //  Creates a button which is also a link
  icon: PropTypes.node,  //  The button icon; will be passed to `<CommonIcon>`
  onClick: PropTypes.func,  //  The function to call when clicking the button
  passive: PropTypes.bool,  //  `true` if clicking the button shouldn't affect focus
  role: PropTypes.string,  //  The ARIA role of the button, if not `'button'`
  title: PropTypes.string,  //  The button's label
};
