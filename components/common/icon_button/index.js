//  <CommonIconButton>
//  ==================

//  This is a simple icon which also functions as a button.

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
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CommonIconButton ({
  active,
  className,
  data,
  disabled,
  href,
  icon,
  onClick,
  passive,
  pending,
  role,
  title,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--ICON_BUTTON', { pending }, className);

  return (
    <CommonButton
      active={active}
      className={computedClass}
      disabled={disabled || pending}
      href={href}
      onClick={onClick}
      passive={passive}
      role={role}
      title={title}
      {...rest}
    ><CommonIcon icon={icon} /></CommonButton>
  );
}

//  Props.
CommonIconButton.propTypes = {
  active: PropTypes.bool,  //  `true` if the button is active
  className: PropTypes.string,
  data: PropTypes.any,  //  For non-link buttons, this will be passed to `onClick`
  disabled: PropTypes.bool,  //  Whether the button is disabled
  href: PropTypes.string,  //  Creates a button which is also a link
  icon: PropTypes.node,  //  The button icon; will be passed to `<CommonIcon>`
  onClick: PropTypes.func,  //  The function to call when clicking the button
  passive: PropTypes.bool,  //  `true` if clicking the button shouldn't affect focus
  pending: PropTypes.bool,  //  `true` if the button's action is currently pending
  role: PropTypes.string,  //  The ARIA role of the button, if not `'button'`
  title: PropTypes.string,  //  The button's label
};
