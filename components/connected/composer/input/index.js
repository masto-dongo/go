//  Package imports
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports
import ConnectedComposerInputMenu from './menu';
import ConnectedComposerInputEmoji from './emoji';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  Stylesheet imports
import './style.scss';

export default class ConnectedComposerInput extends React.PureComponent {

  constructor (props) {
    super(props);

    //  State.
    this.state = { currentTab: 0 };

    //  Function binding.
    const { handleTab } = Object.getPrototypeOf(this);
    this.handleTab = handleTab.bind(this);
  }

  handleTab (index) {
    this.setState({ currentTab: index });
  }

  render () {
    const { handleTab } = this;
    const {
      autoplay,
      attachments,
      className,
      emojifier,
      onRemove,
      onSensitive,
      onUpload,
      ℳ,
    } = this.props;
    const { currentTab } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT', { closed: !currentTab }, className);

    return (
      <div className={computedClass}>
        {function () {
          switch (currentTab) {
          case 2:
            return (
              <ConnectedComposerInputEmoji
                autoplay={autoplay}
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

ConnectedComposerInput.propTypes = {
  autoplay: PropTypes.bool,
  attachments: PropTypes.array,
  className: PropTypes.string,
  emojifier: PropTypes.instanceOf(Emojifier),
  onRemove: PropTypes.func,
  onSensitive: PropTypes.func,
  onUpload: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
};
