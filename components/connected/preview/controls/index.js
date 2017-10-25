//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

export default class ConnectedPreviewControls extends React.PureComponent {

  constructor (props) {
    super(props);

    //  Function binding.
    const { handleSubmit } = Object.getPrototypeOf(this);
    this.handleSubmit = handleSubmit.bind(this);
  }

  handleSubmit (e) {
    const {
      activeRoute,
      onSubmit,
      rehash,
    } = this.props;
    onSubmit();
    if (!activeRoute) {
      rehash('#');
    }
  }

  render () {
    const { handleSubmit } = this;
    const {
      activeRoute,
      attached,
      className,
      history,
      onSubmit,
      rehash,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--CONTROLS', className);

    return (
      <div className={computedClass}>
        <CommonButton
          history={history}
          href={activeRoute ? '#' : null}
          icon={'paper-plane'}
          onClick={handleSubmit}
          title={ℳ.publish}
          showTitle
        />
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

