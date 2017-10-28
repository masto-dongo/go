//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  DOM imports.
import {
  DOMListen,
  DOMForget,
} from 'themes/mastodon-go/DOM';

//  Stylesheet imports.
import './style.scss';

export default class ConnectedComposerControls extends React.PureComponent {

  constructor (props) {
    super(props);

    //  State.
    this.state = { quickMode: false };

    //  Function binding.
    const {
      handleAlt,
      handleClick,
    } = Object.getPrototypeOf(this);
    this.handleAlt = handleAlt.bind(this);
    this.handleClick = handleClick.bind(this);
  }

  componentWillMount () {
    const { handleAlt } = this;
    DOMListen('mousemove', handleAlt);
    document.body.addEventListener('keydown', handleAlt, false);
    document.body.addEventListener('keyup', handleAlt, false);
  }

  componentWillUnmount () {
    const { handleAlt } = this;
    DOMForget('mousemove', handleAlt);
    document.body.removeEventListener('keydown', handleAlt, false);
    document.body.removeEventListener('keyup', handleAlt, false);
  }

  handleAlt ({ altKey }) {
    if (altKey) {
      this.setState({ quickMode: true });
    } else {
      this.setState({ quickMode: false });
    }
  }

  handleClick () {
    const {
      onSubmit,
      rehash,
    } = this.props;
    const { quickMode } = this.state;
    if (quickMode) {
      onSubmit();
    } else {
      rehash('#preview');
    }
  }

  render () {
    const { handleClick } = this;
    const {
      attached,
      className,
      disabled,
      local,
      spoiler,
      text,
      ℳ,
    } = this.props;
    const { quickMode } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--CONTROLS', { disabled }, className);

    const size = ((local ? text + ' 👁' : text) + (spoiler || '')).trim().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;

    return (
      <div className={computedClass}>
        <CommonButton
          disabled={disabled || !(text.trim() && size <= 500)}
          icon={quickMode ? 'paper-plane' : 'paper-plane-o'}
          onClick={handleClick}
          role={quickMode ? 'button' : 'link'}
          title={quickMode ? ℳ.quick : ℳ.preview}
          showTitle
        >
          {attached ? <span class='attached'>{attached}</span> : null}
          <span
            aria-hidden='true'
            className='filler'
            style={{ width: size > 500 ? '100%' : '' + (100 * size / 500) + '%' }}
          />
        </CommonButton>
      </div>
    );
  }

}

ConnectedComposerControls.propTypes = {
  attached: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  local: PropTypes.bool,
  onSubmit: PropTypes.func,
  rehash: PropTypes.func,
  spoiler: PropTypes.string,
  text: PropTypes.string.isRequired,
  ℳ: PropTypes.func.isRequired,
};

