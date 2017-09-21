//  <ColumnSettings>
//  ================

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/column/settings

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Our imports.
import CommonButton from 'glitch/components/common/button';
import CommonExpandable from 'glitch/components/common/expandable';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

const ColumnSettings = ({
  children,
  className,
  expanded,
  ...others
}) => {
  const computedClass = classNames('glitch', 'glitch__column__settings', className);

  //  If we don't have anything to render, then we don't render
  //  anything lol.
  if (!children || children instanceof Array && !children.length) return null;

  //  Our settings are wrapped in a common expandable component.
  return (
    <CommonExpandable
      className={computedClass}
      expanded={expanded}
      focusable
      {...others}
    >
      {children}
    </CommonExpandable>
  );

};

ColumnSettings.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  expanded: PropTypes.bool,
}

export default ColumnSettings;
