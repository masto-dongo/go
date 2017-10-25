

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

export default class CommonInput extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),
    value: PropTypes.string,
  };
  input = null;

  handleChange = () => {
    const { input } = this;
    const { onChange } = this.props;
    if (input) {
      onChange(input.value);
    }
  }

  setRef = input => this.input = input;

  render () {
    const {
      handleChange,
      setRef,
    } = this;
    const {
      className,
      disabled,
      onChange,
      title,
      value,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COMMON--INPUT');

    return (
      <input
        className={computedClass}
        disabled={disabled}
        onChange={handleChange}
        placeholder={title}
        ref={setRef}
        title={title}
        type='text'
        value={value || ''}
        {...rest}
      />
    );
  }

}
