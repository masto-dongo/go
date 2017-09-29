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

const CommonIcon = ({
  className,
  name,
  proportional,
  title,
  ...others
}) => name ? (
  <span
    className={classNames('MASTODON_GO--COMMON--ICON', className)}
    {...others}
  >
    <span
      aria-hidden
      className={`fa ${proportional ? '' : 'fa-fw'} fa-${name}`}
      {...(title ? { title } : {})}
    />
    {title ? (
      <span className='for-screenreader'>{title}</span>
    ) : null}
  </span>
) : null;

//  Props.
CommonIcon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  proportional: PropTypes.bool,
  title: PropTypes.string,
};

//  Export.
export default CommonIcon;
