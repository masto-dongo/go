//  <ConnectedComposerInputAttach>
//  ==============================

//  This component provides the input menu for attachments.  Most of
//  the processing of these uploads actually happens in `<RoutedUI>`
//  and the redux store.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import {
  CommonButton,
  CommonIcon,
  ConnectedMedia,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedComposerInputAttach extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const { handleChange } = Object.getPrototypeOf(this);
    this.handleChange = handleChange.bind(this);
  }

  //  This function handles selected files and uploads them.
  handleChange ({ target }) {
    const { onUpload } = this.props;
    if (target.files.length) {
      onUpload(target.files.item(0));
      target.value = '';
    }
  }

  //  Rendering.
  render () {
    const { handleChange } = this;
    const {
      attachments,
      autoplay,
      className,
      disabled,
      formats,
      onRemove,
      onSensitive,
      sensitive,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--ATTACH', {
      disabled,
      empty: !attachments || !attachments.length,
    }, className);
    return (
      <div
        className={computedClass}
        id='mastodon-go.connected.composer.input.attach'
        role='tabpanel'
      >
        <label>
          <CommonIcon icon='camera' />
          {ℳ.uploadFile}
          <input
            accept={formats}
            disabled={disabled || attachments && attachments.length >= 4}
            onChange={handleChange}
            type='file'
          />
        </label>
        {attachments && attachments.length ? (
          <CommonButton
            active={sensitive}
            disabled={disabled}
            icon='eye-slash'
            onClick={onSensitive}
            passive
            showTitle
            title={ℳ.markSensitive}
          />
        ) : null}
        {attachments ? attachments.map(
          attachment => (
            <ConnectedMedia
              id={id}
              key={id}
            />
          )
        ) : null}
      </div>
    );
  }

}

//  Props.
ConnectedComposerInputAttach.propTypes = {
  attachments: PropTypes.array,  //  An array of media attachments
  autoplay: PropTypes.bool,  //  `true` if attachments should be autoplayed
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is disabled
  formats: PropTypes.string,  //  A comma-separated list of acceptable media types
  onRemove: PropTypes.func,  //  A function to call when removing an attachment
  onSensitive: PropTypes.func,  //  A function to call when toggling sensitivity
  onUpload: PropTypes.func,  //  A function to call on media upload
  sensitive: PropTypes.bool,  //  `true` if the attachments are marked as sensitive
  ℳ: PropTypes.func.isRequired,
};
