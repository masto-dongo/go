import classNames from 'classnames';
import PropTypes from 'prop-types';

import ProfileContainer from 'glitch/components/profile/container';

const TimelinePrepend = ({
  className,
  type,
}) => {
  const computedClass = classNames('glitch', 'glitch__timeline__prepend', className);
  switch (type[0]) {
  case 'account':
    return <ProfileContainer className={computedClass} id={type[1]} />;
  }
}

TimelinePrepend.propTypes = {
  className: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default TimelinePrepend;
