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

  handleSubmit () {
    const { onSubmit } = this.props;
    onSubmit();
  }

  render () {
    const { handleSubmit } = this;
    const {
      className,
      text,
      local,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--CONTROLS', className);

    const size = (local ? text + ' 👁' : text).trim().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;

    return (
      <div className={computedClass}>
        <CommonButton
          disabled={!!(size && size > 500)}
          icon={'paper-plane'}
          onClick={handleSubmit}
          title={ℳ.publish}
          showTitle
        />
      </div>
    );
  }

}

ConnectedPreviewControls.propTypes = {
  className: PropTypes.string,
  local: PropTypes.bool,
  onSubmit: PropTypes.func,
  rehash: PropTypes.func,
  text: PropTypes.string.isRequired,
  ℳ: PropTypes.func.isRequired,
};

