//  <CommonLink>
//  ========

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/common/link

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
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class CommonLink extends React.PureComponent {

  //  Props.
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    role: PropTypes.string,
  };

  handleClick = (e) => {
    const { onClick } = this.props;
    if (!onClick || e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    onClick(e);
    e.preventDefault();
  }

  //  Rendering.
  render () {
    const { handleClick } = this;
    const {
      children,
      className,
      href,
      onClick,
      role,
      ...others
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COMMON--LINK', className, role);
    const conditionalProps = {};
    if (href) {
      conditionalProps.href = href;
      conditionalProps.onClick = handleClick;
    } else if (onClick) {
      conditionalProps.onClick = handleClick;
      conditionalProps.role = 'link';
      conditionalProps.tabIndex = 0;
    } else if (role) {
      conditionalProps.role = role;
    } else {
      conditionalProps.role = 'presentation';
    }

    return (
      <a
        className={computedClass}
        {...conditionalProps}
        {...others}
        rel='noopener'
        target='_blank'
      >{children}</a>
    );
  }

}
