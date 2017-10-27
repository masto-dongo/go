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
  }

  render () {
    const {
      autoplay,
      className,
      emojifier: { categories },
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--EMOJI', className);
    return (
      <div className={computedClass}>
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiCustom}
          emoji={categories.Custom}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiSmileys}
          emoji={categories['Smileys & People']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiAnimals}
          emoji={categories['Animals & Nature']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiFood}
          emoji={categories['Food & Drink']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiTravel}
          emoji={categories['Travel & Places']}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiActivities}
          emoji={categories.Activities}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiObjects}
          emoji={categories.Objects}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiSymbols}
          emoji={categories.Symbols}
        />
        <ConnectedComposerInputEmojiTable
          autoplay={autoplay}
          caption={ℳ.emojiFlags}
          emoji={categories.Flags}
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
