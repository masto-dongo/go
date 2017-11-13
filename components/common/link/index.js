//  <CommonLink>
//  ============

//  An exceedingly simple component for rendering links.  You should
//  use the `onClick` prop to pass routing functions to links which
//  point to another area of the frontend.

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

//  Component definition.
export default class CommonLink extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const { handleClick } = Object.getPrototypeOf(this);
    this.handleClick = handleClick.bind(this);
  }

  //  We don't handle clicks that are made with modifiers, since these
  //  often have special browser meanings (eg, "open in new tab").
  handleClick (e) {
    const { onClick } = this.props;
    if (!onClick || e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
      return;
    }
    onClick(e);
    e.preventDefault();  //  Prevents following of the link
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
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COMMON--LINK', className, role);

    //  We assume that our `onClick` is a routing function and give it
    //  the qualities of a link even if no `href` is provided. However,
    //  if we have neither an `onClick` or an `href`, our link is
    //  purely presentational.
    const conditionalProps = {};
    if (href) {
      conditionalProps.href = href;
      conditionalProps.onClick = handleClick;
    } else if (onClick) {
      conditionalProps.onClick = handleClick;
      conditionalProps.role = 'link';
      conditionalProps.tabIndex = 0;
    } else {
      conditionalProps.role = 'presentation';
    }

    //  If we were provided a `role` it overwrites any that we may have
    //  set above.
    if (role) {
      conditionalProps.role = role;
    }

    //  Rendering.  We set `rel='noopener'` for user privacy, and our
    //  `target` as `'_blank'`.
    return (
      <a
        className={computedClass}
        {...conditionalProps}
        rel='noopener'
        target='_blank'
        title={title}
        {...rest}
      >{children}</a>
    );
  }

}

//  Props.
CommonLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,  //  The link destination
  onClick: PropTypes.func,  //  A function to call instead of opening the link
  role: PropTypes.string,  //  An ARIA role for the link
  title: PropTypes.string,  //  A title for the link
};
