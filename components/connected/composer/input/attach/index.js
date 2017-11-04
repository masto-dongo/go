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
    const {
      handleChange,
      handleSensitive,
    } = Object.getPrototypeOf(this);
    this.handleChange = handleChange.bind(this);
    this.handleSensitive = handleSensitive.bind(this);
  }

  //  This function handles selected files and uploads them.
  handleChange ({ target }) {
    const { onUpload } = this.props;
    if (onUpload && target.files.length) {
      onUpload(target.files.item(0));
      target.value = '';
    }
  }

  //  We need this function wrapper to appropriately ignore the event.
  handleSensitive () {
    const {
      sensitive,
      onSensitive,
    } = this.props;
    if (onSensitive) {
      onSensitive(!sensitive);
    }
  }

  //  Rendering.
  render () {
    const {
      handleChange,
      handleSensitive,
    } = this;
    const {
      attachments,
      className,
      disabled,
      formats,
      onRemove,
      onSensitive,
      sensitive,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--ATTACH', {
      disabled: disabled || attachments && attachments.length >= 4,
      empty: !attachments || !attachments.length,
    }, className);
    return (
      <div
        className={computedClass}
        id='mastodon-go.connected.composer.input.attach'
        role='tabpanel'
      >
        <span className='upload button'>
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
        </span>
        {attachments && attachments.length ? (
          //  We don't use a `<CommonButton>` to give us greater
          //  control over rendering.
          <span className='button'>
            <button
              className={sensitive ? 'active' : null}
              disabled={disabled}
              onClick={handleSensitive}
              type='button'
            >
              <CommonIcon icon='eye-slash' />
              {ℳ.markSensitive}
            </button>
          </span>
        ) : null}
        {attachments ? attachments.map(
          attachment => (
            <span
              className='attachment'
              key={attachment}
            >
              <ConnectedMedia
                id={attachment}
                targetWidth={200}
              />
              <CommonButton
                className='close'
                data={attachment}
                disabled={disabled}
                icon='times'
                onClick={onRemove}
                passive
              />
            </span>
          )
        ) : null}
      </div>
    );
  }

}

//  Props.
ConnectedComposerInputAttach.propTypes = {
  attachments: PropTypes.array,  //  An array of media attachments
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is disabled
  formats: PropTypes.string,  //  A comma-separated list of acceptable media types
  onRemove: PropTypes.func,  //  A function to call when removing an attachment
  onSensitive: PropTypes.func,  //  A function to call when toggling sensitivity
  onUpload: PropTypes.func,  //  A function to call on media upload
  sensitive: PropTypes.bool,  //  `true` if the attachments are marked as sensitive
  ℳ: PropTypes.func.isRequired,
};
