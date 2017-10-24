

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedComposerInputMenu extends React.PureComponent {

  constructor (props) {
    super(props);

    //  Function binding.
    const { onChange } = this.props;
    this.handleCloseClick = onChange.bind(this, 0);
    this.handleAttachClick = onChange.bind(this, 1);
    this.handleEmojiClick = onChange.bind(this, 2);
  }

  render () {
    const {
      handleAttachClick,
      handleCloseClick,
      handleEmojiClick,
    } = this;
    const {
      className,
      onChange,
      value,
      ℳ,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--MENU', className);
    return (
      <div
        className={computedClass}
        role='tablist'
        {...rest}
      >
        <CommonButton
          active={value === 0}
          icon='caret-square-o-up'
          onClick={handleCloseClick}
          title={ℳ.close}
        />
        <CommonButton
          active={value === 1}
          aria-controls='mastodon-go.connected.composer.input.attach'
          icon='paperclip'
          onClick={handleAttachClick}
          role='tab'
          title={ℳ.attach}
        />
        <CommonButton
          active={value === 2}
          aria-controls='mastodon-go.connected.composer.input.emoji'
          icon='meh-o'
          onClick={handleEmojiClick}
          role='tab'
          title={ℳ.emoji}
        />
      </div>
    );
  }

}

//  Props.
ConnectedComposerInputMenu.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
};
