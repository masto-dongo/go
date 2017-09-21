/*

`<Composer>`
==========================

>   For more information on the contents of this file, please contact:
>
>   - kibigo! [@kibi@glitch.social]

The `<Composer>` component renders the elements required for composing
new statuses. It is a replacement for upstream-Mastodon's
`<ComposeForm>`.

__Props:__

*/

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Imports:
--------

*/

//  Package imports
import classNames from 'classnames';
import { debounce } from 'lodash'
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { length } from 'stringz';

//  Our imports
import ComposerInput from './input';
import ComposerMeta from './meta';
import ComposerOptions from './options';
import ComposerReplyBox from './reply_box';
import ComposerSpoiler from './spoiler';
import ComposerTextArea from './text_area';
import ComposerUploader from './uploader';
import ComposerWarning from './warning';
import { text2HTML } from 'glitch/util/formatter';

//  Stylesheet imports
import './style';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *





const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What is on your mind?' },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Content warning' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Toot' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}!' },
});

@injectIntl
export default class Composer extends ImmutablePureComponent {

  static propTypes = {
    attachments : ImmutablePropTypes.list.isRequired,
    datetimes   : ImmutablePropTypes.map.isRequired,
    dispatches  : PropTypes.object.isRequired,
    disabled    : ImmutablePropTypes.map.isRequired,
    keys        : ImmutablePropTypes.map.isRequired,
    intl        : PropTypes.object.isRequired,
    options     : ImmutablePropTypes.map.isRequired,
    request     : PropTypes.map.isRequired,
    spoiler     : PropTypes.string.isRequired,
    value       : PropTypes.string.isRequired,
  };
  textArea = null;
  spoiler = null;
  node = null;

  shouldComponentUpdate (nextProps) {
    return nextProps.keys.get('idempotency') !== this.props.keys.get('idempotency');
  }

  setTextArea = c => this.textArea = c;
  setSpoiler = c => this.spoiler = c;

  render () {
    const {
      setSpoilerInput,
      setTextArea,
    } = this;
    const {
      attachments,
      disabled,
      dispatches,
      intl,
      spoiler,
      request,
      value,
    } = this.props;
    const maybeEye = options.getIn('advanced', 'do_not_federate') ? ' 👁️' : '';
    const text = [value, spoiler, maybeEye].join('');

    return (
      <div className='glitch composer'>
        <ComposerWarning
        />
        <ComposerSpoiler
          disabled={disabled.get('spoiler')}
          placeholder={intl.formatMessage(messages.spoiler_placeholder)}
          value={spoiler}
          onChange={dispatches.changeSpoiler}
          ref={setSpoiler}
        />
        <ComposerReplyBox
          onCancel={dispatches.cancelReply}
        />
        <ComposerTextArea
          ref={setTextArea}
          placeholder={intl.formatMessage(messages.placeholder)}
          disabled={request.get('is_submitting')}
          value={text2HTML(value)}
          onChange={dispatches.changeValue}
          onSubmit={dispatches.submit}
        />
        <ComposerInput
          attachments={attachments}
          onRemove={dispatches.remove}
        />
        <ComposerControls
          attachments={attachments}
          value={value}
          onUpload={dispatches.upload}
          onSubmit={dispatches.submit}
        />
        <ComposerOptions
          disabled={disabled.get('options')}
          onChange={dispatches.changeOptions}
        />
      </div>
    );
  }

}
