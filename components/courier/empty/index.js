//  <TimelineEmptyMessage>
//  ==============

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/timeline/empty_message

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

const TimelineEmptyMessage = ({
    children,
    className,
    ...others
  }) => {
  const computedClass = classNames('glitch', 'glitch__timeline__empty-message', className);

  return children ? (
    <div className={computedClass} {...others}>
      {children}
    </div>
  ) : null;
}

TimelineEmptyMessage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default TimelineEmptyMessage;
