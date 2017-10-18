

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

const messages = defineMessages({
  attach: {
    defaultMessage: 'Upload media',
    id: 'composer.attach',
  },
  emoji: {
    defaultMessage: 'Insert emoji',
    id: 'composer.emoji',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class DrawerComposerInputMenu extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    intl: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.number,
  };

  handleAttachClick = () => {
    const { onChange } = this.props;
    onChange(0);
  }
  handleEmojiClick = () => {
    const { onChange } = this.props;
    onChange(1);
  }

  render () {
    const {
      className,
      intl,
      onChange,
      value,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--COMMON--MENUBAR', className);
    return (
      <div
        className={computedClass}
        role='tablist'
        {...rest}
      >
        <CommonButton
          active={value === 0}
          aria-controls='mastodon-go.drawer.composer.input.attach'
          icon='paperclip'
          onClick={handleAttachClick}
          role='tab'
          title={intl.formatMessage(messages.attach)}
        />
        <CommonButton
          active={value === 1}
          aria-controls='mastodon-go.drawer.composer.input.emoji'
          icon='meh-o'
          onClick={handleEmojiClick}
          role='tab'
          title={intl.formatMessage(messages.emoji)}
        />
      </div>
    );
  }

}
