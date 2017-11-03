//  <CommonButton>
//  ==============

//  This is a simple button.  It may also be used to create links with
//  a button-like appearance or function.  There are a lot of props
//  to cover a vast number of use-cases, but each one is optional. That
//  said, you should always at least provide a `title` for the button.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Component imports.
import {
  CommonLink,
  CommonIcon,
} from 'themes/mastodon-go/components';

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

    //  State.
    this.state = { loaded: false };

    //  Function binding.
    const {
      handleClick,
      handleMouseDown,
    } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
    this.handleMouseDown = handleMouseDown.bind(this);
  }

  //  The `loaded` state property activates our animations. We wait
  //  until a change in activation value in order order to prevent
  //  unsightly animations when the component first mounts.
  componentWillReceiveProps (nextProps) {
    const { active } = this.props;

    //  The double "not"s here cast both arguments to booleans.
    if (!nextProps.active !== !active) {
      this.setState({ loaded: true });
    }
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
      animate,
      asText,
      children,
      className,
      disabled,
      href,
      icon,
      onClick,
      passive,
      proportional,
      role,
      showTitle,
      title,
      ...rest
    } = this.props;
    const { loaded } = this.state;
    const computedClass = classNames('MASTODON_GO--COMMON--BUTTON', {
      active: active,
      animated: animate && loaded,  //  see `componentWillReceiveProps()`
      disabled,
      link: href,  //  or if `role='link'`, see below
      passive,
      with_text: asText || children || title && showTitle,
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

      //  If `showTitle` is not specified and the button doesn't have
      //  children, then we label it using the `title` attribute.
      //  Otherwise, we use `aria-label`.
      if (title) {
        if (!showTitle && !children) {
          conditionalProps.title = title;
        } else {
          conditionalProps['aria-label'] = title;
        }
      }

      //  If we have an `onClick`, then we pass it along if the link
      //  isn't disabled.  If it is, we set `aria-disabled`.
      if (onClick) {
        if (!disabled) {
          conditionalProps.onClick = onClick;
        } else {
          conditionalProps['aria-disabled'] = true;
        }
      }

      //  Finally, if a `role` was specified, we pass it along.
      if (role) {
        conditionalProps.role = role;
      }

      //  This renders our link.
      return (
        <CommonLink
          className={computedClass}
          {...conditionalProps}
          {...rest}
        >
          <CommonIcon
            className='icon'
            icon={icon}
            proportional={proportional}
          />
          {children}
          {title && showTitle ? <span className='title'>{title}</span> : null}
        </CommonLink>
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

      //  This is the same as the title code for links (see above).
      if (title) {
        if (!showTitle && !children) {
          conditionalProps.title = title;
        } else {
          conditionalProps['aria-label'] = title;
        }
      }

      //  If our button is `passive`, we need to handle `onMouseDown`
      //  in addition to `onClick`.
      if (onClick && !disabled) {
        conditionalProps.onClick = handleClick;
        if (passive) {
          conditionalProps.onMouseDown = handleMouseDown;
        }
      }

      //  If we have a `role`, we pass it through.
      if (role) {
        conditionalProps.role = role;
      }

      //  Rendering the button.
      return (
        <button
          className={computedClass}
          {...conditionalProps}
          disabled={disabled}
          {...rest}
          tabIndex='0'
          type='button'
        >
          <CommonIcon
            className='icon'
            icon={icon}
          />
          {children}
          {title && showTitle ? <span className='title'>{title}</span> : null}
        </button>
      );
    }
  };

}

//  Props.
CommonButton.propTypes = {
  active: PropTypes.bool,  //  `true` if the button is active
  animate: PropTypes.bool,  //  `true` to animate (spin) the button
  asText: PropTypes.bool,  //  `true` if the button should be rendered as text regardless of contents
  children: PropTypes.node,
  className: PropTypes.string,
  data: PropTypes.any,  //  For non-link buttons, this will be passed to `onClick`.
  disabled: PropTypes.bool,  //  Whether the button is disabled
  href: PropTypes.string,  //  Creates a button which is also a link
  icon: PropTypes.node,  //  The button icon; will be passed to `<CommonIcon>`
  onClick: PropTypes.func,  //  The function to call when clicking the button
  passive: PropTypes.bool,  //  `true` if clicking the button shouldn't affect focus
  proportional: PropTypes.bool,  //  `true` if the button icon should be proportional (not fullwidth)
  role: PropTypes.string,  //  The ARIA role of the button, if not `'button'`.
  showTitle: PropTypes.bool,  //  `true` to render the `title` as visible text
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  The button's label
};
