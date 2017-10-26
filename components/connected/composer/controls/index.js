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
    const { rehash } = this.props;

    //  State.
    this.state = { quickMode: false };

    //  Function binding.
    const {
      handleAlt,
      handleSubmit,
    } = Object.getPrototypeOf(this);
    this.handleAlt = handleAlt.bind(this);
    this.handlePreview = rehash.bind(this, '#preview');
    this.handleSubmit = handleSubmit.bind(this);
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

  handleSubmit (e) {
    const { onSubmit } = this.props;
    onSubmit();
  }

  render () {
    const { handlePreview } = this;
    const {
      activeRoute,
      attached,
      className,
      history,
      onSubmit,
      ℳ,
    } = this.props;
    const { quickMode } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--CONTROLS', className);
    const handleClick = quickMode ? onSubmit : handlePreview;

    return (
      <div className={computedClass}>
        <CommonButton
          destination={!quickMode && activeRoute ? '#preview' : null}
          history={history}
          icon={quickMode ? 'paper-plane' : 'paper-plane-o'}
          onClick={quickMode || !activeRoute ? handleClick : null}
          title={quickMode ? ℳ.quick : ℳ.preview}
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
  onSubmit: PropTypes.func,
  rehash: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
};

