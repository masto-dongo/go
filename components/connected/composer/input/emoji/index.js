//  <ConnectedComposerInputEmoji>
//  =============================

//  This provides an input area for emoji, including custom emoji.
//  Mostly it just displays a collection of
//  `<ConnectedComposerInputEmojiTable>`s.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import ConnectedComposerInputEmojiTable from './table';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedComposerInputEmoji extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);
  }

  //  Rendering.
  render () {
    const {
      autoplay,
      className,
      disabled,
      emojifier: { categories },
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--EMOJI', { disabled }, className);

    //  We just render all of our tables in order.
    return (
      <div
        className={computedClass}
        id='mastodon-go.connected.composer.input.emoji'
        role='tabpanel'
      >
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiCustom}
          disabled={disabled}
          emoji={categories.Custom}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiSmileys}
          disabled={disabled}
          emoji={categories['Smileys & People']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiAnimals}
          disabled={disabled}
          emoji={categories['Animals & Nature']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiFood}
          disabled={disabled}
          emoji={categories['Food & Drink']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiTravel}
          disabled={disabled}
          emoji={categories['Travel & Places']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiActivities}
          disabled={disabled}
          emoji={categories.Activities}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiObjects}
          disabled={disabled}
          emoji={categories.Objects}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiSymbols}
          disabled={disabled}
          emoji={categories.Symbols}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiFlags}
          disabled={disabled}
          emoji={categories.Flags}
        />
      </div>
    );
  }

}

//  Props.
ConnectedComposerInputEmoji.propTypes = {
  autoplay: PropTypes.bool,  //  `true` if animated emoji should be autoplayed
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is currently disabled
  emojifier: PropTypes.instanceOf(Emojifier),  //  The `Emojifier` which holds the emoji
  ℳ: PropTypes.func.isRequired,
};
