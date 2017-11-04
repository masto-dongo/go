//  <CommonIcon>
//  ========

//  This is a very simple component for streamlining FontAwesome icons.
//  The passed `icon` should be the FontAwesome name (not including the
//  `'fa-'`).  If `proportional` isn't specified, the icon is assumed
//  to be fullwidth.

//  Alternatively, the passed `icon` can be a node, in which case
//  the node is used verbatim and FontAwesome is not employed.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CommonIcon ({
  className,
  icon,
  proportional,
  title,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--ICON', className);

  //  Naturally, we can only render an icon if we were given one.
  return icon ? (
    <span
      className={computedClass}
      {...rest}
    >
      {typeof icon === 'string' || icon instanceof String ? (
        <span
          aria-hidden
          className={`fa ${proportional ? '' : 'fa-fw'} fa-${icon}`}
          {...(title ? { title } : {})}
        />
      ) : icon}
      {
        //  If we have a `title`, we create a screenreader-only span
        //  of text containing it, which will be read in place of
        //  the above `<span>` (which is `aria-hidden`).
        title ? (
          <span className='for-screenreader'>{title}</span>
        ) : null
      }
    </span>
  ) : null;
}

//  Props.
CommonIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,  //  The name of the icon or a node to use instead
  proportional: PropTypes.bool,  //  `true` if the icon should be proportional rather than fullwidth
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  A screenreader-friendly title for the icon
};
