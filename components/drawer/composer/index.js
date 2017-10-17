//  `<DrawerComposer>`
//  ==================

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Container imports.
import { AccountContainer } from 'themes/mastodon-go/components';

//  Component imports.
import ComposerControls from './input';
import ComposerInput from './input';
import ComposerOptions from './options';
import ComposerReplyBox from './reply_box';
import ComposerSpoiler from './spoiler';
import ComposerTextArea from './text_area';
import ComposerWarning from './warning';

//  Stylesheet imports.
import './style';

//  Other imports.
import uuid from 'themes/mastodon-go/util/uuid';

const messages = defineMessages({
  placeholder: {
    defaultMessage: 'What is on your mind?',
    id: 'drawer.placeholder',
  },
  spoiler: {
    defaultMessage: 'Content warning',
    id: 'drawer.spoiler_placeholder',
  },
  publish: {
    defaultMessage: 'Toot',
    id: 'drawer.publish',
  },
  loudPublish: {
    defaultMessage: '{publish}!',
    id: 'drawer.publish_loud',
  },
});

export default class DrawerComposer extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    defaultVisibility: PropTypes.number,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool,
    me: PropTypes.string,
    onUpload: PropTypes.func,
    onSubmit: PropTypes.func,
  };
  state = {
    idempotency: uuid(),
    inReplyTo: null,
    local: false,
    media: [],
    sensitive: false,
    spoiler: '',
    spoilable: false,
    text: '\n',
    visibility: this.props.defaultVisibility,
  };
  textArea = null;
  spoiler = null;
  node = null;

  handleMediaRemove = id => {
    const { media } = this.state;
    this.setState({
      idempotency: uuid(),
      media: media.filter(
        mediaId => mediaId !== id
      ),
    });
  };
  handleClear = () => {
    this.setState({
      idempotency: uuid(),
      inReplyTo: null,
      local: false,
      media: [],
      sensitive: false,
      spoiler: '',
      spoilable: false,
      text: '\n',
      visibility: this.props.defaultVisibility,
    });
  };
  handleSpoiler = spoiler => {
    const { spoilable } = this.state;
    if (spoilable) {
      this.setState({
        idempotency: uuid(),
        spoiler,
      });
    }
  };
  handleSubmit = () => {
    const { onSubmit } = this.props;
    const {
      idempotency,
      inReplyTo,
      local,
      media,
      sensitive,
      spoiler,
      text,
      visibility,
    } = this.state;
    if (onSubmit) {
      onSubmit(text, {
        idempotency,
        inReplyTo,
        local,
        media,
        sensitive,
        spoiler,
        visibility,  //  TK: Handle this enum properly in the redux
      });
    }
  };
  handleText = text => {
    this.setState({
      idempotency: uuid(),
      text,
    });
  };

  handleLocalChange = value => {
    const { local } = this.state;
    this.setState({
      idempotency: uuid(),
      local: value === void 0 ? !local : !!value,
    });
  };
  handleSensitiveChange = value => {
    const { sensitive } = this.state;
    this.setState({
      idempotency: uuid(),
      sensitive: value === void 0 ? !sensitive : !!value,
    });
  };
  handleSpoilableChange = value => {
    const { spoilable } = this.state;
    this.setState({ spoilable: value === void 0 ? !spoilable : !!value });
  };
  handleVisibilityChange = value => {
    this.setState({
      idempotency: uuid(),
      visibility: value,
    });
  };

  render () {
    const {
      handleClear,
      handleLocalChange,
      handleMediaRemove,
      handleSensitiveChange,
      handleSpoiler,
      handleSpoilableChange,
      handleSubmit,
      handleText,
      handleVisibilityChange,
    } = this;
    const {
      className,
      defaultVisibility,
      disabled,
      intl,
      isSubmitting,
      me,
      onUpload,
      onSubmit,
      ...rest
    } = this.props;
    const {
      inReplyTo,
      local,
      media,
      sensitive,
      spoiler,
      spoilable,
      text,
      visibility,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--COMPOSER', className);

    const text2HTML = text => '<p>' + text.split('\n\n').join('</p><p>').split('\n').join('<br>') + '</p>';

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <AccountContainer
          id={me}
          small
        />
        <ComposerWarning />
        <ComposerSpoiler
          disabled={!spoilable}
          placeholder={intl.formatMessage(messages.spoiler)}
          value={spoiler}
          onChange={handleSpoiler}
        />
        <ComposerReplyBox
          inReplyTo={inReplyTo}
          onCancel={handleClear}
        />
        <ComposerTextArea
          disabled={isSubmitting}
          innerHTML={text2HTML(text)}
          onChange={handleText}
          onSubmit={handleSubmit}
          placeholder={intl.formatMessage(messages.placeholder)}
        />
        <ComposerInput
          attachments={media}
          onRemove={handleMediaRemove}
        />
        <ComposerControls
          attachments={media}
          local={local}
          onUpload={onUpload}
          onSubmit={handleSubmit}
          sensitive={sensitive}
          value={text}
        />
        <ComposerOptions
          onLocalChange={handleLocalChange}
          onSensitiveChange={handleSensitiveChange}
          onSpoilableChange={handleSpoilableChange}
          onVisibilityChange={handleVisibilityChange}
          visibility={visibility}
        />
      </div>
    );
  }

}
