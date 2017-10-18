//  `<DrawerComposer>`
//  ==================

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Container imports.
import {
  AccountContainer,
  StatusContainer,
} from 'themes/mastodon-go/components';

//  Component imports.
import DrawerComposerControls from './controls';
import DrawerComposerInput from './input';
import DrawerComposerTextArea from './text_area';

import { CommonInput } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { Emoji } from 'themes/mastodon-go/util/emojify';

export default class DrawerComposer extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)).isRequired,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    inReplyTo: PropTypes.string,
    isSubmitting: PropTypes.bool,
    me: PropTypes.string,
    media: PropTypes.array,
    onClear: PropTypes.func,
    onMediaRemove: PropTypes.func,
    onSensitive: PropTypes.func,
    onSetHash: PropTypes.func,
    onSpoiler: PropTypes.func,
    onSubmit: PropTypes.func,
    onText: PropTypes.func,
    onUpload: PropTypes.func,
    sensitive: PropTypes.bool,
    spoiler: PropTypes.string,
    text: PropTypes.string.isRequired,
    visibility: PropTypes.number,
  };
  textArea = null;
  node = null;

  render () {
    const {
      activeRoute,
      className,
      disabled,
      emoji,
      history,
      intl,
      inReplyTo,
      isSubmitting,
      me,
      media,
      onClear,
      onMediaRemove,
      onSensitive,
      onSetHash,
      onSpoiler,
      onSubmit,
      onText,
      onUpload,
      sensitive,
      spoiler,
      text,
      visibility,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--DRAWER--COMPOSER', className);

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <AccountContainer
          history={history}
          id={me}
          small
        />
        <CommonInput
          disabled={isSubmitting}
          onChange={onSpoiler}
          value={spoiler}
        />
        <StatusContainer
          id={inReplyTo}
          small
        />
        <DrawerComposerTextArea
          disabled={isSubmitting}
          emoji={emoji}
          intl={intl}
          onChange={onText}
          value={text}
        />
        <DrawerComposerInput
          attachments={media}
          intl={intl}
          sensitive={sensitive}
          onRemove={onMediaRemove}
          onSensitive={onSensitive}
          onUpload={onUpload}
        />
        <DrawerComposerControls
          onSubmit={onSubmit}
          value={text}
          visibility={visibility}
        />
      </div>
    );
  }

}
