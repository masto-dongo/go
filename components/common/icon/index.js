//  <CommonIcon>
//  ========

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default function CommonIcon ({
  className,
  colour,
  name,
  proportional,
  title,
  ...others
}) {
  const computedClass = classNames('MASTODON_GO--COMMON--ICON', className);
  return name ? (
    <span
      className={computedClass}
      {...others}
    >
      <span
        aria-hidden
        className={`fa ${proportional ? '' : 'fa-fw'} fa-${name}`}
        style={colour ? { color: colour } : {}}
        {...(title ? { title } : {})}
      />
      {title ? (
        <span className='for-screenreader'>{title}</span>
      ) : null}
    </span>
  ) : null;
}

//  Props.
CommonIcon.propTypes = {
  className: PropTypes.string,
  colour: PropTypes.string,
  name: PropTypes.string,
  proportional: PropTypes.bool,
  title: PropTypes.string,
};
