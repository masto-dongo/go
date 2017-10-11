//  <CommonLoadbar>
//  ===============

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
import './style';

//  * * * * * * *  //

//  The component
//  -------------

const CommonLoadbar = ({
  backgroundImage,
  className,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--COMMON--LOADBAR', className);
  return (
    <div
      className={computedClass}
      style={backgroundImage ? { backgroundImage } : {}}
      {...rest}
    >{children}</div>
  );
}

//  Props.
CommonLoadbar.propTypes = {
  backgroundImage: PropTypes.string,
  className: PropTypes.string,
};

//  Export.
export default CommonLoadbar;
