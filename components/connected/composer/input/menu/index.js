//  <ConnectedComposerInputMenu>
//  ============================

//  This component provides a list of tabs for selecting the currently
//  available input panel.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Common imports.
import { CommonIconButton } from 'flavours/go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedComposerInputMenu extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const { onChange } = this.props;
    this.handleCloseClick = onChange.bind(this, 0);
    this.handleAttachClick = onChange.bind(this, 1);
    this.handleEmojiClick = onChange.bind(this, 2);
  }

  //  Rendering.
  render () {
    const {
      handleAttachClick,
      handleCloseClick,
      handleEmojiClick,
    } = this;
    const {
      className,
      value,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--MENU', className);

    //  We just render our buttons in order.
    return (
      <div
        className={computedClass}
        role='tablist'
      >
        <CommonIconButton
          active={value === 0}
          icon='caret-square-o-up'
          onClick={handleCloseClick}
          title={ℳ.close}
        />
        <CommonIconButton
          active={value === 1}
          aria-controls='mastodon-go.connected.composer.input.attach'
          icon='paperclip'
          onClick={handleAttachClick}
          role='tab'
          title={ℳ.attach}
        />
        <CommonIconButton
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
  onChange: PropTypes.func,  //  A function to call to change the current tab
  value: PropTypes.number,  //  The index of the current tab
  ℳ: PropTypes.func.isRequired,
};
