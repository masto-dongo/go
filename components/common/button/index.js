//  <CommonButton>
//  ========

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/common/button

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Our imports.
import CommonLink from 'themes/mastodon-go/components/common/link';
import CommonIcon from 'themes/mastodon-go/components/common/icon';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class CommonButton extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    animate: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    icon: PropTypes.string,
    iconColour: PropTypes.string,
    onClick: PropTypes.func,
    proportional: PropTypes.bool,
    role: PropTypes.string,
    showTitle: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),
  }
  state = {
    loaded: false,
  }

  //  The `loaded` state property activates our animations. We wait
  //  until an activation change in order to prevent unsightly
  //  animations when the component first mounts.
  componentWillReceiveProps (nextProps) {
    const { active } = this.props;

    //  The double "not"s here cast both arguments to booleans.
    if (!nextProps.active !== !active) this.setState({ loaded: true });
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    if (!onClick || e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    onClick(e);
    e.preventDefault();
  }

  //  Rendering the component.
  render () {
    const { handleClick } = this;
    const {
      active,
      animate,
      children,
      className,
      disabled,
      href,
      icon,
      iconColour,
      onClick,
      proportional,
      role,
      showTitle,
      title,
      ...rest
    } = this.props;
    const { loaded } = this.state;
    const computedClass = classNames('MASTODON_GO--COMMON--BUTTON', {
      active: active,
      animated: animate && loaded,
      disabled,
      link: href,
      with_text: children || title && showTitle,
    }, !href || role !== 'link' ? role : null, className);
    let conditionalProps = {};

    //  If href or destination is provided, we render a link.
    if (href || role === 'link') {
      if (!disabled) {
        conditionalProps.href = href;
      }
      if (title) {
        if (!showTitle && !children) {
          conditionalProps.title = title;
        } else {
          conditionalProps['aria-label'] = title;
        }
      }
      if (onClick) {
        if (!disabled) {
          conditionalProps.onClick = onClick;
        } else {
          conditionalProps['aria-disabled'] = true;
        }
      }
      if (role) {
        conditionalProps.role = role;
      }
      return (
        <CommonLink
          className={computedClass}
          {...conditionalProps}
          {...rest}
        >
          <CommonIcon
            className='icon'
            colour={iconColour}
            name={icon}
            proportional={proportional}
          />
          {children}
          {title && showTitle ? <span className='title'>{title}</span> : null}
        </CommonLink>
      );

    //  Otherwise, we render a button.
    } else {
      if (role === 'tab' && typeof active !== 'undefined') {
        conditionalProps['aria-selected'] = active;
      } else if (typeof active !== 'undefined') {
        conditionalProps['aria-pressed'] = active;
      }
      if (title && !showTitle) {
        if (!children) {
          conditionalProps.title = title;
        } else {
          conditionalProps['aria-label'] = title;
        }
      }
      if (onClick && !disabled) {
        conditionalProps.onClick = handleClick;
      }
      if (role) {
        conditionalProps.role = role;
      }
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
            colour={iconColour}
            name={icon}
          />
          {children}
          {title && showTitle ? <span className='title'>{title}</span> : null}
        </button>
      );
    }
  };

}
