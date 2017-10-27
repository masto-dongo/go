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

export default class ConnectedComposerInputEmoji extends React.PureComponent {

  constructor (props) {
    super(props);
    const { emojifier } = this.props;

    //  Variables.
    this.emoji = {
      'Smileys & People': emojifier.categories['Smileys & People'],
      'Animals & Nature': emojifier.categories['Animals & Nature'],
      'Food & Drink': emojifier.categories['Food & Drink'],
      'Travel & Places': emojifier.categories['Travel & Places'],
      Activities: emojifier.categories.Activities,
      Objects: emojifier.categories.Objects,
      Symbols: emojifier.categories.Symbols,
      Flags: emojifier.categories.Flags,
      Custom: emojifier.categories.Custom,
    };
  }

  render () {
    const { emoji } = this;
    const {
      autoplay,
      className,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--EMOJI', className);
    return (
      <div className={computedClass}>
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiCustom}
          emoji={emoji.Custom}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiSmileys}
          emoji={emoji['Smileys & People']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiAnimals}
          emoji={emoji['Animals & Nature']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiFood}
          emoji={emoji['Food & Drink']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiTravel}
          emoji={emoji['Travel & Places']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiActivities}
          emoji={emoji.Activities}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiObjects}
          emoji={emoji.Objects}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiSymbols}
          emoji={emoji.Symbols}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiFlags}
          emoji={emoji.Flags}
        />
      </div>
    );
  }

}

//  Props.
ConnectedComposerInputEmoji.propTypes = {
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  emojifier: PropTypes.instanceOf(Emojifier),
  ℳ: PropTypes.func.isRequired,
};
