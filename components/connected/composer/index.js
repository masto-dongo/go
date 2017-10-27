//  `<DrawerComposer>`
//  ==================

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Container imports.
import {
  CommonInput,
  ConnectedAccount,
  ConnectedStatus,
} from 'themes/mastodon-go/components';
import ConnectedComposerControls from './controls';
import ConnectedComposerInput from './input';
import ConnectedComposerTextArea from './text_area';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { Emojifier } from 'themes/mastodon-go/util/emojify';

class Composer extends React.PureComponent {

  constructor (props) {
    super(props);

    const { '🏪': {
      customEmoji,
      globalEmoji,
    } } = this.props;
    const emoji = this.emoji = function () {
      const emojos = [];
      if (globalEmoji) {
        emojos.push(globalEmoji.toJS());
      }
      if (customEmoji) {
        emojos.push(customEmoji.toJS());
      }
      return Array.prototype.concat.apply([], emojos);
    }();
    this.emojifier = new Emojifier(emoji);
  }

  render () {
    const {
      emoji,
      emojifier,
    } = this;
    const {
      className,
      inReplyTo,
      media,
      onMediaRemove,
      onSensitive,
      onSpoiler,
      onSubmit,
      onText,
      onUpload,
      rehash,
      sensitive,
      spoiler,
      text,
      ℳ,
      '🏪': { me },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER', className);

    const disabled = false;  //  TK

    return (
      <div className={computedClass}>
        <ConnectedAccount
          id={me}
          small
        />
        <CommonInput
          disabled={disabled}
          onChange={onSpoiler}
          title={ℳ.spoiler}
          value={spoiler}
        />
        <ConnectedStatus
          id={inReplyTo}
          small
        />
        <ConnectedComposerTextArea
          disabled={disabled}
          emoji={emoji}
          onChange={onText}
          value={text}
          ℳ={ℳ}
        />
        <ConnectedComposerInput
          attachments={media}
          emojifier={emojifier}
          onRemove={onMediaRemove}
          onSensitive={onSensitive}
          onUpload={onUpload}
          sensitive={sensitive}
          ℳ={ℳ}
        />
        <ConnectedComposerControls
          attached={media.length}
          onSubmit={onSubmit}
          rehash={rehash}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  Props.
Composer.propTypes = {
  className: PropTypes.string,
  inReplyTo: PropTypes.string,
  media: PropTypes.array,
  onMediaRemove: PropTypes.func,
  onSensitive: PropTypes.func,
  onSpoiler: PropTypes.func,
  onSubmit: PropTypes.func,
  onText: PropTypes.func,
  onUpload: PropTypes.func,
  onVisibility: PropTypes.func,
  rehash: PropTypes.func,
  sensitive: PropTypes.bool,
  spoiler: PropTypes.string,
  text: PropTypes.string.isRequired,
  visibility: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    autoplay: PropTypes.bool,
    customEmoji: ImmutablePropTypes.list,
    globalEmoji: ImmutablePropTypes.list,
    me: PropTypes.string,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedComposer = connect(

  //  Component
  Composer,

  //  Store
  createStructuredSelector({
    autoplay: state => state.get(['meta', 'autoplay']),
    customEmoji: state => state.get(['emoji', 'custom']),
    globalEmoji: state => state.get(['emoji', 'global']),
    me: state => state.getIn(['meta', 'me']),
  }),

  //  Messages
  defineMessages({
    attach: {
      defaultMessage: 'Upload media',
      description: 'Used to label the media input button',
      id: 'composer.attach',
    },
    close: {
      defaultMessage: 'Close',
      description: 'Used to label the close button on the composer input section',
      id: 'composer.close',
    },
    emoji: {
      defaultMessage: 'Insert emoji',
      description: 'Used to label the emoji input button',
      id: 'composer.emoji',
    },
    emojiActivities: {
      defaultMessage: 'Activities',
      description: 'Used to label the Activities field in the emoji input',
      id: 'composer.emoji_activities',
    },
    emojiAnimals: {
      defaultMessage: 'Animals',
      description: 'Used to label the Animals field in the emoji input',
      id: 'composer.emoji_animals',
    },
    emojiCustom: {
      defaultMessage: 'Custom',
      description: 'Used to label the Custom field in the emoji input',
      id: 'composer.emoji_custom',
    },
    emojiFlags: {
      defaultMessage: 'Flags',
      description: 'Used to label the Flags field in the emoji input',
      id: 'composer.emoji_flags',
    },
    emojiFood: {
      defaultMessage: 'Food',
      description: 'Used to label the Food field in the emoji input',
      id: 'composer.emoji_food',
    },
    emojiObjects: {
      defaultMessage: 'Objects',
      description: 'Used to label the Objects field in the emoji input',
      id: 'composer.emoji_objects',
    },
    emojiSmileys: {
      defaultMessage: 'Smileys',
      description: 'Used to label the Smileys field in the emoji input',
      id: 'composer.emoji_smileys',
    },
    emojiSymbols: {
      defaultMessage: 'Symbols',
      description: 'Used to label the Symbols field in the emoji input',
      id: 'composer.emoji_symbols',
    },
    emojiTravel: {
      defaultMessage: 'Travel',
      description: 'Used to label the Travel field in the emoji input',
      id: 'composer.emoji_travel',
    },
    label: {
      defaultMessage: 'What\'s new?',
      description: 'Label used for the composer text area',
      id: 'composer.label',
    },
    preview: {
      defaultMessage: 'Preview',
      description: 'Used to label the toot preview button',
      id: 'composer.preview',
    },
    quick: {
      defaultMessage: 'Quick toot',
      description: 'Used to label the toot button when quick tooting',
      id: 'composer.quick',
    },
    spoiler: {
      defaultMessage: 'Subject…',
      description: 'Used as the placeholder for a spoiler',
      id: 'composer.spoiler',
    },
  }),
);

export { ConnectedComposer as default };
