import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const CommonInput = ({
  children,
  className,
  disabled,
  onChange,
  placeholder,
  value,
  ...rest
}) => {
  const computedClass = classNames('MASTODON_GO--COMMON--INPUT', {
    active,
    disabled,
  }, className);
  return (
    <label
      className={computedClass}
      {...rest}
    >
      {children}
    </label>
  );
};

CommonInput.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default CommonToggle;
