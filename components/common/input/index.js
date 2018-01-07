//  <CommonInput>
//  =============

//  This component provides a simple text `<input>` element for
//  various text fields.  The provided `onChange()` function will be
//  called with the input's value.

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
export default class CommonInput extends React.PureComponent {

  //  The constructor.
  constructor (props) {
    super(props);

    //  Variables.
    this.node = null;

    //  Function binding.
    const {
      handleChange,
      handleRef,
    } = Object.getPrototypeOf(this);
    this.handleChange = handleChange.bind(this);
    this.handleRef = handleRef.bind(this);

  }

  //  Handles changes to the input.
  handleChange () {
    const { node } = this;
    const { onChange } = this.props;
    if (node) {
      onChange(node.value);
    }
  }

  //  Handles our input ref.
  handleRef (node) {
    this.node = node;
  }

  //  Rendering.
  render () {
    const {
      handleChange,
      handleRef,
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

    //  The result.
    return (
      <input
        className={computedClass}
        disabled={disabled}
        onChange={handleChange}
        placeholder={title}
        ref={handleRef}
        title={title}
        type='text'
        value={value || ''}
        {...rest}
      />
    );
  }

}

//  Props.
CommonInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  Whether the input is disabled
  onChange: PropTypes.func,  //  A function for receiving the input's value on change
  title: PropTypes.string,  //  The title and placeholder text for the input
  value: PropTypes.string,  //  The input's value
};
