//  <CommonButton>
//  ==============

//  This is a simple button.  It may also be used to create links with
//  a button-like appearance or function.  Generally, you won't want to
//  use this component directly, but rather use something which
//  contains it like `<CommonIconButton>` or `<CommonTextButton>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Component imports.
import { CommonLink } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CommonButton extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const {
      handleClick,
      handleMouseDown,
    } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
    this.handleMouseDown = handleMouseDown.bind(this);
  }

  //  We only handle clicks that aren't control- or meta-clicks—and of
  //  course, only if `onClick` is defined.  This `handleClick()`
  //  function is only used for "buttony" buttons—buttons which are
  //  links use the link click handling function, which is more
  //  restrictive.
  handleClick (e) {
    const {
      data,
      onClick,
      passive,
    } = this.props;
    if (!onClick || e.button || e.ctrlKey || e.metaKey) {
      return;
    }
    onClick(data);
    if (passive) {
      e.preventDefault();  //  Prevents focus
    }
  }

  //  On mouse down, browsers will automatically focus the button. We
  //  don't want this if our button is `passive`.
  handleMouseDown (e) {
    const { passive } = this.props;
    if (passive) {
      e.preventDefault();  //  Prevents focus for mouse clicks
    }
  }

  //  Rendering.
  render () {
    const {
      handleClick,
      handleMouseDown,
    } = this;
    const {
      active,
      children,
      className,
      disabled,
      href,
      onClick,
      passive,
      role,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COMMON--BUTTON', {
      active: active,
      disabled,
      link: href,  //  or if `role='link'`, see below
      passive,
    }, !href && role, className);
    let conditionalProps = {};

    //  If `href` is provided, we render a link.  We also do this, for
    //  obvious reasons, if our `role` is set to `'link'`.
    if (href || role === 'link') {

      //  We disable our link by simply not providing it with an
      //  `href`.  So we only set the `href` if `disabled` is
      //  `false`.
      if (!disabled) {
        conditionalProps.href = href;
      }

      //  If we have an `onClick`, then we pass it along if the link
      //  isn't disabled.  If it is, we set `aria-disabled`.
      if (onClick) {
        if (!disabled) {
          conditionalProps.onClick = onClick;
        } else {
          conditionalProps['aria-disabled'] = 'true';
        }
      }

      //  This renders our link.
      return (
        <CommonLink
          className={computedClass}
          role={role}
          title={title}
          {...conditionalProps}
          {...rest}
        >{children}</CommonLink>
      );

    //  Otherwise, we render a button.
    } else {

      //  As a special case, for `'tab'` buttons, we set `aria-selected`
      //  instead of `aria-pressed`.  These properties store our active
      //  state.
      if (role === 'tab' && typeof active !== 'undefined') {
        conditionalProps['aria-selected'] = active;
      } else if (typeof active !== 'undefined') {
        conditionalProps['aria-pressed'] = active;
      }

      //  If our button is `passive`, we need to handle `onMouseDown`
      //  in addition to `onClick`.
      if (onClick && !disabled) {
        conditionalProps.onClick = handleClick;
        if (passive) {
          conditionalProps.onMouseDown = handleMouseDown;
        }
      }

      //  Rendering the button.
      return (
        <button
          className={computedClass}
          disabled={disabled}
          role={role}
          tabIndex='0'
          title={title}
          type='button'
          {...conditionalProps}
          {...rest}
        >{children}</button>
      );
    }
  };

}

//  Props.
CommonButton.propTypes = {
  active: PropTypes.bool,  //  `true` if the button is active
  children: PropTypes.node,
  className: PropTypes.string,
  data: PropTypes.any,  //  For non-link buttons, this will be passed to `onClick`
  disabled: PropTypes.bool,  //  Whether the button is disabled
  href: PropTypes.string,  //  Creates a button which is also a link
  onClick: PropTypes.func,  //  The function to call when clicking the button
  passive: PropTypes.bool,  //  `true` if clicking the button shouldn't affect focus
  role: PropTypes.string,  //  The ARIA role of the button, if not `'button'`
  title: PropTypes.string,  //  The button's label
};
