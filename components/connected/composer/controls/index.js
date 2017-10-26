//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  DOM imports.
import {
  DOMEventNavigate,
  DOMListen,
  DOMForget,
} from 'themes/mastodon-go/DOM';

//  Stylesheet imports.
import './style.scss';

export default class ConnectedComposerControls extends React.PureComponent {

  constructor (props) {
    super(props);
    const { rehash } = this.props;

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

  handleAlt (e) {
    if (e.altKey) {
      this.setState({ quickMode: true });
    } else {
      this.setState({ quickMode: false });
    }
  }

  handleClick (e) {
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
      onSubmit,
      ℳ,
    } = this.props;
    const { quickMode } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--CONTROLS', className);

    return (
      <div className={computedClass}>
        <CommonButton
          icon={quickMode ? 'paper-plane' : 'paper-plane-o'}
          onClick={handleClick}
          role={quickMode ? 'button' : 'link'}
          title={quickMode ? ℳ.quick : ℳ.preview}
          showTitle
        >{attached ? <span class='attached'>{attached}</span> : null}</CommonButton>
      </div>
    );
  }

}

ConnectedComposerControls.propTypes = {
  attached: PropTypes.number,
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  rehash: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
};

