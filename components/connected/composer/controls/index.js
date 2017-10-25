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
      handleCtrl,
      handleSubmit,
    } = Object.getPrototypeOf(this);
    this.handleCtrl = handleEvent.bind(this);
    this.handlePreview = rehash.bind(this, '#preview');
    this.handleSubmit = handleSubmit.bind(this);
  }

  componentWillMount () {
    const { handleCtrl } = this;
    DOMListen('mousemove', handleCtrl);
    document.body.addEventListener('keydown', handleCtrl, false);
    document.body.addEventListener('keyup', handleCtrl, false);
  }

  componentWillUnmount () {
    const { handleCtrl } = this;
    DOMForget('mousemove', handleCtrl);
    document.body.removeEventListener('keydown', handleCtrl, false);
    document.body.removeEventListener('keyup', handleCtrl, false);
  }

  handleCtrl (e) {
    if (e.ctrlKey) {
      this.setState({ quickMode: true });
    } else {
      this.setState({ quickMode: false });
    }
  }

  handleSubmit (e) {
    const { onSubmit } = this.props;
    onSubmit();
    e.preventDefault();  //  Important since this is a ctrl-click
  }

  render () {
    const { handlePreview } = this;
    const {
      activeRoute,
      attached,
      className,
      history,
      onSubmit,
      rehash,
      ℳ,
    } = this.props;
    const { quickMode } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--CONTROLS', className);
    const handleClick = quickMode ? onSubmit : handlePreview;

    return (
      <div className={computedClass}>
        <CommonButton
          history={history}
          href={!quickMode && activeRoute ? '#preview' : null}
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

