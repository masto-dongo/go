//  <ConnectedComposerInput>
//  ========================

//  This has nothing to do with `<CommonInput>`—it's for additional
//  input methods and attachments, like emoji.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import ConnectedComposerInputMenu from './menu';
import ConnectedComposerInputAttach from './attach';
import ConnectedComposerInputEmoji from './emoji';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedComposerInput extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = { currentTab: 0 };

    //  Function binding.
    const { handleTab } = Object.getPrototypeOf(this);
    this.handleTab = handleTab.bind(this);
  }

  //  This sets the current tab for the input area.
  handleTab (index) {
    this.setState({ currentTab: index });
  }

  //  Rendering.
  render () {
    const { handleTab } = this;
    const {
      attachments,
      autoplay,
      className,
      disabled,
      emojifier,
      formats,
      onRemove,
      onSensitive,
      onUpload,
      sensitive,
      ℳ,
    } = this.props;
    const { currentTab } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT', {
      closed: !currentTab,
      disabled,
    }, className);

    return (
      <div className={computedClass}>
        {function () {
          switch (currentTab) {
          case 1:
            return (
              <ConnectedComposerInputAttach
                attachments={attachments}
                disabled={disabled}
                formats={formats}
                onRemove={onRemove}
                onSensitive={onSensitive}
                onUpload={onUpload}
                sensitive={sensitive}
                ℳ={ℳ}
              />
            );
          case 2:
            return (
              <ConnectedComposerInputEmoji
                autoplay={autoplay}
                disabled={disabled}
                emojifier={emojifier}
                ℳ={ℳ}
              />
            );
          default:
            return null;
          }
        }()}
        <ConnectedComposerInputMenu
          onChange={handleTab}
          value={currentTab}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  Props.
ConnectedComposerInput.propTypes = {
  attachments: PropTypes.array,  //  An array of attachments
  autoplay: PropTypes.bool,  //  `true` if animated attachments should autoplay
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is currently disabled
  emojifier: PropTypes.instanceOf(Emojifier),  //  The `Emojifier` holding custom and global emoji
  formats: PropTypes.string,  //  A comma-separated list of media formats for upload
  onRemove: PropTypes.func,  //  A function to call when removing an attachment
  onSensitive: PropTypes.func,  //  A function to call when toggling sensitivity
  onUpload: PropTypes.func,  //  A function to call on media upload
  sensitive: PropTypes.bool,  //  `true` if the attachments are marked sensitive
  ℳ: PropTypes.func.isRequired,
};
