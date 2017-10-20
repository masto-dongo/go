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
import './style';

export default class ConnectedComposerControls extends React.PureComponent {

  constructor (props) {
    super(props);

    //  State.
    this.state = { quickMode: false };

    //  Function binding.
    const {
      handleEvent,
      handlePreview,
    } = Object.getPrototypeOf(this);
    this.handleEvent = handleEvent.bind(this);
    this.handlePreview = handlePreview.bind(this);
  }

  componentWillMount () {
    const { handleEvent } = this;
    DOMListen('mousemove', handleEvent);
    document.body.addEventListenr('keydown', handleEvent, false);
    document.body.addEventListenr('keyup', handleEvent, false);
  }

  componentWillUnmount () {
    const { handleEvent } = this;
    DOMForget('mousemove', handleEvent);
    document.body.removeEventListener('keydown', handleEvent, false);
    document.body.removeEventListener('keyup', handleEvent, false);
  }

  handleEvent (e) {
    if (e.shiftKey) {
      this.setState({ quickMode: true });
    } else {
      this.setState({ quickMode: false });
    }
  }

  handlePreview () {
    const { rehash } = this.props;
    if (rehash) {
      rehash('#preview');
    }
  }

  render () {
    const { handlePreview } = this;
    const {
      activeRoute,
      attached,
      className,
      history,
      rehash,
      onSubmit,
      ℳ,
      ...rest
    } = this.props;
    const { quickMode } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--CONTROLS', className);

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <CommonButton
          onClick={quickMode ? onSubmit : handlePreview}
          icon={quickMode ? 'paper-plane' : 'paper-plane-o'}
          title={quickMode ? ℳ.quick : ℳ.publish}
          showTitle
        >{attached ? <span class='attached'>{attached}</span> : null}</CommonButton>
      </div>
    );
  }

}

ConnectedComposerControls.propTypes = {
  activeRoute: PropTypes.bool,
  attached: PropTypes.number,
  className: PropTypes.string,
  history: PropTypes.object,
  onSetHash: PropTypes.func,
  onSubmit: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
};

