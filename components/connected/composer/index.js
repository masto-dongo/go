//  <ConnectedComposer>
//  ===================

//  This component provides the composer used in the drawer to write
//  statuses.  The composer state is hoisted, residing in `<RoutedUI>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonInput,
  ConnectedAccount,
  ConnectedStatus,
} from 'flavours/go/components';
import ConnectedComposerControls from './controls';
import ConnectedComposerInput from './input';
import ConnectedComposerTextArea from './text_area';

//  Lib imports.
import connect from 'flavours/go/lib/connect';
import {
  Emojifier,
  VISIBILITY,
} from 'flavours/go/lib/tootledge';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Composer extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);
    const { '🏪': {
      customEmoji,
      globalEmoji,
    } } = this.props;

    //  Variables.
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

  //  Rendering.
  render () {
    const {
      emoji,
      emojifier,
    } = this;
    const {
      className,
      disabled,
      inReplyTo,
      media,
      onMediaRemove,
      onSensitive,
      onSpoiler,
      onSubmit,
      onText,
      onUpload,
      onVisibility,
      sensitive,
      spoiler,
      text,
      visibility,
      ℳ,
      '🏪': {
        autoplay,
        me,
        mediaFormats,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER', { disabled }, className);

    //  We're mostly just passing props down to our various
    //  subcomponents, here.
    return (
      <div className={computedClass}>
        <ConnectedAccount
          id={me}
          navigable
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
          autoplay={autoplay}
          disabled={disabled}
          emoji={emoji}
          onChange={onText}
          value={text}
          ℳ={ℳ}
        />
        <ConnectedComposerInput
          attachments={media}
          autoplay={autoplay}
          disabled={disabled}
          emojifier={emojifier}
          formats={mediaFormats.join(',')}
          onRemove={onMediaRemove}
          onSensitive={onSensitive}
          onUpload={onUpload}
          sensitive={sensitive}
          ℳ={ℳ}
        />
        <ConnectedComposerControls
          attached={media.length}
          disabled={disabled}
          local={!(visibility & VISIBILITY.FEDERATED)}
          onSubmit={onSubmit}
          rehash={rehash}
          spoiler={spoiler}
          text={text}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  Props.
Composer.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is disabled.
  inReplyTo: PropTypes.string,  //  The id of status that the composer is replying to
  media: PropTypes.array,  //  An array of attached media for the composer
  onMediaRemove: PropTypes.func,  //  A function to call when removing media
  onSensitive: PropTypes.func,  //  A function to call when toggling sensitivity
  onSpoiler: PropTypes.func,  //  A function to call when setting the spoiler
  onSubmit: PropTypes.func,  //  A function to call to submit the status
  onText: PropTypes.func,  //  A function to call when changing the composer contents
  onUpload: PropTypes.func,  //  A function to call when uploading media
  onVisibility: PropTypes.func,  //  A function to call changing status visibility
  sensitive: PropTypes.bool,  //  `true` if the status contains sensitive media
  spoiler: PropTypes.string,  //  The spoiler's value
  text: PropTypes.string.isRequired,  //  The value of the composer contents
  visibility: PropTypes.number,  //  The visibility of the status being composed
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    autoplay: PropTypes.bool,  //  Whether to autoplay animations
    customEmoji: ImmutablePropTypes.list,  //  A list of custom emoji
    globalEmoji: ImmutablePropTypes.list,  //  A list of global emoji
    me: PropTypes.string,  //  The current user's id
    mediaFormats: ImmutablePropTypes.list,  //  A list of acceptable media formats
  }).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedComposer = connect(

  //  Component.
  Composer,

  //  Store.
  createStructuredSelector({
    autoplay: state => state.getIn(['meta', 'autoplay']),
    customEmoji: state => state.getIn(['emoji', 'custom']),
    globalEmoji: state => state.getIn(['emoji', 'global']),
    me: state => state.getIn(['meta', 'me']),
    mediaFormats: state => state.getIn(['meta', 'mediaFormats']),
  }),

  //  Messages.
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
    markSensitive: {
      defaultMessage: 'Mark as sensitive',
      description: 'Label used for sensitivity toggle button',
      id: 'composer.mark_sensitive',
    },
    postMode: {
      defaultMessage: 'Posting mode',
      description: 'Used to label the slow posting mode',
      id: 'composer.post_mode',
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
    quickMode: {
      defaultMessage: 'Quick mode',
      description: 'Used to label the quick posting mode',
      id: 'composer.quick_mode',
    },
    removeMedia: {
      defaultMessage: 'Remove media',
      description: 'Label used for the remove media button',
      id: 'composer.remove_media',
    },
    slowMode: {
      defaultMessage: 'Preview mode',
      description: 'Used to label the slow posting mode',
      id: 'composer.slow_mode',
    },
    spoiler: {
      defaultMessage: 'Subject…',
      description: 'Used as the placeholder for a spoiler',
      id: 'composer.spoiler',
    },
    uploadFile: {
      defaultMessage: 'Upload file',
      description: 'Used as the label for the file input',
      id: 'composer.upload_file',
    },
  }),
);

//  Exporting.
export { ConnectedComposer as default };
